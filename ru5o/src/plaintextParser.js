import { scoreDefaults } from "./defaults.config.js"

const rX = {
  // parameters test
  p: {
    soflege: /[1-7]/
  }
}

class Score {
  constructor() {
    this.parts = [[]];
  }
}

function idParam(piece) {
  for (const exp in rX.p) {
    console.log(piece, exp)
  }
}

export default function parsePlaintext(text) {
  let score = new Score;
  // split text by white space
  const textArray = text.split(/\s+/);
  console.log(textArray)

  let textSoFar = '';
  var states = {
    config: false,
    soflege: false,
  }

  // interpret
  for (const piece of textArray) {
    let pieceSoFar = '';
    let finalChar = false;

    for (const char of piece) {
      textSoFar += char;
      pieceSoFar += char;
      if (pieceSoFar.length == piece.length) {
        finalChar = true;
      }

      console.log(piece, char)

      // config switch
      if (states.config === true) {
        switch (char) {
          case '[':
            console.log(`error! config in config on piece "${piece}"`);
            break;
          case ']':
            states.config = false;
            break;
          case '=':         
            states[idParam(pieceSoFar.slice(0, pieceSoFar.length - 1))] = true;
            break;
        }
  
        continue;
      }

      switch (char) {
        case '[':
          states.config = true;
          break;
        case ']':
          console.log(`error! config closing in before config opening on piece "${piece}"`);
          break;
      }
    }
  }



  return score
}