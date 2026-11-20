/* ================= restaurants, shops and the high striker ================= */

/* ----- restaurant: a kitchen at the back, tables under parasols in front; guests eat at the tables ----- */
function mRestaurant(kind) {
  const g = new T.Group(), b = new Builder(), seats = [];
  const C = { pizza: [K.red, K.paper, 0xd9c7a0], steak: [0x8a3b24, 0xcaa56f, 0x8a8fa8], vegan: [0x55c26a, K.paper, 0xcfe3c0], fish: [K.blue, 0xf2f6fb, 0xbfd9e6] }[kind], c1 = C[0], Z = -0.6;
  plate(b, 3, 2, C[2]);
  b.box(2.7, 0.9, 0.62, C[1], 0, 0.51, Z); b.box(2.84, 0.12, 0.76, c1, 0, 1.02, Z); b.box(2.6, 0.06, 0.6, K.paper, 0, 1.1, Z);
  b.box(1.0, 0.38, 0.03, 0x2b2b33, -0.5, 0.64, Z + 0.315); b.box(1.1, 0.05, 0.18, K.paper, -0.5, 0.43, Z + 0.36); b.box(0.34, 0.7, 0.03, K.woodD, 0.85, 0.41, Z + 0.315); b.sph(0.02, K.yel, 0.74, 0.42, Z + 0.34, { seg: 5, seg2: 4 });
  for (let i = 0; i < 9; i++) b.box(0.3, 0.04, 0.36, i % 2 ? c1 : K.paper, -1.2 + i * 0.3, 0.97, Z + 0.46, { rx: 0.42 });
  for (const x of [-0.82, -0.5, -0.18]) b.sph(0.045, K.bulb, x, 0.86, Z + 0.33, { glow: true, seg: 6, seg2: 4 });
  const Y = 1.52;
  if (kind === 'pizza') {
    b.cyl(0.4, 0.4, 0.05, 0xe0a860, 0, Y, Z, { rx: Math.PI / 2, seg: 18 }); b.cyl(0.34, 0.34, 0.06, 0xd9432f, 0, Y, Z, { rx: Math.PI / 2, seg: 18 }); b.cyl(0.31, 0.31, 0.07, 0xffe08a, 0, Y, Z, { rx: Math.PI / 2, seg: 18 });
    for (const [x, y] of [[0.12, 0.1], [-0.14, 0.08], [0.02, -0.14], [-0.1, -0.1], [0.17, -0.08], [0, 0.2]]) b.cyl(0.055, 0.055, 0.08, 0xb9243a, x, Y + y, Z, { rx: Math.PI / 2, seg: 8 });
    for (const [x, y] of [[-0.02, 0.02], [0.2, 0.05], [-0.2, -0.02]]) b.sph(0.03, 0x3d9a45, x, Y + y, Z + 0.04, { seg: 5, seg2: 4, sz: 0.4 });
  } else if (kind === 'steak') {
    b.sph(1, 0xf2d9c4, 0, Y, Z - 0.01, { sx: 0.44, sy: 0.3, sz: 0.06, seg: 12, seg2: 6 }); b.sph(1, 0x9b3a2a, 0.02, Y, Z + 0.01, { sx: 0.38, sy: 0.24, sz: 0.07, seg: 12, seg2: 6 });
    b.box(0.3, 0.05, 0.1, 0xfff6dc, -0.06, Y + 0.02, Z + 0.04, { rz: 0.5 }); b.box(0.05, 0.2, 0.1, 0xfff6dc, -0.12, Y + 0.02, Z + 0.04, { rz: 0.5 });
    for (let i = 0; i < 3; i++) b.box(0.3, 0.025, 0.02, 0x4a1e14, 0.08, Y - 0.1 + i * 0.09, Z + 0.075, { rz: -0.4 });
    for (const x of [-0.9, 0.9]) { b.cone(0.08, 0.28, K.ora, x, 1.26, Z, { seg: 6 }); b.cone(0.045, 0.18, K.yel, x, 1.23, Z, { seg: 5, glow: true }); }
  } else if (kind === 'vegan') {
    b.cone(0.16, 0.66, K.ora, 0.08, Y - 0.04, Z, { rz: 2.5, seg: 9 }); for (let i = 0; i < 3; i++) b.box(0.2, 0.014, 0.03, 0xc96a14, 0.02 + i * 0.07, Y - 0.14 + i * 0.1, Z + 0.1, { rz: -0.6 });
    for (const rz of [0.2, 0.75, 1.3]) b.cone(0.06, 0.34, 0x3d9a45, -0.2 - Math.cos(rz) * 0.1, Y + 0.3 + Math.sin(rz) * 0.05, Z, { rz, seg: 5 });
    for (const x of [-0.85, 0.85]) b.sph(1, 0x55c26a, x, 1.3, Z, { sx: 0.2, sy: 0.12, sz: 0.04, seg: 8, seg2: 5, rz: x < 0 ? 0.5 : -0.5 });
  } else {
    b.sph(1, 0x5aa9f0, 0.06, Y, Z, { sx: 0.4, sy: 0.2, sz: 0.08, seg: 12, seg2: 7 }); b.cone(0.2, 0.26, 0x5aa9f0, -0.46, Y, Z, { rz: -Math.PI / 2, seg: 4, sz: 0.3 });
    b.cone(0.1, 0.16, K.blue, 0.05, Y + 0.24, Z, { seg: 4, sz: 0.3 }); b.sph(0.045, 0xffffff, 0.28, Y + 0.05, Z + 0.06, { seg: 6, seg2: 4 }); b.sph(0.022, 0x1b1530, 0.29, Y + 0.05, Z + 0.1, { seg: 5, seg2: 3 });
    for (let i = 0; i < 6; i++) b.tor(0.11, 0.022, 0xdff3ff, -1.05 + i * 0.42, 1.2, Z + 0.2, { rs: 4, seg: 8 });
  }
  for (const x of [-1.0, 0, 1.0]) {
    const tz = 0.42;
    b.cyl(0.03, 0.05, 0.3, K.inkD, x, 0.21, tz, { seg: 6 }); b.cyl(0.22, 0.22, 0.03, K.paper, x, 0.37, tz, { seg: 12 }); b.cyl(0.015, 0.015, 0.95, K.paper, x, 0.85, tz, { seg: 5 }); b.scone(0.5, 0.22, [c1, K.paper], 8, x, 1.36, tz);
    b.cyl(0.05, 0.05, 0.015, c1, x - 0.08, 0.39, tz + 0.04, { seg: 8 }); b.cyl(0.05, 0.05, 0.015, c1, x + 0.08, 0.39, tz - 0.03, { seg: 8 });
    for (const [dx, dz, ry] of [[-0.34, 0, Math.PI / 2], [0.34, 0, -Math.PI / 2], [0, 0.34, Math.PI]]) {
      const cx = x + dx, cz = tz + dz; b.box(0.17, 0.03, 0.17, K.wood, cx, 0.27, cz); b.box(dx ? 0.03 : 0.17, 0.2, dx ? 0.17 : 0.03, K.wood, cx + Math.sign(dx) * 0.085, 0.38, cz + Math.sign(dz) * 0.085);
      for (const lx of [-0.065, 0.065]) for (const lz of [-0.065, 0.065]) b.box(0.025, 0.22, 0.025, K.woodD, cx + lx, 0.16, cz + lz);
      const s = seatAt(g, cx, 0.285, cz, ry); s.userData.pose = 'eat'; seats.push(s);
    }
  }
  g.add(b.mesh());
  return { group: g, seats };
}

