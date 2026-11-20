/* ================= attractions and booths ================= */
function serve(b, g) {
  const d = b.def;
  if (g.cash < b.price) { think(g, 'money'); g.state = 'decide'; g.wait = 0.3; return; }
  g.cash -= b.price; if (b.price) earn(b.price, 'shop'); if (d.goods) spend(d.goods, 'goods');
  b.income += b.price - d.goods; b.count++;
  const val = clamp(1.4 - 0.5 * b.price / d.fair, 0.3, 1.3);
  if (d.sells === 'food') { g.hunger = Math.max(0, g.hunger - 75); g.thirst += 10; g.happy += 4 * val; if (Math.random() < 0.6) g.trash = rint(3, 9); }
  else if (d.sells === 'drink') { g.thirst = Math.max(0, g.thirst - 80); g.wc += 16; g.happy += 3 * val; if (Math.random() < 0.35) g.trash = rint(3, 9); }
  else if (d.sells === 'treat') { g.hunger = Math.max(0, g.hunger - 22); g.happy += 7 * val; if (Math.random() < 0.25) g.trash = rint(3, 9); }
  else if (d.sells === 'balloon') { g.balloon = pick(SHIRT); g.happy += 9 * val; }
  else if (d.sells === 'game') g.happy += 8 * val;
  else { g.wc = 0; g.happy += 2; }
  g.state = 'decide'; g.wait = rnd(0.6, 1.6); g.tile = g.acc;
}
function levelUp(b) {
  const l = lvlOf(b);
  toast(b.def.name + ' erreicht Stufe ' + l + (l === 2 ? '. Du kannst jetzt selbst hinein.' : '. Der Nervenkitzel steigt.'), 'gold', b); sfx('goal'); uiDirty = true;
  if (sel && sel.obj === b) renderPanel();
}
function startRide(b) {
  const d = b.def, l0 = lvlOf(b); let seat = 0;
  while (b.riders.length < d.cap && b.queue.length && b.queue[0].qt > 0.6) {
    const g = b.queue.shift();
    if (g.cash < b.price) { think(g, 'money'); g.state = 'decide'; g.wait = 0.3; g.tile = g.acc; continue; }
    g.cash -= b.price; earn(b.price, 'ride'); b.income += b.price; b.count++;
    g.state = 'ride'; g.seat = b.model.seats[seat++] || null; b.riders.push(g);
  }
  b.loadT = 0;
  if (lvlOf(b) > l0) levelUp(b);
  if (!b.riders.length) return;
  b.state = 'run'; b.runT = 0; colorsDirty = true;
  if (b.model.start) b.model.start();
}
function breakDown(b) {
  b.broken = true; b.fixer = null;
  for (const g of b.queue) { g.happy -= 3; think(g, 'angry'); g.state = 'decide'; g.wait = rnd(0.2, 1); g.tile = g.acc; }
  b.queue = [];
  toast(b.def.name + ' ist defekt.' + (staffN('mech') ? ' Ein Mechaniker ist unterwegs.' : ' Kein Mechaniker im Dienst.'), 'bad', b);
  sfx('error'); uiDirty = true;
}
function repair(b) { b.broken = false; b.wear = 0; b.fixer = null; toast(b.def.name + ' läuft wieder.', 'good', b); uiDirty = true; }
function endRide(b) {
  const d = b.def, fair = fairB(b), ex = excOf(b);
  for (const g of b.riders) {
    const times = g.rides[b.k] || 0;
    let gain = clamp(ex * 0.16 / (1 + times * 0.8) * (1.35 - 0.5 * b.price / fair), -4, 22);
    g.nausea += d.nau * rnd(0.5, 1.1) * (1.2 - g.brave * 0.6);
    if (g.nausea > 75) { gain -= 6; think(g, 'sick'); if (Math.random() < 0.35) dropLitter(g.acc); g.nausea = 40; }
    else if (Math.random() < 0.5) think(g, gain > 8 ? 'great' : 'happy');
    g.happy = clamp(g.happy + gain, 0, 100); g.rides[b.k] = times + 1; g.nRides++;
    releaseGuest(g);
  }
  b.riders = []; b.state = 'idle'; b.loadT = 0; b.wear++;
  if (Math.random() < (0.004 + b.wear * 0.0008) * (staffN('mech') ? 0.5 : 1)) breakDown(b);
}
function stepBuild(b, dt) {
  const d = b.def, q = b.queue;
  if (d.cat === 'fac') return;
  for (let i = 0; i < q.length; i++) q[i].qi = i;
  if (d.cat === 'shop') {
    b.svcT -= dt;
    if (b.svcT <= 0 && q.length && q[0].qt > 0.5) { serve(b, q.shift()); b.svcT = d.svc; }
    return;
  }
  const want = b.state === 'run' && (b.model.done || b.runT < d.dur - 1.6) ? 1 : 0;
  b.spin += clamp(want - b.spin, -dt * 0.7, dt * 0.7);
  if (b.state === 'run') {
    b.runT += dt; b.animT += dt * b.spin;
    b.model.update(dt, b);
    if (b.model.done ? b.model.done() : b.runT >= d.dur) endRide(b);
    return;
  }
  if (!b.broken && b.open && q.length) {
    b.loadT += dt;
    let ready = 0; for (const g of q) if (g.qt > 0.6) ready++;
    if (ready >= d.cap || (ready > 0 && b.loadT > 4.5)) startRide(b);
  } else b.loadT = 0;
  b.model.update(dt, b);
}

