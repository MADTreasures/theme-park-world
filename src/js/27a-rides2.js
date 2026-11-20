/* ================= newer attractions ================= */
const OVAL = (rx, rz, y) => [[-rx * 0.55, y, rz], [0, y, rz], [rx * 0.55, y, rz], [rx, y, rz * 0.5], [rx, y, -rz * 0.5], [rx * 0.55, y, -rz], [-rx * 0.55, y, -rz], [-rx, y, -rz * 0.5], [-rx, y, rz * 0.5]];

/* ----- children's railway: an engine and four open wagons on an oval ----- */
function mTrain() {
  const g = new T.Group(), b = new Builder(), tr = makeTrack(OVAL(1.55, 1.0, 0.1), 140);
  plate(b, 4, 3, LAWN);
  railInto(b, tr, 0.07, 0, 0.014, K.stoneD, 4); railInto(b, tr, -0.07, 0, 0.014, K.stoneD, 4);
  for (let i = 0; i < tr.K; i += 3) { const p = tr.P[i], t = tr.TG[i]; b.box(0.24, 0.02, 0.05, K.woodD, p.x, 0.075, p.z, { ry: Math.atan2(t.x, t.z) }); }
  b.box(1.5, 0.12, 0.3, K.stone, 0, 0.09, 1.3); canopyInto(b, 0, 1.3, 1.6, K.red, K.paper);
  // a tunnel over the far straight, a little wood in the middle
  b.box(0.9, 0.5, 0.12, 0x8a8fa8, 0, 0.3, -0.72); b.box(0.9, 0.5, 0.12, 0x8a8fa8, 0, 0.3, -1.22); b.box(0.9, 0.14, 0.62, 0x9aa0b8, 0, 0.6, -0.97); b.sph(1, LAWN, 0, 0.64, -0.97, { sx: 0.6, sy: 0.2, sz: 0.42, seg: 10, seg2: 6 });
  addTree(b, -0.45, 0.05, 0.62); addTree(b, 0.5, -0.1, 0.5); addBush(b, 0.05, 0.3, 0.7);
  b.cyl(0.02, 0.02, 0.5, K.inkD, 1.1, 0.3, 0.55, { seg: 5 }); b.box(0.09, 0.16, 0.05, K.inkD, 1.1, 0.56, 0.55); b.sph(0.03, K.red, 1.1, 0.6, 0.58, { glow: true, seg: 6, seg2: 4 }); b.sph(0.03, K.mint, 1.1, 0.53, 0.58, { glow: true, seg: 6, seg2: 4 });
  g.add(b.mesh());
  const wag = (v) => { v.box(0.26, 0.05, 0.36, K.inkD, 0, 0.045, 0); v.box(0.28, 0.12, 0.38, K.blue, 0, 0.12, 0); v.box(0.24, 0.02, 0.34, K.paper, 0, 0.185, 0); for (const x of [-0.14, 0.14]) for (const z of [-0.11, 0.11]) v.cyl(0.045, 0.045, 0.03, K.inkD, x, 0.025, z, { rz: Math.PI / 2, seg: 8 }); };
  const cars = circuit(g, { tr, n: 4, veh: wag, seats: [[0, 0.18, 0.08], [0, 0.18, -0.09]], speed: 1.1, lift: 0.02, spread: 4 * 0.44 / tr.len });
  const loco = circuit(g, { tr, n: 1, speed: 1.1, lift: 0.02, u0: 4 * 0.44 / tr.len, veh(v) {
    v.box(0.26, 0.05, 0.4, K.inkD, 0, 0.045, 0); v.cyl(0.11, 0.11, 0.26, K.red, 0, 0.19, 0.05, { rx: Math.PI / 2, seg: 10 }); v.box(0.26, 0.22, 0.14, K.red, 0, 0.2, -0.13); v.box(0.3, 0.03, 0.18, K.yel, 0, 0.325, -0.13);
    v.cyl(0.035, 0.05, 0.12, K.inkD, 0, 0.34, 0.1, { seg: 7 }); v.sph(0.04, K.yel, 0, 0.3, -0.02, { seg: 6, seg2: 4 }); v.cone(0.12, 0.1, K.yel, 0, 0.07, 0.24, { rx: Math.PI / 2, seg: 4 });
    for (const x of [-0.14, 0.14]) for (const z of [-0.12, 0.1]) v.cyl(0.055, 0.055, 0.03, K.inkD, x, 0.03, z, { rz: Math.PI / 2, seg: 8 });
  } });
  return { group: g, seats: cars.seats, update(dt, r) { if (r.spin > 0.01) { cars.step(dt, r.spin); loco.step(dt, r.spin); } } };
}

