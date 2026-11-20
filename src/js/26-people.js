/* ================= people ================= */
// Stylised people of about three and a half heads' height: an egg-shaped head with a small chin, large eyes, sculpted
// hair, a neck, sloping shoulders, a waist, tapered arms and legs with rounded joints, hands with fingers, sneakers, and
// clothes that sit on top of the body (short sleeves, shorts, skirts, collars, cuffs, stripes).
// A person is assembled from instanced parts, each modelled around its joint, so walking and sitting are joint angles;
// where two parts meet both end in the same sphere, so a bend looks smooth. The face is made of separate parts as well.
// White vertices take the instance colour; grey ones give a darker shade of it.
//
// Everything on the head is laid out in "head units": the head is a unit sphere pulled into shape, HR is its radius and
// HC the height of its centre above the neck joint. Hats are always larger than the hair they sit on, and hair never
// comes closer to the face than the head's own surface (headZ), so nothing pokes through anything else.
const HR = 0.086, HC = 0.083;
const FIG = { HIP: 0.3, THIGH: 0.14, SHIN: 0.16, SHO: 0.444, SX: 0.07, LX: 0.027, NECK: 0.5, SEAT: 0.272, UARM: 0.1, HAND: 0.105 };
// where the surface of the head lies in front (z) of a point x, y; all in head units
function headZ(x, y) {
  let k = 1, ys = y; if (y < 0) { ys = y / 1.08; k = 1 - 0.34 * Math.pow(-ys, 1.7); }
  const xs = x / (0.96 * k), q = 1 - xs * xs - ys * ys; if (q <= 0) return 0;
  let z = Math.sqrt(q); if (z > 0.6) z = 0.6 + (z - 0.6) * 0.8;
  return z * k * 0.97;
}
const headYaw = (x, y) => Math.atan2(headZ(x - 0.1, y) - headZ(x + 0.1, y), 0.2);   // how far the surface is turned outwards there
const FACE = { ex: 0.39, ey: -0.1, by: 0.37, my: -0.55, ny: -0.28 };
FIG.EX = FACE.ex * HR; FIG.EY = HC + FACE.ey * HR; FIG.EZ = (headZ(FACE.ex, FACE.ey) - 0.034) * HR; FIG.EYAW = headYaw(FACE.ex, FACE.ey);
FIG.BROW = [HC + FACE.by * HR, (headZ(FACE.ex, FACE.by) + 0.012) * HR]; FIG.BYAW = headYaw(FACE.ex, FACE.by);
FIG.MOUTH = [HC + FACE.my * HR, (headZ(0, FACE.my) + 0.01) * HR];
// Things that staff carry or wear. Each piece follows one part of the figure: the body, the head or a forearm.
function mStaff(type) {
  if (type === 'ent') {
    const b = new Builder();
    b.sph(0.2, K.mint, 0, 0.28, 0, { sy: 1.1, seg: 18, seg2: 12 }); b.sph(0.17, K.mint, 0, 0.56, 0, { seg: 18, seg2: 12 }); b.sph(0.11, 0xbff5e6, 0, 0.26, 0.12, { seg: 12, seg2: 8, sy: 1.2 });
    b.cone(0.06, 0.14, K.ora, 0, 0.54, 0.19, { rx: Math.PI / 2, seg: 10 });
    for (const x of [-0.07, 0.07]) { b.sph(0.058, 0xffffff, x, 0.61, 0.125, { seg: 12, seg2: 8 }); b.sph(0.03, K.inkD, x, 0.612, 0.165, { seg: 9, seg2: 6 }); b.sph(0.011, 0xffffff, x + 0.01, 0.625, 0.19, { seg: 6, seg2: 4 }); b.sph(0.03, 0xffa0bc, x * 1.75, 0.53, 0.125, { seg: 8, seg2: 5, sz: 0.4 }); }
    b.scone(0.1, 0.22, [K.red, K.yel], 6, 0, 0.8, 0); b.sph(0.03, K.paper, 0, 0.92, 0, { seg: 8, seg2: 5 });
    for (const x of [-0.09, 0.09]) b.sph(0.07, K.ora, x, 0.035, 0.04, { seg: 10, seg2: 6, sy: 0.5, sz: 1.4 });
    for (const x of [-0.23, 0.23]) b.sph(0.07, K.teal, x, 0.32, 0, { sy: 1.6, seg: 10, seg2: 7 });
    const m = b.mesh(); m.rotation.order = 'YXZ'; return m;
  }
  const g = new T.Group(), u = g.userData;
  const piece = (fn) => { const b = new Builder(); fn(b); const m = b.mesh(); m.matrixAutoUpdate = false; g.add(m); return m; };
  const hy = (v) => HC + v * HR;   // a height in head units, seen from the neck joint
  if (type === 'jan') {
    // a broom in the right hand; modelled in the forearm's frame so that it stands upright while the arm hangs
    u.handR = piece((b) => { b.cyl(0.008, 0.008, 0.6, K.woodD, 0, -0.0437, 0.0259, { seg: 8, rx: 0.4 }); b.box(0.13, 0.04, 0.045, K.yel, 0, -0.3016, -0.083, { rx: 0.4 }); b.box(0.13, 0.014, 0.05, K.woodD, 0, -0.274, -0.0714, { rx: 0.4 }); });
  } else if (type === 'mech') {
    u.handL = piece((b) => { b.box(0.045, 0.055, 0.11, K.red, 0, -0.167, 0); b.box(0.048, 0.01, 0.114, K.redD, 0, -0.156, 0); b.box(0.009, 0.009, 0.055, K.inkD, 0, -0.131, 0); });
    u.handR = piece((b) => { b.box(0.011, 0.011, 0.085, K.stone, 0, -0.108, 0.04); b.box(0.03, 0.014, 0.022, K.stone, 0, -0.108, 0.09); });
  } else if (type === 'gard') {
    // shears in the right hand, a watering can in the left
    u.handR = piece((b) => { b.box(0.008, 0.008, 0.09, K.stone, 0.006, -0.108, 0.062, { ry: 0.12 }); b.box(0.008, 0.008, 0.09, K.stone, -0.006, -0.108, 0.062, { ry: -0.12 }); b.box(0.022, 0.014, 0.03, K.red, 0, -0.108, 0.012); });
    u.handL = piece((b) => { b.cyl(0.03, 0.034, 0.055, K.teal, 0, -0.162, 0, { seg: 12 }); b.cyl(0.006, 0.009, 0.07, K.teal, 0, -0.15, 0.052, { seg: 6, rx: 1.0 }); b.tor(0.02, 0.0045, K.teal, 0, -0.128, -0.008, { ry: Math.PI / 2, rs: 5, seg: 12 }); });
  } else if (type === 'build') {
    // a hard hat that is larger than the hair under it, and a hammer
    u.head = piece((b) => {
      b.add(new T.SphereGeometry(1, 20, 10, 0, TAU, 0, Math.PI * 0.55), K.yel, 0, hy(0.3), -0.06 * HR, { sx: 1.15 * HR, sy: 0.92 * HR, sz: 1.15 * HR });
      b.tor(HR, 0.07 * HR, K.yel, 0, hy(0.3 - 0.92 * 0.156), -0.06 * HR, { rx: Math.PI / 2, sx: 1.14, sy: 1.14, rs: 6, seg: 20 });
      b.sph(0.5 * HR, K.yel, 0, hy(0.17), 1.02 * HR, { sy: 0.1, sz: 0.9, seg: 10, seg2: 4 }); b.add(new T.SphereGeometry(1, 6, 10, 0, TAU, 0, Math.PI * 0.5), 0xf2c200, 0, hy(0.3), -0.06 * HR, { sx: 0.11 * HR, sy: 0.94 * HR, sz: 1.17 * HR });   // the rib over the crown
    });
    u.handR = piece((b) => { b.cyl(0.0065, 0.0065, 0.1, K.woodD, 0, -0.108, 0.035, { seg: 6, rx: Math.PI / 2 }); b.box(0.022, 0.05, 0.022, K.stoneD, 0, -0.108, 0.085); });
    u.body = piece((b) => { for (const x of [-0.03, 0.03]) b.box(0.012, 0.15, 0.004, 0xf2f2f2, x, 0.4, 0.0375, { rx: 0.1 }); b.box(0.07, 0.012, 0.004, 0xf2f2f2, 0, 0.36, 0.0345); });
  } else if (type === 'clown') {
    u.head = piece((b) => { b.sph(0.16 * HR, K.red, 0, hy(FACE.ny), (headZ(0, FACE.ny) + 0.1) * HR, { seg: 10, seg2: 7 }); b.scone(0.42 * HR, 1.15 * HR, [K.blue, K.yel], 6, 0.15 * HR, hy(1.95), -0.5 * HR, { rz: -0.15 }); b.sph(0.17 * HR, K.red, 0.24 * HR, hy(2.56), -0.5 * HR, { seg: 8, seg2: 5 }); });
    u.body = piece((b) => {
      b.cone(0.028, 0.042, K.blue, -0.028, 0.47, 0.036, { rz: -Math.PI / 2, seg: 8 }); b.cone(0.028, 0.042, K.blue, 0.028, 0.47, 0.036, { rz: Math.PI / 2, seg: 8 }); b.sph(0.011, K.yel, 0, 0.47, 0.039, { seg: 8, seg2: 5 });
      b.sph(0.012, K.red, 0, 0.39, 0.038, { seg: 8, seg2: 5 }); b.sph(0.012, K.red, 0, 0.43, 0.042, { seg: 8, seg2: 5 });
    });
  } else if (type === 'sec') {
    u.head = piece((b) => b.sph(0.2 * HR, K.yel, 0, hy(0.62), 1.085 * HR, { seg: 8, seg2: 5, sz: 0.3, sy: 1.15 }));   // the badge on the cap
    u.body = piece((b) => { b.sph(0.014, K.yel, -0.026, 0.42, 0.038, { seg: 8, seg2: 5, sz: 0.3 }); b.box(0.026, 0.042, 0.02, K.inkD, 0.038, 0.322, 0.036); b.cyl(0.003, 0.003, 0.04, K.inkD, 0.046, 0.36, 0.036, { seg: 4 }); });
  } else if (type === 'jug') {
    u.body = new T.Group(); u.body.matrixAutoUpdate = false; g.add(u.body);
    u.balls = [K.red, K.yel, K.blue].map((c) => { const ball = new T.Mesh(new T.SphereGeometry(0.024, 14, 10), softMat({ color: c }, 0.4, 0.3)); u.body.add(ball); return ball; });
  }
  return g;
}
// A unit sphere pulled into the shape of a head: a round skull, a flatter face, cheeks that narrow to a small chin.
function headGeo(ws, hs) {
  const g = new T.SphereGeometry(1, ws, hs), p = g.attributes.position, n = g.attributes.normal;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (z > 0.6) z = 0.6 + (z - 0.6) * 0.8;
    if (y < 0) { const k = 1 - 0.34 * Math.pow(-y, 1.7); x *= k; z *= k; y *= 1.08; }
    p.setXYZ(i, x * 0.96, y, z * 0.97);
  }
  g.computeVertexNormals();
  for (let row = 0; row <= hs; row++) {   // clean normals on the seam and at the poles
    const a = row * (ws + 1), b = a + ws;
    if (row === 0 || row === hs) { for (let i = a; i <= b; i++) n.setXYZ(i, 0, row ? -1 : 1, 0); continue; }
    _v.set(n.getX(a) + n.getX(b), n.getY(a) + n.getY(b), n.getZ(a) + n.getZ(b)).normalize(); n.setXYZ(a, _v.x, _v.y, _v.z); n.setXYZ(b, _v.x, _v.y, _v.z);
  }
  return g;
}
// the rows r0..r1 of the head (20 x 16) as their own surface: tight headwear is the head itself, a little larger
function headBand(r0, r1, ws = 20, hs = 16) { const g = headGeo(ws, hs), a = r0 ? ws * 3 + (r0 - 1) * ws * 6 : 0, e = ws * 3 + (r1 - 1) * ws * 6; g.setIndex(Array.from(g.index.array.slice(a, e))); return g; }
// q = 0: light version for crowds seen from afar, q = 1: smooth version for close views
function figureGeos(q) {
  const W = 0xffffff, D = 0x6e6e6e, INKC = 0x1c1a26, MOUTH = 0x8a2f3a, DARK = 0x4a1620, SOLE = 0xf6f6f6;
  const s = (lo, hi) => (q ? hi : lo), sp = (a, b, o) => Object.assign({ seg: s(a[0], b[0]), seg2: s(a[1], b[1]) }, o);
  const mk = (fn) => { const b = new Builder(); fn(b); return b.geo(); };
  const hd = (fn) => { const g = mk(fn); g.scale(HR, HR, HR); g.translate(0, HC, 0); return g; };   // built in head units
  // a shape turned on a lathe from a profile of [radius, height] pairs, bottom to top; the light version skips every other point
  const lathe = (b, pts, seg, col, o) => b.add(new T.LatheGeometry((q ? pts : pts.filter((p, i) => i % 2 === 0 || i === pts.length - 1)).map((p) => new T.Vector2(p[0], p[1])), seg), col, 0, 0, 0, o);
  /* ----- hair, in head units ----- */
  const TEAR = [[0, -1], [0.16, -0.82], [0.34, -0.55], [0.46, -0.25], [0.5, 0.02], [0.44, 0.24], [0.27, 0.4], [0, 0.48]].map((p) => new T.Vector2(p[0], p[1]));
  // a lock of hair: a teardrop with its tip pointing down, len long, w wide, d deep, then turned
  const tear = (b, x, y, z, len, w, d, o) => b.add(q ? new T.LatheGeometry(TEAR, 8) : new T.SphereGeometry(0.5, 5, 4), W, x, q ? y : y - len * 0.26, z, Object.assign({ sx: w, sy: q ? len : len * 1.45, sz: d }, o));
  // a fringe lock on the forehead: its tip ends at yTip and it lies along the skull
  const bang = (b, x, yTip, len, w, rz) => {
    const y = Math.min(yTip + len, Math.sqrt(Math.max(0, 1 - (x / 0.96) * (x / 0.96))) - 0.12), L = Math.max(0.08, y - yTip);   // towards the sides the skull ends lower, so the lock gets shorter
    tear(b, x, y, headZ(x, y) + 0.035, L, w, 0.2, { rx: Math.atan2(headZ(x, y + 0.08) - headZ(x, y - 0.08), 0.16) * 0.9, rz: rz || 0 });
  };
  const blob = (b, x, y, z, rx, ry, rz, o) => b.sph(1, W, x, y, z, sp([7, 5], [14, 10], Object.assign({ sx: rx, sy: ry, sz: rz }, o)));
  // The hair on the skull is a shell that lies a finger's breadth outside the head. Its lower edge follows a hairline:
  // pairs of [degrees around the head, counted from the nose; degrees down from the crown] with a soft curve between
  // them. So the hair sweeps down at the temples, ends in a sideburn, arches over the ear and runs down to the nape.
  // Along that edge the shell turns in and ends under the skin: the hair has a clean edge and looks thick, not hollow.
  const DEG = Math.PI / 180;
  const inHead = (x, y, z) => { let k = 1, ys = y; if (y < 0) { ys = y / 1.08; k = 1 - 0.34 * Math.pow(Math.min(1, -ys), 1.7); } let zs = z / (0.97 * k); if (zs > 0.6) zs = 0.6 + (zs - 0.6) / 0.8; const xs = x / (0.96 * k); return xs * xs + ys * ys + zs * zs < 1; };
  const hairShell = (b, pts, o) => {
    o = o || {};
    const c = o.c || [0, 0, -0.12], r = o.r || [1.06, 1.07, 1.07], rows = s(3, 8);
    const slope = (k) => (k <= 0 || k >= pts.length - 1 ? 0 : (pts[k + 1][1] - pts[k - 1][1]) / (pts[k + 1][0] - pts[k - 1][0]));
    const edge = (a) => {
      const sh = o.shift ? o.shift(a) : 0; a = Math.abs(a); let i = 1; while (i < pts.length - 1 && pts[i][0] < a) i++;
      const p = pts[i - 1], e = pts[i], h = e[0] - p[0], t = clamp((a - p[0]) / h, 0, 1), t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * p[1] + (t3 - 2 * t2 + t) * h * slope(i - 1) + (3 * t2 - 2 * t3) * e[1] + (t3 - t2) * h * slope(i) + sh;
    };
    // columns: every control point, with finer steps where the hairline runs around the temple and the ear
    const half = [0]; for (let i = 1; i < pts.length; i++) { const d = pts[i][0] - pts[i - 1][0], mid = (pts[i][0] + pts[i - 1][0]) / 2, m = Math.max(1, Math.round(d / s(40, mid > 40 && mid < 115 ? 5 : 12))); for (let k = 1; k <= m; k++) half.push(pts[i - 1][0] + d * k / m); }
    const cols = half.slice(1).reverse().map((a) => -a).concat(half), nc = cols.length, R = rows + 1;
    const at = (a, th) => { const st = Math.sin(th * DEG), m = 1 + (o.puff ? o.puff(th, a) : 0); return [c[0] + r[0] * m * st * Math.sin(a * DEG), c[1] + r[1] * m * Math.cos(th * DEG), c[2] + r[2] * m * st * Math.cos(a * DEG)]; };
    const pos = [], ix = [];
    for (let i = 0; i < nc; i++) { const e = edge(cols[i]); for (let j = 0; j <= rows; j++) pos.push(...at(cols[i], e * j / rows)); }
    for (let i = 0; i < nc - 1; i++) for (let j = 0; j < rows; j++) { const a = i * R + j, d = a + R; if (j) ix.push(a, a + 1, d); ix.push(d, a + 1, d + 1); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(ix); g.computeVertexNormals();
    const nr = g.attributes.normal;
    for (let j = 0; j <= rows; j++) {   // one normal for the crown, and no seam down the back of the head
      const a = j, e = (nc - 1) * R + j; _v.set(nr.getX(a) + nr.getX(e), nr.getY(a) + nr.getY(e), nr.getZ(a) + nr.getZ(e)).normalize(); nr.setXYZ(a, _v.x, _v.y, _v.z); nr.setXYZ(e, _v.x, _v.y, _v.z);
    }
    if (!o.puff) for (let i = 0; i < nc; i++) nr.setXYZ(i * R, 0, 1, 0);
    b.add(g, W);
    if (!q) return;
    const rp = [], ri = [];
    for (let i = 0; i < nc; i++) {
      const P = at(cols[i], edge(cols[i])); let lo = 0, hi = 1;
      for (let k = 0; k < 12; k++) { const m = (lo + hi) / 2; if (inHead(P[0] * m, P[1] * m, P[2] * m)) lo = m; else hi = m; }
      const t = lo * 1.03; rp.push(P[0], P[1], P[2], P[0] * t, P[1] * t, P[2] * t);   // just above the skin, and above a mask worn on it
    }
    for (let i = 0; i < nc - 1; i++) { const a = i * 2, d = a + 2; ri.push(a, a + 1, d, d, a + 1, d + 1); }
    const rg = new T.BufferGeometry(); rg.setAttribute('position', new T.Float32BufferAttribute(rp, 3)); rg.setIndex(ri); rg.computeVertexNormals();
    const rn = rg.attributes.normal;
    for (let i = 0; i < nc; i++) { const e = i * R + rows; _v.set(nr.getX(e) + rn.getX(i * 2) * 0.45, nr.getY(e) + rn.getY(i * 2) * 0.45, nr.getZ(e) + rn.getZ(i * 2) * 0.45).normalize(); rn.setXYZ(i * 2, _v.x, _v.y, _v.z); rn.setXYZ(i * 2 + 1, _v.x, _v.y, _v.z); }
    b.add(rg, 0xe2e2e2);
  };
  // hairlines: ears free with a sideburn; down over the ears (to the given depth); and the hair that shows under a hat
  const HAIRLINE = [[0, 56], [30, 57], [46, 62], [57, 79], [64, 93], [71, 95], [78, 86], [87, 80], [97, 85], [108, 102], [130, 118], [180, 122]];
  // f: how far down the forehead a fringe reaches (56 is the bare hairline, 63 ends just above the brows)
  const lineOver = (d, f) => [[0, f], [34, f + 1], [46, f + 4], [56, 84], [63, d - 4], [70, d], [180, d]];
  const scalp = (b, o) => hairShell(b, HAIRLINE, o);
  const under = (b) => hairShell(b, [[0, 46], [34, 47], [48, 56], [59, 76], [66, 90], [73, 92], [80, 82], [88, 77], [98, 81], [110, 100], [132, 114], [180, 118]], { c: [0, -0.05, -0.09], r: [1.045, 1, 0.98] });
  // more hair on top: the shell stands further out around the crown; and a fringe that stands out from the forehead
  const top = (k) => (th) => k * (1 - clamp((th - 20) / 50, 0, 1));
  const fringe = (k) => (th, a) => k * clamp((75 - Math.abs(a)) / 25, 0, 1) * clamp((th - 22) / 26, 0, 1);
  const dome = (b, col, cx, cy, cz, rx, ry, rz, th) => b.add(new T.SphereGeometry(1, s(12, 24), s(5, 10), 0, TAU, 0, Math.PI * th), col, cx, cy, cz, { sx: rx, sy: ry, sz: rz });
  return {
    torso: mk((b) => lathe(b, [[0.05, 0.286], [0.0545, 0.3], [0.052, 0.325], [0.0475, 0.352], [0.053, 0.385], [0.059, 0.415], [0.0605, 0.435], [0.056, 0.452], [0.043, 0.465], [0.026, 0.474], [0.017, 0.482]], s(8, 18), W, { sz: 0.66 })),
    // collar and hem, in a colour of their own; the hem sits clear of the hips, so its edge is clean
    trim: mk((b) => { lathe(b, [[0.0605, 0.288], [0.062, 0.296], [0.061, 0.312], [0.0575, 0.326], [0.052, 0.333]], s(8, 18), W, { sz: 0.7 }); lathe(b, [[0.0215, 0.468], [0.027, 0.472], [0.029, 0.482], [0.0265, 0.492], [0.0225, 0.494]], s(6, 14), W, { sz: 0.9 }); }),
    // a jacket's zip, pocket seams and badge
    zip: mk((b) => { b.box(0.006, 0.142, 0.004, W, 0, 0.402, 0.0368, { rx: 0.085 }); if (q) { b.sph(0.0085, W, -0.026, 0.436, 0.0348, { seg: 10, seg2: 6, sz: 0.3, ry: -0.5 }); for (const x of [-1, 1]) b.box(0.022, 0.004, 0.003, D, x * 0.03, 0.352, 0.0288, { rz: x * 0.5, ry: x * 0.5 }); } }),
    // two stripes around a jacket's sleeve
    stripe: mk((b) => { b.cyl(0.0236, 0.0232, 0.007, W, 0, -0.012, 0, { seg: s(5, 12) }); b.cyl(0.0226, 0.0222, 0.007, W, 0, -0.026, 0, { seg: s(5, 12) }); }),
    // a burglar's hoops
    hoops: mk((b) => { for (const y of [0.34, 0.375, 0.41, 0.442]) { const r = y < 0.36 ? 0.0492 : y < 0.4 ? 0.0525 : y < 0.43 ? 0.0592 : 0.0598; b.cyl(r + 0.0012, r + 0.0006, 0.014, W, 0, y, 0, { seg: s(8, 18), sz: 0.665 }); } }),
    pelvis: mk((b) => b.sph(0.054, W, 0, 0.29, 0, sp([7, 3], [16, 9], { sy: 0.667, sz: 0.676 }))),
    thigh: mk((b) => lathe(b, [[0, -0.1625], [0.012, -0.158], [0.0205, -0.148], [0.0225, -0.138], [0.0255, -0.08], [0.0272, -0.03], [0.0275, 0], [0.025, 0.013], [0.015, 0.024], [0, 0.0275]], s(5, 12), W)),
    shin: mk((b) => lathe(b, [[0, -0.142], [0.013, -0.139], [0.0155, -0.13], [0.017, -0.1], [0.0215, -0.055], [0.0225, -0.02], [0.0225, 0], [0.019, 0.012], [0, 0.0215]], s(5, 12), W)),
    // the leg of a pair of shorts, worn over the thigh
    short: mk((b) => { lathe(b, [[0.03, -0.074], [0.0304, -0.068], [0.0302, -0.02], [0.03, 0], [0.027, 0.014], [0.016, 0.026], [0, 0.03]], s(5, 12), W); if (q) b.cyl(0.0312, 0.031, 0.008, D, 0, -0.071, 0, { seg: 12 }); }),
    shoe: mk((b) => { b.sph(0.0178, W, 0, -0.139, 0.012, sp([6, 3], [12, 7], { sy: 0.96, sz: 2.3 })); b.cyl(0.0185, 0.0178, 0.014, D, 0, -0.1225, -0.002, { seg: s(5, 12) }); if (q) b.box(0.006, 0.012, 0.004, D, 0, -0.128, -0.0305, { rx: 0.2 }); }),
    // sole, toe cap, laces and the edge of a sock: always white
    sole: mk((b) => {
      if (!q) { b.add(new T.BoxGeometry(0.038, 0.012, 0.09), SOLE, 0, -0.154, 0.014); return; }
      b.add(softBox(0.038, 0.012, 0.09, 0.005), SOLE, 0, -0.154, 0.014); b.sph(0.0168, SOLE, 0, -0.1455, 0.043, { seg: 9, seg2: 5, sy: 0.62, sz: 0.85 }); b.cyl(0.0172, 0.0168, 0.02, SOLE, 0, -0.108, 0, { seg: 12 });
      for (let i = 0; i < 3; i++) b.box(0.017, 0.003, 0.004, SOLE, 0, -0.1262 - i * 0.0036, 0.016 + i * 0.008, { rx: 0.42 });
    }),
    upper: mk((b) => lathe(b, [[0, -0.1175], [0.01, -0.114], [0.0165, -0.104], [0.0175, -0.092], [0.0195, -0.04], [0.0225, -0.008], [0.023, 0.006], [0.019, 0.019], [0, 0.0245]], s(5, 12), W)),
    // a short sleeve, worn over the upper arm
    cap: mk((b) => { lathe(b, [[0.0238, -0.056], [0.0242, -0.051], [0.024, -0.03], [0.026, -0.006], [0.0265, 0.006], [0.022, 0.02], [0, 0.0275]], s(5, 12), W); if (q) b.cyl(0.0248, 0.0246, 0.007, D, 0, -0.0535, 0, { seg: 12 }); }),
    forearm: mk((b) => lathe(b, [[0, -0.0965], [0.008, -0.094], [0.0125, -0.086], [0.0135, -0.07], [0.0165, -0.03], [0.0172, -0.004], [0.0165, 0.008], [0, 0.0172]], s(5, 12), W)),
    wrist: mk((b) => b.cyl(0.0146, 0.0142, 0.011, W, 0, -0.083, 0, { seg: s(4, 12) })),
    // palms face the body, thumbs point forward; the smooth version has four fingers
    hand: mk((b) => {
      b.sph(0.0155, W, 0, -0.103, 0.001, sp([5, 3], [10, 6], { sx: 0.55, sz: 0.87 }));
      if (!q) { b.sph(0.013, W, 0, -0.118, 0.002, { seg: 5, seg2: 3, sx: 0.58, sz: 0.96 }); return; }
      for (let i = 0; i < 4; i++) b.sph(0.0125, W, 0, -0.1205 + (i === 0 || i === 3 ? 0.002 : 0), -0.0082 + i * 0.0057, { seg: 6, seg2: 4, sx: 0.34, sz: 0.3 });
      b.sph(0.0095, W, 0.001, -0.105, 0.0148, { seg: 7, seg2: 4, sx: 0.58, sz: 0.58, rx: -0.5 });
    }),
    head: hd((b) => {
      b.add(headGeo(s(12, 26), s(8, 16)), W); b.cyl(0.195, 0.215, 0.6, 0xe6e6e6, 0, -1.02, 0, { seg: s(5, 12) });
      for (const x of [-1, 1]) { b.sph(1, 0xececec, x * 1.0, -0.08, -0.05, sp([4, 2], [10, 7], { sx: 0.1, sy: 0.2, sz: 0.15 })); if (q) { b.sph(1, 0xd9c2c2, x * 1.055, -0.08, -0.03, { seg: 8, seg2: 5, sx: 0.05, sy: 0.12, sz: 0.08 }); b.sph(1, 0xffaaaa, x * 0.55, -0.4, headZ(0.55, -0.4) - 0.01, { seg: 9, seg2: 4, sx: 0.16, sy: 0.16, sz: 0.04, ry: x * 0.72 }); } }
      if (q) b.sph(1, 0xefd6d6, 0, FACE.ny, headZ(0, FACE.ny) + 0.005, { seg: 9, seg2: 6, sx: 0.065, sy: 0.075, sz: 0.07 });
    }),
    // one eye, looking along +z: a dark lash line that peeks out above the white, the white itself and highlights
    eye: mk((b) => {
      const R = HR;
      b.sph(R, INKC, 0, 0.042 * R, -0.022 * R, sp([6, 3], [14, 7], { sx: 0.214, sy: 0.256, sz: 0.06 })); b.sph(R, W, 0, 0, 0, sp([6, 3], [14, 8], { sx: 0.198, sy: 0.24, sz: 0.068 }));
      b.sph(R, W, 0.066 * R, 0.092 * R, 0.1 * R, sp([4, 2], [7, 4], { sx: 0.058, sy: 0.058, sz: 0.027 })); if (q) b.sph(R, W, -0.056 * R, -0.086 * R, 0.106 * R, { seg: 6, seg2: 3, sx: 0.028, sy: 0.028, sz: 0.014 });
    }),
    // the iris takes the eye colour: a darker rim, the colour itself and, in the smooth version, a lighter crescent below
    iris: mk((b) => {
      const R = HR;
      if (q) { b.sph(R, 0x5a5a5a, 0, 0.012 * R, 0.016 * R, { seg: 14, seg2: 6, sx: 0.156, sy: 0.188, sz: 0.07 }); b.sph(R, 0xbdbdbd, 0, 0, 0.024 * R, { seg: 14, seg2: 6, sx: 0.148, sy: 0.178, sz: 0.07 }); b.sph(R, W, 0, -0.07 * R, 0.046 * R, { seg: 9, seg2: 4, sx: 0.1, sy: 0.085, sz: 0.052 }); }
      else b.sph(R, 0xcfcfcf, 0, 0, 0.024 * R, { seg: 6, seg2: 3, sx: 0.152, sy: 0.182, sz: 0.07 });
      b.sph(R, 0x15131c, 0, 0.004 * R, 0.06 * R, sp([4, 2], [10, 5], { sx: 0.074, sy: 0.09, sz: 0.05 }));
    }),
    lid: mk((b) => b.add(new T.TorusGeometry(0.14 * HR, 0.034 * HR, s(3, 6), s(4, 14), Math.PI), INKC, 0, -0.07 * HR, 0.05 * HR)),
    brow: mk((b) => b.sph(HR, D, 0, 0, 0, sp([5, 2], [12, 6], { sx: 0.185, sy: 0.046, sz: 0.038 }))),
    mouth: [
      mk((b) => b.add(new T.TorusGeometry(0.135 * HR, 0.032 * HR, s(3, 6), s(5, 14), Math.PI), MOUTH, 0, 0.078 * HR, 0, { rz: Math.PI })),
      mk((b) => { b.sph(HR, DARK, 0, 0, 0, sp([6, 3], [14, 8], { sx: 0.145, sy: 0.13, sz: 0.042 })); b.sph(HR, 0xff6b81, 0, -0.064 * HR, 0.026 * HR, sp([4, 2], [9, 6], { sx: 0.088, sy: 0.052, sz: 0.03 })); if (q) b.box(0.16 * HR, 0.044 * HR, 0.032 * HR, W, 0, 0.082 * HR, 0.026 * HR); }),
      mk((b) => b.add(new T.TorusGeometry(0.122 * HR, 0.032 * HR, s(3, 6), s(5, 14), Math.PI), MOUTH, 0, -0.078 * HR, 0)),
      mk((b) => b.sph(HR, DARK, 0, 0, 0, sp([5, 3], [12, 8], { sx: 0.08, sy: 0.092, sz: 0.03 }))),
      mk((b) => b.sph(HR, MOUTH, 0, 0, 0, sp([5, 2], [12, 6], { sx: 0.118, sy: 0.026, sz: 0.03 }))),
    ],
    hair: [
      // 0 short, parted at the side
      hd((b) => {
        scalp(b, { puff: (th, a) => top(0.07)(th) + fringe(0.03)(th, a), shift: (a) => (a > 40 ? -4 * clamp((56 - a) / 16, 0, 1) : a < -40 ? 10 * clamp((a + 58) / 18, 0, 1) : -4 + 14 * (40 - a) / 80) });
        bang(b, -0.52, 0.36, 0.4, 0.5, 0.5); bang(b, -0.12, 0.42, 0.4, 0.52, 0.45); bang(b, 0.28, 0.5, 0.36, 0.5, 0.4);
      }),
      // 1 long, with a straight fringe that frames the face
      hd((b) => {
        hairShell(b, lineOver(104, 63), { puff: fringe(0.045) });
        blob(b, 0, -0.5, -0.62, 1.15, 1.2, 0.42); for (const x of [-1, 1]) blob(b, x * 1.02, -0.5, 0.02, 0.22, 0.95, 0.42);   // a cape of hair behind the neck, and a strand in front of each ear
      }),
      // 2 ponytail
      hd((b) => {
        scalp(b, { puff: top(0.04), shift: (a) => -3 * clamp(1 - Math.abs(a) / 36, 0, 1) }); bang(b, -0.4, 0.46, 0.36, 0.56, 0.5); bang(b, 0.34, 0.5, 0.32, 0.5, -0.35);
        b.tor(0.2, 0.07, D, 0, 0.62, -1.2, { rx: 0.5, rs: s(4, 6), seg: s(6, 12) }); blob(b, 0, 0.5, -1.42, 0.3, 0.34, 0.3); blob(b, 0, 0.05, -1.56, 0.26, 0.44, 0.26, { rx: 0.25 }); blob(b, 0, -0.5, -1.56, 0.18, 0.36, 0.18, { rx: -0.15 });
      }),
      // 3 baseball cap: a dome larger than the hair under it, with a peak
      hd((b) => {
        dome(b, W, 0, 0.3, -0.08, 1.1, 0.86, 1.02, 0.57); b.tor(1, 0.03, D, 0, 0.3 + 0.86 * Math.cos(Math.PI * 0.57), -0.08, { rx: Math.PI / 2, sx: 1.074, sy: 0.996, rs: s(3, 5), seg: s(12, 24) });
        b.sph(1, W, 0, 0.135, 1.2, sp([8, 3], [16, 6], { sx: 0.66, sy: 0.05, sz: 0.52, rx: 0.1 })); b.sph(0.1, D, 0, 1.16, -0.08, { seg: 6, seg2: 4 });
      }),
      // 4 a big round head of curls, set back so that the face stays free
      hd((b) => { b.sph(1.32, W, 0, 0.25, -0.48, sp([12, 8], [22, 14])); for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + 0.3; b.sph(0.55, W, Math.cos(a) * 1.02, 0.78 + (i % 2) * 0.24, -0.48 + Math.sin(a) * 1.02, sp([7, 5], [11, 7])); } for (const x of [-1, 1]) blob(b, x * 0.72, 0.86, 0.34, 0.42, 0.34, 0.3); blob(b, 0, 1.02, 0.36, 0.5, 0.34, 0.3); }),
      // 5 sun hat: the crown is wider than the hair under it, the brim has an upper and a lower side
      hd((b) => {
        lathe(b, [[0.82, 0.6], [0.8, 0.62], [0.83, 0.82], [0.86, 1.0], [0.84, 1.16], [0.6, 1.26], [0, 1.29]], s(12, 24), W);
        lathe(b, [[0.86, 0.56], [1.4, 0.5], [1.8, 0.44], [1.84, 0.47], [1.8, 0.5], [1.4, 0.57], [0.82, 0.62]], s(14, 28), W); lathe(b, [[0.835, 0.63], [0.845, 0.69], [0.853, 0.76]], s(12, 24), D);
      }),
      // 6 bob with a fringe
      hd((b) => { hairShell(b, lineOver(122, 63), { puff: (th, a) => top(0.04)(th) + fringe(0.045)(th, a) }); blob(b, 0, -0.2, -0.5, 1.2, 0.9, 0.62); for (const x of [-1, 1]) blob(b, x * 0.98, -0.3, -0.02, 0.26, 0.82, 0.5); }),
      // 7 bun
      hd((b) => { scalp(b); bang(b, -0.48, 0.46, 0.4, 0.56, 0.45); bang(b, 0.48, 0.46, 0.4, 0.56, -0.45); blob(b, 0, 1.2, -0.5, 0.42, 0.4, 0.42); b.tor(0.3, 0.06, D, 0, 0.98, -0.42, { rx: Math.PI / 2 - 0.3, rs: s(4, 6), seg: s(6, 14) }); }),
      // 8 quiff, swept up and back
      hd((b) => { scalp(b, { puff: top(0.08) }); tear(b, 0, 0.92, 0.5, 0.75, 0.62, 0.42, { rx: Math.PI - 0.75 }); tear(b, -0.42, 0.9, 0.36, 0.6, 0.5, 0.4, { rx: Math.PI - 0.6, rz: -0.35 }); tear(b, 0.42, 0.9, 0.36, 0.6, 0.5, 0.4, { rx: Math.PI - 0.6, rz: 0.35 }); for (const x of [-1, 1]) bang(b, x * 0.82, 0.3, 0.3, 0.26, x * 0.1); }),
      // 9 what shows of the hair under a cap, hat or helmet
      hd(under),
      // 10 a guard's peaked cap; its badge is a separate piece
      hd((b) => { lathe(b, [[1.06, 0.3], [1.065, 0.42], [1.08, 0.52], [1.13, 0.68], [1.17, 0.84], [1.15, 0.98], [0.95, 1.1], [0, 1.13]], s(12, 24), W, { sz: 0.97 }); lathe(b, [[1.075, 0.3], [1.08, 0.4], [1.09, 0.5]], s(12, 24), D, { sz: 0.97 }); b.sph(1, D, 0, 0.27, 1.02, sp([8, 3], [16, 6], { sx: 0.72, sy: 0.05, sz: 0.45, rx: 0.3 })); }),
      // 11 a woollen hat that hugs the head, with a rolled edge
      (() => { const b = new Builder(); b.add(headBand(0, 10, 24, 24), W, 0, 0, 0, { sx: 1.13, sy: 1.13, sz: 1.13, rx: -0.26 }); b.add(headBand(9, 10, 24, 24), D, 0, 0, 0, { sx: 1.19, sy: 1.19, sz: 1.19, rx: -0.26 }); b.sph(0.15, D, 0, 1.15, -0.3, { seg: s(6, 10), seg2: s(4, 7) }); const g = b.geo(); g.scale(HR, HR, HR); g.translate(0, HC, 0); return g; })(),
    ],
    skirt: mk((b) => { lathe(b, [[0.09, 0.212], [0.088, 0.222], [0.08, 0.25], [0.068, 0.29], [0.057, 0.318], [0.05, 0.332]], s(8, 18), W); if (q) b.cyl(0.0905, 0.091, 0.008, D, 0, 0.215, 0, { seg: 18 }); }),
    pack: mk((b) => { b.box(0.085, 0.1, 0.045, W, 0, 0.4, -0.06); b.box(0.055, 0.034, 0.01, D, 0, 0.378, -0.086); for (const x of [-0.034, 0.034]) b.box(0.01, 0.09, 0.005, D, x, 0.412, 0.039); }),
    shades: hd((b) => { for (const x of [-1, 1]) b.sph(1, 0x16161a, x * FACE.ex, FACE.ey + 0.01, headZ(FACE.ex, FACE.ey) + 0.035, sp([8, 5], [14, 8], { sx: 0.245, sy: 0.245, sz: 0.06, ry: x * headYaw(FACE.ex, FACE.ey) })); b.box(0.24, 0.06, 0.05, 0x16161a, 0, FACE.ey + 0.05, headZ(0, FACE.ey) + 0.02); for (const x of [-1, 1]) b.box(0.05, 0.05, 0.75, 0x16161a, x * 0.985, FACE.ey + 0.05, 0.2); }),
    // a thief's mask: a band across the eyes that lies a hair's breadth above the face; towards the temples it narrows
    // to a strap, and the strap ends under the hair
    mask: (() => {
      const hp = (th, a) => { let x = Math.sin(th * DEG) * Math.sin(a * DEG), y = Math.cos(th * DEG), z = Math.sin(th * DEG) * Math.cos(a * DEG); if (z > 0.6) z = 0.6 + (z - 0.6) * 0.8; if (y < 0) { const k = 1 - 0.34 * Math.pow(-y, 1.7); x *= k; z *= k; y *= 1.08; } return [x * 0.96 * 1.016, y * 1.016, z * 0.97 * 1.016]; };
      const nc = s(9, 25), nr = s(2, 5), pos = [], ix = [];
      for (let i = 0; i < nc; i++) { const a = -72 + 144 * i / (nc - 1), e = clamp((Math.abs(a) - 36) / 24, 0, 1), k = e * e * (3 - 2 * e), t0 = 78.75 + 7.25 * k, t1 = 112.5 - 18.5 * k; for (let j = 0; j <= nr; j++) pos.push(...hp(t0 + (t1 - t0) * j / nr, a)); }
      for (let i = 0; i < nc - 1; i++) for (let j = 0; j < nr; j++) { const p = i * (nr + 1) + j, d = p + nr + 1; ix.push(p, p + 1, d, d, p + 1, d + 1); }
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(ix); g.computeVertexNormals();
      const b = new Builder(); b.add(g, INKC); const out = b.geo(); out.scale(HR, HR, HR); out.translate(0, HC, 0); return out;
    })(),
    // the string starts at the origin, which is put into the hand that holds it
    balloon: mk((b) => { b.sph(0.115, W, 0, 0.755, 0, { sy: 1.15, seg: s(10, 18), seg2: s(7, 12) }); b.cone(0.02, 0.03, D, 0, 0.615, 0, { seg: 6 }); b.cyl(0.003, 0.003, 0.6, 0x555555, 0, 0.3, 0, { seg: 4 }); if (q) b.sph(0.03, W, -0.045, 0.83, 0.085, { seg: 8, seg2: 5, sz: 0.3, ry: -0.45, rx: -0.4 }); }),
    blob: (() => { const g = new T.CircleGeometry(0.1, 14); g.rotateX(-Math.PI / 2); return g; })(),
  };
}