/* ----- a small shop with a display window: hats or costumes ----- */
function mStore(kind) {
  const g = new T.Group(), b = new Builder(), hat = kind === 'hat', c1 = hat ? K.teal : 0x6f48d6, Z = -0.12;
  b.box(1.84, 0.05, 0.84, K.stoneD, 0, 0.025, 0);
  b.box(1.7, 0.95, 0.5, K.paper, 0, 0.525, Z); b.box(1.8, 0.1, 0.6, c1, 0, 1.05, Z); b.box(1.6, 0.05, 0.44, K.paper, 0, 1.12, Z);
  b.box(1.06, 0.52, 0.03, 0xcfeaff, -0.22, 0.6, Z + 0.255); b.box(1.12, 0.05, 0.05, c1, -0.22, 0.87, Z + 0.26); b.box(1.12, 0.05, 0.05, c1, -0.22, 0.33, Z + 0.26);
  b.box(0.32, 0.68, 0.03, K.woodD, 0.6, 0.39, Z + 0.255); b.sph(0.02, K.yel, 0.5, 0.4, Z + 0.28, { seg: 5, seg2: 4 });
  for (let i = 0; i < 8; i++) b.box(0.225, 0.04, 0.36, i % 2 ? c1 : K.paper, -0.79 + i * 0.225, 0.98, Z + 0.4, { rx: 0.4 });
  if (hat) {
    b.cyl(0.2, 0.18, 0.32, 0x1c1c22, 0, 1.36, Z, { seg: 14 }); b.cyl(0.32, 0.32, 0.03, 0x1c1c22, 0, 1.2, Z, { seg: 14 }); b.cyl(0.205, 0.19, 0.07, K.red, 0, 1.26, Z, { seg: 14 });
    for (const [x, k] of [[-0.55, 0], [-0.22, 1], [0.1, 2]]) {
      b.cyl(0.012, 0.012, 0.2, K.inkD, x, 0.45, Z + 0.3, { seg: 4 }); b.sph(0.07, 0xf1c39a, x, 0.6, Z + 0.3, { seg: 8, seg2: 6 });
      if (k === 0) { b.cone(0.06, 0.16, K.pink, x, 0.74, Z + 0.3, { seg: 8 }); b.sph(0.022, K.yel, x, 0.83, Z + 0.3, { seg: 5, seg2: 4 }); }
      else if (k === 1) { b.cyl(0.06, 0.07, 0.07, 0x9b6a4a, x, 0.68, Z + 0.3, { seg: 9 }); b.cyl(0.13, 0.13, 0.012, 0x9b6a4a, x, 0.645, Z + 0.3, { seg: 10 }); }
      else { b.cyl(0.085, 0.085, 0.04, K.yel, x, 0.67, Z + 0.3, { seg: 9 }); for (let i = 0; i < 5; i++) b.cone(0.02, 0.05, K.yel, x + Math.cos(i * 1.257) * 0.07, 0.71, Z + 0.3 + Math.sin(i * 1.257) * 0.07, { seg: 4 }); }
    }
  } else {
    b.cyl(0.24, 0.24, 0.1, K.yel, 0, 1.26, Z, { seg: 12 }); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; b.cone(0.06, 0.16, K.yel, Math.cos(a) * 0.2, 1.38, Z + Math.sin(a) * 0.2, { seg: 4 }); b.sph(0.03, i % 2 ? K.red : K.mint, Math.cos(a) * 0.245, 1.27, Z + Math.sin(a) * 0.245, { seg: 5, seg2: 4 }); }
    b.cyl(0.3, 0.3, 0.05, K.vio, 0, 1.18, Z, { seg: 12 });
    for (const [x, c] of [[-0.5, K.red], [-0.05, K.vio]]) {
      b.cyl(0.012, 0.012, 0.14, K.inkD, x, 0.4, Z + 0.3, { seg: 4 }); b.cone(0.12, 0.3, c, x, 0.55, Z + 0.3, { seg: 8 }); b.sph(0.055, 0xf1c39a, x, 0.74, Z + 0.3, { seg: 8, seg2: 6 });
      if (c === K.vio) b.cone(0.06, 0.16, K.vio, x, 0.85, Z + 0.3, { seg: 7 }); else b.cyl(0.05, 0.05, 0.025, K.yel, x, 0.795, Z + 0.3, { seg: 8 });
    }
  }
  g.add(b.mesh());
  return { group: g, seats: [] };
}

