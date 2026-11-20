/* ================= water, wild and high attractions ================= */

/* ----- water slide: from the tower through three bends into the pool ----- */
function mSlide() {
  const g = new T.Group(), b = new Builder(), N = 6, seats = [], mats = [];
  const pts = [[-0.9, 2.62, -1.3], [0.2, 2.42, -1.55], [1.05, 2.0, -1.0], [0.2, 1.55, -0.4], [-0.8, 1.15, -0.1], [-1.05, 0.8, 0.6], [-0.3, 0.52, 1.05], [0.5, 0.36, 1.3], [1.0, 0.33, 1.32], [1.35, 1.0, -0.2], [0.3, 2.1, -1.9]];
  const tr = makeTrack(pts, 220), uEnd = tr.uOf(8), iEnd = Math.round(uEnd * tr.K);
  plate(b, 3, 4, 0xf1e6d0);
  railPart(b, tr, 0, iEnd, 0, -0.07, 0.15, WAT, 8); railPart(b, tr, 0, iEnd, 0.17, 0.02, 0.05, K.yel, 5); railPart(b, tr, 0, iEnd, -0.17, 0.02, 0.05, K.yel, 5);
  for (let i = 6; i < iEnd - 8; i += 9) { const p = tr.P[i]; if (p.y > 0.7) b.cyl(0.03, 0.03, p.y - 0.2, K.paper, p.x, (p.y - 0.2) / 2 + 0.05, p.z, { seg: 5 }); }
  // the tower with its stairs
  for (const x of [-1.25, -0.55]) for (const z of [-1.7, -1.0]) b.cyl(0.04, 0.04, 2.6, K.wood, x, 1.33, z, { seg: 6 });
  b.box(0.86, 0.06, 0.86, K.woodD, -0.9, 2.5, -1.35); for (let i = 0; i < 3; i++) b.box(0.8, 0.04, 0.04, K.wood, -0.9, 0.7 + i * 0.6, -1.7);
  b.box(0.3, 0.05, 1.7, K.woodD, -1.25, 1.3, -0.95, { rx: 1.0 }); b.box(1.0, 0.05, 0.5, K.red, -0.9, 3.3, -1.55, { rx: -0.5 }); b.box(1.0, 0.05, 0.5, K.red, -0.9, 3.3, -1.15, { rx: 0.5 });
  for (const x of [-1.25, -0.55]) for (const z of [-1.7, -1.0]) b.cyl(0.02, 0.02, 0.7, K.wood, x, 2.88, z, { seg: 5 });
  poolInto(b, 0.45, 1.3, 1.9, 1.1, 0.2);
  b.box(0.2, 0.02, 0.5, 0xff8fc7, -1.1, 0.09, 1.6, { ry: 0.3 }); addBush(b, -1.15, 0.9, 0.55); b.cyl(0.02, 0.02, 0.9, K.paper, 1.25, 0.5, 0.4, { seg: 5 }); b.cone(0.4, 0.2, K.mint, 1.25, 1.0, 0.4, { seg: 8 });
  g.add(b.mesh());
  const mb = new Builder(); mb.tor(0.11, 0.045, K.pink, 0, 0.03, 0, { rx: Math.PI / 2, rs: 5, seg: 12 });
  const m0 = mb.mesh(false);
  for (let i = 0; i < N; i++) { const m = i ? m0.clone() : m0; g.add(m); mats.push(m); seats.push(seatAt(m, 0, 0.06, -0.02)); }
  const splash = splashMesh(7, 0.14, 0.5, 0.06); splash.position.set(0.95, 0.3, 1.32); g.add(splash);
  let sp = 0;
  const place = (t) => { for (let i = 0; i < N; i++) {
    const q = (t * 0.085 + i / N) % 1, m = mats[i];
    if (q < 0.62) { const k = q / 0.62; onTrack(m, tr, uEnd * (0.25 * k + 0.75 * k * k), 0.05); m.scale.setScalar(1); if (k > 0.96 && sp < 0.3) sp = 1; }
    else m.scale.setScalar(0.0001);
  } };
  place(0);
  return { group: g, seats, update(dt, r) {
    if (sp > 0) { sp = Math.max(0, sp - dt * 2.2); if (sp > 0) splash.scale.set(1.6 - sp * 0.8, Math.sin(sp * Math.PI) * 1.2 + 0.01, 1.6 - sp * 0.8); else splash.scale.setScalar(0.001); }
    if (r.spin > 0.01) place(r.animT);
  } };
}

