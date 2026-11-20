/* ================= thieves and guards ================= */
// From park level 5 on, pickpockets slip in with the crowd: hooped jersey, woollen hat, a mask over the eyes and a sack.
// Guards share one level. At first they doze at their post and the player wakes them by tapping; later they patrol on
// their own, see further and run faster. A guard who reaches a thief only has a chance to grab him, and every extra guard
// raises it. A grabbed thief is held with his hands up until the player throws him out with the hand (or the guard does).
let thieves = [], thiefSeen = false, splashes = [], slipToastAt = -99, markToastAt = -99;
const THIEF_LEVEL = 4;
const SEC_XP = [0, 24, 66, 132, 220], GUARD_SIGHT = [9, 16, 25, 42, 1e9];
const SEC_NAME = ['Schlafmützen', 'Halbwach', 'Streife', 'Adleraugen', 'Meisterdetektive'];
const SEC_INFO = ['Schlafen am Posten. Tippe sie fünfmal an, um sie zu wecken, und zeige ihnen den Dieb.', 'Wachen auf, wenn in ihrer Nähe gestohlen wird. Drei Tipper genügen.', 'Gehen von selbst auf Streife und schlafen nicht mehr.', 'Erkennen Diebe schon, bevor sie zugreifen, sehen weiter und rennen schneller.', 'Wissen immer, wo sich Diebe herumtreiben.'];
const catchChance = () => clamp(0.3 + 0.08 * (S.secLvl - 1) + 0.17 * (staffN('sec') - 1), 0.1, 0.95);
const thiefActive = (f) => f.state === 'prowl' || f.state === 'run' || f.state === 'flee';
function secXp(n) {
  S.secXp += n;
  while (S.secLvl < 5 && S.secXp >= SEC_XP[S.secLvl]) {
    S.secLvl++;
    toast('Deine Wachleute erreichen Stufe ' + S.secLvl + ' (' + SEC_NAME[S.secLvl - 1] + '). ' + SEC_INFO[S.secLvl - 1], 'gold'); sfx('goal');
    if (S.secLvl >= 3) for (const s of staff) if (s.type === 'sec') { s.asleep = false; s.g = 'patrol'; if (s.job === 'sleep') { s.busy = 0; s.job = null; } }
  }
  uiDirty = true;
}
function spawnThief() {
  const f = { thief: true, x: wX(HALF) + rnd(-0.5, 0.5), z: HALF + 13.6, rot: Math.PI, rr: Math.PI, tile: ENT, prev: -1, wx: 0, wz: 0, ox: rnd(-0.3, 0.3), oz: rnd(-0.3, 0.3),
    sp: 1.25, ph: rnd(TAU), moving: false, state: 'in', loot: 0, steals: 0, t: 0, cd: rnd(5, 9), spotted: false, gone: false, brave: 0, balloon: 0, slipT: 0, holder: null, heldT: 0, fy: 0, tum: 0, ft: 0, fails: 0, runAt: 0, calm: 0 };
  dress(f, false);
  // the classic burglar: hooped jersey, woollen hat, mask and a sack. Nothing like the grey uniform of the guards.
  f.shirt = 0xf0f0f0; f.pants = 0x1c1c22; f.hair = 11; f.hairCol = 0x1a1a20; f.browCol = pick([0x5a3a22, 0x8a5a2b, 0xa5441f, 0x3d2616, 0xc9a25a]); f.top = 2; f.bottom = 0; f.shades = 0; f.pack = 0x6b4a2a; f.trim = 0x25252e; f.shoe = 0x1c1c22; f.legs = f.skin;
  setWP(f, ENT); thieves.push(f); colorsDirty = true; sfx('thief');
  if (!thiefSeen) { thiefSeen = true; toast('Achtung, Taschendiebe! Du erkennst sie am Ringelpulli, an Wollmütze, Augenmaske und Sack. Wecke deine Wachleute und tippe den Dieb an, damit sie wissen, wen sie jagen.', 'bad'); }
  else toast('Ein Taschendieb schleicht durch den Park.', 'bad');
}
function guardNear(f, r2) { for (const s of staff) if (s.type === 'sec' && !s.asleep && s.state === 'work') { const dx = s.x - f.x, dz = s.z - f.z; if (dx * dx + dz * dz < r2) return true; } return false; }
function wakeGuard(s) {
  if (!s.asleep && s.g !== 'sleep') return;
  s.g = 'awake'; s.asleep = false; s.alertT = 75; s.wake = 0; s.busy = 0; s.job = null;
  sfxAt('yawn', s.x, s.z, 1.4); toast(s.name + ' ist wach und sucht nach Dieben.', 'good'); uiDirty = true;
}
function pokeGuard(s) {
  s.wake++; s.wakeT = 4; s.shake = 0.35; sfx('knock'); sfx('poke', 0.6);
  if (s.wake >= (S.secLvl === 1 ? 5 : 3)) wakeGuard(s);
}
// The player points out a thief: awake guards now know whom to chase.
function markThief(f) {
  f.spotted = true; personVoice(f, 'thief');
  if (S.time - markToastAt < 6) return; markToastAt = S.time;
  const n = staffN('sec'), awake = staff.some((s) => s.type === 'sec' && !s.asleep && s.state === 'work');
  toast(!n ? 'Ohne Sicherheitspersonal entkommt der Dieb. Stelle Wachleute ein (Personal).' : awake ? 'Haltet den Dieb! Deine Wachleute nehmen die Verfolgung auf.' : 'Deine Wachleute schlafen. Tippe sie mehrmals an, um sie zu wecken.', awake ? 'good' : 'bad');
}
function grabThief(s, f) {
  f.state = 'held'; f.holder = s; f.heldT = 22; f.moving = false; f.rot = Math.atan2(s.x - f.x, s.z - f.z);
  s.hold = f; s.chase = null; s.busy = 22; s.job = 'hold'; s.going = false; s.route = []; s.rot = Math.atan2(f.x - s.x, f.z - s.z);
  sfx('caught'); secXp(12); uiDirty = true;   // loud on purpose, wherever the camera is: the player has to step in
  toast(s.name + ' hat einen Dieb gefasst. Tippe den Dieb an und wirf ihn hinaus.', 'gold');
}
function throwThief(f, byPlayer) {
  if (f.state !== 'held') return;
  const s = f.holder; if (s) { s.hold = null; s.busy = 0.6; s.job = null; }
  f.holder = null; f.state = 'thrown'; f.ft = 0; f.x0 = f.x; f.z0 = f.z;
  let dx = f.x, dz = f.z; if (Math.hypot(dx, dz) < 3) { dx = 0.3; dz = 1; }
  const k = (HALF + 9) / Math.max(Math.abs(dx), Math.abs(dz)); f.x1 = dx * k; f.z1 = dz * k; f.fh = 5 + Math.hypot(f.x1 - f.x, f.z1 - f.z) * 0.12;
  const reward = Math.round(f.loot + (byPlayer ? 15 : 5)); earn(reward, 'bonus'); if (byPlayer) secXp(6);
  sfx('whoosh', byPlayer ? 1 : hearing(f.x, f.z));
  for (const g of guests) { const ex = g.x - f.x, ez = g.z - f.z; if (ex * ex + ez * ez < 12 && g.state !== 'ride') { g.happy = Math.min(100, g.happy + 4); if (Math.random() < 0.4) think(g, 'great'); } }
  toast((byPlayer ? 'Und raus mit ihm! ' : 'Der Dieb fliegt hinaus. ') + eur(reward) + ' sichergestellt.', 'good'); uiDirty = true;
}
function releaseThief(f) { if (f.state === 'held') { f.state = 'flee'; f.holder = null; f.slipT = 2; } }
function stepThief(f, dt) {
  f.t += dt; f.moving = false; if (f.cd > 0) f.cd -= dt; if (f.slipT > 0) f.slipT -= dt;
  if (f.state === 'in') { if (moveTo(f, dt)) { f.tile = ENT; f.state = 'prowl'; } return; }
  if (f.state === 'held') {
    const s = f.holder; if (!s || s.hold !== f || staff.indexOf(s) < 0) { releaseThief(f); return; }
    f.heldT -= dt; if (f.heldT <= 0) throwThief(f, false);
    return;
  }
  if (f.state === 'thrown') {
    f.ft += dt / 1.5; const u = Math.min(1, f.ft);
    f.x = lerp(f.x0, f.x1, u); f.z = lerp(f.z0, f.z1, u); f.fy = 4 * f.fh * u * (1 - u); f.tum += dt * 9;
    if (u >= 1) { f.gone = true; colorsDirty = true; splashes.push({ x: f.x, z: f.z, t: 0 }); sfxAt('splash', f.x, f.z, 1.6); }
    return;
  }
  if (f.state === 'out') {
    if (moveTo(f, dt)) {
      f.gone = true; colorsDirty = true;
      if (f.loot > 0) { toast('Ein Dieb ist mit ' + eur(f.loot) + ' Beute entkommen.', 'bad'); S.exitAvg = Math.max(0, S.exitAvg - 3); }
      else if (f.spotted) secXp(3);
    }
    return;
  }
  if (!moveTo(f, dt)) return;
  if (tType[f.tile] !== 1) { f.tile = nearestPath(f.x, f.z); f.prev = -1; setWP(f, f.tile); return; }
  // A thief who notices a guard after him runs: away from the nearest guard, deeper into the park if need be.
  // After two narrow escapes or a long chase he makes a dash for the gate.
  const chased = staff.some((g) => g.chase === f);
  if (f.state === 'prowl' && chased) { f.state = 'run'; f.runAt = f.t; f.calm = 0; }
  if (f.state === 'run') {
    if (chased) f.calm = 0; else if (++f.calm > 5) f.state = 'prowl';
    if (f.fails >= 2 || f.t - f.runAt > 28) f.state = 'flee';
    else if (f.state === 'run') {
      f.sp = f.slipT > 0 ? 2.0 : 1.5;
      const nb = pathNb(f.tile).slice(); let best = -1, bs = -1;
      for (const n of nb) {
        let d = 1e9; for (const g of staff) if (g.type === 'sec' && !g.asleep && g.state === 'work') { const dx = wX(tX(n)) - g.x, dz = wZ(tY(n)) - g.z; d = Math.min(d, dx * dx + dz * dz); }
        if (n === f.prev) d *= 0.6;
        if (d > bs) { bs = d; best = n; }
      }
      if (best >= 0) { f.prev = f.tile; f.tile = best; setWP(f, best); return; }
      f.state = 'flee';
    }
  }
  if (f.state === 'flee' || f.steals >= 4 || f.t > 150) {
    f.state = 'flee'; f.sp = f.slipT > 0 ? 2.0 : f.fails >= 2 ? 1.9 : 1.65;
    const d = entDist(), n = f.tile === ENT || d[f.tile] < 0 ? -1 : downhill(d, f.tile);
    if (n < 0) { f.state = 'out'; f.wx = wX(HALF) + f.ox; f.wz = HALF + 13.6; return; }
    f.prev = f.tile; f.tile = n; setWP(f, n); return;
  }
  if (f.cd <= 0 && !guardNear(f, 9)) {
    let v = null, bd = 1.3;
    for (const g of guests) { if (g.state === 'ride' || g.cash < 3) continue; const dx = g.x - f.x, dz = g.z - f.z, d = dx * dx + dz * dz; if (d < bd) { bd = d; v = g; } }
    if (v) {
      const amt = Math.min(v.cash, rnd(4, 12)); v.cash -= amt; f.loot += amt; f.steals++; f.cd = rnd(5, 9);
      v.happy = Math.max(0, v.happy - 14); think(v, 'thief'); complaints.thief++;
      if (S.secLvl >= 2) for (const s of staff) if (s.type === 'sec' && s.asleep) { const dx = s.x - f.x, dz = s.z - f.z; if (dx * dx + dz * dz < 20) wakeGuard(s); }
    } else f.cd = 1;
  }
  const n = randNeighbor(f.tile, f.prev);
  if (n < 0) { f.state = 'flee'; return; }
  f.prev = f.tile; f.tile = n; setWP(f, n);
}
function thiefTick() {
  if (S.goal < THIEF_LEVEL || guests.length < 25) return;
  if (thieves.length >= 1 + Math.floor(guests.length / 120)) return;
  if (Math.random() < 0.0045 * (1 + guests.length / 120) * (staffN('sec') ? Math.max(0.6, 1 - 0.08 * (S.secLvl - 1)) : 1)) spawnThief();
}
// what a guard does next: a route to walk, null to wander, or false when he stays put
function guardPlan(s) {
  const lvl = S.secLvl;
  if (!s.postB || s.postB.removed) {
    s.postB = freePost(s); s.post = null;
    if (!s.postB) { toast(s.name + ' hat keinen Wachposten mehr und verlässt den Park. Die Einstellungskosten bekommst du zurück.', 'bad'); earn(STAFF.sec.hire, 'bonus'); removeStaff(s); return false; }
  }
  if (lvl >= 3) { s.g = 'patrol'; s.asleep = false; } else if (s.g === 'patrol') s.g = 'sleep';
  if (s.g === 'awake' && s.alertT <= 0 && !thieves.some(thiefActive)) s.g = 'sleep';
  if (s.g === 'sleep') {
    const pb = s.postB, acc = accessOf(pb), fr = inB(pb.x + DIRS[pb.rot][0], pb.y + DIRS[pb.rot][1]) ? idx(pb.x + DIRS[pb.rot][0], pb.y + DIRS[pb.rot][1]) : -1;
    if (acc.length) { if (acc.indexOf(s.post) < 0) s.post = acc.indexOf(fr) >= 0 ? fr : acc[0]; }
    else if (s.post == null || tType[s.post] !== 1) {
      const r = []; let c = s.tile, p = s.prev;
      for (let k = rint(3, 7); k > 0; k--) { const n = randNeighbor(c, p); if (n < 0) break; r.push(n); p = c; c = n; }
      s.post = c; if (r.length) return r;
    }
    if (s.tile !== s.post) { const r = bfsRoute(s.tile, (t) => t === s.post); if (r && r.length) return r; s.post = s.tile; }
    if (!s.asleep && acc.length && pb.model.chairs) {   // take a chair inside the hut
      let k = 0; for (const o of staff) { if (o === s) break; if (o.type === 'sec' && o.postB === pb) k++; }
      s.seat = pb.model.chairs[k % pb.model.chairs.length]; s.seat.updateWorldMatrix(true, false);
      const e = s.seat.matrixWorld.elements; s.x = e[12]; s.z = e[14]; s.moving = false;
    }
    s.asleep = true; s.busy = 1.2; s.job = 'sleep'; s.chase = null; return false;
  }
  s.asleep = false;
  if (s.chase && (s.chase.gone || !thiefActive(s.chase))) s.chase = null;
  if (!s.chase) {
    const sight = GUARD_SIGHT[lvl - 1]; let bd = 1e9;
    for (const f of thieves) { if (!thiefActive(f)) continue; const d = (f.x - s.x) * (f.x - s.x) + (f.z - s.z) * (f.z - s.z); if ((f.spotted || (d < sight && (f.steals > 0 || lvl >= 4))) && d < bd) { bd = d; s.chase = f; } }
    if (s.chase && !s.chase.spotted) { s.chase.spotted = true; if (audioReady()) speak('stop', 0.9, hearing(s.x, s.z) * 0.09); }
  }
  if (s.chase) { const tt = s.chase.tile, r = bfsRoute(s.tile, (t) => t === tt); if (r) return r.slice(0, 2); s.chase = null; }
  return null;
}
// a guard who is no longer asleep leaves his chair and steps out in front of the hut
function standUp(s) {
  const t = s.post != null && tType[s.post] === 1 ? s.post : nearestPath(s.x, s.z);
  s.seat = null; s.tile = t; s.prev = -1; s.x = wX(tX(t)) + s.ox * 0.5; s.z = wZ(tY(t)) + s.oz * 0.5; s.going = false; s.route = [];
}
function guardStep(s, dt) {
  if (s.seat && (!s.asleep || !s.postB || s.postB.removed)) { s.asleep = false; standUp(s); }
  if (s.tryCd > 0) s.tryCd -= dt; if (s.shake > 0) s.shake -= dt;
  if (s.wakeT > 0) { s.wakeT -= dt; if (s.wakeT <= 0) s.wake = 0; }
  if (s.g === 'awake') s.alertT -= dt;
  const f = s.chase;
  if (!f || f.gone || !thiefActive(f) || s.tryCd > 0 || f.slipT > 0) return;
  const dx = f.x - s.x, dz = f.z - s.z; if (dx * dx + dz * dz > 0.55) return;
  if (Math.random() < catchChance()) { grabThief(s, f); return; }
  f.slipT = 3.5; f.fails++; s.tryCd = 2.2; sfxAt('slip', f.x, f.z, 1.4);
  if (S.time - slipToastAt > 8) { slipToastAt = S.time; toast('Der Dieb ist ' + s.name + ' entwischt. Mehr Wachleute fangen sicherer.', 'bad'); }
}

