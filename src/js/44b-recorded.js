/* ================= recorded sound: fairground music, crowd and voices from real recordings =================
   build.js embeds the processed recordings as window.RUMMEL_AUDIO (see audio/manifest.json; sources and licences are listed
   in AUDIO-QUELLEN.md and in the park office). Everything here is optional: without recordings, or while they are still
   being decoded, the synthesised sounds of 44-sound.js are used instead. */
const REC = { clips: {}, roles: {}, q: [], busy: 0, bags: {}, last: {}, live: 0, laughAt: 0, cryAt: 0, an: null, played: {}, seq: [] };   // played and seq are for tests
const BED = { low: null, high: null, dens: 0 };
const MUSIC = { cur: null, hold: 0, decks: {}, duck: 0, lvl: 0, wo: 0, wl: 0 };
const _pv = new T.Vector3();
// which music a ride brings along: 2 lively (fast rides), 0 none (quiet places and shows with their own sounds), otherwise the fairground organ
const MSTYLE = { custom: 2, mini: 2, ship: 2, bumper: 2, kart: 2, tower: 2, tower2: 2, flume: 2, coaster: 2, skate: 2, pump: 2, slide: 2, wcoaster: 2, octo: 2, ufo: 2, swing2: 2, bungee: 2, loop: 2, circus: 2,
  rest: 0, ghost: 0, freak: 0, magic: 0, animals: 0, dolphin: 0, orca: 0, splash: 0, pool: 0 };