/* ----- horse coaster for children: gentle hills, cars that are horses ----- */
function mPonyCoaster() {
  return trackRide({
    pts: [[-1.3, 0.45, 1.0], [0, 0.45, 1.0], [1.3, 0.45, 1.0], [2.05, 0.6, 0.2], [1.6, 1.15, -0.8], [0.6, 0.72, -1.05], [-0.4, 1.25, -1.0], [-1.5, 0.78, -0.8], [-2.1, 0.62, 0.15]], K: 190, cars: 4, gap: 0.5, pose: 'straddle',
    seats: [[0, 0.3, 0.02], [0, 0.3, -0.17]],
    base(b, tr) {
      plate(b, 5, 3, LAWN);
      railInto(b, tr, 0.09, 0, 0.022, K.wood); railInto(b, tr, -0.09, 0, 0.022, K.wood); railInto(b, tr, 0, -0.07, 0.036, K.woodD, 6);
      for (let i = 0; i < tr.K; i += 3) { const p = tr.P[i], t = tr.TG[i]; b.box(0.2, 0.02, 0.035, K.woodD, p.x, p.y - 0.03, p.z, { ry: Math.atan2(t.x, t.z) }); }
      supportsInto(b, tr, 8, 0.6, K.paper, 0.028);
      b.box(2.5, 0.3, 0.24, K.wood, 0, 0.18, 1.3); canopyInto(b, 0, 1.3, 2.6, K.yel, K.paper);
      fenceInto(b, -2.3, -1.38, 2.3, -1.38, K.paper, 0.22); for (const x of [-1.9, 1.9]) addBush(b, x, 1.15, 0.6);
      b.box(0.5, 0.3, 0.34, 0xe0c060, 0.4, 0.2, 0.1); b.box(0.5, 0.3, 0.34, 0xe0c060, 0.85, 0.2, 0.2, { ry: 0.5 });   // hay
    },
    car(c) {
      c.box(0.16, 0.2, 0.44, 0x9b6a4a, 0, 0.16, 0); c.box(0.11, 0.26, 0.12, 0x9b6a4a, 0, 0.36, 0.19, { rx: 0.45 }); c.box(0.11, 0.12, 0.22, 0x9b6a4a, 0, 0.5, 0.29);
      c.box(0.035, 0.24, 0.16, 0x4a3a2a, 0, 0.42, 0.11, { rx: 0.45 }); c.box(0.04, 0.16, 0.05, 0x4a3a2a, 0, 0.2, -0.25, { rx: -0.5 }); c.box(0.18, 0.04, 0.3, K.red, 0, 0.275, -0.06);
      for (const x of [-0.06, 0.06]) { c.sph(0.014, 0x1b1530, x, 0.53, 0.38, { seg: 4, seg2: 3 }); c.sph(1, 0x9b6a4a, x * 0.8, 0.59, 0.24, { sx: 0.02, sy: 0.04, sz: 0.02, seg: 4, seg2: 3 }); }
      for (const x of [-0.1, 0.1]) for (const z of [-0.14, 0.14]) c.cyl(0.045, 0.045, 0.03, K.inkD, x, 0.02, z, { rz: Math.PI / 2, seg: 8 });
      c.box(0.2, 0.05, 0.4, K.inkD, 0, 0.045, 0);
    },
  });
}

/* ----- trampolines: every other jump is a somersault ----- */
function mTramp() {
  const g = new T.Group(), b = new Builder(), seats = [], jumpers = [];
  plate(b, 2, 2, LAWN);
  for (const [x, z, c] of [[-0.45, -0.45, K.blue], [0.45, -0.45, K.pink], [-0.45, 0.45, K.yel], [0.45, 0.45, K.mint]]) {
    b.cyl(0.4, 0.4, 0.2, K.inkD, x, 0.16, z, { seg: 16 }); b.cyl(0.4, 0.4, 0.04, c, x, 0.27, z, { seg: 16 }); b.cyl(0.3, 0.3, 0.045, 0x2b2b33, x, 0.275, z, { seg: 16 });
    const out = new T.Group(); out.position.set(x, 0.3, z); g.add(out);
    const piv = new T.Group(); piv.position.y = 0.3; out.add(piv);
    const s = seatAt(piv, 0, -0.3, 0); s.userData.pose = 'jump'; seats.push(s); jumpers.push({ out, piv, ph: rnd(TAU), sp: rnd(3.2, 3.9), ry: rnd(TAU) });
  }
  for (const [x, z] of [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]]) { b.cyl(0.025, 0.03, 1.9, K.paper, x, 0.98, z, { seg: 6 }); b.sph(0.05, K.bulb, x, 1.96, z, { glow: true, seg: 6, seg2: 4 }); }
  for (const [x0, z0, x1, z1] of [[-0.9, -0.9, 0.9, -0.9], [-0.9, 0.9, 0.9, 0.9], [-0.9, -0.9, -0.9, 0.9], [0.9, -0.9, 0.9, 0.9]]) for (let i = 0; i < 6; i++) b.box(0.15, 0.1, 0.012, [K.red, K.yel, K.blue][i % 3], lerp(x0, x1, (i + 0.5) / 6), 1.82 - Math.sin((i + 0.5) / 6 * Math.PI) * 0.12, lerp(z0, z1, (i + 0.5) / 6), { ry: x0 === x1 ? Math.PI / 2 : 0, rz: Math.PI / 4 });
  g.add(b.mesh());
  return { group: g, seats, update(dt, r) {
    for (const j of jumpers) {
      const q = r.animT * j.sp + j.ph, k = Math.floor(q / Math.PI), f = q / Math.PI - k, h = Math.sin(f * Math.PI);
      j.out.position.y = 0.3 + h * 1.05 * r.spin; j.out.rotation.y = j.ry;
      j.piv.rotation.x = k % 2 && r.spin > 0.6 ? -smooth(0.12, 0.88, f) * TAU : 0;   // tucked forwards, once round
    }
  } };
}

