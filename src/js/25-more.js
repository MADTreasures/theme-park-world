/* ================= more attractions and staff buildings ================= */
function mGhost() {
  const g = new T.Group(), b = new Builder(), WALL = 0x5b4a78, DARK = 0x3a3052, ROOF = 0x2a2350, GLOW = 0xb7ff7a, WOOD = 0x2a2030;
  b.box(3.84, 0.06, 2.84, 0x56506a, 0, 0.03, 0);
  b.box(2.2, 1.5, 1.5, WALL, -0.4, 0.81, -0.4);
  for (let i = 0; i < 6; i++) b.box(2.22, 0.03, 1.52, DARK, -0.4, 0.3 + i * 0.25, -0.4);
  b.box(2.36, 0.08, 1.66, DARK, -0.4, 1.58, -0.4);
  b.box(2.18, 0.5, 0.86, WALL, -0.4, 1.82, -0.4);
  b.box(2.4, 0.06, 1.1, ROOF, -0.4, 1.96, -0.8, { rx: -0.72 }); b.box(2.4, 0.06, 1.1, ROOF, -0.4, 1.96, 0.0, { rx: 0.72 });
  b.box(0.22, 0.62, 0.22, DARK, -1.05, 2.3, -0.55, { rz: 0.16 }); b.box(0.28, 0.06, 0.28, ROOF, -1.1, 2.62, -0.55, { rz: 0.16 });
  b.box(0.82, 2.5, 0.82, DARK, 1.2, 1.31, -0.6); b.box(0.92, 0.08, 0.92, ROOF, 1.2, 2.58, -0.6);
  b.cone(0.74, 1.05, ROOF, 1.2, 3.14, -0.6, { seg: 4, ry: Math.PI / 4 }); b.sph(0.06, GLOW, 1.2, 3.72, -0.6, { glow: true, seg: 6, seg2: 4 });
  b.box(0.52, 0.84, 0.05, WOOD, -0.4, 0.48, 0.36); b.box(0.62, 0.07, 0.09, ROOF, -0.4, 0.93, 0.37); b.sph(0.025, K.yel, -0.25, 0.46, 0.4, { seg: 5, seg2: 4 });
  for (const [x, y] of [[-1.15, 1.05], [0.35, 1.05], [-1.15, 0.5], [0.35, 0.5]]) {
    b.box(0.3, 0.36, 0.04, GLOW, x, y, 0.36, { glow: true });
    b.box(0.34, 0.03, 0.05, WOOD, x, y, 0.37); b.box(0.03, 0.4, 0.05, WOOD, x, y, 0.37); b.box(0.38, 0.04, 0.06, WOOD, x, y - 0.2, 0.37);
  }
  for (const y of [1.0, 1.95]) { b.box(0.26, 0.4, 0.04, y > 1.5 ? 0xffb347 : GLOW, 1.2, y, -0.18, { glow: true }); b.box(0.03, 0.42, 0.05, WOOD, 1.2, y, -0.17); }
  b.box(1.0, 0.1, 0.5, 0x6a6480, -0.4, 0.1, 0.62); b.box(0.8, 0.1, 0.3, 0x6a6480, -0.4, 0.05, 0.95);
  for (let i = 0; i < 4; i++) {
    const x = 0.75 + (i % 2) * 0.55, z = 0.45 + (i >> 1) * 0.5, rz = (i - 1.5) * 0.09;
    b.box(0.18, 0.24, 0.06, 0x9a9fb5, x, 0.18, z, { rz }); b.cyl(0.09, 0.09, 0.06, 0x9a9fb5, x - rz * 0.12, 0.3, z, { rx: Math.PI / 2, seg: 8 });
  }
  b.cyl(0.05, 0.08, 0.9, WOOD, -1.6, 0.5, 0.95, { seg: 5, rz: 0.1 });
  b.cyl(0.02, 0.035, 0.5, WOOD, -1.45, 1.0, 0.95, { seg: 4, rz: -0.9 }); b.cyl(0.02, 0.03, 0.45, WOOD, -1.8, 0.95, 0.95, { seg: 4, rz: 0.8 }); b.cyl(0.015, 0.025, 0.35, WOOD, -1.62, 1.1, 0.8, { seg: 4, rx: -0.7 });
  for (let x = -1.8; x <= 1.81; x += 0.3) if (Math.abs(x + 0.4) > 0.5) { b.box(0.03, 0.36, 0.03, WOOD, x, 0.24, 1.36); b.cone(0.03, 0.07, WOOD, x, 0.45, 1.36, { seg: 4 }); }
  b.box(1.28, 0.025, 0.025, WOOD, -1.36, 0.32, 1.36); b.box(1.7, 0.025, 0.025, WOOD, 0.95, 0.32, 1.36);
  g.add(b.mesh());
  const gb = new Builder();
  gb.sph(0.2, 0xf4f6ff, 0, 0.12, 0, { sy: 1.1, seg: 8, seg2: 6 }); gb.cone(0.2, 0.34, 0xf4f6ff, 0, -0.12, 0, { rx: Math.PI, seg: 8 });
  for (const x of [-0.07, 0.07]) gb.sph(0.035, 0x1b1530, x, 0.16, 0.16, { seg: 5, seg2: 4 });
  gb.sph(0.03, 0x1b1530, 0, 0.06, 0.18, { sy: 1.4, seg: 5, seg2: 4 });
  const ghost = gb.mesh(false); g.add(ghost);
  const bb = new Builder(); bb.sph(0.045, 0x15101f, 0, 0, 0, { seg: 5, seg2: 4 }); bb.box(0.16, 0.01, 0.07, 0x15101f, -0.1, 0.01, 0, { rz: 0.3 }); bb.box(0.16, 0.01, 0.07, 0x15101f, 0.1, 0.01, 0, { rz: -0.3 });
  const bat0 = bb.mesh(false), bats = [bat0, bat0.clone()]; bats.forEach((m) => g.add(m));
  let tt = rnd(10);
  return { group: g, seats: [], povSeat: seatAt(ghost, 0, 0.3, -0.2), update(dt, r) {
    tt += dt * (0.35 + 1.5 * r.spin);
    const out = 0.4 + 0.6 * r.spin;
    ghost.position.set(-0.4 + Math.cos(tt * 0.9) * 1.5 * out, 2.3 + Math.sin(tt * 2.1) * 0.25 + r.spin * 0.3, -0.4 + Math.sin(tt * 0.9) * 1.1 * out); ghost.rotation.y = -tt * 0.9;
    bats.forEach((m, i) => { const a = tt * 1.7 + i * Math.PI; m.position.set(1.2 + Math.cos(a) * 0.75, 3.0 + Math.sin(tt * 3 + i) * 0.2, -0.6 + Math.sin(a) * 0.75); m.rotation.y = -a; m.rotation.z = Math.sin(tt * 14 + i) * 0.5; });
  } };
}