/* ----- swimming pool: swimmers, a slide and a row of loungers ----- */
function mPool() {
  const g = new T.Group(), b = new Builder(), seats = [], swim = [], WY = 0.31;
  plate(b, 5, 4, 0xf1e6d0);
  poolInto(b, -0.3, -0.45, 4.0, 2.5, 0.22);
  for (let i = 0; i < 12; i++) b.box(0.14, 0.03, 0.03, i % 2 ? K.red : K.paper, -1.95 + i * 0.3, 0.325, -0.45);
  b.box(0.7, 0.05, 0.22, K.paper, -2.15, 0.5, -1.2); b.box(0.12, 0.2, 0.2, K.stone, -2.35, 0.38, -1.2);   // diving board
  // slide tower in the corner
  for (const x of [1.75, 2.25]) for (const z of [-1.75, -1.25]) b.cyl(0.03, 0.03, 1.3, K.paper, x, 0.68, z, { seg: 5 });
  b.box(0.6, 0.05, 0.6, K.blue, 2.0, 1.3, -1.5); b.box(0.36, 0.05, 1.45, K.yel, 1.6, 0.86, -0.9, { rx: -0.65, ry: 0.5 }); b.box(0.2, 0.04, 0.9, K.paper, 2.3, 0.7, -1.0, { rx: 0.9 });
  for (const sx of [-1, 1]) b.box(0.04, 0.12, 1.45, K.yel, 1.6 + sx * 0.17 * 0.88, 0.92, -0.9 - sx * 0.17 * 0.48, { rx: -0.65, ry: 0.5 });
  // deck: loungers, parasols, a lifeguard's chair
  for (let i = 0; i < 3; i++) { const x = -1.9 + i * 0.75; b.box(0.3, 0.05, 0.62, [K.red, K.blue, K.mint][i], x, 0.2, 1.5); b.box(0.3, 0.05, 0.3, [K.red, K.blue, K.mint][i], x, 0.31, 1.82, { rx: -0.8 }); for (const z of [1.3, 1.7]) b.box(0.26, 0.12, 0.03, K.paper, x, 0.12, z); }
  for (const x of [-1.5, -0.75]) { b.cyl(0.02, 0.02, 1.1, K.paper, x, 0.6, 1.72, { seg: 5 }); b.cone(0.42, 0.2, x < -1 ? K.yel : K.pink, x, 1.2, 1.72, { seg: 8 }); }
  for (const x of [0.75, 1.05]) for (const z of [1.4, 1.7]) b.cyl(0.02, 0.02, 0.9, K.paper, x, 0.5, z, { seg: 5 }); b.box(0.36, 0.04, 0.36, K.red, 0.9, 0.95, 1.55); b.box(0.36, 0.3, 0.04, K.red, 0.9, 1.1, 1.72);
  b.tor(0.12, 0.04, K.red, 1.6, 0.12, 1.6, { rx: Math.PI / 2, rs: 5, seg: 12 }); b.sph(0.14, K.yel, 2.1, 0.2, 1.3, { seg: 10, seg2: 7 });
  g.add(b.mesh());
  for (let i = 0; i < 12; i++) {
    const s = seatAt(g, 0, WY - 0.4, 0); s.userData.pose = 'swim'; seats.push(s);
    swim.push({ s, cx: -1.75 + (i % 4) * 0.95 + rnd(-0.1, 0.1), cz: -1.2 + ((i / 4) | 0) * 0.72 + rnd(-0.08, 0.08), rx: rnd(0.22, 0.4), rz: rnd(0.14, 0.26), w: rnd(0.6, 1.0) * (i % 2 ? 1 : -1), ph: rnd(TAU) });
  }
  for (const x of [-1.9, -0.4]) seats.push(seatAt(g, x, 0.25, 1.55, Math.PI));
  const put = (t) => { for (const w of swim) { const a = t * w.w + w.ph; w.s.position.set(w.cx + Math.cos(a) * w.rx, WY - 0.4 + Math.sin(t * 3 + w.ph) * 0.015, w.cz + Math.sin(a) * w.rz); w.s.rotation.y = Math.atan2(-Math.sin(a) * w.rx * w.w, Math.cos(a) * w.rz * w.w); } };
  put(0);
  return { group: g, seats, update(dt, r) { if (r.spin > 0.01) put(r.animT); } };
}

