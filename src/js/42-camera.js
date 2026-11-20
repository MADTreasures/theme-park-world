/* ================= camera, sky ================= */
const cam = { tx: 1.5, tz: 15, dist: 24, az: 0.62, el: 0.72, d: 24, a: 0.62, e: 0.72 };
const keys = {};
function clampCam() { cam.tx = clamp(cam.tx, -HALF - 4, HALF + 4); cam.tz = clamp(cam.tz, -HALF - 4, HALF + 10); }
function panPx(dx, dy) {
  const wpp = 2 * cam.d * Math.tan(camera.fov * Math.PI / 360) / (canvas.clientHeight || 1), sa = Math.sin(cam.a), ca = Math.cos(cam.a), se = Math.max(0.3, Math.sin(cam.e));
  cam.tx += (-ca * dx - sa * dy / se) * wpp; cam.tz += (sa * dx - ca * dy / se) * wpp; clampCam();
}
function updateCamera(dt) {
  const kx = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0), ky = (keys.s || keys.arrowdown ? 1 : 0) - (keys.w || keys.arrowup ? 1 : 0);
  if (kx || ky) panPx(-kx * dt * 700, -ky * dt * 500);
  const k = 1 - Math.exp(-dt * 12);
  cam.d = lerp(cam.d, cam.dist, k); cam.a = lerp(cam.a, cam.az, k); cam.e = lerp(cam.e, cam.el, k);
  const ce = Math.cos(cam.e);
  camera.position.set(cam.tx + cam.d * Math.sin(cam.a) * ce, 0.4 + cam.d * Math.sin(cam.e), cam.tz + cam.d * Math.cos(cam.a) * ce);
  camera.lookAt(cam.tx, 0.4, cam.tz);
}
const H_DAY = new T.Color(0xe6f6ff), H_NIGHT = new T.Color(0x93a4ff);
const C_DAY = new T.Color(0x8fd3ff), C_DUSK = new T.Color(0xffa877), C_NIGHT = new T.Color(0x10173a), cTmp = new T.Color();
const SUN_DAY = new T.Color(0xfff0d2), SUN_DUSK = new T.Color(0xff9a5a), SUN_NIGHT = new T.Color(0x8fa6ff), W_DAY = new T.Color(0x3aa9dc), W_NIGHT = new T.Color(0x122a55);
let night = 0, shExt = 0;
function updateSky() {
  const d = (S.time % DAY) / DAY;
  const nf = d < 0.06 ? 1 - smooth(0, 0.06, d) : smooth(0.62, 0.72, d);
  const df = Math.max(0, 1 - Math.abs(d - 0.66) / 0.07, 1 - Math.abs(d - 0.03) / 0.05, 1 - Math.abs(d - 1.03) / 0.05);
  night = nf;
  cTmp.copy(C_DAY).lerp(C_NIGHT, nf).lerp(C_DUSK, df * 0.55);
  scene.background.copy(cTmp); scene.fog.color.copy(cTmp);
  hemi.intensity = lerp(0.62, 0.4, nf); hemi.color.copy(H_DAY).lerp(H_NIGHT, nf);
  sun.intensity = lerp(0.74, 0.3, nf) * (1 - df * 0.2);
  sun.color.copy(SUN_DAY).lerp(SUN_NIGHT, nf).lerp(SUN_DUSK, df * 0.6);
  const az = -1 + d * TAU, el = lerp(0.6 + 0.4 * Math.sin(Math.PI * clamp(d / 0.7, 0, 1)), 0.95, nf);
  sunDir.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
  sun.target.position.set(cam.tx, 0, cam.tz); sun.position.copy(sun.target.position).addScaledVector(sunDir, 80);
  waterMat.color.copy(W_DAY).lerp(W_NIGHT, nf);
  weatherSky();
  MAT_LAMP.opacity = nf * 0.6;
  const e = clamp(cam.d * 0.85, 14, 38);
  if (Math.abs(e - shExt) > 0.5) { shExt = e; const c = sun.shadow.camera; c.left = c.bottom = -e; c.right = c.top = e; c.updateProjectionMatrix(); }
}
function resize() {
  const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);

function makeThumbs() {
  const ts = new T.Scene(); ts.background = new T.Color(0xfff6dc);
  ts.add(new T.HemisphereLight(0xffffff, 0x9aa0c0, 0.72));
  const dl = new T.DirectionalLight(0xffffff, 0.6); dl.position.set(3, 6, 4); ts.add(dl);
  const tc = new T.PerspectiveCamera(28, 1, 0.1, 300), box = new T.Box3(), sph = new T.Sphere();
  renderer.setSize(120, 120, false);
  const shoot = (group) => {
    group.traverse((o) => { if (o.material === MAT_LAMP) o.visible = false; });
    for (const c of group.children.slice()) if (c.material === MAT_LAMP) group.remove(c);
    ts.add(group); group.updateMatrixWorld(true); box.setFromObject(group); box.getBoundingSphere(sph);
    const d = sph.radius / Math.sin(14 * Math.PI / 180) * 1.02;
    tc.position.set(sph.center.x + d * 0.55, sph.center.y + d * 0.5, sph.center.z + d * 0.67); tc.lookAt(sph.center);
    renderer.render(ts, tc);
    const url = canvas.toDataURL('image/png');
    ts.remove(group); group.traverse((o) => { if (o.geometry && !o.userData.shared) o.geometry.dispose(); });
    return url;
  };
  for (const k in DEFS) DEFS[k].thumb = shoot(DEFS[k].model().group);
  for (const k in STAFF) STAFF[k].thumb = shoot(staffStatue(k));
}