function mKart() {
  const g = new T.Group(), b = new Builder(), A = 2.25, B = 1.25, ASPH = 0x4a4d5e;
  b.box(5.84, 0.06, 3.84, 0x7fb45f, 0, 0.03, 0);
  for (let i = 0; i < 36; i++) {
    const a = i / 36 * TAU, c = Math.cos(a), s = Math.sin(a), ry = Math.atan2(-s * A, c * B);
    b.box(0.66, 0.03, 0.62, ASPH, c * A, 0.075, s * B, { ry });
    b.box(0.08, 0.06, 0.26, i % 2 ? K.red : K.paper, c * (A + 0.37), 0.09, s * (B + 0.37), { ry });
    b.box(0.08, 0.06, 0.18, i % 2 ? K.paper : K.red, c * (A - 0.37), 0.09, s * (B - 0.37), { ry });
    if (i % 3 === 0) b.box(0.03, 0.005, 0.2, K.paper, c * A, 0.093, s * B, { ry });
  }
  for (const z of [B - 0.44, B + 0.44]) b.scyl(0.035, 0.035, 1.1, [K.inkD, K.paper], 4, 0, 0.6, z);
  for (let i = 0; i < 8; i++) for (let j = 0; j < 2; j++) b.box(0.05, 0.1, 0.11, (i + j) % 2 ? K.inkD : K.paper, 0, 1.08 + j * 0.1, B - 0.385 + i * 0.11);
  b.box(1.1, 0.5, 0.6, K.red, 0, 0.31, 0); b.box(1.22, 0.06, 0.72, K.paper, 0, 0.59, 0); b.box(0.5, 0.26, 0.03, K.inkD, 0, 0.36, 0.31);
  for (const x of [-0.75, 0.75]) { for (let k = 0; k < 3; k++) b.cyl(0.1, 0.1, 0.07, K.inkD, x, 0.1 + k * 0.07, 0, { seg: 8 }); }
  for (const x of [-0.5, 0.5]) { b.cyl(0.012, 0.012, 0.7, K.inkD, x, 0.95, 0, { seg: 4 }); b.box(0.2, 0.12, 0.01, x < 0 ? K.yel : K.blue, x + 0.1, 1.22, 0); }
  bulbRing(b, 10, 0.7, 0.64);
  g.add(b.mesh());
  const cols = [K.red, K.blue, K.yel, K.mint, K.vio, K.ora], karts = [], seats = [];
  for (let i = 0; i < 6; i++) {
    const kb = new Builder(), c = cols[i];
    kb.box(0.2, 0.06, 0.34, c, 0, 0.07, 0); kb.box(0.12, 0.05, 0.12, c, 0, 0.08, 0.2); kb.box(0.18, 0.13, 0.03, K.inkD, 0, 0.15, -0.13); kb.box(0.22, 0.02, 0.05, K.inkD, 0, 0.07, 0.27);
    for (const x of [-0.12, 0.12]) for (const z of [-0.12, 0.14]) kb.cyl(0.045, 0.045, 0.04, 0x1c1c22, x, 0.045, z, { rz: Math.PI / 2, seg: 8 });
    kb.cyl(0.006, 0.006, 0.1, K.inkD, 0, 0.14, 0.09, { rx: -0.6, seg: 4 }); kb.cyl(0.035, 0.035, 0.008, K.inkD, 0, 0.18, 0.06, { rx: 0.95, seg: 8 });
    const m = kb.mesh(); m.userData = { th: i / 6 * TAU, w: 0.8 + i * 0.045, lane: 0.9 + (i % 3) * 0.08 };
    g.add(m); karts.push(m); seats.push(seatAt(m, 0, 0.1, -0.05));
  }
  const pose = (t) => { for (const m of karts) { const u = m.userData, a = u.th + t * u.w, c = Math.cos(a), s = Math.sin(a); m.position.set(c * A * u.lane, 0.045, s * B * u.lane); m.rotation.y = Math.atan2(-s * A, c * B); } };
  pose(0);
  return { group: g, seats, update(dt, r) { if (r.spin > 0.01) pose(r.animT); } };
}