/* ----- water coaster: boats climb high, plunge into a pool and take a hill on the way home ----- */
function mWCoaster() {
  let splash = 0, drops = null, sPool = 0;
  return trackRide({
    pts: [[-1.6, 0.42, 1.5], [0, 0.42, 1.5], [1.8, 0.42, 1.5], [2.95, 0.5, 0.9], [3.1, 1.1, -0.3], [2.3, 2.3, -1.35], [1.0, 3.3, -1.55], [-0.2, 3.2, -1.5], [-1.5, 0.5, -1.45], [-2.6, 0.42, -1.25], [-3.15, 1.25, -0.3], [-2.85, 0.7, 0.95]],
    K: 260, cars: 2, gap: 1.0, lift: 0.02, seats: [[-0.09, 0.1, 0.16], [0.09, 0.1, 0.16], [-0.09, 0.1, -0.14], [0.09, 0.1, -0.14]],
    base(b, tr) {
      plate(b, 7, 4, LAWN);
      railInto(b, tr, 0, -0.07, 0.18, WAT, 8); railInto(b, tr, 0.22, 0.03, 0.05, K.paper, 5); railInto(b, tr, -0.22, 0.03, 0.05, K.paper, 5);
      supportsInto(b, tr, 7, 0.7, K.blue, 0.045);
      poolInto(b, -2.05, -1.4, 2.1, 1.0, 0.2);
      b.box(3.6, 0.3, 0.26, K.stone, 0.1, 0.18, 1.82); canopyInto(b, 0.1, 1.8, 3.7, K.blue, K.paper);
      for (const x of [-0.6, 0.7]) addBush(b, x, 0.2, 0.7); addPalm(b, 0.1, -0.5, 0.8); addPalm(b, 1.3, 0.5, 0.65);
      sPool = tr.uOf(8) * tr.len - CO.home;
    },
    car(c) {
      c.box(0.36, 0.16, 0.7, K.yel, 0, 0.1, 0); c.box(0.3, 0.03, 0.6, K.blue, 0, 0.19, 0); c.cone(0.21, 0.3, K.yel, 0, 0.1, 0.48, { rx: Math.PI / 2, seg: 4, ry: Math.PI / 4 });
      c.box(0.34, 0.14, 0.04, K.paper, 0, 0.24, -0.32); c.box(0.34, 0.1, 0.03, K.paper, 0, 0.22, 0.02);
    },
    tick(dt, m, st, running) {
      if (!drops) { drops = splashMesh(9, 0.3, 0.7, 0.12); drops.position.set(-2.0, 0.3, -1.42); m.group.add(drops); }
      if (running && st.s >= sPool && st.s - st.v * dt * 1.5 < sPool) splash = 1;
      if (splash > 0) { splash = Math.max(0, splash - dt * 1.4); const k = Math.sin(splash * Math.PI); if (splash > 0) drops.scale.set(0.6 + (1 - splash) * 1.2, 0.05 + k * 1.5, 0.6 + (1 - splash) * 1.2); else drops.scale.setScalar(0.001); }
    },
  });
}

