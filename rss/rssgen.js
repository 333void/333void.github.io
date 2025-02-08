import { config } from "./rg.config.js";

/***
**** UTILS
***/

class bElement {
  constructor(doc, data) {
    this.data = data;
    this.node = doc.createElement(data.tag);
  }

  // add attributes to element
  set() {
    for (const atti in this.data.attributes) {
      this.node.setAttribute(atti, this.data.attributes[atti]);
    }
    if (this.data['textContent']) {
      this.node['textContent'] = this.data['textContent']
    }
    if (this.data.append) {
      for (const child of this.data.append) {
        this.node.append(child);
      }
    }
    return this.node;
  }
}

class bTextNode extends bElement {
  constructor(doc, data) {
    super(doc, data);
    this.node = doc.createTextNode(data.string);
  }
}

class bCDATASection extends bElement {
  constructor(doc, data) {
    super(doc, data);
    this.node = doc.createCDATASection(data.string);
  }
}

class timeFormatter {
  constructor() {
    this.time = new Date();
    this.offset = Math.floor(this.time.getTimezoneOffset()/60);
    this.fromGMT = Math.abs(this.offset);
    this.offsetDirection = this.offset > 0 ? '-' : '+';
    this.offset2Digits = this.offsetDirection + (this.fromGMT < 9 ? '0' : '') + this.fromGMT;
  }

  get year() {
    return this.time.getFullYear();
  }

  get month() {
    return this.time.getMonth();
  }

  get date() {
    return this.time.getDate();
  }

  get timestamp() {
    return Date.parse(this.time);
  }

  get atom() {
    return this.time.toISOString().split('.')[0] 
      + this.offset2Digits
      + ':00';
  }

  get rfc2822() {
    return this.time.toUTCString().split('GMT')[0] 
      + this.offset2Digits
      + '00'; 
  }
}

/***
**** RSS EDITOR
***/

var client = new XMLHttpRequest();
client.open('GET', 'index.xml');
client.onreadystatechange = function() {
  // readyState 4 is for complete response
  if (client.readyState === 4) {
    //console.log(client.responseText);
    parseRSS(client.responseText);
  }
}
client.send();

function parseRSS(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "application/xml");
  // print the name of the root element or error message
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    console.log("error while parsing");
  } else {
    // activate all buttons
    // enable submit button (saves item on parsed xml so it keeps adding new itemover and over??)
    document.getElementById('add').addEventListener('click', function (e) {
      e.preventDefault();
      const now = new timeFormatter;
      let item = {
        time: now,
        // how many minutes a feed should be cached in certain RSS aggregators before polling the original web server feed again (default set to 60 minutes)
        ttl: 60,
        link: config.site + '',
        title: document.getElementById('title').value,
        desc: formDesc(),
        guid: `${config.site}${config.subdir}/${now.year}/${now.month + 1}/${now.date}`
      }
      formRSS(doc, item, now);
    });
    document.getElementById('download').addEventListener('click', function (e) {
      exportRSS(doc);
    });
  }
}

function formDesc() {
  let otter = '';
  for (const element of document.getElementById('desc-con').querySelectorAll('textarea')) {
    otter += `<element.id>${element.value}</p>\n\t    `;
  }
  return otter
}

// create new RSS item element in DOM element form
function bRSSItem(doc, data) {
  return (
    new bElement(doc, {
      tag: 'item',
      append: [
        '\n\t',
        // title element, conditional operator to skip if textbox unfilled
        data.title ? new bElement(doc, {
          tag: 'title',
          textContent: data.title,
        }).set() : '',
        data.title ? '\n\t' : '',

        new bElement(doc, {
          tag: 'link',
          textContent: data.link,
        }).set(),
        '\n\t',

        new bElement(doc, {
          tag: 'description',
          append: [
            new bCDATASection(doc, {
              // four spaces for a half tab cuz \t is 8 spaces??? idk
              string: `\n\n\t    ${data.desc}\n\t`,
            }).set()
          ],
        }).set(),
        '\n\t',

        new bElement(doc, {
          tag: 'pubDate',
          textContent: data.time.rfc2822,
        }).set(),
        '\n\t',

        new bElement(doc, {
          tag: 'guid',
          textContent: data.guid,
        }).set(),
        '\n    '
      ],
    }).set()
  )
}

// update RSS file with new item and information
function formRSS(doc, item) {
  // update build times (must match the newest item)
  doc.evaluate(
    "//channel/lastBuildDate",
    doc,
    null,
    XPathResult.ANY_UNORDERED_NODE_TYPE,
    null,
  ).singleNodeValue.textContent = item.time.rfc2822;

  // the latest item in the rss file
  const latestItem = doc.evaluate(
    "//channel/item[position() = 1]",
    doc,
    null,
    XPathResult.ANY_UNORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;

  const latestItemGUID = doc.evaluate(
    "//channel/item[position() = 1]/guid",
    doc,
    null,
    XPathResult.ANY_UNORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;

  console.log(latestItemGUID.textContent.split('/'));
  
  // insert new item into rss list
  latestItem.parentElement.insertBefore(bRSSItem(doc, item), latestItem);
  latestItem.parentElement.insertBefore(new bTextNode(doc, {string: '\n\n    '}).set(), latestItem);

  console.log(enSerio(doc));
}

// turns DOM tree XML into a string
function enSerio(doc) {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}

// create updated RSS file and download
function exportRSS(doc) {
  const file = new File([enSerio(doc)], "index.xml", {type: "text/xml"});

  var saveBlob = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (blob, fileName) {
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
  }());

  saveBlob(file, 'index.xml');
}