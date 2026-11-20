/* ================= ride models ================= */
function seatAt(parent, x, y, z, ry) { const s = new T.Object3D(); s.position.set(x, y, z); if (ry) s.rotation.y = ry; parent.add(s); return s; }
function bulbRing(b, n, r, y, col) { for (let i = 0; i < n; i++) { const a = i / n * TAU; b.sph(0.045, col || K.bulb, Math.cos(a) * r, y, Math.sin(a) * r, { glow: true, seg: 6, seg2: 4 }); } }

function mBouncy() {
  const g = new T.Group(), b = new Builder();
  b.box(1.84, 0.06, 1.84, K.stoneD, 0, 0.03, 0);
  b.box(1.6, 0.3, 1.5, K.yel, 0, 0.21, -0.08);
  b.box(0.2, 0.55, 1.5, K.red, -0.7, 0.6, -0.08); b.box(0.2, 0.55, 1.5, K.red, 0.7, 0.6, -0.08);
  b.box(1.6, 0.85, 0.2, K.blue, 0, 0.75, -0.73);
  for (let i = -2; i <= 2; i++) b.box(0.22, 0.16, 0.2, i % 2 ? K.yel : K.red, i * 0.3, 1.25, -0.73);
  for (const [x, z] of [[-0.7, -0.73], [0.7, -0.73], [-0.7, 0.6], [0.7, 0.6]]) {
    b.cyl(0.18, 0.2, 1.3, K.red, x, 0.71, z); b.cone(0.25, 0.42, K.yel, x, 1.57, z); b.sph(0.05, K.bulb, x, 1.8, z, { glow: true, seg: 6, seg2: 4 });
  }
  b.box(1.0, 0.1, 0.34, K.blue, 0, 0.13, 0.8, { rx: 0.35 });
  g.add(b.mesh());
  const seats = [];
  for (let i = 0; i < 6; i++) { const s = seatAt(g, -0.42 + (i % 3) * 0.42, 0.36, -0.4 + ((i / 3) | 0) * 0.5); s.userData.ph = rnd(TAU); s.userData.sp = rnd(5, 7.5); s.userData.pose = 'jump'; seats.push(s); }
  return { group: g, seats, update(dt, r) {
    if (r.spin < 0.01) return;
    for (const s of seats) { s.position.y = 0.36 + Math.abs(Math.sin(r.animT * s.userData.sp + s.userData.ph)) * 0.5 * r.spin; s.rotation.y += dt * 2 * r.spin; }
  } };
}

function horseInto(b, col) {
  b.box(0.15, 0.19, 0.46, col, 0, 0, 0); b.box(0.1, 0.26, 0.12, col, 0, 0.19, 0.2, { rx: 0.45 }); b.box(0.1, 0.12, 0.22, col, 0, 0.33, 0.31);
  for (const [x, z] of [[-0.05, 0.16], [0.05, 0.16], [-0.05, -0.16], [0.05, -0.16]]) b.box(0.045, 0.24, 0.05, col, x, -0.2, z);
  b.box(0.04, 0.16, 0.05, 0x4a3a2a, 0, 0.02, -0.26, { rx: -0.5 });
  b.box(0.17, 0.05, 0.2, K.red, 0, 0.11, -0.03);
  b.cyl(0.018, 0.018, 2.0, K.yel, 0, 0.62, 0.06, { seg: 6 });
}
function mCarousel() {
  const g = new T.Group(), b = new Builder();
  b.cyl(1.42, 1.46, 0.12, K.redD, 0, 0.06, 0, { seg: 24 });
  b.scyl(0.15, 0.17, 2.1, [K.yel, K.paper], 8, 0, 1.17, 0);
  g.add(b.mesh());
  const rot = new T.Group(); g.add(rot);
  const r = new Builder();
  r.cyl(1.32, 1.32, 0.05, K.paper, 0, 0.145, 0, { seg: 24 });
  r.cyl(1.5, 1.5, 0.16, K.yel, 0, 2.2, 0, { seg: 24 });
  r.scone(1.52, 0.75, [K.red, K.paper], 12, 0, 2.65, 0);
  r.sph(0.12, K.yel, 0, 3.08, 0);
  bulbRing(r, 16, 1.52, 2.2);
  rot.add(r.mesh());
  const seats = [], horses = [], cols = [0xffffff, 0x9b6a4a, 0xf2d6a0, 0x6a6c85];
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * TAU, hb = new Builder(); horseInto(hb, cols[i % 4]);
    const h = hb.mesh(); h.position.set(Math.cos(a) * 1.03, 0.58, Math.sin(a) * 1.03); h.rotation.y = -a;
    const st = seatAt(h, 0, 0.135, -0.02); st.userData.pose = 'straddle'; seats.push(st); rot.add(h); horses.push(h);
  }
  return { group: g, seats, update(dt, ride) {
    if (ride.spin < 0.01) return;
    rot.rotation.y -= dt * 1.15 * ride.spin;
    for (let i = 0; i < 8; i++) horses[i].position.y = 0.58 + Math.sin(ride.animT * 2.4 + i * 1.9) * 0.13;
  } };
}

