'use strict';
const $ = (s) => document.querySelector(s);
const DEV = !!window.RUMMEL_DEV || window.location.hash === '#dev';   // developer mode: own save game, test panel
const noStart = () => { $('#nogl').hidden = false; $('#title').hidden = true; document.documentElement.classList.remove('tt'); };   // the game cannot run here: say so instead of the title screen
if (!window.THREE) { noStart(); return; }
const T = window.THREE;

/* ================= helpers ================= */
const N = 60, HALF = N / 2, STEP = 1 / 30, DAY = 240, MAXG = 800;   // the most guests the game can hold at all; how many a park may have depends on its land (landCap)
const rnd = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
const rint = (a, b) => Math.floor(rnd(a, b + 1));
const pick = (a) => a[(Math.random() * a.length) | 0];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };
const idx = (x, y) => y * N + x, tX = (i) => i % N, tY = (i) => (i / N) | 0;
const wX = (x) => x - HALF + 0.5, wZ = (y) => y - HALF + 0.5;
const inB = (x, y) => x >= 0 && y >= 0 && x < N && y < N;
const DIRS = [[0, 1], [-1, 0], [0, -1], [1, 0]];
const ENT = idx(HALF, N - 1);
const CUR = { name: 'Taler', sym: 'T', shape: 0, col: 0, img: '' };   // the park's own money, designed by the player
const eur = (n) => Math.round(n).toLocaleString('de-DE') + '\u00a0' + CUR.sym;
const eur2 = (n) => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '\u00a0' + CUR.sym;
const TAU = Math.PI * 2;

/* ================= renderer ================= */
const canvas = $('#stage');
let renderer;
try { renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); }
catch (e) { noStart(); return; }
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFSoftShadowMap;
const maxAniso = renderer.capabilities.getMaxAnisotropy();
const scene = new T.Scene(), overlay = new T.Scene();   // overlay: bubbles and markers, drawn on top of the inked picture
scene.background = new T.Color(0x8fd3ff);
scene.fog = new T.Fog(0x8fd3ff, 70, 210);
const camera = new T.PerspectiveCamera(36, 1, 0.5, 600);
const hemi = new T.HemisphereLight(0xeaf6ff, 0x8fae78, 0.6);
const sun = new T.DirectionalLight(0xfff2dc, 0.45);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.03;
sun.shadow.camera.near = 1; sun.shadow.camera.far = 170;
scene.add(hemi, sun, sun.target);
const sunDir = new T.Vector3(0.4, 0.8, 0.4);

// Soft toy shading. Light wraps gently around every shape instead of stopping at a hard edge, the shaded side stays
// bright and leans towards violet, silhouettes catch a rim of sky light and glossy things get a soft highlight.
const RAMP = (() => {
  const n = 64, d = new Uint8Array(n * 4);
  for (let i = 0; i < n; i++) { const k = smooth(0.3, 0.84, i / (n - 1)); d.set([lerp(132, 255, k), lerp(126, 255, k), lerp(170, 255, k), 255], i * 4); }   // i / (n - 1) = (N·L + 1) / 2
  const t = new T.DataTexture(d, n, 1, T.RGBAFormat); t.minFilter = t.magFilter = T.LinearFilter; t.generateMipmaps = false; t.needsUpdate = true; return t;
})();
const SKYLIGHT = { value: new T.Color(0xffffff) };   // colour of the rim light, follows the sky
function softHook(shader) {
  shader.uniforms.rimCol = SKYLIGHT; shader.uniforms.rimK = { value: this.userData.rim }; shader.uniforms.glossK = { value: this.userData.gloss };
  shader.fragmentShader = shader.fragmentShader.replace('void main() {', 'uniform vec3 rimCol;\nuniform float rimK;\nuniform float glossK;\nvoid main() {')
    .replace('vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;', [
      'vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;',
      'vec3 softV = normalize( vViewPosition );',
      'float softR = 1.0 - saturate( dot( softV, normal ) );',
      'outgoingLight += ( diffuseColor.rgb * 0.65 + 0.35 ) * rimCol * ( softR * softR * softR * rimK );',
      '#if NUM_DIR_LIGHTS > 0',
      'outgoingLight += directionalLights[ 0 ].color * ( pow( saturate( dot( normal, normalize( directionalLights[ 0 ].direction + softV ) ) ), 34.0 ) * glossK );',
      '#endif'].join('\n'));
}
function softMat(o, rim, gloss) {
  const m = new T.MeshToonMaterial(Object.assign({ gradientMap: RAMP }, o));
  m.userData.rim = rim === undefined ? 0.3 : rim; m.userData.gloss = gloss || 0; m.onBeforeCompile = softHook; return m;
}
// Ground, water and paths fill most of the screen and are flat, so they get the cheap per-corner lighting, a touch brighter.
const flatMat = (o) => { const m = new T.MeshLambertMaterial(o); m.color.setRGB(1.12, 1.12, 1.12); return m; };
const MAT = softMat({ vertexColors: true }, 0.3, 0.07);
const MAT_GLOW = new T.MeshBasicMaterial({ vertexColors: true });
const MAT_GHOST = softMat({ vertexColors: true, transparent: true, opacity: 0.7 });
const MAT_INST = (rim, gloss) => softMat({ vertexColors: true }, rim, gloss);

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c); t.anisotropy = maxAniso; return t;
}

