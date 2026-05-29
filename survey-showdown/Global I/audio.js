// EdSim Survey Showdown — Audio Engine
// All sounds generated via Web Audio API — no external files needed

const AudioEngine = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, type, duration, vol = 0.3, delay = 0) {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime + delay);
    gain.gain.setValueAtTime(0, c.currentTime + delay);
    gain.gain.linearRampToValueAtTime(vol, c.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
    osc.start(c.currentTime + delay);
    osc.stop(c.currentTime + delay + duration + 0.05);
  }

  function noise(duration, vol = 0.15, delay = 0) {
    const c = getCtx();
    const bufSize = c.sampleRate * duration;
    const buf = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const gain = c.createGain();
    src.connect(gain);
    gain.connect(c.destination);
    gain.gain.setValueAtTime(vol, c.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
    src.start(c.currentTime + delay);
    src.stop(c.currentTime + delay + duration + 0.05);
  }

  return {
    // Correct answer revealed — bright ding
    reveal() {
      tone(880, 'sine', 0.12, 0.25);
      tone(1320, 'sine', 0.18, 0.2, 0.08);
      tone(1760, 'sine', 0.15, 0.15, 0.16);
    },

    // Wrong answer / strike — classic buzz
    strike() {
      tone(120, 'sawtooth', 0.35, 0.4);
      tone(90, 'square', 0.2, 0.3, 0.1);
      noise(0.3, 0.08, 0.05);
    },

    // Round win / all answers found — fanfare
    roundWin() {
      const notes = [523, 659, 784, 1047];
      notes.forEach((f, i) => tone(f, 'sine', 0.25, 0.3, i * 0.1));
      tone(1047, 'sine', 0.5, 0.25, 0.45);
    },

    // Steal opportunity — tense sting
    steal() {
      tone(440, 'triangle', 0.15, 0.2);
      tone(554, 'triangle', 0.15, 0.2, 0.12);
      tone(370, 'triangle', 0.3, 0.25, 0.24);
    },

    // Steal success
    stealWin() {
      tone(659, 'sine', 0.12, 0.3);
      tone(880, 'sine', 0.18, 0.28, 0.1);
      tone(1047, 'sine', 0.3, 0.2, 0.2);
    },

    // Steal fail (other team keeps points)
    stealFail() {
      tone(220, 'sawtooth', 0.2, 0.3);
      tone(180, 'sawtooth', 0.3, 0.25, 0.15);
    },

    // Game over / final score
    gameOver() {
      const melody = [523, 659, 784, 659, 784, 1047];
      melody.forEach((f, i) => tone(f, 'sine', 0.3, 0.28, i * 0.15));
    },

    // Tick for timer / suspense
    tick() {
      tone(1200, 'square', 0.04, 0.1);
    },

    // Question reveal
    questionReveal() {
      tone(330, 'triangle', 0.2, 0.2);
      tone(440, 'triangle', 0.2, 0.2, 0.15);
    },

    // Multiplier round start
    multiplierStart(mult) {
      const base = mult === 2 ? 440 : 554;
      tone(base, 'sine', 0.15, 0.3);
      tone(base * 1.25, 'sine', 0.15, 0.3, 0.12);
      tone(base * 1.5, 'sine', 0.3, 0.25, 0.24);
    }
  };
})();