/* ----- pony farm: ponies walk round the paddock ----- */
function mPony() {
  const g = new T.Group(), b = new Builder();
  plate(b, 4, 3, LAWN); b.cyl(1.0, 1.0, 0.02, SANDY, 0.25, 0.07, 0.05, { seg: 20, sx: 1.55, sz: 1.05 });
  fenceInto(b, -1.86, -1.36, 1.86, -1.36); fenceInto(b, -1.86, 1.36, -0.5, 1.36); fenceInto(b, 0.5, 1.36, 1.86, 1.36); fenceInto(b, -1.86, -1.36, -1.86, 1.36); fenceInto(b, 1.86, -1.36, 1.86, 1.36);
  b.box(0.9, 0.7, 0.6, K.wood, -1.3, 0.41, -0.95); b.box(1.0, 0.06, 0.48, K.redD, -1.3, 0.92, -1.12, { rx: -0.6 }); b.box(1.0, 0.06, 0.48, K.redD, -1.3, 0.92, -0.78, { rx: 0.6 }); b.box(0.34, 0.46, 0.03, K.woodD, -1.3, 0.3, -0.64);
  b.box(0.4, 0.24, 0.28, 0xe0c060, -0.55, 0.18, -1.08); b.box(0.36, 0.1, 0.16, K.woodD, 1.45, 0.11, -1.1); b.box(0.3, 0.02, 0.1, WAT, 1.45, 0.165, -1.1);
  g.add(b.mesh());
  const c = circuit(g, { pts: OVAL(1.5, 0.82, 0.07).map((p) => [p[0] + 0.25, p[1], p[2] + 0.05]), K: 100, n: 6, mesh: critter('pony', 0xa9764c), seats: [[0, 0.445, -0.03]], pose: 'straddle', speed: 0.42 });
  const cols = [0xa9764c, 0xf1e4cf, 0x5a4636, 0xd9b27a, 0x8a8f9c, 0xf1e4cf];
  c.vs.forEach((v, i) => { if (i) v.traverse((o) => { if (o.isMesh) { o.geometry = o.geometry.clone(); const a = o.geometry.attributes.color, k = new T.Color(cols[i]), base = new T.Color(0xa9764c); for (let q = 0; q < a.count; q++) if (Math.abs(a.getX(q) - base.r) < 0.02 && Math.abs(a.getY(q) - base.g) < 0.02) a.setXYZ(q, k.r, k.g, k.b); } }); });
  return { group: g, seats: c.seats, update(dt, r) { if (r.spin > 0.01) { c.step(dt, r.spin); for (let i = 0; i < c.vs.length; i++) c.vs[i].position.y += Math.abs(Math.sin(r.animT * 5 + i)) * 0.015; } } };
}

