class Instrument {
  constructor () {
    this.context = new AudioContext();
  }

  createNote(freq) {
    let osc = this.context.createOscillator();
    let gainNode = this.context.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(gainNode);
    gainNode.connect(this.context.destination);
    return {osc, gainNode}
  }

  on(note) {
    note.osc.start()
  }

  off(note) {
    note.osc.stop();
  }

  play(note) {
    note.osc.start()
    note.gainNode.gain.exponentialRampToValueAtTime(
      1, this.context.currentTime + 2
    )

  }
}

window.onload = () => {
  document.getElementById('play').addEventListener('click', () => {
  //create a synth and connect it to the main output (your speakers)
  const synth = new Tone.PolySynth(Tone.FMSynth).toDestination();

  //play a middle 'C' for the duration of an 8th note
  synth.triggerAttackRelease("1000", "8n");
  })
}