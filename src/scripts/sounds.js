// ============================================
// RPG Trivia Quest — Sound & 8-Bit BGM Engine (Web Audio API)
// ============================================

let audioCtx = null;
let bgmTimer = null;
let currentBGMTrack = null;
let soundEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(frequency, duration, type = 'square', volume = 0.15, rampDown = true) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);

    if (rampDown) {
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Silently fail if audio is not available
  }
}

function playNoise(duration, volume = 0.1) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();

    source.buffer = buffer;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
  } catch (e) {
    // Silently fail
  }
}

// ============================================
// 8-BIT CHIPTUNE SYNTHESIZER FOR BACKGROUND MUSIC
// ============================================

// Note frequencies (Hz)
const N = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  OFF: 0
};

// 8-Bit Melody & Bass Patterns
const MUSIC_TRACKS = {
  title: {
    tempo: 160,
    melody: [
      { note: N.E4, dur: 0.12 }, { note: N.G4, dur: 0.12 }, { note: N.B4, dur: 0.12 }, { note: N.E5, dur: 0.2 },
      { note: N.D5, dur: 0.12 }, { note: N.B4, dur: 0.12 }, { note: N.G4, dur: 0.12 }, { note: N.A4, dur: 0.2 },
      { note: N.C4, dur: 0.12 }, { note: N.E4, dur: 0.12 }, { note: N.A4, dur: 0.12 }, { note: N.C5, dur: 0.2 },
      { note: N.B4, dur: 0.12 }, { note: N.G4, dur: 0.12 }, { note: N.E4, dur: 0.12 }, { note: N.E4, dur: 0.2 }
    ],
    bass: [N.E3, N.E3, N.A3, N.A3, N.C3, N.C3, N.E3, N.G3]
  },
  battle: {
    tempo: 130,
    melody: [
      { note: N.A4, dur: 0.09 }, { note: N.A4, dur: 0.09 }, { note: N.C5, dur: 0.09 }, { note: N.E5, dur: 0.14 },
      { note: N.D5, dur: 0.09 }, { note: N.C5, dur: 0.09 }, { note: N.B4, dur: 0.09 }, { note: N.G4, dur: 0.14 },
      { note: N.F4, dur: 0.09 }, { note: N.A4, dur: 0.09 }, { note: N.D5, dur: 0.09 }, { note: N.F5, dur: 0.14 },
      { note: N.E5, dur: 0.09 }, { note: N.D5, dur: 0.09 }, { note: N.C5, dur: 0.09 }, { note: N.E5, dur: 0.14 }
    ],
    bass: [N.A3, N.A3, N.F3, N.F3, N.D3, N.D3, N.E3, N.E3]
  },
  boss: {
    tempo: 110,
    melody: [
      { note: N.D4, dur: 0.08 }, { note: N.F4, dur: 0.08 }, { note: N.G4, dur: 0.08 }, { note: N.G5, dur: 0.12 },
      { note: N.F5, dur: 0.08 }, { note: N.D5, dur: 0.08 }, { note: N.C5, dur: 0.08 }, { note: N.D5, dur: 0.12 },
      { note: N.D4, dur: 0.08 }, { note: N.F4, dur: 0.08 }, { note: N.A4, dur: 0.08 }, { note: N.D5, dur: 0.12 },
      { note: N.C5, dur: 0.08 }, { note: N.A4, dur: 0.08 }, { note: N.F4, dur: 0.08 }, { note: N.E4, dur: 0.12 }
    ],
    bass: [N.D3, N.D3, N.D3, N.F3, N.G3, N.G3, N.F3, N.C3]
  }
};

let stepIndex = 0;

function stepBGM() {
  if (!soundEnabled || !currentBGMTrack || !MUSIC_TRACKS[currentBGMTrack]) return;

  const track = MUSIC_TRACKS[currentBGMTrack];
  const mStep = track.melody[stepIndex % track.melody.length];
  const bStep = track.bass[Math.floor(stepIndex / 2) % track.bass.length];

  if (mStep && mStep.note > 0) {
    playTone(mStep.note, mStep.dur, 'square', 0.06, true);
  }
  if (bStep && bStep > 0 && stepIndex % 2 === 0) {
    playTone(bStep, 0.18, 'triangle', 0.08, true);
  }

  stepIndex++;
}

