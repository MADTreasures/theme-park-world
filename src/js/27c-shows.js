/* ================= shows ================= */
// The audience sits on a grandstand at the front and looks at a stage, an arena or a pool behind it.
// While a show runs (spin > 0) the performers do their act; in between they rest.

/* ----- magic show: a magician, a hat with a rabbit in it, cards in the air ----- */
function mMagic() {
  const g = new T.Group(), b = new Builder(), seats = [];
  plate(b, 4, 3, 0x4a3a78);
  b.box(3.3, 0.3, 1.0, 0x6b4a2a, 0, 0.21, -0.9); b.box(3.3, 0.06, 0.04, K.yel, 0, 0.33, -0.39);
  for (let i = 0; i < 10; i++) b.box(0.33, 1.7, 0.08, i % 2 ? K.red : K.redD, -1.485 + i * 0.33, 1.2, -1.38);
  for (const x of [-1.55, 1.55]) { b.box(0.3, 1.75, 0.3, K.redD, x, 1.22, -1.15); b.box(0.34, 0.06, 0.34, K.yel, x, 1.1, -1.15); }
  b.box(3.4, 0.32, 0.36, K.redD, 0, 2.1, -1.2); b.box(3.4, 0.06, 0.38, K.yel, 0, 1.94, -1.2);
  for (let i = 0; i < 7; i++) b.sph(0.05, K.bulb, -1.35 + i * 0.45, 2.12, -1.0, { glow: true, seg: 6, seg2: 4 });
  b.cyl(0.03, 0.03, 0.34, K.inkD, 0.75, 0.53, -0.8, { seg: 6 }); b.cyl(0.22, 0.25, 0.14, K.vio, 0.75, 0.66, -0.8, { seg: 12 }); b.cyl(0.23, 0.23, 0.02, K.yel, 0.75, 0.74, -0.8, { seg: 12 });
  b.cyl(0.1, 0.085, 0.17, 0x1c1c22, 0.75, 0.835, -0.8, { seg: 12 }); b.cyl(0.15, 0.15, 0.015, 0x1c1c22, 0.75, 0.925, -0.8, { seg: 12 }); b.cyl(0.102, 0.102, 0.03, K.red, 0.75, 0.9, -0.8, { seg: 12 });
  standInto(g, b, seats, 0, 0.3, 7, 2, K.red);
  g.add(b.mesh());
  const mg = actor({ shirt: 0x1c1c22, pants: 0x1c1c22, trim: 0xffffff, hair: 16, hairCol: 0x1c1c22, browCol: 0x3d2616, cape: K.red, shoe: 0x1c1c22, eye: 0x3f8fe0 });
  mg.group.position.set(-0.45, 0.36, -0.85); mg.group.scale.setScalar(1.15); g.add(mg.group);
  const wb = new Builder(); wb.cyl(0.006, 0.006, 0.16, 0x1c1c22, 0, -0.17, 0.04, { rx: 1.2, seg: 5 }); wb.cyl(0.0065, 0.0065, 0.03, 0xffffff, 0, -0.2, 0.115, { rx: 1.2, seg: 5 });
  const wand = wb.mesh(false); mg.foreR.add(wand);
  const rabbit = critter('rabbit', 0xffffff, 1.25); rabbit.position.set(0.75, 0.6, -0.8); g.add(rabbit);
  const cb = new Builder(); cb.box(0.09, 0.13, 0.008, 0xffffff, 0, 0, 0); cb.box(0.04, 0.05, 0.01, K.red, 0, 0, 0);
  const c0 = cb.mesh(false), cards = [c0, c0.clone(), c0.clone()]; cards.forEach((c) => g.add(c));
  let t = 0;
  return { group: g, seats, update(dt, r) {
    t += dt; const k = r.spin;
    rabbit.position.y = 0.6 + k * (0.3 + Math.max(0, Math.sin(t * 2.3)) * 0.14); rabbit.rotation.y = Math.sin(t * 1.4) * 0.6;
    mg.armR.rotation.x = lerp(0.05, -2.3 + Math.sin(t * 3.2) * 0.35, k); mg.foreR.rotation.x = lerp(-0.3, -0.5, k); mg.armL.rotation.x = lerp(0.05, -1.1, k); mg.foreL.rotation.x = lerp(-0.3, -1.0, k);
    mg.group.rotation.y = Math.sin(t * 0.7) * 0.35 * k; mg.head.rotation.y = Math.sin(t * 1.1) * 0.3;
    cards.forEach((c, i) => { const a = t * 2.4 + i * 2.1; c.scale.setScalar(k > 0.3 ? 1 : 0.001); c.position.set(-0.85 + Math.cos(a) * 0.2, 1.05 + Math.sin(a * 1.3) * 0.1, -0.7 + Math.sin(a) * 0.14); c.rotation.set(a, a * 0.7, 0); });
  } };
}

