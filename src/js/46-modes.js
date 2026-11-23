/* ================= walking through the park and riding along ================= */
let pov = null, fp = null;
const _pq = new T.Quaternion(), _pp = new T.Vector3(), _po = new T.Quaternion(), _pe = new T.Euler(0, 0, 0, 'YXZ'), FLIP = new T.Quaternion().setFromAxisAngle(UP, Math.PI);
function setImmersive(on, label) {
  $('#hud').classList.toggle('immersive', on); $('#modebar').hidden = !on; $('#joy').hidden = !fp;
  if (on) $('#mode-txt').textContent = label;
  camera.near = on ? 0.06 : 0.5; camera.fov = on ? 62 : 36; camera.updateProjectionMatrix();
}
function enterPOV(b) {
  const seat = b && (b.model.povSeat || b.model.seats[0]); if (!seat) return;
  exitMode(); setTool(null); select(null);
  pov = { b, seat, yaw: 0, pitch: -0.08, ran: false };
  if (b.state !== 'run' && !b.broken) { b.state = 'run'; b.runT = 0; b.loadT = 0; if (b.model.start) b.model.start(); }
  setImmersive(true, b.def.name + (b.model.povSeat ? ' · du fliegst mit dem Gespenst' : b.def.grp === 'show' ? ' · du schaust zu' : b.def.calm ? ' · du ruhst dich aus' : ' · du fährst mit'));
}
function enterFP() {
  exitMode(); setTool(null); select(null);
  const t = nearestPath(cam.tx, cam.tz);
  fp = { x: wX(tX(t)), z: wZ(tY(t)), yaw: cam.a, pitch: -0.05, jx: 0, jy: 0 };
  setImmersive(true, 'Rundgang');
  toast(window.matchMedia && window.matchMedia('(pointer: coarse)').matches ? 'Links steuerst du, mit dem Finger auf dem Bild schaust du dich um. Tippe Gäste an.' : 'WASD oder Pfeiltasten zum Gehen, ziehen zum Umsehen. Klicke Gäste an.');
}
function exitMode() {
  if (!pov && !fp) return;
  if (fp) { cam.tx = fp.x; cam.tz = fp.z; }
  if (pov) { cam.tx = pov.b.group.position.x; cam.tz = pov.b.group.position.z; }
  clampCam(); pov = null; fp = null; setImmersive(false); select(null);
}
// What stops someone who walks through the park. Whole tiles: buildings, building sites and large decorations, and the
// edge of the island's ground. The fence: from the park's own land there is no way out onto land that is not owned.
function fpBlocked(x, z) {
  const gx = Math.floor(x + HALF), gy = Math.floor(z + HALF); if (!inB(gx, gy)) return true;
  const t = idx(gx, gy), ob = tObj[t];
  if (tType[t] === 2 || (tType[t] === 3 && ob && (ob.w > 1 || ob.h > 1))) return true;
  return !owned[t] && ownedAt(Math.floor(fp.x + HALF), Math.floor(fp.z + HALF));
}
// Plants and small decorations are round obstacles in the middle of their tile: whoever walks into one is set back to
// its edge and so slides around it. The numbers say how close the walker gets to the middle of each kind (always less
// than half a tile, so being set back never crosses into the next tile).
const FP_RAD = { tree: 0.45, pine: 0.4, palm: 0.26, bush: 0.42, flowers: 0.46, bench: 0.4, bin: 0.28, lamp: 0.24 };
function fpPush() {
  const gx = Math.floor(fp.x + HALF), gy = Math.floor(fp.z + HALF); if (!inB(gx, gy)) return;
  const t = idx(gx, gy), ob = tObj[t]; if (tType[t] !== 3 || !ob || ob.removed || ob.w > 1 || ob.h > 1) return;
  const r = FP_RAD[ob.k] || 0.34, ox = wX(ob.x), oz = wZ(ob.y), dx = fp.x - ox, dz = fp.z - oz, d = Math.hypot(dx, dz);
  if (d >= r) return;
  if (d < 1e-4) fp.x = ox + r; else { fp.x = ox + dx / d * r; fp.z = oz + dz / d * r; }
}
function modeLook(dx, dy) { const o = fp || pov; if (!o) return; o.yaw -= dx * 0.005; o.pitch = clamp(o.pitch - dy * 0.004, -1.1, 1.1); }
// Returns true while one of the two modes drives the camera.
function modeCamera(dt) {
  if (pov) {
    const b = pov.b;
    if (b.removed) { exitMode(); return false; }
    if (b.state === 'run') pov.ran = true; else if (pov.ran) { exitMode(); toast('Die Fahrt ist zu Ende.'); return false; }
    pov.seat.updateWorldMatrix(true, false); pov.seat.matrixWorld.decompose(_pp, _pq, _gs);
    camera.position.copy(_pp).add(_v.set(0, 0.36, 0).applyQuaternion(_pq));
    _pe.set(pov.pitch, pov.yaw, 0); camera.quaternion.copy(_pq).multiply(FLIP).multiply(_po.setFromEuler(_pe));
    cam.tx = _pp.x; cam.tz = _pp.z;
    return true;
  }
  if (fp) {
    const kx = clamp((keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0) + fp.jx, -1, 1), ky = clamp((keys.w || keys.arrowup ? 1 : 0) - (keys.s || keys.arrowdown ? 1 : 0) + fp.jy, -1, 1);
    const sp = 2.4 * dt, sn = Math.sin(fp.yaw), cs = Math.cos(fp.yaw), dx = (cs * kx - sn * ky) * sp, dz = (-sn * kx - cs * ky) * sp;
    if (dx && !fpBlocked(fp.x + dx + Math.sign(dx) * 0.2, fp.z)) fp.x += dx;
    if (dz && !fpBlocked(fp.x, fp.z + dz + Math.sign(dz) * 0.2)) fp.z += dz;
    fpPush();
    camera.position.set(fp.x, 0.56 + (kx || ky ? Math.abs(Math.sin(performance.now() * 0.009)) * 0.014 : 0), fp.z);
    _pe.set(fp.pitch, fp.yaw, 0); camera.quaternion.setFromEuler(_pe);
    cam.tx = fp.x; cam.tz = fp.z;
    return true;
  }
  return false;
}
(function () {
  const el = $('#joy'), knob = el.firstElementChild; let id = null;
  const set = (e) => {
    const r = el.getBoundingClientRect(); let x = (e.clientX - r.left - r.width / 2) / (r.width / 2), y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    const m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; }
    if (fp) { fp.jx = x; fp.jy = -y; }
    knob.style.transform = 'translate(' + x * 30 + 'px,' + y * 30 + 'px)';
  };
  const end = (e) => { if (e.pointerId !== id) return; id = null; if (fp) { fp.jx = 0; fp.jy = 0; } knob.style.transform = ''; };
  el.addEventListener('pointerdown', (e) => { id = e.pointerId; try { el.setPointerCapture(id); } catch (_) { /* fine without */ } set(e); e.preventDefault(); });
  el.addEventListener('pointermove', (e) => { if (e.pointerId === id) set(e); });
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
})();
// talking to guests
function sayHello(g) {
  if (S.time - g.helloT < 25) { toast(g.name + ' winkt noch vom letzten Mal.'); return; }
  g.helloT = S.time; g.chatT = 2.6; g.happy = Math.min(100, g.happy + 3); think(g, 'happy'); sfx('click');
  const o = fp || { x: camera.position.x, z: camera.position.z }; g.rot = Math.atan2(o.x - g.x, o.z - g.z);
}
function giveVoucher(g) {
  if (S.money < 5) { sfx('error'); toast('Dafür reicht das Geld nicht.', 'bad'); return; }
  spend(5, 'goods'); g.cash += 12; g.happy = Math.min(100, g.happy + 8); g.chatT = 2.6; think(g, 'great'); sfx('build'); uiDirty = true;
  const o = fp || { x: camera.position.x, z: camera.position.z }; g.rot = Math.atan2(o.x - g.x, o.z - g.z);
}