function mMini() {
  const g = new T.Group(), b = new Builder();
  const pts = [[-1.3, 0.5, 1.0], [0, 0.5, 1.0], [1.3, 0.5, 1.0], [2.05, 0.7, 0.15], [1.55, 1.5, -0.85], [0.3, 2.3, -1.05], [-0.7, 1.25, -1.0], [-1.6, 1.6, -0.7], [-2.1, 0.8, 0.15]];
  const tr = makeTrack(pts, 200);
  b.box(4.84, 0.06, 2.84, 0x8fbf6f, 0, 0.03, 0);
  railInto(b, tr, 0.1, 0, 0.024, K.mint); railInto(b, tr, -0.1, 0, 0.024, K.mint); railInto(b, tr, 0, -0.08, 0.042, K.teal, 6);
  for (let i = 0; i < tr.K; i += 3) { const p = tr.P[i], t = tr.TG[i]; b.box(0.22, 0.022, 0.035, K.inkD, p.x, p.y - 0.035, p.z, { ry: Math.atan2(t.x, t.z) }); }
  supportsInto(b, tr, 8, 0.62, K.paper, 0.03);
  b.box(2.5, 0.34, 0.24, K.stone, 0, 0.2, 1.3);
  for (const x of [-1.2, 1.2]) b.cyl(0.03, 0.03, 1.3, K.paper, x, 0.65, 1.42, { seg: 6 });
  for (let i = 0; i < 6; i++) b.box(0.44, 0.05, 0.9, i % 2 ? K.paper : K.pink, -1.1 + i * 0.44, 1.28, 1.05, { rx: 0.14 });
  g.add(b.mesh());
  const cb = new Builder();
  cb.box(0.3, 0.13, 0.4, K.pink, 0, 0.07, 0); cb.box(0.3, 0.1, 0.05, K.paper, 0, 0.18, 0.19); cb.box(0.26, 0.16, 0.04, K.paper, 0, 0.2, -0.18); cb.box(0.26, 0.14, 0.04, K.paper, 0, 0.19, 0.01);
  for (const x of [-0.13, 0.13]) for (const z of [-0.13, 0.13]) cb.cyl(0.04, 0.04, 0.03, K.inkD, x, 0, z, { rz: Math.PI / 2, seg: 8 });
  const car0 = cb.mesh(), cars = [], seats = [];
  for (let i = 0; i < 2; i++) { const c = i ? car0.clone() : car0; g.add(c); cars.push(c); for (const z of [0.09, -0.1]) for (const x of [-0.07, 0.07]) seats.push(seatAt(c, x, 0.11, z)); }
  const st = { s: 0, v: 0 }; let running = false, fin = false;
  const pose = () => { for (let i = 0; i < 2; i++) onTrack(cars[i], tr, (CO.home + st.s - i * 0.46) / tr.len, 0.09); };
  pose();
  return { group: g, seats, start() { st.s = 0; st.v = 0; running = true; fin = false; }, done() { return fin; }, update(dt) {
    if (!running) return;
    if (coasterAdvance(st, dt, tr.curve, tr.len)) { st.s = 0; running = false; fin = true; }
    pose();
  } };
}

