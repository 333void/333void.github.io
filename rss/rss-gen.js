var client = new XMLHttpRequest();
client.open('GET', 'index.xml');
client.onreadystatechange = function() {
  console.log(client.responseText);
}
client.send();


const parser = new DOMParser();