/* ----- animal show: two dogs through the hoop, a seal with a ball ----- */
function mAnimals() {
  const g = new T.Group(), b = new Builder(), seats = [], CZ = -0.6;
  plate(b, 4, 4, LAWN);
  b.cyl(1.32, 1.32, 0.05, SANDY, 0, 0.085, CZ, { seg: 24 });
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; b.box(0.5, 0.16, 0.12, i % 2 ? K.red : K.yel, Math.sin(a) * 1.34, 0.14, CZ + Math.cos(a) * 1.34, { ry: a }); }
  for (const [x, z] of [[-0.72, -1.05], [0.72, -1.05]]) { b.scyl(0.15, 0.2, 0.24, [K.blue, K.paper], 8, x, 0.23, z); b.cyl(0.16, 0.16, 0.03, K.yel, x, 0.36, z, { seg: 10 }); }
  b.tor(0.3, 0.03, K.ora, 0, 0.62, CZ + 0.98, { ry: Math.PI / 2, rs: 5, seg: 16 }); b.cyl(0.02, 0.02, 0.24, K.inkD, 0, 0.2, CZ + 0.98, { seg: 5 });
  for (const x of [-1.75, 1.75]) { b.cyl(0.03, 0.03, 1.6, K.paper, x, 0.86, -1.75, { seg: 6 }); b.sph(0.07, K.bulb, x, 1.7, -1.75, { glow: true, seg: 6, seg2: 4 }); }
  for (let i = 0; i < 9; i++) b.box(0.24, 0.16, 0.012, [K.red, K.yel, K.blue, K.mint][i % 4], -1.55 + i * 0.39, 1.5 - Math.sin(i / 8 * Math.PI) * 0.22, -1.75, { rz: Math.PI / 4 });
  standInto(g, b, seats, 0, 1.02, 8, 2, K.blue);
  g.add(b.mesh());
  const tr = actor({ shirt: 0xc8a96a, pants: 0x6b5a3a, trim: 0xfff6dc, hair: 5, hairCol: 0xe8cf8a, top: 0, shoe: 0x6b4a2a });
  tr.group.position.set(0.1, 0.11, CZ - 0.05); tr.group.scale.setScalar(1.1); g.add(tr.group);
  const dogs = [critter('dog', 0xd9a86c, 1.15), critter('dog', 0xfdfbf3, 1.0)]; dogs.forEach((d) => g.add(d));
  const seal = critter('seal', 0x6f7890, 1.1); seal.position.set(-0.72, 0.375, -1.05); seal.rotation.y = 0.5; g.add(seal);
  const bb = new Builder(); bb.sph(0.09, K.red, 0, 0, 0, { seg: 10, seg2: 7 }); bb.cyl(0.091, 0.091, 0.03, K.yel, 0, 0, 0, { seg: 10 });
  const ball = bb.mesh(false); g.add(ball);
  let t = rnd(10);
  return { group: g, seats, update(dt, r) {
    t += dt * (0.25 + 0.75 * r.spin); const k = r.spin;
    dogs.forEach((d, i) => {
      const a = t * 1.5 + i * Math.PI, da = Math.atan2(Math.sin(a), Math.cos(a)), up = Math.abs(da) < 0.6 ? Math.cos(da / 0.6 * Math.PI / 2) : 0;
      d.position.set(Math.sin(a) * 0.98, 0.11 + up * 0.5 * k + Math.abs(Math.sin(t * 9 + i)) * 0.02, CZ + Math.cos(a) * 0.98); d.rotation.y = a + Math.PI / 2; d.rotation.x = -Math.sin(da / 0.6 * Math.PI / 2) * 0.5 * (Math.abs(da) < 0.6 ? k : 0);
    });
    seal.rotation.z = Math.sin(t * 5) * 0.08 * k;
    ball.position.set(-0.68, 0.84 + Math.abs(Math.sin(t * 3.1)) * 0.3 * k, -0.9); ball.rotation.z = t * 3;
    tr.group.rotation.y = t * 0.6; tr.armR.rotation.x = lerp(0.05, -2.5 + Math.sin(t * 4) * 0.25, k); tr.foreR.rotation.x = lerp(-0.3, -0.35, k);
  } };
}