/* ----- petting zoo: goats, sheep and rabbits wander between the visitors ----- */
function mPetting() {
  const g = new T.Group(), b = new Builder(), seats = [], pets = [];
  plate(b, 3, 3, LAWN);
  fenceInto(b, -1.36, -1.36, 1.36, -1.36, K.wood); fenceInto(b, -1.36, 1.36, -0.45, 1.36, K.wood); fenceInto(b, 0.45, 1.36, 1.36, 1.36, K.wood); fenceInto(b, -1.36, -1.36, -1.36, 1.36, K.wood); fenceInto(b, 1.36, -1.36, 1.36, 1.36, K.wood);
  b.box(0.8, 0.5, 0.55, K.wood, -0.85, 0.31, -0.95); b.box(0.9, 0.05, 0.42, 0x5cb85c, -0.85, 0.66, -1.1, { rx: -0.55 }); b.box(0.9, 0.05, 0.42, 0x5cb85c, -0.85, 0.66, -0.8, { rx: 0.55 }); b.box(0.26, 0.3, 0.03, 0x4a3a2a, -0.85, 0.21, -0.67);
  b.box(0.5, 0.1, 0.18, K.woodD, 0.85, 0.11, -1.1); b.box(0.44, 0.02, 0.12, 0xe0c060, 0.85, 0.165, -1.1); b.box(0.36, 0.2, 0.26, 0xe0c060, 0.2, 0.16, -1.1);
  addBush(b, 1.0, 0.95, 0.55);
  g.add(b.mesh());
  for (const [k, col, s, cx, cz, rad] of [['goat', 0xf1e4cf, 1, -0.3, 0.2, 0.45], ['goat', 0x8a6a4a, 0.9, 0.5, -0.35, 0.4], ['sheep', 0xfdfbf3, 1, 0.45, 0.5, 0.42], ['sheep', 0xfdfbf3, 0.8, -0.6, -0.2, 0.3], ['rabbit', 0xd9c2a0, 1, 0.0, -0.6, 0.3], ['rabbit', 0xffffff, 1, -0.7, 0.75, 0.28], ['rabbit', 0x8a8f9c, 1, 0.8, 0.0, 0.25]]) {
    const m = critter(k, col, s); g.add(m); pets.push({ m, cx, cz, rad, w: rnd(0.25, 0.5) * (Math.random() < 0.5 ? -1 : 1), ph: rnd(TAU), hop: k === 'rabbit' });
  }
  for (const [x, z, ry] of [[-0.95, 0.3, 1.6], [-0.2, 0.85, 3.0], [0.75, 0.95, -2.4], [1.0, -0.4, -1.6], [0.1, -0.15, 0.4], [-0.5, -0.55, 0.9], [0.45, 0.15, -2.0], [-0.15, 0.35, 2.4]]) { const s = seatAt(g, x, 0.06, z, ry); s.userData.pose = 'stand'; seats.push(s); }
  let t = rnd(20);
  return { group: g, seats, update(dt) {
    t += dt;
    for (const p of pets) { const a = t * p.w + p.ph; p.m.position.set(p.cx + Math.cos(a) * p.rad, 0.06 + (p.hop ? Math.abs(Math.sin(t * 4 + p.ph)) * 0.04 : 0), p.cz + Math.sin(a * 1.3) * p.rad * 0.7); p.m.rotation.y = Math.atan2(-Math.sin(a) * p.w, Math.cos(a * 1.3) * 1.3 * 0.7 * p.w); }
  } };
}

/* ----- water playground: jets that come and go, children running through them ----- */
function mSplash() {
  const g = new T.Group(), b = new Builder(), seats = [], jets = [];
  plate(b, 3, 3, 0x9fd8f0); b.cyl(1.25, 1.25, 0.03, 0x7cc4e6, 0, 0.075, 0, { seg: 24 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; b.cyl(0.1, 0.1, 0.02, [K.yel, K.pink, K.mint][i % 3], Math.cos(a) * 0.95, 0.095, Math.sin(a) * 0.95, { seg: 10 }); }
  b.cyl(0.06, 0.08, 1.1, K.paper, 0, 0.63, 0, { seg: 8 }); b.sph(1, K.red, 0, 1.2, 0, { sx: 0.5, sy: 0.2, sz: 0.5, seg: 14, seg2: 6 }); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; b.sph(0.07, K.paper, Math.cos(a) * 0.3, 1.28, Math.sin(a) * 0.3, { seg: 6, seg2: 4, sy: 0.5 }); }
  for (const [x, z, c] of [[-1.15, -1.15, K.yel], [1.15, -1.15, K.pink]]) { b.tor(0.3, 0.035, c, x, 0.36, z, { ry: x > 0 ? -0.8 : 0.8, rs: 5, seg: 14 }); }
  g.add(b.mesh());
  const jb = new Builder(); jb.cone(0.05, 0.5, 0xd9f3ff, 0, 0.25, 0, { rx: Math.PI, seg: 6 }); jb.sph(0.045, 0xeefaff, 0, 0.5, 0, { seg: 6, seg2: 4 });
  const j0 = jb.mesh(false);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, m = i ? j0.clone() : j0; m.position.set(Math.cos(a) * 0.95, 0.1, Math.sin(a) * 0.95); g.add(m); jets.push(m); }
  const cur = new Builder(); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; cur.cyl(0.012, 0.012, 0.95, 0xd9f3ff, Math.cos(a) * 0.46, 0.68, Math.sin(a) * 0.46, { seg: 3 }); }
  const curtain = cur.mesh(false); g.add(curtain);
  const rot = new T.Group(); g.add(rot);
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, rr = i % 2 ? 0.72 : 1.08, s = seatAt(rot, Math.cos(a) * rr, 0.09, Math.sin(a) * rr, -a); s.userData.pose = 'jump'; s.userData.ph = rnd(TAU); seats.push(s); }
  let t = rnd(20);
  return { group: g, seats, update(dt, r) {
    t += dt;
    for (let i = 0; i < 12; i++) { const k = Math.max(0, Math.sin(t * 2.2 - i * 0.52)); jets[i].scale.y = 0.05 + k * (1.1 + 0.8 * r.spin); }
    curtain.rotation.y = t * 0.6; curtain.scale.y = 0.9 + 0.1 * Math.sin(t * 9);
    if (r.spin > 0.01) { rot.rotation.y += dt * 0.8 * r.spin; for (const s of seats) s.position.y = 0.09 + Math.abs(Math.sin(r.animT * 5.5 + s.userData.ph)) * 0.16 * r.spin; }
  } };
}

