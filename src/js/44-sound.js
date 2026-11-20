/* ================= sound ================= */
let actx = null;
function tone(f, t0, dur, type, vol) {
  const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + t0;
  o.type = type || 'triangle'; o.frequency.value = f;
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol || 0.12, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + dur + 0.03);
}
function sfx(k) {
  if (S.muted) return;
  try {
    if (!actx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; actx = new AC(); }
    if (actx.state === 'suspended') actx.resume();
    if (k === 'build') { tone(392, 0, 0.12); tone(587, 0.07, 0.18); }
    else if (k === 'path') tone(660, 0, 0.05, 'sine', 0.06);
    else if (k === 'doze') { tone(180, 0, 0.14, 'sawtooth', 0.07); tone(120, 0.06, 0.16, 'sawtooth', 0.07); }
    else if (k === 'error') tone(150, 0, 0.2, 'square', 0.05);
    else if (k === 'goal') [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.24));
    else tone(880, 0, 0.04, 'sine', 0.05);
  } catch (e) { /* audio is optional */ }
}

