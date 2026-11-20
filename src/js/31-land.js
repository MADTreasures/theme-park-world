/* ================= land and plants ================= */
// The island is divided into plots of 10 × 10 tiles. A new park owns the four plots at the gate; more can be bought, one
// neighbouring plot at a time, and each costs more than the last. Nothing can be built on land that is not owned.
// Trees, bushes and flowers stand in the way of building. The player marks them and a gardener removes them for a fee.
// Wild plants are not separate objects in the scene: all plants of a plot are merged into one mesh.
const PLOT = 10, PN = N / PLOT, START_PLOTS = [2 + 4 * PN, 3 + 4 * PN, 2 + 5 * PN, 3 + 5 * PN];
const owned = new Uint8Array(N * N), plotOwned = new Uint8Array(PN * PN), plotMesh = new Array(PN * PN).fill(null), plotDirty = new Uint8Array(PN * PN);
let landDirty = true, cuts = [], landHintAt = -99, gardHintAt = -99;
const plotOf = (x, y) => ((y / PLOT) | 0) * PN + ((x / PLOT) | 0);
const ownedAt = (x, y) => inB(x, y) && owned[idx(x, y)] === 1;
const plotsOwned = () => plotOwned.reduce((n, v) => n + v, 0);
function landApply() {
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) owned[idx(x, y)] = plotOwned[plotOf(x, y)];
  S.land = Array.from(plotOwned).join(''); landDirty = true; pathVersion++;
}
function landSet(list) { plotOwned.fill(0); for (const p of list) plotOwned[p] = 1; landApply(); }
// what the next plot costs: 900 for the first, rising a little faster with every plot already bought
function landPrice() { const n = Math.max(0, plotsOwned() - START_PLOTS.length); return Math.round((900 + 420 * n + 20 * n * n) / 50) * 50; }
function plotForSale(p) {
  if (p < 0 || plotOwned[p]) return false; const px = p % PN, py = (p / PN) | 0;
  return !!((px > 0 && plotOwned[p - 1]) || (px < PN - 1 && plotOwned[p + 1]) || (py > 0 && plotOwned[p - PN]) || (py < PN - 1 && plotOwned[p + PN]));
}
function buyPlot(p) {
  if (!plotForSale(p)) return false; const c = landPrice();
  if (S.money < c) { sfx('error'); toast('Dafür reicht das Geld nicht. Dieses Stück Land kostet ' + eur(c) + '.', 'bad'); return false; }
  spend(c, 'build'); plotOwned[p] = 1; landApply(); sfx('goal'); uiDirty = true;
  toast('Das Land gehört jetzt dir: 10 × 10 Felder mehr Platz. Wo du bauen willst, lässt du Bäume und Büsche vom Gärtner roden.', 'gold');
  return true;
}
function landHint() { if (S.time - landHintAt < 6) return; landHintAt = S.time; sfx('error'); toast('Dieses Land gehört dir noch nicht. Über «Land» kannst du es kaufen.', 'bad'); }

