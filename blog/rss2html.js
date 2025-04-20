import { config } from "./r2h.config.js";

/***
**** UTILS
***/

class ago {
  constructor(givenTime) {
    this.date = new Date(givenTime);
    this.now = new Date();
    this.diff = this.now - this.date
    // 30.436875 is the average days in a month, including leap years
    const t =  [1000,   60,    60,     24,     30.436875,  12    ];
    const tT = ['sec',  'min', 'hour', 'day',  'month',    'year'];
    // generate the differences in each unit of time, eg. 12y 2mo 21d
    // i symbolizes the # of steps away from the smallest unit (1 = sec)
    for (let i = 6; i > 0; i--) {
      let n = this.diff;
      // date differences are given in milliseconds, so we have to divide them by each increasing unit of measure to get a specific number in that unit (eg. ms > s > m > h > d etc.)
      // repeat thru t until at difference in terms of what unit (years, months, days, etc.)
      for (let l = 0; l < i; l++) {
        // n is divided down until until translated specified unit of time (ms -> )
        n /= t[l];
      }
      // console.log('total in ' + tT[i - 1] + 's: ' + n)
      // now to subtract the bigger measurements to get the minute differences (eg 12 days and 10 hours)
      // s (# of times to subtract) loops more the smaller i (# from smalled unit) gets
      for (let s = 6; s > i; s--) {
        let dntl = this[tT[s - 1] + 'Diff'];
        // console.log('//', tT[s - 1] + 's floored', dntl)
        // turn bigger measurements back into smaller ones (A.K.A. reverse the division loop, except now the greater measurements have been floored)
        // the bigger the difference is between a big and small measurement, the more this will loop (eg. translating years to seconds vs years to months)
        for (let d = i; d < s; d++) {
          dntl *= t[d]
          // console.log('// *', t[d], '=', dntl)
        }
        
        n -= dntl;
        // console.log('-', dntl, '=', n, tT[i - 1] + 's')
      }
      this[tT[i - 1] + 'Diff'] = Math.floor(Math.abs(n));
    }
  }

  // eg. "2000-02-31"
  get simplex() {
    return `${this.date.getFullYear()}-${this.date.getMonth() < 10 ? '0' : ''}${this.date.getMonth()}-${this.date.getDate() < 10 ? '0' : ''}${this.date.getDate()}`
  }

  // eg. "1y 2m 20d"
  get shortstack() {
    let bigTime = this.dayDiff | this.moonDiff | this.yearDiff;
    return (`
      ${this.yearDiff ? this.yearDiff + 'y ' : ''}
      ${this.monthDiff ? this.monthDiff + 'mo ' : ''}
      ${this.dayDiff ? this.dayDiff + 'd' : ''}
      ${bigTime ? '' : this.hourDiff ? this.hourDiff + 'h' : this.minDiff ? this.minDiff + 'm' : this.secDiff ? this.secDiff + 's' : ''}
    `)
  }
}

class bNode {
  constructor(data) {
    this.data = data;
    this.node = '';
  }

  // add attributes to node
  set() {
    // standard in-bracket attributes
    for (const att in this.data.attributes) {
      this.node.setAttribute(att, this.data.attributes[att]);
    }
    // specialty attributes
    for (const att of ['innerHTML', 'textContent']) {
      if (this.data[att]) {
        this.node[att] = this.data[att];
      }
    }
    // appending children
    if (this.data.append) {
      for (const child of this.data.append) {
        this.node.append(child);
      }
    }
    return this.node;
  }
}

class bElement extends bNode {
  constructor(data) {
    super(data);
    this.node = document.createElement(data.tag);
  }
}

/***
**** RSS2DOM
***/

function rss2DOM(file) {
  var client = new XMLHttpRequest();
  client.open('GET', file);
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
      populateHTML(doc)
    }
  }
}

function populateHTML(doc) {
  let itemsSnap = doc.evaluate(
    "//channel/item",
    doc,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null,
  )

  let items = doc.evaluate(
    "//channel/item",
    doc,
    null,
    XPathResult.ORDERED_NODE_ITERATOR_TYPE,
    null,
  )

  for (let i = 0; i < itemsSnap.snapshotLength; i++) {
    addBlogPost(items.iterateNext())
  }
}

function addBlogPost(item, doc) {
  document.getElementById('blog').appendChild(
    new bElement({
      tag: 'div',
      attributes: {
        class: 'blogpost',
      },
      append: [
        new bElement({
          tag: 'div',
          attributes: {
            class: 'blogpost-header',
          },
          append: [
            new bElement({
              tag: 'i',
              append: [
                new bElement({
                  tag: 'h2',
                  textContent: item.querySelector("title").textContent,
                  attributes: {
                    class: 'blogpost-title',
                  }
                }).set(),
              ]
            }).set(),
            new bElement({
              tag: 'h3',
              textContent: new ago(item.querySelector("pubDate").textContent).shortstack,
              attributes: {
                class: 'blogpost-date',
              }
            }).set(),
          ]
        }).set(),
        new bElement({
          tag: 'div',
          attributes: {
            class: 'blogpost-body',
          },
          append: [
            new bElement({
              tag: 'p',
              innerHTML: item.querySelector("description").textContent,
              attributes: {
                class: 'blogpost-description',
              }
            }).set(),
          ]
        }).set(),
      ]
    }).set(),
  )
  console.log(item.querySelector("title"))
}

rss2DOM(config.rssFile);