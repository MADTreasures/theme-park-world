/* ================= booths ================= */
function mShop(kind) {
  const g = new T.Group(), b = new Builder();
  const C = { fries: [K.red, K.yel], burger: [K.ora, K.paper], drink: [K.blue, K.paper], ice: [K.pink, K.paper], balloon: [K.vio, K.yel], throw: [K.teal, K.yel],
    wurst: [K.redD, K.paper], brezel: [K.woodD, K.paper], doener: [K.teal, K.yel], candy: [K.pink, K.mint], marroni: [0x6b3a2a, K.ora], cotton: [0x7cc4e6, K.pink] }[kind];
  b.box(0.9, 0.05, 0.9, K.stoneD, 0, 0.025, 0);
  b.box(0.76, 0.36, 0.5, C[0], 0, 0.23, -0.1);
  b.box(0.8, 0.04, 0.3, K.paper, 0, 0.43, 0.2);
  b.box(0.76, 0.5, 0.06, C[0], 0, 0.66, -0.33);
  b.box(0.05, 0.9, 0.05, K.paper, -0.36, 0.5, 0.33); b.box(0.05, 0.9, 0.05, K.paper, 0.36, 0.5, 0.33);
  for (let i = 0; i < 6; i++) b.box(0.15, 0.04, 0.98, i % 2 ? C[1] : C[0], -0.375 + i * 0.15, 0.98, 0.03, { rx: 0.2 });
  const z = -0.12;
  if (kind === 'fries') {
    b.box(0.3, 0.26, 0.16, K.red, 0, 1.24, z); b.box(0.305, 0.06, 0.165, K.paper, 0, 1.24, z);
    for (let i = 0; i < 6; i++) b.box(0.04, 0.3, 0.04, K.yel, -0.11 + i * 0.044, 1.46 + (i % 2) * 0.05, z + (i % 3 - 1) * 0.03, { rz: (2.5 - i) * 0.1 });
  } else if (kind === 'burger') {
    b.cyl(0.2, 0.18, 0.08, 0xd9a25c, 0, 1.15, z, { seg: 12 }); b.cyl(0.215, 0.215, 0.06, 0x6b3a2a, 0, 1.22, z, { seg: 12 });
    b.box(0.36, 0.02, 0.36, K.yel, 0, 1.255, z, { ry: 0.5 }); b.cyl(0.225, 0.225, 0.025, 0x5cb85c, 0, 1.275, z, { seg: 12 });
    b.sph(0.21, 0xd9a25c, 0, 1.29, z, { sy: 0.62, seg: 12 });
  } else if (kind === 'drink') {
    b.cyl(0.15, 0.11, 0.36, K.paper, 0, 1.28, z, { seg: 12 }); b.cyl(0.146, 0.127, 0.12, K.blue, 0, 1.3, z, { seg: 12, sx: 1.03, sz: 1.03 });
    b.cyl(0.16, 0.16, 0.03, K.blue, 0, 1.475, z, { seg: 12 }); b.cyl(0.015, 0.015, 0.3, K.red, 0.05, 1.6, z, { rz: -0.25, seg: 5 });
  } else if (kind === 'ice') {
    b.cone(0.13, 0.34, 0xe0a860, 0, 1.27, z, { rx: Math.PI, seg: 10 }); b.sph(0.14, K.pink, 0, 1.5, z); b.sph(0.12, K.paper, 0.02, 1.66, z); b.sph(0.04, K.red, 0.03, 1.79, z, { seg: 6, seg2: 4 });
  } else if (kind === 'throw') {
    for (const [cx, cy] of [[-0.11, 1.13], [0, 1.13], [0.11, 1.13], [-0.055, 1.235], [0.055, 1.235], [0, 1.34]]) { b.cyl(0.05, 0.05, 0.1, K.stone, cx, cy, z, { seg: 8 }); b.cyl(0.052, 0.052, 0.03, K.red, cx, cy, z, { seg: 8 }); }
    b.sph(0.05, K.yel, 0.24, 1.12, z + 0.1, { seg: 7, seg2: 5 });
  } else if (kind === 'wurst') {
    b.sph(1, 0xe0a860, 0, 1.2, z, { sx: 0.32, sy: 0.07, sz: 0.12, seg: 10, seg2: 6 }); b.cyl(0.055, 0.055, 0.6, 0xb5482f, 0, 1.275, z, { rz: Math.PI / 2, seg: 8 });
    for (const x of [-0.3, 0.3]) b.sph(0.055, 0xb5482f, x, 1.275, z, { seg: 8, seg2: 5 });
    for (let i = 0; i < 7; i++) b.box(0.07, 0.022, 0.03, K.yel, -0.21 + i * 0.07, 1.335, z + (i % 2 ? 0.018 : -0.018), { ry: i % 2 ? 0.7 : -0.7 });
  } else if (kind === 'brezel') {
    const P = 0xb5651d;
    b.tor(0.22, 0.04, P, 0, 1.36, z, { rs: 6, seg: 18 }); b.cyl(0.036, 0.036, 0.36, P, -0.07, 1.33, z + 0.02, { rz: -0.62, seg: 6 }); b.cyl(0.036, 0.036, 0.36, P, 0.07, 1.33, z + 0.02, { rz: 0.62, seg: 6 });
    for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; b.sph(0.016, 0xffffff, Math.cos(a) * 0.22, 1.36 + Math.sin(a) * 0.22, z + 0.04, { seg: 4, seg2: 3 }); }
  } else if (kind === 'doener') {
    b.cyl(0.2, 0.2, 0.03, K.stone, 0, 1.14, z, { seg: 12 }); b.cyl(0.012, 0.012, 0.66, K.stoneD, 0, 1.46, z, { seg: 5 }); b.cyl(0.18, 0.1, 0.42, 0xa5673f, 0, 1.4, z, { seg: 10 });
    for (let i = 0; i < 3; i++) b.cyl(0.165 - i * 0.02, 0.15 - i * 0.02, 0.03, 0x7a4526, 0, 1.53 - i * 0.12, z, { seg: 10 });
    b.sph(0.05, K.red, 0, 1.66, z, { seg: 7, seg2: 5 }); b.box(0.03, 0.4, 0.03, K.stoneD, 0.24, 1.36, z);
  } else if (kind === 'candy') {
    b.cyl(0.012, 0.012, 0.42, K.paper, 0, 1.24, z, { seg: 5 });
    for (let i = 0; i < 4; i++) b.cyl(0.21 - i * 0.052, 0.21 - i * 0.052, 0.05 + i * 0.006, i % 2 ? K.paper : K.pink, 0, 1.58, z, { rx: Math.PI / 2, seg: 14 });
    for (const [x, c] of [[-0.27, K.mint], [0.27, K.yel]]) { b.sph(0.06, c, x, 1.17, z + 0.1, { seg: 7, seg2: 5 }); b.cone(0.045, 0.07, c, x - 0.085, 1.17, z + 0.1, { rz: -Math.PI / 2, seg: 5 }); b.cone(0.045, 0.07, c, x + 0.085, 1.17, z + 0.1, { rz: Math.PI / 2, seg: 5 }); }
  } else if (kind === 'marroni') {
    b.cyl(0.25, 0.2, 0.13, 0x2b2b33, 0, 1.17, z, { seg: 12 }); b.cyl(0.26, 0.26, 0.02, K.stoneD, 0, 1.24, z, { seg: 12 });
    for (let i = 0; i < 8; i++) { const a = i * 0.8, r = i < 6 ? 0.14 : 0.04; b.sph(0.055, 0x6b3a1e, Math.cos(a) * r, 1.28 + (i < 6 ? 0 : 0.06), z + Math.sin(a) * r, { seg: 7, seg2: 5, sy: 0.85 }); b.sph(0.025, 0xc79a5e, Math.cos(a) * r, 1.315 + (i < 6 ? 0 : 0.06), z + Math.sin(a) * r, { seg: 5, seg2: 3, sy: 0.5 }); }
    b.cone(0.09, 0.22, K.paper, 0.3, 1.2, z + 0.12, { rx: Math.PI, seg: 8 }); for (const dx of [-0.03, 0.03, 0]) b.sph(0.04, 0x6b3a1e, 0.3 + dx, 1.33 + (dx ? 0 : 0.04), z + 0.12, { seg: 6, seg2: 4 });
  } else if (kind === 'cotton') {
    b.cone(0.035, 0.32, K.paper, -0.06, 1.22, z, { rx: Math.PI, seg: 6 });
    for (const [x, y, r] of [[-0.06, 1.5, 0.16], [-0.17, 1.44, 0.1], [0.05, 1.44, 0.1], [-0.06, 1.63, 0.1], [-0.12, 1.58, 0.09], [0.0, 1.58, 0.09]]) b.sph(r, 0xffb3d9, x, y, z, { seg: 8, seg2: 6 });
    b.cone(0.025, 0.24, K.paper, 0.26, 1.18, z + 0.08, { rx: Math.PI, seg: 6 }); for (const [x, y, r] of [[0.26, 1.38, 0.1], [0.2, 1.34, 0.07], [0.32, 1.34, 0.07], [0.26, 1.46, 0.07]]) b.sph(r, 0x9fd8ff, x, y, z + 0.08, { seg: 7, seg2: 5 });
  } else {
    const cols = [K.red, K.yel, K.blue, K.mint, K.pink, K.ora];
    for (let i = 0; i < 6; i++) {
      const bx = (i % 3 - 1) * 0.17 + rnd(-0.03, 0.03), by = 1.5 + (i % 2) * 0.2 + rnd(0.05), bz = z + (i < 3 ? -0.08 : 0.1);
      b.sph(0.12, cols[i], bx, by, bz, { sy: 1.15 }); b.cyl(0.006, 0.006, by - 1.08, K.inkD, bx * 0.5, (by + 1.08) / 2, bz * 0.6 + z * 0.4, { seg: 3, rz: bx * 0.9 });
    }
  }
  g.add(b.mesh());
  return { group: g, seats: [] };
}
function mWC() {
  const g = new T.Group(), b = new Builder();
  b.box(0.9, 0.05, 0.9, K.stoneD, 0, 0.025, 0);
  b.box(0.8, 0.85, 0.66, K.paper, 0, 0.47, -0.05); b.box(0.8, 0.2, 0.3, K.paper, 0, 0.96, -0.05);
  b.box(0.94, 0.05, 0.52, K.teal, 0, 1.02, -0.27, { rx: -0.5 }); b.box(0.94, 0.05, 0.52, K.teal, 0, 1.02, 0.17, { rx: 0.5 });
  b.box(0.26, 0.52, 0.03, K.blue, -0.19, 0.31, 0.285); b.box(0.26, 0.52, 0.03, K.pink, 0.19, 0.31, 0.285);
  b.cyl(0.05, 0.05, 0.02, K.blue, -0.19, 0.7, 0.285, { rx: Math.PI / 2, seg: 8 }); b.cyl(0.05, 0.05, 0.02, K.pink, 0.19, 0.7, 0.285, { rx: Math.PI / 2, seg: 8 });
  g.add(b.mesh());
  return { group: g, seats: [] };
}

