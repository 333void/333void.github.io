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
  }
}

const file = new File(["heyyyyy"], "foo.txt", {
  type: "foo.png",
});

console.log(file)