/* ================= people ================= */
// Props that staff carry or wear. They follow the figure's position and heading.
function mStaff(type) {
  const b = new Builder();
  if (type === 'ent') {
    b.sph(0.2, K.mint, 0, 0.28, 0, { sy: 1.1 }); b.sph(0.17, K.mint, 0, 0.56, 0); b.cone(0.06, 0.14, K.ora, 0, 0.54, 0.19, { rx: Math.PI / 2, seg: 6 });
    for (const x of [-0.07, 0.07]) { b.sph(0.05, 0xffffff, x, 0.61, 0.13, { seg: 6, seg2: 5 }); b.sph(0.022, K.inkD, x, 0.615, 0.172, { seg: 5, seg2: 4 }); }
    b.scone(0.1, 0.22, [K.red, K.yel], 6, 0, 0.8, 0); b.sph(0.03, K.paper, 0, 0.92, 0, { seg: 5, seg2: 4 });
    for (const x of [-0.09, 0.09]) b.box(0.09, 0.05, 0.14, K.ora, x, 0.03, 0.03);
    for (const x of [-0.23, 0.23]) b.sph(0.07, K.teal, x, 0.32, 0, { sy: 1.6 });
  } else if (type === 'jan') {
    b.cyl(0.011, 0.011, 0.5, K.woodD, 0.083, 0.275, 0.07, { seg: 5, rx: -0.21 }); b.box(0.15, 0.05, 0.05, K.yel, 0.083, 0.03, 0.125);
  } else if (type === 'mech') {
    b.box(0.12, 0.075, 0.06, K.red, -0.088, 0.2, 0.012); b.box(0.06, 0.012, 0.012, K.inkD, -0.088, 0.245, 0.012);
  } else if (type === 'clown') {
    b.sph(0.018, K.red, 0, 0.532, 0.054, { seg: 6, seg2: 5 });
    b.cone(0.03, 0.05, K.blue, -0.03, 0.47, 0.055, { rz: -Math.PI / 2, seg: 5 }); b.cone(0.03, 0.05, K.blue, 0.03, 0.47, 0.055, { rz: Math.PI / 2, seg: 5 });
    b.scone(0.035, 0.09, [K.blue, K.yel], 6, 0.01, 0.66, -0.01); b.sph(0.014, K.red, 0.01, 0.71, -0.01, { seg: 5, seg2: 4 });
    for (const y of [0.36, 0.41]) b.sph(0.014, K.red, 0, y, 0.043, { seg: 5, seg2: 4 });
  } else if (type === 'sec') {
    b.box(0.03, 0.035, 0.008, K.yel, -0.03, 0.43, 0.043); b.box(0.035, 0.06, 0.03, K.inkD, 0.06, 0.33, 0.035); b.box(0.1, 0.018, 0.004, K.yel, 0, 0.59, 0.047);
  }
  const m = b.mesh(); m.rotation.order = 'YXZ';
  if (type === 'jug') {
    m.userData.balls = [K.red, K.yel, K.blue].map((c) => { const ball = new T.Mesh(new T.SphereGeometry(0.024, 7, 5), new T.MeshLambertMaterial({ color: c })); ball.castShadow = true; m.add(ball); return ball; });
  }
  return m;
}
/* A person is assembled from instanced parts: torso, pelvis, head, hair, two thighs, two shins, two upper arms, two forearms, plus optional
   skirt, backpack and sunglasses. Every part is modelled around its joint, so walking and sitting are just joint angles.
   Heights are for an adult of about 0.58 units. White vertices take the instance colour; grey ones give a darker shade of it. */
