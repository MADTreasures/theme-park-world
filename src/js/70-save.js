/* ================= save, load, new game ================= */
const SAVE_KEY = DEV ? 'rummelinsel.dev.v1' : 'rummelinsel.save.v1';
function serialize() {
  const paths = [], lit = [];
  for (let i = 0; i < N * N; i++) { if (tType[i] === 1) paths.push(i); if (litter[i]) lit.push(i, litter[i]); }
  return { v: 1, n: N, S: Object.assign({}, S), fin, paths, lit, guests: guests.length,
    objs: builds.concat(decos).map((o) => (o.def.cat === 'deco' ? [o.k, o.x, o.y, o.rot, o.nat ? 1 : 0, o.cut ? (o.then === 'path' ? 2 : 1) : 0] : [o.k, o.x, o.y, o.rot, o.price, o.count, Math.round(o.income), o.open ? 1 : 0, o.broken ? 1 : 0, o.wear, o.nodes || 0, o.site ? [Math.round(o.site.done * 10) / 10, o.site.total, o.site.want] : 0])),
    staffList: staff.filter((s) => s.state !== 'quit').map((s) => [s.type, s.name, Math.round(s.mood), Math.round(s.energy)]) };
}
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(serialize())); } catch (e) { /* storage is optional */ } }
function clearWorld() {
  for (const o of builds.concat(decos)) { o.removed = true; scene.remove(o.group); o.group.traverse((m) => { if (m.geometry) m.geometry.dispose(); }); }
  if (pov || fp) exitMode();
  builds = []; decos = []; animDecos = []; guests = []; thieves = []; thiefSeen = false; splashes = []; cuts = []; plotDirty.fill(1);
  for (const s of staff) { scene.remove(s.mesh); s.mesh.traverse((m) => { if (m.geometry) m.geometry.dispose(); }); }
  staff = [];
  tType.fill(0); tObj.fill(null); litter.fill(0); beauty.fill(0); binNear.fill(0);
  litterTotal = 0; pathCount = 0; pathVersion++; pathDirty = litterDirty = colorsDirty = uiDirty = true; spawnAcc = 0; secAcc = 0; hintT = 0;
  for (const k in complaints) complaints[k] = 0;
}
function scatterStaff() {
  const tiles = []; for (let i = 0; i < N * N; i++) if (tType[i] === 1) tiles.push(i);
  for (const s of staff) { s.tile = pick(tiles); s.x = wX(tX(s.tile)) + s.ox; s.z = wZ(tY(s.tile)) + s.oz; }
}
function load(data) {
  clearWorld();
  const keep = { speed: S.speed };
  Object.assign(S, data.S, keep);
  if (data.fin && data.fin.today && data.fin.yest) fin = { today: Object.assign(newFin(), data.fin.today), yest: Object.assign(newFin(), data.fin.yest) };
  curDay = Math.floor(S.time / DAY);
  // Parks saved on the old, smaller island (40 × 40) move to the middle of the south shore and keep all of their land.
  const old = data.n !== N, n0 = old ? 40 : N, dx = old ? (N - 40) / 2 : 0, dy = old ? N - 40 : 0, at = (i) => idx(i % n0 + dx, ((i / n0) | 0) + dy);
  if (!old && typeof S.land === 'string' && S.land.length === PN * PN) landSet(S.land.split('').map((c, p) => (c === '1' ? p : -1)).filter((p) => p >= 0));
  else { const l = []; for (let py = 2; py < 6; py++) for (let px = 1; px < 5; px++) l.push(px + py * PN); landSet(l); }
  for (const p of START_PLOTS) plotOwned[p] = 1; landApply();
  for (const i of data.paths) { const t = at(i); if (tType[t] === 0) { tType[t] = 1; pathCount++; } }
  if (tType[ENT] !== 1) { tType[ENT] = 1; pathCount++; }
  for (const o of data.objs) {
    const d = DEFS[o[0]], x = o[1] + dx, y = o[2] + dy; if (!d || !canPlace(d, x, y, o[3], true) || (d.k === 'custom' && !Array.isArray(o[10]))) continue;
    const nodes = old && Array.isArray(o[10]) ? o[10].map((q) => [q[0] + dx, q[1] + dy, q[2]]) : o[10];
    const ob = placeObj(o[0], x, y, o[3], { nat: d.cat === 'deco' && !!o[4], nodes });
    if (d.cat !== 'deco') { ob.price = +o[4] || 0; ob.count = o[5] || 0; ob.income = o[6] || 0; ob.open = !!o[7]; ob.broken = !!o[8]; ob.wear = o[9] || 0; if (Array.isArray(o[11])) startSite(ob, o[11]); }
    else if (o[5] && d.plant) { ob.cut = true; ob.fee = d.cut; ob.then = o[5] === 2 ? 'path' : null; ob.cutter = null; cuts.push(ob); }
  }
  for (let i = 0; i + 1 < data.lit.length; i += 2) { const t = at(data.lit[i]); if (tType[t] === 1) { litter[t] = data.lit[i + 1]; litterTotal += data.lit[i + 1]; } }
  if (old) for (let p = 0; p < PN * PN; p++) if (!plotOwned[p]) growWild(p, rint(9, 12));
  if (Array.isArray(data.staffList)) { for (const e of data.staffList) if (STAFF[e[0]]) hire(e[0], true, e); }
  else for (const k in STAFF) for (let i = 0; i < ((data.staff && data.staff[k]) || 0); i++) hire(k, true);
  if (!S.b1) { S.b1 = true; if (!staffN('build')) hire('build', true); }   // every park has one builder to begin with
  scatterStaff();
  for (let i = 0; i < Math.min(data.guests || 0, MAXG - 30); i++) spawnGuest(true);
  sun.castShadow = S.shadows;
  if (S.wx && WX_NAME[S.wx.k]) { WX.k = S.wx.k; WX.t = S.wx.t; } else wxSet('sun', true);
}
function newGame() {
  clearWorld();
  Object.assign(S, { money: 4000, loan: 0, time: DAY * 0.1, ticket: 5, rating: 55, goal: 0, exitAvg: 62, visitors: 0, rep: 70, wage: 1, secLvl: 1, secXp: 0 });
  wxSet('sun', true); WX.bonus = 0; WX.wasRain = false;
  fin = { today: newFin(), yest: newFin() }; curDay = 0;
  landSet(START_PLOTS);
  for (let y = N - 1; y >= N - 9; y--) setPath(idx(HALF, y), true);
  for (let x = HALF - 4; x <= HALF + 4; x++) setPath(idx(x, N - 6), true);
  placeObj('carousel', HALF + 1, N - 5, 0);
  placeObj('fries', HALF - 1, N - 4, 3);
  placeObj('lamp', HALF + 1, N - 1, 0); placeObj('lamp', HALF - 1, N - 7, 0);
  placeObj('flowers', HALF - 1, N - 1, 0, { nat: true }); placeObj('flowers', HALF - 1, N - 2, 0, { nat: true });
  // the park's own land is lightly wooded, the rest of the island is wild
  for (let p = 0; p < PN * PN; p++) growWild(p, plotOwned[p] ? 5 : rint(9, 12));
  for (const [x, y] of [[HALF - 3, N - 3], [HALF + 5, N - 3], [HALF - 5, N - 8], [HALF + 6, N - 8], [HALF - 2, N - 8]]) if (tType[idx(x, y)] === 0) placeObj('tree', x, y, 0, { nat: true });
  for (let i = 0; i < 9; i++) spawnGuest(true);
  hire('build', true); S.b1 = true;
  sun.castShadow = S.shadows;
}