function mBreak() {
  const g = new T.Group(), b = new Builder(), WALL = 0xf3ead2;
  b.box(1.9, 0.05, 0.9, K.stoneD, 0, 0.025, 0);
  b.box(1.2, 0.72, 0.7, WALL, -0.3, 0.41, -0.05); b.box(1.3, 0.06, 0.8, K.teal, -0.3, 0.8, -0.05);
  b.box(0.5, 0.34, 0.03, 0x9fd8ff, -0.55, 0.5, 0.305); b.box(0.56, 0.03, 0.04, K.teal, -0.55, 0.69, 0.31); b.box(0.56, 0.03, 0.04, K.teal, -0.55, 0.31, 0.31);
  b.box(0.3, 0.56, 0.03, K.teal, 0.05, 0.33, 0.305); b.sph(0.02, K.yel, 0.14, 0.33, 0.325, { seg: 5, seg2: 4 });
  b.cyl(0.12, 0.09, 0.2, K.paper, -0.3, 0.95, -0.05, { seg: 10 }); b.cyl(0.125, 0.125, 0.02, 0x6b3a2a, -0.3, 1.045, -0.05, { seg: 10 }); b.tor(0.06, 0.016, K.paper, -0.15, 0.95, -0.05, { seg: 8 });
  for (const sx of [-1, 1]) b.sph(0.03, 0xffffff, -0.3 + sx * 0.03, 1.13 + (sx > 0 ? 0.05 : 0), -0.05, { seg: 5, seg2: 4 });
  b.cyl(0.02, 0.02, 0.9, K.inkD, 0.62, 0.45, 0.1, { seg: 5 }); b.scone(0.42, 0.2, [K.red, K.paper], 8, 0.62, 0.95, 0.1);
  b.cyl(0.2, 0.2, 0.03, K.wood, 0.62, 0.4, 0.1, { seg: 10 });
  for (const [x, z] of [[0.36, 0.1], [0.88, 0.1]]) { b.box(0.14, 0.03, 0.14, K.wood, x, 0.24, z); b.box(0.03, 0.22, 0.03, K.inkD, x, 0.12, z); }
  b.box(0.22, 0.5, 0.2, K.blue, -0.78, 0.3, 0.33); b.box(0.16, 0.2, 0.01, 0xcfefff, -0.78, 0.4, 0.435, { glow: true });
  g.add(b.mesh());
  return { group: g, seats: [] };
}
function mHouse() {
  const g = new T.Group(), b = new Builder(), WALL = 0xf6e3c0, ROOF = 0xb9243a;
  b.box(1.9, 0.05, 1.9, 0x7fb45f, 0, 0.025, 0);
  b.box(1.4, 0.9, 1.1, WALL, 0, 0.5, -0.2); b.box(1.38, 0.34, 0.5, WALL, 0, 1.08, -0.2);
  b.box(1.56, 0.06, 0.82, ROOF, 0, 1.2, -0.52, { rx: -0.62 }); b.box(1.56, 0.06, 0.82, ROOF, 0, 1.2, 0.12, { rx: 0.62 });
  b.box(0.2, 0.4, 0.2, 0x9a5a4a, 0.42, 1.42, -0.42); b.box(0.24, 0.05, 0.24, K.inkD, 0.42, 1.63, -0.42);
  b.box(0.3, 0.56, 0.04, K.teal, 0, 0.33, 0.355); b.sph(0.02, K.yel, 0.09, 0.33, 0.38, { seg: 5, seg2: 4 }); b.box(0.44, 0.06, 0.2, K.stone, 0, 0.06, 0.46);
  for (const x of [-0.45, 0.45]) { b.box(0.26, 0.26, 0.03, 0xffe9a8, x, 0.6, 0.355, { glow: true }); b.box(0.3, 0.03, 0.04, K.paper, x, 0.6, 0.36); b.box(0.03, 0.3, 0.04, K.paper, x, 0.6, 0.36); b.box(0.32, 0.05, 0.08, K.red, x, 0.44, 0.38); }
  b.box(0.22, 0.22, 0.03, 0xffe9a8, 0, 1.08, 0.06, { glow: true });
  for (let i = 0; i < 9; i++) { const x = -0.9 + i * 0.225; if (Math.abs(x) > 0.2) { b.box(0.04, 0.26, 0.03, K.paper, x, 0.17, 0.9); } }
  b.box(0.62, 0.03, 0.03, K.paper, -0.6, 0.22, 0.9); b.box(0.62, 0.03, 0.03, K.paper, 0.6, 0.22, 0.9);
  b.cyl(0.015, 0.015, 0.3, K.inkD, 0.3, 0.2, 0.86, { seg: 4 }); b.box(0.1, 0.07, 0.07, K.red, 0.3, 0.37, 0.86);
  for (let i = 0; i < 6; i++) { const x = -0.75 + rnd(0.5), z = 0.5 + rnd(0.3); b.ico(0.06, pick(GREENS), x, 0.09, z); b.sph(0.04, pick([K.red, K.yel, K.pink, 0xffffff]), x, 0.16, z, { seg: 5, seg2: 4 }); }
  addTree(b, 0.7, 0.62, 0.55);
  g.add(b.mesh());
  return { group: g, seats: [] };
}

