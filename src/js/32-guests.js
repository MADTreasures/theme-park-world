/* ================= guests ================= */
const SKIN = [0xffdcb3, 0xf1c39a, 0xd9a06e, 0xa8703f, 0x7a4a2a];
const SHIRT = [0xff4f64, 0x3d8bfd, 0xffd23f, 0x3ddbb4, 0xff8fc7, 0xffffff, 0x8c5cff, 0xf08a24, 0x55c26a, 0x33c9e8];
const PANTS = [0x2a2350, 0x33405a, 0x2b2b2b, 0x1f3f7a, 0x4f6fb0, 0xf2f2f2, 0x8a8f9c, 0x3f6f4a, 0xb9243a, 0x6b4f8a, 0x4a3a2a];   // never close to a skin tone
const NAMES = ['Mia', 'Noah', 'Lina', 'Leon', 'Emma', 'Luca', 'Lea', 'Elias', 'Nina', 'Jonas', 'Sofia', 'Finn', 'Anna', 'Ben', 'Lara', 'Tim', 'Jana', 'Paul', 'Mara', 'Nico', 'Elif', 'Milan', 'Zoe', 'Samir', 'Ida', 'Matteo', 'Yara', 'Jan', 'Livia', 'Tom'];
const THOUGHT = { happy: 'Das war schön!', great: 'Nochmal, nochmal!', sick: 'Mir ist ganz flau …', queue: 'Die Schlange ist mir zu lang.', food: 'Ich habe Hunger.', drink: 'Ich habe Durst.', wc: 'Wo ist hier ein WC?', money: 'Das ist mir zu teuer.', litter: 'Hier liegt überall Abfall.', bye: 'Schön war es. Bis bald!', angry: 'Hier komme ich nicht wieder her.', thief: 'Hilfe, mein Geld ist weg!', fan: 'Schau mal, wer da filmt!' };
function think(g, kind) { g.think = 2.8; g.tk = kind; personVoice(g, kind); if (g.vip && g.log) g.log.n[kind] = (g.log.n[kind] || 0) + 1; }   // an influencer remembers what happened
function gripe(g, kind) {
  if (g.t - g.gripeT < 12) return;
  g.gripeT = g.t; g.happy -= 2.5; think(g, kind); complaints[kind]++;
}
function willing() {
  let w = 3; const seen = new Set();
  for (const b of builds) if (b.def.cat === 'ride' && !b.site) { w += 0.25; if (!seen.has(b.k)) { seen.add(b.k); w += b.def.exc * 0.11; } }
  // a bigger park is worth more to its guests: every plot bought raises what they will pay, and the ceiling with it
  const extra = plotsOwned() - START_PLOTS.length;
  return Math.min(60 + extra * 0.8, w + extra * 0.4);
}
function guestCap() {
  let c = 8; for (const b of builds) if (!b.site) c += b.def.cat === 'ride' ? b.def.cap * 2 + b.def.exc * 0.1 : b.def.cat === 'shop' ? 1.5 : 0;
  // what the attractions draw, with advertising on top; but never more than the park's land can hold
  return Math.min(landCap(), c * (0.6 + S.rating / 250) * (1 + adBoost()));
}
const HAIR = [0x2b1b12, 0x3d2616, 0x5a3a1e, 0x7b4f28, 0xb8893f, 0xe0c57a, 0xa5441f, 0x9a9a9a, 0x1c1c1c], HAIR_FUN = [0xff7ac0, 0x4aa8ff, 0x55d6c2, 0xb07cff, 0xff8a3d, 0xf2f2f7];
const EYES = [0x3f8fe0, 0x35a86a, 0x7a5230, 0x5b3a1e, 0x4fb3c4, 0x8a6fd1, 0x555a66, 0xd06aa8], SHOES = [0xffffff, 0xff4f64, 0x3d8bfd, 0xffd23f, 0x2b2b33, 0x3ddbb4, 0xff8fc7, 0xf08a24];
const HAIR_PICK = [0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 5, 6, 6, 7, 7, 8, 8, 8];   // short, long, ponytail, cap, curls, sun hat, bob, bun, quiff
// What a person looks like: size, hair, face and a sporty outfit (jacket with trim, trousers, shorts or a skirt, sneakers).
function dress(f, kid) {
  f.kid = kid; f.sc = kid ? rnd(0.62, 0.8) : rnd(0.95, 1.1); f.hk = kid ? 1.13 : 1;
  f.hair = !kid && Math.random() < 0.04 ? -1 : pick(HAIR_PICK);
  f.browCol = Math.random() < 0.1 ? pick(HAIR_FUN) : pick(HAIR); f.hairCol = f.hair === 3 ? pick(SHIRT) : f.hair === 5 ? pick([0xe8cf8a, 0xfff6dc, 0xd9b46a, 0xff8fc7]) : f.browCol;
  f.pack = f.hair !== 1 && Math.random() < 0.22 ? pick(SHIRT) : 0; f.shades = !kid && Math.random() < 0.1 ? 1 : 0;   // long hair and a backpack would get in each other's way
  f.bottom = pick([0, 0, 0, 1, 1, 2]); f.top = pick([0, 0, 0, 0, 1, 2]);
  f.shirt = pick(SHIRT); f.skin = pick(SKIN); f.pants = pick(PANTS);
  f.trim = pick([0xffffff, 0xffffff, 0xfff6dc, f.pants, pick(SHIRT)]); f.shoe = pick(SHOES); f.eye = pick(EYES);
  f.legs = f.bottom && Math.random() < 0.3 ? pick([0x2a2a33, 0x3a3f58, 0x4a2f3a]) : f.skin;   // bare legs or leggings under shorts and skirts
}
function spawnGuest(inside) {
  const W = willing();
  const g = { id: uid++, name: pick(NAMES), x: 0, z: 0, rot: Math.PI, tile: ENT, prev: -1, wx: 0, wz: 0, ox: rnd(-0.3, 0.3), oz: rnd(-0.3, 0.3), sp: rnd(1.0, 1.45), sc: rnd(0.84, 1.1), ph: rnd(TAU),
    state: 'arrive', wait: 0, target: null, steps: 0, hunger: rnd(0, 35), thirst: rnd(0, 35), wc: rnd(0, 30), nausea: 0,
    happy: clamp(64 - 14 * (S.ticket / W - 0.6) + rnd(-8, 8), 20, 95), cash: rnd(24, 62) * (0.8 + S.rating / 180), gen: rnd(0.97, 1.6), brave: Math.random(),
    hr: rnd(0.16, 0.3), tr: rnd(0.2, 0.36), wr: rnd(0.08, 0.16), t: 0, stay: rnd(200, 380), patience: rnd(45, 90), qt: 0, qi: 0, acc: ENT, qdx: 0, qdz: 0,
    seat: null, rides: {}, nRides: 0, trash: 0, balloon: 0, think: 0, tk: '', gripeT: -99, moving: false, gone: false,
    shirt: pick(SHIRT), skin: pick(SKIN), pants: pick(PANTS) };
  if (inside) {
    const tiles = []; for (let i = 0; i < N * N; i++) if (tType[i] === 1) tiles.push(i);
    g.tile = pick(tiles); g.x = wX(tX(g.tile)) + g.ox; g.z = wZ(tY(g.tile)) + g.oz; g.state = 'decide'; g.wait = rnd(0, 2); g.t = rnd(0, 80);
  } else {
    g.x = wX(HALF) + rnd(-0.6, 0.6); g.z = HALF + 13.6; setWP(g, ENT);
  }
  // whom the running campaigns reach: the newspaper families, the internet the daring, television those with fuller purses
  dress(g, Math.random() < (adOn('news') ? 0.4 : 0.24)); g.rr = g.rot; g.chatT = 0; g.helloT = -99;
  if (adOn('web')) g.brave = Math.max(g.brave, Math.random()); if (adOn('tv')) g.cash *= 1.25;
  guests.push(g); colorsDirty = true; return g;
}
function spawnTick(dt) {
  const cap = guestCap(), pf = clamp(1.6 - S.ticket / willing(), 0, 1.15);
  spawnAcc += cap * (0.004 + 0.012 * S.rating / 100) * clamp(1 - guests.length / cap, 0, 1) * pf * wxFactor() * dt;
  while (spawnAcc >= 1) { spawnAcc -= 1; if (guests.length < MAXG) spawnGuest(false); }
}
function dropLitter(t) { if (tType[t] !== 1 || litter[t] >= 3) return; litter[t]++; litterTotal++; litterDirty = true; }
function rescue(g) { const t = nearestPath(g.x, g.z); g.prev = -1; g.tile = t; setWP(g, t); g.target = null; g.state = 'wander'; g.steps = 1; }
function nearestShop(g, here, sells) {
  let best = null, bd = 1e9, exp = false;
  for (const b of builds) {
    const d = b.def; if (d.sells !== sells || !b.open) continue;
    const df = distOf(b); if (!df || df[here] < 0) continue;
    if (b.price > g.cash) continue;
    if (b.price > d.fair * g.gen + 0.01) { exp = true; continue; }
    // whoever has money to spare likes to sit down at a restaurant, even if it is a little further
    const sc = df[here] + b.queue.length * 2 - (d.dine && g.cash > b.price * 2.5 ? 9 : 0); if (sc < bd) { bd = sc; best = b; }
  }
  if (!best && exp) gripe(g, 'money');
  return best;
}
// the nearest quiet garden that can be reached
function nearestCalm(g, here) {
  let best = null, bd = 1e9;
  for (const b of builds) { if (!b.def.calm || !b.open || b.site || b.price > g.cash) continue; const df = distOf(b); if (!df || df[here] < 0) continue; if (df[here] < bd) { bd = df[here]; best = b; } }
  return best;
}
function pickRide(g, here) {
  let tot = 0, exp = false, poor = false; const c = [];
  for (const b of builds) {
    const d = b.def; if (d.cat !== 'ride' || !b.open || b.broken || b.site) continue;
    const df = distOf(b); if (!df || df[here] < 0) continue;
    const fair = fairB(b);
    if (b.price > g.cash) { poor = true; continue; }
    if (b.price > fair * g.gen + 0.01) { exp = true; continue; }
    if (g.nausea > 45 && d.nau > 25) continue;
    let w = excOf(b) / (1 + (g.rides[b.k] || 0) * 1.2) / (1 + df[here] * 0.05) / (1 + b.queue.length / d.cap) * (1.25 - 0.3 * b.price / fair);
    if (d.exc > 45 + g.brave * 65) w *= 0.12;
    // children love their own rides and stay away from the wildest ones; grown-ups mostly leave the children's rides to them
    if (g.kid) w *= d.grp === 'kid' ? 2.2 : d.grp === 'adr' ? 0.08 : d.grp === 'crazy' ? 0.5 : 1; else if (d.grp === 'kid') w *= 0.4;
    if (d.calm) w *= g.nausea > 30 ? 6 : 0.5;
    c.push(b, w); tot += w;
  }
  if (!c.length) { if (exp) gripe(g, 'money'); else if (poor) g.stay = 0; return null; }
  let r = Math.random() * tot;
  for (let i = 0; i < c.length; i += 2) { r -= c[i + 1]; if (r <= 0) return c[i]; }
  return c[c.length - 2];
}
function decide(g) {
  if (tType[g.tile] !== 1) { rescue(g); return; }
  if (g.t > g.stay || g.cash < 1.5 || g.happy < 10) {
    g.state = 'leave'; g.target = null;
    if (Math.random() < 0.5) think(g, g.happy > 55 ? 'bye' : 'angry');
    advance(g); return;
  }
  const here = g.tile; let tg = null;
  if (g.wc > 60) { tg = nearestShop(g, here, 'wc'); if (!tg) gripe(g, 'wc'); }
  if (!tg && g.hunger > 58) { tg = nearestShop(g, here, 'food'); if (!tg) gripe(g, 'food'); }
  if (!tg && g.thirst > 58) { tg = nearestShop(g, here, 'drink'); if (!tg) gripe(g, 'drink'); }
  if (!tg && g.nausea > 50) tg = nearestCalm(g, here);
  if (!tg && WX.wet > 0.4 && !g.umb && g.cash > 6 && Math.random() < 0.7) tg = nearestShop(g, here, 'umbrella');   // it rains: first of all an umbrella
  if (!tg && WX.sunny && !g.sun && g.cash > 8 && Math.random() < 0.035) tg = nearestShop(g, here, 'parasol');   // in the sun, now and then someone wants shade
  if (!tg && Math.random() < 0.82) tg = pickRide(g, here);
  if (!tg && Math.random() < 0.35) { const w = ['treat', 'game']; if (!g.balloon) w.push('balloon'); if (!g.hat && !g.costume) w.push('hat'); if (!g.costume) w.push('costume'); if (WX.sunny && !g.sun) w.push('parasol', 'parasol'); tg = nearestShop(g, here, pick(w)); }
  if (tg) { g.target = tg; g.state = 'walk'; } else { g.target = null; g.state = 'wander'; g.steps = rint(3, 9); }
  advance(g);
}
function advance(g) {
  const t = g.tile;
  if (tType[t] !== 1) { rescue(g); return; }
  let next = -1;
  if (g.state === 'wander') {
    if (--g.steps < 0) { g.state = 'decide'; g.wait = rnd(0.2, 1.2); return; }
    next = randNeighbor(t, g.prev);
    if (next < 0) { g.state = 'decide'; g.wait = 1.5; return; }
  } else {
    let d;
    if (g.state === 'leave') d = entDist();
    else {
      const b = g.target;
      if (!b || b.removed || b.broken || !b.open) { g.state = 'decide'; g.wait = 0.2; return; }
      d = distOf(b);
    }
    if (!d || d[t] < 0) {
      if (g.state === 'leave') { g.state = 'exit'; g.wx = wX(HALF) + g.ox; g.wz = HALF + 13.6; return; }
      g.state = 'decide'; g.wait = 0.3; return;
    }
    if (d[t] === 0) { arrive(g); return; }
    next = downhill(d, t);
    if (next < 0) { g.state = 'decide'; g.wait = 0.3; return; }
  }
  g.prev = t; g.tile = next; setWP(g, next);
}
function onTile(g) {
  const t = g.tile;
  if (litter[t]) { g.happy -= litter[t]; if (Math.random() < 0.1) { think(g, 'litter'); complaints.litter++; } }
  if (beauty[t] > 0) g.happy += Math.min(beauty[t], 5) * 0.1;
  // litter in hand goes into the first bin that is passed; without one it lands on the path after a while
  if (g.trash > 0) { if (binNear[t]) g.trash = 0; else if (--g.trash === 0) dropLitter(t); }
  advance(g);
}
function arrive(g) {
  if (g.state === 'leave') { g.state = 'exit'; g.wx = wX(HALF) + g.ox; g.wz = HALF + 13.6; return; }
  const b = g.target, t = g.tile; let dx = 0, dz = 0;
  for (let k = 0; k < 4; k++) { const nx = tX(t) + DIRS[k][0], ny = tY(t) + DIRS[k][1]; if (inB(nx, ny) && tObj[idx(nx, ny)] === b) { dx = DIRS[k][0]; dz = DIRS[k][1]; break; } }
  g.acc = t; g.qdx = dx; g.qdz = dz; g.qt = 0;
  if (b.def.cat === 'ride') {
    if (b.queue.length >= b.def.cap * 2 + 8) { g.happy -= 2; think(g, 'queue'); complaints.queue++; g.rides[b.k] = (g.rides[b.k] || 0) + 0.5; g.state = 'decide'; g.wait = 0.4; return; }
    b.queue.push(g); g.qi = b.queue.length - 1; g.state = 'queue';
  } else { b.queue.push(g); g.qi = b.queue.length - 1; g.state = 'buy'; }
}
function quitQueue(g) {
  const b = g.target, i = b.queue.indexOf(g); if (i >= 0) b.queue.splice(i, 1);
  g.happy -= 7; think(g, 'queue'); complaints.queue++; g.rides[b.k] = (g.rides[b.k] || 0) + 0.5;
  g.state = 'decide'; g.wait = 0.3; g.tile = g.acc;
}
function stepGuest(g, dt) {
  g.t += dt; g.hunger += g.hr * dt; g.thirst += g.tr * dt * (g.sun && WX.sunny ? 0.7 : 1); g.wc += g.wr * dt;   // in the shade of a parasol thirst comes more slowly
  if (g.nausea > 0) g.nausea = Math.max(0, g.nausea - dt * 1.2);
  if (g.think > 0) g.think -= dt;
  let dm = 0; if (g.hunger > 85) dm -= 0.3; if (g.thirst > 85) dm -= 0.35; if (g.wc > 88) dm -= 0.5;
  g.happy = clamp(g.happy + dm * dt, 0, 100);
  g.moving = false;
  if (g.chatT > 0) { g.chatT -= dt; if (g.state === 'walk' || g.state === 'wander' || g.state === 'decide' || g.state === 'leave') return; }
  switch (g.state) {
    case 'arrive':
      if (moveTo(g, dt)) { if (!g.vip) earn(S.ticket, 'tick'); S.visitors++; g.tile = ENT; g.state = 'decide'; g.wait = 0; }   // an invited guest comes in free
      break;
    case 'decide': g.wait -= dt; if (g.wait <= 0) decide(g); break;
    case 'walk': case 'wander': case 'leave': if (moveTo(g, dt)) onTile(g); break;
    case 'queue': case 'buy': {
      const b = g.target;
      if (!b || b.removed) { g.state = 'decide'; g.wait = 0.2; break; }
      const k = Math.min(g.qi, 11), row = (k / 3) | 0, col = k % 3 - 1, f = 0.36 - row * 0.2;
      g.wx = wX(tX(g.acc)) + g.qdx * f - g.qdz * col * 0.24; g.wz = wZ(tY(g.acc)) + g.qdz * f + g.qdx * col * 0.24;
      if (moveTo(g, dt)) g.rot = Math.atan2(g.qdx, g.qdz);
      g.qt += dt; if (g.qt > g.patience) quitQueue(g);
      break;
    }
    case 'exit':
      if (moveTo(g, dt)) { g.gone = true; anyGone = true; S.exitAvg = lerp(S.exitAvg, g.happy, 0.06); if (g.vip) vipDone(g); }
      break;
  }
}