/* ================= decoration ================= */
const deco1 = (fn) => () => { const b = new Builder(); fn(b, 0, 0, 1); return { group: b.mesh() }; };
function mLamp() {
  const b = new Builder(); addLamp(b, 0, 0); const g = b.mesh();
  const gl = new T.Mesh(new T.PlaneGeometry(6.6, 6.6), MAT_LAMP); gl.rotation.x = -Math.PI / 2; gl.position.y = 0.09; gl.renderOrder = 2; g.add(gl);
  return { group: g };
}
function mFountain() {
  const g = new T.Group(), b = new Builder(), WAT = 0x4cc3f0;
  b.cyl(0.92, 0.96, 0.28, K.stone, 0, 0.14, 0, { seg: 16 }); b.cyl(0.8, 0.8, 0.02, WAT, 0, 0.285, 0, { seg: 16 });
  b.cyl(0.1, 0.15, 0.8, K.stone, 0, 0.6, 0); b.cyl(0.42, 0.12, 0.14, K.stone, 0, 0.98, 0, { seg: 12 }); b.cyl(0.36, 0.36, 0.02, WAT, 0, 1.055, 0, { seg: 12 });
  g.add(b.mesh());
  const j = new Builder(); j.cone(0.2, 0.6, 0xbfeaff, 0, 0.3, 0, { rx: Math.PI, seg: 8 }); j.sph(0.09, 0xe6f7ff, 0, 0.62, 0);
  const jet = j.mesh(false); jet.position.y = 1.05; g.add(jet);
  return { group: g, update(dt, t) { jet.scale.y = 1 + 0.18 * Math.sin(t * 7); jet.scale.x = jet.scale.z = 1 + 0.1 * Math.sin(t * 5 + 1); } };
}
function mPathThumb() {
  const b = new Builder();
  for (const [x, z] of [[-1, 0], [0, 0], [1, 0], [0, 1], [0, -1]]) { b.box(0.98, 0.06, 0.98, 0xead7a6, x, 0.03, z); b.box(0.9, 0.065, 0.9, 0xf2e3b8, x, 0.03, z); }
  return { group: b.mesh() };
}