function mCups() {
  const g = new T.Group(), b = new Builder();
  b.cyl(1.42, 1.46, 0.1, K.teal, 0, 0.05, 0, { seg: 24 });
  g.add(b.mesh());
  const rot = new T.Group(); g.add(rot);
  const r = new Builder();
  r.cyl(1.3, 1.3, 0.06, K.paper, 0, 0.13, 0, { seg: 24 });
  r.cyl(0.2, 0.27, 0.5, K.red, 0, 0.41, 0); r.sph(0.23, K.yel, 0, 0.78, 0); r.scone(0.55, 0.3, [K.blue, K.paper], 8, 0, 1.1, 0); r.sph(0.06, K.bulb, 0, 1.3, 0, { glow: true });
  rot.add(r.mesh());
  const cols = [K.red, K.blue, K.yel, K.vio, K.pink, K.mint], cups = [], seats = [];
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * TAU, cb = new Builder(), c = cols[i];
    cb.cyl(0.3, 0.22, 0.3, c, 0, 0.15, 0, { seg: 12 }); cb.cyl(0.26, 0.26, 0.02, K.inkD, 0, 0.305, 0, { seg: 12 });
    cb.tor(0.29, 0.025, K.paper, 0, 0.3, 0, { rx: Math.PI / 2, seg: 14 });
    cb.tor(0.1, 0.025, c, 0.36, 0.15, 0, { seg: 10 });
    cb.cyl(0.07, 0.07, 0.05, K.paper, 0, 0.34, 0, { seg: 8 });
    const cg = cb.mesh(); cg.position.set(Math.cos(a) * 0.86, 0.16, Math.sin(a) * 0.86); rot.add(cg); cups.push(cg);
    seats.push(seatAt(cg, 0, 0.22, 0.12, Math.PI), seatAt(cg, 0, 0.22, -0.12, 0));
  }
  return { group: g, seats, update(dt, ride) {
    if (ride.spin < 0.01) return;
    rot.rotation.y += dt * 0.85 * ride.spin;
    for (let i = 0; i < 6; i++) cups[i].rotation.y += dt * (i % 2 ? 2.8 : -2.8) * ride.spin;
  } };
}

