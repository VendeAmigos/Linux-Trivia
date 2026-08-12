// ============================================
// RPG Trivia Quest — Sound Effects (Web Audio API)
// ============================================

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(frequency, duration, type = 'square', volume = 0.15, rampDown = true) {
  try {
    const ctx = getAudioContext();
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
  try {
    const ctx = getAudioContext();
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

export const Sounds = {
  /** Player attacks the enemy */
  playerAttack() {
    const ctx = getAudioContext();
    // Slash sound - rising frequency
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
