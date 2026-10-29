// Utility to play rich notification sounds with Web Audio API synthesizer fallback
let audioCtx = null;

export const playOrderNotificationSound = () => {
  if (typeof window === "undefined") return;

  // 1. Try HTML5 Audio with notification.mp3
  try {
    const audio = new Audio("/sounds/notification.mp3");
    audio.preload = "auto";
    audio.volume = 1.0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("MP3 audio play blocked or failed, falling back to Web Audio synth:", err);
        playSynthChime();
      });
    }
  } catch (e) {
    playSynthChime();
  }

  // 2. Play Web Audio synth chime as complementary or fallback
  try {
    playSynthChime();
  } catch (e) {
    // ignore
  }

  // 3. Vibrate device if supported
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([300, 150, 300, 150, 400]);
    }
  } catch (e) {
    // ignore
  }
};

export const playSynthChime = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx || audioCtx.state === "closed") {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Sequence of 3 rich pleasant chime notes: F5 (698.46 Hz) -> A5 (880 Hz) -> C6 (1046.5 Hz)
    const notes = [
      { freq: 698.46, start: 0, duration: 0.25 },
      { freq: 880.0, start: 0.22, duration: 0.35 },
      { freq: 1046.5, start: 0.5, duration: 0.6 },
    ];

    notes.forEach(({ freq, start, duration }) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0.001, now + start);
      gain.gain.exponentialRampToValueAtTime(0.4, now + start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + start);
      osc.stop(now + start + duration);
    });
  } catch (err) {
    console.warn("Web Audio chime failed:", err);
  }
};
