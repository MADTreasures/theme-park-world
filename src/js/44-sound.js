/* ================= sound and music ================= */
// Everything is synthesised with Web Audio: effects, voices for guests and staff, ambience, weather and a fairground waltz.
let actx = null, master = null, musicBus = null, crowdGain = null, seaGain = null, rainGain = null, noiseBuf = null;
let voiceAt = 0, gullAt = 8, ambAt = 0, snoreAt = 0, stepAt = 0, cashAt = 0, cricketAt = 0, thunderAt = 0, alarmAt = 0;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
function audioReady() {
  if (S.muted) return false;
  try {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      actx = new AC(); master = actx.createGain(); master.gain.value = 0.9; master.connect(actx.destination);
      musicBus = actx.createGain(); musicBus.gain.value = 0.5; musicBus.connect(master);
      noiseBuf = actx.createBuffer(1, actx.sampleRate * 2, actx.sampleRate);
      const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const bed = (type, freq, q) => { const src = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain(); src.buffer = noiseBuf; src.loop = true; f.type = type; f.frequency.value = freq; f.Q.value = q; g.gain.value = 0; src.connect(f); f.connect(g); g.connect(master); src.start(); return g; };
      crowdGain = bed('bandpass', 620, 0.7); seaGain = bed('lowpass', 420, 0.3); rainGain = bed('highpass', 2400, 0.4);
    }
    if (actx.state === 'suspended') actx.resume();
    return actx.state === 'running';
  } catch (e) { return false; }
}
window.addEventListener('pointerdown', audioReady, true); window.addEventListener('keydown', audioReady, true);
function tone(f, t0, dur, type, vol, f1, dest) {
  const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + t0;
  o.type = type || 'triangle'; o.frequency.setValueAtTime(f, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol || 0.12, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + dur + 0.03);
}
function hiss(t0, dur, vol, type, f0, f1, q) {
  const t = actx.currentTime + t0, src = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
  src.buffer = noiseBuf; src.loop = true; f.type = type; f.Q.value = q || 0.8; f.frequency.setValueAtTime(f0, t); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + Math.min(0.04, dur * 0.3)); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  src.connect(f); f.connect(g); g.connect(master); src.start(t, Math.random()); src.stop(t + dur + 0.05);
}
// a short vowel: a sawtooth through a band-pass, gliding in pitch
function vox(f0, f1, dur, vol, formant, t0) {
  const t = actx.currentTime + (t0 || 0), o = actx.createOscillator(), bp = actx.createBiquadFilter(), g = actx.createGain();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  bp.type = 'bandpass'; bp.frequency.value = formant; bp.Q.value = 4;
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol * 2.2, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  o.connect(bp); bp.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
}
const SFX = {
  build: (v) => { tone(392, 0, 0.12, 'triangle', 0.12 * v); tone(587, 0.07, 0.18, 'triangle', 0.12 * v); },
  path: (v) => tone(660, 0, 0.05, 'sine', 0.06 * v),
  doze: (v) => { tone(180, 0, 0.14, 'sawtooth', 0.07 * v); tone(120, 0.06, 0.16, 'sawtooth', 0.07 * v); hiss(0, 0.25, 0.05 * v, 'lowpass', 900, 200); },
  error: (v) => tone(150, 0, 0.2, 'square', 0.05 * v),
  goal: (v) => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.24, 'triangle', 0.12 * v)),
  click: (v) => tone(880, 0, 0.04, 'sine', 0.05 * v),
  coin: (v) => { tone(1568, 0, 0.06, 'sine', 0.045 * v); tone(2093, 0.05, 0.12, 'sine', 0.045 * v); },
  bell: (v) => { tone(1320, 0, 0.5, 'sine', 0.07 * v); tone(1980, 0, 0.3, 'sine', 0.03 * v); },
  thief: (v) => { [196, 185, 175].forEach((f, i) => tone(f, i * 0.2, 0.18, 'sawtooth', 0.07 * v)); tone(233, 0.62, 0.7, 'sawtooth', 0.08 * v); tone(117, 0.62, 0.7, 'triangle', 0.1 * v); hiss(0.6, 0.5, 0.025 * v, 'highpass', 5000); },
  whistle: (v) => { for (let i = 0; i < 7; i++) tone(i % 2 ? 2500 : 2300, i * 0.055, 0.06, 'sine', 0.07 * v); },
  whoosh: (v) => hiss(0, 0.5, 0.14 * v, 'bandpass', 300, 2600, 1.2),
  splash: (v) => { hiss(0, 0.55, 0.16 * v, 'lowpass', 2200, 300); tone(90, 0, 0.2, 'sine', 0.1 * v, 50); },
  slip: (v) => tone(900, 0, 0.3, 'sine', 0.07 * v, 260),
  poke: (v) => { tone(320, 0, 0.05, 'square', 0.04 * v); vox(190, 250, 0.16, 0.05 * v, 500, 0.03); },
  yawn: (v) => { vox(180, 330, 0.45, 0.06 * v, 700); vox(330, 160, 0.6, 0.06 * v, 650, 0.42); },
  snore: (v) => { hiss(0, 0.7, 0.05 * v, 'lowpass', 130, 230, 2); hiss(0.9, 0.5, 0.025 * v, 'bandpass', 900, 500, 3); },
  step: (v) => hiss(0, 0.06, 0.05 * v, 'lowpass', 800, 300),
  sweep: (v) => { hiss(0, 0.22, 0.05 * v, 'bandpass', 2600, 1400, 1); hiss(0.3, 0.22, 0.05 * v, 'bandpass', 2400, 1300, 1); },
  clank: (v) => { for (let i = 0; i < 3; i++) { tone(1180 + i * 90, i * 0.22, 0.09, 'square', 0.04 * v); tone(2760, i * 0.22, 0.05, 'sine', 0.03 * v); } },
  honk: (v) => { tone(310, 0, 0.14, 'sawtooth', 0.07 * v); tone(310, 0.2, 0.2, 'sawtooth', 0.07 * v, 290); },
  toss: (v) => { for (let i = 0; i < 4; i++) tone(700 + i * 120, i * 0.16, 0.08, 'sine', 0.035 * v, 900 + i * 120); },
  clap: (v) => { for (let i = 0; i < 9; i++) hiss(i * 0.11 + Math.random() * 0.03, 0.05, 0.05 * v, 'bandpass', 1800, 1200, 1.5); },
  squeak: (v) => { tone(900, 0, 0.08, 'sine', 0.05 * v, 1500); tone(1400, 0.1, 0.1, 'sine', 0.05 * v, 800); },
  hello: (v) => { vox(260, 340, 0.12, 0.05 * v, 800); vox(340, 300, 0.2, 0.05 * v, 900, 0.13); },
  hmpf: (v) => { vox(200, 140, 0.25, 0.06 * v, 450); hiss(0.2, 0.15, 0.06 * v, 'lowpass', 300, 120); },
  ahh: (v) => vox(300, 240, 0.5, 0.05 * v, 850),
  boing: (v) => tone(180, 0, 0.3, 'sine', 0.08 * v, 520),
  vroom: (v) => { tone(70, 0, 0.7, 'sawtooth', 0.06 * v, 190); tone(105, 0, 0.7, 'square', 0.025 * v, 280); },
  spook: (v) => { tone(330, 0, 0.9, 'sine', 0.06 * v, 520); tone(520, 0.85, 0.8, 'sine', 0.06 * v, 300); },
  organ: (v) => [523, 659, 784, 659, 1047].forEach((f, i) => { tone(f, i * 0.11, 0.2, 'square', 0.025 * v); tone(f / 2, i * 0.11, 0.2, 'triangle', 0.04 * v); }),
  climb: (v) => { for (let i = 0; i < 8; i++) tone(240 + i * 14, i * 0.09, 0.03, 'square', 0.03 * v); },
  thunder: (v) => { hiss(0, 1.8, 0.3 * v, 'lowpass', 220, 50, 0.5); hiss(0.05, 0.25, 0.12 * v, 'lowpass', 1200, 200); },
  drop: (v) => { tone(700, 0, 0.5, 'sine', 0.05 * v, 180); hiss(0, 0.5, 0.06 * v, 'bandpass', 2000, 500, 1); },
  hammer: (v) => { tone(260, 0, 0.05, 'triangle', 0.13 * v, 120); hiss(0, 0.035, 0.09 * v, 'bandpass', 2600, 1400, 1.4); },
  saw: (v) => { for (let i = 0; i < 3; i++) hiss(i * 0.13, 0.11, 0.05 * v, 'bandpass', i % 2 ? 1900 : 2500, i % 2 ? 2500 : 1900, 2.5); },
  mark: (v) => { tone(520, 0, 0.06, 'square', 0.04 * v); tone(390, 0.07, 0.09, 'square', 0.04 * v); },
  chop: (v) => { for (let i = 0; i < 3; i++) { hiss(i * 0.62, 0.08, 0.11 * v, 'bandpass', 1500, 600, 1.2); tone(190, i * 0.62, 0.07, 'triangle', 0.08 * v, 90); } },
  timber: (v) => { hiss(0, 0.5, 0.1 * v, 'bandpass', 2400, 500, 0.9); tone(120, 0.28, 0.25, 'sine', 0.12 * v, 55); },
  water: (v) => hiss(0, 1.2, 0.035 * v, 'highpass', 3600, 2600, 0.7),
  knock: (v) => { for (let i = 0; i < 2; i++) { tone(210, i * 0.13, 0.07, 'triangle', 0.17 * v, 110); hiss(i * 0.13, 0.04, 0.09 * v, 'lowpass', 900, 300); } },
  caught: (v) => { [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.1, 0.22, 'square', 0.06 * v)); for (let i = 0; i < 6; i++) tone(i % 2 ? 2500 : 2300, 0.45 + i * 0.07, 0.07, 'sine', 0.08 * v); },
  alarm: (v) => { tone(880, 0, 0.16, 'square', 0.05 * v); tone(660, 0.2, 0.16, 'square', 0.05 * v); },
};
function sfx(k, vol) { if (!audioReady()) return; try { (SFX[k] || SFX.click)(vol === undefined ? 1 : vol); } catch (e) { /* audio is optional */ } }
// how loud something at (x, z) is for the current view, 0..1
function hearing(x, z) {
  if (fp) return clamp(1.25 - Math.hypot(x - fp.x, z - fp.z) / 9, 0, 1);
  if (pov) return clamp(1.25 - Math.hypot(x - cam.tx, z - cam.tz) / 9, 0, 1);
  return clamp(1.25 - Math.hypot(x - cam.tx, z - cam.tz) / (cam.d * 0.75 + 4), 0, 1) * clamp(26 / cam.d, 0.35, 1);
}
function sfxAt(k, x, z, vol) { const v = hearing(x, z) * (vol || 1); if (v > 0.06) sfx(k, v); }
function speak(what, p, v) {
  if (what === 'laugh') for (let i = 0; i < 3 + ((p * 10) & 1); i++) vox(420 * p, 330 * p, 0.09, v, 950, i * 0.12);
  else if (what === 'woo') { vox(330 * p, 720 * p, 0.28, v, 800); vox(720 * p, 520 * p, 0.3, v * 0.8, 800, 0.26); }
  else if (what === 'scream') vox(620 * p, 900 * p, 0.5, v, 1150);
  else if (what === 'bleh') vox(210 * p, 150 * p, 0.4, v, 420);
  else if (what === 'hey') { vox(480 * p, 620 * p, 0.13, v * 1.3, 1050); vox(600 * p, 400 * p, 0.28, v * 1.3, 1050, 0.15); }
  else if (what === 'nom') { vox(240 * p, 260 * p, 0.08, v, 500); vox(250 * p, 230 * p, 0.1, v, 500, 0.13); }
  else if (what === 'stop') { vox(300 * p, 360 * p, 0.12, v * 1.4, 900); vox(340 * p, 260 * p, 0.3, v * 1.4, 700, 0.16); }
  else vox(270 * p, 180 * p, 0.42, v, 600);
}
const VOICE = { great: ['woo', 0.8], happy: ['laugh', 0.4], bye: ['laugh', 0.3], sick: ['bleh', 0.9], angry: ['aww', 0.7], queue: ['aww', 0.5], money: ['aww', 0.3], litter: ['aww', 0.15], thief: ['hey', 1], food: ['aww', 0.2], drink: ['aww', 0.2], wc: ['aww', 0.2], nom: ['nom', 0.45], scream: ['scream', 1] };
// Guests and staff comment on what happens to them. Voices are rate limited and fade with distance.
function personVoice(g, kind) {
  const e = VOICE[kind]; if (!e || Math.random() > e[1] || !audioReady()) return;
  const now = actx.currentTime; if (now - voiceAt < 0.2) return;
  const v = hearing(g.x, g.z); if (v < 0.08) return;
  voiceAt = now;
  try { speak(e[0], (g.kid ? 1.5 : 1) * (0.85 + (g.ph % 1) * 0.4), v * 0.085); } catch (err) { /* audio is optional */ }
}
const RIDE_SFX = { carousel: 'organ', cups: 'organ', bouncy: 'boing', swing: 'bell', ship: 'bell', bumper: 'honk', wheel: 'bell', tower: 'climb', tower2: 'climb', flume: 'bell', coaster: 'climb', custom: 'climb', mini: 'climb', ghost: 'spook', kart: 'vroom', dunk: 'bell' };
function rideSound(b) { const p = b.group.position; sfxAt(RIDE_SFX[b.k] || 'bell', p.x, p.z, 0.8); if (actx && actx.currentTime - cashAt > 1.5 && hearing(p.x, p.z) > 0.3) { cashAt = actx.currentTime; sfx('coin', 0.5); } }

