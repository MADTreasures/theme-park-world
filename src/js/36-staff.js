/* ================= staff ================= */
// Every employee has energy (drops while working, refills in a break room) and a mood that drifts slowly towards what their
// conditions deserve: a bed, regular breaks and the wage level. Mood moves over minutes, so there is always time to react.
const staffN = (type) => { let n = 0; for (const s of staff) if (s.type === type && s.state !== 'quit') n++; return n; };
const staffAll = () => { let n = 0; for (const s of staff) if (s.state !== 'quit') n++; return n; };
const WAGE = [0.8, 1, 1.25], WAGE_NAME = ['knapp', 'üblich', 'grosszügig'];
function housing() { let n = 2; for (const b of builds) if (b.def.housing) n += b.def.housing; return n; }
function hireCost(type) { const r = S.rep; return Math.round(STAFF[type].hire * (r >= 85 ? 0.9 : r >= 70 ? 1 : 1 + (70 - r) / 70 * 1.5)); }
const repWord = () => (S.rep >= 85 ? 'ausgezeichnet' : S.rep >= 70 ? 'gut' : S.rep >= 50 ? 'angekratzt' : S.rep >= 30 ? 'schlecht' : 'miserabel');
function staffLook(s, type) {
  dress(s, false); s.sc = 1.04; s.top = 2; s.bottom = 0; s.hair = 3; s.pack = 0; s.shades = 0;
  if (type === 'jan') { s.shirt = s.pants = 0x3d8bfd; s.hairCol = 0xfff6dc; }
  else if (type === 'mech') { s.shirt = s.pants = 0xf08a24; s.hairCol = 0xffd23f; }
  else if (type === 'sec') { s.shirt = 0x20264f; s.pants = 0x161a38; s.hairCol = 0x161a38; s.shades = 1; }
  else if (type === 'clown') { s.shirt = 0xffd23f; s.pants = 0xff4f64; s.hair = 4; s.hairCol = pick([0xff4f64, 0x3d8bfd, 0x55c26a, 0xff8fc7, 0xf08a24]); s.skin = 0xfff1e6; }
  else { s.shirt = 0x8c5cff; s.pants = 0x232861; s.top = 1; s.hair = pick([0, 2, 6]); s.hairCol = pick(HAIR); }
}
// A posed, non-instanced copy of a staff figure, used for the cards in the tray.
function staffStatue(type) {
  if (type === 'ent') return mStaff(type);
  const g = new T.Group(), s = {}; staffLook(s, type);
  const part = (geo, col, x, y, z, rx, rz) => { const m = new T.Mesh(geo, new T.MeshLambertMaterial({ color: col, vertexColors: true })); m.position.set(x || 0, y || 0, z || 0); m.rotation.set(rx || 0, 0, rz || 0); m.userData.shared = true; g.add(m); };
  part(FG.torso, s.shirt); part(FG.pelvis, s.pants); part(FG.head, s.skin, 0, FIG.NECK, 0); part(FG.hair[s.hair], s.hairCol, 0, FIG.NECK, 0);
  if (s.shades) part(FG.shades, 0xffffff, 0, FIG.NECK, 0);
  for (const sd of [-1, 1]) {
    part(FG.thigh, s.pants, sd * FIG.LX, FIG.HIP, 0); part(FG.shin, s.pants, sd * FIG.LX, FIG.HIP - FIG.THIGH, 0);
    part(FG.sleeve, s.top === 1 ? s.skin : s.shirt, sd * FIG.SX, FIG.SHO, 0, 0, sd * 0.07); part(FG.forearm, s.top === 2 ? s.shirt : s.skin, sd * (FIG.SX + 0.007), FIG.SHO - FIG.UARM, 0, -0.22);
  }
  g.add(mStaff(type));
  return g;
}
function hire(type, free, saved) {
  if (!free) { const c = hireCost(type); if (S.money < c) return null; spend(c, 'wage'); }
  const m = mStaff(type); scene.add(m);
  const s = { type, mesh: m, name: pick(NAMES), x: wX(HALF) + rnd(-0.2, 0.2), z: wZ(N - 1), tile: ENT, prev: -1, wx: 0, wz: 0, ox: rnd(-0.25, 0.25), oz: rnd(-0.25, 0.25),
    sp0: type === 'ent' ? 0.8 : type === 'sec' ? 1.45 : type === 'jug' ? 1.0 : 1.3, sp: 1.3, rot: Math.PI, route: [], going: false, busy: 0, job: null, fix: null, moving: false, ph: rnd(TAU),
    mood: 66, energy: rnd(70, 100), lowT: 0, warned: false, housed: true, state: 'work', room: null, breakCd: rnd(5, 20), lastBreak: S.time, chase: null, target: null, show: false };
  if (type !== 'ent') { staffLook(s, type); s.fig = true; m.scale.setScalar(s.sc); }
  s.rr = s.rot; s.brave = 0; s.balloon = 0;
  if (saved) { s.name = saved[1] || s.name; s.mood = +saved[2] || 60; s.energy = +saved[3] || 80; }
  staff.push(s); colorsDirty = true; return s;
}
function removeStaff(s) {
  if (s.fix && s.fix.fixer === s) s.fix.fixer = null;
  if (s.room) { s.room.res = Math.max(0, s.room.res - 1); const i = s.room.resting.indexOf(s); if (i >= 0) s.room.resting.splice(i, 1); }
  scene.remove(s.mesh); s.mesh.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
  const i = staff.indexOf(s); if (i >= 0) staff.splice(i, 1);
  if (sel && sel.staff === s) select(null);
  colorsDirty = true; uiDirty = true;
}
function fire(type, who) {
  let s = who || null;
  if (!s) for (let i = staff.length - 1; i >= 0; i--) if (staff[i].type === type && staff[i].state !== 'quit') { s = staff[i]; break; }
  if (!s) return false;
  S.rep = Math.max(0, S.rep - (s.mood < 40 ? 6 : 2));
  removeStaff(s); return true;
}
function quit(s) {
  if (s.state === 'quit') return;
  if (s.state === 'rest') endBreak(s);
  if (s.room) { s.room.res = Math.max(0, s.room.res - 1); s.room = null; }
  s.state = 'quit'; s.route = []; s.busy = 0; s.job = null; s.chase = null;
  S.rep = Math.max(0, S.rep - 12);
  toast(s.name + ' (' + STAFF[s.type].name + ') hat gekündigt. Das spricht sich herum: Neues Personal wird teurer.', 'bad'); sfx('error'); uiDirty = true;
}
function staffGo(s, n) { s.prev = s.tile; s.tile = n; setWP(s, n); s.going = true; }
function seekBreak(s) {
  const goals = new Map();
  for (const b of builds) if (b.def.rest && b.res < b.def.rest) for (const a of accessOf(b)) goals.set(a, b);
  if (!goals.size) return false;
  const route = bfsRoute(s.tile, (t) => goals.has(t)); if (!route) return false;
  s.room = goals.get(route.length ? route[route.length - 1] : s.tile); s.room.res++;
  s.state = 'toBreak'; s.route = route; s.chase = null; s.target = null;
  if (s.fix) { if (s.fix.fixer === s) s.fix.fixer = null; s.fix = null; }
  staffArrive(s); return true;
}
function endBreak(s) {
  const r = s.room;
  if (r) { r.res = Math.max(0, r.res - 1); const i = r.resting.indexOf(s); if (i >= 0) r.resting.splice(i, 1); }
  s.room = null; s.state = 'work'; s.mesh.visible = true; s.lastBreak = S.time; s.mood = Math.min(100, s.mood + 5); s.breakCd = 30;
  const acc = r && !r.removed ? accessOf(r) : []; const t = acc.length ? acc[0] : nearestPath(s.x, s.z);
  s.tile = t; s.prev = -1; s.x = wX(tX(t)) + s.ox; s.z = wZ(tY(t)) + s.oz; s.going = false; s.route = [];
  colorsDirty = true;
}
function staffArrive(s) {
  if (s.type === 'jan' && s.state === 'work' && litter[s.tile]) { s.busy = 0.7; s.job = 'clean'; return; }
  while (s.route.length) { const n = s.route.shift(); if (tType[n] === 1) { staffGo(s, n); return; } s.route = []; }
  if (s.state === 'quit') { if (s.tile === ENT) removeStaff(s); return; }
  if (s.state === 'toBreak') {
    const r = s.room;
    if (r && !r.removed && accessOf(r).indexOf(s.tile) >= 0) { s.state = 'rest'; r.resting.push(s); s.mesh.visible = false; colorsDirty = true; }
    else { if (r) r.res = Math.max(0, r.res - 1); s.room = null; s.state = 'work'; s.breakCd = 15; }
    return;
  }
  const b = s.fix;
  if (s.type === 'mech' && b && !b.removed && b.broken && accessOf(b).indexOf(s.tile) >= 0) { s.busy = 4; s.job = 'fix'; return; }
  if (b) { if (b.fixer === s) b.fixer = null; s.fix = null; }
  if (s.type === 'clown' && s.target) { s.busy = 8; s.job = 'show'; s.target = null; return; }
  if (s.type === 'jug' && s.show) { s.busy = 9; s.job = 'juggle'; s.show = false; return; }
}
function staffDone(s) {
  if (s.job === 'clean' && litter[s.tile]) { litterTotal -= litter[s.tile]; litter[s.tile] = 0; litterDirty = true; }
  else if (s.job === 'fix' && s.fix) { if (!s.fix.removed && s.fix.broken) repair(s.fix); s.fix = null; }
  else if (s.job === 'juggle') {
    let n = 0;
    for (const g of guests) { const dx = g.x - s.x, dz = g.z - s.z; if (dx * dx + dz * dz < 12 && g.state !== 'ride') { g.happy = Math.min(100, g.happy + 5); n++; if (Math.random() < 0.15) think(g, 'great'); } }
    if (n) earn(n * 0.4, 'bonus');
  }
  s.job = null;
}
function staffPlan(s) {
  let route = null;
  if (s.state === 'quit') { route = bfsRoute(s.tile, (t) => t === ENT); if (!route) { removeStaff(s); return; } s.route = route; staffArrive(s); return; }
  if (s.energy < 25 && s.breakCd <= 0 && !s.chase) { if (seekBreak(s)) return; s.breakCd = 25; }
  if (s.type === 'jan' && litterTotal > 0) route = bfsRoute(s.tile, (t) => litter[t] > 0);
  else if (s.type === 'mech') {
    const goals = new Map();
    for (const b of builds) if (b.broken && (!b.fixer || b.fixer.fix !== b || staff.indexOf(b.fixer) < 0)) for (const a of accessOf(b)) goals.set(a, b);
    if (goals.size) {
      route = bfsRoute(s.tile, (t) => goals.has(t));
      if (route) { s.fix = goals.get(route.length ? route[route.length - 1] : s.tile); s.fix.fixer = s; }
    }
  } else if (s.type === 'sec') {
    if (s.chase && (s.chase.gone || s.chase.state === 'out')) s.chase = null;
    if (!s.chase) { let bd = 30; for (const f of thieves) { if (f.state === 'in' || f.state === 'out') continue; const d = (f.x - s.x) * (f.x - s.x) + (f.z - s.z) * (f.z - s.z); if (d < bd) { bd = d; s.chase = f; } } }
    if (s.chase) { const tt = s.chase.tile; route = bfsRoute(s.tile, (t) => t === tt); if (route) { route = route.slice(0, 2); s.chase.spotted = true; } else s.chase = null; }
  } else if (s.type === 'clown') {
    let best = null, n = 2;
    for (const b of builds) if (b.def.cat === 'ride' && b.queue.length > n) { n = b.queue.length; best = b; }
    if (best) { const acc = accessOf(best); route = bfsRoute(s.tile, (t) => acc.indexOf(t) >= 0); if (route) s.target = best; }
  }
  if (!route) {
    route = []; let c = s.tile, p = s.prev;
    for (let k = s.type === 'sec' ? rint(4, 9) : rint(2, 5); k > 0; k--) { const n = randNeighbor(c, p); if (n < 0) break; route.push(n); p = c; c = n; }
    if (s.type === 'jug') s.show = true;
    if (!route.length) { s.busy = 0.8; s.job = null; return; }
  }
  s.route = route; staffArrive(s);
}
function stepStaff(s, dt) {
  s.moving = false;
  if (s.state === 'rest') { s.energy = Math.min(100, s.energy + dt * 3.4); if (s.energy >= 100 || !s.room || s.room.removed) endBreak(s); return; }
  s.energy = Math.max(0, s.energy - dt * 0.5);
  s.sp = s.sp0 * (s.mood < 35 ? 0.72 : 1) * (s.energy < 8 ? 0.8 : 1) * (s.chase ? 1.4 : 1);
  if (s.breakCd > 0) s.breakCd -= dt;
  if (s.chase && !s.chase.gone) { const dx = s.chase.x - s.x, dz = s.chase.z - s.z; if (dx * dx + dz * dz < 0.5) { catchThief(s.chase, s); s.chase = null; } }
  if (s.busy > 0) { s.busy -= dt; if (s.busy <= 0) staffDone(s); return; }
  if (s.going) { if (moveTo(s, dt)) { s.going = false; staffArrive(s); } return; }
  if (tType[s.tile] !== 1) { s.route = []; staffGo(s, nearestPath(s.x, s.z)); return; }
  staffPlan(s);
}
// once per game second
let warnAt = -999;
function socialTick() {
  const cap = housing(); let sum = 0, n = 0, wg = 0;
  for (let i = 0; i < staff.length; i++) {
    const s = staff[i]; if (s.state === 'quit') continue;
    wg += STAFF[s.type].wage;
    s.housed = n < cap;
    const rested = S.time - s.lastBreak < 320;
    const target = 55 + (s.housed ? 15 : -10) + (s.energy < 8 ? -20 : rested ? 10 : 0) + (S.wage - 1) * 15;
    s.mood = clamp(s.mood + clamp(target - s.mood, -0.15, 0.15), 0, 100);
    sum += s.mood; n++;
    if (s.mood < 30) {
      s.lowT++;
      if (s.lowT > 50 && !s.warned) { s.warned = true; if (S.time - warnAt > 120) { warnAt = S.time; toast(s.name + ' (' + STAFF[s.type].name + ') ist unzufrieden und denkt ans Kündigen. Schau in die Team-Übersicht.', 'bad'); } }
      if (s.lowT > 200) quit(s);
    } else { s.lowT = Math.max(0, s.lowT - 2); if (s.mood > 45) s.warned = false; }
    if (s.state === 'rest') continue;
    if (s.type === 'ent' || s.type === 'clown') {
      const r2 = s.type === 'ent' ? 6.5 : 9;
      for (const g of guests) { const dx = g.x - s.x, dz = g.z - s.z; if (dx * dx + dz * dz < r2 && g.state !== 'ride') { g.happy = Math.min(100, g.happy + (s.type === 'ent' ? 1.3 : 0.7)); if (s.type === 'clown' && g.state === 'queue') g.qt = Math.max(1, g.qt - 0.6); } }
    }
  }
  if (wg) spend(wg * WAGE[S.wage] / DAY, 'wage');
  if (n) { const avg = sum / n; S.rep = clamp(S.rep + (avg > 70 ? 0.012 : avg < 40 ? -0.012 : 0), 0, 100); }
  S.rep += (70 - S.rep) * 0.0004;
}
