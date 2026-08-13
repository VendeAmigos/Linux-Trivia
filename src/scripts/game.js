// ============================================
// RPG Trivia Quest — Game Engine
// ============================================

import { gsap } from 'gsap';
import { getMixedQuestions } from './questions.js';
import { Sounds } from './sounds.js';
import { saveScore, getTopScores } from './leaderboard.js';
import {
  animateTitle,
  pulseGlow,
  float,
  fadeInScreen,
  fadeOutScreen,
  transitionScreens,
  playerAttack,
  playerIdle,
  enemyAttack,
  animateHPBar,
  comboAnimation,
  enemyEntrance,
  enemyIdle,
  enemyDeath,
  revealAnswers,
  correctAnswerFlash,
  wrongAnswerFlash,
  fadeOutButtons,
  animateTimer,
  timerWarning,
  victoryAnimation,
  defeatAnimation,
  animateLeaderboard,
  createParticles,
  dragonFireBreath
} from './animations.js';

// ============================================
// ENEMY DEFINITIONS
// ============================================
const ENEMIES = [
  { name: 'Troyano', sprite: '/assets/enemy-trojan.svg', emoji: '🐴', hp: 40, damage: 10, questionsPerRound: 2 },
  { name: 'Bug', sprite: '/assets/enemy-bug.svg', emoji: '🐛', hp: 55, damage: 12, questionsPerRound: 2 },
  { name: 'Malware', sprite: '/assets/enemy-malware.svg', emoji: '🦠', hp: 70, damage: 15, questionsPerRound: 2 },
  { name: 'Ransomware', sprite: '/assets/enemy-ransomware.svg', emoji: '🔒💀', hp: 85, damage: 18, questionsPerRound: 2 },
  { name: 'Hacker Oscuro', sprite: '/assets/enemy-hacker.svg', emoji: '👤💻', hp: 100, damage: 20, questionsPerRound: 3 },
  { name: 'Dragón del Servidor', sprite: '/assets/enemy-dragon.svg', emoji: '🐉🖥️', hp: 150, damage: 25, questionsPerRound: 4 },
];

const DIFFICULTY_MULTIPLIERS = {
  easy: { score: 1, enemyHp: 0.7, enemyDmg: 0.7, playerDmg: 1.3 },
  normal: { score: 1.5, enemyHp: 1, enemyDmg: 1, playerDmg: 1 },
  hard: { score: 2, enemyHp: 1.4, enemyDmg: 1.3, playerDmg: 0.8 },
};

const TIMER_DURATION = 15;
const BASE_DAMAGE = 20;
const BASE_SCORE = 100;

// ============================================
// GAME STATE
// ============================================
let state = {
  playerName: 'Héroe',
  difficulty: 'normal',
  playerHP: 100,
  playerMaxHP: 100,
  score: 0,
  combo: 0,
  maxCombo: 0,
  currentRound: 0,
  currentEnemy: null,
  currentEnemyHP: 0,
  currentEnemyMaxHP: 0,
  questions: [],
  currentQuestionIndex: 0,
  roundQuestionIndex: 0,
  isAnswering: false,
  timerTween: null,
  timerInterval: null,
  timeLeft: TIMER_DURATION,
  soundEnabled: true,
  enemyIdleAnim: null,
  playerIdleAnim: null,
  scoreSaved: false,
};

// ============================================
// DOM REFERENCES
// ============================================
const $ = (id) => document.getElementById(id);

// Screens
const screenTitle = $('screen-title');
const screenDifficulty = $('screen-difficulty');
const screenBattle = $('screen-battle');
const screenVictory = $('screen-victory');
const screenDefeat = $('screen-defeat');
const screenLeaderboard = $('screen-leaderboard');

// Title elements
const gameTitle = $('game-title');
const playerNameInput = $('player-name');
const btnStart = $('btn-start');
const btnLeaderboardView = $('btn-leaderboard-view');

// Difficulty
const diffCards = document.querySelectorAll('.difficulty-card');

