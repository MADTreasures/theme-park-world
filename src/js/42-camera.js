/* ================= camera, sky ================= */
const cam = { tx0: 1.5, tz0: HALF - 5, dist0: 24, tx: 1.5, tz: HALF - 5, dist: 24, az: 0.62, el: 0.72, d: 24, a: 0.62, e: 0.72 };
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
const H_DAY = new T.Color(0xeaf6ff), H_NIGHT = new T.Color(0x93a4ff);
const C_DAY = new T.Color(0x8fd3ff), C_DUSK = new T.Color(0xffa877), C_NIGHT = new T.Color(0x10173a), cTmp = new T.Color();
const SUN_DAY = new T.Color(0xfff0d2), SUN_DUSK = new T.Color(0xff9a5a), SUN_NIGHT = new T.Color(0x8fa6ff), W_DAY = new T.Color(0x3aa9dc), W_NIGHT = new T.Color(0x122a55);
let night = 0, shExt = 0;
function updateSky() {
  const d = ((STUDIO ? (STU.night ? DAY * 0.86 : DAY * 0.33) : S.time) % DAY) / DAY;   // the figure studio keeps its own time of day
  const nf = d < 0.06 ? 1 - smooth(0, 0.06, d) : smooth(0.62, 0.72, d);
  const df = Math.max(0, 1 - Math.abs(d - 0.66) / 0.07, 1 - Math.abs(d - 0.03) / 0.05, 1 - Math.abs(d - 1.03) / 0.05);
  night = nf;
  cTmp.copy(C_DAY).lerp(C_NIGHT, nf).lerp(C_DUSK, df * 0.55);
  scene.background.copy(cTmp); scene.fog.color.copy(cTmp);
  hemi.intensity = lerp(0.6, 0.5, nf); hemi.color.copy(H_DAY).lerp(H_NIGHT, nf);
  sun.intensity = lerp(0.45, 0.3, nf) * (1 - df * 0.2);
  sun.color.copy(SUN_DAY).lerp(SUN_NIGHT, nf).lerp(SUN_DUSK, df * 0.6);
  const az = -1 + d * TAU, el = lerp(0.6 + 0.4 * Math.sin(Math.PI * clamp(d / 0.7, 0, 1)), 0.95, nf);
  sunDir.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
  sun.target.position.set(cam.tx, 0, cam.tz); sun.position.copy(sun.target.position).addScaledVector(sunDir, 80);
  waterMat.color.copy(W_DAY).lerp(W_NIGHT, nf);
  weatherSky();
  SKYLIGHT.value.copy(hemi.color).multiplyScalar(hemi.intensity * 1.1);
  MAT_LAMP.opacity = nf * 0.8;
  const e = clamp(cam.d * 0.85, 14, 38);
  if (Math.abs(e - shExt) > 0.5) { shExt = e; const c = sun.shadow.camera; c.left = c.bottom = -e; c.right = c.top = e; c.updateProjectionMatrix(); }
}
function resize() {
  const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  const pr = renderer.getPixelRatio(); lineSize(Math.floor(w * pr), Math.floor(h * pr), pr);
}
window.addEventListener('resize', resize);
if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);

/* ----- pictures for the cards ----- */
// They are taken in the background, one per frame, on a small off-screen target; the cards of an opened tab come first.
// So nothing holds up the start of the game, however many attractions there are.
const TH = { queue: [], scene: null, cam: null, rt: null, buf: null, big: null, small: null, box: new T.Box3(), sph: new T.Sphere() }, TH_BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
function makeThumbs() {
  TH.scene = new T.Scene(); TH.scene.background = new T.Color(0xfff6dc);
  TH.scene.add(new T.HemisphereLight(0xffffff, 0x9aa0c0, 0.72));
  const dl = new T.DirectionalLight(0xffffff, 0.6); dl.position.set(3, 6, 4); TH.scene.add(dl);
  TH.cam = new T.PerspectiveCamera(28, 1, 0.1, 300);
  TH.rt = new T.WebGLRenderTarget(256, 256); TH.buf = new Uint8Array(256 * 256 * 4);
  TH.big = document.createElement('canvas'); TH.big.width = TH.big.height = 256; TH.small = document.createElement('canvas'); TH.small.width = TH.small.height = 128;
  for (const k in DEFS) TH.queue.push(k); for (const k in STAFF) TH.queue.push('@' + k);
}
function shootThumb(group) {
  group.traverse((o) => { if (o.material === MAT_LAMP) o.visible = false; });
  for (const c of group.children.slice()) if (c.material === MAT_LAMP) group.remove(c);
  TH.scene.add(group); group.updateMatrixWorld(true); TH.box.setFromObject(group); TH.box.getBoundingSphere(TH.sph);
  const d = TH.sph.radius / Math.sin(14 * Math.PI / 180) * 1.02, c = TH.sph.center;
  TH.cam.position.set(c.x + d * 0.55, c.y + d * 0.5, c.z + d * 0.67); TH.cam.lookAt(c);
  renderer.setRenderTarget(TH.rt); renderer.render(TH.scene, TH.cam); renderer.readRenderTargetPixels(TH.rt, 0, 0, 256, 256, TH.buf); renderer.setRenderTarget(null);
  TH.scene.remove(group); group.traverse((o) => { if (o.geometry && !o.userData.shared) o.geometry.dispose(); });
  // the pixels come bottom row first; turned over and halved in size, which also smooths the edges
  const cb = TH.big.getContext('2d'), img = cb.createImageData(256, 256);
  for (let y = 0; y < 256; y++) img.data.set(TH.buf.subarray((255 - y) * 1024, (256 - y) * 1024), y * 1024);
  cb.putImageData(img, 0, 0);
  const cs = TH.small.getContext('2d'); cs.imageSmoothingQuality = 'high'; cs.drawImage(TH.big, 0, 0, 128, 128);
  return TH.small.toDataURL('image/png');
}
// the picture of a card, taken now if it does not exist yet; q is a key of DEFS, or of STAFF with an @ in front
function thumbNow(q) { const d = q[0] === '@' ? STAFF[q.slice(1)] : DEFS[q]; if (!d.thumb) d.thumb = shootThumb(q[0] === '@' ? staffStatue(q.slice(1)) : d.model().group); return d.thumb; }
// once per frame: the next picture that is still missing; cards that wait for theirs get it
function thumbTick() {
  while (TH.queue.length) {
    const q = TH.queue.shift(), d = q[0] === '@' ? STAFF[q.slice(1)] : DEFS[q]; if (d.thumb) continue;
    thumbNow(q);
    const im = document.querySelector('#tray img[data-th="' + q + '"]'); if (im) { im.src = d.thumb; im.removeAttribute('data-th'); }
    break;
  }
}
// the cards of the tab that was just opened come first
function thumbFirst(keys) { TH.queue = keys.filter((q) => !(q[0] === '@' ? STAFF[q.slice(1)] : DEFS[q]).thumb).concat(TH.queue); }