/* ----- name boards and corner lights that every attraction gets ----- */
const signBoards = {};
function drawBoard(c, name) {
  c.clearRect(0, 0, 256, 64); c.fillStyle = '#232861'; c.fillRect(0, 0, 256, 64); c.strokeStyle = '#ffd447'; c.lineWidth = 4; c.strokeRect(3, 3, 250, 58);
  const fam = 'px Bungee, Impact, "Arial Black", sans-serif'; let fs = 30; c.font = '400 ' + fs + fam;
  const tw = c.measureText(name.toUpperCase()).width; if (tw > 228) { fs = Math.floor(fs * 228 / tw); c.font = '400 ' + fs + fam; }
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ffd447'; c.fillText(name.toUpperCase(), 128, 34);
}
function boardTex(name) {
  if (!signBoards[name]) signBoards[name] = canvasTex(256, 64, (c) => drawBoard(c, name));
  return signBoards[name];
}
if (document.fonts && document.fonts.load) document.fonts.load('30px Bungee').then(() => { for (const n in signBoards) { drawBoard(signBoards[n].image.getContext('2d'), n); signBoards[n].needsUpdate = true; } }).catch(() => {});
function dressRide(ob) {
  const d = ob.def; if (d.cat !== 'ride' || ob.k === 'custom') return;
  const b = new Builder(), hw = d.w / 2 - 0.07, hh = d.h / 2 - 0.07;
  for (const [x, z] of [[-hw, -hh], [hw, -hh], [-hw, hh], [hw, hh]]) { b.cyl(0.022, 0.03, 0.55, K.inkD, x, 0.3, z, { seg: 5 }); b.sph(0.05, K.bulb, x, 0.6, z, { glow: true, seg: 6, seg2: 4 }); }
  const sx = -hw + 0.55;
  for (const x of [sx - 0.36, sx + 0.36]) b.cyl(0.02, 0.02, 0.86, K.inkD, x, 0.43, hh, { seg: 5 });
  b.box(0.86, 0.24, 0.03, K.ink, sx, 0.84, hh);
  const m = b.mesh(); ob.group.add(m);
  for (const s of [1, -1]) { const p = new T.Mesh(new T.PlaneGeometry(0.82, 0.205), new T.MeshBasicMaterial({ map: boardTex(d.name) })); p.position.set(sx, 0.84, hh + s * 0.017); if (s < 0) p.rotation.y = Math.PI; p.userData.keep = true; ob.group.add(p); }
}

