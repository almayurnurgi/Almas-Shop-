// Global AudioContext singleton
let globalAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!globalAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      globalAudioCtx = new AudioContextClass();
    }
  }
  return globalAudioCtx;
}

// Automatically unlock audio context on first user interaction in browser
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    // Also preload audio element
    const audioEl = document.getElementById('sale-notification-audio') as HTMLAudioElement | null;
    if (audioEl) {
      audioEl.load();
    }
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
}

// Cash-register & sale chime sound player
export function playSaleChime() {
  if (typeof window === 'undefined') return;

  // 1. Try playing the dedicated <audio id="sale-notification-audio"> DOM element or fallback new Audio
  try {
    const audioElement = document.getElementById('sale-notification-audio') as HTMLAudioElement | null;
    if (audioElement) {
      audioElement.currentTime = 0;
      audioElement.volume = 1.0;
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          console.debug('[Audio] HTML5 audio notice, falling back to Web Audio API:', e);
        });
      }
    } else {
      const fallbackAudio = new Audio('/sounds/sale-notification.wav');
      fallbackAudio.volume = 1.0;
      fallbackAudio.play().catch(() => {});
    }
  } catch (err) {
    console.debug('[Audio] DOM audio error:', err);
  }

  // 2. Synthesize celebratory two-tone cash register chime via Web Audio API as 100% guarantee
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    
    // First bell high chime (Ding)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.12); // E6
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.65);

    // Second bell celebratory harmonic (Chime)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1975.53, now + 0.08); // B6
    gain2.gain.setValueAtTime(0.3, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.85);

    // Subtle coin drop impact (Ca-ching)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(523.25, now + 0.15); // C5
    osc3.frequency.exponentialRampToValueAtTime(1046.50, now + 0.35); // C6
    gain3.gain.setValueAtTime(0.25, now + 0.15);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.15);
    osc3.stop(now + 0.95);
  } catch (err) {
    console.debug('[Audio] Web Audio play notice:', err);
  }
}

export function playNotificationPing() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, now); // E5
    osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.1); // A5
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  } catch {
    // audio context might be restricted before user gesture
  }
}

