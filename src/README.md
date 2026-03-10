# nth Harmony

nth Harmony is a lightweight Node.js music generation engine that synthesizes audio buffers and exports WAV files. It exposes a single entry point that provides the `MusicEngine` class for AI-driven music generation.

Quick usage:

```js
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
  // The function returns an object with success, filePath and message
  console.log('Generation result:', result);
};

main();
```

How to publish to npm

1. Make sure you have an npm account and are logged in:

```bash
npm login
```

2. From the project root (where `package.json` lives) run:

```bash
npm publish --access public
```

Notes

- This package uses ES modules (`"type": "module"`), so consumers should import with `import` syntax.
- The project currently exports `MusicEngine` from `index.js`.
 - The project currently exports `MusicEngine` from `index.js`.

Notes from local testing
- If the example is run and generation succeeds you will see console logs and a WAV file written to the `output/` folder in the consumer project.
- Example of the returned result object:

```
{
  success: true,
  filePath: '/path/to/output/music_2026-03-10T05-43-00.wav',
  duration: 30,
  message: '✅ Music generated successfully! (30.00s)'
}
```

Publishing
- To publish a new version to npm:

```bash
# make sure you're logged in
npm login
# from the package root (this README location)
npm publish --access public
```

If you prefer, create a local tarball to inspect the package before publishing:

```bash
npm pack
```
