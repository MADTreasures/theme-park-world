/* ================= staff ================= */
// Every employee has energy (drops while working, refills in a break room) and a mood that drifts slowly towards what their
// conditions deserve: a bed, regular breaks and the wage level. Mood moves over minutes, so there is always time to react.
const staffN = (type) => { let n = 0; for (const s of staff) if (s.type === type && s.state !== 'quit') n++; return n; };
const staffAll = () => { let n = 0; for (const s of staff) if (s.state !== 'quit') n++; return n; };
const WAGE = [0.8, 1, 1.25], WAGE_NAME = ['knapp', 'üblich', 'grosszügig'];
function housing() { let n = 2; for (const b of builds) if (b.def.housing) n += b.def.housing; return n; }
// a guard post with a free place, or null
function freePost(who) {
  for (const b of builds) if (b.def.guards && !b.removed) { let n = 0; for (const o of staff) if (o !== who && o.postB === b) n++; if (n < b.def.guards) return b; }
  return null;
}
const postPlaces = () => builds.reduce((n, b) => n + (b.def.guards || 0), 0);
function hireCost(type) { const r = S.rep; return Math.round(STAFF[type].hire * (r >= 85 ? 0.9 : r >= 70 ? 1 : 1 + (70 - r) / 70 * 1.5)); }
const repWord = () => (S.rep >= 85 ? 'ausgezeichnet' : S.rep >= 70 ? 'gut' : S.rep >= 50 ? 'angekratzt' : S.rep >= 30 ? 'schlecht' : 'miserabel');
function staffLook(s, type) {
  dress(s, false); s.sc = 1.04; s.top = 2; s.bottom = 0; s.hair = 3; s.pack = 0; s.shades = 0; s.trim = 0xffffff; s.shoe = 0x2b2b33; s.legs = s.skin;
  if (type === 'jan') { s.shirt = s.pants = 0x3d8bfd; s.hairCol = 0xfff6dc; s.trim = 0xfff6dc; }
  else if (type === 'mech') { s.shirt = s.pants = 0xf08a24; s.hairCol = 0xffd23f; s.trim = 0x232861; }
  else if (type === 'gard') { s.shirt = 0x55c26a; s.pants = 0x7a5c3a; s.hair = 5; s.hairCol = 0xe8cf8a; s.trim = 0xfff6dc; s.shoe = 0x6b4a2a; s.top = 0; }
  else if (type === 'sec') { s.shirt = 0xa3acbb; s.pants = 0x687182; s.hair = 10; s.hairCol = 0x7f8898; s.trim = 0xffd23f; s.shoe = 0x2b2b33; }   // light grey uniform, peaked cap, yellow trim
  else if (type === 'build') { s.shirt = 0xff8a1f; s.pants = 0x3d5a9a; s.hair = 9; s.hairCol = s.browCol; s.trim = 0xffe14a; s.shoe = 0x6b4a2a; s.top = 0; }
  else if (type === 'clown') { s.shirt = 0xffd23f; s.pants = 0xff4f64; s.hair = 4; s.hairCol = s.browCol = pick([0xff4f64, 0x3d8bfd, 0x55c26a, 0xff8fc7, 0xf08a24]); s.skin = 0xfff1e6; s.trim = 0x3d8bfd; s.shoe = 0xff4f64; }
  else { s.shirt = 0x8c5cff; s.pants = 0x232861; s.top = 1; s.hair = pick([0, 2, 6, 7, 8]); s.hairCol = s.browCol; s.trim = 0xffd23f; s.shoe = 0xffffff; }
}
// A posed, non-instanced copy of a staff figure, used for the cards in the tray.
function staffStatue(type) {
  if (type === 'ent') return mStaff(type);
  const g = new T.Group(), s = {}, u = mStaff(type).userData; staffLook(s, type);
  const part = (parent, geo, col, x, y, z, rx, ry, rz, flat) => {
    const m = new T.Mesh(geo, flat ? new T.MeshBasicMaterial({ color: col, vertexColors: true }) : softMat({ color: col, vertexColors: true }, 0.5, 0.16));
    m.position.set(x || 0, y || 0, z || 0); m.rotation.set(rx || 0, ry || 0, rz || 0); m.userData.shared = true; parent.add(m); return m;
  };
  part(g, FGH.torso, s.shirt); part(g, FGH.trim, s.trim); if (s.top === 2) part(g, FGH.zip, s.trim); part(g, FGH.pelvis, s.pants);
  const head = part(g, FGH.head, s.skin, 0, FIG.NECK, 0, 0, 0.25);
  if (s.hair >= 0) part(head, FGH.hair[s.hair], s.hairCol);
  if (s.hair === 3 || s.hair === 5 || s.hair === 10 || s.hair === 11) part(head, FGH.hair[9], s.browCol);
  for (const sd of [-1, 1]) {
    part(head, FGH.eye, 0xffffff, sd * FIG.EX, FIG.EY, FIG.EZ, 0, sd * FIG.EYAW, 0, true); part(head, FGH.iris, s.eye, sd * FIG.EX + 0.0015, FIG.EY, FIG.EZ, 0, sd * FIG.EYAW, 0, true);
    part(head, FGH.brow, s.browCol, sd * FIG.EX, FIG.BROW[0] + (type === 'sec' ? 0 : 0.004), FIG.BROW[1], 0, sd * FIG.BYAW, type === 'sec' ? sd * 0.25 : 0);
  }
  part(head, FGH.mouth[type === 'clown' || type === 'jug' ? 1 : 0], 0xffffff, 0, FIG.MOUTH[0], FIG.MOUTH[1]);
  if (u.head) head.add(u.head);
  if (u.body) g.add(u.body);
  if (u.balls) u.balls.forEach((bl, i) => bl.position.set(-0.09 + i * 0.09, 0.7 + (i === 1 ? 0.08 : 0), 0.1));
  for (const sd of [-1, 1]) {
    const up = type === 'jug' || (type === 'clown' && sd > 0), wave = type === 'clown' && sd > 0, tool = (type === 'jan' || type === 'gard') && sd > 0;
    const th = part(g, FGH.thigh, s.pants, sd * FIG.LX, FIG.HIP, 0), sh = part(th, FGH.shin, s.pants, 0, -FIG.THIGH, 0); part(sh, FGH.shoe, s.shoe); part(sh, FGH.sole, 0xffffff);
    const sl = part(g, FGH.upper, s.top === 2 ? s.shirt : s.skin, sd * FIG.SX, FIG.SHO, 0, wave ? -2.6 : up ? -0.3 : tool ? -0.35 : 0.05, 0, sd * 0.13); if (s.top === 0) part(sl, FGH.cap, s.shirt); if (s.top === 2) part(sl, FGH.stripe, s.trim);
    const fo = part(sl, FGH.forearm, s.top === 2 ? s.shirt : s.skin, 0, -FIG.UARM, 0, wave ? -0.3 : up ? -1.3 : tool ? -0.05 : type === 'mech' || type === 'gard' ? 0 : -0.3); part(fo, FGH.hand, s.skin); part(fo, FGH.wrist, s.trim);
    const hp = sd > 0 ? u.handR : u.handL; if (hp) fo.add(hp);
  }
  return g;
}
function hire(type, free, saved) {
  if (!free) { const c = hireCost(type); if (S.money < c) return null; spend(c, 'wage'); }
  const m = mStaff(type); scene.add(m);
  const s = { type, mesh: m, name: pick(NAMES), x: wX(HALF) + rnd(-0.2, 0.2), z: wZ(N - 1), tile: ENT, prev: -1, wx: 0, wz: 0, ox: rnd(-0.25, 0.25), oz: rnd(-0.25, 0.25),
    sp0: type === 'ent' ? 0.8 : type === 'sec' ? 1.45 : type === 'jug' ? 1.0 : type === 'gard' ? 1.2 : 1.3, sp: 1.3, off: false, cutT: null, site: null, seat: null, rot: Math.PI, route: [], going: false, busy: 0, job: null, fix: null, moving: false, ph: rnd(TAU),
    mood: 66, energy: rnd(70, 100), lowT: 0, warned: false, housed: true, state: 'work', room: null, breakCd: rnd(5, 20), lastBreak: S.time, chase: null, target: null, show: false, g: 'sleep', post: null, wake: 0, wakeT: 0, alertT: 0, tryCd: 0, hold: null, asleep: false, shake: 0, postB: null };
  if (type === 'sec') s.postB = freePost(s);
  if (type !== 'ent') { staffLook(s, type); s.fig = true; }
  s.rr = s.rot; s.brave = 0; s.balloon = 0;
  if (saved) { s.name = saved[1] || s.name; s.mood = +saved[2] || 60; s.energy = +saved[3] || 80; }
  staff.push(s); colorsDirty = true; if (!free) sfx('hello'); return s;
}
function removeStaff(s) {
  if (s.hold) releaseThief(s.hold);
  if (s.cutT) { if (s.cutT.cutter === s) s.cutT.cutter = null; s.cutT = null; }
  if (s.site) leaveSite(s);
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
  s.state = 'quit'; s.route = []; s.busy = 0; s.job = null; s.chase = null; s.off = false; if (s.site) leaveSite(s);
  S.rep = Math.max(0, S.rep - 12);
  toast(s.name + ' (' + STAFF[s.type].name + ') hat gekündigt. Das spricht sich herum: Neues Personal wird teurer.', 'bad'); sfx('hmpf'); uiDirty = true;
}
function staffGo(s, n) { s.prev = s.tile; s.tile = n; setWP(s, n); s.going = true; }
const breakFree = () => { for (const b of builds) if (b.def.rest && !b.removed && b.res < b.def.rest) return true; return false; };
// tired, and there is a place to rest
const needsBreak = (s) => s.energy < 25 && s.breakCd <= 0 && !s.chase && !s.hold && !s.asleep && breakFree();
function seekBreak(s) {
  const goals = new Map();
  for (const b of builds) if (b.def.rest && b.res < b.def.rest) for (const a of accessOf(b)) goals.set(a, b);
  if (!goals.size) return false;
  const route = bfsRoute(s.tile, (t) => goals.has(t)); if (!route) return false;
  s.room = goals.get(route.length ? route[route.length - 1] : s.tile); s.room.res++;
  s.state = 'toBreak'; s.route = route; s.chase = null; s.target = null; s.asleep = false; s.off = false; if (s.site) leaveSite(s);
  if (s.cutT) { if (s.cutT.cutter === s) s.cutT.cutter = null; s.cutT = null; }
  if (s.fix) { if (s.fix.fixer === s) s.fix.fixer = null; s.fix = null; }
  staffArrive(s); return true;
}
function endBreak(s) {
  const r = s.room;
  if (r) { r.res = Math.max(0, r.res - 1); const i = r.resting.indexOf(s); if (i >= 0) r.resting.splice(i, 1); }
  s.room = null; s.state = 'work'; s.mesh.visible = true; s.lastBreak = S.time; s.mood = Math.min(100, s.mood + 5); s.breakCd = 30;
  const acc = r && !r.removed ? accessOf(r) : []; const t = acc.length ? acc[0] : nearestPath(s.x, s.z);
  s.tile = t; s.prev = -1; s.x = wX(tX(t)) + s.ox; s.z = wZ(tY(t)) + s.oz; s.going = false; s.route = [];
  colorsDirty = true; sfxAt('ahh', s.x, s.z);
}
function staffArrive(s) {
  if (s.type === 'jan' && s.state === 'work' && litter[s.tile]) { s.busy = 0.7; s.job = 'clean'; sfxAt('sweep', s.x, s.z); return; }
  while (s.route.length) { const n = s.route.shift(); if (tType[n] === 1 || (s.off && walkable(n))) { staffGo(s, n); return; } s.route = []; }
  if (s.type === 'gard' && s.cutT && s.state === 'work') {
    const o = s.cutT, near = !o.removed && o.cut && Math.abs(tX(s.tile) - o.x) + Math.abs(tY(s.tile) - o.y) <= 1;
    if (near) { s.busy = 2.4; s.job = 'cut'; s.rot = Math.atan2(wX(o.x) - s.x, wZ(o.y) - s.z); sfxAt('chop', s.x, s.z); } else { if (o.cutter === s) o.cutter = null; s.cutT = null; }
    return;
  }
  if (s.state === 'quit') { if (s.tile === ENT) removeStaff(s); return; }
  if (s.state === 'toBreak') {
    const r = s.room;
    if (r && !r.removed && accessOf(r).indexOf(s.tile) >= 0) { s.state = 'rest'; r.resting.push(s); s.mesh.visible = false; colorsDirty = true; }
    else { if (r) r.res = Math.max(0, r.res - 1); s.room = null; s.state = 'work'; s.breakCd = 15; }
    return;
  }
  const b = s.fix;
  if (s.type === 'mech' && b && !b.removed && b.broken && accessOf(b).indexOf(s.tile) >= 0) { s.busy = 4; s.job = 'fix'; sfxAt('clank', s.x, s.z); return; }
  if (b) { if (b.fixer === s) b.fixer = null; s.fix = null; }
  if (s.type === 'clown' && s.target) { s.busy = 8; s.job = 'show'; s.target = null; sfxAt('honk', s.x, s.z); return; }
  if (s.type === 'jug' && s.show) { s.busy = 9; s.job = 'juggle'; s.show = false; sfxAt('toss', s.x, s.z); return; }
  if (s.type === 'gard' && s.state === 'work' && beauty[s.tile] > 0.5 && Math.random() < 0.14) { s.busy = 2.8; s.job = 'water'; sfxAt('water', s.x, s.z); }
}
function staffDone(s) {
  if (s.job === 'clean' && litter[s.tile]) { litterTotal -= litter[s.tile]; litter[s.tile] = 0; litterDirty = true; }
  else if (s.job === 'fix' && s.fix) { if (!s.fix.removed && s.fix.broken) repair(s.fix); s.fix = null; }
  else if (s.job === 'hold') { if (s.hold) throwThief(s.hold, false); }
  else if (s.job === 'cut') { const o = s.cutT; s.cutT = null; if (o && !o.removed && o.cut) { sfxAt('timber', s.x, s.z); finishCut(o); } }
  else if (s.job === 'build') { if (s.site && s.site.site && s.state === 'work' && !needsBreak(s) && !noPlace(s)) { s.busy = 3; return; } }   // keeps hammering; the site counts the work, see stepSites
  else if (s.job === 'water') { for (const g of guests) { const dx = g.x - s.x, dz = g.z - s.z; if (dx * dx + dz * dz < 9 && g.state !== 'ride') g.happy = Math.min(100, g.happy + 2); } }
  else if (s.job === 'juggle') {
    sfxAt('clap', s.x, s.z);
    let n = 0;
    for (const g of guests) { const dx = g.x - s.x, dz = g.z - s.z; if (dx * dx + dz * dz < 12 && g.state !== 'ride') { g.happy = Math.min(100, g.happy + 5); n++; if (Math.random() < 0.15) think(g, 'great'); } }
    if (n) earn(n * 0.4, 'bonus');
  }
  s.job = null;
}
function staffPlan(s) {
  let route = null;
  if (s.state === 'quit') { route = bfsRoute(s.tile, (t) => t === ENT); if (!route) { removeStaff(s); return; } s.route = route; staffArrive(s); return; }
  if (s.energy < 25 && s.breakCd <= 0 && !s.chase && !s.hold && !s.asleep) { if (seekBreak(s)) return; s.breakCd = 25; }
  if (s.type === 'jan' && litterTotal > 0) route = bfsRoute(s.tile, (t) => litter[t] > 0);
  else if (s.type === 'mech') {
    const goals = new Map();
    for (const b of builds) if (b.broken && (!b.fixer || b.fixer.fix !== b || staff.indexOf(b.fixer) < 0)) for (const a of accessOf(b)) goals.set(a, b);
    if (goals.size) {
      route = bfsRoute(s.tile, (t) => goals.has(t));
      if (route) { s.fix = goals.get(route.length ? route[route.length - 1] : s.tile); s.fix.fixer = s; }
    }
  } else if (s.type === 'gard') {
    route = gardPlan(s); if (route === false) return;
  } else if (s.type === 'build') {
    route = buildPlan(s); if (route === false) return;
  } else if (s.type === 'sec') {
    route = guardPlan(s); if (route === false) return;
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
// A gardener walks straight across the lawn to the nearest marked plant that nobody else is working on.
// Returns a route, null when there is nothing to cut, or false when he starts cutting on the spot.
function gardPlan(s) {
  if (s.cutT && (s.cutT.removed || !s.cutT.cut)) s.cutT = null;
  if (!cuts.length) return null;
  const goals = new Map();
  for (const o of cuts) {
    const c = o.cutter; if (c && c !== s && c.cutT === o && staff.indexOf(c) >= 0) continue;
    for (let k = 0; k < 4; k++) { const nx = o.x + DIRS[k][0], ny = o.y + DIRS[k][1]; if (inB(nx, ny)) goals.set(idx(nx, ny), o); }
  }
  if (!goals.size) return null;
  const route = fieldRoute(s.tile, (t) => goals.has(t)); if (!route) return null;
  const o = goals.get(route.length ? route[route.length - 1] : s.tile);
  s.cutT = o; o.cutter = s; s.off = true;
  if (!route.length) { staffArrive(s); return false; }
  return route;
}
function stepStaff(s, dt) {
  s.moving = false;
  if (s.state === 'rest') { s.energy = Math.min(100, s.energy + dt * 3.4); if (s.energy >= 100 || !s.room || s.room.removed) endBreak(s); return; }
  s.energy = s.asleep ? Math.min(100, s.energy + dt) : Math.max(0, s.energy - dt * 0.5);
  s.sp = s.sp0 * (s.mood < 35 ? 0.72 : 1) * (s.energy < 8 ? 0.8 : 1) * (s.chase ? 1.3 + 0.05 * S.secLvl : 1);
  if (s.breakCd > 0) s.breakCd -= dt;
  if (s.type === 'sec') guardStep(s, dt);
  if (s.busy > 0) { s.busy -= dt; if (s.busy <= 0) staffDone(s); return; }
  if (s.going) { if (moveTo(s, dt)) { s.going = false; staffArrive(s); } return; }
  if (tType[s.tile] !== 1) {
    // a gardener out on the lawn goes on to the next marked plant and a builder stays with his site, unless they are
    // tired: then they walk back to the path like everyone else, and from there to the break room
    const tired = needsBreak(s);
    if (!tired && s.type === 'gard' && s.state === 'work' && cuts.length) { const r = gardPlan(s); if (r === false) return; if (r) { s.route = r; staffArrive(s); return; } }
    if (!tired && s.type === 'build' && s.state === 'work' && (s.site || anySite())) { const r = buildPlan(s); if (r === false) return; if (r) { s.route = r; staffArrive(s); return; } }
    s.off = false; s.route = []; staffGo(s, nearestPath(s.x, s.z)); return;
  }
  staffPlan(s); if (s.off && !s.cutT && !s.site) s.off = false;
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
    if (s.type === 'ent' && Math.random() < 0.06) sfxAt('squeak', s.x, s.z);
    if (s.type === 'ent' || s.type === 'clown') {
      const r2 = s.type === 'ent' ? 6.5 : 9;
      for (const g of guests) { const dx = g.x - s.x, dz = g.z - s.z; if (dx * dx + dz * dz < r2 && g.state !== 'ride') { g.happy = Math.min(100, g.happy + (s.type === 'ent' ? 1.3 : 0.7)); if (s.type === 'clown' && g.state === 'queue') g.qt = Math.max(1, g.qt - 0.6); } }
    }
  }
  if (wg) spend(wg * WAGE[S.wage] / DAY, 'wage');
  if (n) { const avg = sum / n; S.rep = clamp(S.rep + (avg > 70 ? 0.012 : avg < 40 ? -0.012 : 0), 0, 100); }
  S.rep += (70 - S.rep) * 0.0004;
}
