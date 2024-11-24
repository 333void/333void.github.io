/*
** UTILS
*/

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
    for (const nodes in this.data.append) {

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

/*
** RSS EDITOR
*/

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
    formRSS(doc);
    /*document.getElementById('form').addEventListener('submit', function (e) {
      e.preventDefault();
      formRSS(doc);
    });*/
  }
}

function formRSS(doc) {
  const now = new timeFormatter;

  // update build times
  doc.evaluate(
    "//channel/lastBuildDate",
    doc,
    null,
    XPathResult.ANY_UNORDERED_NODE_TYPE,
    null,
  ).singleNodeValue.textContent = now.rfc2822;

  doc.evaluate(
    "//channel/ttl",
    doc,
    null,
    XPathResult.ANY_UNORDERED_NODE_TYPE,
    null,
  ).singleNodeValue.textContent = now.timestamp;

  // find latest item
  const latestItem = doc.evaluate(
    "//channel/item[position() = 1]",
    doc,
    null,
    XPathResult.ANY_UNORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;

  // creating the new item entry
  function bRSSItem(doc) {
    return (
      new bElement(doc, {
        tag: 'item',
        append: [
          '\n\t',
          new bElement(doc, {
            tag: 'title',
            textContent: '1st test',
          }).set(),
          '\n\t',
          new bElement(doc, {
            tag: 'link',
            textContent: 'https://333void.github.io//blog/blogpost.html',
          }).set(),
          '\n\t',
          new bElement(doc, {
            tag: 'description',
            append: [
              new bCDATASection(doc, {
                string: '\n\n\t<p>help</p>\n\n\t',
              }).set()
            ],
          }).set(),
          '\n\t',
          new bElement(doc, {
            tag: 'pubDate',
            textContent: now.rfc2822,
          }).set(),
          '\n\t',
          new bElement(doc, {
            tag: 'guid',
            textContent: 'https://333void.github.io/',
          }).set(),
          '\n    '
        ],
      }).set()
    )
  }
  
  latestItem.parentElement.insertBefore(bRSSItem(doc), latestItem)
  latestItem.parentElement.insertBefore(new bTextNode(doc, {string: '\n\n    '}).set(), latestItem)

  exportRSS(doc);
}

function exportRSS(doc) {
  const serializer = new XMLSerializer();
  const xmlStr = serializer.serializeToString(doc);

  const file = new File([xmlStr], "index.xml", {type: "text/xml"});
  console.log(xmlStr)

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

  //saveBlob(file, 'index.xml');
}