function recInit() {
  const A = window.RUMMEL_AUDIO; if (!A || !A.clips) return;
  // Music is long: only the piece that plays (and the next one) is kept unpacked, so its packed form stays (keep). Everything else is unpacked once.
  for (const id in A.clips) { const c = A.clips[id]; REC.clips[id] = { id, role: c.role, gain: c.gain || 1, loop: c.loop || 0, data: c.data, buf: null, st: 0, keep: c.role.indexOf('music') === 0 }; (REC.roles[c.role] = REC.roles[c.role] || []).push(id); c.data = null; }
  // the crowd and one piece of organ music first, then the voices and a lively piece; the rest is decoded when it is first wanted
  const first = (r) => { const bag = recBag(r); if (bag) recNeed(bag[bag.length - 1]); };
  first('bedLow'); first('bedHigh'); first('musicOrgan');
  for (const r of ['laugh', 'laughKid', 'laughGroup', 'scream', 'cheer']) for (const id of REC.roles[r] || []) recNeed(id);
  first('musicLively');
  for (const r of ['screamKid', 'applause']) for (const id of REC.roles[r] || []) recNeed(id);
}
function recNeed(id) { const c = REC.clips[id]; if (c && !c.st) { c.st = 1; REC.q.push(c); recPump(); } return c; }
// unpacks two recordings at a time, so a phone is never asked to unpack everything at once
function recPump() {
  if (REC.busy >= 2 || !REC.q.length || !actx) return;
  const c = REC.q.shift(); REC.busy++;
  const done = (buf) => { if (c.st !== 1) return; c.buf = buf || null; c.st = buf ? 2 : 3; if (!c.keep || !buf) c.data = null; REC.busy--; setTimeout(recPump, 10); };
  try {
    const bin = atob(c.data), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    const p = actx.decodeAudioData(u8.buffer, (b) => done(b), () => done(null));
    if (p && p.catch) p.catch(() => done(null));
  } catch (e) { done(null); }
  recPump();
}
const recHas = (role) => { const a = REC.roles[role]; if (!a) return false; for (const id of a) if (REC.clips[id].st !== 3) return true; return false; };
// the next recording of a kind: every one is played once before any repeats, and never the same twice in a row
function recBag(role) {
  const all = REC.roles[role]; if (!all || !all.length) return null;
  let bag = REC.bags[role];
  if (!bag || !bag.length) {
    bag = REC.bags[role] = all.filter((id) => REC.clips[id].st !== 3);
    for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)), t = bag[i]; bag[i] = bag[j]; bag[j] = t; }
    if (bag.length > 1 && bag[bag.length - 1] === REC.last[role]) bag.unshift(bag.pop());
  }
  return bag.length ? bag : null;
}
function recPick(role, inOrder) {
  const bag = recBag(role); if (!bag) return null;
  if (inOrder) {   // music: strictly the next piece, unpacked when its turn comes
    const id = bag[bag.length - 1], c = REC.clips[id];
    if (c.st === 2) { bag.pop(); REC.last[role] = id; return id; }
    if (c.st === 3) bag.pop(); else recNeed(id);
    return null;
  }
  for (let i = bag.length - 1; i >= 0; i--) {
    const c = REC.clips[bag[i]];
    if (c.st === 2) { const id = bag.splice(i, 1)[0]; REC.last[role] = id; return id; }
    if (c.st === 3) bag.splice(i, 1); else recNeed(bag[i]);
  }
  return null;
}
// where a place in the park sits between the left and the right loudspeaker
function panOf(x, z) { _pv.set(x, 0.8, z).project(camera); return isFinite(_pv.x) ? clamp(_pv.x, -1, 1) * 0.55 : 0; }
function recPlay(id, vol, rate, pan, bus) {
  const c = REC.clips[id]; if (!c || c.st !== 2) return null;
  const src = actx.createBufferSource(), g = actx.createGain(); src.buffer = c.buf; src.playbackRate.value = rate || 1; g.gain.value = vol * c.gain;
  let out = g; if (pan && actx.createStereoPanner) { const p = actx.createStereoPanner(); p.pan.value = pan; g.connect(p); out = p; }
  src.connect(g); out.connect(bus || voiceBus); REC.live++; src.onended = () => { REC.live--; }; src.start();
  REC.played[c.role] = (REC.played[c.role] || 0) + 1; REC.seq.push(id); if (REC.seq.length > 80) REC.seq.shift();
  return src;
}
// a voice at a place in the park; false when there is no recording for it (the caller may then use the synthesised voice)
function recAt(role, x, z, vol, spread, rate) {
  if (!actx || actx.state !== 'running' || S.muted || !recHas(role)) return false;
  // not too many voices at once; laughter gives way first, so a scream or the applause after a show is never crowded out
  const h = hearing(x, z); if (h < 0.06 || REC.live >= (role.indexOf('laugh') === 0 ? 5 : 9)) return true;
  const id = recPick(role); if (!id) return true;   // still being decoded: stay silent rather than mix in the synthetic voice
  recPlay(id, h * vol, (rate || 1) * (1 + rnd(-1, 1) * (spread === undefined ? 0.05 : spread)), panOf(x, z), voiceBus); return true;
}
// A child's voice: its own recordings where there are some, otherwise the grown-up ones played a good deal higher.
function recVoice(role, g, vol) {
  const kid = g && g.kid;
  if (kid && recHas(role + 'Kid')) return recAt(role + 'Kid', g.x, g.z, vol);
  return recAt(role, g.x, g.z, vol, 0.05, kid ? rnd(1.2, 1.36) : 1);
}
// a loop of crowd noise. The file holds a little more than one period of a seamless loop, so the loop points can sit safely inside it.
function recLoop(id, bus) {
  const c = REC.clips[id]; if (!c || c.st !== 2) { recNeed(id); return null; }
  const src = actx.createBufferSource(), g = actx.createGain(); src.buffer = c.buf; src.loop = true;
  const len = c.loop && c.loop + 0.3 < c.buf.duration ? c.loop : 0;
  if (len) { src.loopStart = 0.2; src.loopEnd = 0.2 + len; }
  g.gain.value = 0; src.connect(g); g.connect(bus); src.start(0, len ? 0.2 + Math.random() * len * 0.9 : 0); return { src, g, c };
}
// crowd: a murmur of few voices where little is going on, a dense crowd on busy paths, and laughter in between
function crowdFrame(now, dens, loud) {
  BED.dens = dens;
  if (!BED.low && REC.roles.bedLow) BED.low = recLoop(REC.roles.bedLow[0], crowdBus);
  if (!BED.high && REC.roles.bedHigh) BED.high = recLoop(REC.roles.bedHigh[0], crowdBus);
  const lo = BED.low, hi = BED.high;
  // The clear, dense crowd is heard among the people; from high above the park the same crowd is only a muffled murmur.
  const close = fp || pov ? 1 : clamp((52 - cam.d) / 34, 0, 1);
  const few = Math.sin(Math.min(1, dens / 0.45) * Math.PI / 2) * (1 - 0.5 * smooth(0.45, 1, dens));
  if (lo) lo.g.gain.setTargetAtTime((hi ? Math.max(few, dens * (1 - close) * 0.9) : Math.pow(dens, 0.7)) * 0.5 * lo.c.gain, now, 0.6);
  if (hi) hi.g.gain.setTargetAtTime((lo ? smooth(0.28, 0.95, dens) * close : Math.pow(dens, 0.7)) * 0.6 * hi.c.gain, now, 0.6);
  if (loud.length && now > REC.laughAt) {
    REC.laughAt = now + rnd(0.7, 1.4) * (2.4 + 13 * (1 - dens) * (1 - dens));   // every two to three seconds in a crowd, rarely where few people are
    const g = pick(loud);
    // in a real crowd a whole group bursts out laughing now and then
    if (dens > 0.55 && recHas('laughGroup') && Math.random() < 0.22) recAt('laughGroup', g.x, g.z, rnd(0.5, 0.75), 0.04);
    else if (!recVoice('laugh', g, rnd(0.45, 0.8))) personVoice(g, 'happy');
  }
}
const bedsReady = () => !!(BED.low || BED.high);
// Riders cheer and scream when their car drops. The fall is read from the seat itself, so it fits every ride and every
// self-built track: coasters, the log flume, the free-fall towers, the swinging ship. Measured over all rides, the gentle ones
// stay below 1.4 units a second (carousel 0.3, Ferris wheel 0.8) and every real drop is faster than 1.7.
const DROP_V = 1.6;
function dropFrame(rdt) {
  const now = actx.currentTime, k = 1 - Math.exp(-Math.max(rdt, 0.004) / 0.12);
  for (const b of builds) {
    if (b.state !== 'run' || !b.riders.length) { if (b._y !== undefined) { b._y = undefined; b._vy = 0; } continue; }
    const s = b.riders[0].seat; if (!s) continue;
    if (b._seat !== s) { b._seat = s; b._y = undefined; b._vy = 0; }   // another rider's seat: start measuring afresh
    const y = s.matrixWorld.elements[13];
    if (b._y !== undefined && rdt > 0) b._vy = (b._vy || 0) + ((y - b._y) / Math.max(rdt, 0.004) - (b._vy || 0)) * k;
    b._y = y;
    if (b._vy < -DROP_V && b.def.exc >= 40 && now > (b._cry || 0) && now > REC.cryAt && !(b.def.dur && b.runT > b.def.dur - 2.5)) {   // not when a ride merely settles at the end
      b._cry = now + rnd(3.5, 6.5); b._drops = true; REC.cryAt = now + 0.7;
      // the car rushes down, and the riders scream or cheer (whichever recordings there are; children higher)
      sfxAt('rush', b.group.position.x, b.group.position.z, 0.8);
      const p = b.group.position, kid = b.riders[0].kid, role = recHas('scream') && (!recHas('cheer') || Math.random() < 0.55) ? 'scream' : 'cheer';
      if (!(kid && recHas(role + 'Kid') ? recAt(role + 'Kid', p.x, p.z, 0.95, 0.04) : recAt(role, p.x, p.z, 0.95, 0.05, kid ? rnd(1.18, 1.3) : 1))) { const v = hearing(p.x, p.z); if (v > 0.1) speak(Math.random() < 0.6 ? 'scream' : 'woo', rnd(0.9, 1.6), v * 0.07); }
      else if (hearing(p.x, p.z) > 0.45) MUSIC.duck = now + 1.6;
    }
  }
}
// rides that whirl without falling: a whoop now and then
function whoopFrame(now) {
  for (const b of builds) {
    if (b.state !== 'run' || !b.riders.length || b.def.exc < 54 || b.spin < 0.5 || b._drops || now < (b._cry || 0) || !(MSTYLE[b.k] === 2 || b.k === 'swing' || b.k === 'ghost') || Math.random() > 0.16) continue;
    const p = b.group.position; b._cry = now + rnd(2.5, 6);
    if (!recAt(recHas('cheer') ? 'cheer' : 'scream', p.x, p.z, 0.7)) { const v = hearing(p.x, p.z); if (v > 0.1 && now - voiceAt > 0.25) { voiceAt = now; speak(Math.random() < 0.6 ? 'scream' : 'woo', rnd(0.9, 1.6) * (b.riders[0].kid ? 1.3 : 1), v * 0.07); } }
    break;
  }
}
function showApplause(b) { const p = b.group.position; if (!recAt('applause', p.x, p.z, 0.8, 0.03)) sfxAt('clap', p.x, p.z, 0.9); }
// Music: the fairground organ around the gentle rides, livelier music around the fast ones. The kind that is nearer wins,
// the other one fades out; far from every ride the music is only faint, so the visitors and the rides stay audible.
function recMusicFrame(now) {
  const on = S.music && !S.muted;
  let wo = 0, wl = 0, nearest = 0;
  if (on) for (const b of builds) {
    if (b.def.cat !== 'ride' || b.site || b.broken || b.open === false) continue;
    const st = MSTYLE[b.k]; if (st === 0) continue;
    const p = b.group.position, h = hearing(p.x, p.z) * (b.state === 'run' ? 1 : 0.6); if (h > nearest) nearest = h;
    if (st === 2) wl += h; else wo += h;
  }
  MUSIC.wo = wo; MUSIC.wl = wl;
  let want = wl > wo * 1.25 + 0.05 ? 'Lively' : wo > wl * 1.25 + 0.05 ? 'Organ' : MUSIC.cur || 'Organ';
  if (!recHas('music' + want)) want = want === 'Lively' ? 'Organ' : 'Lively';
  if (want !== MUSIC.cur) { if (!MUSIC.cur || ++MUSIC.hold >= 3) { MUSIC.cur = want; MUSIC.hold = 0; } } else MUSIC.hold = 0;
  // which kind plays is decided by all rides around; how loud it is, by how close the nearest one is
  MUSIC.lvl = on ? (0.3 + 0.7 * clamp(nearest, 0, 1)) * (1 - night * 0.25) * (ui.mini ? 0.5 : 1) * (now < MUSIC.duck ? 0.6 : 1) : 0;
  musicBus.gain.setTargetAtTime(MUSIC.lvl * 0.42, now, 0.25);
  for (const style of ['Organ', 'Lively']) {
    const act = on && style === MUSIC.cur;
    let d = MUSIC.decks[style]; if (!d) { if (!act) continue; d = MUSIC.decks[style] = { g: actx.createGain(), src: null, ends: 0, next: 0, off: 0 }; d.g.gain.value = 0; d.g.connect(musicBus); }
    d.g.gain.setTargetAtTime(act ? 1 : 0, now, act ? 0.5 : 0.9);
    if (act) {
      d.off = 0;
      if (d.src && now >= d.ends) { recDrop(d.id); d.src = null; d.next = now + rnd(1.5, 3.5); }
      if (d.src && d.ends - now < 8) { const bag = recBag('music' + style); if (bag) recNeed(bag[bag.length - 1]); }   // unpack the next piece in good time
      if (!d.src && now >= d.next) {
        const id = recPick('music' + style, true);
        if (id) { const c = REC.clips[id], src = actx.createBufferSource(), g = actx.createGain(); src.buffer = c.buf; g.gain.value = c.gain; src.connect(g); g.connect(d.g); src.start(); d.src = src; d.ends = now + c.buf.duration; d.id = id; REC.seq.push(id); if (REC.seq.length > 80) REC.seq.shift(); }
      }
    } else if (d.src) {
      if (!d.off) d.off = now;
      if (now - d.off > 4) { try { d.src.stop(); } catch (e) { /* already over */ } recDrop(d.id); d.src = null; d.next = 0; }
    }
  }
}
// a piece of music that has finished gives its memory back; it is unpacked again when its turn comes round
function recDrop(id) { const c = REC.clips[id]; if (c && c.keep && c.data && c.st === 2) { c.buf = null; c.st = 0; } }
const recMusic = () => recHas('musicOrgan') || recHas('musicLively');
// levels of the buses right now, for tests: [rms, peak] each
function audioProbe() {
  if (!actx) return null;
  if (!REC.an) { REC.an = {}; for (const e of [['music', musicBus], ['crowd', crowdBus], ['voice', voiceBus], ['out', limiter]]) { const a = actx.createAnalyser(); a.fftSize = 2048; e[1].connect(a); REC.an[e[0]] = a; } }
  const o = {}, buf = new Float32Array(2048);
  for (const k in REC.an) { REC.an[k].getFloatTimeDomainData(buf); let s = 0, pk = 0; for (let i = 0; i < 2048; i++) { s += buf[i] * buf[i]; pk = Math.max(pk, Math.abs(buf[i])); } o[k] = [Math.sqrt(s / 2048), pk]; }
  return o;
}
