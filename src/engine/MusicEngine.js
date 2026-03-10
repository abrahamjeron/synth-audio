import SimpleMusicGenerator from './SimpleMusicGenerator.js';
import AudioExporter from '../utils/AudioExporter.js';
import fs from 'fs';
import path from 'path';

/**
 * MusicEngine - Advanced abstract interface for AI to generate music
 * 
 * AI has full creative control over:
 * - Chord progressions (custom or preset)
 * - Melodies (custom notes or procedural)
 * - Scales (custom or preset)
 * - Waveforms (sine, triangle, square, sawtooth)
 * - Envelopes (ADSR control)
 * - Effects and dynamics
 */
class MusicEngine {
  /**
   * Generate music with advanced AI control
   * @param {Object} params - Comprehensive song generation parameters
   * @returns {Promise<Object>} {success, filePath, duration, message}
   */
  static async generate(params) {
    try {
      // Validate and normalize inputs
      const validatedParams = this.validateAndNormalizeInput(params);
      
      console.log('\n🎵 =============== nth Harmony Music Engine ===============');
      console.log(`📝 Lyrics: "${validatedParams.lyrics}"`);
      console.log(`🎵 Mood: ${validatedParams.mood}`);
      console.log(`🔑 Key: ${validatedParams.key}`);
      console.log(`⏱️  Tempo: ${validatedParams.tempo} BPM`);
      console.log(`⚡ Energy: ${validatedParams.energy}`);
      console.log(`⏱️  Duration: ${validatedParams.duration}s`);
      if (validatedParams.customChords) {
        console.log(`🎼 Custom Chords: ${validatedParams.customChords.length} progression`);
      }
      if (validatedParams.customScale) {
        console.log(`📊 Custom Scale: ${validatedParams.customScale.length} notes`);
      }
      console.log('========================================================\n');

      // Generate music
      const generator = new SimpleMusicGenerator();
      const audioBuffer = generator.generateBackgroundMusic(validatedParams, validatedParams.duration);

      // Export to file
      const outputDir = path.dirname(validatedParams.outputPath);
      const filename = path.basename(validatedParams.outputPath);
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const filePath = AudioExporter.exportToWAV(audioBuffer, filename, outputDir);
      const duration = audioBuffer.length / 44100;

      return {
        success: true,
        filePath,
        duration: parseFloat(duration.toFixed(2)),
        message: `✅ Music generated successfully! (${duration.toFixed(2)}s)`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `❌ Error: ${error.message}`
      };
    }
  }

  /**
   * Comprehensive validation with support for advanced parameters
   */
  static validateAndNormalizeInput(params) {
    if (!params || typeof params !== 'object') {
      throw new Error('Input must be an object');
    }

    // === BASIC PARAMETERS ===
    const validMoods = ['happy', 'sad', 'energetic', 'peaceful', 'dramatic', 'dreamy'];
    if (!params.mood) throw new Error('mood is required');
    const mood = params.mood.toLowerCase();
    if (!validMoods.includes(mood)) {
      throw new Error(`Invalid mood. Must be one of: ${validMoods.join(', ')}`);
    }

    if (!params.tempo) throw new Error('tempo is required');
    let tempo = parseInt(params.tempo);
    tempo = Math.max(60, Math.min(180, tempo));

    const validKeys = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb'];
    if (!params.key) throw new Error('key is required');
    const key = params.key.toUpperCase();
    if (!validKeys.includes(key)) {
      throw new Error(`Invalid key. Must be one of: ${validKeys.join(', ')}`);
    }

    if (!params.duration) throw new Error('duration is required');
    let duration = parseInt(params.duration);
    duration = Math.max(5, Math.min(300, duration));

    const validEnergies = ['low', 'medium', 'high'];
    if (!params.energy) throw new Error('energy is required');
    const energy = params.energy.toLowerCase();
    if (!validEnergies.includes(energy)) {
      throw new Error(`Invalid energy. Must be one of: ${validEnergies.join(', ')}`);
    }

    if (!params.lyrics) throw new Error('lyrics is required');
    const lyrics = params.lyrics.toString().trim();

    // === ADVANCED PARAMETERS ===
    
    // Custom Chord Progression
    const customChords = this.validateChordProgression(params.customChords);
    
    // Custom Scale
    const customScale = this.validateScale(params.customScale);
    
    // Melody Configuration
    const melody = this.validateMelodyConfig(params.melody);
    
    // Instrument Configuration (with waveforms and envelopes)
    const instruments = this.validateInstruments(params.instruments);
    
    // Effects
    const effects = this.validateEffects(params.effects);
    
    // Dynamics
    const dynamics = this.validateDynamics(params.dynamics);
    
    // Rests Configuration
    const rests = this.validateRests(params.rests);

    // Generate output path
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const outputPath = params.outputPath || `./output/music_${timestamp}.wav`;

    return {
      // Basic
      lyrics,
      mood,
      tempo,
      key,
      duration,
      energy,
      outputPath,
      customChords,
      customScale,
      melody,
      instruments,
      effects,
      dynamics,
      rests
    };
  }

