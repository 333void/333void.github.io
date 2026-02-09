import parsePlaintext from "./ru5o2Score.js";
import notate from "./ru5o2Score.js";
import playSong from "./score2Tone.js";

window.addEventListener('load', (e) => {
  // parsing input text
  let input = document.getElementById('plaintext')

  let score = parsePlaintext(input.value);
  console.log('score: ', score);

  input.addEventListener('input', () => {
    let score = parsePlaintext(input.value);
    console.log(score);
    // notate(score);
  });

  document.getElementById('playButton').addEventListener('click', () => {
    playSong(score);
  });
});