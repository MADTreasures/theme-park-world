/* ================= weather ================= */
// Mostly sunshine. Clouds pass through, and now and then it rains or storms: fewer guests come and those in the park
// leave a little sooner. After the rain a rainbow brings extra visitors, so the park catches up again.
const WX = { k: 'sun', t: 240, wet: 0, over: 0, bow: 0, flash: 0, bonus: 0, wasRain: false };
const WX_NAME = { sun: 'Sonnig', cloud: 'Bewölkt', rain: 'Regen', storm: 'Gewitter' };
const WX_GREY = new T.Color(0x8d98aa), _wc = new T.Color();
let rainLines = null, rainPos = null, cloudMat = null, bowMat = null, bow = null;
function buildWeather() {
  const n = 800; rainPos = new Float32Array(n * 6);
  for (let i = 0; i < n; i++) { const x = rnd(-24, 24), y = rnd(0, 20), z = rnd(-24, 24); rainPos.set([x, y, z, x + 0.06, y - 0.6, z], i * 6); }
  const rg = new T.BufferGeometry(); rg.setAttribute('position', new T.BufferAttribute(rainPos, 3));
  rainLines = new T.LineSegments(rg, new T.LineBasicMaterial({ color: 0xd6ebff, transparent: true, opacity: 0, depthWrite: false })); rainLines.frustumCulled = false; rainLines.visible = false; scene.add(rainLines);
  cloudMat = softMat({ color: 0x9aa3b5, transparent: true, opacity: 0, depthWrite: false });
  for (let i = 0; i < 18; i++) {
    const cb = new Builder(); for (let k = 0; k < rint(4, 6); k++) cb.sph(rnd(4, 7), 0xffffff, k * 4.5 + rnd(-1, 1), rnd(-0.6, 0.8), rnd(-2.5, 2.5), { sy: 0.45 });
    const m = new T.Mesh(cb.geo(), cloudMat); m.position.set(rnd(-110, 110), rnd(24, 32), rnd(-110, 90)); m.userData.v = rnd(0.8, 1.6); m.renderOrder = 1; scene.add(m); clouds.push(m);
  }
  bow = new T.Group(); bowMat = [];
  [0xff4f64, 0xf08a24, 0xffd23f, 0x55c26a, 0x3d8bfd, 0x8c5cff].forEach((c, i) => { const mat = new T.MeshBasicMaterial({ color: c, transparent: true, opacity: 0, fog: false, depthWrite: false }); bowMat.push(mat); bow.add(new T.Mesh(new T.TorusGeometry(70 - i * 1.6, 0.8, 4, 48, Math.PI), mat)); });
  bow.position.set(-30, -4, -120); bow.rotation.y = 0.25; bow.visible = false; scene.add(bow);
}
function wxSet(k, quiet) {
  const was = WX.k; WX.k = k; WX.t = k === 'sun' ? rnd(180, 360) : k === 'cloud' ? rnd(60, 120) : k === 'rain' ? rnd(60, 120) : rnd(40, 70);
  S.wx = { k, t: WX.t }; uiDirty = true;
  if (quiet) return;
  if (k === 'rain') toast('Es regnet. Bei Regen kommen weniger Gäste.', '');
  else if (k === 'storm') toast('Ein Gewitter zieht auf. Viele Gäste bleiben zu Hause.', 'bad');
  else if (k === 'cloud' && (was === 'rain' || was === 'storm')) toast('Der Regen ist vorbei. Ein Regenbogen lockt besonders viele Gäste an.', 'good');
}
// once per game second
function weatherTick() {
  WX.t -= 1; if (S.wx) S.wx.t = WX.t;
  if (WX.bonus > 0) WX.bonus--;
  if (WX.wet > 0.5) for (const g of guests) if (g.state !== 'ride') { g.happy = Math.max(0, g.happy - 0.04); g.stay -= 0.5; }
  if (WX.t > 0) return;
  const k = WX.k;
  if (k === 'sun') wxSet('cloud');
  else if (k === 'cloud') { const r = Math.random(); if (WX.wasRain || S.goal < 2 || r < 0.5) { WX.wasRain = false; wxSet('sun'); } else wxSet(r < 0.94 ? 'rain' : 'storm'); }
  else { WX.wasRain = true; WX.bonus = 150; wxSet('cloud'); }
}
const wxFactor = () => (WX.k === 'rain' ? 0.45 : WX.k === 'storm' ? 0.28 : WX.bonus > 0 ? 1.25 : 1);
function weatherFrame(rdt) {
  const k = WX.k, wetT = k === 'rain' || k === 'storm' ? 1 : 0, overT = k === 'sun' ? 0 : k === 'cloud' ? 0.6 : k === 'rain' ? 0.9 : 1, a = 1 - Math.exp(-rdt * 0.6);
  WX.wet = lerp(WX.wet, wetT, a); WX.over = lerp(WX.over, overT, a); WX.bow = lerp(WX.bow, WX.bonus > 0 && !wetT ? 1 : 0, a);
  if (WX.flash > 0) WX.flash = Math.max(0, WX.flash - rdt * 5);
  cloudMat.opacity = WX.over * 0.94;
  rainLines.visible = WX.wet > 0.02;
  if (rainLines.visible) {
    rainLines.material.opacity = WX.wet * 0.5; rainLines.position.set(cam.tx, 0, cam.tz);
    const dy = rdt * 26;
    for (let i = 0; i < rainPos.length; i += 6) { let y = rainPos[i + 1] - dy; if (y < 0.6) y += 20; rainPos[i + 1] = y; rainPos[i + 4] = y - 0.6; }
    rainLines.geometry.attributes.position.needsUpdate = true;
  }
  bow.visible = WX.bow > 0.02; for (const m of bowMat) m.opacity = WX.bow * 0.5 * (1 - night);
}
// called at the end of the sky update: clouds grey the sky and dim the sun, lightning flashes
function weatherSky() {
  const o = WX.over;
  if (o > 0.01) { _wc.copy(WX_GREY).multiplyScalar(1 - night * 0.75); scene.background.lerp(_wc, o * 0.78); scene.fog.color.copy(scene.background); sun.intensity *= 1 - o * 0.5; hemi.intensity *= 1 - o * 0.12; }
  scene.fog.near = lerp(70, 38, WX.wet); scene.fog.far = lerp(210, 150, WX.wet);
  if (WX.flash > 0) hemi.intensity += WX.flash * 0.9;
}