/* ----- mirror maze: a pavilion of glass and mirrors; visitors disappear inside ----- */
function mMirror() {
  const g = new T.Group(), b = new Builder(), GL = 0xcfeaff, FR = K.vio;
  plate(b, 3, 3, 0x6a6480);
  b.box(2.7, 0.12, 2.5, 0x4d4868, 0, 0.12, -0.1);
  for (let i = 0; i < 6; i++) { const x = -1.125 + i * 0.45; if (i !== 2 && i !== 3) b.box(0.4, 1.3, 0.05, GL, x, 0.83, 1.12); b.box(0.4, 1.3, 0.05, GL, x, 0.83, -1.32); b.box(0.05, 1.42, 0.07, FR, x - 0.225, 0.89, 1.12); b.box(0.05, 1.42, 0.07, FR, x - 0.225, 0.89, -1.32); }
  b.box(0.05, 1.42, 0.07, FR, 1.35, 0.89, 1.12); b.box(0.05, 1.42, 0.07, FR, 1.35, 0.89, -1.32);
  for (let i = 0; i < 5; i++) { const z = -1.08 + i * 0.49; for (const x of [-1.35, 1.35]) { b.box(0.05, 1.3, 0.44, GL, x, 0.83, z); b.box(0.07, 1.42, 0.05, FR, x, 0.89, z - 0.245); } }
  for (const [x, z, ry] of [[-0.6, 0.4, 0.5], [0.5, 0.2, -0.6], [-0.2, -0.5, 1.1], [0.7, -0.8, 0.3], [-0.85, -0.6, -0.4]]) b.box(0.55, 1.2, 0.03, 0xe6f6ff, x, 0.78, z, { ry });
  for (let i = 0; i < 12; i++) b.box(0.02, 0.5, 0.012, 0xffffff, -1.2 + (i % 6) * 0.45 + 0.08, 0.95 + (i % 2) * 0.2, (i < 6 ? 1.15 : -1.35), { rz: -0.5 });   // gleams on the glass
  b.box(2.86, 0.1, 2.6, FR, 0, 1.6, -0.1); b.box(2.5, 0.06, 2.24, K.pink, 0, 1.68, -0.1);
  for (let i = 0; i < 5; i++) b.cone(0.22, 0.4, i % 2 ? K.mint : GL, -1.0 + i * 0.5, 1.9, -0.1, { seg: 4, ry: Math.PI / 4 });
  b.box(1.0, 0.36, 0.08, K.ink, 0, 1.44, 1.16); b.box(0.9, 0.05, 0.3, K.yel, 0, 1.6, 1.3);
  for (const x of [-0.42, 0.42]) b.sph(0.05, K.bulb, x, 1.44, 1.22, { glow: true, seg: 6, seg2: 4 });
  g.add(b.mesh());
  return { group: g, seats: [], update() {} };
}

/* ----- inline skating course: bumps, a banked turn and a slalom ----- */
function mSkate() {
  const g = new T.Group(), b = new Builder(), AS = 0x7b819a;
  const pts = [[-1.4, 0.08, 1.0], [0, 0.08, 1.0], [1.3, 0.08, 1.0], [2.05, 0.3, 0.35], [2.05, 0.3, -0.4], [1.2, 0.08, -1.0], [0.3, 0.42, -1.0], [-0.6, 0.08, -1.0], [-1.5, 0.08, -0.95], [-2.1, 0.34, -0.25], [-2.05, 0.22, 0.5]];
  const tr = makeTrack(pts, 150);
  plate(b, 5, 3, AS);
  railInto(b, tr, 0, -0.1, 0.17, 0x9aa0b8, 6);
  b.box(0.5, 0.3, 0.9, K.blue, 2.2, 0.2, 0, { rz: 0.5 }); b.box(0.5, 0.3, 0.9, K.blue, -2.2, 0.2, 0.1, { rz: -0.5 });
  b.box(0.5, 0.05, 0.5, K.yel, -0.05, 0.25, -1.0, { rz: 0.72 }); b.box(0.5, 0.05, 0.5, K.yel, 0.62, 0.25, -1.0, { rz: -0.72 }); b.box(0.24, 0.36, 0.5, K.ora, 0.3, 0.2, -1.0);
  for (let i = 0; i < 5; i++) { b.cone(0.05, 0.14, K.ora, -1.2 + i * 0.5, 0.13, 0.25 + (i % 2) * 0.22, { seg: 6 }); }
  b.box(1.6, 0.03, 0.03, K.inkD, 0, 0.3, -0.3); for (const x of [-0.75, 0.75]) b.cyl(0.02, 0.02, 0.26, K.inkD, x, 0.17, -0.3, { seg: 5 });
  b.box(1.5, 0.24, 0.22, K.stone, 0, 0.15, 1.32); canopyInto(b, 0, 1.3, 1.7, K.mint, K.paper);
  for (const x of [-2.3, 2.3]) { b.cyl(0.02, 0.02, 1.1, K.paper, x, 0.58, -1.3, { seg: 5 }); b.box(0.3, 0.18, 0.02, x < 0 ? K.pink : K.yel, x + 0.16, 1.02, -1.3); }
  g.add(b.mesh());
  const c = circuit(g, { tr, n: 8, speed: 1.55, pose: 'skate', seats: [[0, 0.0, 0]], veh(v) { for (const x of [-0.028, 0.028]) { v.box(0.026, 0.02, 0.09, K.inkD, x, 0.022, 0.01); for (const z of [-0.025, 0.01, 0.045]) v.cyl(0.013, 0.013, 0.014, K.yel, x, 0.012, z, { rz: Math.PI / 2, seg: 6 }); } }, lift: 0.07 });
  return { group: g, seats: c.seats, update(dt, r) { if (r.spin > 0.01) c.step(dt, r.spin); } };
}