/* ----- freak show: a strongman, torches and a crystal ball in front of a striped tent ----- */
function mFreak() {
  const g = new T.Group(), b = new Builder(), seats = [], PU = 0x6f48d6;
  plate(b, 4, 3, 0x3a3052);
  for (let i = 0; i < 8; i++) b.box(0.42, 1.9, 0.08, i % 2 ? PU : K.yel, -1.47 + i * 0.42, 1.0, -1.38);
  for (let i = 0; i < 4; i++) b.cone(0.5, 0.55, i % 2 ? K.yel : PU, -1.26 + i * 0.84, 2.22, -1.34, { seg: 4, ry: Math.PI / 4 });
  for (const [x, c] of [[-1.15, K.red], [0, K.mint], [1.15, K.ora]]) { b.box(0.56, 0.76, 0.03, K.paper, x, 1.25, -1.32); b.box(0.5, 0.12, 0.035, K.ink, x, 0.96, -1.31); b.sph(0.16, c, x, 1.34, -1.3, { seg: 9, seg2: 6, sz: 0.2 }); }
  b.box(3.2, 0.26, 0.9, 0x6b4a2a, 0, 0.19, -0.85); b.box(3.2, 0.05, 0.04, K.yel, 0, 0.3, -0.39);
  for (const x of [-1.45, 1.45]) { b.cyl(0.03, 0.04, 0.8, K.inkD, x, 0.72, -0.5, { seg: 6 }); b.cyl(0.07, 0.04, 0.1, K.inkD, x, 1.15, -0.5, { seg: 7 }); }
  b.cyl(0.03, 0.03, 0.3, K.inkD, 0.85, 0.47, -0.85, { seg: 6 }); b.cyl(0.2, 0.2, 0.03, PU, 0.85, 0.63, -0.85, { seg: 10 }); b.cyl(0.07, 0.09, 0.05, K.yel, 0.85, 0.67, -0.85, { seg: 8 }); b.sph(0.11, 0x9ff0e0, 0.85, 0.8, -0.85, { glow: true, seg: 10, seg2: 7 });
  standInto(g, b, seats, 0, 0.3, 6, 2, PU);
  g.add(b.mesh());
  const sm = actor({ shirt: K.red, pants: 0x1c1c22, trim: K.yel, hair: -1, top: 1, skin: 0xf1c39a, mouth: 0, shoe: 0x1c1c22 });
  sm.group.position.set(-0.45, 0.32, -0.85); sm.group.scale.set(1.5, 1.3, 1.5); g.add(sm.group);
  const bar = new Builder(); bar.cyl(0.012, 0.012, 0.74, K.stoneD, 0, 0, 0, { rz: Math.PI / 2, seg: 6 }); for (const x of [-0.37, 0.37]) { bar.sph(0.13, 0x2b2b33, x, 0, 0, { seg: 10, seg2: 7 }); bar.cyl(0.05, 0.05, 0.04, K.stone, x * 0.78, 0, 0, { rz: Math.PI / 2, seg: 8 }); }
  const bell = bar.mesh(false); g.add(bell);
  const fb = new Builder(); fb.cone(0.07, 0.26, K.ora, 0, 0.13, 0, { seg: 6 }); fb.cone(0.04, 0.16, K.yel, 0, 0.1, 0, { seg: 5, glow: true });
  const f0 = fb.mesh(false), flames = [f0, f0.clone()]; flames.forEach((f, i) => { f.position.set(i ? 1.45 : -1.45, 1.2, -0.5); g.add(f); });
  let t = 0;
  return { group: g, seats, update(dt, r) {
    t += dt; const k = r.spin, lift = k * (0.5 + 0.5 * Math.sin(t * 1.6));
    sm.armL.rotation.x = sm.armR.rotation.x = lerp(-0.9, -2.95, lift); sm.foreL.rotation.x = sm.foreR.rotation.x = lerp(-1.5, -0.12, lift);
    bell.position.set(-0.45, 0.32 + lerp(0.52, 1.0, lift), -0.85 + lerp(0.13, 0.03, lift));
    flames.forEach((f, i) => { const s = 0.7 + 0.3 * Math.sin(t * 13 + i * 2) + k * 0.5; f.scale.set(0.8 + k * 0.4, s, 0.8 + k * 0.4); });
  } };
}