/* ----- high striker: hit the pad, send the puck up the tower, ring the bell ----- */
function mLukas() {
  const g = new T.Group(), b = new Builder(), X = 0.16, Z = -0.28;
  b.box(0.9, 0.05, 0.9, K.stoneD, 0, 0.025, 0);
  b.box(0.28, 2.3, 0.08, K.red, X, 1.2, Z); for (let i = 0; i < 8; i++) b.box(0.22, 0.035, 0.085, i % 2 ? K.paper : K.yel, X, 0.42 + i * 0.25, Z);
  b.box(0.045, 2.1, 0.09, K.inkD, X, 1.2, Z + 0.005); b.box(0.36, 0.1, 0.12, K.yel, X, 2.38, Z); b.sph(0.11, K.yel, X, 2.56, Z, { seg: 10, seg2: 7 }); b.cyl(0.12, 0.12, 0.025, K.ora, X, 2.5, Z, { seg: 10 });
  b.sph(0.045, K.bulb, X, 2.72, Z, { glow: true, seg: 6, seg2: 4 });
  b.box(0.34, 0.14, 0.34, K.inkD, X, 0.12, 0.08); b.cyl(0.11, 0.11, 0.05, K.red, X, 0.215, 0.08, { seg: 10 });
  b.cyl(0.018, 0.018, 0.5, K.wood, -0.14, 0.3, 0.26, { rz: 0.5, seg: 5 }); b.cyl(0.07, 0.07, 0.16, K.woodD, -0.26, 0.5, 0.26, { rz: 0.5 + Math.PI / 2, seg: 8 });
  b.box(0.36, 0.56, 0.2, K.wood, -0.26, 0.33, Z); b.box(0.4, 0.03, 0.24, K.woodD, -0.26, 0.62, Z); b.box(0.4, 0.03, 0.24, K.woodD, -0.26, 0.36, Z);
  for (const [x, y, c] of [[-0.34, 0.69, 0xb5651d], [-0.18, 0.69, K.pink], [-0.26, 0.43, 0xffffff]]) { b.sph(0.05, c, x, y, Z + 0.04, { seg: 7, seg2: 5 }); b.sph(0.038, c, x, y + 0.065, Z + 0.05, { seg: 7, seg2: 5 }); for (const s of [-1, 1]) b.sph(0.015, c, x + s * 0.03, y + 0.1, Z + 0.05, { seg: 4, seg2: 3 }); }
  g.add(b.mesh());
  const pb = new Builder(); pb.box(0.12, 0.07, 0.06, K.mint, 0, 0, 0);
  const puck = pb.mesh(false); puck.position.set(X, 0.32, Z + 0.06); g.add(puck);
  let vy = 0;
  return { group: g, seats: [],
    // how hard the hit was: 0 … 1; at 1 the puck reaches the bell
    play(p) { vy = Math.sqrt(2 * 9 * 2.02 * clamp(p, 0.15, 1)) + 0.01; },
    update(dt) {
      if (!vy && puck.position.y <= 0.32) return;
      puck.position.y += vy * dt; vy -= 9 * dt;
      if (puck.position.y >= 2.3) { puck.position.y = 2.3; if (vy > 0) { vy = -0.4; sfxAt('bell', g.position.x, g.position.z, 0.9); } }
      if (puck.position.y <= 0.32) { puck.position.y = 0.32; vy = 0; }
    } };
}
