/* ================= attractions and booths ================= */
function serve(b, g) {
  const d = b.def;
  if (g.cash < b.price) { think(g, 'money'); g.state = 'decide'; g.wait = 0.3; return; }
  g.cash -= b.price; if (b.price) earn(b.price, 'shop'); if (d.goods) spend(d.goods, 'goods');
  b.income += b.price - d.goods; b.count++;
  const val = clamp(1.4 - 0.5 * b.price / d.fair, 0.3, 1.3);
  if (d.dine) { g.hunger = 0; g.thirst = Math.max(0, g.thirst - 45); g.wc += 8; g.happy += 9 * val; }   // a proper meal at a table
  else if (d.sells === 'food') { g.hunger = Math.max(0, g.hunger - 75); g.thirst += 10; g.happy += 4 * val; if (Math.random() < 0.6) g.trash = rint(4, 11); }
  else if (d.sells === 'drink') { g.thirst = Math.max(0, g.thirst - 80); g.wc += 16; g.happy += 3 * val; if (Math.random() < 0.35) g.trash = rint(4, 11); }
  else if (d.sells === 'treat') { g.hunger = Math.max(0, g.hunger - 22); g.happy += 7 * val; if (Math.random() < 0.25) g.trash = rint(4, 11); }
  else if (d.sells === 'balloon') { g.balloon = pick(SHIRT); g.happy += 9 * val; }
  else if (d.sells === 'game') {   // with luck there is a soft toy to take home
    g.happy += 8 * val; const win = !!d.prize && Math.random() < d.prize;
    if (win) { g.prize = pick(PLUSH); g.happy += 6; think(g, 'great'); }
    if (b.model.play) b.model.play(win ? 1 : rnd(0.3, 0.92));
  }
  else if (d.sells === 'hat') { wearHat(g); g.happy += 9 * val; }
  else if (d.sells === 'umbrella') { g.umb = pick(UMB_COLS); g.happy += 6 * val; }
  else if (d.sells === 'parasol') { g.sun = pick(SUN_COLS); g.happy += 7 * val; }
  else if (d.sells === 'torch') { g.torch = pick(TORCH_COLS); g.happy += 8 * val; }
  else if (d.sells === 'costume') { wearCostume(g); g.happy += 11 * val; }
  else { g.wc = 0; g.happy += 2; }
  if (d.sells !== 'wc') personVoice(g, 'nom');
  if (g.vip && g.log && d.sells !== 'wc') g.log.buys.push(d.name);
  if (d.dine) {   // sits down at a free place and eats; without one the meal is taken away
    const seat = b.model.seats.find((s) => !b.riders.some((r) => r.seat === s));
    if (seat) { g.state = 'ride'; g.seat = seat; g.dineT = d.dine * rnd(0.8, 1.25); g.tile = g.acc; b.riders.push(g); colorsDirty = true; return; }
  }
  g.state = 'decide'; g.wait = rnd(0.6, 1.6); g.tile = g.acc;
}
function levelUp(b) {
  const l = lvlOf(b);
  const show = b.def.grp === 'show';
  if (!b.def.calm) toast(b.def.name + ' erreicht Stufe ' + l + (l === 2 ? (show ? '. Du kannst jetzt selbst zuschauen.' : '. Du kannst jetzt selbst hinein.') : show ? '. Die Vorstellung wird noch besser.' : '. Der Nervenkitzel steigt.'), 'gold', b);
  sfx('goal'); uiDirty = true;
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
  b.state = 'run'; b.runT = 0; colorsDirty = true; rideSound(b);
  if (b.model.start) b.model.start();
}
function breakDown(b) {
  b.broken = true; b.fixer = null;
  if (b.mtBy) { if (b.mtBy.mt === b) b.mtBy.mt = null; b.mtBy = null; }
  callMech(b);   // the nearest free mechanic sets off at once
  // With a mechanic on the way, the queue waits (as long as each guest's patience lasts) and rides as soon as it is fixed.
  // Without one, everybody gives up at once.
  if (!b.fixer) { for (const g of b.queue) { g.happy -= 3; think(g, 'angry'); g.state = 'decide'; g.wait = rnd(0.2, 1); g.tile = g.acc; } b.queue = []; }
  else for (const g of b.queue) g.happy -= 1;
  toast(b.def.name + ' ist defekt.' + (b.fixer ? ' ' + b.fixer.name + ' (Mechaniker) ist unterwegs, die Wartenden bleiben in der Schlange.' : staffN('mech') ? ' Gerade ist kein Mechaniker frei.' : ' Kein Mechaniker im Dienst.'), 'bad', b);
  sfx('error'); sfxAt('clank', b.group.position.x, b.group.position.z, 1.2); uiDirty = true;
}
function repair(b) { b.broken = false; b.wear = 0; b.fixer = null; toast(b.def.name + ' läuft wieder.', 'good', b); uiDirty = true; }
function endRide(b) {
  const d = b.def, fair = fairB(b), ex = excOf(b);
  for (const g of b.riders) {
    const times = g.rides[b.k] || 0;
    let gain = clamp(ex * 0.16 / (1 + times * 0.8) * (1.35 - 0.5 * b.price / fair), -4, 22);
    g.nausea += d.nau * rnd(0.5, 1.1) * (1.2 - g.brave * 0.6);
    if (d.calm) { g.nausea = 0; gain = 5; }   // a rest in the garden settles the stomach
    if (g.nausea > 75) { gain -= 6; think(g, 'sick'); if (Math.random() < 0.35) dropLitter(g.acc); g.nausea = 40; }
    else if (Math.random() < 0.5) think(g, gain > 8 ? 'great' : 'happy');
    g.happy = clamp(g.happy + gain, 0, 100); g.rides[b.k] = times + 1; g.nRides++;
    if (g.vip && g.log) g.log.rides.push([d.name, gain]);
    releaseGuest(g);
  }
  if (d.grp === 'show' && b.riders.length) showApplause(b);
  b.riders = []; b.state = 'idle'; b.loadT = 0; b.wear++;
  if (!d.calm && Math.random() < (0.004 + b.wear * 0.0008) * (staffN('mech') ? 0.5 : 1)) breakDown(b);
}
function stepBuild(b, dt) {
  const d = b.def, q = b.queue;
  if (d.cat === 'fac' || b.site) return;
  for (let i = 0; i < q.length; i++) q[i].qi = i;
  if (d.cat === 'shop') {
    b.svcT -= dt;
    if (b.svcT <= 0 && q.length && q[0].qt > 0.5) { serve(b, q.shift()); b.svcT = d.svc; }
    if (b.riders.length) for (let i = b.riders.length - 1; i >= 0; i--) { const g = b.riders[i]; g.dineT -= dt; if (g.dineT <= 0) { b.riders.splice(i, 1); g.happy = Math.min(100, g.happy + 2); releaseGuest(g); } }   // diners finish their meal
    if (b.model.update) b.model.update(dt, b);
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