const FIG = { HIP: 0.285, THIGH: 0.135, SHIN: 0.15, SHO: 0.452, SX: 0.08, LX: 0.03, NECK: 0.47, SEAT: 0.255, UARM: 0.1 };
function figureGeos() {
  const W = 0xffffff, D = 0x5a5a5a, SHOE = 0x353535, mk = (fn) => { const b = new Builder(); fn(b); return b.geo(); };
  const cap = (b) => b.sph(0.0495, W, 0, 0.079, -0.006, { seg: 9, seg2: 6, sx: 1.03, sy: 0.92 });
  return {
    torso: mk((b) => {
      b.cyl(0.066, 0.057, 0.085, W, 0, 0.4275, 0, { seg: 8, sz: 0.62 }); b.cyl(0.057, 0.05, 0.07, W, 0, 0.35, 0, { seg: 8, sz: 0.62 });
      b.sph(0.026, W, -0.064, 0.452, 0, { seg: 6, seg2: 4 }); b.sph(0.026, W, 0.064, 0.452, 0, { seg: 6, seg2: 4 });
      b.cyl(0.024, 0.03, 0.014, 0xd2d2d2, 0, 0.476, 0, { seg: 8, sz: 0.8 });
    }),
    pelvis: mk((b) => { b.cyl(0.05, 0.055, 0.075, W, 0, 0.292, 0, { seg: 8, sz: 0.64 }); b.cyl(0.052, 0.052, 0.016, D, 0, 0.325, 0, { seg: 8, sz: 0.64 }); }),
    thigh: mk((b) => { b.cyl(0.033, 0.026, FIG.THIGH, W, 0, -FIG.THIGH / 2, 0, { seg: 6 }); b.sph(0.027, W, 0, -FIG.THIGH, 0, { seg: 6, seg2: 4 }); }),
    shin: mk((b) => {
      b.cyl(0.025, 0.019, FIG.SHIN - 0.03, W, 0, -(FIG.SHIN - 0.03) / 2, 0, { seg: 6 });
      b.box(0.044, 0.026, 0.066, SHOE, 0, -FIG.SHIN + 0.013, 0.008); b.sph(0.022, SHOE, 0, -FIG.SHIN + 0.015, 0.045, { sy: 0.7, seg: 6, seg2: 4 });
    }),
    sleeve: mk((b) => { b.cyl(0.021, 0.018, FIG.UARM, W, 0, -FIG.UARM / 2, 0, { seg: 6 }); b.sph(0.018, W, 0, -FIG.UARM, 0, { seg: 6, seg2: 4 }); }),
    forearm: mk((b) => { b.cyl(0.0175, 0.014, 0.09, W, 0, -0.045, 0, { seg: 6 }); b.sph(0.017, W, 0, -0.1, 0, { sy: 1.2, seg: 6, seg2: 4 }); }),
    head: mk((b) => {
      b.cyl(0.018, 0.021, 0.035, W, 0, 0.012, 0, { seg: 6 }); b.sph(0.047, W, 0, 0.066, 0, { seg: 10, seg2: 8, sy: 1.12 });
      for (const x of [-0.017, 0.017]) { b.sph(0.0075, 0x18181c, x, 0.072, 0.0425, { seg: 5, seg2: 4 }); b.sph(0.011, 0xe6e6e6, x * 2.75, 0.064, 0.002, { seg: 5, seg2: 4 }); }
      b.sph(0.0095, 0xf2f2f2, 0, 0.058, 0.047, { seg: 5, seg2: 4 }); b.box(0.022, 0.005, 0.005, 0x9a5252, 0, 0.041, 0.0415);
    }),
    hair: [
      mk(cap),
      mk((b) => { cap(b); b.sph(0.043, W, 0, 0.04, -0.022, { seg: 8, seg2: 5, sx: 1.08, sy: 1.5, sz: 0.75 }); }),
      mk((b) => { cap(b); b.sph(0.02, W, 0, 0.092, -0.058, { seg: 6, seg2: 4 }); b.cyl(0.012, 0.006, 0.075, W, 0, 0.05, -0.072, { seg: 5, rx: -0.25 }); }),
      mk((b) => { b.sph(0.05, W, 0, 0.083, -0.002, { seg: 9, seg2: 6, sx: 1.03, sy: 0.8 }); b.box(0.072, 0.008, 0.05, W, 0, 0.088, 0.062); b.sph(0.008, D, 0, 0.123, -0.002, { seg: 4, seg2: 3 }); }),
      mk((b) => { b.sph(0.058, W, 0, 0.088, -0.008, { seg: 8, seg2: 6 }); for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; b.sph(0.024, W, Math.cos(a) * 0.045, 0.1 + (i % 2) * 0.02, -0.008 + Math.sin(a) * 0.045, { seg: 5, seg2: 4 }); } }),
      mk((b) => { b.cyl(0.04, 0.048, 0.04, W, 0, 0.112, -0.002, { seg: 10 }); b.cyl(0.09, 0.09, 0.006, W, 0, 0.094, -0.002, { seg: 12 }); b.cyl(0.049, 0.049, 0.01, D, 0, 0.099, -0.002, { seg: 10 }); }),
      mk((b) => { cap(b); b.sph(0.05, W, 0, 0.052, -0.014, { seg: 8, seg2: 5, sx: 1.1, sy: 0.95, sz: 0.88 }); }),
    ],
    skirt: mk((b) => b.cyl(0.054, 0.088, 0.13, W, 0, 0.262, 0, { seg: 8, sz: 0.8 })),
    pack: mk((b) => { b.box(0.09, 0.115, 0.048, W, 0, 0.4, -0.064); b.box(0.06, 0.04, 0.012, D, 0, 0.375, -0.092); for (const x of [-0.036, 0.036]) b.box(0.012, 0.11, 0.005, D, x, 0.41, 0.042); }),
    shades: mk((b) => { b.box(0.03, 0.017, 0.006, 0x16161a, -0.018, 0.072, 0.046); b.box(0.03, 0.017, 0.006, 0x16161a, 0.018, 0.072, 0.046); b.box(0.1, 0.005, 0.004, 0x16161a, 0, 0.076, 0.03, { }); }),
    balloon: mk((b) => { b.sph(0.1, W, 0.1, 1.06, 0.2, { sy: 1.15, seg: 8, seg2: 6 }); b.cyl(0.005, 0.005, 0.62, 0x555555, 0.1, 0.66, 0.2, { seg: 3 }); }),
  };
}