// Battle elements
const hudRound = $('hud-round');
const hudScore = $('hud-score');
const hudCombo = $('hud-combo');
const playerSprite = $('player-sprite');
const playerDisplayName = $('player-display-name');
const playerHPBar = $('player-hp-bar');
const playerHPText = $('player-hp-text');
const playerDamage = $('player-damage');
const enemySprite = $('enemy-sprite');
const enemyNameEl = $('enemy-name');
const enemyHPBar = $('enemy-hp-bar');
const enemyHPText = $('enemy-hp-text');
const enemyDamage = $('enemy-damage');
const comboDisplay = $('combo-display');
const timerCircle = $('timer-circle');
const timerText = $('timer-text');
const timerContainer = $('timer-container');
const questionCategory = $('question-category');
const questionText = $('question-text');
const answersGrid = $('answers-grid');
const answerBtns = [0, 1, 2, 3].map(i => $(`answer-${i}`));

// Round overlay
const roundOverlay = $('round-overlay');
const roundText = $('round-text');
const enemyIntroName = $('enemy-intro-name');
const enemyIntroSprite = $('enemy-intro-sprite');

// Victory
const victoryScore = $('victory-score');
const victoryHP = $('victory-hp');
const victoryCombo = $('victory-combo');
const victoryDifficulty = $('victory-difficulty');
const btnSaveScore = $('btn-save-score');
const btnPlayAgainWin = $('btn-play-again-win');
const btnLeaderboardWin = $('btn-leaderboard-win');

// Defeat
const defeatScore = $('defeat-score');
const defeatRound = $('defeat-round');
const defeatCombo = $('defeat-combo');
const btnPlayAgainLose = $('btn-play-again-lose');
const btnLeaderboardLose = $('btn-leaderboard-lose');

// Leaderboard
const leaderboardBody = $('leaderboard-body');
const btnBackToTitle = $('btn-back-to-title');

// Sound toggle
const soundToggle = $('sound-toggle');

// Cache for inlined SVG files
const svgCache = new Map();

// Helper to render SVG sprites or emojis cleanly (inlining SVGs for layer animations)
async function renderSprite(containerEl, spritePath, defaultEmoji = '👾') {
  if (!containerEl) return;
  if (!spritePath) {
    containerEl.textContent = defaultEmoji;
    return;
  }

  // Check if it's an SVG file that needs inlining
  const isSvg = spritePath.includes('.svg');

  if (isSvg) {
    try {
      let svgText = '';
      if (svgCache.has(spritePath)) {
        svgText = svgCache.get(spritePath);
      } else {
        const res = await fetch(spritePath);
        if (res.ok) {
          svgText = await res.text();
          svgCache.set(spritePath, svgText);
        }
      }
      if (svgText && svgText.trim().startsWith('<svg')) {
        containerEl.innerHTML = svgText;
        const svgEl = containerEl.querySelector('svg');
        if (svgEl) {
          svgEl.classList.add('sprite-svg');
          svgEl.style.overflow = 'visible';
          svgEl.setAttribute('overflow', 'visible');
        }
        return;
      }
    } catch (e) {
      // Fallback to img if SVG fetch fails
    }
  }

  // For non-SVG images (.png, .gif, etc.) or paths
  if (spritePath.includes('/') || spritePath.includes('.')) {
    const cleanPath = encodeURI(spritePath);
    containerEl.innerHTML = `<img src="${cleanPath}" alt="sprite" class="sprite-svg" />`;
  } else {
    containerEl.textContent = spritePath || defaultEmoji;
  }
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
  createStarfield();
  setupEventListeners();
  animateTitleScreen();
  await renderSprite(playerSprite, '/assets/player.png', '🧙‍♂️');
  if (state.playerIdleAnim) state.playerIdleAnim.kill();
  state.playerIdleAnim = playerIdle(playerSprite);

  const logoEl = document.querySelector('.game-logo');
  if (logoEl) renderSprite(logoEl, '/assets/logo.svg', '🐧⚔️🐉');

  // Start background music on user interaction
  const startBGMOnInteraction = () => {
    if (state.soundEnabled) {
      Sounds.playBGM('title');
    }
    document.removeEventListener('click', startBGMOnInteraction);
    document.removeEventListener('keydown', startBGMOnInteraction);
  };
  document.addEventListener('click', startBGMOnInteraction);
  document.addEventListener('keydown', startBGMOnInteraction);
}

