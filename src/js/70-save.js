/* ================= save, load, new game ================= */
const SAVE_KEY = 'rummelinsel.save.v1';
function serialize() {
  const paths = [], lit = [];
  for (let i = 0; i < N * N; i++) { if (tType[i] === 1) paths.push(i); if (litter[i]) lit.push(i, litter[i]); }
  return { v: 1, S: Object.assign({}, S), fin, paths, lit, guests: guests.length,
    objs: builds.concat(decos).map((o) => (o.def.cat === 'deco' ? [o.k, o.x, o.y, o.rot, o.nat ? 1 : 0] : [o.k, o.x, o.y, o.rot, o.price, o.count, Math.round(o.income), o.open ? 1 : 0, o.broken ? 1 : 0, o.wear, o.nodes || 0])),
    staffList: staff.filter((s) => s.state !== 'quit').map((s) => [s.type, s.name, Math.round(s.mood), Math.round(s.energy)]) };
}
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(serialize())); } catch (e) { /* storage is optional */ } }
function clearWorld() {
  for (const o of builds.concat(decos)) { o.removed = true; scene.remove(o.group); o.group.traverse((m) => { if (m.geometry) m.geometry.dispose(); }); }
  if (pov || fp) exitMode();
  builds = []; decos = []; animDecos = []; guests = []; thieves = []; thiefSeen = false;
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
  for (const i of data.paths) if (tType[i] === 0) { tType[i] = 1; pathCount++; }
  if (tType[ENT] !== 1) { tType[ENT] = 1; pathCount++; }
  for (const o of data.objs) {
    const d = DEFS[o[0]]; if (!d || !canPlace(d, o[1], o[2], o[3]) || (d.k === 'custom' && !Array.isArray(o[10]))) continue;
    const ob = placeObj(o[0], o[1], o[2], o[3], { nat: d.cat === 'deco' && !!o[4], nodes: o[10] });
    if (d.cat !== 'deco') { ob.price = +o[4] || 0; ob.count = o[5] || 0; ob.income = o[6] || 0; ob.open = !!o[7]; ob.broken = !!o[8]; ob.wear = o[9] || 0; }
  }
  for (let i = 0; i + 1 < data.lit.length; i += 2) if (tType[data.lit[i]] === 1) { litter[data.lit[i]] = data.lit[i + 1]; litterTotal += data.lit[i + 1]; }
  if (Array.isArray(data.staffList)) { for (const e of data.staffList) if (STAFF[e[0]]) hire(e[0], true, e); }
  else for (const k in STAFF) for (let i = 0; i < ((data.staff && data.staff[k]) || 0); i++) hire(k, true);
  scatterStaff();
  for (let i = 0; i < Math.min(data.guests || 0, MAXG - 30); i++) spawnGuest(true);
  sun.castShadow = S.shadows;
}
function newGame() {
  clearWorld();
  Object.assign(S, { money: 4000, loan: 0, time: DAY * 0.1, ticket: 5, rating: 55, goal: 0, exitAvg: 62, visitors: 0, rep: 70, wage: 1 });
  fin = { today: newFin(), yest: newFin() }; curDay = 0;
  for (let y = N - 1; y >= N - 9; y--) setPath(idx(HALF, y), true);
  for (let x = HALF - 4; x <= HALF + 4; x++) setPath(idx(x, N - 6), true);
  placeObj('carousel', HALF + 1, N - 5, 0);
  placeObj('fries', HALF - 1, N - 4, 3);
  placeObj('lamp', HALF + 1, N - 1, 0, { nat: true }); placeObj('lamp', HALF - 1, N - 7, 0, { nat: true });
  placeObj('flowers', HALF - 1, N - 1, 0, { nat: true }); placeObj('flowers', HALF - 1, N - 2, 0, { nat: true });
  for (let i = 0; i < 80; i++) {
    const x = rint(0, N - 1), y = rint(0, N - 1);
    if (Math.abs(x - HALF) < 8 && y > N - 14) continue;
    if (tType[idx(x, y)] === 0) placeObj(pick(['tree', 'tree', 'pine', 'palm']), x, y, 0, { nat: true });
  }
  for (const [x, y] of [[HALF - 3, N - 3], [HALF + 5, N - 3], [HALF - 5, N - 8], [HALF + 6, N - 8], [HALF - 2, N - 8]]) if (tType[idx(x, y)] === 0) placeObj('tree', x, y, 0, { nat: true });
  for (let i = 0; i < 9; i++) spawnGuest(true);
  sun.castShadow = S.shadows;
}

