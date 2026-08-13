// ============================================
// RPG Trivia Quest — GSAP Animations Module
// ============================================

import { gsap } from 'gsap';

// ============================================
// SCREEN TRANSITIONS
// ============================================

/**
 * Fade in a screen element
 */
export function fadeInScreen(element, duration = 0.6) {
  return gsap.fromTo(element,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration, ease: 'power2.out' }
  );
}

/**
 * Fade out a screen element
 */
export function fadeOutScreen(element, duration = 0.4) {
  return gsap.to(element,
    { opacity: 0, y: -20, duration, ease: 'power2.in' }
  );
}

/**
 * Transition between two screens
 */
export function transitionScreens(fromEl, toEl, onMidpoint) {
  const tl = gsap.timeline();

  tl.to(fromEl, {
    opacity: 0,
    scale: 0.95,
    duration: 0.4,
    ease: 'power2.in',
    onComplete: () => {
      fromEl.classList.remove('active');
      if (onMidpoint) onMidpoint();
      toEl.classList.add('active');
    }
  });

  tl.fromTo(toEl,
    { opacity: 0, scale: 1.05 },
    { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
  );

  return tl;
}

// ============================================
// TITLE SCREEN
// ============================================

/**
 * Animate title text letter by letter with glow
 */
export function animateTitle(titleElement) {
  const text = titleElement.textContent;
  titleElement.textContent = '';

  const chars = text.split('').map(char => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    if (char === ' ') span.style.width = '0.3em';
    titleElement.appendChild(span);
    return span;
  });

  return gsap.fromTo(chars,
    { opacity: 0, y: -40, rotateX: 90, scale: 0.5 },
    {
      opacity: 1, y: 0, rotateX: 0, scale: 1,
      duration: 0.6,
      stagger: 0.06,
      ease: 'back.out(2)',
    }
  );
}

/**
 * Pulsing glow effect for the title
 */
