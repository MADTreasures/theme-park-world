/* ================= people ================= */
// Toy-like figures: a big round head with large shiny eyes, sculpted hair, a small body, mitten hands and chunky sneakers.
// A person is assembled from instanced parts, each modelled around its joint, so walking and sitting are joint angles.
// The face is made of separate parts as well: eyes, irises that look around, lids, two brows and one of five mouths.
// White vertices take the instance colour; grey ones give a darker shade of it.
const FIG = { HIP: 0.235, THIGH: 0.11, SHIN: 0.125, SHO: 0.372, SX: 0.082, LX: 0.037, NECK: 0.405, SEAT: 0.2, UARM: 0.085, HAND: 0.09,
  EX: 0.046, EY: 0.104, EZ: 0.0945, EYAW: 0.45, BROW: [0.166, 0.083], MOUTH: [0.046, 0.083] };
// Things that staff carry or wear. Each piece follows one part of the figure: the body, the head or a forearm.
function mStaff(type) {
  if (type === 'ent') {
    const b = new Builder();
    b.sph(0.2, K.mint, 0, 0.28, 0, { sy: 1.1, seg: 14, seg2: 10 }); b.sph(0.17, K.mint, 0, 0.56, 0, { seg: 14, seg2: 10 }); b.sph(0.11, 0xbff5e6, 0, 0.26, 0.12, { seg: 10, seg2: 7, sy: 1.2 });
    b.cone(0.06, 0.14, K.ora, 0, 0.54, 0.19, { rx: Math.PI / 2, seg: 8 });
    for (const x of [-0.07, 0.07]) { b.sph(0.058, 0xffffff, x, 0.61, 0.125, { seg: 9, seg2: 7 }); b.sph(0.03, K.inkD, x, 0.612, 0.165, { seg: 7, seg2: 5 }); b.sph(0.011, 0xffffff, x + 0.01, 0.625, 0.19, { seg: 5, seg2: 3 }); b.sph(0.03, 0xffa0bc, x * 1.75, 0.53, 0.125, { seg: 6, seg2: 4, sz: 0.4 }); }
    b.scone(0.1, 0.22, [K.red, K.yel], 6, 0, 0.8, 0); b.sph(0.03, K.paper, 0, 0.92, 0, { seg: 6, seg2: 4 });
    for (const x of [-0.09, 0.09]) b.sph(0.07, K.ora, x, 0.035, 0.04, { seg: 8, seg2: 5, sy: 0.5, sz: 1.4 });
    for (const x of [-0.23, 0.23]) b.sph(0.07, K.teal, x, 0.32, 0, { sy: 1.6, seg: 8, seg2: 6 });
    const m = b.mesh(); m.rotation.order = 'YXZ'; return m;
  }
  const g = new T.Group(), u = g.userData;
  const piece = (fn) => { const b = new Builder(); fn(b); const m = b.mesh(); m.matrixAutoUpdate = false; g.add(m); return m; };
  if (type === 'jan') {
    // a broom in the right hand; modelled in the forearm's frame so that it stands upright while the arm hangs
    u.handR = piece((b) => { b.cyl(0.011, 0.011, 0.54, K.woodD, 0, -0.016, 0.031, { seg: 6, rx: 0.4 }); b.box(0.17, 0.05, 0.055, K.yel, 0, -0.25, -0.068, { rx: 0.4 }); b.box(0.17, 0.016, 0.06, K.woodD, 0, -0.222, -0.056, { rx: 0.4 }); });
  } else if (type === 'mech') {
    u.handL = piece((b) => { b.box(0.06, 0.07, 0.14, K.red, 0, -0.172, 0); b.box(0.064, 0.012, 0.144, K.redD, 0, -0.157, 0); b.box(0.012, 0.012, 0.07, K.inkD, 0, -0.125, 0); });
    u.handR = piece((b) => { b.box(0.016, 0.016, 0.11, K.stone, 0, -0.094, 0.05); b.box(0.042, 0.02, 0.03, K.stone, 0, -0.094, 0.115); });
  } else if (type === 'gard') {
    // shears in the right hand, a watering can in the left
    u.handR = piece((b) => { b.box(0.012, 0.012, 0.12, K.stone, 0.008, -0.094, 0.075, { ry: 0.12 }); b.box(0.012, 0.012, 0.12, K.stone, -0.008, -0.094, 0.075, { ry: -0.12 }); b.box(0.03, 0.02, 0.04, K.red, 0, -0.094, 0.012); });
    u.handL = piece((b) => { b.cyl(0.04, 0.045, 0.075, K.teal, 0, -0.165, 0, { seg: 8 }); b.cyl(0.008, 0.012, 0.09, K.teal, 0, -0.15, 0.07, { seg: 5, rx: 1.0 }); b.tor(0.026, 0.006, K.teal, 0, -0.12, -0.01, { ry: Math.PI / 2, rs: 4, seg: 8 }); });
  } else if (type === 'clown') {
    u.head = piece((b) => { b.sph(0.027, K.red, 0, 0.078, 0.108, { seg: 8, seg2: 6 }); b.scone(0.05, 0.13, [K.blue, K.yel], 6, 0.02, 0.345, -0.03, { rz: -0.15 }); b.sph(0.02, K.red, 0.03, 0.415, -0.03, { seg: 6, seg2: 4 }); });
    u.body = piece((b) => {
      b.cone(0.04, 0.06, K.blue, -0.04, 0.392, 0.058, { rz: -Math.PI / 2, seg: 6 }); b.cone(0.04, 0.06, K.blue, 0.04, 0.392, 0.058, { rz: Math.PI / 2, seg: 6 }); b.sph(0.016, K.yel, 0, 0.392, 0.062, { seg: 6, seg2: 4 });
      b.sph(0.017, K.red, 0, 0.28, 0.066, { seg: 6, seg2: 4 }); b.sph(0.017, K.red, 0, 0.33, 0.062, { seg: 6, seg2: 4 });
    });
  } else if (type === 'sec') {
    u.body = piece((b) => { b.sph(0.02, K.yel, -0.032, 0.34, 0.052, { seg: 6, seg2: 4, sz: 0.3 }); b.box(0.036, 0.058, 0.028, K.inkD, 0.056, 0.268, 0.056); b.cyl(0.004, 0.004, 0.05, K.inkD, 0.066, 0.32, 0.056, { seg: 4 }); });
  } else if (type === 'jug') {
    u.body = new T.Group(); u.body.matrixAutoUpdate = false; g.add(u.body);
    u.balls = [K.red, K.yel, K.blue].map((c) => { const ball = new T.Mesh(new T.SphereGeometry(0.03, 10, 7), softMat({ color: c }, 0.4, 0.3)); u.body.add(ball); return ball; });
  }
  return g;
}
// A sphere pulled into the shape of a head: full cheeks, a smaller chin. The seam and the poles get clean normals.
function headGeo(r, ws, hs) {
  const g = new T.SphereGeometry(r, ws, hs), p = g.attributes.position, n = g.attributes.normal;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i), k = y < 0 ? 1 - 0.2 * Math.pow(-y / r, 1.6) : 1;
    p.setXYZ(i, p.getX(i) * k, y * (y < 0 ? 0.97 : 0.94), p.getZ(i) * k * 0.97);
  }
  g.computeVertexNormals();
  for (let row = 0; row <= hs; row++) {
    const a = row * (ws + 1), b = a + ws;
    if (row === 0 || row === hs) { for (let i = a; i <= b; i++) n.setXYZ(i, 0, row ? -1 : 1, 0); continue; }
    _v.set(n.getX(a) + n.getX(b), n.getY(a) + n.getY(b), n.getZ(a) + n.getZ(b)).normalize(); n.setXYZ(a, _v.x, _v.y, _v.z); n.setXYZ(b, _v.x, _v.y, _v.z);
  }
  return g;
}
// q = 0: light version for crowds seen from afar, q = 1: smooth version for close views
function figureGeos(q) {
  const W = 0xffffff, D = 0x6e6e6e, INKC = 0x1c1a26, MOUTH = 0x8a2f3a, DARK = 0x4a1620, mk = (fn) => { const b = new Builder(); fn(b); return b.geo(); };
  const s = (lo, hi) => (q ? hi : lo), sp = (a, b, o) => Object.assign({ seg: s(a[0], b[0]), seg2: s(a[1], b[1]) }, o);
  const skull = (b) => b.sph(0.123, W, 0, 0.131, -0.034, sp([10, 6], [18, 11]));   // meets the forehead at a clear angle, so the hairline is clean
  const lock = (b, x, y, z, r, o) => b.sph(r, W, x, y, z, sp([6, 4], [11, 8], o));
  const fringe = (b) => b.sph(0.1, W, 0, 0.197, 0.066, sp([7, 3], [14, 7], { sy: 0.27, sz: 0.44 }));
  const body = [[0.072, 0.228], [0.078, 0.244], [0.077, 0.275], [0.07, 0.325], [0.067, 0.358], [0.058, 0.381], [0.044, 0.396], [0.03, 0.406]].map((p) => new T.Vector2(p[0], p[1]));
  return {
    torso: mk((b) => b.add(new T.LatheGeometry(body, s(7, 14)), W, 0, 0, 0, { sz: 0.8 })),
    // hem, collar, zip and a badge on the jacket, in a colour of their own
    trim: mk((b) => {
      b.cyl(0.076, 0.087, 0.042, W, 0, 0.244, 0, { seg: s(7, 14), sz: 0.82 }); b.tor(0.035, 0.012, W, 0, 0.398, 0, { rx: Math.PI / 2, rs: s(3, 6), seg: s(6, 14) });
      b.box(0.012, 0.1, 0.006, W, 0, 0.322, 0.0555, { rx: 0.09 }); if (q) b.sph(0.015, W, -0.033, 0.345, 0.05, { seg: 9, seg2: 5, sz: 0.3, ry: -0.5 });
    }),
    pelvis: mk((b) => b.sph(0.08, W, 0, 0.23, 0, sp([7, 3], [12, 7], { sy: 0.52, sz: 0.82 }))),
    thigh: mk((b) => { b.cyl(0.034, 0.03, FIG.THIGH, W, 0, -FIG.THIGH / 2, 0, { seg: s(5, 9) }); b.sph(0.03, W, 0, -FIG.THIGH, 0, sp([4, 2], [9, 6])); }),
    shin: mk((b) => b.cyl(0.028, 0.023, 0.1, W, 0, -0.05, 0, { seg: s(5, 9) })),
    shoe: mk((b) => b.sph(0.046, W, 0, -0.099, 0.022, sp([6, 3], [11, 7], { sx: 0.84, sy: 0.56, sz: 1.42 }))),
    // white sole and the edge of a sock
    sole: mk((b) => { b.sph(0.0485, 0xf6f6f6, 0, -0.1182, 0.022, sp([6, 2], [11, 4], { sx: 0.86, sy: 0.15, sz: 1.44 })); if (q) b.cyl(0.0265, 0.0255, 0.014, 0xf6f6f6, 0, -0.07, 0, { seg: 9 }); }),
    sleeve: mk((b) => { b.sph(0.0285, W, 0, 0, 0, sp([5, 3], [9, 6])); b.cyl(0.027, 0.023, FIG.UARM, W, 0, -FIG.UARM / 2, 0, { seg: s(5, 9) }); b.sph(0.023, W, 0, -FIG.UARM, 0, sp([4, 2], [9, 6])); }),
    forearm: mk((b) => b.cyl(0.022, 0.019, 0.072, W, 0, -0.036, 0, { seg: s(5, 9) })),
    hand: mk((b) => { b.sph(0.03, W, 0, -FIG.HAND, 0, sp([5, 3], [10, 7], { sx: 0.9 })); if (q) b.sph(0.012, W, 0, -FIG.HAND + 0.004, 0.027, { seg: 7, seg2: 5 }); }),
    head: mk((b) => {
      b.add(headGeo(0.112, s(12, 22), s(8, 15)), W, 0, 0.108, 0); b.cyl(0.03, 0.034, 0.04, 0xe4e4e4, 0, 0, 0, { seg: s(5, 10) });
      for (const x of [-1, 1]) { b.sph(0.022, 0xececec, x * 0.108, 0.1, -0.004, sp([4, 2], [8, 6], { sx: 0.55 })); if (q) b.sph(0.021, 0xffa8a8, x * 0.062, 0.062, 0.0685, { seg: 9, seg2: 5, sz: 0.3, ry: x * 0.72 }); }
      if (q) b.sph(0.011, 0xf2dcdc, 0, 0.076, 0.0995, { seg: 8, seg2: 5 });
    }),
    // one eye, looking along +z: a dark lid line that peeks out above the white, the white itself and two highlights
    eye: mk((b) => {
      b.sph(0.0345, INKC, 0, 0.0065, -0.0035, sp([6, 3], [14, 9], { sy: 1.17, sz: 0.3 })); b.sph(0.033, W, 0, 0, 0, sp([6, 3], [14, 10], { sy: 1.18, sz: 0.34 }));
      b.sph(0.0095, W, 0.011, 0.015, 0.0165, sp([4, 2], [8, 5], { sz: 0.47 })); if (q) b.sph(0.0045, W, -0.009, -0.014, 0.0175, { seg: 6, seg2: 4, sz: 0.5 });
    }),
    // the iris takes the eye colour; a darker copy peeks out above it like the shadow of the lid
    iris: mk((b) => {
      if (q) b.sph(0.0265, 0x5a5a5a, 0, 0.0042, 0.0025, { seg: 14, seg2: 8, sy: 1.2, sz: 0.45 }); b.sph(0.0265, W, 0, 0, 0.0035, sp([6, 3], [14, 8], { sy: 1.2, sz: 0.45 }));
      b.sph(0.0135, 0x15131c, 0, 0, 0.009, sp([4, 2], [10, 6], { sy: 1.2, sz: 0.63 }));
    }),
    lid: mk((b) => b.add(new T.TorusGeometry(0.024, 0.0055, s(3, 6), s(4, 12), Math.PI), INKC, 0, -0.012, 0.008)),
    brow: mk((b) => b.sph(0.028, D, 0, 0, 0, sp([5, 2], [10, 5], { sy: 0.28, sz: 0.2 }))),
    mouth: [
      mk((b) => b.add(new T.TorusGeometry(0.022, 0.0055, s(3, 6), s(5, 12), Math.PI), MOUTH, 0, 0.012, 0, { rz: Math.PI })),
      mk((b) => { b.sph(0.023, DARK, 0, 0, 0, sp([6, 3], [12, 7], { sy: 0.9, sz: 0.3 })); b.sph(0.014, 0xff6b81, 0, -0.01, 0.004, sp([4, 2], [8, 5], { sy: 0.6, sz: 0.35 })); if (q) b.box(0.026, 0.007, 0.005, W, 0, 0.013, 0.004); }),
      mk((b) => b.add(new T.TorusGeometry(0.02, 0.0055, s(3, 6), s(5, 12), Math.PI), MOUTH, 0, -0.012, 0)),
      mk((b) => b.sph(0.013, DARK, 0, 0, 0, sp([5, 3], [10, 7], { sy: 1.15, sz: 0.35 }))),
      mk((b) => b.sph(0.019, MOUTH, 0, 0, 0, sp([5, 2], [10, 5], { sy: 0.22, sz: 0.25 }))),
    ],
    hair: [
      mk((b) => { skull(b); lock(b, -0.035, 0.205, 0.058, 0.05); lock(b, 0.042, 0.2, 0.052, 0.046); lock(b, 0, 0.236, 0, 0.062, { sy: 0.5 }); }),                                              // 0 short, swept fringe
      mk((b) => { skull(b); fringe(b); lock(b, 0, 0.045, -0.046, 0.105, { sx: 1.12, sy: 1.5, sz: 0.72 }); lock(b, -0.099, 0.07, 0.028, 0.027, { sy: 2.4 }); lock(b, 0.099, 0.07, 0.028, 0.027, { sy: 2.4 }); }),   // 1 long with fringe
      mk((b) => { skull(b); lock(b, -0.04, 0.2, 0.058, 0.046); lock(b, 0.04, 0.2, 0.058, 0.046); lock(b, 0, 0.2, -0.128, 0.042); b.cyl(0.03, 0.008, 0.17, W, 0, 0.105, -0.168, { seg: s(6, 9), rx: -0.3 }); }),   // 2 ponytail
      mk((b) => { b.sph(0.121, W, 0, 0.142, -0.008, sp([12, 6], [18, 9], { sy: 0.8 })); b.sph(0.09, W, 0, 0.165, 0.11, sp([8, 3], [12, 4], { sy: 0.09, sz: 0.75 })); b.sph(0.015, D, 0, 0.24, -0.008, { seg: 5, seg2: 3 }); }),   // 3 cap
      mk((b) => { b.sph(0.135, W, 0, 0.175, -0.055, sp([11, 7], [16, 11])); for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + 0.45; lock(b, Math.cos(a) * 0.1, 0.225 + (i % 2) * 0.03, -0.055 + Math.sin(a) * 0.1, 0.058); } }),   // 4 round curls
      mk((b) => { b.cyl(0.088, 0.1, 0.075, W, 0, 0.222, -0.005, { seg: s(12, 18) }); b.cyl(0.185, 0.185, 0.012, W, 0, 0.184, -0.005, { seg: s(16, 24) }); b.cyl(0.102, 0.102, 0.018, D, 0, 0.198, -0.005, { seg: s(12, 18) }); }),   // 5 sun hat
      mk((b) => { skull(b); fringe(b); lock(b, 0, 0.085, -0.04, 0.108, { sx: 1.14, sz: 0.9 }); }),                                                                                           // 6 bob
      mk((b) => { skull(b); lock(b, -0.046, 0.2, 0.054, 0.046, { sy: 0.75 }); lock(b, 0.046, 0.2, 0.054, 0.046, { sy: 0.75 }); lock(b, 0, 0.268, -0.035, 0.052); }),                           // 7 bun
      mk((b) => { skull(b); lock(b, 0, 0.238, 0.046, 0.056, { sy: 1.1, sz: 0.9 }); lock(b, -0.045, 0.226, 0.016, 0.05); lock(b, 0.045, 0.226, 0.016, 0.05); lock(b, 0, 0.232, -0.04, 0.062); }),   // 8 quiff
    ],
    skirt: mk((b) => b.cyl(0.074, 0.12, 0.105, W, 0, 0.208, 0, { seg: s(10, 16), sz: 0.86 })),
    pack: mk((b) => { b.box(0.115, 0.135, 0.06, W, 0, 0.315, -0.09); b.box(0.075, 0.045, 0.014, D, 0, 0.285, -0.125); for (const x of [-0.045, 0.045]) b.box(0.014, 0.12, 0.006, D, x, 0.33, 0.056); }),
    shades: mk((b) => { for (const x of [-1, 1]) b.sph(0.041, 0x16161a, x * 0.046, 0.106, 0.1, sp([8, 5], [12, 7], { sz: 0.25, ry: x * 0.45 })); b.box(0.03, 0.008, 0.008, 0x16161a, 0, 0.112, 0.112); b.box(0.224, 0.008, 0.006, 0x16161a, 0, 0.116, 0.03); }),
    mask: mk((b) => b.cyl(0.1135, 0.1135, 0.056, INKC, 0, 0.106, 0, { seg: s(14, 20), sz: 0.965 })),
    balloon: mk((b) => { b.sph(0.115, W, 0.082, 1.095, 0.13, { sy: 1.15, seg: 12, seg2: 9 }); b.cone(0.02, 0.03, D, 0.082, 0.955, 0.13, { seg: 5 }); b.cyl(0.004, 0.004, 0.64, 0x555555, 0.082, 0.635, 0.13, { seg: 3 }); }),
    blob: (() => { const g = new T.CircleGeometry(0.12, 12); g.rotateX(-Math.PI / 2); return g; })(),
  };
}