// tall: the big version, whose crown climbs a mast twice as high
function mSwing(tall) {
  const g = new T.Group(), b = new Builder(), H = tall ? 6.6 : 3.2, C1 = tall ? K.red : K.blue, RISE = tall ? 3.9 : 1;
  b.cyl(1.25, 1.3, 0.1, tall ? K.ink : K.vio, 0, 0.05, 0, { seg: 20 });
  b.scyl(0.2, 0.3, H, [K.paper, C1], 8, 0, H / 2 + 0.1, 0);
  b.sph(0.22, K.yel, 0, H + 0.15, 0);
  if (tall) { b.cone(0.12, 0.5, K.yel, 0, H + 0.5, 0, { seg: 6 }); for (let i = 0; i < 4; i++) b.sph(0.05, K.bulb, Math.cos(i * 1.57) * 0.3, H - 0.1, Math.sin(i * 1.57) * 0.3, { glow: true, seg: 6, seg2: 4 }); }
  g.add(b.mesh());
  const rot = new T.Group(); rot.position.y = 2.0; g.add(rot);
  const r = new Builder();
  r.cyl(1.42, 1.42, 0.1, K.yel, 0, 0.3, 0, { seg: 20 });
  r.scone(1.5, 0.6, [C1, K.paper], 12, 0, 0.65, 0);
  r.cyl(0.42, 0.52, 0.5, C1, 0, 0.1, 0);
  bulbRing(r, 14, 1.44, 0.3);
  rot.add(r.mesh());
  const cb = new Builder();
  cb.cyl(0.012, 0.012, 1.45, K.stoneD, -0.09, -0.725, 0, { seg: 4 }); cb.cyl(0.012, 0.012, 1.45, K.stoneD, 0.09, -0.725, 0, { seg: 4 });
  cb.box(0.24, 0.04, 0.2, tall ? K.teal : K.red, 0, -1.46, 0); cb.box(0.24, 0.2, 0.03, tall ? K.teal : K.red, 0, -1.36, -0.1);
  const chair = cb.mesh();
  const seats = [], sw = [];
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU, piv = new T.Group(); piv.position.set(Math.cos(a) * 1.3, 0.28, Math.sin(a) * 1.3); piv.rotation.y = -a;
    const s = new T.Group(); s.add(i ? chair.clone() : chair); piv.add(s); rot.add(piv); sw.push(s);
    seats.push(seatAt(s, 0, -1.44, 0));
  }
  return { group: g, seats, update(dt, ride) {
    rot.rotation.y -= dt * (tall ? 2.0 : 1.7) * ride.spin; rot.position.y = 2.0 + RISE * ride.spin;
    const al = (tall ? 1.08 : 0.95) * ride.spin; for (const s of sw) s.rotation.z = al;
  } };
}

// loop: the wilder version, which swings higher and higher and then goes right over the top
function mShip(loop) {
  const g = new T.Group(), b = new Builder(), PY = 3.0, HULL = loop ? 0x6f48d6 : K.redD, FRAME = loop ? K.pink : K.blue;
  b.box(3.84, 0.08, 1.84, K.stoneD, 0, 0.04, 0);
  const L = Math.hypot(1.5, PY), ang = Math.atan2(1.5, PY);
  for (const z of [-0.8, 0.8]) {
    b.cyl(0.06, 0.07, L, FRAME, 0.75, PY / 2, z, { rz: ang, seg: 6 }); b.cyl(0.06, 0.07, L, FRAME, -0.75, PY / 2, z, { rz: -ang, seg: 6 });
    b.sph(0.13, K.yel, 0, PY, z);
  }
  b.cyl(0.07, 0.07, 1.75, K.yel, 0, PY, 0, { rx: Math.PI / 2, seg: 8 });
  g.add(b.mesh());
  const sw = new T.Group(); sw.position.y = PY; g.add(sw);
  const s = new Builder(), HY = -2.3;
  for (const z of [-0.37, 0.37]) { s.cyl(0.035, 0.035, 2.3, K.paper, 0.45, -1.05, z, { rz: 0.405, seg: 5 }); s.cyl(0.035, 0.035, 2.3, K.paper, -0.45, -1.05, z, { rz: -0.405, seg: 5 }); }
  s.box(2.3, 0.42, 0.86, HULL, 0, HY, 0); s.box(2.34, 0.08, 0.9, K.yel, 0, HY + 0.2, 0); s.box(2.2, 0.02, 0.7, K.woodD, 0, HY + 0.25, 0);
  s.box(0.95, 0.42, 0.82, HULL, 1.45, HY + 0.19, 0, { rz: 0.42 }); s.box(0.95, 0.42, 0.82, HULL, -1.45, HY + 0.19, 0, { rz: -0.42 });
  s.box(0.97, 0.08, 0.86, K.yel, 1.43, HY + 0.38, 0, { rz: 0.42 }); s.box(0.97, 0.08, 0.86, K.yel, -1.43, HY + 0.38, 0, { rz: -0.42 });
  s.sph(0.12, K.yel, 1.95, HY + 0.62, 0); s.sph(0.12, K.yel, -1.95, HY + 0.62, 0);
  for (let i = 0; i < 6; i++) s.box(0.12, 0.13, 0.74, K.wood, -1.0 + i * 0.4, HY + 0.325, 0);
  sw.add(s.mesh());
  const seats = [];
  for (let i = 0; i < 6; i++) { const x = -1.0 + i * 0.4; for (const z of [-0.2, 0.2]) seats.push(seatAt(sw, x, HY + 0.39, z, x < 0 ? Math.PI / 2 : -Math.PI / 2)); }
  if (!loop) return { group: g, seats, update(dt, ride) { sw.rotation.z = Math.sin(ride.runT * 1.8) * 1.2 * ride.spin; } };
  // swing up for a while, go over the top a few times, swing out
  let ang0 = 0;
  return { group: g, seats, start() { ang0 = 0; }, update(dt, ride) {
    if (ride.state !== 'run') { sw.rotation.z *= Math.max(0, 1 - dt * 2); return; }
    const t = ride.runT, T1 = 4.6, T2 = ride.def.dur - 4.4;
    if (t < T1) sw.rotation.z = Math.sin(t * 1.9) * t * 0.58;
    else if (t < T2) { sw.rotation.z += dt * 3.1; ang0 = sw.rotation.z; }
    else { let a = ang0 % TAU; if (a > Math.PI) a -= TAU; const q = t - T2; sw.rotation.z = a * Math.exp(-0.75 * q) * Math.cos(1.9 * q); }
  } };
}