/* ----- dunk tank: three guests throw, the fourth sits on the plank ----- */
function mDunk() {
  const g = new T.Group(), b = new Builder(), WAT = 0x4cc3f0, TZ = -0.8;
  b.box(1.9, 0.06, 2.9, K.stoneD, 0, 0.03, 0);
  b.box(1.2, 0.72, 1.0, 0x8fd9f7, 0, 0.42, TZ); b.box(1.26, 0.07, 1.06, K.blue, 0, 0.09, TZ); b.box(1.26, 0.07, 1.06, K.blue, 0, 0.78, TZ); b.box(1.1, 0.02, 0.9, WAT, 0, 0.82, TZ);
  for (const x of [-0.6, 0.6]) for (const z of [-0.5, 0.5]) b.box(0.07, 0.74, 0.07, K.blue, x, 0.43, TZ + z);
  for (let i = 0; i < 6; i++) b.box(0.21, 1.6, 0.05, i % 2 ? K.red : K.paper, -0.525 + i * 0.21, 1.6, -1.38);
  b.box(1.34, 0.1, 0.08, K.yel, 0, 2.44, -1.38);
  for (let i = 0; i < 6; i++) b.sph(0.04, K.bulb, -0.55 + i * 0.22, 2.44, -1.33, { glow: true, seg: 6, seg2: 4 });
  b.cyl(0.03, 0.03, 1.5, K.inkD, 0.86, 0.8, -0.25, { seg: 5 }); b.box(0.3, 0.04, 0.04, K.inkD, 0.72, 1.3, -0.4, { ry: 0.8 });
  b.cyl(0.24, 0.24, 0.04, K.paper, 0.86, 1.62, -0.25, { rx: Math.PI / 2, seg: 14 }); b.cyl(0.16, 0.16, 0.05, K.red, 0.86, 1.62, -0.25, { rx: Math.PI / 2, seg: 14 }); b.cyl(0.07, 0.07, 0.06, K.paper, 0.86, 1.62, -0.25, { rx: Math.PI / 2, seg: 10 });
  b.box(1.9, 0.02, 0.08, K.yel, 0, 0.07, 0.72);
  b.cyl(0.17, 0.13, 0.2, K.wood, -0.72, 0.16, 1.15, { seg: 8 }); for (const [x, z] of [[-0.76, 1.12], [-0.68, 1.18], [-0.72, 1.1]]) b.sph(0.05, K.yel, x, 0.28, z, { seg: 6, seg2: 4 });
  for (const x of [-0.93, 0.93]) { b.box(0.03, 0.3, 1.4, K.paper, x, 0.2, 0.75); b.box(0.04, 0.34, 0.04, K.red, x, 0.2, 1.45); }
  g.add(b.mesh());
  const plank = new T.Group(); plank.position.set(0, 1.2, TZ); g.add(plank);
  const pb = new Builder(); pb.box(0.62, 0.05, 0.3, K.wood, 0, 0, 0); pb.box(0.05, 0.05, 0.62, K.inkD, -0.28, -0.03, -0.3); pb.box(0.05, 0.05, 0.62, K.inkD, 0.28, -0.03, -0.3);
  plank.add(pb.mesh());
  const seats = [seatAt(plank, 0, 0.03, 0.02)];
  for (const x of [-0.5, 0, 0.5]) { const s = seatAt(g, x, 0.06, 1.05, Math.PI); s.userData.pose = 'throw'; seats.push(s); }
  const ballGeo = new T.SphereGeometry(0.05, 7, 5), ballMat = softMat({ color: K.yel }), balls = [];
  for (let i = 0; i < 3; i++) { const m = new T.Mesh(ballGeo, ballMat); m.visible = false; g.add(m); balls.push(m); }
  const dropMat = new T.MeshBasicMaterial({ color: 0xe9f8ff }), dropGeo = new T.SphereGeometry(0.07, 6, 4), drops = [];
  for (let i = 0; i < 8; i++) { const m = new T.Mesh(dropGeo, dropMat); m.userData.a = i / 8 * TAU; m.scale.setScalar(0.001); m.position.set(0, 0.8, TZ); g.add(m); drops.push(m); }
  let splash = 0, lastC = 0;
  return { group: g, seats, update(dt, r) {
    if (splash > 0) { splash = Math.max(0, splash - dt * 1.4); const ph = 1 - splash; for (const m of drops) { const a = m.userData.a; m.position.set(Math.cos(a) * ph * 0.7, 0.8 + 1.6 * ph - 2.2 * ph * ph, TZ + Math.sin(a) * ph * 0.5); m.scale.setScalar(splash > 0 ? 0.3 + splash : 0.001); } }
    if (r.state !== 'run') { plank.position.y = 1.2; for (const m of balls) m.visible = false; lastC = 0; return; }
    const c = r.runT % 4;
    for (let i = 0; i < 3; i++) { const u = (c - (0.5 + i)) / 0.45, m = balls[i]; m.visible = u > 0 && u < 1; if (m.visible) m.position.set(lerp(-0.5 + i * 0.5, i === 2 ? 0.86 : 0.86 + (i ? 0.4 : -0.5), u), 0.5 + lerp(0, 1.1, u) + Math.sin(u * Math.PI) * 0.5, lerp(1.0, -0.25, u)); }
    const d = c - 2.95; plank.position.y = d < 0 ? 1.2 : d < 0.12 ? 1.2 - 0.8 * d / 0.12 : d < 0.6 ? 0.4 + Math.sin(d * 9) * 0.03 : lerp(0.4, 1.2, smooth(0.6, 1.0, d));
    if (lastC < 2.95 && c >= 2.95) { splash = 1; const p = g.position; sfxAt('splash', p.x, p.z, 1.2); }
    lastC = c;
  } };
}

