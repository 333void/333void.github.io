var client = new XMLHttpRequest();
client.open('GET', 'index.xml');
client.onreadystatechange = function() {
  // readyState 4 is for complete response
  if (client.readyState === 4) {
    console.log(client.responseText);
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
    console.log(doc);
    evalRSS(doc);
  }
}

const file = new File(["heyyyyy"], "foo.txt", {
  type: "foo.png",
});

const buildDate = "//channel/lastBuildDate"
const latestItem = "//channel/item[position() = 1]"

function evalRSS(doc) {
  const element = '//link';

  const result = doc.evaluate(
    latestItem,
    doc,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null,
  ).snapshotItem(0).textContent;
  
  console.log(result);
}