/* ----- the wild octopus: five arms rise and fall, the tubs at their ends spin ----- */
function mOcto() {
  const g = new T.Group(), b = new Builder(), BODY = K.vio, seats = [], arms = [];
  b.cyl(1.36, 1.4, 0.1, K.teal, 0, 0.05, 0, { seg: 24 }); b.cyl(0.3, 0.42, 1.2, 0x6f48d6, 0, 0.7, 0, { seg: 12 });
  g.add(b.mesh());
  const rot = new T.Group(); g.add(rot);
  const h = new Builder();
  h.sph(1, BODY, 0, 1.75, 0, { sx: 0.55, sy: 0.62, sz: 0.55, seg: 16, seg2: 11 }); h.cyl(0.5, 0.4, 0.3, BODY, 0, 1.3, 0, { seg: 14 });
  for (const x of [-1, 1]) { h.sph(0.13, 0xffffff, x * 0.2, 1.82, 0.44, { seg: 10, seg2: 7 }); h.sph(0.06, 0x1b1530, x * 0.21, 1.83, 0.54, { seg: 7, seg2: 5 }); h.sph(0.07, K.pink, x * 0.36, 1.62, 0.4, { seg: 6, seg2: 4, sz: 0.4 }); }
  h.tor(0.12, 0.025, 0x1b1530, 0, 1.62, 0.5, { rz: Math.PI, rs: 4, seg: 10 });
  for (let i = 0; i < 7; i++) h.sph(0.06, 0xb79bff, Math.cos(i * 0.9) * 0.36, 2.12 + (i % 2) * 0.1, Math.sin(i * 0.9) * 0.36 - 0.1, { seg: 6, seg2: 4 });
  rot.add(h.mesh());
  const ab = new Builder(), L = Math.hypot(0.95, 0.5);
  ab.cyl(0.07, 0.11, L, BODY, 0.72, -0.25, 0, { rz: -Math.atan2(0.95, -0.5), seg: 8 }); ab.sph(0.12, BODY, 0.25, 0, 0, { seg: 8, seg2: 6 });
  for (let i = 0; i < 4; i++) ab.sph(0.035, K.pink, 0.4 + i * 0.2, -0.16 - i * 0.105, 0, { seg: 5, seg2: 4 });
  const arm0 = ab.mesh(), cb = new Builder();
  cb.cyl(0.27, 0.22, 0.2, K.yel, 0, 0, 0, { seg: 12 }); cb.cyl(0.23, 0.23, 0.03, K.ora, 0, 0.09, 0, { seg: 12 }); cb.cyl(0.03, 0.03, 0.2, K.inkD, 0, 0.16, 0, { seg: 6 }); cb.cyl(0.08, 0.08, 0.02, K.inkD, 0, 0.26, 0, { seg: 8 });
  const car0 = cb.mesh();
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * TAU, piv = new T.Group(); piv.rotation.y = -a; piv.position.y = 1.25; rot.add(piv);
    const ag = new T.Group(); piv.add(ag); ag.add(i ? arm0.clone() : arm0);
    const car = new T.Group(); car.position.set(1.2, -0.62, 0); ag.add(car); car.add(i ? car0.clone() : car0);
    seats.push(seatAt(car, 0.0, 0.1, 0.11, 0), seatAt(car, 0.0, 0.1, -0.11, Math.PI));
    arms.push({ ag, car, ph: i * 1.9 });
  }
  return { group: g, seats, update(dt, r) {
    if (r.spin < 0.01) return;
    rot.rotation.y -= dt * 1.3 * r.spin;
    for (const m of arms) { const t = Math.sin(r.animT * 1.7 + m.ph) * 0.34 * r.spin + 0.1 * r.spin; m.ag.rotation.z = t; m.car.rotation.z = -t; m.car.rotation.y += dt * 3.2 * r.spin; }
  } };
}

/* ----- the saucer: a ring that spins flat and then tips up on its edge ----- */
function mUfo() {
  const g = new T.Group(), b = new Builder(), seats = [], SIL = 0xc9cfe0;
  b.cyl(1.36, 1.4, 0.1, 0x3a3f66, 0, 0.05, 0, { seg: 24 }); b.cyl(0.26, 0.4, 1.25, 0x6a70a0, 0, 0.72, 0, { seg: 10 });
  for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + 0.4; b.box(0.5, 0.06, 0.3, 0x8a8fa8, Math.cos(a) * 0.95, 0.42 - 0, Math.sin(a) * 0.95, { ry: -a, rz: 0.0 }); b.cyl(0.03, 0.03, 0.36, 0x8a8fa8, Math.cos(a) * 1.1, 0.24, Math.sin(a) * 1.1, { seg: 5 }); }
  g.add(b.mesh());
  const tilt = new T.Group(); tilt.position.y = 1.38; g.add(tilt);
  const ring = new T.Group(); tilt.add(ring);
  const r0 = new Builder();
  r0.cyl(1.2, 1.05, 0.12, SIL, 0, 0, 0, { seg: 24 }); r0.cyl(0.6, 1.0, 0.16, 0x9aa0c0, 0, -0.13, 0, { seg: 20 }); r0.tor(1.18, 0.06, K.vio, 0, 0.04, 0, { rx: Math.PI / 2, rs: 6, seg: 28 });
  r0.sph(1, K.mint, 0, 0.06, 0, { sx: 0.5, sy: 0.36, sz: 0.5, seg: 14, seg2: 8 }); r0.sph(0.07, K.bulb, 0, 0.44, 0, { glow: true, seg: 6, seg2: 4 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; r0.sph(0.05, i % 2 ? K.bulb : K.pink, Math.cos(a) * 1.18, 0.11, Math.sin(a) * 1.18, { glow: true, seg: 6, seg2: 4 }); r0.box(0.26, 0.26, 0.04, K.ink, Math.cos(a + 0.26) * 1.03, 0.2, Math.sin(a + 0.26) * 1.03, { ry: -(a + 0.26) + Math.PI / 2 }); }
  ring.add(r0.mesh());
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + 0.26; seats.push(seatAt(ring, Math.cos(a) * 0.9, 0.09, Math.sin(a) * 0.9, Math.atan2(-Math.cos(a), -Math.sin(a)))); }
  return { group: g, seats, update(dt, r) {
    if (r.spin < 0.01 && tilt.rotation.z === 0) return;
    ring.rotation.y -= dt * 2.6 * r.spin;
    tilt.rotation.z = 0.92 * smooth(0.55, 1, r.spin) * (0.85 + 0.15 * Math.sin(r.animT * 0.8));
  } };
}