  /**
   * Validate custom chord progression
   */
  static validateChordProgression(chords) {
    if (!chords) return null;
    if (!Array.isArray(chords)) {
      throw new Error('customChords must be an array of note strings');
    }
    
    // Validate each chord (must be valid note format)
    for (const chord of chords) {
      if (typeof chord !== 'string' || !/^[A-G][#b]?\d$/.test(chord)) {
        throw new Error(`Invalid chord: "${chord}". Use format like "C4", "D#4", "Bb3"`);
      }
    }
    
    return chords.length > 0 ? chords : null;
  }

  /**
   * Validate custom scale
   */
  static validateScale(scale) {
    if (!scale) return null;
    if (!Array.isArray(scale)) {
      throw new Error('customScale must be an array of note strings');
    }
    
    for (const note of scale) {
      if (typeof note !== 'string' || !/^[A-G][#b]?\d$/.test(note)) {
        throw new Error(`Invalid scale note: "${note}". Use format like "C4"`);
      }
    }
    
    return scale.length > 0 ? scale : null;
  }

  /**
   * Validate melody configuration
   */
  static validateMelodyConfig(melody) {
    if (!melody) return { type: 'random' };
    
    if (typeof melody === 'string') {
      const validTypes = ['random', 'ascending', 'descending', 'minimal', 'patterns'];
      if (!validTypes.includes(melody)) {
        throw new Error(`Invalid melody type. Must be: ${validTypes.join(', ')}`);
      }
      return { type: melody };
    }
    
    if (typeof melody === 'object') {
      // Custom note sequence
      if (melody.notes) {
        if (!Array.isArray(melody.notes)) {
          throw new Error('melody.notes must be an array');
        }
        return {
          type: 'custom',
          notes: melody.notes,
          loop: melody.loop !== false  // Default: true
        };
      }
      
      // Pattern-based
      if (melody.pattern) {
        return {
          type: 'pattern',
          pattern: melody.pattern,
          repeat: melody.repeat || 1
        };
      }
    }
    
    return { type: 'random' };
  }

  /**
   * Validate instrument configuration with waveforms and envelopes
   */
  static validateInstruments(instruments) {
    if (!instruments) {
      throw new Error('instruments is required. Provide an array of instrument configurations');
    }
    
    if (!Array.isArray(instruments)) {
      throw new Error('instruments must be an array');
    }

    if (instruments.length === 0) {
      throw new Error('instruments array cannot be empty. Provide at least one instrument');
    }

    const validatedInstruments = [];
    const validWaveforms = ['sine', 'triangle', 'square', 'sawtooth'];
    
    for (const inst of instruments) {
      if (typeof inst === 'string') {
        throw new Error(`Instrument "${inst}" must be a full object with name, waveform, volume, and envelope. Simple string names are not supported.`);
      } else if (typeof inst === 'object') {
        // Advanced instrument config - all required
        if (!inst.name) throw new Error('Each instrument must have a "name" property');
        if (!inst.waveform) throw new Error(`Instrument "${inst.name}" must have a "waveform" property`);
        if (inst.volume === undefined) throw new Error(`Instrument "${inst.name}" must have a "volume" property`);
        if (!inst.envelope) throw new Error(`Instrument "${inst.name}" must have an "envelope" property`);
        
        if (!validWaveforms.includes(inst.waveform)) {
          throw new Error(`Invalid waveform: ${inst.waveform}. Must be: ${validWaveforms.join(', ')}`);
        }
        
        validatedInstruments.push({
          name: inst.name,
          waveform: inst.waveform,
          volume: Math.max(0, Math.min(1, inst.volume)),
          envelope: inst.envelope,
          effects: inst.effects || []
        });
      }
    }
    
    return validatedInstruments;
  }

  /**
   * Validate effects configuration
   */
  static validateEffects(effects) {
    if (!effects) return {};
    
    const validEffects = {};
    
    if (effects.reverb !== undefined) {
      validEffects.reverb = {
        enabled: effects.reverb === true || (typeof effects.reverb === 'object' && effects.reverb.enabled !== false),
        decay: (effects.reverb?.decay) || 2
      };
    }
    
    if (effects.delay !== undefined) {
      validEffects.delay = {
        enabled: effects.delay === true || (typeof effects.delay === 'object' && effects.delay.enabled !== false),
        time: (effects.delay?.time) || 0.5,
        feedback: Math.max(0, Math.min(0.9, effects.delay?.feedback || 0.3))
      };
    }
    
    if (effects.distortion !== undefined) {
      validEffects.distortion = {
        enabled: effects.distortion === true || (typeof effects.distortion === 'object' && effects.distortion.enabled !== false),
        amount: Math.max(0, Math.min(1, effects.distortion?.amount || 0.5))
      };
    }
    
    return validEffects;
  }

  /**
   * Validate dynamics (volume automation)
   */
  static validateDynamics(dynamics) {
    if (!dynamics) return null;
    
    return {
      swing: Math.max(0, Math.min(1, dynamics.swing || 0)),
      humanize: dynamics.humanize !== false,
      volumeVariation: Math.max(0, Math.min(1, dynamics.volumeVariation || 0.1))
    };
  }

  /**
   * Validate rests configuration (silence between stanzas/sections)
   * @param {Array|Object} rests - Rest configuration
   * @returns {Array} Validated rest array
   */
  static validateRests(rests) {
    if (!rests) return [];
    
    // Convert single rest to array
    if (typeof rests === 'object' && !Array.isArray(rests)) {
      rests = [rests];
    }
    
    if (!Array.isArray(rests)) {
      throw new Error('rests must be an array or object with rest specifications');
    }
    
    const validatedRests = [];
    
    for (const rest of rests) {
      if (typeof rest === 'object') {
        // Validate rest timing and duration
        const noteIndex = rest.noteIndex !== undefined ? parseInt(rest.noteIndex) : null;
        const duration = rest.duration !== undefined ? parseFloat(rest.duration) : 0.5;
        const position = rest.position || 'before'; // 'before' or 'after'
        
        if (noteIndex === null && !rest.time) {
          throw new Error('Rest must have either "noteIndex" or "time" specified');
        }
        
        validatedRests.push({
          noteIndex: noteIndex,
          time: rest.time !== undefined ? parseFloat(rest.time) : null,
          duration: Math.max(0.1, Math.min(10, duration)), // Clamp between 0.1s and 10s
          position: position,
          description: rest.description || `Rest (${duration}s)`
        });
      }
    }
    
    return validatedRests;
  }

  // Helper methods
  /**
   * Get all available options for AI
   */
  static getAvailableOptions() {
    return {
      moods: ['happy', 'sad', 'energetic', 'peaceful', 'dramatic', 'dreamy'],
      keys: ['C', 'G', 'D', 'A', 'E', 'F', 'Bb'],
      energies: ['low', 'medium', 'high'],
      instruments: ['synth', 'bass', 'drums', 'pad', 'strings', 'piano', 'lead'],
      waveforms: ['sine', 'triangle', 'square', 'sawtooth'],
      melodyTypes: ['random', 'ascending', 'descending', 'minimal', 'patterns', 'custom'],
      effectTypes: ['reverb', 'delay', 'distortion', 'modulation'],
      tempoRange: { min: 60, max: 180, default: 120 },
      durationRange: { min: 5, max: 300, default: 30 },
      volumeRange: { min: 0, max: 1, default: 0.5 },
      envelopeRange: {
        attack: { min: 0, max: 1 },
        decay: { min: 0, max: 1 },
        sustain: { min: 0, max: 1 },
        release: { min: 0, max: 2 }
      }
    };
  }

  /**
   * Get advanced AI prompt with full creative control
   */
  static getAIPrompt() {
    return `
You are an advanced music generation AI. You have full creative control over music generation.

RESPOND WITH ONLY VALID JSON - no explanations, no markdown.

PARAMETER GUIDE:

BASIC PARAMETERS:
- lyrics (string): Song concept
- mood (string): happy|sad|energetic|peaceful|dramatic|dreamy
- tempo (number): 60-180 BPM
- key (string): C|G|D|A|E|F|Bb
- duration (number): 5-300 seconds
- energy (string): low|medium|high

ADVANCED PARAMETERS (Optional - give AI MORE POWER):

1. CUSTOM CHORDS:
   "customChords": ["C4", "E4", "G4", "A4", "F4", "B4", "D5"]
   Format: Note name + octave (e.g., "C4", "D#4", "Bb3")

2. CUSTOM SCALE:
   "customScale": ["C4", "D4", "E4", "F4", "G4", "A4", "B4"]
   Define exact notes the melody will use

3. MELODY CONFIGURATION:
   Simple: "melody": "random" | "ascending" | "descending" | "minimal" | "patterns"
   Custom: "melody": {
     "type": "custom",
     "notes": ["C4", "D4", "E4", "D4", "C4"],
     "loop": true
   }

4. INSTRUMENTS (with waveforms & envelopes):
   Simple: "instruments": ["synth", "bass"]
   Advanced: "instruments": [
     {
       "name": "synth",
       "waveform": "triangle|sine|square|sawtooth",
       "volume": 0-1,
       "envelope": {
         "attack": 0.005,
         "decay": 0.1,
         "sustain": 0.3,
         "release": 0.5
       }
     }
   ]

5. EFFECTS:
   "effects": {
     "reverb": { "enabled": true, "decay": 2 },
     "delay": { "enabled": true, "time": 0.5, "feedback": 0.3 },
     "distortion": { "enabled": false, "amount": 0.5 }
   }

6. DYNAMICS:
   "dynamics": {
     "swing": 0.2,
     "humanize": true,
     "volumeVariation": 0.1
   }

7. RESTS (Silence between stanzas/sections):
   "rests": [
     {
       "noteIndex": 7,
       "duration": 0.8,
       "description": "Rest after phrase"
     },
     {
       "noteIndex": 14,
       "duration": 1.0,
       "description": "Rest between stanzas"
     }
   ]
   OR use time-based rests:
   "rests": [
     {
       "time": 5.5,
       "duration": 0.5,
       "description": "Rest at 5.5 seconds"
     }
   ]

EXAMPLES:

EXAMPLE 1 - Basic:
{
  "lyrics": "Happy summer song",
  "mood": "happy",
  "tempo": 120,
  "key": "G",
  "duration": 30,
  "energy": "high",
  "instruments": ["synth", "bass"]
}

EXAMPLE 2 - Advanced (Custom Chords & Scale):
{
  "lyrics": "Sad melancholic ballad",
  "mood": "sad",
  "tempo": 75,
  "key": "F",
  "duration": 60,
  "energy": "low",
  "customChords": ["F3", "Bb3", "C4", "F3"],
  "customScale": ["F3", "G3", "Bb3", "C4", "D4", "Eb4", "F4"],
  "instruments": [
    {
      "name": "synth",
      "waveform": "sine",
      "volume": 0.4,
      "envelope": { "attack": 0.1, "decay": 0.2, "sustain": 0.5, "release": 1.0 }
    }
  ],
  "effects": {
    "reverb": { "enabled": true, "decay": 3 },
    "delay": { "enabled": true, "time": 0.6, "feedback": 0.4 }
  }
}

EXAMPLE 3 - Creative (Full Control):
{
  "lyrics": "Energetic electronic dance track",
  "mood": "energetic",
  "tempo": 135,
  "key": "E",
  "duration": 45,
  "energy": "high",
  "customChords": ["E4", "B4", "E5", "B4", "G#4", "C#5"],
  "melody": {
    "type": "custom",
    "notes": ["E5", "F#5", "G#5", "A5", "G#5", "F#5"],
    "loop": true
  },
  "instruments": [
    {
      "name": "synth",
      "waveform": "square",
      "volume": 0.6,
      "envelope": { "attack": 0.01, "decay": 0.05, "sustain": 0.8, "release": 0.1 }
    },
    {
      "name": "bass",
      "waveform": "sawtooth",
      "volume": 0.5,
      "envelope": { "attack": 0.02, "decay": 0.1, "sustain": 0.7, "release": 0.2 }
    }
  ],
  "effects": {
    "distortion": { "enabled": true, "amount": 0.3 }
  },
  "dynamics": {
    "swing": 0.15,
    "humanize": true,
    "volumeVariation": 0.2
  }
}

NOW GENERATE MUSIC PARAMETERS FOR:
`;
  }
}

export default MusicEngine;