export const Sounds = {
  setSoundEnabled(enabled) {
    soundEnabled = enabled;
    if (!enabled) {
      this.stopBGM();
    } else if (currentBGMTrack) {
      this.playBGM(currentBGMTrack);
    }
  },

  isSoundEnabled() {
    return soundEnabled;
  },

  playBGM(trackName = 'title') {
    if (currentBGMTrack === trackName && bgmTimer) return;
    this.stopBGM();
    currentBGMTrack = trackName;
    if (!soundEnabled) return;

    stepIndex = 0;
    const track = MUSIC_TRACKS[trackName];
    if (track) {
      bgmTimer = setInterval(() => stepBGM(), track.tempo);
    }
  },

  stopBGM() {
    if (bgmTimer) {
      clearInterval(bgmTimer);
      bgmTimer = null;
    }
  },

  /** Player attacks the enemy */
  playerAttack() {
    playTone(200, 0.08, 'sawtooth', 0.2, false);
    setTimeout(() => playTone(600, 0.12, 'sawtooth', 0.15), 40);
    setTimeout(() => playTone(1200, 0.08, 'square', 0.1), 80);
    setTimeout(() => playNoise(0.1, 0.08), 100);
  },

  /** Enemy attacks the player */
  enemyAttack() {
    playTone(300, 0.15, 'sawtooth', 0.2);
    setTimeout(() => playTone(150, 0.2, 'square', 0.15), 100);
    setTimeout(() => playNoise(0.15, 0.12), 150);
  },

  /** Correct answer */
  correct() {
    playTone(523, 0.1, 'square', 0.12);
    setTimeout(() => playTone(659, 0.1, 'square', 0.12), 100);
    setTimeout(() => playTone(784, 0.15, 'square', 0.12), 200);
  },

  /** Wrong answer */
  wrong() {
    playTone(300, 0.2, 'square', 0.12);
    setTimeout(() => playTone(200, 0.3, 'square', 0.12), 200);
  },

  /** Combo achieved */
  combo() {
    playTone(600, 0.08, 'sine', 0.15);
    setTimeout(() => playTone(800, 0.08, 'sine', 0.15), 80);
    setTimeout(() => playTone(1000, 0.08, 'sine', 0.15), 160);
    setTimeout(() => playTone(1200, 0.12, 'sine', 0.15), 240);
  },

  /** Enemy defeated */
  enemyDeath() {
    playTone(800, 0.1, 'square', 0.12);
    setTimeout(() => playTone(600, 0.1, 'square', 0.1), 100);
    setTimeout(() => playTone(400, 0.15, 'square', 0.08), 200);
    setTimeout(() => playTone(200, 0.3, 'sawtooth', 0.06), 300);
    setTimeout(() => playNoise(0.3, 0.05), 350);
  },

  /** Victory fanfare */
  victory() {
    this.stopBGM();
    const notes = [523, 523, 523, 698, 880, 784, 698, 880, 1047];
    const durations = [0.12, 0.12, 0.12, 0.2, 0.12, 0.12, 0.2, 0.15, 0.4];
    let time = 0;
    notes.forEach((note, i) => {
      setTimeout(() => playTone(note, durations[i], 'square', 0.12), time);
      time += durations[i] * 1000 + 30;
    });
  },

  /** Game over */
  gameOver() {
    this.stopBGM();
    playTone(400, 0.3, 'square', 0.12);
    setTimeout(() => playTone(350, 0.3, 'square', 0.1), 300);
    setTimeout(() => playTone(300, 0.3, 'square', 0.08), 600);
    setTimeout(() => playTone(200, 0.6, 'sawtooth', 0.08), 900);
  },

  /** Button hover / selection */
  select() {
    playTone(800, 0.05, 'square', 0.06);
  },

  /** Button click */
  click() {
    getAudioContext();
    playTone(1000, 0.04, 'square', 0.08);
    setTimeout(() => playTone(1200, 0.03, 'square', 0.06), 30);
  },

  /** Timer tick (last 5 seconds) */
  tick() {
    playTone(1000, 0.03, 'sine', 0.08);
  },

  /** Timer running out */
  timeWarning() {
    playTone(600, 0.08, 'square', 0.1);
    setTimeout(() => playTone(500, 0.08, 'square', 0.1), 100);
  },

  /** New round / enemy appears */
  newEnemy() {
    playTone(150, 0.2, 'sawtooth', 0.1);
    setTimeout(() => playTone(200, 0.15, 'sawtooth', 0.12), 200);
    setTimeout(() => playTone(300, 0.1, 'square', 0.1), 350);
    setTimeout(() => playNoise(0.2, 0.06), 400);
  }
};