/* ----- bungee: from the top of the mast, head first ----- */
function mBungee() {
  const g = new T.Group(), b = new Builder(), H = 5.5, seats = [], jump = [];
  plate(b, 2, 2, LAWN);
  for (const x of [-0.82, -0.42]) for (const z of [-0.82, -0.42]) b.cyl(0.035, 0.045, H, K.stone, x, H / 2 + 0.05, z, { seg: 6 });
  for (let y = 0.6; y < H; y += 0.82) { b.box(0.44, 0.03, 0.03, K.stoneD, -0.62, y, -0.82); b.box(0.44, 0.03, 0.03, K.stoneD, -0.62, y, -0.42); b.box(0.03, 0.03, 0.44, K.stoneD, -0.82, y, -0.62); b.box(0.03, 0.03, 0.44, K.stoneD, -0.42, y, -0.62); b.box(0.56, 0.025, 0.025, K.red, -0.62, y + 0.41, -0.42, { rz: (Math.round(y / 0.82) % 2 ? 1 : -1) * 0.95 }); }
  b.box(1.5, 0.07, 0.9, K.red, -0.05, H, -0.2); b.box(1.5, 0.03, 0.03, K.paper, -0.05, H + 0.34, 0.24); b.box(1.5, 0.03, 0.03, K.paper, -0.05, H + 0.34, -0.64); b.box(0.03, 0.03, 0.9, K.paper, 0.69, H + 0.34, -0.2);
  for (const [x, z] of [[-0.78, 0.24], [0.69, 0.24], [-0.78, -0.64], [0.69, -0.64], [0, 0.24], [0, -0.64]]) b.cyl(0.015, 0.015, 0.34, K.paper, x, H + 0.17, z, { seg: 4 });
  b.box(0.08, 0.08, 1.5, K.yel, 0.2, H + 0.75, 0.25); b.cyl(0.03, 0.03, 0.75, K.yel, 0.2, H + 0.38, -0.45, { seg: 5 }); b.box(0.9, 0.07, 0.08, K.yel, 0.2, H + 0.75, 0.9);
  b.box(1.3, 0.3, 1.0, K.blue, 0.25, 0.2, 0.42); for (let i = 0; i < 4; i++) b.box(0.08, 0.31, 1.02, K.yel, -0.3 + i * 0.36, 0.2, 0.42);
  b.sph(0.06, K.bulb, -0.62, H + 0.1, -0.62, { glow: true, seg: 6, seg2: 4 });
  g.add(b.mesh());
  const rg = new T.CylinderGeometry(0.014, 0.014, 1, 5); rg.translate(0, -0.5, 0);
  const rm = softMat({ color: 0xff4f64 }, 0.2, 0);
  for (const x of [-0.15, 0.55]) {
    const hold = new T.Group(); hold.position.set(x, H + 0.04, 0.9); g.add(hold);
    const s = seatAt(hold, 0, 0, 0, Math.PI / 2); s.userData.pose = 'jump'; seats.push(s);
    const rope = new T.Mesh(rg, rm); rope.position.set(x, H + 0.72, 0.9); rope.scale.y = 0.001; g.add(rope);
    jump.push({ hold, rope, x });
  }
  return { group: g, seats, update(dt, r) {
    jump.forEach((j, i) => {
      const t = r.state === 'run' ? r.runT - 0.6 - i * 1.5 : -1;
      if (t <= 0) { j.hold.position.set(j.x, H + 0.04, 0.3 + 0.0); j.hold.rotation.x = 0; j.rope.scale.y = 0.001; return; }
      const y = 2.9 + 2.64 * Math.exp(-0.38 * t) * Math.cos(2.4 * t);
      j.hold.position.set(j.x, y, lerp(0.3, 0.9, smooth(0, 0.5, t))); j.hold.rotation.x = Math.PI * smooth(0.05, 0.6, t) + Math.sin(t * 2.4) * 0.12 * Math.exp(-0.3 * t);
      j.rope.scale.y = Math.max(0.01, H + 0.72 - y);
    });
  } };
}