/* ----- dolphin show and orca show: a pool behind glass-blue walls, leaps and a splash ----- */
function mSeaShow(orca) {
  const g = new T.Group(), b = new Builder(), seats = [], W = orca ? 6 : 5, PW = W - 0.5, PZ = -0.78, WY = 0.39;
  plate(b, W, 4, 0xdfe7ee);
  poolInto(b, 0, PZ, PW, 2.1, 0.3);
  b.box(1.5, 0.14, 0.4, 0xf2f6fb, 0, WY + 0.05, PZ - 0.8); b.box(1.5, 0.03, 0.4, K.blue, 0, WY + 0.13, PZ - 0.8);
  b.cyl(0.07, 0.06, 0.12, K.stone, 0.5, WY + 0.2, PZ - 0.8, { seg: 8 }); b.sph(0.1, K.yel, -0.45, WY + 0.24, PZ - 0.8, { seg: 9, seg2: 6 }); b.cyl(0.101, 0.101, 0.03, K.red, -0.45, WY + 0.24, PZ - 0.8, { seg: 9 });
  if (!orca) for (const x of [-1.05, 1.05]) { b.tor(0.33, 0.03, x < 0 ? K.red : K.yel, x, WY + 0.72, PZ, { ry: Math.PI / 2, rs: 5, seg: 18 }); b.cyl(0.02, 0.02, 0.42, K.paper, x, WY + 0.2, PZ, { seg: 5 }); }
  for (const x of [-PW / 2 + 0.1, PW / 2 - 0.1]) { b.cyl(0.03, 0.03, 1.5, K.paper, x, 0.8, PZ - 1.0, { seg: 6 }); b.box(0.36, 0.2, 0.02, orca ? K.ink : K.mint, x + (x < 0 ? 0.2 : -0.2), 1.42, PZ - 1.0); }
  for (let i = 0; i < 5; i++) b.sph(0.05, i % 2 ? K.red : K.paper, -PW / 2 + 0.5 + i * (PW - 1) / 4, WY + 0.02, PZ + 0.9, { seg: 6, seg2: 4 });
  standInto(g, b, seats, 0, 0.78, orca ? 11 : 9, 2, orca ? K.ink : K.blue);
  g.add(b.mesh());
  const fish = orca ? [critter('orca', 0, 1.15)] : [critter('dolphin', 0, 1.2), critter('dolphin', 0, 1.05)];
  fish.forEach((f) => { f.rotation.order = 'YXZ'; g.add(f); });
  const s0 = splashMesh(8, 0.3, 0.6, 0.1), spl = fish.map((f, i) => { const m = i ? s0.clone() : s0; m.scale.setScalar(0.001); g.add(m); return { m, k: 0 }; });
  const R = PW / 2 - (orca ? 0.75 : 0.55), prev = fish.map(() => ({ x: 0, y: WY, air: false }));
  let t = rnd(10);
  return { group: g, seats, update(dt, r) {
    t += dt * (0.3 + 0.7 * r.spin);
    fish.forEach((f, i) => {
      const a = t * (orca ? 0.9 : 1.25) + i * Math.PI, x = Math.cos(a) * R, p = prev[i], J = (orca ? 1.15 : 0.82) * r.spin;
      const d = orca ? x / 0.95 : (Math.abs(x) - 1.05) / 0.6, up = Math.abs(d) < 1 ? 1 - d * d : 0, y = WY - 0.07 + up * J + Math.sin(t * 3 + i) * 0.015;
      f.position.set(x, y, PZ + (orca ? 0.1 : (i ? 0.28 : -0.28)));
      f.rotation.y = x > p.x ? Math.PI / 2 : -Math.PI / 2; f.rotation.x = -Math.atan2(y - p.y, Math.abs(x - p.x) + 1e-4) * 0.9;
      const air = y > WY + 0.12; if (p.air && !air) { spl[i].k = 1; spl[i].m.position.set(x, WY, f.position.z); } p.air = air; p.x = x; p.y = y;
      const s = spl[i]; if (s.k > 0) { s.k = Math.max(0, s.k - dt * 1.6); const q = Math.sin(s.k * Math.PI), w = (orca ? 1.6 : 0.9) * (1.2 - s.k * 0.5); if (s.k > 0) s.m.scale.set(w, 0.05 + q * (orca ? 1.6 : 0.9), w); else s.m.scale.setScalar(0.001); }
    });
  } };
}

