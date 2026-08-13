// ============================================
// RPG Trivia Quest — Sound & 8-Bit BGM Engine (Web Audio API)
// ============================================

let audioCtx = null;
let bgmTimer = null;
let currentBGMTrack = null;
let soundEnabled = true;
let lofiFilter = null;

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

function getLofiFilter(ctx) {
  if (!lofiFilter || lofiFilter.context !== ctx) {
    lofiFilter = ctx.createBiquadFilter();
    lofiFilter.type = 'lowpass';
    lofiFilter.frequency.setValueAtTime(1100, ctx.currentTime);
    lofiFilter.connect(ctx.destination);
  }
  return lofiFilter;
}

function playTone(frequency, duration, type = 'sine', volume = 0.08, rampDown = true, isLofi = false) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);

    if (rampDown) {
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    }

    osc.connect(gain);
    if (isLofi) {
      gain.connect(getLofiFilter(ctx));
    } else {
      gain.connect(ctx.destination);
    }

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Silently fail if audio is not available
  }
}

function playNoise(duration, volume = 0.06) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
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
// CHILL LO-FI SYNTHESIZER FOR BACKGROUND MUSIC
// ============================================

// Note frequencies (Hz)
const N = {
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  Bb3: 233.08, Eb4: 311.13, Ab4: 415.30, Bb4: 466.16,
  OFF: 0
};

// Warm Lo-Fi Jazz Chord Tracks
const MUSIC_TRACKS = {
  title: {
    tempo: 260, // ~70 BPM chill lo-fi
    melody: [
      { chord: [N.E4, N.G4, N.B4, N.D5], dur: 0.5 }, { chord: [N.G4, N.B4], dur: 0.3 },
      { chord: [N.D4, N.F4, N.A4, N.C5], dur: 0.5 }, { chord: [N.F4, N.A4], dur: 0.3 },
      { chord: [N.C4, N.E4, N.G4, N.B4], dur: 0.5 }, { chord: [N.E4, N.G4], dur: 0.3 },
      { chord: [N.B3, N.D4, N.F4, N.A4], dur: 0.5 }, { chord: [N.D4, N.F4], dur: 0.3 }
    ],
    bass: [N.E2, N.E2, N.D2, N.D2, N.C2, N.C2, N.B2, N.B2]
  },
  battle: {
    tempo: 220, // ~80 BPM chill lofi groove
    melody: [
      { chord: [N.A4, N.C5, N.E5, N.G5], dur: 0.4 }, { chord: [N.C5, N.E5], dur: 0.25 },
      { chord: [N.F4, N.A4, N.C5, N.E5], dur: 0.4 }, { chord: [N.A4, N.C5], dur: 0.25 },
      { chord: [N.D4, N.F4, N.A4, N.C5], dur: 0.4 }, { chord: [N.F4, N.A4], dur: 0.25 },
      { chord: [N.E4, N.G4, N.B4, N.D5], dur: 0.4 }, { chord: [N.G4, N.B4], dur: 0.25 }
    ],
    bass: [N.A2, N.A2, N.F2, N.F2, N.D2, N.D2, N.E2, N.E2]
  },
  boss: {
    tempo: 240, // ~75 BPM dark lofi ambience
    melody: [
      { chord: [N.D4, N.F4, N.A4, N.C5], dur: 0.45 }, { chord: [N.F4, N.A4], dur: 0.3 },
      { chord: [N.Bb3, N.D4, N.F4, N.A4], dur: 0.45 }, { chord: [N.D4, N.F4], dur: 0.3 },
      { chord: [N.G3, N.Bb3, N.D4, N.F4], dur: 0.45 }, { chord: [N.Bb3, N.D4], dur: 0.3 },
      { chord: [N.A3, N.C4, N.E4, N.G4], dur: 0.45 }, { chord: [N.C4, N.E4], dur: 0.3 }
    ],
    bass: [N.D2, N.D2, N.Bb3, N.Bb3, N.G2, N.G2, N.A2, N.A2]
  }
};

let stepIndex = 0;

function playVinylCrackle() {
  if (!soundEnabled || Math.random() > 0.3) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const bufferSize = Math.floor(ctx.sampleRate * 0.03);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.015;
    }
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3500;

    source.buffer = buffer;
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    source.connect(filter);
    filter.connect(ctx.destination);
    source.start(ctx.currentTime);
  } catch (e) {}
}

function stepBGM() {
  if (!soundEnabled || !currentBGMTrack || !MUSIC_TRACKS[currentBGMTrack]) return;

  const track = MUSIC_TRACKS[currentBGMTrack];
  const mStep = track.melody[stepIndex % track.melody.length];
  const bStep = track.bass[Math.floor(stepIndex / 2) % track.bass.length];

  if (mStep && mStep.chord) {
    mStep.chord.forEach((freq, idx) => {
      if (freq > 0) {
        setTimeout(() => {
          playTone(freq, mStep.dur, 'sine', 0.035, true, true);
        }, idx * 15);
      }
    });
  }

  if (bStep && bStep > 0 && stepIndex % 2 === 0) {
    playTone(bStep, 0.4, 'triangle', 0.06, true, true);
  }

  playVinylCrackle();

  stepIndex++;
}

// Audio File Mapping for Background Music
const MUSIC_FILES = {
  title: '/assets/musica/INICIO ANTES DE ENTERAR.mp3',
  round1: '/assets/musica/primer jefe.mp3',
  round2: '/assets/musica/segundo jefe.mp3',
  round3: '/assets/musica/TERCER JEFE.mp3',
  round4: '/assets/musica/cuarto jefe.mp3',
  round5: '/assets/musica/quinto jefe.mp3',
  boss: '/assets/musica/pelea final.mp3',
  defeat: '/assets/musica/muerte.mp3'
};

let bgmAudio = null;

export const Sounds = {
  setSoundEnabled(enabled) {
    soundEnabled = enabled;
    if (!enabled) {
      this.stopBGM();
      if (audioCtx && audioCtx.state === 'running') {
        try { audioCtx.suspend(); } catch (e) {}
      }
    } else {
      if (audioCtx && audioCtx.state === 'suspended') {
        try { audioCtx.resume(); } catch (e) {}
      }
      if (currentBGMTrack) {
        this.playBGM(currentBGMTrack);
      }
    }
  },

  isSoundEnabled() {
    return soundEnabled;
  },

  playBGM(trackName = 'title') {
    if (currentBGMTrack === trackName && bgmAudio && !bgmAudio.paused) return;

    this.stopBGM();
    currentBGMTrack = trackName;

    if (!soundEnabled) return;

    const file = MUSIC_FILES[trackName];
    if (file) {
      try {
        bgmAudio = new Audio(encodeURI(file));
        bgmAudio.loop = (trackName !== 'defeat');
        bgmAudio.volume = 0.25; // 50% lower volume as requested

        const playPromise = bgmAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
        return;
      } catch (e) {
        // Fallback to synth if audio fails
      }
    }

    // Fallback: synthesized BGM
    stepIndex = 0;
    const track = MUSIC_TRACKS[trackName] || MUSIC_TRACKS['title'];
    if (track) {
      bgmTimer = setInterval(() => stepBGM(), track.tempo);
    }
  },

  stopBGM() {
    if (bgmAudio) {
      try {
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
      } catch (e) {}
      bgmAudio = null;
    }
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

