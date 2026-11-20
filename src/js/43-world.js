/* ================= living world ================= */
// Things that make the island feel alive: moving water and surf, gulls, sailing boats, a lighthouse, a hot-air balloon,
// sun, moon and stars, beach life, and tufts of grass and wild flowers on every free tile.
let waterTex = null, foamMat = null, beamMat = null, starMat = null, sunDisc = null, moonDisc = null, hotAir = null, beam = null, iTuft = null, iBloom = null, tuftV = -1;
const gulls = [], sails = [], lampLights = [];
let lampTick = 0;
const LAMP_FIXED = [[wX(HALF) - 1.05, HALF + 0.08], [wX(HALF) + 1.05, HALF + 0.08], [wX(HALF), HALF + 5.5], [wX(HALF), HALF + 11]];
// Only a handful of real lights exist. Every few frames they move to the lanterns nearest to the view.
function updateLampLights() {
  if (night < 0.05) { for (const l of lampLights) l.intensity = 0; return; }
  if (--lampTick > 0) { for (const l of lampLights) if (l.userData.on) l.intensity = night * 1.1; return; }
  lampTick = 12;
  const c = LAMP_FIXED.map((p) => [p[0], p[1], 0]);
  for (const d of decos) if (d.k === 'lamp') c.push([d.group.position.x, d.group.position.z, 0]);
  for (const b of builds) if (b.def.guards || b.def.housing) c.push([b.group.position.x, b.group.position.z, 0]);
  for (const p of c) p[2] = (p[0] - cam.tx) * (p[0] - cam.tx) + (p[1] - cam.tz) * (p[1] - cam.tz);
  c.sort((a, b) => a[2] - b[2]);
  lampLights.forEach((l, i) => { const p = c[i]; l.userData.on = !!p; if (p) { l.position.set(p[0], 1.6, p[1]); l.intensity = night * 1.1; } else l.intensity = 0; });
}
function buildWorldExtras() {
  waterTex = canvasTex(256, 256, (c, w) => {
    c.fillStyle = '#e9f5ff'; c.fillRect(0, 0, w, w); c.lineCap = 'round';
    for (let i = 0; i < 70; i++) { const x = rnd(w), y = rnd(w), l = rnd(14, 44); c.strokeStyle = i % 3 ? 'rgba(255,255,255,.9)' : 'rgba(110,165,205,.35)'; c.lineWidth = rnd(1.5, 3.5); c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + l / 2, y - rnd(3, 8), x + l, y); c.stroke(); }
  });
  waterTex.wrapS = waterTex.wrapT = T.RepeatWrapping; waterTex.repeat.set(70, 70);
  waterMat.map = waterTex; waterMat.needsUpdate = true;
  foamMat = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false });
  const R = HALF + 5.7;
  for (const [x, z, w, d] of [[0, -R, R * 2 + 0.7, 0.7], [0, R, R * 2 + 0.7, 0.7], [-R, 0, 0.7, R * 2 + 0.7], [R, 0, 0.7, R * 2 + 0.7]]) { const m = new T.Mesh(new T.BoxGeometry(w, 0.02, d), foamMat); m.position.set(x, -0.44, z); scene.add(m); }

  const b = new Builder(), GX = wX(HALF);
  // beach life
  const beachSpot = () => { for (let k = 0; k < 20; k++) { const side = rint(0, 3), along = rnd(-HALF, HALF), off = HALF + rnd(1.1, 2.7), x = side === 0 ? along : side === 1 ? -off : side === 2 ? along : off, z = side === 0 ? off : side === 2 ? -off : along; if (!(z > HALF && Math.abs(x - GX) < 4)) return [x, z]; } return [-HALF - 2, 0]; };
  for (let i = 0; i < 14; i++) {
    const [x, z] = beachSpot(), c1 = pick([K.red, K.blue, K.yel, K.mint, K.pink, K.ora]);
    b.cyl(0.02, 0.02, 1.0, K.paper, x, 0.48, z, { seg: 5, rz: 0.12 }); b.scone(0.6, 0.26, [c1, K.paper], 8, x - 0.06, 1.05, z);
    b.box(0.5, 0.02, 0.9, pick([K.blue, K.pink, K.yel, K.mint]), x + 0.5, 0.0, z + rnd(-0.2, 0.2), { ry: rnd(-0.4, 0.4) });
    if (i % 2) b.sph(0.12, pick([K.red, K.yel, K.blue]), x - 0.5, 0.1, z + 0.4, { seg: 8, seg2: 6 });
  }
  for (let i = 0; i < 6; i++) { const [x, z] = beachSpot(); b.cyl(0.22, 0.3, 0.2, 0xd7bd80, x, 0.08, z, { seg: 8 }); b.cone(0.13, 0.22, 0xd7bd80, x, 0.29, z, { seg: 6 }); for (const a of [0.5, 2.6, 4.6]) b.cyl(0.07, 0.08, 0.2, 0xd7bd80, x + Math.cos(a) * 0.24, 0.1, z + Math.sin(a) * 0.24, { seg: 6 }); b.box(0.008, 0.16, 0.008, K.inkD, x, 0.47, z); b.box(0.08, 0.05, 0.006, K.red, x + 0.04, 0.52, z); }
  for (let i = 0; i < 4; i++) { const [x, z] = beachSpot(), ry = rnd(TAU); b.box(0.5, 0.16, 1.2, pick([K.blue, K.red, K.teal]), x, 0.07, z, { ry }); b.box(0.42, 0.04, 1.1, K.paper, x, 0.15, z, { ry }); b.box(0.44, 0.04, 0.1, K.wood, x, 0.14, z, { ry }); }
  // buoys and pier lanterns
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + 0.3, r = HALF + rnd(10, 16); b.sph(0.22, i % 2 ? K.red : K.ora, Math.cos(a) * r, -0.36, Math.sin(a) * r, { seg: 7, seg2: 5 }); b.cyl(0.02, 0.02, 0.4, K.paper, Math.cos(a) * r, -0.05, Math.sin(a) * r, { seg: 4 }); }
  for (let z = HALF + 3; z <= HALF + 13; z += 3.3) for (const sx of [-0.95, 0.95]) { b.cyl(0.02, 0.025, 1.0, K.inkD, GX + sx, 0.5, z, { seg: 5 }); b.sph(0.07, K.bulb, GX + sx, 1.04, z, { glow: true, seg: 6, seg2: 4 }); }
  // lighthouse on its own rock
  const LX = -HALF - 13, LZ = HALF + 9;
  b.ico(3.2, 0x8f93a6, LX, -0.9, LZ, { sy: 0.5, det: 1 }); b.ico(1.6, 0xa3a7b8, LX + 2, -0.6, LZ + 1.2, { sy: 0.5 });
  b.scyl(0.75, 1.0, 1.6, [K.red, K.red], 10, LX, 1.3, LZ); b.scyl(0.62, 0.75, 1.4, [K.paper, K.paper], 10, LX, 2.8, LZ); b.scyl(0.5, 0.62, 1.4, [K.red, K.red], 10, LX, 4.2, LZ);
  b.cyl(0.72, 0.72, 0.1, K.inkD, LX, 4.95, LZ, { seg: 10 }); b.cyl(0.36, 0.36, 0.6, 0xfff2a8, LX, 5.3, LZ, { seg: 8, glow: true }); b.cone(0.55, 0.5, K.inkD, LX, 5.85, LZ, { seg: 8 });
  b.box(0.3, 0.5, 0.05, K.inkD, LX, 0.8, LZ + 0.98);
  scene.add(b.mesh());
  beamMat = new T.MeshBasicMaterial({ color: 0xfff2a8, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide });
  const bg = new T.CylinderGeometry(0.2, 2.6, 26, 10, 1, true); bg.translate(0, -13, 0); bg.rotateZ(Math.PI / 2);
  beam = new T.Mesh(bg, beamMat); beam.position.set(LX, 5.3, LZ); scene.add(beam);
  for (let i = 0; i < 4; i++) { const l = new T.PointLight(0xffd9a0, 0, 9, 1.4); scene.add(l); lampLights.push(l); }
  // gulls
  const gb = new Builder(); gb.sph(0.09, 0xffffff, 0, 0, 0, { sz: 2.2, seg: 6, seg2: 4 }); gb.cone(0.03, 0.08, K.ora, 0, 0, 0.22, { rx: Math.PI / 2, seg: 4 });
  const wb = new Builder(); wb.box(0.42, 0.012, 0.13, 0xf4f4f4, 0.21, 0, 0); wb.box(0.14, 0.013, 0.1, 0x555a6a, 0.44, 0, 0);
  const bodyG = gb.geo(), wingG = wb.geo();
  for (let i = 0; i < 8; i++) {
    const g = new T.Group(), wl = new T.Mesh(wingG, MAT), wr = new T.Mesh(wingG, MAT); wr.scale.x = -1;
    g.add(new T.Mesh(bodyG, MAT), wl, wr);
    g.userData = { cx: rnd(-26, 26), cz: rnd(-26, 30), r: rnd(5, 14), h: rnd(6, 13), sp: rnd(0.25, 0.5) * (i % 2 ? 1 : -1), ph: rnd(TAU), wl, wr };
    scene.add(g); gulls.push(g);
  }
  // sailing boats
  for (let i = 0; i < 4; i++) {
    const sb = new Builder(), c = pick([K.red, K.blue, K.yel, K.mint]);
    sb.box(0.7, 0.3, 2.0, K.paper, 0, 0.05, 0); sb.box(0.5, 0.3, 0.5, K.paper, 0, 0.05, 1.1, { ry: Math.PI / 4 }); sb.box(0.74, 0.08, 2.04, c, 0, 0.2, 0);
    sb.cyl(0.03, 0.03, 2.6, K.woodD, 0, 1.5, 0.1, { seg: 5 }); sb.cone(0.9, 2.2, 0xffffff, 0, 1.6, -0.35, { seg: 3, sx: 0.08 }); sb.cone(0.6, 1.5, c, 0, 1.3, 0.6, { seg: 3, sx: 0.08 });
    const m = sb.mesh(false); m.userData = { r: rnd(48, 85), a: rnd(TAU), sp: rnd(0.012, 0.03) * (i % 2 ? 1 : -1), ph: rnd(TAU) };
    scene.add(m); sails.push(m);
  }
  // hot-air balloon
  const hb = new Builder(), hc = [K.red, K.yel, K.blue, K.paper];
  for (let i = 0; i < 12; i++) hb.add(new T.SphereGeometry(1.5, 2, 8, i / 12 * TAU, TAU / 12), hc[i % 4], 0, 0, 0, { sy: 1.15 });
  hb.cyl(0.55, 0.3, 0.7, K.red, 0, -1.9, 0, { seg: 10 }); hb.box(0.5, 0.4, 0.5, K.wood, 0, -2.9, 0);
  for (const [x, z] of [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]]) hb.cyl(0.012, 0.012, 0.6, K.inkD, x, -2.45, z, { seg: 3 });
  hotAir = hb.mesh(false); hotAir.userData = { a: rnd(TAU) }; scene.add(hotAir);
  // sun, moon and stars
  sunDisc = new T.Mesh(new T.CircleGeometry(16, 24), new T.MeshBasicMaterial({ color: 0xfff3b0, fog: false, transparent: true })); scene.add(sunDisc);
  moonDisc = new T.Mesh(new T.CircleGeometry(9, 24), new T.MeshBasicMaterial({ color: 0xe9eeff, fog: false, transparent: true, opacity: 0 })); scene.add(moonDisc);
  const sp = [];
  for (let i = 0; i < 320; i++) { const a = rnd(TAU), e = rnd(0.12, 1.5); sp.push(Math.cos(a) * Math.cos(e) * 420, Math.sin(e) * 420, Math.sin(a) * Math.cos(e) * 420); }
  const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.Float32BufferAttribute(sp, 3));
  starMat = new T.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false });
  const stars = new T.Points(sg, starMat); stars.frustumCulled = false; scene.add(stars);
  // grass tufts and wild flowers, one instance per decorated tile
  const tb = new Builder(); for (const [x, z, h] of [[0, 0, 0.16], [0.07, 0.04, 0.12], [-0.06, 0.05, 0.11], [0.02, -0.07, 0.13]]) tb.cone(0.035, h, 0xffffff, x, h / 2, z, { seg: 4 });
  iTuft = inst(tb.geo(), new T.MeshLambertMaterial({ vertexColors: true }), 800, false);
  const fb = new Builder(); fb.cyl(0.008, 0.008, 0.14, 0x4f9a3a, 0, 0.07, 0, { seg: 3 }); fb.sph(0.04, 0xffffff, 0, 0.16, 0, { seg: 6, seg2: 4 }); fb.sph(0.018, 0xffe066, 0, 0.185, 0, { seg: 4, seg2: 3 });
  iBloom = inst(fb.geo(), new T.MeshLambertMaterial({ vertexColors: true }), 400, false);
}
const TUFT_COL = [0x58ad46, 0x4c9f3f, 0x6cbf52, 0x7ac85a], BLOOM_COL = [0xffffff, 0xff8fc7, 0xffd23f, 0xb79cff, 0xff6b6b, 0x9fd8ff];
function rebuildTufts() {
  tuftV = pathVersion; let n = 0, m = 0;
  for (let i = 0; i < N * N; i++) {
    if (tType[i] !== 0) continue;
    const h = ((i * 7919) % 1013) / 1013, h2 = ((i * 104729) % 997) / 997, x = wX(tX(i)) + (h2 - 0.5) * 0.7, z = wZ(tY(i)) + (h - 0.5) * 0.7;
    if (h < 0.3 && n < 800) { _gq.setFromAxisAngle(UP, h * 40); _gs.setScalar(0.8 + h2 * 0.7); iTuft.setMatrixAt(n, _gm.compose(_gp.set(x, 0, z), _gq, _gs)); iTuft.setColorAt(n, _gc.set(TUFT_COL[i % 4])); n++; }
    else if (h > 0.9 && m < 400) { _gq.setFromAxisAngle(UP, h2 * 6); _gs.setScalar(0.8 + h2 * 0.6); iBloom.setMatrixAt(m, _gm.compose(_gp.set(x, 0, z), _gq, _gs)); iBloom.setColorAt(m, _gc.set(BLOOM_COL[i % 6])); m++; }
  }
  iTuft.count = n; iBloom.count = m;
  iTuft.instanceMatrix.needsUpdate = iBloom.instanceMatrix.needsUpdate = iTuft.instanceColor.needsUpdate = iBloom.instanceColor.needsUpdate = true;
}
function updateWorldExtras(rdt) {
  const t = performance.now() / 1000;
  if (tuftV !== pathVersion) rebuildTufts();
  updateLampLights();
  waterTex.offset.x += rdt * 0.012; waterTex.offset.y += rdt * 0.007;
  foamMat.opacity = (0.4 + 0.2 * Math.sin(t * 0.9)) * (1 - night * 0.5);
  for (const g of gulls) {
    const u = g.userData, a = t * u.sp + u.ph;
    g.position.set(u.cx + Math.cos(a) * u.r, u.h + Math.sin(t * 0.7 + u.ph) * 0.8, u.cz + Math.sin(a) * u.r);
    g.rotation.y = -a + (u.sp > 0 ? 0 : Math.PI); g.rotation.z = (u.sp > 0 ? -1 : 1) * 0.3;
    const f = Math.sin(t * 7 + u.ph) * 0.55; u.wl.rotation.z = f; u.wr.rotation.z = -f;
  }
  for (const m of sails) { const u = m.userData; u.a += u.sp * rdt; m.position.set(Math.cos(u.a) * u.r, -0.42 + Math.sin(t * 1.2 + u.ph) * 0.05, Math.sin(u.a) * u.r); m.rotation.y = -u.a + (u.sp > 0 ? 0 : Math.PI); m.rotation.z = Math.sin(t * 0.9 + u.ph) * 0.05; }
  const h = hotAir.userData; h.a += rdt * 0.02; hotAir.position.set(Math.cos(h.a) * 38, 19 + Math.sin(t * 0.3) * 1.5, Math.sin(h.a * 1.3) * 34);
  beam.rotation.y = t * 0.7; beamMat.opacity = night * 0.22;
  starMat.opacity = night * 0.9;
  sunDisc.position.copy(camera.position).addScaledVector(sunDir, 400); sunDisc.lookAt(camera.position); sunDisc.material.opacity = 1 - night;
  moonDisc.position.copy(camera.position).addScaledVector(sunDir, 400); moonDisc.lookAt(camera.position); moonDisc.material.opacity = night;
}