/* ----- pump track: rollers and berms, ridden on small bikes ----- */
function mPump() {
  const g = new T.Group(), b = new Builder(), DIRT = 0xb08a5e;
  const pts = []; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, x = Math.sin(a) * 2.0, z = Math.cos(a) * 1.0; pts.push([x, 0.16 + (i % 2 ? 0.16 : 0) + Math.abs(Math.sin(a)) * 0.12, z]); }
  const tr = makeTrack(pts, 170);
  plate(b, 5, 3, LAWN);
  railInto(b, tr, 0, -0.14, 0.22, DIRT, 7); railInto(b, tr, 0, -0.05, 0.13, 0xc4a377, 6);
  b.cyl(0.9, 0.9, 0.05, LAWN, 0, 0.08, 0, { seg: 16, sx: 1.4, sz: 0.55 }); addBush(b, -0.6, 0.0, 0.6); addBush(b, 0.5, 0.05, 0.7); addTree(b, 0.0, -0.05, 0.55);
  for (const x of [-2.25, 2.25]) { b.cyl(0.02, 0.02, 1.0, K.paper, x, 0.53, 1.3, { seg: 5 }); b.box(0.28, 0.16, 0.02, x < 0 ? K.red : K.blue, x + (x < 0 ? 0.15 : -0.15), 0.94, 1.3); }
  b.box(1.2, 0.2, 0.2, K.stone, 0, 0.13, 1.34);
  g.add(b.mesh());
  const c = circuit(g, { tr, n: 6, speed: 1.9, pose: 'straddle', seats: [[0, 0.215, -0.03]], lift: 0.08, veh(v) {
    for (const z of [-0.13, 0.13]) { v.tor(0.06, 0.012, K.inkD, 0, 0.06, z, { ry: Math.PI / 2, rs: 4, seg: 10 }); v.cyl(0.012, 0.012, 0.02, K.stone, 0, 0.06, z, { rz: Math.PI / 2, seg: 5 }); }
    v.box(0.02, 0.02, 0.2, K.red, 0, 0.13, 0.0, { rx: -0.25 }); v.box(0.02, 0.14, 0.02, K.red, 0, 0.13, -0.07, { rx: 0.3 }); v.box(0.02, 0.17, 0.02, K.red, 0, 0.14, 0.11, { rx: -0.3 });
    v.box(0.05, 0.02, 0.08, K.inkD, 0, 0.205, -0.05); v.box(0.16, 0.015, 0.015, K.stone, 0, 0.23, 0.085);
  } });
  return { group: g, seats: c.seats, update(dt, r) { if (r.spin > 0.01) c.step(dt, r.spin); } };
}