/* ----- a waltz for the fairground organ: 32 bars in C, three beats each ----- */
const TUNE = [[76, 79, 84], [83, 81, 79], [77, 74, 71], [74, 0, 0], [77, 79, 83], [81, 79, 77], [76, 72, 76], [79, 0, 0], [76, 79, 84], [88, 86, 84], [81, 84, 81], [81, 0, 77], [83, 86, 83], [79, 81, 83], [84, 0, 79], [84, 0, 0],
  [77, 81, 84], [86, 84, 81], [79, 84, 88], [84, 0, 0], [74, 77, 81], [86, 84, 81], [83, 81, 79], [74, 0, 0], [76, 79, 76], [72, 76, 79], [81, 79, 77], [81, 0, 84], [86, 83, 79], [77, 0, 74], [76, 74, 72], [72, 0, 0]];
const CHORD = { C: [48, [60, 64, 67]], G: [43, [59, 62, 65]], F: [41, [57, 60, 65]], D: [50, [57, 62, 65]] };
const BARS = 'CCGGGGCCCCFFGGCCFFCCDDGGCCFFGGCC';
const MUS = { bar: 0, beat: 0, next: 0, len: 60 / 152 };
function musicFrame() {
  if (!actx || actx.state !== 'running') return;
  musicBus.gain.value = S.music && !S.muted ? 0.5 * (1 - night * 0.35) * (ui.mini ? 0.5 : 1) : 0;
  if (!S.music || S.muted) { MUS.next = 0; return; }
  const now = actx.currentTime; if (MUS.next < now) MUS.next = now + 0.06;
  while (MUS.next < now + 0.25) {
    const t0 = MUS.next - now, ch = CHORD[BARS[MUS.bar]], m = TUNE[MUS.bar][MUS.beat], oct = night > 0.6 ? -12 : 0, L = MUS.len;
    if (MUS.beat === 0) tone(mtof(ch[0] + (MUS.bar % 2 ? 7 : 0) - (BARS[MUS.bar] === 'G' && MUS.bar % 2 ? 12 : 0)), t0, L * 0.9, 'triangle', 0.16, 0, musicBus);
    else for (const n of ch[1]) tone(mtof(n), t0, L * 0.45, 'sine', 0.045, 0, musicBus);
    if (m) {
      let hold = 1; for (let b = MUS.beat + 1; b < 3 && !TUNE[MUS.bar][b]; b++) hold++;
      tone(mtof(m + oct), t0, L * hold * 0.92, 'square', 0.03, 0, musicBus); tone(mtof(m + oct), t0, L * hold * 0.92, 'sine', 0.085, 0, musicBus);
      tone(mtof(m + oct + 12), t0, L * 0.3, 'sine', 0.02, 0, musicBus);
    }
    MUS.next += L; if (++MUS.beat === 3) { MUS.beat = 0; MUS.bar = (MUS.bar + 1) % 32; }
  }
}
// ambience: crowd murmur, sea, rain, gulls, crickets, chatter, snoring guards and screams from the wild rides
function audioFrame(rdt) {
  if (!actx || actx.state !== 'running') return;
  musicFrame();
  ambAt -= rdt; if (ambAt > 0) return; ambAt = 0.5;
  const now = actx.currentTime, on = S.muted ? 0 : 1; master.gain.value = on * 0.9;
  let near = 0; const loud = [];
  for (let i = 0; i < guests.length; i += 2) { const g = guests[i]; if (hearing(g.x, g.z) > 0.25) { near += 2; if (loud.length < 12) loud.push(g); } }
  crowdGain.gain.setTargetAtTime(clamp(near * 0.0011, 0, 0.045), now, 0.5);
  seaGain.gain.setTargetAtTime(fp ? 0.012 : 0.01 + 0.03 * clamp((cam.d - 18) / 50, 0, 1) * (0.7 + 0.3 * Math.sin(now * 0.6)), now, 0.6);
  rainGain.gain.setTargetAtTime(WX.wet * 0.07, now, 0.6);
  if (now > gullAt && night < 0.5 && WX.wet < 0.3) { gullAt = now + rnd(10, 26); const v = 0.02 + 0.03 * clamp((cam.d - 12) / 40, 0, 1); for (let i = 0; i < rint(2, 4); i++) tone(1900, i * 0.22, 0.16, 'sine', v, 1250); }
  if (night > 0.7 && now > cricketAt && WX.wet < 0.3) { cricketAt = now + rnd(0.9, 2.2); for (let i = 0; i < 3; i++) tone(4300, i * 0.07, 0.04, 'sine', 0.012); }
  if (loud.length && Math.random() < Math.min(0.3, loud.length * 0.03)) personVoice(pick(loud), 'happy');
  for (const b of builds) if (b.state === 'run' && b.riders.length && b.def.exc >= 54 && b.spin > 0.5 && Math.random() < 0.3) { const g = b.riders[0], p = b.group.position, v = hearing(p.x, p.z); if (v > 0.1 && now - voiceAt > 0.25) { voiceAt = now; speak(Math.random() < 0.6 ? 'scream' : 'woo', rnd(0.9, 1.6) * (g.kid ? 1.3 : 1), v * 0.07); } }
  if (now > alarmAt && thieves.some((f) => f.state === 'held')) { alarmAt = now + 2.4; sfx('alarm', 0.75); }
  if (now > snoreAt) { snoreAt = now + 2.3; for (const s of staff) if (s.asleep) { sfxAt('snore', s.x, s.z, 1.3); break; } }
  if (WX.k === 'storm' && now > thunderAt) { thunderAt = now + rnd(6, 16); WX.flash = 1; setTimeout(() => sfx('thunder', 0.9), rnd(250, 1100)); }
  if (fp && (fp.jx || fp.jy || keys.w || keys.a || keys.s || keys.d || keys.arrowup || keys.arrowdown || keys.arrowleft || keys.arrowright)) sfx('step', 0.9);
}
