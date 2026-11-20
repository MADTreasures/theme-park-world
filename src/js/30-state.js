/* ================= game state ================= */
const S = { money: 4000, loan: 0, time: DAY * 0.1, ticket: 5, rating: 55, goal: 0, speed: 1, exitAvg: 62, visitors: 0, muted: false, coach: true, shadows: true, rep: 70, wage: 1, cur: null, secLvl: 1, secXp: 0, music: true, wx: null, devInit: false };
const newFin = () => ({ tick: 0, ride: 0, shop: 0, bonus: 0, goods: 0, upkeep: 0, wage: 0, build: 0, loan: 0 });
let fin = { today: newFin(), yest: newFin() }, curDay = 0;
const tType = new Uint8Array(N * N), tObj = new Array(N * N).fill(null), litter = new Uint8Array(N * N), beauty = new Float32Array(N * N), binNear = new Uint8Array(N * N);
let pathVersion = 1, pathDirty = true, litterDirty = true, litterTotal = 0, pathCount = 0, uid = 1;
let builds = [], decos = [], animDecos = [], guests = [], staff = [];
let colorsDirty = true, anyGone = false, uiDirty = true, hintT = 0, secAcc = 0, spawnAcc = 0;
const complaints = { wc: 0, food: 0, drink: 0, money: 0, queue: 0, litter: 0, thief: 0 };
function earn(n, key) { S.money += n; fin.today[key] += n; }
function spend(n, key) { S.money -= n; fin.today[key] += n; }
const unlocked = (d) => S.goal >= d.need;

/* ----- grid ----- */
function setPath(i, on) {
  if (on) { if (tType[i] !== 0) return false; tType[i] = 1; pathCount++; }
  else {
    if (tType[i] !== 1 || i === ENT) return false;
    tType[i] = 0; pathCount--;
    if (litter[i]) { litterTotal -= litter[i]; litter[i] = 0; litterDirty = true; }
  }
  pathVersion++; pathDirty = true; return true;
}
const dims = (d, rot) => (rot % 2 ? [d.h, d.w] : [d.w, d.h]);
function canPlace(d, x, y, rot) {
  const [w, h] = dims(d, rot);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (!inB(x + i, y + j) || tType[idx(x + i, y + j)] !== 0) return false;
  return true;
}
function natIn(d, x, y, rot) {
  const [w, h] = dims(d, rot), list = [];
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    if (!inB(x + i, y + j)) return null;
    const t = idx(x + i, y + j), ob = tObj[t];
    if (tType[t] === 0) continue;
    if (tType[t] === 3 && ob && ob.nat) { if (list.indexOf(ob) < 0) list.push(ob); } else return null;
  }
  return list;
}
function applyBeauty(ob, sgn) {
  const d = ob.def; if (!d.beauty) return;
  const r = d.rad || 2;
  for (let y = ob.y - r; y < ob.y + ob.h + r; y++) for (let x = ob.x - r; x < ob.x + ob.w + r; x++) if (inB(x, y)) beauty[idx(x, y)] += sgn * d.beauty;
}
function rebuildBins() {
  binNear.fill(0);
  for (const o of decos) if (o.def.bin) for (let y = o.y - 3; y <= o.y + 3; y++) for (let x = o.x - 3; x <= o.x + 3; x++) if (inB(x, y)) binNear[idx(x, y)] = 1;
}
function placeObj(k, x, y, rot, opt) {
  const custom = k === 'custom', m = custom ? mCustomCoaster(x, y, rot, opt.nodes) : DEFS[k].model(), d = custom ? m.def : DEFS[k], [w, h] = dims(d, rot);
  const ob = { id: uid++, k, def: d, x, y, w, h, rot, model: m, group: m.group, removed: false, nat: !!(opt && opt.nat) };
  m.group.position.set(x + w / 2 - HALF, 0, y + h / 2 - HALF); m.group.rotation.y = custom ? 0 : -rot * Math.PI / 2;
  m.group.userData.obj = ob; scene.add(m.group);
  const isDeco = d.cat === 'deco';
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const t = idx(x + i, y + j); tType[t] = isDeco ? 3 : 2; tObj[t] = ob; }
  if (isDeco) { decos.push(ob); if (m.update) animDecos.push(ob); applyBeauty(ob, 1); if (d.bin) rebuildBins(); }
  else {
    Object.assign(ob, { queue: [], riders: [], state: 'idle', runT: 0, animT: 0, spin: 0, loadT: 0, price: d.price, open: true, broken: false, wear: 0, count: 0, income: 0, svcT: 0, distV: 0, dist: null, access: [], fixer: null, resting: [], res: 0, miniDay: -1 });
    m.group.updateMatrixWorld(true);
    ob.top = new T.Box3().setFromObject(m.group).max.y;
    builds.push(ob); dressRide(ob);
    if (custom) { ob.nodes = opt.nodes; ob.extra = []; for (const t of m.tiles) if (tType[t] === 0) { tType[t] = 2; tObj[t] = ob; ob.extra.push(t); } }
  }
  pathVersion++;
  return ob;
}
function nearestPath(x, z) {
  const cx = clamp(Math.floor(x + HALF), 0, N - 1), cy = clamp(Math.floor(z + HALF), 0, N - 1);
  for (let r = 0; r < N; r++) {
    let best = -1, bd = 1e9;
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== r || !inB(cx + dx, cy + dy)) continue;
      const i = idx(cx + dx, cy + dy);
      if (tType[i] === 1 && dx * dx + dy * dy < bd) { bd = dx * dx + dy * dy; best = i; }
    }
    if (best >= 0) return best;
  }
  return ENT;
}
function releaseGuest(g) {
  const riding = g.state === 'ride'; if (riding) colorsDirty = true;
  g.seat = null; g.target = null; g.state = 'decide'; g.wait = rnd(0.2, 0.9);
  const t = tType[g.acc] === 1 ? g.acc : nearestPath(g.x, g.z);
  g.tile = t; g.prev = -1;
  if (riding) { g.x = wX(tX(t)) + g.ox; g.z = wZ(tY(t)) + g.oz; }
}
function removeObj(ob) {
  ob.removed = true;
  for (let j = 0; j < ob.h; j++) for (let i = 0; i < ob.w; i++) { const t = idx(ob.x + i, ob.y + j); tType[t] = 0; tObj[t] = null; }
  if (ob.extra) for (const t of ob.extra) if (tObj[t] === ob) { tType[t] = 0; tObj[t] = null; }
  scene.remove(ob.group); ob.group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
  if (ob.def.cat === 'deco') {
    decos = decos.filter((o) => o !== ob); animDecos = animDecos.filter((o) => o !== ob); applyBeauty(ob, -1); if (ob.def.bin) rebuildBins();
  } else {
    for (const s of ob.resting.slice()) endBreak(s);
    if (pov && pov.b === ob) exitMode();
    for (const g of ob.queue.concat(ob.riders)) releaseGuest(g);
    ob.queue = []; ob.riders = [];
    builds = builds.filter((o) => o !== ob);
  }
  pathVersion++;
}

