/*
//  RU5O 2 PSEUDO-MUSICXML TRANSLATORS
*/

function key2Fifths(key) {
  var fifths, mode = '';

  // find mode
  switch (true) {
    case (/.dor|.dorian/i.test(key)): {
      mode = 'dorian';
      break;
    }
    case (/.phr|.phrygian/i.test(key)): {
      mode = 'phrygian';
      break;
    }
    case (/.lyd|.lydian/i.test(key)): {
      mode = 'lydian';
      break;
    }
    case (/.mix|.mixolydian/i.test(key)): {
      mode = 'mixolydian';
      break;
    }
    case (/.loc|.locrian/i.test(key)): {
      mode = 'locrian';
      break;
    }
    case (/.ion|.ionian/i.test(key)):
    case (/.M/.test(key)):
    case (/.maj|.major/i.test(key)): {
      mode = 'major';
      fifths = 0;
      break;
    }
    case (/.aeo|.aeolian/i.test(key)):
    case (/.min|.minor/i.test(key)):
    case (/.m/.test(key)): {
      mode = 'minor';
      break;
    }
    case (/.b$|.#$/.test(key)):
    case (/^[a-gA-G]./.test(key.charAt(0))): {
      mode = 'major';
      break;
    }
    // incorrect criteria
    default: {
      console.error("parse error! key has invalid text")
    }
  }

  // find key root note
  switch (true) {
    case (/^f/i.test(key)): {
      fifths = -1;
      break;
    }
    case (/^c/i.test(key)): {
      fifths = 0;
      break;
    }
    case (/^g/i.test(key)): {
      fifths = 1;
      break;
    }
    case (/^d/i.test(key)): {
      fifths = 2;
      break;
    }
    case (/^a/i.test(key)): {
      fifths = 3;
      break;
    }
    case (/^e/i.test(key)): {
      fifths = 4;
      break;
    }
    case (/^b/i.test(key)): {
      fifths = 5;
      break;
    }
  }

  // adjust fifths for sharps and flats
  switch (true) {
    case (/.b/.test(key)): {
      fifths -= 7;
      break;
    }
    case (/#/.test(key)): {
      fifths += 7;
      break;
    }
  }

  // adjust fifths for mode
  switch (mode) {
    case 'dorian': {
      fifths -= 2;
      break;
    }
    case 'phrygian': {
      fifths -= 4;
      break;
    }
    case 'lydian': {
      fifths += 1;
      break;
    }
    case 'mixolydian': {
      fifths -= 1;
      break;
    }
    case 'minor': {
      fifths -= 3;
      break;
    }
    case 'locrian': {
      fifths -= 5;
      break;
    }
  }

  return {fifths, mode}
}

function data4Score(data, score) {
  switch (data.state) {
    case 'config': {
      switch (data.foWhat) {
        case 'key': {
          let {mode, fifths} = key2Fifths(data.text)
          score.parts[0].attributes.key.mode = mode;
          score.parts[0].attributes.key.fifths = fifths;
        }
      }
      break;
    }
  }
}

/*
// ANALYSIS TOOLS
*/

// regex expressions for evaluating ru5o
function idParam(piece, state) {
  var foWhat = '';

  switch (state) {
    case 'config': {
      switch (true) {
        case (/k/.test(piece)): {
          foWhat = 'key';
          break;
        }
      }
    }
  }

  return ({state, foWhat})
}

// the codified ru5o text becomes an object based on the musicXML 4.0 standard.
// this will make it easier to turn into an musicXML file after processing.
// this is of root type <score-partwise> (ru5o is sectioned by parts when in multiline plaintext)
class Score {
  constructor() {
    this.partList = [
      {
        scorePart: {
          id: 'P1',
          partName: 'Instrument',
          partAbbreviation: 'Ins.',
        },
      },
    ];
    this.parts = [
      {
        id: 'P1',
        attributes: {
          key: {
            fifths: 0,
            mode: 'major',
          },
          time: {
            beats: 4,
            beatType: 4,
          },
        },
      },
    ];
  }
}

export default function parsePlaintext(text) {
  var score = new Score;
  // split text by white space
  const textArray = text.split(/\s+/);
  // state changes based on how data is meant to be interpreted
  var data, state = 'music'; // states: config, soflege, error, collect

  // parse text
  // analyze each piece of text (as divided by white space) at a time
  for (const piece of textArray) {
    // leave loop if error
    if (state === 'error') {
      break;
    }

    let pieceSoFar = '';
    let finalChar = false;

    // analyze each character in a piece of text
    for (const char of piece) {
      // leave loop if error
      if (state === 'error') {
        break;
      }

      // recreate piece character by character
      pieceSoFar += char;
      if (pieceSoFar.length == piece.length) {
        finalChar = true;
      }

      //console.log(pieceSoFar, char)

      // if in config state
      switch (state) {
        case 'config':
          switch (char) {
            case '[':
              state = 'error';
              console.error(`config error! opening bracket in config on piece "${piece}"`);
              break;
            case ']':
              state = 'config';
              break;
            case '=':
              // error, equality sign cannot be used without a symbol before it
              if (/^=|^\[=/.test(pieceSoFar)) {
                state = 'error';
                console.error(`config error! missing symbol before equals sign on piece "${piece}"`);
                break;
              }

              // initiate data collection
              data = idParam(pieceSoFar.charAt(pieceSoFar.length - 2), state);
              state = 'collect';
              break;
          }
          break;
        // state that collects data to be sent to a translator and then put in the score object
        case 'collect': {
          switch (true) {
            case (pieceSoFar === piece): {
              // add data to collection
              data.text ? data.text += char : data.text = char;
              // interpret data to be put in score object
              data4Score(data, score);
              state = data.state;
              break;
            }
            default: {
              // add data to collection
              data.text ? data.text += char : data.text = char;
            }
          }
        }
        default: {
          switch (char) {
            case '[': {
              state = 'config';
              break;
            }
            case ']': {
              state = 'error';
              console.error(`error! closing bracket without config on piece "${piece}"`);
              break;
            }
          }
        }
      }
    }
  }

  return score
}