/* ================= merged vertex-colour geometry ================= */
const _m4 = new T.Matrix4(), _q = new T.Quaternion(), _e = new T.Euler(), _v = new T.Vector3(), _s = new T.Vector3(), _c = new T.Color(), _n3 = new T.Matrix3();
function geoFrom(p, n, c) {
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(p, 3));
  g.setAttribute('normal', new T.Float32BufferAttribute(n, 3));
  g.setAttribute('color', new T.Float32BufferAttribute(c, 3));
  return g;
}
// A box with bevelled edges and corners. Every corner of a face keeps the face's normal, so the bevels shade like a
// rounded edge while the faces stay flat: blocks look like moulded toy parts instead of cut cardboard.
function softBox(w, h, d, r) {
  const half = [w / 2, h / 2, d / 2], pos = [], nor = [], ind = [], P = [];
  const v = (a, sg, s1, s2) => (a * 2 + (sg > 0 ? 1 : 0)) * 4 + (s1 > 0 ? 1 : 0) + (s2 > 0 ? 2 : 0);
  for (let a = 0; a < 3; a++) for (const sg of [-1, 1]) for (const s2 of [-1, 1]) for (const s1 of [-1, 1]) {
    const b = (a + 1) % 3, c = (a + 2) % 3, p = [0, 0, 0], n = [0, 0, 0];
    p[a] = sg * half[a]; p[b] = s1 * (half[b] - r); p[c] = s2 * (half[c] - r); n[a] = sg;
    pos.push(p[0], p[1], p[2]); nor.push(n[0], n[1], n[2]); P.push(p);
  }
  // adds a triangle so that it faces away from the centre, whatever order the corners come in
  const tri = (i, j, k, out) => {
    const A = P[i], B = P[j], C = P[k], ux = B[0] - A[0], uy = B[1] - A[1], uz = B[2] - A[2], vx = C[0] - A[0], vy = C[1] - A[1], vz = C[2] - A[2];
    if ((uy * vz - uz * vy) * out[0] + (uz * vx - ux * vz) * out[1] + (ux * vy - uy * vx) * out[2] >= 0) ind.push(i, j, k); else ind.push(i, k, j);
  };
  for (let a = 0; a < 3; a++) for (const sg of [-1, 1]) { const o = [0, 0, 0]; o[a] = sg; tri(v(a, sg, -1, -1), v(a, sg, 1, -1), v(a, sg, 1, 1), o); tri(v(a, sg, -1, -1), v(a, sg, 1, 1), v(a, sg, -1, 1), o); }
  for (let e = 0; e < 3; e++) for (const sb of [-1, 1]) for (const sc of [-1, 1]) {
    const b = (e + 1) % 3, c = (e + 2) % 3, o = [0, 0, 0]; o[b] = sb; o[c] = sc;
    const a0 = v(b, sb, sc, -1), a1 = v(b, sb, sc, 1), b0 = v(c, sc, -1, sb), b1 = v(c, sc, 1, sb);
    tri(a0, a1, b1, o); tri(a0, b1, b0, o);
  }
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) tri(v(0, sx, sy, sz), v(1, sy, sz, sx), v(2, sz, sx, sy), [sx, sy, sz]);
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); g.setIndex(ind);
  return g;
}
class Builder {
  constructor() { this.p = []; this.n = []; this.c = []; this.gp = []; this.gn = []; this.gc = []; }
  add(geo, color, x = 0, y = 0, z = 0, o) {
    o = o || {};
    _e.set(o.rx || 0, o.ry || 0, o.rz || 0, 'YXZ'); _q.setFromEuler(_e);
    _s.set(o.sx || 1, o.sy || 1, o.sz || 1);
    _m4.compose(_v.set(x, y, z), _q, _s);
    _n3.getNormalMatrix(_m4);
    const g = geo.index ? geo.toNonIndexed() : geo;
    const pos = g.attributes.position, nor = g.attributes.normal;
    _c.set(color);
    const P = o.glow ? this.gp : this.p, Nn = o.glow ? this.gn : this.n, C = o.glow ? this.gc : this.c;
    for (let i = 0; i < pos.count; i++) {
      _v.fromBufferAttribute(pos, i).applyMatrix4(_m4); P.push(_v.x, _v.y, _v.z);
      _v.fromBufferAttribute(nor, i).applyMatrix3(_n3).normalize(); Nn.push(_v.x, _v.y, _v.z);
      C.push(_c.r, _c.g, _c.b);
    }
    if (g !== geo) g.dispose();
    geo.dispose();
    return this;
  }
  // boxes that are thick enough get soft edges; thin plates, rails and posts stay crisp
  box(w, h, d, c, x, y, z, o) { const m = Math.min(w, h, d); return this.add(m >= 0.1 && !(o && o.glow) ? softBox(w, h, d, Math.min(0.045, m * 0.2)) : new T.BoxGeometry(w, h, d), c, x, y, z, o); }
  cyl(rt, rb, h, c, x, y, z, o) { return this.add(new T.CylinderGeometry(rt, rb, h, (o && o.seg) || 10), c, x, y, z, o); }
  cone(r, h, c, x, y, z, o) { return this.add(new T.ConeGeometry(r, h, (o && o.seg) || 10), c, x, y, z, o); }
  sph(r, c, x, y, z, o) { return this.add(new T.SphereGeometry(r, (o && o.seg) || 10, (o && o.seg2) || 7), c, x, y, z, o); }
  ico(r, c, x, y, z, o) { return this.add(new T.IcosahedronGeometry(r, (o && o.det) || 0), c, x, y, z, o); }
  tor(R, r, c, x, y, z, o) { return this.add(new T.TorusGeometry(R, r, (o && o.rs) || 6, (o && o.seg) || 18), c, x, y, z, o); }
  scone(r, h, cols, n, x, y, z, o) { const st = TAU / n; for (let i = 0; i < n; i++) this.add(new T.ConeGeometry(r, h, 1, 1, true, i * st, st), cols[i % cols.length], x, y, z, o); return this; }
  scyl(rt, rb, h, cols, n, x, y, z, o) { const st = TAU / n; for (let i = 0; i < n; i++) this.add(new T.CylinderGeometry(rt, rb, h, 1, 1, true, i * st, st), cols[i % cols.length], x, y, z, o); return this; }
  geo() { return geoFrom(this.p, this.n, this.c); }
  mesh(shadow = true) {
    const g = new T.Group();
    if (this.p.length) { const m = new T.Mesh(geoFrom(this.p, this.n, this.c), MAT); m.castShadow = shadow; m.receiveShadow = true; g.add(m); }
    if (this.gp.length) g.add(new T.Mesh(geoFrom(this.gp, this.gn, this.gc), MAT_GLOW));
    return g;
  }
}

