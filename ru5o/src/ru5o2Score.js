import { score } from "./score.default.js";

/*
//  RU5O 2 SCORE (JS-MUSICXML) TRANSLATORS
*/

// musicxml works in fifths, analyzes ru5o key as a fifth
function key2Fifths(key) {
  var fifths, mode;

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
    // if no mode specification, default to major
    case (/.b$|.#$/.test(key)):
    case (/^[a-gA-G]/.test(key.charAt(0))): {
      mode = 'major';
      break;
    }
    // incorrect criteria
    default: {
      console.error(`parse error! key has invalid text: ${key}`)
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
  // modes adjust following the next note the circle of fifths
  switch (mode) {
    case 'lydian':
      fifths += 1;
      break;
    case 'locrian': fifths -= 1;
    case 'phrygian': fifths -= 1;
    case 'minor': fifths -= 1;
    case 'dorian': fifths -= 1;
    case 'mixolydian': fifths -= 1;
  }

  return {fifths, mode}
}

function root2Fifths(root, letter) {
  var mode;

  switch (Number(root)) {
    case 1:
      mode = 'major';
      break;
    case 6:
      mode = 'minor';
      break;
  }

  var {fifths} = key2Fifths(letter);

  return {fifths, mode};
}

function note2Pitch(note, octave, fifths) {
  //console.log(note, mode, fifths)
  const strFifths = 'FCGDAEB'; // circle of fifths
  const strScale = 'CDEFGAB'; // standard scale notes
  const keyNotes = new Map(); 

  // determining root letter and pitch (sharp or flat)
  let f = (fifths + 1) % 7; // for pos. in loop of fifths (FCGDAEB)
  let rootNote = 
    strScale.indexOf( // position in scale string
      strFifths[f < 0 ? f + 7 : f] // find scale root letter in fifths string
    );
  let a = Math.floor(fifths / 7); // pitch (flat or sharp) based on pos. in circle of fifths

  for (let i = 1; i < 8; i++) { // seven note soflege
    // current note of scale based on root
    // div by 7 if total goes over 7 (longer than string, loop back to start)
    let iNote = strScale[(rootNote + i - 1) % 7];
    let setArray = [];

    // determine notes with pitch alterations
    // alters change predictably each key on COF, clockwise as FCGDAEB
    // fifths in musicXML indicates position on COF numerically
    // we use that to cut off notes from fifths string that are pitch altered
    // and note that in musicXML using the <alter> tag (here as var a)
    // -1 for indexOf indicates not on string
    if (strFifths.slice(fifths % 7).indexOf(iNote) !== -1) { 
      setArray.push(iNote, a); // normal notes
    } else {
      setArray.push(iNote, a + 1); // altered notes
    }

    // determine notes in next octave if root note is not C
    // if iteration is smaller or equal to root note position in scale string, then it is in current octave
    // we offset with the "- 1" since remainder function causes loop to end at 0 and not 7
    if (i - 1 % 7 <= (rootNote + i - 1) % 7) {
      setArray.push(octave); // lower octave
    // if iteration is bigger than root note position in scale string, it is in next octave
    } else {
      setArray.push(octave + 1); // higher octave
    }

    keyNotes.set(i, setArray);
  };

  return {
    step: keyNotes.get(Number(note))[0],
    alter: keyNotes.get(Number(note))[1],
    octave: keyNotes.get(Number(note))[2],
  };
}

// analyze ru5o note
function note2Note(data, {mode, fifths}) {
  let duration = 32; // quarter note, if divisions is 32
  let soflege = data.text.match(/\d/g);
  let notes = [];

  // duration switch + hyphen switch
  switch (true) {
    case (/=-/.test(data.text)):
      duration = 4;
      break;
    case (/==/.test(data.text)):
      duration = 2;
      break;
    case (/==-/.test(data.text)):
      duration = 1;
      break;
    case (/=/.test(data.text)):
      duration = 8;
      break;
    case (/\+/.test(data.text)):
      duration = 64;
      break;
    case (/\*/.test(data.text)):
      duration = 128;
      break;
    // hyphen switch
    case (/-/.test(data.text)):
      switch (true) {
        case (/\d-\d/.test(data.text)):
          break;
        default: 
          duration = 16;
          break;
      };
  };

  // pitch switch + dot switch
  switch (true) {
    case (/'/.test(data.text)):
      data.octave += 1;
      break;
    case (/"/.test(data.text)):
      data.octave += 2;
      break;
    case (/\./.test(data.text)):
      switch (true) {
        case (/\d\./.test(data.text)):
        case (/\d.\./.test(data.text)):
          duration += duration / 2;
        case (/\.\./.test(data.text)): {
          data.octave -= 2;
          break;
        }
        case (/\.\d/.test(data.text)):
        case (/\..\d/.test(data.text)):
          data.octave -= 1;
          break;
      };
  };

  let nextOc = 0;
  for (let i = 0; i < soflege.length; i++) {
    if (soflege[i - 1] > soflege[i]) nextOc += 1;
    let note = {
      chord: true,
      pitch: note2Pitch(soflege[i], data.octave + nextOc, fifths),
      duration: duration,
    };
    if (i === 0) delete note.chord;
    notes.push(note);
  };


  // MusicXML format
  return notes
}

function data2Score(data, score) {
  console.log('data - d2: ', data);

  switch (data.state) {
    case 'config': {
      switch (data.foWhat) {
        case 'key': {
          score.parts[0].measures[0].attributes.key = key2Fifths(data.text);
          break;
        }
        case 'octave': {
          data.octave = Number(data.text);
          break;
        }
        case 'root': {
          score.parts[0].measures[0].attributes.key = root2Fifths(data.param, data.text);
        }
      };
      delete data.foWhat;
      delete data.param;
      break;
    };
    // default state, soflege analysis
    default: {
      let lo = score.parts[0].measures[0];
      let notes = note2Note(data, lo.attributes.key);

      for (let note of notes) {
        lo.notes.push(note)
      }
      
      
      ;
      //return {pitch: {step, octave}}
    };
  };
};

/*
// INTERMEDIATE ANALYSIS TOOLS
*/

// regex expressions for uncodifying config parameters
// saves what process needs to be executed in function data2Score once collecting is done,using foWhat var
function idParam(piece, data) {
  console.log(piece)
  data.param = piece;
  switch (data.state) {
    case 'config': {
      switch (true) {
        case (/k/.test(piece)):
          data.foWhat = 'key';
          break;
        case (/o/.test(piece)):
          data.foWhat = 'octave';
          break;
        case (/\d/.test(piece)):
          data.foWhat = 'root';
          break;
      };
      break;
    };
  };

  return data;
}

export default function parsePlaintext(text) {
  // split text by white space
  const textArray = text.split(/\s+/);
  // state changes based on how data is meant to be interpreted
  var data = {
    state: 'default', // states: default, config, error
    collect: false, // boolean
    octave: 4, // default octave
  }; 
  console.log(textArray)

  // parse text
  // analyze each piece of text (as divided by white space) at a time
  for (const piece of textArray) {
    // leave loop if error
    if (data.state === 'error') {
      break;
    }

    let pieceSoFar = '';

    // analyze each character in a piece of text
    for (const char of piece) {
      // leave loop if error
      if (data.state === 'error') {
        break;
      }

      // recreate piece character by character
      pieceSoFar += char;
      //console.log('data - for: ', data)
      //console.log(pieceSoFar, char)

      // state that collects data to be sent to a translator and then put in the score object
      if (data.collect === true) {
        switch (true) {
          // if collection is finished
          case (pieceSoFar === piece): {
            // if piece is ending config, add to score and end collection, then change state outta config
            if (/\]/.test(piece)) {
              data2Score(data, score);
              data.state = 'default';
              data.collect = false;
            // if else, just add to score and end collection, keep state
            } else {
              // add final data to collection
              data.text ? data.text += char : data.text = char;
              // interpret data to be put in score object
              data2Score(data, score);
              data.collect = false;
            }
            delete data.text;
            break;
          };
          // if collection is not finished
          default: {
            // add data to collection
            data.text ? data.text += char : data.text = char;
          };
        };
        continue;
      };
      
      switch (data.state) {
        // state that identifies config key value pairs
        case 'config': {
          switch (char) {
            case '[':
              data.state = 'error';
              console.error(`config error! opening bracket in config on piece "${piece}"`);
              break;
            case ']':
              data.state = 'default';
              break;
            case '=':
              // error, equality sign cannot be used without a symbol before it
              if (/^=|^\[=/.test(pieceSoFar)) {
                data.state = 'error';
                console.error(`config error! missing symbol before equals sign on piece "${piece}"`);
                break;
              }
              // identifies what the config parameter is for and saves it (foWhat of data var) for when collecting is done
              data = idParam(pieceSoFar.charAt(pieceSoFar.length - 2), data);
              // initiate data collection
              data.collect = true;
              break;
          }
          break;
        };
        default: {
          switch (true) {
            // config state initiation
            case /\[/.test(char):
              data.state = 'config';
              break;
            // config state termination without being in config state, error
            case /\]/.test(char):
              data.state = 'error';
              console.error(`error! closing bracket without config on piece "${piece}"`);
              break;
            // bar break, no significance
            case /\|/.test(char):
              break;
            // normal soflege analysis
            case (pieceSoFar === piece):
              data.text = pieceSoFar;
              data2Score(data, score);
          };
        };
      };
    };
  };

  return score
}