/* ----- circus: the big top; the audience disappears inside ----- */
function mCircus() {
  const g = new T.Group(), b = new Builder(), CZ = -0.2;
  plate(b, 5, 5, 0xd9c7a0);
  b.scyl(2.0, 2.0, 1.2, [K.red, K.paper], 16, 0, 0.66, CZ); b.scone(2.28, 1.5, [K.red, K.paper], 16, 0, 2.0, CZ); b.cone(0.55, 0.5, K.yel, 0, 2.92, CZ, { seg: 12 });
  b.tor(2.06, 0.07, K.yel, 0, 1.27, CZ, { rx: Math.PI / 2, rs: 5, seg: 32 });
  for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; b.sph(0.05, K.bulb, Math.sin(a) * 2.14, 1.34, CZ + Math.cos(a) * 2.14, { glow: true, seg: 6, seg2: 4 }); }
  for (const x of [-0.75, 0.75]) b.cyl(0.035, 0.035, 1.2, K.inkD, x, 3.2, CZ, { seg: 6 });
  // the entrance with its sign
  b.box(0.9, 0.95, 0.12, K.inkD, 0, 0.53, 1.78); for (const x of [-0.56, 0.56]) b.box(0.24, 1.0, 0.16, K.redD, x, 0.56, 1.82, { rz: x < 0 ? -0.12 : 0.12 });
  b.box(1.6, 0.4, 0.1, K.ink, 0, 1.36, 1.92); b.box(1.7, 0.06, 0.14, K.yel, 0, 1.59, 1.92); for (let i = 0; i < 6; i++) b.sph(0.045, K.bulb, -0.66 + i * 0.264, 1.36, 1.99, { glow: true, seg: 6, seg2: 4 });
  for (const x of [-0.78, 0.78]) b.cyl(0.03, 0.03, 1.2, K.yel, x, 0.65, 1.95, { seg: 6 });
  // a ticket wagon and a few crates
  b.box(0.8, 0.5, 0.46, K.blue, -1.85, 0.47, 1.98); b.box(0.86, 0.06, 0.52, K.yel, -1.85, 0.75, 1.98); b.box(0.36, 0.2, 0.03, K.paper, -1.85, 0.5, 2.22); for (const x of [-2.12, -1.58]) b.cyl(0.11, 0.11, 0.05, K.inkD, x, 0.16, 2.22, { rx: Math.PI / 2, seg: 10 });
  b.box(0.3, 0.3, 0.3, K.wood, 1.9, 0.21, 2.0); b.box(0.24, 0.24, 0.24, K.woodD, 1.6, 0.18, 2.1, { ry: 0.5 }); b.sph(0.16, K.red, 2.0, 0.23, 1.6, { seg: 10, seg2: 7 }); b.cyl(0.161, 0.161, 0.05, K.paper, 2.0, 0.23, 1.6, { seg: 10 });
  g.add(b.mesh());
  const fb = new Builder(); fb.box(0.4, 0.2, 0.015, K.yel, 0.2, 0, 0); fb.box(0.12, 0.2, 0.016, K.red, 0.34, 0, 0);
  const f0 = fb.mesh(false), flags = [f0, f0.clone()]; flags.forEach((f, i) => { f.position.set(i ? 0.75 : -0.75, 3.68, CZ); g.add(f); });
  let t = rnd(10);
  return { group: g, seats: [], update(dt) { t += dt; flags.forEach((f, i) => { f.rotation.y = Math.sin(t * 2.2 + i) * 0.5; f.rotation.z = Math.sin(t * 5 + i * 2) * 0.06; }); } };
}