/* ================= palette for 3D ================= */
const K = { red: 0xff4f64, redD: 0xb9243a, yel: 0xffd23f, blue: 0x3d8bfd, mint: 0x3ddbb4, teal: 0x14957a, pink: 0xff8fc7, vio: 0x8c5cff, ora: 0xf08a24,
  paper: 0xfff6dc, ink: 0x232861, inkD: 0x171a42, wood: 0xb98a5a, woodD: 0x8a623c, stone: 0xb9bdd0, stoneD: 0x8a8fa8, bulb: 0xfff2a8, sand: 0xe0c98f };
const GREENS = [0x4caf50, 0x62b955, 0x3d9a45, 0x7cc65a];

/* ================= textures ================= */
// four by four tiles of lawn, repeated over the whole island
const groundTex = canvasTex(256, 256, (c, w) => {
  const s = w / 4;
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { c.fillStyle = (x + y) % 2 ? '#7fcb62' : '#77c45a'; c.fillRect(x * s, y * s, s, s); }
  for (let i = 0; i < 600; i++) { c.fillStyle = Math.random() < 0.5 ? 'rgba(240,255,150,.10)' : 'rgba(20,90,30,.10)'; c.fillRect(rnd(w - 6), rnd(w - 6), rnd(2, 5), rnd(2, 5)); }
});
groundTex.wrapS = groundTex.wrapT = T.RepeatWrapping; groundTex.repeat.set(N / 4, N / 4);
const pathTex = canvasTex(128, 128, (c, w) => {
  c.fillStyle = '#ead7a6'; c.fillRect(0, 0, w, w);
  for (let i = 0; i < 260; i++) { c.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,.14)' : 'rgba(120,90,40,.10)'; c.fillRect(rnd(w), rnd(w), rnd(2, 6), rnd(2, 6)); }
  c.strokeStyle = 'rgba(120,90,50,.35)'; c.lineWidth = 3; c.strokeRect(1.5, 1.5, w - 3, w - 3);
  c.lineWidth = 2; c.beginPath(); c.moveTo(w / 2, 0); c.lineTo(w / 2, w); c.moveTo(0, w / 2); c.lineTo(w, w / 2); c.stroke();
});
const glowTex = canvasTex(128, 128, (c, w) => {
  const g = c.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
  g.addColorStop(0, 'rgba(255,225,150,1)'); g.addColorStop(0.4, 'rgba(255,200,110,.45)'); g.addColorStop(1, 'rgba(255,180,90,0)');
  c.fillStyle = g; c.fillRect(0, 0, w, w);
});
const MAT_LAMP = new T.MeshBasicMaterial({ map: glowTex, transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: 0 });
function drawSign(c, w, h) {
  c.fillStyle = '#232861'; c.fillRect(0, 0, w, h);
  const fam = 'px Bungee, Impact, "Arial Black", sans-serif'; let fs = Math.round(h * 0.56);
  c.font = '400 ' + fs + fam;
  const tw = c.measureText('RUMMELINSEL').width;
  if (tw > w * 0.9) { fs = Math.floor(fs * w * 0.9 / tw); c.font = '400 ' + fs + fam; }
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillStyle = '#b9243a'; c.fillText('RUMMELINSEL', w / 2, h / 2 + 7);
  c.fillStyle = '#ffd447'; c.fillText('RUMMELINSEL', w / 2, h / 2 + 2);
}
const signTex = canvasTex(1024, 256, drawSign);
if (document.fonts && document.fonts.load) {
  document.fonts.load('40px Bungee').then(() => { drawSign(signTex.image.getContext('2d'), 1024, 256); signTex.needsUpdate = true; }).catch(() => {});
}