/* ----- path finding ----- */
function bfs(src) {
  const d = new Int16Array(N * N).fill(-1), q = new Int32Array(N * N); let h = 0, t = 0;
  for (const s of src) if (d[s] < 0) { d[s] = 0; q[t++] = s; }
  while (h < t) {
    const c = q[h++], cx = c % N, cy = (c / N) | 0, nd = d[c] + 1;
    for (let k = 0; k < 4; k++) {
      const nx = cx + DIRS[k][0], ny = cy + DIRS[k][1]; if (!inB(nx, ny)) continue;
      const n = idx(nx, ny); if (tType[n] === 1 && d[n] < 0) { d[n] = nd; q[t++] = n; }
    }
  }
  return d;
}
function refresh(b) {
  const acc = [];
  const add = (x, y) => { if (inB(x, y) && tType[idx(x, y)] === 1) acc.push(idx(x, y)); };
  for (let i = 0; i < b.w; i++) { add(b.x + i, b.y - 1); add(b.x + i, b.y + b.h); }
  for (let j = 0; j < b.h; j++) { add(b.x - 1, b.y + j); add(b.x + b.w, b.y + j); }
  b.access = acc; b.dist = acc.length ? bfs(acc) : null; b.distV = pathVersion;
}
function distOf(b) { if (b.distV !== pathVersion) refresh(b); return b.dist; }
function accessOf(b) { if (b.distV !== pathVersion) refresh(b); return b.access; }
let entD = null, entV = 0;
function entDist() { if (entV !== pathVersion) { entD = bfs([ENT]); entV = pathVersion; } return entD; }
const connected = (b) => { const a = accessOf(b); return a.length > 0 && entDist()[a[0]] >= 0; };
const _nb = [];
function pathNb(t) {
  _nb.length = 0; const x = tX(t), y = tY(t);
  for (let k = 0; k < 4; k++) { const nx = x + DIRS[k][0], ny = y + DIRS[k][1]; if (inB(nx, ny) && tType[idx(nx, ny)] === 1) _nb.push(idx(nx, ny)); }
  return _nb;
}
function randNeighbor(t, prev) {
  const nb = pathNb(t); if (!nb.length) return -1; if (nb.length === 1) return nb[0];
  let n; do { n = pick(nb); } while (n === prev); return n;
}
function downhill(d, t) {
  const nb = pathNb(t), want = d[t] - 1; let c = 0, res = -1;
  for (const n of nb) if (d[n] === want && Math.random() < 1 / ++c) res = n;
  return res;
}
const _par = new Int32Array(N * N), _bq = new Int32Array(N * N);
function bfsRoute(start, goalFn) {
  if (goalFn(start)) return [];
  _par.fill(-2); _par[start] = -1; let h = 0, t = 0; _bq[t++] = start;
  while (h < t) {
    const c = _bq[h++], cx = c % N, cy = (c / N) | 0;
    for (let k = 0; k < 4; k++) {
      const nx = cx + DIRS[k][0], ny = cy + DIRS[k][1]; if (!inB(nx, ny)) continue;
      const n = idx(nx, ny); if (tType[n] !== 1 || _par[n] !== -2) continue;
      _par[n] = c;
      if (goalFn(n)) { const r = []; let p = n; while (p !== start) { r.push(p); p = _par[p]; } return r.reverse(); }
      _bq[t++] = n;
    }
  }
  return null;
}
function moveTo(w, dt) {
  const dx = w.wx - w.x, dz = w.wz - w.z, d = Math.hypot(dx, dz), st = w.sp * dt;
  if (d <= st) { w.x = w.wx; w.z = w.wz; w.moving = d > 1e-4; return true; }
  w.x += dx / d * st; w.z += dz / d * st; w.rot = Math.atan2(dx, dz); w.moving = true; return false;
}
const setWP = (w, tile) => { w.wx = wX(tX(tile)) + w.ox; w.wz = wZ(tY(tile)) + w.oz; };

