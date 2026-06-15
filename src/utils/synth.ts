/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Ambient Synthesizer for Singer Website
// Plays modern chilled melodies matching Aria Vance's indie-soul/neo-soul persona.

let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let synthInterval: any = null;
let activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
let isPlaying = false;
let currentTrackId: string | null = null;

// Ambient chilled note progressions (freq in Hz)
const SCALES: { [key: string]: number[] } = {
  // Solitude Sessions - Minor Neo-Soul Chords & Lead (Key: Am7/C)
  vesper_hills: [130.81, 196.00, 246.94, 293.66, 329.63, 392.00, 440.00, 587.33], // C major pentatonic, deep low chord floor
  rhodes_rust: [110.00, 165.00, 220.00, 261.63, 329.63, 392.00, 440.00, 523.25], // Am7 mood
  subtle_indigo: [146.83, 220.00, 277.18, 329.63, 440.00, 554.37, 659.25, 880.00], // Dmaj7 sweet vibes
  chasing_the_lows: [97.99, 146.83, 196.00, 220.00, 293.66, 392.00, 440.00, 587.33], // G major pentatonic
  glass_harbor: [130.81, 164.81, 196.00, 246.94, 329.63, 392.00, 493.88, 587.33], // Cmaj7 relaxing sea vibes

  // Quiet Echoes - Folk Acoustic Chords & Arpeggios (Key: G Major / E Minor)
  timber_hearth: [82.41, 123.47, 164.81, 196.00, 246.94, 293.66, 329.63, 392.00], // Em mood, dark woody notes
  silver_pines: [98.00, 146.83, 196.00, 246.94, 293.66, 392.00, 440.00, 493.88], // G major, crisp alpine pines
  wind_and_wire: [110.00, 146.83, 196.00, 220.00, 293.66, 349.23, 440.00, 587.33], // Dm7 acoustic airiness

  // Velvet Skies - Ballad Echoes
  velvet_skies: [73.42, 110.00, 146.83, 164.81, 220.00, 261.63, 329.63, 440.00], // D-minor cello-style bass & strings
};

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return { audioCtx, analyser };
};

export const getAnalyser = () => analyser;

const triggerNote = (ctx: AudioContext, frequency: number, duration: number, type: OscillatorType = 'triangle', volumeRatio = 1) => {
  if (!ctx || ctx.state === 'suspended') return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);

  // Soft attack and decay to emulate a Rhodes or acoustic instrument
  const now = ctx.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.12 * volumeRatio, now + 0.08); // soft entry
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // smooth, organic tail

  osc.connect(gainNode);
  if (analyser) {
    gainNode.connect(analyser);
  } else {
    gainNode.connect(ctx.destination);
  }

  osc.start(now);
  osc.stop(now + duration);

  const oscId = { osc, gain: gainNode };
  activeOscillators.push(oscId);

  setTimeout(() => {
    activeOscillators = activeOscillators.filter(item => item !== oscId);
  }, duration * 1000 + 100);
};

export const playSynth = (trackId: string) => {
  const { audioCtx: ctx } = initAudio();
  if (!ctx) return;

  if (isPlaying) {
    stopSynth();
  }

  isPlaying = true;
  currentTrackId = trackId;

  // Retrieve track tones (default to vesper_hills notes if none matched)
  const tonality = SCALES[trackId] || SCALES.vesper_hills;

  let step = 0;

  // Periodic heartbeat loop (ambient rhythm)
  const tick = () => {
    if (!isPlaying || !audioCtx) return;

    // Trigger base drone chords on beat 0 and 4
    if (step % 8 === 0) {
      // Warm bass notes
      triggerNote(audioCtx, tonality[0], 2.8, 'sine', 1.5);
      triggerNote(audioCtx, tonality[1], 2.5, 'triangle', 0.8);
      // Clean chord triad
      triggerNote(audioCtx, tonality[2], 2.2, 'triangle', 0.5);
      triggerNote(audioCtx, tonality[3], 2.2, 'sine', 0.4);
    }

    if (step % 12 === 6) {
      // Secondary chord backing
      triggerNote(audioCtx, tonality[1], 2.0, 'sine', 1.0);
      triggerNote(audioCtx, tonality[4], 1.8, 'triangle', 0.6);
    }

    // Melodic sparkles
    const r = Math.random();
    if (r > 0.4) {
      // Select random upper pitch
      const noteIdx = 4 + Math.floor(Math.random() * 4); // indices 4 to 7 are high-pitch melody sparkles
      const frequency = tonality[noteIdx];
      // trigger melody tone
      triggerNote(audioCtx, frequency, 1.2 + Math.random() * 0.8, 'triangle', 0.7);
    }

    // Gentle hi-hat sound on even steps (unlocked via raw noise synthesis)
    if (step % 4 === 2) {
      triggerHighHat(audioCtx);
    }

    step = (step + 1) % 16;
  };

  // Run the tick every 450ms (ambient tempo ~133BPM)
  synthInterval = setInterval(tick, 450);
  // Trigger initial tick immediately
  tick();
};

const triggerHighHat = (ctx: AudioContext) => {
  const bufferSize = ctx.sampleRate * 0.04; // short burst
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 8000; // pass high hiss frequencies only

  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.015, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

  noise.connect(filter);
  filter.connect(gain);
  if (analyser) {
    gain.connect(analyser);
  } else {
    gain.connect(ctx.destination);
  }

  noise.start(now);
};

export const stopSynth = () => {
  isPlaying = false;
  currentTrackId = null;
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }

  // Soft release on all active oscillators
  activeOscillators.forEach(({ gain }) => {
    try {
      if (audioCtx) {
        gain.gain.cancelScheduledValues(audioCtx.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
      }
    } catch (e) {
      // Ignored if expired
    }
  });

  activeOscillators = [];
};

export const getPlayingTrackId = () => {
  return isPlaying ? currentTrackId : null;
};