/* ----- the big drop tower: a lattice mast with a turning ring of twelve seats ----- */
function mSkyTower() {
  const g = new T.Group(), b = new Builder(), H = 11;
  b.cyl(1.36, 1.42, 0.16, K.ink, 0, 0.08, 0, { seg: 12 }); b.cyl(0.7, 0.8, 0.3, K.inkD, 0, 0.3, 0, { seg: 8 });
  for (const [x, z] of [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]]) { b.cyl(0.05, 0.06, H, K.paper, x, H / 2 + 0.2, z, { seg: 6 }); for (let i = 1; i < H; i += 2) b.sph(0.04, K.bulb, x * 1.2, i + 0.2, z * 1.2, { glow: true, seg: 6, seg2: 4 }); }
  for (let i = 0; i < H; i++) { const c = i % 2 ? K.yel : K.vio, y = 0.7 + i; b.box(0.66, 0.045, 0.045, c, 0, y, -0.3); b.box(0.66, 0.045, 0.045, c, 0, y, 0.3); b.box(0.045, 0.045, 0.66, c, -0.3, y, 0); b.box(0.045, 0.045, 0.66, c, 0.3, y, 0); b.box(0.9, 0.035, 0.035, c, 0, y + 0.5, 0.3, { rz: 0.82 }); b.box(0.9, 0.035, 0.035, c, 0, y + 0.5, -0.3, { rz: -0.82 }); }
  b.cyl(0.62, 0.46, 0.3, K.vio, 0, H + 0.4, 0, { seg: 8 }); b.scone(0.6, 1.0, [K.yel, K.vio], 8, 0, H + 1.05, 0); b.sph(0.12, 0xff6070, 0, H + 1.65, 0, { glow: true });
  bulbRing(b, 10, 0.64, H + 0.4);
  g.add(b.mesh());
  const car = new T.Group(); car.position.y = 0.6; g.add(car);
  const c = new Builder(), seats = [];
  c.cyl(1.05, 1.05, 0.14, K.inkD, 0, 0, 0, { seg: 12 }); c.cyl(0.62, 0.62, 0.5, K.vio, 0, 0.2, 0, { seg: 12 });
  for (let k = 0; k < 12; k++) {
    const a = k / 12 * TAU, dx = Math.sin(a), dz = Math.cos(a);
    c.box(0.36, 0.06, 0.24, K.yel, dx * 0.98, 0.1, dz * 0.98, { ry: a }); c.box(0.36, 0.42, 0.05, k % 2 ? K.red : K.blue, dx * 0.84, 0.32, dz * 0.84, { ry: a });
    seats.push(seatAt(car, dx * 0.98, 0.13, dz * 0.98, a));
  }
  bulbRing(c, 12, 1.06, 0.02);
  car.add(c.mesh());
  const top = H - 0.8;
  const prof = (t) => t < 6.5 ? lerp(0.6, top, smooth(0, 6.5, t)) : t < 8 ? top : t < 9.05 ? top - (top - 1.3) * Math.pow((t - 8) / 1.05, 2) : t < 10.9 ? 1.3 + 3.2 * Math.sin(Math.PI * (t - 9.05) / 1.85) : t < 12.1 ? 1.3 + 1.2 * Math.sin(Math.PI * (t - 10.9) / 1.2) : lerp(1.3, 0.6, smooth(12.1, 14, t));
  let last = 0;
  return { group: g, seats, update(dt, r) {
    if (r.state !== 'run') { car.position.y = 0.6; last = 0; return; }
    car.position.y = prof(r.runT); car.rotation.y += dt * (r.runT < 8 ? 0.5 : 0.15);
    if (last < 8 && r.runT >= 8) { const p = g.position; sfxAt('drop', p.x, p.z, 1.3); }
    last = r.runT;
  } };
}