/* ================= scenery pieces (shared by the world and by placeable decoration) ================= */
function addTree(b, x, z, s = 1) {
  const h = rnd(0.9, 1.25) * s, ry = rnd(TAU);
  b.cyl(0.05 * s, 0.085 * s, 0.55 * h, 0x8a5a3a, x, 0.27 * h, z, { seg: 6 });
  b.sph(0.4 * s, pick(GREENS), x, 0.55 * h + 0.26 * s, z, { ry, seg: 10, seg2: 6, sy: 0.9 });
  b.sph(0.28 * s, pick(GREENS), x + 0.19 * s, 0.55 * h + 0.5 * s, z + 0.08 * s, { ry: ry + 1, seg: 8, seg2: 5 });
  b.sph(0.26 * s, pick(GREENS), x - 0.18 * s, 0.55 * h + 0.44 * s, z - 0.12 * s, { ry: ry + 2, seg: 8, seg2: 5 });
}
function addPine(b, x, z, s = 1) {
  const h = rnd(0.9, 1.2) * s;
  b.cyl(0.05 * s, 0.07 * s, 0.3 * h, 0x7a4f33, x, 0.15 * h, z, { seg: 6 });
  b.cone(0.36 * s, 0.55 * h, 0x2f8a4a, x, 0.5 * h, z, { seg: 7 });
  b.cone(0.28 * s, 0.5 * h, 0x37984f, x, 0.82 * h, z, { seg: 7 });
  b.cone(0.19 * s, 0.42 * h, 0x41a657, x, 1.1 * h, z, { seg: 7 });
}
function addPalm(b, x, z, s = 1) {
  const lean = rnd(TAU), lx = Math.cos(lean), lz = Math.sin(lean);
  let px = x, pz = z;
  for (let i = 0; i < 5; i++) { b.cyl(0.04 * s, 0.055 * s, 0.3 * s, i % 2 ? 0xb08a5a : 0xa27c4e, px, (0.15 + i * 0.27) * s, pz, { seg: 6 }); px += lx * 0.035 * i * s; pz += lz * 0.035 * i * s; }
  const top = 1.42 * s;
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * TAU + lean, dr = 0.55, L = 0.62 * s;
    b.box(L, 0.02 * s, 0.17 * s, i % 2 ? 0x3fa650 : 0x55b85c, px + Math.cos(a) * L / 2 * Math.cos(dr), top - L / 2 * Math.sin(dr), pz + Math.sin(a) * L / 2 * Math.cos(dr), { ry: -a, rz: -dr });
  }
  b.sph(0.06 * s, 0x6b4a2a, px + 0.06 * s, top - 0.08 * s, pz, { seg: 6, seg2: 4 }); b.sph(0.06 * s, 0x6b4a2a, px - 0.05 * s, top - 0.09 * s, pz + 0.05 * s, { seg: 6, seg2: 4 });
}
function addFlowers(b, x, z) {
  b.box(0.84, 0.08, 0.84, 0x7a5236, x, 0.04, z);
  const cols = [K.red, K.yel, K.pink, 0xffffff, K.vio, K.ora];
  for (let i = 0; i < 10; i++) {
    const fx = x + rnd(-0.33, 0.33), fz = z + rnd(-0.33, 0.33);
    b.sph(0.08, pick(GREENS), fx, 0.11, fz, { seg: 5, seg2: 3 });
    b.sph(0.06, pick(cols), fx, 0.2, fz, { seg: 5, seg2: 3 });
  }
}
function addBench(b, x, z) {
  b.box(0.72, 0.05, 0.24, K.wood, x, 0.22, z + 0.02); b.box(0.72, 0.2, 0.04, K.wood, x, 0.4, z - 0.11, { rx: -0.15 });
  for (const sx of [-0.3, 0.3]) { b.box(0.05, 0.22, 0.22, K.inkD, x + sx, 0.11, z + 0.02); b.box(0.05, 0.3, 0.04, K.inkD, x + sx, 0.36, z - 0.12); }
}
function addBin(b, x, z) {
  b.cyl(0.14, 0.11, 0.32, K.teal, x, 0.16, z, { seg: 8 }); b.cyl(0.155, 0.155, 0.04, K.inkD, x, 0.33, z, { seg: 8 }); b.cyl(0.09, 0.09, 0.02, 0x111111, x, 0.352, z, { seg: 8 });
}
function addLamp(b, x, z) {
  b.cyl(0.07, 0.09, 0.08, K.inkD, x, 0.04, z, { seg: 8 }); b.cyl(0.025, 0.035, 1.3, K.inkD, x, 0.7, z, { seg: 6 });
  b.cone(0.13, 0.1, K.inkD, x, 1.5, z, { seg: 8 }); b.sph(0.09, K.bulb, x, 1.4, z, { glow: true, seg: 8, seg2: 6 });
}
function addRock(b, x, z, s) { b.sph(s, pick([0xa9adbd, 0x979bb0, 0xbcc0cf]), x, s * 0.3, z, { ry: rnd(TAU), sy: 0.62, sx: rnd(0.9, 1.3), seg: 7, seg2: 5 }); }

