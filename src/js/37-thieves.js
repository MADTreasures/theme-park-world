/* ================= thieves ================= */
// From park level 5 on, pickpockets slip in with the crowd. They dress dark, wear a cap and shades and carry a sack.
// Security staff chase them; the player can also tap one to catch them.
let thieves = [], thiefSeen = false;
const THIEF_LEVEL = 4;
function spawnThief() {
  const f = { thief: true, x: wX(HALF) + rnd(-0.5, 0.5), z: HALF + 13.6, rot: Math.PI, rr: Math.PI, tile: ENT, prev: -1, wx: 0, wz: 0, ox: rnd(-0.3, 0.3), oz: rnd(-0.3, 0.3),
    sp: 1.25, ph: rnd(TAU), moving: false, state: 'in', loot: 0, steals: 0, t: 0, cd: rnd(5, 9), spotted: false, gone: false, brave: 0, balloon: 0 };
  dress(f, false);
  f.shirt = 0x2b2b33; f.pants = 0x1c1c22; f.hair = 3; f.hairCol = 0x111114; f.top = 2; f.bottom = 0; f.shades = 1; f.pack = 0x6b4a2a;
  setWP(f, ENT); thieves.push(f); colorsDirty = true;
  if (!thiefSeen) { thiefSeen = true; toast('Achtung, Taschendiebe! Sie tragen dunkle Kleidung, Mütze und einen Sack. Tippe sie an oder stelle Sicherheitspersonal ein.', 'bad'); }
}
function guardNear(f, r2) { for (const s of staff) if (s.type === 'sec' && s.state !== 'rest' && s.state !== 'quit') { const dx = s.x - f.x, dz = s.z - f.z; if (dx * dx + dz * dz < r2) return true; } return false; }
function catchThief(f, by) {
  if (f.gone) return;
  f.gone = true; colorsDirty = true;
  const reward = Math.round(f.loot + 10); earn(reward, 'bonus');
  for (const g of guests) { const dx = g.x - f.x, dz = g.z - f.z; if (dx * dx + dz * dz < 9) { g.happy = Math.min(100, g.happy + 3); } }
  toast('Dieb gefasst' + (by ? ' von ' + by.name : '') + '. ' + eur(reward) + ' sichergestellt.', 'good'); sfx('goal'); uiDirty = true;
}
function stepThief(f, dt) {
  f.t += dt; f.moving = false; if (f.cd > 0) f.cd -= dt;
  if (f.state === 'in') { if (moveTo(f, dt)) { f.tile = ENT; f.state = 'prowl'; } return; }
  if (f.state === 'out') {
    if (moveTo(f, dt)) { f.gone = true; colorsDirty = true; if (f.loot > 0) { toast('Ein Dieb ist mit ' + eur(f.loot) + ' Beute entkommen.', 'bad'); S.exitAvg = Math.max(0, S.exitAvg - 3); } }
    return;
  }
  if (!moveTo(f, dt)) return;
  if (tType[f.tile] !== 1) { f.tile = nearestPath(f.x, f.z); f.prev = -1; setWP(f, f.tile); return; }
  const watched = guardNear(f, 9);
  if (watched || f.spotted) f.state = 'flee';
  if (f.state === 'flee' || f.steals >= 4 || f.t > 150) {
    f.state = 'flee'; f.sp = 1.65;
    const d = entDist(), n = f.tile === ENT || d[f.tile] < 0 ? -1 : downhill(d, f.tile);
    if (n < 0) { f.state = 'out'; f.wx = wX(HALF) + f.ox; f.wz = HALF + 13.6; return; }
    f.prev = f.tile; f.tile = n; setWP(f, n); return;
  }
  if (f.cd <= 0) {
    let v = null, bd = 1.3;
    for (const g of guests) { if (g.state === 'ride' || g.cash < 3) continue; const dx = g.x - f.x, dz = g.z - f.z, d = dx * dx + dz * dz; if (d < bd) { bd = d; v = g; } }
    if (v) {
      const amt = Math.min(v.cash, rnd(4, 12)); v.cash -= amt; f.loot += amt; f.steals++; f.cd = rnd(5, 9);
      v.happy = Math.max(0, v.happy - 14); think(v, 'thief'); complaints.thief++;
    } else f.cd = 1;
  }
  const n = randNeighbor(f.tile, f.prev);
  if (n < 0) { f.state = 'flee'; return; }
  f.prev = f.tile; f.tile = n; setWP(f, n);
}
function thiefTick() {
  if (S.goal < THIEF_LEVEL || guests.length < 25) return;
  if (thieves.length >= 1 + Math.floor(guests.length / 120)) return;
  if (Math.random() < 0.0045 * (1 + guests.length / 120) * (staffN('sec') ? 0.55 : 1)) spawnThief();
}