/* ----- guard post: a sentry box for two guards ----- */
function mPost() {
  const g = new T.Group(), b = new Builder();
  b.box(0.9, 0.05, 0.9, K.stoneD, 0, 0.025, 0);
  b.box(0.6, 1.0, 0.6, K.blue, 0, 0.55, -0.12);
  for (let i = 0; i < 3; i++) { b.box(0.1, 1.0, 0.61, K.paper, -0.2 + i * 0.2, 0.55, -0.12); b.box(0.61, 1.0, 0.1, K.paper, 0, 0.55, -0.32 + i * 0.2); }
  b.box(0.36, 0.74, 0.02, K.inkD, 0, 0.44, 0.19);
  b.cone(0.54, 0.42, K.red, 0, 1.26, -0.12, { seg: 4, ry: Math.PI / 4 }); b.sph(0.06, K.bulb, 0, 1.52, -0.12, { glow: true, seg: 6, seg2: 4 });
  b.cyl(0.1, 0.1, 0.04, K.wood, 0.3, 0.2, 0.3, { seg: 8 }); for (const a of [0.5, 2.6, 4.7]) b.cyl(0.012, 0.012, 0.18, K.inkD, 0.3 + Math.cos(a) * 0.07, 0.1, 0.3 + Math.sin(a) * 0.07, { seg: 4 });
  g.add(b.mesh());
  const p = new T.Mesh(new T.PlaneGeometry(0.52, 0.13), new T.MeshBasicMaterial({ map: boardTex('Wache') })); p.position.set(0, 0.93, 0.192); g.add(p);
  return { group: g, seats: [] };
}
