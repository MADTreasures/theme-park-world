/* ================= kit for the newer attractions ================= */
// Pieces that many of the newer buildings share: a base plate, a grandstand, a pool, a fence, small animals, a performer,
// a train on a track and vehicles on a round course.
const WAT = 0x4cc3f0, WATD = 0x35a9de, LAWN = 0x8fbf6f, SANDY = 0xe6d3a1;
const plate = (b, w, h, col) => b.box(w - 0.16, 0.06, h - 0.16, col || K.stoneD, 0, 0.03, 0);
// Rows of benches that rise towards the back (+z). Every place gets a seat that looks towards -z, where the show is.
function standInto(g, b, seats, cx, z0, cols, rows, col) {
  const W = cols * 0.3 + 0.12;
  for (let r = 0; r < rows; r++) {
    const top = 0.06 + r * 0.26, z = z0 + r * 0.36;
    if (r) b.box(W, top - 0.06, 0.36, r % 2 ? K.stone : K.stoneD, cx, 0.06 + (top - 0.06) / 2, z);
    b.box(W, 0.05, 0.17, col || K.wood, cx, top + 0.235, z + 0.08); b.box(W, 0.2, 0.04, K.stoneD, cx, top + 0.11, z + 0.15);
    for (let c = 0; c < cols; c++) seats.push(seatAt(g, cx + (c - (cols - 1) / 2) * 0.3, top + 0.26, z + 0.07, Math.PI));
  }
  // a low back rail with posts instead of a wall, so that the audience can be seen from behind
  const zb = z0 + rows * 0.36 - 0.14, yb = 0.06 + (rows - 1) * 0.26;
  b.box(W + 0.08, yb, 0.05, K.stoneD, cx, yb / 2 + 0.03, zb); b.box(W + 0.08, 0.035, 0.035, col || K.wood, cx, yb + 0.5, zb);
  for (let i = 0; i <= 4; i++) b.box(0.035, 0.5, 0.035, col || K.wood, cx - W / 2 + i * W / 4, yb + 0.26, zb);
}
// a basin with a pale rim and water in it; the water lies at height y
function poolInto(b, x, z, w, d, y, rim) {
  b.box(w, y + 0.05, d, rim || 0xf2f6fb, x, (y + 0.05) / 2 + 0.03, z); b.box(w - 0.18, 0.03, d - 0.18, WAT, x, y + 0.075, z);
}
// a paddock fence from one corner to another along an axis
function fenceInto(b, x0, z0, x1, z1, col, h) {
  const L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.round(L / 0.42)), ry = Math.atan2(x1 - x0, z1 - z0) + Math.PI / 2; h = h || 0.3; col = col || K.paper;
  for (let i = 0; i <= n; i++) b.box(0.05, h, 0.05, col, lerp(x0, x1, i / n), h / 2 + 0.05, lerp(z0, z1, i / n));
  for (const y of [h * 0.5, h * 0.9]) b.box(L, 0.03, 0.03, col, (x0 + x1) / 2, y + 0.05, (z0 + z1) / 2, { ry });
}
// Small animals, modelled looking towards +z with their feet on the ground.
function critter(kind, col, s) {
  const b = new Builder(), W = 0xffffff; s = s || 1;
  const quad = (len, wid, hi, leg, c) => {   // a body on four legs
    b.sph(1, c, 0, leg + hi * 0.5, 0, { sx: wid, sy: hi * 0.5, sz: len * 0.5, seg: 10, seg2: 7 });
    for (const [x, z] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) b.cyl(wid * 0.26, wid * 0.22, leg + hi * 0.2, c, x * wid * 0.55, (leg + hi * 0.2) / 2, z * len * 0.3, { seg: 6 });
  };
  if (kind === 'pony' || kind === 'goat' || kind === 'sheep' || kind === 'dog') {
    const P = { pony: [0.52, 0.13, 0.22, 0.2], goat: [0.3, 0.085, 0.14, 0.12], sheep: [0.3, 0.11, 0.17, 0.09], dog: [0.28, 0.07, 0.11, 0.1] }[kind], [len, wid, hi, leg] = P, top = leg + hi;
    quad(len, wid, hi, leg, col);
    const hz = len * 0.5, hy = top + (kind === 'pony' ? 0.12 : 0.03), hc = kind === 'sheep' ? 0x3a3038 : col;
    if (kind === 'pony') { b.cyl(wid * 0.55, wid * 0.7, 0.24, col, 0, top + 0.02, hz - 0.05, { rx: 0.7, seg: 7 }); b.box(0.03, 0.2, 0.2, 0x4a3a2a, 0, top + 0.08, hz - 0.14, { rx: 0.7 }); }
    b.sph(1, hc, 0, hy, hz + (kind === 'pony' ? 0.12 : 0.06), { sx: wid * 0.7, sy: wid * 0.75, sz: wid * (kind === 'pony' ? 1.35 : 1.0), seg: 9, seg2: 6 });
    for (const x of [-1, 1]) b.sph(1, hc, x * wid * 0.55, hy + wid * 0.75, hz + 0.02, { sx: wid * 0.2, sy: wid * (kind === 'dog' ? 0.5 : 0.4), sz: wid * 0.16, seg: 5, seg2: 4, rz: -x * (kind === 'dog' ? 2.2 : 0.5) });
    for (const x of [-1, 1]) b.sph(wid * 0.14, 0x1b1530, x * wid * 0.42, hy + wid * 0.2, hz + wid * (kind === 'pony' ? 1.25 : 0.95), { seg: 5, seg2: 4 });
    if (kind === 'goat') for (const x of [-1, 1]) b.cone(wid * 0.14, wid * 0.9, K.paper, x * wid * 0.3, hy + wid * 0.95, hz + 0.02, { rx: -0.5, seg: 5 });
    if (kind === 'sheep') for (let i = 0; i < 6; i++) b.sph(wid * 0.75, col, Math.cos(i * 1.05) * wid * 0.5, top - hi * 0.25 + (i % 2) * hi * 0.3, (i - 2.5) * len * 0.15, { seg: 6, seg2: 5 });
    b.box(wid * 0.25, kind === 'pony' ? 0.2 : 0.07, wid * 0.25, kind === 'pony' ? 0x4a3a2a : hc, 0, top - (kind === 'pony' ? 0.1 : 0.02), -len * 0.5, { rx: kind === 'pony' ? -0.35 : -0.9 });
    if (kind === 'pony') b.box(wid * 1.5, 0.035, 0.2, K.red, 0, top + 0.01, -0.02);
  } else if (kind === 'rabbit') {
    b.sph(1, col, 0, 0.07, 0, { sx: 0.06, sy: 0.07, sz: 0.085, seg: 8, seg2: 6 }); b.sph(0.05, col, 0, 0.14, 0.07, { seg: 8, seg2: 6 }); b.sph(0.025, W, 0, 0.06, -0.085, { seg: 5, seg2: 4 });
    for (const x of [-1, 1]) { b.sph(1, col, x * 0.022, 0.22, 0.06, { sx: 0.014, sy: 0.055, sz: 0.02, seg: 5, seg2: 4 }); b.sph(0.008, 0x1b1530, x * 0.025, 0.15, 0.11, { seg: 4, seg2: 3 }); }
  } else if (kind === 'swan') {
    b.sph(1, W, 0, 0.09, 0, { sx: 0.1, sy: 0.08, sz: 0.17, seg: 10, seg2: 7 }); b.cone(0.07, 0.16, W, 0, 0.13, -0.17, { rx: -1.9, seg: 6 });
    b.cyl(0.025, 0.035, 0.2, W, 0, 0.2, 0.13, { rx: 0.25, seg: 6 }); b.cyl(0.022, 0.025, 0.1, W, 0, 0.3, 0.17, { rx: 1.3, seg: 6 }); b.sph(0.035, W, 0, 0.3, 0.22, { seg: 7, seg2: 5 }); b.cone(0.018, 0.06, K.ora, 0, 0.29, 0.27, { rx: 1.7, seg: 5 });
    for (const x of [-1, 1]) b.sph(1, W, x * 0.085, 0.13, -0.02, { sx: 0.03, sy: 0.07, sz: 0.14, seg: 6, seg2: 5, rz: x * 0.25 });
  } else if (kind === 'dolphin' || kind === 'orca') {
    const o = kind === 'orca', L = o ? 0.95 : 0.55, R = o ? 0.2 : 0.1, c = o ? 0x1d2030 : 0x7d94ad, belly = o ? W : 0xdfe8f2;
    b.sph(1, c, 0, 0, 0, { sx: R, sy: R * 0.92, sz: L * 0.5, seg: 12, seg2: 8 }); b.sph(1, belly, 0, -R * 0.28, L * 0.06, { sx: R * 0.8, sy: R * 0.72, sz: L * 0.4, seg: 10, seg2: 6 });
    b.cone(R * 0.45, o ? 0.2 : 0.16, c, 0, -R * 0.1, L * 0.52, { rx: Math.PI / 2, seg: 7 });
    b.cone(R * 0.42, o ? 0.42 : 0.2, c, 0, R * 1.05, -L * 0.05, { seg: 4, sx: 0.35, rx: -0.35 });
    b.cone(R * 0.5, L * 0.4, c, 0, 0, -L * 0.55, { rx: -Math.PI / 2, seg: 7 });
    for (const x of [-1, 1]) { b.box(R * 1.1, 0.025, R * 0.75, c, x * R * 0.6, 0.02, -L * 0.78, { ry: x * 0.5 }); b.box(R * 0.9, 0.025, R * 0.5, c, x * R * 0.95, -R * 0.5, L * 0.18, { rz: -x * 0.6, ry: -x * 0.4 }); b.sph(R * 0.09, 0x0d0f18, x * R * 0.72, R * 0.2, L * 0.36, { seg: 5, seg2: 4 }); }
    if (o) for (const x of [-1, 1]) b.sph(1, W, x * R * 0.7, R * 0.42, L * 0.3, { sx: R * 0.12, sy: R * 0.16, sz: R * 0.3, seg: 6, seg2: 4 });
  } else if (kind === 'seal') {
    b.sph(1, col, 0, 0.14, -0.05, { sx: 0.1, sy: 0.12, sz: 0.2, seg: 10, seg2: 7, rx: -0.5 }); b.sph(0.075, col, 0, 0.3, 0.09, { seg: 9, seg2: 6 }); b.sph(0.03, 0x2b2530, 0, 0.29, 0.16, { seg: 6, seg2: 4 });
    for (const x of [-1, 1]) { b.box(0.12, 0.02, 0.08, col, x * 0.12, 0.05, 0.04, { ry: x * 0.5 }); b.sph(0.012, 0x0d0f18, x * 0.035, 0.33, 0.145, { seg: 4, seg2: 3 }); }
    b.box(0.16, 0.02, 0.1, col, 0, 0.03, -0.26);
  }
  const m = b.mesh(false); m.scale.setScalar(s); return m;
}
// A performer: one of the park's own people, built from the smooth figure parts, with arms and head that can move.
// o: shirt, pants, skin, hair (style), hairCol, browCol, trim, shoe, eye, top (0 tee, 1 sleeveless, 2 jacket), mouth, cape (colour)
const ACTOR_MATS = {};   // one material per colour, shared by all performers
function actor(o) {
  const g = new T.Group(), mats = ACTOR_MATS;
  const mat = (col, flat) => { const k = col + (flat ? 'f' : ''); return mats[k] || (mats[k] = flat ? new T.MeshBasicMaterial({ color: col, vertexColors: true }) : softMat({ color: col, vertexColors: true }, 0.5, 0.16)); };
  const part = (parent, geo, col, x, y, z, rx, ry, rz, flat) => { const m = new T.Mesh(geo, mat(col, flat)); m.position.set(x || 0, y || 0, z || 0); m.rotation.set(rx || 0, ry || 0, rz || 0); m.userData.shared = true; parent.add(m); return m; };
  const skin = o.skin || 0xf1c39a, shirt = o.shirt || K.red, pants = o.pants || K.ink, trim = o.trim === undefined ? 0xffffff : o.trim, top = o.top === undefined ? 2 : o.top, brow = o.browCol || 0x3d2616;
  part(g, FGH.torso, shirt); part(g, FGH.trim, trim); if (top === 2) part(g, FGH.zip, trim); part(g, FGH.pelvis, pants);
  if (o.cape) part(g, FGH.cape, o.cape);
  const head = part(g, FGH.head, skin, 0, FIG.NECK, 0);
  if (o.hair >= 0) { part(head, FGH.hair[o.hair], o.hairCol || brow); if (HATS[o.hair]) part(head, FGH.hair[HATS[o.hair] === 2 ? 0 : 9], brow); }
  for (const sd of [-1, 1]) {
    part(head, FGH.eye, 0xffffff, sd * FIG.EX, FIG.EY, FIG.EZ, 0, sd * FIG.EYAW, 0, true); part(head, FGH.iris, o.eye || 0x5b3a1e, sd * FIG.EX, FIG.EY, FIG.EZ, 0, sd * FIG.EYAW, 0, true);
    part(head, FGH.brow, brow, sd * FIG.EX, FIG.BROW[0] + 0.004, FIG.BROW[1], 0, sd * FIG.BYAW, 0);
  }
  part(head, FGH.mouth[o.mouth === undefined ? 1 : o.mouth], 0xffffff, 0, FIG.MOUTH[0], FIG.MOUTH[1]);
  const arms = [], fores = [];
  for (const sd of [-1, 1]) {
    const th = part(g, FGH.thigh, pants, sd * FIG.LX, FIG.HIP, 0), sh = part(th, FGH.shin, pants, 0, -FIG.THIGH, 0); part(sh, FGH.shoe, o.shoe || 0x2b2b33); part(sh, FGH.sole, 0xffffff);
    const up = part(g, FGH.upper, top === 2 ? shirt : skin, sd * FIG.SX, FIG.SHO, 0, 0.05, 0, sd * 0.13); if (top === 0) part(up, FGH.cap, shirt); if (top === 2) part(up, FGH.stripe, trim);
    const fo = part(up, FGH.forearm, top === 2 ? shirt : skin, 0, -FIG.UARM, 0, -0.3); part(fo, FGH.hand, skin); part(fo, FGH.wrist, trim);
    arms.push(up); fores.push(fo);
  }
  return { group: g, head, armL: arms[0], armR: arms[1], foreL: fores[0], foreR: fores[1] };
}
// A train on a closed track, driven by the same physics as the big coaster.
// o: pts, K, base(builder, track), car(builder), cars, seats [[x, y, z], ...] per car, gap, lift, pose, tick(dt, model, state, running)
function trackRide(o) {
  const g = new T.Group(), b = new Builder(), tr = makeTrack(o.pts, o.K || 200);
  o.base(b, tr); g.add(b.mesh());
  const cb = new Builder(); o.car(cb); const car0 = cb.mesh(), cars = [], seats = [];
  for (let i = 0; i < o.cars; i++) { const c = i ? car0.clone() : car0; g.add(c); cars.push(c); for (const p of o.seats) { const s = seatAt(c, p[0], p[1], p[2]); if (o.pose) s.userData.pose = o.pose; seats.push(s); } }
  const st = { s: 0, v: 0 }; let running = false, fin = false;
  const pose = () => { for (let i = 0; i < cars.length; i++) onTrack(cars[i], tr, (CO.home + st.s - i * o.gap) / tr.len, o.lift === undefined ? 0.09 : o.lift); };
  pose();
  const m = { group: g, seats, tr, cars, start() { st.s = 0; st.v = 0; running = true; fin = false; }, done() { return fin; }, update(dt, r) {
    if (o.tick) o.tick(dt, m, st, running, r);
    if (!running) return;
    if (coasterAdvance(st, dt, tr.curve, tr.len)) { st.s = 0; running = false; fin = true; }
    pose();
  } };
  return m;
}
// Vehicles that go round a closed course at an even pace while the ride runs.
// o: pts or tr, K, n, veh(builder) or mesh, seats [[x, y, z, ry], ...] per vehicle, speed, lift, pose, level, u0, spread (share of the course
// the vehicles are spread over)
function circuit(g, o) {
  const tr = o.tr || makeTrack(o.pts, o.K || 120), vb = new Builder(); if (o.veh) o.veh(vb); const v0 = o.mesh || vb.mesh(), vs = [], seats = [];
  for (let i = 0; i < o.n; i++) { const v = i ? v0.clone() : v0; g.add(v); vs.push(v); for (const p of o.seats || []) { const s = seatAt(v, p[0], p[1], p[2], p[3]); if (o.pose) s.userData.pose = o.pose; seats.push(s); } }
  let u = o.u0 || 0;
  const place = () => { for (let i = 0; i < o.n; i++) {
    const w = u + i / o.n * (o.spread || 1);
    if (o.level) { const q = ((w % 1) + 1) % 1; tr.curve.getPointAt(q, _tp); tr.curve.getTangentAt(q, _tt); vs[i].position.copy(_tp); vs[i].rotation.set(0, Math.atan2(_tt.x, _tt.z), 0); }   // hangs level, like a gondola
    else onTrack(vs[i], tr, w, o.lift || 0);
  } };
  place();
  return { tr, vs, seats, get u() { return u; }, step(dt, spin) { u += dt * o.speed * spin / tr.len; place(); } };
}
// water thrown up where something plunges in: a ring of thin jets, hidden until it is scaled up
function splashMesh(n, r, h, w) {
  const sb = new Builder();
  for (let i = 0; i < n; i++) { const a = i / n * TAU; sb.cone(w, h, 0xe9f8ff, Math.cos(a) * r, h / 2, Math.sin(a) * r * 0.75, { rx: Math.PI, rz: Math.cos(a) * 0.5, seg: 5 }); }
  const m = sb.mesh(false); m.scale.setScalar(0.001); return m;
}
// part of a track as a tube: from sample i0 to i1, moved sideways by off and up by dy
function railPart(b, tr, i0, i1, off, dy, rad, col, rs) {
  const pts = []; for (let i = i0; i <= i1; i++) { const k = i % tr.K, p = tr.P[k]; pts.push(new T.Vector3(p.x + tr.SD[k].x * off, p.y + dy, p.z + tr.SD[k].z * off)); }
  b.add(new T.TubeGeometry(new T.CatmullRomCurve3(pts), Math.max(4, i1 - i0), rad, rs || 5, false), col);
}
// a canopy over a station at the front of a ride, like the ones of the coasters
function canopyInto(b, x, z, w, c1, c2) {
  for (const sx of [-1, 1]) b.cyl(0.03, 0.03, 1.3, K.paper, x + sx * (w / 2 - 0.08), 0.65, z + 0.12, { seg: 6 });
  const n = Math.max(3, Math.round(w / 0.44)); for (let i = 0; i < n; i++) b.box(w / n, 0.05, 0.9, i % 2 ? c2 : c1, x - w / 2 + (i + 0.5) * w / n, 1.28, z - 0.25, { rx: 0.14 });
}