function mBumper() {
  const g = new T.Group(), b = new Builder();
  b.box(3.84, 0.1, 2.84, 0x3a3f6b, 0, 0.05, 0);
  b.box(3.84, 0.16, 0.1, K.red, 0, 0.13, -1.37); b.box(3.84, 0.16, 0.1, K.red, 0, 0.13, 1.37); b.box(0.1, 0.16, 2.84, K.red, -1.87, 0.13, 0); b.box(0.1, 0.16, 2.84, K.red, 1.87, 0.13, 0);
  for (const x of [-1.85, 0, 1.85]) for (const z of [-1.35, 1.35]) b.scyl(0.06, 0.06, 1.7, [K.yel, K.paper], 4, x, 0.95, z);
  b.box(3.84, 0.14, 0.12, K.yel, 0, 1.8, -1.35); b.box(3.84, 0.14, 0.12, K.yel, 0, 1.8, 1.35); b.box(0.12, 0.14, 2.84, K.yel, -1.85, 1.8, 0); b.box(0.12, 0.14, 2.84, K.yel, 1.85, 1.8, 0);
  b.box(0.05, 0.05, 2.7, K.inkD, 0, 1.8, 0); b.box(3.7, 0.05, 0.05, K.inkD, 0, 1.8, 0);
  for (let i = 0; i < 13; i++) for (const z of [-1.43, 1.43]) b.sph(0.045, i % 2 ? K.bulb : 0xffb0c0, -1.8 + i * 0.3, 1.8, z, { glow: true, seg: 6, seg2: 4 });
  for (let i = 0; i < 9; i++) for (const x of [-1.93, 1.93]) b.sph(0.045, i % 2 ? K.bulb : 0xffb0c0, x, 1.8, -1.2 + i * 0.3, { glow: true, seg: 6, seg2: 4 });
  g.add(b.mesh());
  const cars = [], seats = [], cols = [K.red, K.blue, K.yel, K.vio, K.pink, K.mint, K.ora, K.paper];
  for (let i = 0; i < 8; i++) {
    const cb = new Builder(), c = cols[i];
    cb.cyl(0.24, 0.24, 0.07, K.inkD, 0, 0.05, 0, { sz: 1.25, seg: 12 });
    cb.sph(0.2, c, 0, 0.1, 0, { sy: 0.6, sz: 1.3 });
    cb.box(0.2, 0.14, 0.04, c, 0, 0.24, -0.17);
    cb.cyl(0.012, 0.012, 1.5, K.stoneD, 0, 0.9, -0.21, { seg: 4 });
    const m = cb.mesh(); m.userData = { p1: rnd(TAU), p2: rnd(TAU), w1: rnd(0.7, 1.2), w2: rnd(0.9, 1.5) };
    m.position.set(1.45 * Math.sin(m.userData.p1), 0.1, 0.95 * Math.sin(m.userData.p2));
    g.add(m); cars.push(m); seats.push(seatAt(m, 0, 0.13, -0.04));
  }
  return { group: g, seats, update(dt, ride) {
    if (ride.spin < 0.01) return;
    const t = ride.animT;
    for (const m of cars) {
      const u = m.userData, x = 1.45 * Math.sin(u.w1 * t + u.p1), z = 0.95 * Math.sin(u.w2 * t + u.p2), dx = x - m.position.x, dz = z - m.position.z;
      if (dx * dx + dz * dz > 1e-7) m.rotation.y = Math.atan2(dx, dz);
      m.position.x = x; m.position.z = z;
    }
  } };
}