/* ----- plants ----- */
function addBush(b, x, z, s = 1) {
  b.sph(0.22 * s, pick(GREENS), x, 0.15 * s, z, { seg: 8, seg2: 5, sy: 0.8, ry: rnd(TAU) });
  b.sph(0.16 * s, pick(GREENS), x + 0.16 * s, 0.13 * s, z + 0.08 * s, { seg: 7, seg2: 4, sy: 0.8 });
  b.sph(0.14 * s, pick(GREENS), x - 0.13 * s, 0.11 * s, z - 0.1 * s, { seg: 7, seg2: 4, sy: 0.8 });
  if (Math.random() < 0.5) { const c = pick([K.red, K.pink, K.yel, 0xffffff]); for (let i = 0; i < 5; i++) b.sph(0.03, c, x + rnd(-0.2, 0.2), 0.25 * s + rnd(-0.04, 0.02), z + rnd(-0.15, 0.15), { seg: 4, seg2: 2 }); }
}
const PLANT_ADD = { tree: addTree, pine: addPine, palm: addPalm, flowers: addFlowers, bush: addBush }, PLANT_TOP = { tree: 1.6, pine: 1.8, palm: 2.0, flowers: 0.55, bush: 0.65 };
// runs fn with a repeatable stream of random numbers, so that a plant looks the same every time its plot is rebuilt
function seeded(seed, fn) {
  const real = Math.random; let a = seed >>> 0;
  Math.random = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  try { fn(); } finally { Math.random = real; }
}
function rebuildPlots() {
  for (let p = 0; p < PN * PN; p++) {
    if (!plotDirty[p]) continue; plotDirty[p] = 0;
    if (plotMesh[p]) { scene.remove(plotMesh[p]); plotMesh[p].traverse((o) => { if (o.geometry) o.geometry.dispose(); }); plotMesh[p] = null; }
    const b = new Builder(); let n = 0;
    for (const o of decos) if (o.nat && o.plot === p) { seeded(o.seed, () => PLANT_ADD[o.k](b, wX(o.x), wZ(o.y), 1)); n++; }
    if (n) { plotMesh[p] = b.mesh(); scene.add(plotMesh[p]); }
  }
}
// scatters wild plants over one plot; the middle stays free for the sale sign
function growWild(p, count) {
  const px = (p % PN) * PLOT, py = ((p / PN) | 0) * PLOT;
  for (let i = 0; i < count; i++) {
    const x = px + rint(0, PLOT - 1), y = py + rint(0, PLOT - 1);
    if (tType[idx(x, y)] !== 0 || (Math.abs(x - px - 4.5) < 1 && Math.abs(y - py - 4.5) < 1) || (Math.abs(x - HALF) < 8 && y > N - 14)) continue;
    placeObj(pick(['tree', 'tree', 'tree', 'pine', 'pine', 'pine', 'palm', 'bush', 'bush', 'bush', 'bush', 'flowers']), x, y, 0, { nat: true });
  }
}
/* ----- marking plants for the gardener ----- */
function markCut(ob, then) {
  if (!ob || !ob.def.plant || ob.removed) return false;
  if (!ownedAt(ob.x, ob.y)) { landHint(); return false; }
  if (ob.cut) { if (then) ob.then = then; return true; }
  const fee = ob.def.cut;
  if (S.money < fee) { sfx('error'); toast('Dafür reicht das Geld nicht. Roden kostet hier ' + eur(fee) + '.', 'bad'); return false; }
  spend(fee, 'build'); ob.cut = true; ob.fee = fee; ob.then = then || null; ob.cutter = null; cuts.push(ob); uiDirty = true;
  if (!staffN('gard') && S.time - gardHintAt > 20) { gardHintAt = S.time; toast('Zum Roden markiert. Stelle einen Gärtner ein (Personal), damit die Pflanzen entfernt werden.', 'bad'); }
  return true;
}
function unmarkCut(ob) {
  if (!ob.cut) return;
  ob.cut = false; ob.then = null; spend(-ob.fee, 'build'); const i = cuts.indexOf(ob); if (i >= 0) cuts.splice(i, 1);
  if (ob.cutter && ob.cutter.cutT === ob) ob.cutter.cutT = null; ob.cutter = null; uiDirty = true;
}
// the gardener is done: the plant is gone, and a path that was waiting for the spot is laid
function finishCut(ob) {
  const t = idx(ob.x, ob.y), then = ob.then;
  if (sel && sel.obj === ob) select(null);
  removeObj(ob);
  if (then === 'path' && S.money >= 5 && setPath(t, true)) spend(5, 'build');
  uiDirty = true;
}
// marks every plant in a list; returns how many are now marked and what that cost
function markAll(list, then) { let n = 0, fee = 0; for (const o of list) { const was = o.cut; if (markCut(o, then)) { n++; if (!was) fee += o.fee; } } return [n, fee]; }