/* ----- cable car: gondolas climb from the station over two pylons and come back ----- */
function mCable() {
  const g = new T.Group(), b = new Builder(), HY = 0.74;
  const pts = [[-3.25, 1.3, 0.36], [-2.3, 1.5, 0.36], [-0.6, 2.9, 0.36], [1.4, 3.3, 0.36], [3.1, 3.2, 0.3], [3.5, 3.2, 0], [3.1, 3.2, -0.3], [1.4, 3.3, -0.36], [-0.6, 2.9, -0.36], [-2.3, 1.5, -0.36], [-3.25, 1.3, -0.36], [-3.6, 1.3, 0]];
  const tr = makeTrack(pts, 180);
  plate(b, 8, 2, LAWN);
  railInto(b, tr, 0, 0, 0.016, K.inkD, 4);
  // valley station with a platform and a roof
  b.box(1.5, 0.5, 1.6, K.stone, -3.1, 0.31, 0); b.box(0.5, 0.25, 0.5, K.stoneD, -2.2, 0.18, 0.55); b.box(0.5, 0.12, 0.5, K.stoneD, -1.8, 0.12, 0.55);
  for (const z of [-0.74, 0.74]) for (const x of [-3.75, -2.45]) b.cyl(0.04, 0.04, 1.5, K.paper, x, 1.3, z, { seg: 6 });
  b.box(1.56, 0.08, 1.7, K.red, -3.1, 2.08, 0); b.box(1.3, 0.1, 1.44, K.paper, -3.1, 2.16, 0); b.cyl(0.42, 0.42, 0.05, K.yel, -3.25, 1.36, 0, { seg: 14 }); b.cyl(0.05, 0.05, 0.66, K.inkD, -3.25, 1.7, 0, { seg: 6 });
  // pylons and the wheel at the far end
  for (const [x, h] of [[-0.6, 2.9], [1.4, 3.3]]) { b.cyl(0.07, 0.12, h, K.stone, x, h / 2 + 0.03, 0, { seg: 8 }); b.box(0.1, 0.07, 0.9, K.stone, x, h + 0.04, 0); for (const z of [-0.36, 0.36]) b.cyl(0.06, 0.06, 0.04, K.yel, x, h + 0.04, z, { rx: Math.PI / 2, seg: 8 }); }
  b.cyl(0.1, 0.16, 3.2, K.stone, 3.3, 1.63, 0, { seg: 8 }); b.cyl(0.34, 0.34, 0.05, K.yel, 3.25, 3.24, 0, { seg: 14 }); b.box(0.5, 0.3, 0.5, K.stoneD, 3.3, 0.21, 0);
  addTree(b, 0.4, -0.55, 0.7); addTree(b, 2.2, 0.5, 0.6); addBush(b, -1.2, -0.6, 0.7);
  g.add(b.mesh());
  const c = circuit(g, { tr, n: 3, speed: 0.7, level: true, seats: [[-0.09, -HY + 0.2, 0.09], [0.09, -HY + 0.2, 0.09], [-0.09, -HY + 0.2, -0.09, Math.PI], [0.09, -HY + 0.2, -0.09, Math.PI]], veh(v) {
    v.box(0.03, 0.42, 0.03, K.inkD, 0, -0.2, 0); v.box(0.3, 0.03, 0.05, K.inkD, 0, -0.4, 0);
    v.box(0.42, 0.06, 0.46, K.red, 0, -HY + 0.03, 0); v.box(0.42, 0.14, 0.46, K.red, 0, -HY + 0.12, 0); v.box(0.44, 0.06, 0.48, K.paper, 0, -0.43, 0);
    for (const x of [-0.2, 0.2]) for (const z of [-0.22, 0.22]) v.box(0.025, 0.26, 0.025, K.paper, x, -0.56, z);
    v.box(0.4, 0.035, 0.12, K.inkD, 0, -HY + 0.18, 0.16); v.box(0.4, 0.035, 0.12, K.inkD, 0, -HY + 0.18, -0.16);
  } });
  return { group: g, seats: c.seats, update(dt, r) { if (r.spin > 0.01) { c.step(dt, r.spin); for (const v of c.vs) v.rotation.z = Math.sin(r.animT * 1.6 + v.position.x) * 0.05; } } };
}

