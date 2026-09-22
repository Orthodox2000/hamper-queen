import confetti from 'canvas-confetti';

// Singleton canvas element ensuring confetti is ALWAYS on top of all headers and modals
let dedicatedCanvas: HTMLCanvasElement | null = null;
let customConfettiInstance: confetti.CreateTypes | null = null;

function getConfettiEngine(): confetti.CreateTypes | typeof confetti {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return confetti;
  }

  if (!dedicatedCanvas) {
    dedicatedCanvas = document.getElementById('global-celebration-canvas') as HTMLCanvasElement;
    if (!dedicatedCanvas) {
      dedicatedCanvas = document.createElement('canvas');
      dedicatedCanvas.id = 'global-celebration-canvas';
      dedicatedCanvas.style.position = 'fixed';
      dedicatedCanvas.style.top = '0';
      dedicatedCanvas.style.left = '0';
      dedicatedCanvas.style.width = '100vw';
      dedicatedCanvas.style.height = '100vh';
      dedicatedCanvas.style.pointerEvents = 'none';
      dedicatedCanvas.style.zIndex = '999999';
      document.body.appendChild(dedicatedCanvas);
    }
  }

  if (!customConfettiInstance && dedicatedCanvas) {
    try {
      customConfettiInstance = confetti.create(dedicatedCanvas, {
        resize: true,
        useWorker: false,
      });
    } catch {
      customConfettiInstance = null;
    }
  }

  return customConfettiInstance || confetti;
}

/**
 * DOM Fallback particles that animate with CSS in case WebGL/Canvas is throttled
 */
function triggerDomSparkles(originX: number, originY: number, colors: string[]) {
  if (typeof document === 'undefined') return;

  const count = 18;
  const startX = originX * window.innerWidth;
  const startY = originY * window.innerHeight;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const color = colors[i % colors.length];
    const size = Math.floor(Math.random() * 8) + 6;
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
    const distance = Math.floor(Math.random() * 120) + 60;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance - 40;

    el.style.position = 'fixed';
    el.style.left = `${startX}px`;
    el.style.top = `${startY}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.backgroundColor = color;
    el.style.borderRadius = i % 2 === 0 ? '50%' : '2px';
    el.style.boxShadow = `0 0 10px ${color}`;
    el.style.pointerEvents = 'none';
    el.style.zIndex = '999999';
    el.style.transition = 'all 0.85s cubic-bezier(0.25, 1, 0.5, 1)';
    el.style.transform = 'translate(-50%, -50%) scale(1)';
    el.style.opacity = '1';

    document.body.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = `translate(${destX}px, ${destY}px) scale(0)`;
      el.style.opacity = '0';
    });

    setTimeout(() => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 900);
  }
}

/**
 * Celebratory golden and royal confetti burst
 */
export const triggerGoldConfetti = (originX = 0.5, originY = 0.6) => {
  const engine = getConfettiEngine();
  const colors = ['#D4AF37', '#FFD700', '#B8860B', '#FFF9E6', '#DFBA54'];

  try {
    engine({
      particleCount: 65,
      spread: 75,
      origin: { x: originX, y: originY },
      colors,
      ticks: 240,
      gravity: 0.85,
      scalar: 1.15,
      zIndex: 999999,
      disableForReducedMotion: false,
    });
  } catch {
    // fallback
  }

  triggerDomSparkles(originX, originY, colors);
};

/**
 * Party Blast for adding items, filling combos, or toggling party extras
 */
export const triggerPartyPopperConfetti = (originX = 0.5, originY = 0.5) => {
  const engine = getConfettiEngine();
  const colors = ['#FF1493', '#FF69B4', '#D4AF37', '#00CED1', '#32CD32', '#FF4500'];

  try {
    // Left burst
    engine({
      particleCount: 50,
      angle: 60,
      spread: 65,
      origin: { x: Math.max(0.1, originX - 0.2), y: originY },
      colors,
      zIndex: 999999,
      disableForReducedMotion: false,
    });

    // Right burst
    engine({
      particleCount: 50,
      angle: 120,
      spread: 65,
      origin: { x: Math.min(0.9, originX + 0.2), y: originY },
      colors,
      zIndex: 999999,
      disableForReducedMotion: false,
    });
  } catch {
    // fallback
  }

  triggerDomSparkles(originX, originY, colors);
};

/**
 * Heart & Rose petal burst for bouquets and romantic gifting
 */
export const triggerRomanticConfetti = (originX = 0.5, originY = 0.6) => {
  const engine = getConfettiEngine();
  const colors = ['#E11D48', '#BE123C', '#FB7185', '#D4AF37', '#FFF1F2'];

  try {
    engine({
      particleCount: 60,
      spread: 80,
      origin: { x: originX, y: originY },
      colors,
      shapes: ['circle', 'square'],
      zIndex: 999999,
      disableForReducedMotion: false,
    });
  } catch {
    // fallback
  }

  triggerDomSparkles(originX, originY, colors);
};

/**
 * Grand WhatsApp Order Celebration Fireworks
 */
export const triggerGrandCelebration = () => {
  const engine = getConfettiEngine();
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 35, spread: 360, ticks: 80, zIndex: 999999, disableForReducedMotion: false };

  triggerDomSparkles(0.5, 0.5, ['#D4AF37', '#FFD700', '#FF1493', '#9333EA', '#10B981']);

  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 60 * (timeLeft / duration);
    try {
      engine({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.35), y: Math.random() - 0.2 },
        colors: ['#D4AF37', '#FFD700', '#FF1493', '#9333EA', '#10B981'],
      });
      engine({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.65, 0.9), y: Math.random() - 0.2 },
        colors: ['#D4AF37', '#FFD700', '#FF1493', '#9333EA', '#10B981'],
      });
    } catch {
      // fallback
    }
  }, 220);
};

/**
 * Small golden confetti bomb triggered when user clicks anywhere with mouse
 */
export const triggerMouseClickConfetti = (clientX: number, clientY: number) => {
  if (typeof window === 'undefined') return;
  const engine = getConfettiEngine();
  const originX = clientX / window.innerWidth;
  const originY = clientY / window.innerHeight;

  try {
    engine({
      particleCount: 16,
      spread: 50,
      startVelocity: 16,
      ticks: 45,
      origin: { x: originX, y: originY },
      colors: ['#DFBA54', '#D4AF37', '#F3E5AB', '#FFE885', '#FFFDF9', '#C5A059'],
      shapes: ['circle', 'square'],
      zIndex: 999999,
      disableForReducedMotion: false,
    });
  } catch {
    // silently fail
  }
};

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
