import parsePlaintext from "./plaintextParser.js";
import notate from "./plaintextParser.js";

window.addEventListener('load', (e) => {
  // parsing input text
  let input = document.getElementById('plaintext')
  input.addEventListener('input', () => {
    let score = parsePlaintext(input.value);
    console.log(score);
    // notate(score);
  });
})