/* ----- Schwanenstein castle: towers, banners and two swans on the pond ----- */
function mCastle() {
  const g = new T.Group(), b = new Builder(), WALL = 0xfff3e6, SH = 0xe9d9c6, ROOF = 0x4f7fe0, seats = [];
  plate(b, 5, 4, LAWN);
  const tower = (x, z, r, h, roof) => {
    b.cyl(r, r * 1.06, h, WALL, x, h / 2 + 0.05, z, { seg: 12 }); b.cyl(r * 1.16, r * 1.16, 0.09, SH, x, h + 0.02, z, { seg: 12 });
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; b.box(r * 0.42, 0.1, 0.07, WALL, x + Math.cos(a) * r * 1.1, h + 0.11, z + Math.sin(a) * r * 1.1, { ry: -a + Math.PI / 2 }); }
    b.cone(r * 1.08, roof, ROOF, x, h + 0.06 + roof / 2, z, { seg: 12 }); b.cyl(0.012, 0.012, 0.3, K.inkD, x, h + roof + 0.2, z, { seg: 4 }); b.box(0.2, 0.1, 0.012, K.pink, x + 0.1, h + roof + 0.28, z);
    for (let k = 0; k < 2; k++) b.box(0.07, 0.16, 0.02, K.bulb, x, h * (0.45 + k * 0.3), z + r * 1.02, { glow: true });
  };
  b.box(2.5, 1.4, 1.7, WALL, -0.1, 0.75, -0.75); b.box(2.62, 0.1, 1.82, SH, -0.1, 1.47, -0.75);
  for (let i = 0; i < 9; i++) for (const z of [-1.62, 0.12]) b.box(0.16, 0.12, 0.1, WALL, -1.3 + i * 0.3, 1.58, z);
  b.box(1.5, 0.9, 1.0, WALL, -0.1, 1.95, -0.85); b.box(1.7, 0.06, 0.7, ROOF, -0.1, 2.58, -1.14, { rx: -0.7 }); b.box(1.7, 0.06, 0.7, ROOF, -0.1, 2.58, -0.56, { rx: 0.7 });
  tower(-1.45, 0.1, 0.34, 2.2, 0.9); tower(1.25, 0.1, 0.34, 2.2, 0.9); tower(-1.45, -1.6, 0.38, 2.9, 1.1); tower(1.25, -1.6, 0.3, 3.6, 1.2); tower(-0.1, -0.85, 0.26, 3.3, 1.0);
  // gatehouse with a balcony
  b.box(0.9, 1.0, 0.5, WALL, -0.1, 0.55, 0.32); b.box(0.46, 0.66, 0.06, 0x6b4a2a, -0.1, 0.38, 0.58); b.cyl(0.23, 0.23, 0.06, 0x6b4a2a, -0.1, 0.71, 0.58, { rx: Math.PI / 2, seg: 12 });
  b.box(1.1, 0.06, 0.6, SH, -0.1, 1.08, 0.36); for (let i = 0; i < 6; i++) b.box(0.03, 0.14, 0.03, WALL, -0.6 + i * 0.2, 1.18, 0.64); b.box(1.1, 0.03, 0.03, WALL, -0.1, 1.26, 0.64);
  for (const x of [-0.42, 0.22]) { b.box(0.1, 0.3, 0.02, K.bulb, x + 0.1, 1.05, -0.74 + 0.86, { glow: true }); }
  for (const x of [-0.62, 0.42]) { b.cyl(0.015, 0.015, 0.5, K.inkD, x, 1.4, 0.6, { seg: 4 }); b.box(0.02, 0.3, 0.2, x < 0 ? K.pink : K.yel, x, 1.45, 0.72); }
  // moat pond with the swans, a path of slabs to the gate
  b.cyl(0.7, 0.72, 0.05, 0xdfe7ee, 1.55, 0.085, 1.25, { seg: 18, sx: 1.2 }); b.cyl(0.62, 0.62, 0.02, WAT, 1.55, 0.115, 1.25, { seg: 18, sx: 1.2 });
  for (let i = 0; i < 4; i++) b.box(0.4, 0.03, 0.26, 0xd8cbb8, -0.1, 0.075, 0.82 + i * 0.3);
  addTree(b, -2.05, 1.3, 0.7); addBush(b, -1.5, 1.45, 0.6); addFlowers(b, 0.7, 1.55);
  g.add(b.mesh());
  const swans = [critter('swan', 0, 1.1), critter('swan', 0, 0.95)]; swans.forEach((m) => g.add(m));
  for (const x of [-0.42, -0.1, 0.22]) { const s = seatAt(g, x, 1.11, 0.42); s.userData.pose = 'stand'; seats.push(s); }
  let t = rnd(20);
  return { group: g, seats, update(dt) {
    t += dt;
    swans.forEach((m, i) => { const a = t * 0.35 + i * Math.PI; m.position.set(1.55 + Math.cos(a) * 0.45, 0.11, 1.25 + Math.sin(a) * 0.33); m.rotation.y = -a; });
  } };
}

/* ----- quiet garden: benches by a pond, where queasy stomachs settle ----- */
function mRest() {
  const g = new T.Group(), b = new Builder(), seats = [];
  plate(b, 3, 3, LAWN);
  b.cyl(0.62, 0.66, 0.06, 0xb9bdd0, 0, 0.09, 0, { seg: 16, sx: 1.15 }); b.cyl(0.54, 0.54, 0.02, WAT, 0, 0.125, 0, { seg: 16, sx: 1.15 });
  for (const [x, z] of [[0.25, 0.1], [-0.2, -0.15], [-0.05, 0.25]]) { b.cyl(0.11, 0.11, 0.012, 0x4caf50, x, 0.14, z, { seg: 8 }); }
  b.sph(0.05, K.pink, 0.25, 0.17, 0.1, { seg: 6, seg2: 4, sy: 0.7 });
  addTree(b, -1.05, -1.05, 0.85); addTree(b, 1.1, -0.95, 0.7); addBush(b, 1.15, 1.1, 0.6); addFlowers(b, -1.1, 1.1); addFlowers(b, 0.1, -1.2);
  for (const [x, z, ry] of [[0, 1.05, Math.PI], [-1.1, 0.1, Math.PI / 2], [1.1, 0.15, -Math.PI / 2], [-0.1, -0.95, 0]]) {
    const c = Math.cos(ry), s = Math.sin(ry), at = (lx, lz) => [x + lx * c + lz * s, z - lx * s + lz * c];
    let p = at(0, 0); b.box(0.62, 0.04, 0.2, K.wood, p[0], 0.3, p[1], { ry }); p = at(0, -0.1); b.box(0.62, 0.2, 0.03, K.wood, p[0], 0.42, p[1], { ry });
    for (const lx of [-0.26, 0.26]) { p = at(lx, 0); b.box(0.04, 0.26, 0.18, K.inkD, p[0], 0.17, p[1], { ry }); }
    for (const lx of [-0.15, 0.15]) { p = at(lx, 0.02); seats.push(seatAt(g, p[0], 0.32, p[1], ry)); }
  }
  b.cyl(0.02, 0.025, 0.7, K.inkD, 0.75, 0.4, 0.75, { seg: 5 }); b.sph(0.07, K.bulb, 0.75, 0.8, 0.75, { glow: true, seg: 8, seg2: 5 });
  g.add(b.mesh());
  return { group: g, seats, update() {} };
}
