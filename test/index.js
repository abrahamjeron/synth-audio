import MusicEngine from 'synth-audio';

const params = {
  mood: 'happy',
  tempo: 120,
  key: 'C',
  duration: 30,
  energy: 'medium',
  lyrics: 'A seed of melody',
  instruments: [
    { name: 'lead', waveform: 'sine', volume: 0.3, envelope: { attack: 0.01, decay: 0.05, sustain: 0.8, release: 0.1 } },
    { name: 'pad', waveform: 'triangle', volume: 0.2, envelope: { attack: 0.1, decay: 0.2, sustain: 0.6, release: 0.5 } }
  ],
  customChords: ['C4','G3','A3','F3'],
  customScale: ['C4','D4','E4','F4','G4','A4','B4'],
  melody: { type: 'custom', notes: ['E4','D4','C4','G3'], loop: true }
};

// Generate and save a WAV file
const main = async () => {
  const result = await MusicEngine.generate(params);
  console.log('Result:', result);
};

main();