export function pulseGlow(element) {
  return gsap.to(element, {
    textShadow: '0 0 40px rgba(168, 85, 247, 0.8), 0 0 80px rgba(168, 85, 247, 0.4)',
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

/**
 * Floating animation
 */
export function float(element) {
  return gsap.to(element, {
    y: -10,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

// ============================================
// COMBAT ANIMATIONS
// ============================================

/**
 * Player attack slash animation
 */
export function playerAttack(playerEl, enemyEl, damageEl) {
  const tl = gsap.timeline();

  // Player lunges forward
  tl.to(playerEl, {
    x: 60,
    duration: 0.15,
    ease: 'power3.in'
  });

  // Slash effect flash
  tl.to(enemyEl, {
    filter: 'brightness(3) saturate(0)',
    duration: 0.08,
    ease: 'none'
  });

  // Screen shake
  tl.to('.game-battle-area', {
    x: 8,
    duration: 0.05,
    repeat: 5,
    yoyo: true,
    ease: 'none'
  }, '<');

  // Enemy hit reaction
  tl.to(enemyEl, {
    x: 15,
    filter: 'brightness(1.5) saturate(1)',
    duration: 0.1,
    ease: 'power2.out'
  });

  // Show damage number
  if (damageEl) {
    tl.fromTo(damageEl,
      { opacity: 0, y: 0, scale: 0.5 },
      { opacity: 1, y: -40, scale: 1.3, duration: 0.4, ease: 'back.out(2)' },
      '<'
    );
    tl.to(damageEl,
      { opacity: 0, y: -80, duration: 0.5, ease: 'power2.in' }
    );
  }

  // Reset positions
  tl.to(playerEl, { x: 0, duration: 0.3, ease: 'power2.out' }, '-=0.3');
  tl.to(enemyEl, { x: 0, filter: 'brightness(1) saturate(1)', duration: 0.3, ease: 'power2.out' }, '<');
  tl.to('.game-battle-area', { x: 0, duration: 0.1 }, '<');

  return tl;
}

/**
 * Enemy attack animation (Launches #ataque red energy sphere at player for custom monsters)
 */
export function enemyAttack(enemyEl, playerEl, damageEl) {
  const tl = gsap.timeline();

  // Find internal SVG layers (e.g. for Trojan enemy)
  const crazo = enemyEl.querySelector('#crazo');
  const brazoIzquierdo = enemyEl.querySelector('#brazo_izquierdo');
  const manoDerecha = enemyEl.querySelector('#mano_derecha');
  const ataque = enemyEl.querySelector('#ataque');

  if (ataque) {
    // ============================================
    // LAUNCH RED SPHERE PROJECTILE (#ataque)
    // ============================================
    // Step 1: Wind-up & Charge Energy in the Sphere above hands
    if (crazo) tl.to(crazo, { rotation: -35, transformOrigin: '625px 590px', duration: 0.15, ease: 'power2.in' }, 0);
    if (brazoIzquierdo) tl.to(brazoIzquierdo, { rotation: 25, transformOrigin: '428px 627px', duration: 0.15, ease: 'power2.in' }, 0);

    tl.fromTo(ataque,
      { opacity: 1, scale: 1, x: 0, y: 0, rotation: 0, transformOrigin: 'center center' },
      { opacity: 1, scale: 1.4, rotation: 180, duration: 0.15, ease: 'power2.out' },
      0
    );

    // Step 2: Throw arms forward & LAUNCH RED SPHERE at player!
    if (crazo) tl.to(crazo, { rotation: 45, transformOrigin: '625px 590px', duration: 0.2, ease: 'power3.out' });
    if (brazoIzquierdo) tl.to(brazoIzquierdo, { rotation: -30, transformOrigin: '428px 627px', duration: 0.2, ease: 'power3.out' }, '<');
    if (manoDerecha) tl.to(manoDerecha, { x: -20, duration: 0.2 }, '<');

    tl.to(ataque, {
      x: -450,
      y: 40,
      rotation: 720,
      scale: 1.7,
      duration: 0.35,
      ease: 'power2.in'
    }, '<');

    // Step 3: Sphere Explosion on Player Impact
    tl.to(ataque, {
      opacity: 0,
      scale: 2.8,
      duration: 0.15,
      ease: 'power1.out'
    });

    // Screen flash red & heavy shake
    tl.to('.game-battle-area', {
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      duration: 0.05
    }, '<');

    tl.to('.game-battle-area', {
      x: -15,
      duration: 0.04,
      repeat: 7,
      yoyo: true,
      ease: 'none'
    }, '<');

    // Player hit reaction
    tl.to(playerEl, {
      x: -30,
      filter: 'brightness(2.5) hue-rotate(340deg)',
      duration: 0.1,
      ease: 'power2.out'
    }, '<');

    // Show damage number
    if (damageEl) {
      tl.fromTo(damageEl,
        { opacity: 0, y: 0, scale: 0.5 },
        { opacity: 1, y: -40, scale: 1.3, duration: 0.4, ease: 'back.out(2)' },
        '<'
      );
      tl.to(damageEl,
        { opacity: 0, y: -80, duration: 0.5, ease: 'power2.in' }
      );
    }

    // Step 4: Reset Sphere back to hands (opacity: 1) & Monster Posture
    tl.to('.game-battle-area', { backgroundColor: 'transparent', duration: 0.3 }, '-=0.4');
    tl.set(ataque, { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 });
    if (crazo) tl.to(crazo, { rotation: 0, duration: 0.3 }, '<');
    if (brazoIzquierdo) tl.to(brazoIzquierdo, { rotation: 0, duration: 0.3 }, '<');
    if (manoDerecha) tl.to(manoDerecha, { x: 0, duration: 0.3 }, '<');
    tl.to(playerEl, { x: 0, filter: 'brightness(1) hue-rotate(0deg)', duration: 0.3, ease: 'power2.out' }, '<');
    tl.to('.game-battle-area', { x: 0, duration: 0.1 }, '<');

    return tl;
  }

  // Fallback animation for monsters without #ataque layer
  if (crazo) tl.to(crazo, { rotation: -35, transformOrigin: '625px 590px', duration: 0.15, ease: 'power2.in' }, 0);
  if (brazoIzquierdo) tl.to(brazoIzquierdo, { rotation: 20, transformOrigin: '428px 627px', duration: 0.15, ease: 'power2.in' }, 0);

  tl.to(enemyEl, {
    x: -60,
    scale: 1.15,
    duration: 0.2,
    ease: 'power3.in'
  });

  if (crazo) tl.to(crazo, { rotation: 45, transformOrigin: '625px 590px', duration: 0.15, ease: 'power3.out' }, '<');
  if (brazoIzquierdo) tl.to(brazoIzquierdo, { rotation: -30, transformOrigin: '428px 627px', duration: 0.15, ease: 'power3.out' }, '<');
  if (manoDerecha) tl.to(manoDerecha, { x: -20, duration: 0.15 }, '<');

  tl.to('.game-battle-area', {
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    duration: 0.05
  }, '<');

  tl.to('.game-battle-area', {
    x: -12,
    duration: 0.04,
    repeat: 7,
    yoyo: true,
    ease: 'none'
  }, '<');

  tl.to(playerEl, {
    x: -25,
    filter: 'brightness(2) hue-rotate(340deg)',
    duration: 0.1,
    ease: 'power2.out'
  });

  if (damageEl) {
    tl.fromTo(damageEl,
      { opacity: 0, y: 0, scale: 0.5 },
      { opacity: 1, y: -40, scale: 1.3, duration: 0.4, ease: 'back.out(2)' },
      '<'
    );
    tl.to(damageEl,
      { opacity: 0, y: -80, duration: 0.5, ease: 'power2.in' }
    );
  }

  tl.to('.game-battle-area', { backgroundColor: 'transparent', duration: 0.3 }, '-=0.5');
  tl.to(enemyEl, { x: 0, scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' }, '-=0.3');
  if (crazo) tl.to(crazo, { rotation: 0, duration: 0.3 }, '<');
  if (brazoIzquierdo) tl.to(brazoIzquierdo, { rotation: 0, duration: 0.3 }, '<');
  if (manoDerecha) tl.to(manoDerecha, { x: 0, duration: 0.3 }, '<');
  tl.to(playerEl, { x: 0, filter: 'brightness(1) hue-rotate(0deg)', duration: 0.3, ease: 'power2.out' }, '<');
  tl.to('.game-battle-area', { x: 0, duration: 0.1 }, '<');

  return tl;
}

/**
 * HP bar damage animation
 */
export function animateHPBar(barEl, fromPercent, toPercent) {
  return gsap.to(barEl, {
    width: `${toPercent}%`,
    duration: 0.5,
    ease: 'power2.out',
    onUpdate: function () {
      const current = parseFloat(barEl.style.width);
      if (current <= 25) {
        barEl.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
      } else if (current <= 50) {
        barEl.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
      } else {
        barEl.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
      }
    }
  });
}

/**
 * Combo counter bounce effect
 */
export function comboAnimation(comboEl) {
  const tl = gsap.timeline();

  tl.fromTo(comboEl,
    { scale: 0.3, opacity: 0 },
    { scale: 1.4, opacity: 1, duration: 0.2, ease: 'back.out(3)' }
  );

  tl.to(comboEl, {
    scale: 1,
    duration: 0.3,
    ease: 'elastic.out(1, 0.4)'
  });

  // Glow pulse
  tl.to(comboEl, {
    textShadow: '0 0 20px rgba(250, 204, 21, 0.9), 0 0 40px rgba(250, 204, 21, 0.5)',
    duration: 0.5,
    repeat: 2,
    yoyo: true,
    ease: 'sine.inOut'
  }, '<');

  return tl;
}

// ============================================
// ENEMY ANIMATIONS
// ============================================

/**
 * Enemy entrance animation
 */
export function enemyEntrance(enemyEl) {
  const tl = gsap.timeline();

  // Clear previous tweens and styles on both container and child sprite
  gsap.killTweensOf(enemyEl);
  gsap.set(enemyEl, { clearProps: 'all' });
  const sprite = enemyEl.querySelector('#enemy-sprite') || enemyEl;
  gsap.killTweensOf(sprite);
  gsap.set(sprite, { clearProps: 'all' });

  tl.fromTo(enemyEl,
    { x: 300, opacity: 0, scale: 0.5, rotate: 15 },
    { x: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.5)' }
  );

  // Intimidation shake
  tl.to(enemyEl, {
    x: 3,
    duration: 0.05,
    repeat: 5,
    yoyo: true,
    ease: 'none'
  });

  return tl;
}

/**
 * Player idle breathing deformation animation
 * Deforms top edge up and down ~5% (Photoshop Shift top edge vertical deform)
 */
export function playerIdle(playerSpriteEl) {
  if (!playerSpriteEl) return null;

  gsap.killTweensOf(playerSpriteEl);
  gsap.set(playerSpriteEl, { transformOrigin: '25% 100%' });

  return gsap.to(playerSpriteEl, {
    scaleY: 0.95,
    duration: 1.1,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

/**
 * Enemy idle breathing animation (Supports multi-layer SVG animations)
 */
export function enemyIdle(enemyEl) {
  const tl = gsap.timeline({ repeat: -1, yoyo: true });

  const crazo = enemyEl.querySelector('#crazo');
  const brazoIzquierdo = enemyEl.querySelector('#brazo_izquierdo');
  const cuello = enemyEl.querySelector('#cuello');
  const ataque = enemyEl.querySelector('#ataque');

  // Keep ataque layer visible as part of the full monster
  if (ataque) {
    gsap.set(ataque, { opacity: 1 });
  }

  // If internal SVG layers exist (e.g. Trojan enemy)
  if (crazo || brazoIzquierdo) {
    if (crazo) {
      tl.to(crazo, { rotation: 6, transformOrigin: '625px 590px', duration: 1.4, ease: 'sine.inOut' }, 0);
    }
    if (brazoIzquierdo) {
      tl.to(brazoIzquierdo, { rotation: -5, transformOrigin: '428px 627px', duration: 1.3, ease: 'sine.inOut' }, 0);
    }
    if (cuello) {
      tl.to(cuello, { scaleY: 1.04, transformOrigin: '50% 100%', duration: 1.2, ease: 'sine.inOut' }, 0);
    }
    if (ataque) {
      tl.to(ataque, { scale: 1.04, transformOrigin: 'center center', duration: 1.4, ease: 'sine.inOut' }, 0);
    }
    tl.to(enemyEl, { scaleY: 1.02, scaleX: 0.98, duration: 1.2, ease: 'sine.inOut' }, 0);
    return tl;
  }

  // Default idle animation
  return gsap.to(enemyEl, {
    scaleY: 1.03,
    scaleX: 0.97,
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

/**
 * Enemy death dissolve animation
 */
export function enemyDeath(enemyEl) {
  const tl = gsap.timeline();

  // Flash white
  tl.to(enemyEl, {
    filter: 'brightness(5)',
    duration: 0.2,
    repeat: 3,
    yoyo: true
  });

  // Dissolve
  tl.to(enemyEl, {
    opacity: 0,
    scale: 1.5,
    filter: 'blur(10px) brightness(3)',
    duration: 0.8,
    ease: 'power2.in',
    onComplete: () => {
      // Clear properties on completion so next enemy won't inherit opacity: 0
      gsap.set(enemyEl, { clearProps: 'all' });
      const sprite = enemyEl.querySelector('#enemy-sprite') || enemyEl;
      gsap.set(sprite, { clearProps: 'all' });
    }
  });

  return tl;
}

// ============================================
// ANSWER BUTTON ANIMATIONS
// ============================================

/**
 * Stagger reveal answer buttons
 */
export function revealAnswers(buttons) {
  return gsap.fromTo(buttons,
    { opacity: 0, x: -30, scale: 0.9 },
    {
      opacity: 1, x: 0, scale: 1,
      duration: 0.3,
      stagger: 0.1,
      ease: 'power2.out'
    }
  );
}

/**
 * Correct answer flash
 */
export function correctAnswerFlash(buttonEl) {
  return gsap.fromTo(buttonEl,
    { backgroundColor: 'rgba(34, 197, 94, 0.3)' },
    {
      backgroundColor: 'rgba(34, 197, 94, 0.6)',
      boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)',
      scale: 1.05,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    }
  );
}

/**
 * Wrong answer flash
 */
export function wrongAnswerFlash(buttonEl) {
  const tl = gsap.timeline();

  tl.to(buttonEl, {
    backgroundColor: 'rgba(239, 68, 68, 0.6)',
    boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)',
    x: -10,
    duration: 0.08,
    ease: 'none'
  });

  tl.to(buttonEl, {
    x: 10,
    duration: 0.08,
    repeat: 3,
    yoyo: true,
    ease: 'none'
  });

  tl.to(buttonEl, {
    x: 0,
    duration: 0.1,
    ease: 'power2.out'
  });

  return tl;
}

/**
 * Disable non-selected buttons
 */
export function fadeOutButtons(buttons) {
  return gsap.to(buttons, {
    opacity: 0.3,
    scale: 0.95,
    duration: 0.3,
    ease: 'power2.out'
  });
}

// ============================================
// TIMER ANIMATIONS
// ============================================

/**
 * Animate the circular timer
 */
export function animateTimer(circleEl, duration) {
  const circumference = 2 * Math.PI * 45; // r=45
  return gsap.fromTo(circleEl,
    { strokeDashoffset: 0 },
    {
      strokeDashoffset: circumference,
      duration: duration,
      ease: 'none'
    }
  );
}

/**
 * Timer warning pulse (last 5 seconds)
 */
export function timerWarning(timerContainer) {
  return gsap.to(timerContainer, {
    scale: 1.1,
    duration: 0.3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

// ============================================
// VICTORY / DEFEAT
// ============================================

/**
 * Victory celebration animation
 */
export function victoryAnimation(container) {
  const tl = gsap.timeline();

  // Title entrance
  const title = container.querySelector('.victory-title');
  if (title) {
    tl.fromTo(title,
      { scale: 0, rotate: -15, opacity: 0 },
      { scale: 1, rotate: 0, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.4)' }
    );
  }

  // Stats stagger
  const stats = container.querySelectorAll('.stat-item');
  if (stats.length) {
    tl.fromTo(stats,
      { opacity: 0, y: 30, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.15, ease: 'back.out(2)' },
      '-=0.3'
    );
  }

  // Create particles
  createParticles(container, 30, ['#fbbf24', '#f59e0b', '#a855f7', '#22d3ee', '#22c55e']);

  return tl;
}

/**
 * Defeat animation
 */
export function defeatAnimation(container) {
  const tl = gsap.timeline();

  // Desaturate
  tl.to(container, {
    filter: 'saturate(0.3) brightness(0.7)',
    duration: 1,
    ease: 'power2.in'
  });

  // Title falls in
  const title = container.querySelector('.defeat-title');
  if (title) {
    tl.fromTo(title,
      { y: -100, opacity: 0, scale: 1.5 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'bounce.out' },
      '-=0.5'
    );
  }

  // Stats
  const stats = container.querySelectorAll('.stat-item');
  if (stats.length) {
    tl.fromTo(stats,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.1, ease: 'power2.out' },
      '-=0.2'
    );
  }

  // Restore saturation slightly
  tl.to(container, {
    filter: 'saturate(0.7) brightness(0.85)',
    duration: 0.5,
    ease: 'power2.out'
  });

  return tl;
}

// ============================================
// LEADERBOARD
// ============================================

/**
 * Animate leaderboard entries
 */
export function animateLeaderboard(entries) {
  return gsap.fromTo(entries,
    { opacity: 0, x: -40, scale: 0.9 },
    {
      opacity: 1, x: 0, scale: 1,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power2.out'
    }
  );
}

// ============================================
// PARTICLES
// ============================================

/**
 * Create floating particle effects
 */
export function createParticles(container, count = 20, colors = ['#fbbf24', '#a855f7', '#22d3ee']) {
  const particles = [];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 4;

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 0 0 ${size * 2}px ${color};
      z-index: 100;
    `;

    container.appendChild(particle);
    particles.push(particle);

    const startX = Math.random() * container.offsetWidth;
    const startY = container.offsetHeight;

    gsap.set(particle, { x: startX, y: startY, opacity: 0 });

    gsap.to(particle, {
      x: startX + (Math.random() - 0.5) * 200,
      y: startY - Math.random() * container.offsetHeight - 100,
      opacity: 1,
      duration: Math.random() * 1 + 0.5,
      ease: 'power2.out',
      delay: Math.random() * 0.5,
      onComplete: () => {
        gsap.to(particle, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => particle.remove()
        });
      }
    });
  }

  return particles;
}

/**
 * Dragon fire breath particle effect
 */
export function dragonFireBreath(container) {
  const fireColors = ['#ef4444', '#f97316', '#fbbf24', '#fef08a'];
  const particles = [];

  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.className = 'fire-particle';
    const color = fireColors[Math.floor(Math.random() * fireColors.length)];
    const size = Math.random() * 12 + 4;

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 0 0 ${size * 3}px ${color};
      z-index: 100;
    `;

    container.appendChild(particle);
    particles.push(particle);

    const startX = container.offsetWidth * 0.7;
    const startY = container.offsetHeight * 0.4;

    gsap.set(particle, { x: startX, y: startY, opacity: 0 });

    gsap.to(particle, {
      x: startX - Math.random() * 300 - 100,
      y: startY + (Math.random() - 0.5) * 150,
      opacity: 1,
      scale: Math.random() * 2 + 0.5,
      duration: Math.random() * 0.5 + 0.3,
      ease: 'power2.out',
      delay: Math.random() * 0.3,
      onComplete: () => {
        gsap.to(particle, {
          opacity: 0,
          scale: 0,
          duration: 0.3,
          onComplete: () => particle.remove()
        });
      }
    });
  }
}

// ============================================
// UTILITY
// ============================================

/**
 * Quick shake effect
 */
export function shake(element, intensity = 5) {
  return gsap.to(element, {
    x: intensity,
    duration: 0.04,
    repeat: 5,
    yoyo: true,
    ease: 'none',
    onComplete: () => gsap.set(element, { x: 0 })
  });
}

/**
 * Flash element with color
 */
export function flash(element, color = 'white', duration = 0.1) {
  return gsap.fromTo(element,
    { boxShadow: `inset 0 0 100px ${color}` },
    { boxShadow: 'inset 0 0 0px transparent', duration, ease: 'power2.out' }
  );
}
