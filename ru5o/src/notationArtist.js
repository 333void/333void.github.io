import parsePlaintext from "./plaintextParser.js";
import { bSVGElement } from "../../utils/333_library.js";

function draw(score) {
  const canvas = document.getElementById('canvas');
  let xPointer = 50, yPointer = 50, rootOctave = 0, xSpacing = 7, biggestWidth = 0; xTra = 0;

  for (const note of score.notes) {
    let noteIndex = score.notes.indexOf(note);
    let id = 'note' + noteIndex;
    let andOct = 0;

    // change for yPointer if current note is on a diff octave than root
    if (note.pitch.octave != rootOctave) {
      andOct = 20 * note.pitch.octave;
    }

    canvas.appendChild(new bSVGElement({
      tag: 'text',
      attributes: {
        id: id,
        x: xPointer,
        y: yPointer - andOct,
      },
      innerHTML: note.pitch.step,
    }).set());

    // change in xPointer (AFFECTS NEXT NOTE IN LOOP)
    width = document.getElementById(id).getBBox().width;
    
    // for xPointer & chords
    if (noteIndex != score.notes.length - 1) { // ignore moving xPointer if at the end of a line
      // if part of chord chain, find the biggest note width before moving xPointer (if not, make biggestWidth just the width)
      if ('chord' in note || 'chord' in score.notes[noteIndex + 1]) {
        if (width + xTra > biggestWidth) {
          biggestWidth = width + xTra;
        }
      } else {
        biggestWidth = width + xTra;
      }
      // if there isn't any notes in a chord chain after current note move xPointer
      if (!('chord' in score.notes[noteIndex + 1])) {
        xPointer += xSpacing + biggestWidth;
      }
    }




  }
}



window.addEventListener('load', (e) => {
  let pT = document.getElementById('plaintext')

  pT.addEventListener('input', parsePlaintext(pT.value));
  

})