function mWheel() {
  const g = new T.Group(), b = new Builder(), R = 1.85, CY = 2.6;
  b.box(3.84, 0.08, 1.84, K.stoneD, 0, 0.04, 0);
  const L = Math.hypot(1.15, CY), ang = Math.atan2(1.15, CY);
  for (const z of [-0.62, 0.62]) { b.cyl(0.06, 0.08, L, K.paper, 0.575, CY / 2, z, { rz: ang, seg: 6 }); b.cyl(0.06, 0.08, L, K.paper, -0.575, CY / 2, z, { rz: -ang, seg: 6 }); }
  b.cyl(0.1, 0.1, 1.4, K.red, 0, CY, 0, { rx: Math.PI / 2, seg: 8 });
  b.box(1.0, 0.14, 0.5, K.red, 0, 0.15, 0.62);
  g.add(b.mesh());
  const wh = new T.Group(); wh.position.y = CY; g.add(wh);
  const w = new Builder();
  for (const z of [-0.36, 0.36]) {
    w.tor(R, 0.035, K.red, 0, 0, z, { seg: 40, rs: 5 }); w.tor(R * 0.55, 0.025, K.yel, 0, 0, z, { seg: 28, rs: 5 });
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; w.cyl(0.022, 0.022, R, K.paper, Math.cos(a) * R / 2, Math.sin(a) * R / 2, z, { rz: a - Math.PI / 2, seg: 5 }); }
    w.cyl(0.22, 0.22, 0.06, K.yel, 0, 0, z, { rx: Math.PI / 2, seg: 12 });
  }
  for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; w.sph(0.04, i % 2 ? K.bulb : 0xffb0c0, Math.cos(a) * R, Math.sin(a) * R, 0.41, { glow: true, seg: 6, seg2: 4 }); }
  wh.add(w.mesh());
  const cols = [K.red, K.blue, K.yel, K.vio, K.pink, K.mint, K.ora, K.paper], gon = [], seats = [];
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * TAU, x = new Builder(), c = cols[i];
    x.cyl(0.02, 0.02, 0.78, K.stoneD, 0, 0, 0, { rx: Math.PI / 2, seg: 5 }); x.cyl(0.015, 0.015, 0.14, K.stoneD, 0, -0.07, 0, { seg: 4 });
    x.cone(0.3, 0.14, c, 0, -0.14, 0, { seg: 8 }); x.cyl(0.22, 0.17, 0.26, c, 0, -0.52, 0, { seg: 8 });
    for (const q of [0.8, 2.4, 4.0, 5.5]) x.cyl(0.012, 0.012, 0.2, K.paper, Math.cos(q) * 0.2, -0.3, Math.sin(q) * 0.2, { seg: 4 });
    const m = x.mesh(); m.position.set(Math.cos(a) * R, Math.sin(a) * R, 0); wh.add(m); gon.push(m);
    seats.push(seatAt(m, -0.08, -0.54, 0, Math.PI / 2), seatAt(m, 0.08, -0.54, 0, -Math.PI / 2));
  }
  return { group: g, seats, update(dt, ride) { wh.rotation.z += dt * 0.42 * ride.spin; for (const m of gon) m.rotation.z = -wh.rotation.z; } };
}

