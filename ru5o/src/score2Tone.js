function getNotes(score) {
  const acc = ['bb', 'b', '', '#', 'x'];
  let notes = [];
  let prevTime, time = 0;
  
  for (let note of score.parts[0].measures[0].notes) {
    if (note.chord === true) {
      time = prevTime;
    }

    //console.log(note);
    notes.push([
      `${Math.floor(time / 16)}:${Math.floor(time / 4) % 4}:${time % 4}`,
      `${note.pitch.step}${acc[note.pitch.alter + 2]}${note.pitch.octave}`,
    ])
    console.log(`${Math.floor(time / 16)}:${Math.floor(time / 4) % 4}:${time % 4}`)

    prevTime = time;
    time += (note.duration / score.parts[0].measures[0].attributes.divisions) * 4;
  }
  
  return notes;
}

function seqArrays() {

}


export default function playSong(score) {
  /*let squareSynth = new Tone.Synth({
    oscillator:{
      type: "square" 
    },
    resonance: 0.5
  }).toDestination();*/

  let bigSquare = new Tone.PolySynth().toDestination();
  bigSquare.set({oscillator: {
      type: "square" 
    },
    resonance: 0.9
  });

  let notes = getNotes(score);

  console.log('notes: ', notes)

  var part = new Tone.Part(function(time, note) {
	  bigSquare.triggerAttackRelease(note, '8n', time);
  }, notes);
    Tone.start();

  Tone.Transport.start();
  
  part.start();
}