function createStarfield() {
  const starfield = $('starfield');
  if (!starfield) return;
  starfield.innerHTML = '';
  const count = 50; // Optimized star count

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      --duration: ${Math.random() * 3 + 2}s;
      animation-delay: ${Math.random() * 3}s;
      will-change: transform, opacity;
    `;
    starfield.appendChild(star);
  }
}

function animateTitleScreen() {
  setTimeout(() => {
    animateTitle(gameTitle);
    float(document.querySelector('.game-logo'));
  }, 300);
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
  // Title screen
  btnStart.addEventListener('click', () => {
    Sounds.click();
    const name = playerNameInput.value.trim();
    state.playerName = name || 'Héroe';
    showScreen(screenDifficulty);
  });

  playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btnStart.click();
  });

  btnLeaderboardView.addEventListener('click', () => {
    Sounds.click();
    showLeaderboard();
  });

  // Difficulty selection
  diffCards.forEach(card => {
    card.addEventListener('click', () => {
      Sounds.click();
      state.difficulty = card.dataset.difficulty;
      startGame();
    });

    card.addEventListener('mouseenter', () => {
      Sounds.select();
    });
  });

  // Answer buttons
  answerBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => handleAnswer(index));
    btn.addEventListener('mouseenter', () => {
      if (!btn.disabled) Sounds.select();
    });
  });

  // Victory buttons
  btnSaveScore.addEventListener('click', handleSaveScore);
  btnPlayAgainWin.addEventListener('click', () => {
    Sounds.click();
    resetAndGoToTitle();
  });
  btnLeaderboardWin.addEventListener('click', () => {
    Sounds.click();
    showLeaderboard();
  });

  // Defeat buttons
  btnPlayAgainLose.addEventListener('click', () => {
    Sounds.click();
    resetAndGoToTitle();
  });
  btnLeaderboardLose.addEventListener('click', () => {
    Sounds.click();
    showLeaderboard();
  });

  // Leaderboard back
  btnBackToTitle.addEventListener('click', () => {
    Sounds.click();
    showScreen(screenTitle);
    animateTitleScreen();
    Sounds.playBGM('title');
  });

  // Sound toggle
  if (soundToggle) {
    soundToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      state.soundEnabled = !state.soundEnabled;
      Sounds.setSoundEnabled(state.soundEnabled);
      soundToggle.textContent = state.soundEnabled ? '🔊' : '🔇';
    });
  }
}

// ============================================
// SCREEN MANAGEMENT
// ============================================
function showScreen(targetScreen) {
  const currentScreen = document.querySelector('.screen.active');
  if (currentScreen && currentScreen !== targetScreen) {
    transitionScreens(currentScreen, targetScreen);
  } else {
    targetScreen.classList.add('active');
    fadeInScreen(targetScreen);
  }
}

// ============================================
// GAME FLOW
// ============================================
async function startGame() {
  // Reset state
  state.playerHP = 100;
  state.playerMaxHP = 100;
  state.score = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.currentRound = 0;
  state.currentQuestionIndex = 0;
  state.scoreSaved = false;

  // Ensure player sprite is PNG and idle deformation is running
  await renderSprite(playerSprite, '/assets/player.png', '🧙‍♂️');
  if (state.playerIdleAnim) state.playerIdleAnim.kill();
  state.playerIdleAnim = playerIdle(playerSprite);

  // Get questions based on difficulty
  const totalQuestions = ENEMIES.reduce((sum, e) => sum + e.questionsPerRound, 0);
  state.questions = getMixedQuestions(state.difficulty, totalQuestions + 5);

  // Update player display
  playerDisplayName.textContent = state.playerName;

  // Start first round
  startRound();
}

function startRound() {
  const enemy = ENEMIES[state.currentRound];
  const mult = DIFFICULTY_MULTIPLIERS[state.difficulty];
  const isBoss = state.currentRound === ENEMIES.length - 1;

  state.currentEnemy = enemy;
  state.currentEnemyMaxHP = Math.round(enemy.hp * mult.enemyHp);
  state.currentEnemyHP = state.currentEnemyMaxHP;
  state.roundQuestionIndex = 0;

  // Start BGM: specific MP3 track for current enemy / round
  const roundTracks = ['round1', 'round2', 'round3', 'round4', 'round5', 'boss'];
  const musicTrack = roundTracks[state.currentRound] || 'boss';
  Sounds.playBGM(musicTrack);

  // Kill previous idle animation
  if (state.enemyIdleAnim) {
    state.enemyIdleAnim.kill();
  }

  // Show round overlay
  showRoundOverlay(enemy, () => {
    showScreen(screenBattle);
    updateBattleUI();
    setupEnemy(enemy);
    showQuestion();
  });
}

function showRoundOverlay(enemy, onComplete) {
  const isBoss = state.currentRound === ENEMIES.length - 1;

  roundText.textContent = isBoss ? '⚠️ JEFE FINAL ⚠️' : `Ronda ${state.currentRound + 1}`;
  enemyIntroName.textContent = `¡${enemy.name} aparece!`;
  gsap.killTweensOf(enemyIntroSprite);
  gsap.set(enemyIntroSprite, { clearProps: 'all' });
  enemyIntroSprite.removeAttribute('style');
  renderSprite(enemyIntroSprite, enemy.sprite, enemy.emoji);

  roundOverlay.classList.add('active');

  Sounds.newEnemy();

  const tl = gsap.timeline();

  tl.to(roundOverlay, { opacity: 1, duration: 0.3 });

  tl.fromTo(roundText,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }
  );

  tl.fromTo(enemyIntroSprite,
    { scale: 0, rotate: -180 },
    { scale: 1, rotate: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' },
    '-=0.2'
  );

  tl.fromTo(enemyIntroName,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4 },
    '-=0.3'
  );

  // Hold for a moment, then fade out
  tl.to(roundOverlay, {
    opacity: 0,
    duration: 0.5,
    delay: 1.2,
    onComplete: () => {
      roundOverlay.classList.remove('active');
      if (onComplete) onComplete();
    }
  });
}

async function setupEnemy(enemy) {
  if (state.enemyIdleAnim) {
    state.enemyIdleAnim.kill();
    state.enemyIdleAnim = null;
  }

  // Clear GSAP properties and styles left on enemySprite from previous death animation
  gsap.killTweensOf(enemySprite);
  gsap.set(enemySprite, { clearProps: 'all' });
  enemySprite.removeAttribute('style');

  await renderSprite(enemySprite, enemy.sprite, enemy.emoji);
  enemyNameEl.textContent = enemy.name;

  // Enemy entrance animation
  enemyEntrance($('enemy-character'));

  // Start idle animation
  setTimeout(() => {
    state.enemyIdleAnim = enemyIdle(enemySprite);
  }, 800);
}

function updateBattleUI() {
  hudRound.textContent = `${state.currentRound + 1}/${ENEMIES.length}`;
  hudScore.textContent = state.score;
  hudCombo.textContent = `x${state.combo}`;

  // Player HP
  const playerHPPercent = (state.playerHP / state.playerMaxHP) * 100;
  playerHPBar.style.width = `${playerHPPercent}%`;
  playerHPText.textContent = `${state.playerHP}/${state.playerMaxHP}`;

  // Enemy HP
  const enemyHPPercent = (state.currentEnemyHP / state.currentEnemyMaxHP) * 100;
  enemyHPBar.style.width = `${enemyHPPercent}%`;
  enemyHPText.textContent = `${state.currentEnemyHP}/${state.currentEnemyMaxHP}`;

  // Update HP bar colors
  updateHPBarColor(playerHPBar, playerHPPercent);
  updateHPBarColor(enemyHPBar, enemyHPPercent);
}

function updateHPBarColor(bar, percent) {
  if (percent <= 25) {
    bar.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
  } else if (percent <= 50) {
    bar.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
  } else {
    bar.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
  }
}

// ============================================
// QUESTION SYSTEM
// ============================================
function showQuestion() {
  if (state.currentQuestionIndex >= state.questions.length) {
    // Ran out of questions — generate more
    const extra = getMixedQuestions(state.difficulty, 10);
    state.questions.push(...extra);
  }

  const q = state.questions[state.currentQuestionIndex];

  questionCategory.textContent = q.category;
  questionText.textContent = q.question;

  // Fully reset button styles, animations and classes for the new question
  answerBtns.forEach((btn, i) => {
    gsap.killTweensOf(btn);
    gsap.set(btn, { clearProps: 'all' });
    btn.removeAttribute('style');
    const textSpan = btn.querySelector('.answer-text');
    if (textSpan) textSpan.textContent = q.options[i];
    btn.disabled = false;
    btn.className = 'answer-btn';
  });

  state.isAnswering = true;

  // Reveal answers with animation
  revealAnswers(answerBtns);

  // Start timer
  startTimer();
}


// ============================================
// TIMER
// ============================================
function startTimer() {
  state.timeLeft = TIMER_DURATION;
  timerText.textContent = TIMER_DURATION;
  timerCircle.classList.remove('warning', 'danger');

  // Kill previous timer animations
  if (state.timerTween) state.timerTween.kill();
  if (state.timerInterval) clearInterval(state.timerInterval);

  // Reset circle
  gsap.set(timerCircle, { strokeDashoffset: 0 });

  // Animate circle
  state.timerTween = animateTimer(timerCircle, TIMER_DURATION);

  // Countdown
  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    timerText.textContent = Math.max(0, state.timeLeft);

    if (state.timeLeft <= 5 && state.timeLeft > 0) {
      timerCircle.classList.add('warning');
      if (state.timeLeft <= 3) {
        timerCircle.classList.add('danger');
      }
      Sounds.tick();
    }

    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      if (state.isAnswering) {
        // Time's up — treat as wrong answer
        handleAnswer(-1);
      }
    }
  }, 1000);
}

function stopTimer() {
  if (state.timerTween) state.timerTween.kill();
  if (state.timerInterval) clearInterval(state.timerInterval);
}

// ============================================
// ANSWER HANDLING
// ============================================
async function handleAnswer(selectedIndex) {
  if (!state.isAnswering) return;
  state.isAnswering = false;
  stopTimer();

  const q = state.questions[state.currentQuestionIndex];
  const isCorrect = selectedIndex === q.correctIndex;

  // Disable all buttons
  answerBtns.forEach(btn => btn.disabled = true);

  // Highlight correct answer
  answerBtns[q.correctIndex].classList.add('correct');

  if (isCorrect) {
    await handleCorrectAnswer(selectedIndex);
  } else {
    if (selectedIndex >= 0) {
      answerBtns[selectedIndex].classList.add('wrong');
    }
    await handleWrongAnswer();
  }

  state.currentQuestionIndex++;
  state.roundQuestionIndex++;

  // Check if enemy is dead
  if (state.currentEnemyHP <= 0) {
    await handleEnemyDefeated();
    return;
  }

  // Check if player is dead
  if (state.playerHP <= 0) {
    handlePlayerDefeated();
    return;
  }

  // Check if round questions are done but enemy still alive
  // Continue asking questions until enemy dies or player dies
  setTimeout(() => showQuestion(), 800);
}

async function handleCorrectAnswer(selectedIndex) {
  Sounds.correct();
  correctAnswerFlash(answerBtns[selectedIndex]);

  // Calculate damage
  const mult = DIFFICULTY_MULTIPLIERS[state.difficulty];
  state.combo++;
  if (state.combo > state.maxCombo) state.maxCombo = state.combo;

  const comboMult = Math.min(state.combo, 5);
  const damage = Math.round(BASE_DAMAGE * mult.playerDmg * (1 + comboMult * 0.15));

  // Calculate score
  const timeBonus = Math.round(state.timeLeft * 5);
  const scoreGained = Math.round(BASE_SCORE * mult.score * (1 + comboMult * 0.1) + timeBonus);
  state.score += scoreGained;

  // Show combo
  if (state.combo >= 2) {
    Sounds.combo();
    comboDisplay.textContent = `🔥 COMBO x${state.combo}!`;
    comboAnimation(comboDisplay);
  }

  // Show damage number
  enemyDamage.textContent = `-${damage}`;
  enemyDamage.style.color = '#fbbf24';

  // Stop idle animation and reset transforms
  if (state.playerIdleAnim) {
    state.playerIdleAnim.kill();
    state.playerIdleAnim = null;
  }
  gsap.set(playerSprite, { clearProps: 'transform' });

  // Play attack GIF animation (adding timestamp to ensure frame 0 restart)
  await renderSprite(playerSprite, '/assets/player animation.gif?t=' + Date.now());

  // Player attack animation
  Sounds.playerAttack();
  await playerAttack(
    $('player-character'),
    $('enemy-character'),
    enemyDamage
  );

  // Return to resting PNG & restart idle top-edge deformation
  await renderSprite(playerSprite, '/assets/player.png');
  state.playerIdleAnim = playerIdle(playerSprite);

  // Apply damage to enemy
  state.currentEnemyHP = Math.max(0, state.currentEnemyHP - damage);
  updateBattleUI();
}

async function handleWrongAnswer() {
  Sounds.wrong();

  // Reset combo
  state.combo = 0;

  // Calculate enemy damage
  const mult = DIFFICULTY_MULTIPLIERS[state.difficulty];
  const damage = Math.round(state.currentEnemy.damage * mult.enemyDmg);

  // Show damage number
  playerDamage.textContent = `-${damage}`;
  playerDamage.style.color = '#ef4444';

  // Dragon fire breath for boss
  if (state.currentRound === ENEMIES.length - 1) {
    dragonFireBreath($('battle-area'));
  }

  // Enemy attack animation
  Sounds.enemyAttack();
  await enemyAttack(
    $('enemy-character'),
    $('player-character'),
    playerDamage
  );

  // Apply damage to player
  state.playerHP = Math.max(0, state.playerHP - damage);
  updateBattleUI();
}

async function handleEnemyDefeated() {
  // Kill idle animation
  if (state.enemyIdleAnim) {
    state.enemyIdleAnim.kill();
  }

  Sounds.enemyDeath();
  await enemyDeath(enemySprite);

  state.currentRound++;

  if (state.currentRound >= ENEMIES.length) {
    // ALL ENEMIES DEFEATED — VICTORY!
    handleVictory();
  } else {
    // Next round
    setTimeout(() => startRound(), 500);
  }
}

function handleVictory() {
  // HP bonus
  const hpBonus = state.playerHP * 10;
  state.score += hpBonus;

  Sounds.victory();

  // Show victory screen
  victoryScore.textContent = state.score.toLocaleString();
  victoryHP.textContent = `${state.playerHP}/${state.playerMaxHP}`;
  victoryCombo.textContent = `x${state.maxCombo}`;

  const diffNames = { easy: 'Fácil', normal: 'Normal', hard: 'Difícil' };
  victoryDifficulty.textContent = diffNames[state.difficulty];

  btnSaveScore.disabled = false;
  btnSaveScore.textContent = '💾 Guardar Puntaje';

  showScreen(screenVictory);

  setTimeout(() => {
    victoryAnimation(screenVictory);
  }, 500);
}

function handlePlayerDefeated() {
  Sounds.playBGM('defeat');
  Sounds.gameOver();

  defeatScore.textContent = state.score.toLocaleString();
  defeatRound.textContent = `${state.currentRound + 1}/${ENEMIES.length}`;
  defeatCombo.textContent = `x${state.maxCombo}`;

  showScreen(screenDefeat);

  setTimeout(() => {
    defeatAnimation(screenDefeat);
  }, 500);
}

// ============================================
// SAVE SCORE
// ============================================
async function handleSaveScore() {
  if (state.scoreSaved) return;

  btnSaveScore.disabled = true;
  btnSaveScore.textContent = '⏳ Guardando...';

  const result = await saveScore({
    playerName: state.playerName,
    score: state.score,
    difficulty: state.difficulty,
    hpRemaining: state.playerHP,
    comboMax: state.maxCombo
  });

  if (result.success) {
    state.scoreSaved = true;
    btnSaveScore.textContent = '✅ ¡Guardado!';
    Sounds.correct();

    if (result.local) {
      btnSaveScore.textContent = '✅ Guardado (local)';
    }
  } else {
    btnSaveScore.textContent = '❌ Error';
    btnSaveScore.disabled = false;
  }
}

// ============================================
// LEADERBOARD
// ============================================
async function showLeaderboard() {
  showScreen(screenLeaderboard);

  leaderboardBody.innerHTML = '<div class="leaderboard-empty"><div class="loading"></div> Cargando...</div>';

  const result = await getTopScores(10);

  if (!result.data || result.data.length === 0) {
    leaderboardBody.innerHTML = '<div class="leaderboard-empty">🏜️ No hay puntajes aún.<br/>¡Sé el primero en derrotar al dragón!</div>';
    return;
  }

  const diffLabels = { easy: 'Fácil', normal: 'Normal', hard: 'Difícil' };
  const diffColors = { easy: '#22c55e', normal: '#fbbf24', hard: '#ef4444' };

  leaderboardBody.innerHTML = result.data.map((entry, i) => {
    const rank = i + 1;
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}`;
    const diff = entry.difficulty || 'normal';

    return `
      <div class="leaderboard-row">
        <div class="leaderboard-rank">${medal}</div>
        <div class="leaderboard-name">${escapeHTML(entry.player_name)}</div>
        <div class="leaderboard-score">${entry.score.toLocaleString()}</div>
        <div class="leaderboard-difficulty" style="color: ${diffColors[diff]}">${diffLabels[diff] || diff}</div>
      </div>
    `;
  }).join('');

  // Animate entries
  const rows = leaderboardBody.querySelectorAll('.leaderboard-row');
  animateLeaderboard(rows);

  if (result.local) {
    const note = document.createElement('div');
    note.className = 'leaderboard-empty';
    note.style.fontSize = '0.5rem';
    note.style.padding = '0.5rem';
    note.textContent = '📍 Puntajes locales (configura Supabase para puntajes globales)';
    leaderboardBody.appendChild(note);
  }
}

// ============================================
// UTILITIES
// ============================================
async function resetAndGoToTitle() {
  stopTimer();
  if (state.enemyIdleAnim) state.enemyIdleAnim.kill();
  if (state.playerIdleAnim) state.playerIdleAnim.kill();

  await renderSprite(playerSprite, '/assets/player.png', '🧙‍♂️');
  state.playerIdleAnim = playerIdle(playerSprite);

  state.playerHP = 100;
  state.score = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.currentRound = 0;
  state.currentQuestionIndex = 0;
  state.scoreSaved = false;

  showScreen(screenTitle);
  animateTitleScreen();
  Sounds.playBGM('title');
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================
// START
// ============================================
document.addEventListener('DOMContentLoaded', init);

// Also handle Astro page load
document.addEventListener('astro:page-load', init);

// Fallback: if DOM is already ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init();
}