function mTower() {
  const g = new T.Group(), b = new Builder(), H = 7;
  b.cyl(0.95, 1.0, 0.14, K.ink, 0, 0.07, 0, { seg: 8 });
  for (let i = 0; i < H; i++) b.box(0.46, 1, 0.46, i % 2 ? K.paper : K.red, 0, 0.64 + i, 0);
  b.box(0.7, 0.16, 0.7, K.inkD, 0, H + 0.22, 0); b.cone(0.42, 0.5, K.yel, 0, H + 0.55, 0, { seg: 4, ry: Math.PI / 4 }); b.sph(0.1, 0xff6070, 0, H + 0.9, 0, { glow: true });
  for (let i = 1; i < H; i++) for (const [x, z] of [[0.24, 0.24], [-0.24, 0.24], [0.24, -0.24], [-0.24, -0.24]]) b.sph(0.035, K.bulb, x, 0.14 + i, z, { glow: true, seg: 6, seg2: 4 });
  g.add(b.mesh());
  const car = new T.Group(); car.position.y = 0.5; g.add(car);
  const c = new Builder(), seats = [];
  c.box(0.9, 0.22, 0.9, K.inkD, 0, 0.06, 0);
  for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 2, dx = Math.sin(a), dz = Math.cos(a);
    c.box(0.95, 0.08, 0.26, K.yel, dx * 0.6, -0.02, dz * 0.6, { ry: a }); c.box(0.95, 0.44, 0.06, K.blue, dx * 0.47, 0.22, dz * 0.47, { ry: a });
    for (const o of [-0.22, 0.22]) seats.push(seatAt(car, dx * 0.6 + dz * o, 0.02, dz * 0.6 - dx * o, a));
  }
  car.add(c.mesh());
  const prof = (t) => t < 5.5 ? lerp(0.5, 6.3, smooth(0, 5.5, t)) : t < 7 ? 6.3 : t < 7.85 ? 6.3 - 5.2 * Math.pow((t - 7) / 0.85, 2) : t < 9.2 ? 1.1 + 0.9 * Math.sin(Math.PI * (t - 7.85) / 1.35) : lerp(1.1, 0.5, smooth(9.2, 11, t));
  return { group: g, seats, update(dt, ride) { car.position.y = ride.state === 'run' ? prof(ride.runT) : 0.5; } };
}

/* ----- track rides ----- */
const _tp = new T.Vector3(), _tt = new T.Vector3(), _bx = new T.Vector3(), _by = new T.Vector3(), _bz = new T.Vector3(), _bm = new T.Matrix4(), UP = new T.Vector3(0, 1, 0);
function makeTrack(pts, Kn) {
  const curve = new T.CatmullRomCurve3(pts.map((p) => new T.Vector3(p[0], p[1], p[2])), true, 'centripetal');
  curve.arcLengthDivisions = 900;
  const lens = curve.getLengths(), len = lens[lens.length - 1], P = [], TG = [], SD = [];
  for (let i = 0; i < Kn; i++) { const t = curve.getTangentAt(i / Kn).normalize(); P.push(curve.getPointAt(i / Kn)); TG.push(t); SD.push(new T.Vector3().crossVectors(t, UP).normalize()); }
  return { curve, len, K: Kn, P, TG, SD, uOf: (i) => lens[Math.round(i / pts.length * (lens.length - 1))] / len };
}
function railInto(b, tr, off, dy, rad, col, rs) {
  const c = new T.CatmullRomCurve3(tr.P.map((p, i) => new T.Vector3(p.x + tr.SD[i].x * off, p.y + dy, p.z + tr.SD[i].z * off)), true);
  c.arcLengthDivisions = 600;
  b.add(new T.TubeGeometry(c, tr.K, rad, rs || 5, true), col);
}
function supportsInto(b, tr, every, minY, col, rad) {
  for (let i = 0; i < tr.K; i += every) {
    const p = tr.P[i]; if (p.y < minY) continue;
    let ok = true;
    for (let j = 0; j < tr.K; j += 2) { const q = tr.P[j]; if (q.y < p.y - 0.4 && Math.hypot(q.x - p.x, q.z - p.z) < 0.3) { ok = false; break; } }
    if (ok) b.cyl(rad, rad, p.y - 0.1, col, p.x, (p.y - 0.1) / 2, p.z, { seg: 5 });
  }
}
function onTrack(obj, tr, u, lift) {
  u = ((u % 1) + 1) % 1; tr.curve.getPointAt(u, _tp); tr.curve.getTangentAt(u, _tt);
  _bz.copy(_tt).normalize(); _bx.crossVectors(UP, _bz).normalize(); _by.crossVectors(_bz, _bx);
  _bm.makeBasis(_bx, _by, _bz); obj.quaternion.setFromRotationMatrix(_bm); obj.position.copy(_tp).addScaledVector(_by, lift);
}