/* ----- the hand: wakes sleeping guards and throws held thieves out ----- */
const handEl = $('#hand'); let handTimer = 0, handBusy = false;
// mode 'knock': a closed fist that raps on a sleeping guard; mode 'grab': an open hand that closes around a thief
function handAt(cx, cy, press, mode) {
  const r = $('#app').getBoundingClientRect(); handEl.hidden = false; if (mode) handEl.dataset.mode = mode;
  handEl.style.transform = 'translate(' + (cx - r.left) + 'px,' + (cy - r.top) + 'px)'; handEl.classList.toggle('press', !!press);
}
function handHide() { handEl.hidden = true; handEl.classList.remove('press'); canvas.classList.remove('nocursor'); }
function handTarget(cx, cy) {
  const held = thieves.filter((f) => f.state === 'held'), t = held.length ? figAt(held, cx, cy) : null; if (t) return { thief: t };
  const sl = staff.filter((s) => s.asleep), g = sl.length ? figAt(sl, cx, cy) : null; return g ? { guard: g } : null;
}
function handHover(cx, cy) {
  if (handBusy) { handAt(cx, cy, true); return; }
  const t = !tool && !pov ? handTarget(cx, cy) : null;
  if (t) { handAt(cx, cy, false, t.guard ? 'knock' : 'grab'); canvas.classList.add('nocursor'); } else if (!handEl.hidden) handHide();
}
function handPress(cx, cy, touch, mode) {
  handEl.classList.remove('press'); void handEl.offsetWidth;   // lets the knock start over on every tap
  handAt(cx, cy, true, mode); handBusy = true; clearTimeout(handTimer);
  handTimer = setTimeout(() => { handBusy = false; handEl.classList.remove('press'); if (touch) handHide(); else handHover(cx, cy); }, mode === 'knock' ? 400 : 280);
}