/* ================= world ================= */
let waterMat; const clouds = [];
function buildWorld() {
  waterMat = new T.MeshLambertMaterial({ color: 0x3aa9dc });
  const water = new T.Mesh(new T.PlaneGeometry(1200, 1200), waterMat);
  water.rotation.x = -Math.PI / 2; water.position.y = -0.45; scene.add(water);
  const ground = new T.Mesh(new T.PlaneGeometry(N, N), flatMat({ map: groundTex }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  const b = new Builder(), Q = Math.SQRT2, GX = wX(HALF), GZ = HALF + 0.08;
  b.cyl((HALF + 3.2) * Q, (HALF + 8.5) * Q, 1, K.sand, 0, -0.52, 0, { seg: 4, ry: Math.PI / 4 });
  b.box(N + 0.8, 0.4, N + 0.8, 0x4f9a3a, 0, -0.212, 0);
  // gate (the fence follows the land the park owns and is built in the land view)
  for (const sx of [-1.05, 1.05]) {
    for (let i = 0; i < 5; i++) b.box(0.36, 0.5, 0.36, i % 2 ? K.paper : K.red, GX + sx, 0.25 + i * 0.5, GZ);
    b.box(0.48, 0.08, 0.48, K.inkD, GX + sx, 2.54, GZ);
    b.sph(0.11, K.bulb, GX + sx, 2.7, GZ, { glow: true });
    b.cyl(0.015, 0.015, 0.7, K.inkD, GX + sx, 3.1, GZ, { seg: 5 });
    b.box(0.34, 0.18, 0.012, K.yel, GX + sx + 0.18, 3.33, GZ);
    // ticket booths
    b.box(0.7, 0.75, 0.7, K.teal, GX + sx * 1.75, 0.375, GZ + 0.75);
    b.box(0.5, 0.26, 0.04, K.inkD, GX + sx * 1.75, 0.5, GZ + 1.11);
    b.scone(0.62, 0.42, [K.red, K.paper], 8, GX + sx * 1.75, 0.96, GZ + 0.75);
  }
  b.box(2.9, 0.72, 0.44, K.ink, GX, 2.12, GZ);
  for (let i = 0; i < 12; i++) for (const y of [1.74, 2.5]) for (const dz of [-0.23, 0.23]) b.sph(0.035, K.bulb, GX - 1.375 + i * 0.25, y, GZ + dz, { glow: true, seg: 6, seg2: 4 });
  // pier, dock and ferry
  b.box(1.8, 0.14, 13.6, K.wood, GX, -0.07, HALF + 7.1);
  for (let z = HALF + 1; z < HALF + 14; z += 0.5) b.box(1.8, 0.145, 0.03, K.woodD, GX, -0.07, z);
  for (let z = HALF + 4; z <= HALF + 14; z += 2.5) for (const sx of [-0.95, 0.95]) { b.cyl(0.07, 0.07, 1.7, K.woodD, GX + sx, -0.5, z, { seg: 6 }); b.sph(0.09, K.paper, GX + sx, 0.38, z, { seg: 6, seg2: 4 }); }
  b.box(4.6, 0.14, 2.8, K.wood, GX, -0.07, HALF + 15);
  const FX = GX + 3.6, FZ = HALF + 14.6;
  b.box(1.6, 0.8, 4.4, K.paper, FX, -0.15, FZ); b.box(1.64, 0.16, 4.44, K.red, FX, 0.12, FZ);
  b.box(1.1, 0.6, 1.9, K.blue, FX, 0.55, FZ - 0.3); b.box(1.25, 0.08, 2.1, K.paper, FX, 0.89, FZ - 0.3);
  b.cyl(0.16, 0.19, 0.6, K.red, FX, 1.2, FZ - 0.6); b.cyl(0.17, 0.17, 0.1, K.inkD, FX, 1.5, FZ - 0.6);
  // beach scenery
  for (let i = 0; i < 46; i++) {
    const side = rint(0, 3), along = rnd(-HALF - 2, HALF + 2), off = HALF + rnd(0.9, 2.7);
    const x = side === 0 ? along : side === 1 ? -off : side === 2 ? along : off, z = side === 0 ? off : side === 2 ? -off : along;
    if (z > HALF && Math.abs(x - GX) < 3.2) continue;
    if (Math.random() < 0.55) addPalm(b, x, z, rnd(0.9, 1.3)); else addRock(b, x, z, rnd(0.2, 0.5));
  }
  // far islands
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * TAU + rnd(0.5), R = rnd(95, 150), r = rnd(9, 20);
    b.cyl(r * 1.25, r * 1.4, 0.6, K.sand, Math.cos(a) * R, -0.3, Math.sin(a) * R, { seg: 9 });
    b.cone(r, r * rnd(0.45, 0.7), 0x58a862, Math.cos(a) * R, r * 0.25, Math.sin(a) * R, { seg: 7 });
  }
  scene.add(b.mesh());
  for (const dz of [0.223, -0.223]) {
    const s = new T.Mesh(new T.PlaneGeometry(2.72, 0.68), new T.MeshBasicMaterial({ map: signTex }));
    s.position.set(GX, 2.12, GZ + dz); if (dz < 0) s.rotation.y = Math.PI; scene.add(s);
  }
  for (let i = 0; i < 8; i++) {
    const cb = new Builder();
    for (let k = 0; k < rint(3, 5); k++) cb.sph(rnd(2.2, 4), 0xffffff, k * 2.6 + rnd(-0.6, 0.6), rnd(-0.4, 0.6), rnd(-1.2, 1.2), { sy: 0.55 });
    const m = cb.mesh(false); m.position.set(rnd(-120, 120), rnd(30, 44), rnd(-120, 60)); m.userData.v = rnd(0.5, 1.2);
    scene.add(m); clouds.push(m);
  }
}