function mCoaster() {
  const g = new T.Group(), b = new Builder();
  const pts = [[-2.2, 0.55, 1.5], [0, 0.55, 1.5], [2.2, 0.6, 1.5], [2.95, 0.75, 1.0], [2.2, 0.95, 0.5], [0, 2.3, 0.5], [-2.0, 3.7, 0.5], [-3.1, 3.85, -0.5], [-2.2, 3.6, -1.5],
    [-0.9, 1.2, -1.5], [0.3, 2.3, -1.5], [1.6, 1.0, -1.5], [2.4, 1.3, -1.5], [3.05, 1.6, -1.0], [2.2, 1.7, -0.5], [0.9, 1.0, -0.5], [-0.4, 1.6, -0.5], [-1.7, 0.9, -0.5], [-3.2, 0.7, 0.5]];
  const tr = makeTrack(pts, 320);
  b.box(6.84, 0.06, 3.84, 0x8fbf6f, 0, 0.03, 0);
  railInto(b, tr, 0.1, 0, 0.024, K.red); railInto(b, tr, -0.1, 0, 0.024, K.red); railInto(b, tr, 0, -0.08, 0.042, K.redD, 6);
  for (let i = 0; i < tr.K; i += 3) { const p = tr.P[i], t = tr.TG[i]; b.box(0.22, 0.022, 0.035, K.inkD, p.x, p.y - 0.035, p.z, { ry: Math.atan2(t.x, t.z) }); }
  supportsInto(b, tr, 8, 0.62, K.paper, 0.03);
  b.box(3.6, 0.38, 0.3, K.stone, -1.0, 0.22, 1.8);
  for (const x of [-2.7, -1.0, 0.7]) b.cyl(0.035, 0.035, 1.55, K.paper, x, 0.78, 1.93, { seg: 6 });
  for (let i = 0; i < 8; i++) b.box(0.45, 0.05, 1.0, i % 2 ? K.paper : K.blue, -2.575 + i * 0.45, 1.5, 1.55, { rx: 0.14 });
  for (let i = 0; i < 12; i++) b.sph(0.04, K.bulb, -2.7 + i * 0.31, 1.4, 2.06, { glow: true, seg: 6, seg2: 4 });
  g.add(b.mesh());
  const cb = new Builder();
  cb.box(0.3, 0.13, 0.4, K.yel, 0, 0.07, 0); cb.box(0.3, 0.1, 0.05, K.blue, 0, 0.18, 0.19); cb.box(0.26, 0.16, 0.04, K.blue, 0, 0.2, -0.18); cb.box(0.26, 0.14, 0.04, K.blue, 0, 0.19, 0.01);
  for (const x of [-0.13, 0.13]) for (const z of [-0.13, 0.13]) cb.cyl(0.04, 0.04, 0.03, K.inkD, x, 0, z, { rz: Math.PI / 2, seg: 8 });
  const car0 = cb.mesh(), cars = [], seats = [];
  for (let i = 0; i < 3; i++) { const c = i ? car0.clone() : car0; g.add(c); cars.push(c); for (const z of [0.09, -0.1]) for (const x of [-0.07, 0.07]) seats.push(seatAt(c, x, 0.11, z)); }
  const uL0 = tr.uOf(4), uL1 = tr.uOf(6), uBr = tr.uOf(18), uHome = 1.3 / tr.len;
  let s = 0, running = false, fin = false;
  const speed = (u, y) => {
    if (u < uL0 * 0.5) return 0.6 + smooth(0, uL0 * 0.5, u);
    if (u < uL1) return 1.45;
    const v = Math.sqrt(1.2 + 4.8 * Math.max(0, 3.95 - y));
    return u > uBr ? lerp(v, 0.8, smooth(uBr, 1, u)) : v;
  };
  const pose = () => { for (let i = 0; i < 3; i++) onTrack(cars[i], tr, uHome + (s - i * 0.46) / tr.len, 0.09); };
  pose();
  return { group: g, seats, start() { s = 0; running = true; fin = false; }, done() { return fin; }, update(dt) {
    if (!running) return;
    const u = (uHome + s / tr.len) % 1; tr.curve.getPointAt(u, _tp); s += speed(u, _tp.y) * dt;
    if (s >= tr.len) { s = 0; running = false; fin = true; }
    pose();
  } };
}

