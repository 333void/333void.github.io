export default function playSong() {
  const synth = new Tone.Synth().toDestination();
  Tone.getTransport = 100;
  synth.triggerAttackRelease("C4", "8n", "0:0:0");
  synth.triggerAttackRelease("C4", "8n", "0:1:0");
  synth.triggerAttackRelease("D4", "8n", "0:2:0");
  synth.triggerAttackRelease("E4", "8n", "0:3:0");
  synth.triggerAttackRelease("C4", "8n", "1:0:0");
  synth.triggerAttackRelease("E4", "8n", "1:1:0");
  synth.triggerAttackRelease("D4", "8n", "1:2:0");
  synth.triggerAttackRelease("G3", "8n", "1:3:0");
  synth.triggerAttackRelease("C4", "8n", "2:0:0");
  synth.triggerAttackRelease("C4", "8n", "2:1:0");
  synth.triggerAttackRelease("D4", "8n", "2:2:0");
  synth.triggerAttackRelease("E4", "8n", "2:3:0");
  synth.triggerAttackRelease("C4", "2n", "3:0:0");
  synth.triggerAttackRelease("B3", "8n", "3:2:0");
}