function mFlume() {
  const g = new T.Group(), b = new Builder(), WAT = 0x4cc3f0;
  const pts = [[-1.6, 0.32, 1.0], [0, 0.32, 1.0], [1.7, 0.32, 1.0], [2.6, 0.32, 0], [1.8, 0.42, -1.0], [0.3, 2.3, -1.0], [-0.5, 2.42, -1.0], [-1.9, 0.32, -1.0], [-2.65, 0.32, 0]];
  const tr = makeTrack(pts, 220);
  b.box(5.84, 0.06, 2.84, 0x8fbf6f, 0, 0.03, 0);
  railInto(b, tr, 0, -0.06, 0.17, WAT, 8);
  railInto(b, tr, 0.2, 0.03, 0.05, K.wood, 5); railInto(b, tr, -0.2, 0.03, 0.05, K.wood, 5);
  supportsInto(b, tr, 7, 0.62, K.woodD, 0.04);
  b.box(1.7, 0.1, 0.95, WAT, -2.05, 0.17, -1.0); b.box(1.8, 0.2, 1.05, K.wood, -2.05, 0.1, -1.0);
  b.box(2.6, 0.3, 0.26, K.stone, 0, 0.18, 1.33);
  for (const x of [-1.2, 1.2]) b.cyl(0.04, 0.04, 1.3, K.woodD, x, 0.65, 1.42, { seg: 6 });
  for (let i = 0; i < 6; i++) b.box(0.45, 0.05, 0.95, i % 2 ? K.paper : K.red, -1.125 + i * 0.45, 1.28, 1.05, { rx: 0.14 });
  g.add(b.mesh());
  const lb = new Builder();
  lb.box(0.28, 0.16, 0.95, K.woodD, 0, 0.06, 0); lb.box(0.2, 0.02, 0.8, 0x4a3a2a, 0, 0.145, 0); lb.sph(0.14, K.woodD, 0, 0.06, 0.47, { sy: 0.6 });
  const log0 = lb.mesh(), logs = [], seats = [];
  for (let i = 0; i < 2; i++) { const l = i ? log0.clone() : log0; g.add(l); logs.push(l); for (const z of [0.3, 0.1, -0.1, -0.3]) seats.push(seatAt(l, 0, 0.09, z)); }
  const sp = new T.Group(); sp.position.set(-1.95, 0.3, -1.0); g.add(sp);
  const dropGeo = new T.SphereGeometry(0.09, 6, 4), dropMat = new T.MeshBasicMaterial({ color: 0xe9f8ff }), drops = [];
  for (let i = 0; i < 10; i++) { const m = new T.Mesh(dropGeo, dropMat); m.userData.a = i / 10 * TAU; m.scale.setScalar(0.001); sp.add(m); drops.push(m); }
  const uL0 = tr.uOf(4), uTop = tr.uOf(6), uBot = tr.uOf(7), uHome = 1.4 / tr.len;
  let s = 0, running = false, fin = false, splash = 0, lastU = 0;
  const speed = (u, y) => u < uL0 ? 1.15 : u < uTop ? 0.95 : u < uBot ? Math.sqrt(0.9 + 5.2 * Math.max(0, 2.45 - y)) : lerp(3.4, 1.15, smooth(uBot, uBot + 0.07, u));
  const pose = () => { for (let i = 0; i < 2; i++) onTrack(logs[i], tr, uHome + (s - i * 1.1) / tr.len, 0.0); };
  pose();
  return { group: g, seats, start() { s = 0; running = true; fin = false; }, done() { return fin; }, update(dt) {
    if (splash > 0) {
      splash = Math.max(0, splash - dt * 1.3); const ph = 1 - splash;
      for (const m of drops) { const a = m.userData.a; m.position.set(Math.cos(a) * ph * 0.8, 1.9 * ph - 2.4 * ph * ph, Math.sin(a) * ph * 0.5); m.scale.setScalar(splash > 0 ? 0.3 + splash : 0.001); }
    }
    if (!running) return;
    const u = (uHome + s / tr.len) % 1; tr.curve.getPointAt(u, _tp); s += speed(u, _tp.y) * dt;
    if (lastU < uBot && u >= uBot) splash = 1;
    lastU = u;
    if (s >= tr.len) { s = 0; running = false; fin = true; }
    pose();
  } };
}

