/* ================= instanced rendering ================= */
const FIGMAX = MAXG + 80;
function inst(geo, mat, n, cast, receive) {
  const m = new T.InstancedMesh(geo, mat, n);
  m.instanceMatrix.setUsage(T.DynamicDrawUsage); m.frustumCulled = false; m.castShadow = !!cast; m.receiveShadow = receive === undefined ? !cast : receive;
  m.setColorAt(0, new T.Color(1, 1, 1)); m.instanceColor.array.fill(1); m.count = 0; scene.add(m); return m;
}
// People neither cast nor receive real shadows: a soft round shadow under their feet is cheaper and suits the toy look.
// Every part exists twice, light (FGL) for crowds and smooth (FGH) for close views; the meshes switch between the two.
const FGL = figureGeos(0), FGH = figureGeos(1), MAT_FIG = MAT_INST(0.5, 0.16), MAT_EYE = new T.MeshBasicMaterial({ vertexColors: true });
const figParts = [];
function figPart(key, n, mat, sub) {
  const m = inst(sub === undefined ? FGL[key] : FGL[key][sub], mat || MAT_FIG, n || FIGMAX, false, false);
  m.userData.geo = sub === undefined ? [FGL[key], FGH[key]] : [FGL[key][sub], FGH[key][sub]]; figParts.push(m); return m;
}
const iTorso = figPart('torso'), iTrim = figPart('trim'), iPelvis = figPart('pelvis'), iHead = figPart('head');
const iThigh = figPart('thigh', FIGMAX * 2), iShin = figPart('shin', FIGMAX * 2), iShoe = figPart('shoe', FIGMAX * 2), iSole = figPart('sole', FIGMAX * 2), iSleeve = figPart('sleeve', FIGMAX * 2), iFore = figPart('forearm', FIGMAX * 2), iHand = figPart('hand', FIGMAX * 2);
const iHair = FGL.hair.map((g, k) => figPart('hair', 0, null, k)), iSkirt = figPart('skirt'), iPack = figPart('pack'), iShades = figPart('shades'), iMask = figPart('mask', 16);
const iEyes = figPart('eye', FIGMAX * 2, MAT_EYE), iIris = figPart('iris', FIGMAX * 2, MAT_EYE), iLid = figPart('lid', FIGMAX * 2, MAT_EYE), iBrow = figPart('brow', FIGMAX * 2), iMouth = FGL.mouth.map((g, k) => figPart('mouth', 0, null, k));
const iBall = inst(FGL.balloon, MAT_INST(0.5, 0.5), MAXG, false, false);
const MAT_BLOB = new T.MeshBasicMaterial({ color: 0x1b1838, transparent: true, opacity: 0.22, depthWrite: false });
const iBlob = inst(FGL.blob, MAT_BLOB, FIGMAX, false, false); iBlob.renderOrder = 2;
const flatGeo = new T.PlaneGeometry(1, 1); flatGeo.rotateX(-Math.PI / 2);
const iPath = inst(flatGeo, flatMat({ map: pathTex }), N * N, false);
const iLit = inst(new T.IcosahedronGeometry(0.07, 0), softMat({ color: 0xf6f2e4 }, 0), 700, false);
const _gm = new T.Matrix4(), _gq = new T.Quaternion(), _gp = new T.Vector3(), _gs = new T.Vector3(), _gc = new T.Color();
function rebuildPaths() {
  let n = 0;
  for (let i = 0; i < N * N; i++) if (tType[i] === 1) { _gm.makeTranslation(wX(tX(i)), 0.02, wZ(tY(i))); iPath.setMatrixAt(n++, _gm); }
  iPath.count = n; iPath.instanceMatrix.needsUpdate = true; pathDirty = false;
}
function rebuildLitter() {
  let n = 0;
  for (let i = 0; i < N * N; i++) for (let k = 0; k < litter[i] && n < 700; k++) {
    const h = ((i * 37 + k * 101) % 97) / 97, h2 = ((i * 53 + k * 71) % 89) / 89;
    _gq.setFromAxisAngle(UP, h * TAU); _gp.set(wX(tX(i)) + (h - 0.5) * 0.7, 0.05, wZ(tY(i)) + (h2 - 0.5) * 0.7); _gs.set(1, 0.5, 0.8 + h2 * 0.6);
    iLit.setMatrixAt(n++, _gm.compose(_gp, _gq, _gs));
  }
  iLit.count = n; iLit.instanceMatrix.needsUpdate = true; litterDirty = false;
}
const _rm = new T.Matrix4(), _lm = new T.Matrix4(), _tm = new T.Matrix4(), _km = new T.Matrix4(), _hm = new T.Matrix4(), _fm = new T.Matrix4(), M0 = new T.Matrix4().makeScale(0, 0, 0);
const _eu = new T.Euler(), _eb = new T.Euler(0, 0, 0, 'YXZ'), _lq = new T.Quaternion(), _lp = new T.Vector3(), _ls = new T.Vector3(), ONE = new T.Vector3(1, 1, 1);
const _fr = new T.Frustum(), _sph = new T.Sphere(new T.Vector3(), 0.9), ECOS = Math.cos(FIG.EYAW), ESIN = Math.sin(FIG.EYAW);
function limb(parent, x, y, z, rx, rz, out, ry) { _lq.setFromEuler(_eu.set(rx, ry || 0, rz)); _lm.compose(_lp.set(x, y, z), _lq, ONE); return out.multiplyMatrices(parent, _lm); }
// one part of a face: sits on the head (_hm), can be squashed, turned to follow the skull and tilted
function facePart(mesh, k, x, y, z, sx, sy, ry, rz) { _lq.setFromEuler(_eu.set(0, ry || 0, rz || 0)); _lm.compose(_lp.set(x, y, z), _lq, _ls.set(sx, sy, 1)); mesh.setMatrixAt(k, _fm.multiplyMatrices(_hm, _lm)); }
// a part of one eye (sd = -1 left, 1 right); lx, ly shift it within the plane of the eye
function eyePart(mesh, k, sd, lx, ly, sx, sy, rz) { facePart(mesh, k, sd * FIG.EX + lx * ECOS, FIG.EY + ly, FIG.EZ - sd * lx * ESIN, sx, sy, sd * FIG.EYAW, rz); }
function follow(o, m) { o.matrix.copy(m); o.matrixWorldNeedsUpdate = true; }
let nFig = 0, nLimb = 0, nSkirt = 0, nBall = 0, nPack = 0, nShades = 0, nMask = 0, nBlob = 0, figT = 0, figFaces = true, figHi = false;
const nHair = FGL.hair.map(() => 0), nMouth = FGL.mouth.map(() => 0);
// Mouths: 0 smile, 1 open, 2 frown, 3 a round "o", 4 straight.
function drawFigure(f, seat, ride, rdt) {
  if (nFig >= FIGMAX) return;
  const sc = f.sc, time = S.time, rt = figT, ph = f.ph, ty = f.type, tk = f.think > 0 && !ty && !f.thief ? f.tk : '';
  let pose = 0, p = 0, lean = 0;
  if (seat) {
    const sp = seat.userData.pose, e = seat.matrixWorld.elements;
    if (!_fr.intersectsSphere(_sph.set(_gp.set(e[12], e[13] + 0.2, e[14]), 0.9))) return;
    _rm.copy(seat.matrixWorld);
    if (sp !== 'jump' && sp !== 'throw') _rm.multiply(_lm.makeTranslation(0, -FIG.SEAT * sc, 0));
    _rm.scale(_gs.set(sc, sc, sc));
    pose = sp === 'jump' ? 3 : sp === 'throw' ? 7 : sp === 'straddle' ? 4 : 2;
  } else {
    let d = f.rot - f.rr; d = Math.atan2(Math.sin(d), Math.cos(d)); f.rr += d * Math.min(1, rdt * 14);
    if (!_fr.intersectsSphere(_sph.set(_gp.set(f.x, (f.fy || 0) + 0.4, f.z), 0.95))) return;
    p = time * 9.5 * f.sp / sc + ph; pose = f.moving ? 1 : 0;
    let x = f.x, y = 0, sway = 0, st = 1;
    if (f.state === 'thrown') { _gq.setFromEuler(_eu.set(f.tum, f.rr, f.tum * 0.4)); y = f.fy; pose = 6; }
    else {
      if (f.asleep) { y = -(FIG.HIP - 0.06) * sc; pose = 5; st = 1 + Math.sin(rt * 1.7 + ph) * 0.02; if (f.shake > 0) x += Math.sin(rt * 60) * 0.025; }
      else if (pose) { const s = Math.abs(Math.sin(p)); y = s * 0.024 * sc; st = 0.97 + 0.06 * s; sway = Math.sin(p) * 0.045; lean = f.thief && f.state !== 'prowl' && f.state !== 'in' ? 0.24 : f.chase ? 0.18 : 0.07; }
      else { st = 1 + Math.sin(rt * 2.1 + ph) * 0.012; sway = Math.sin(rt * 0.8 + ph * 2) * 0.02; }
      if (tk === 'great' || (ty === 'clown' && f.job === 'show')) { const h = Math.abs(Math.sin(rt * 7 + ph)); y += h * 0.06 * sc; st *= 0.95 + 0.1 * h; }
      else if (tk === 'sick') lean = 0.24;
      if (f.state === 'held') x += Math.sin(rt * 43) * 0.004;
      _gq.setFromEuler(_eb.set(lean, f.rr, sway));
    }
    const w = sc * (1.5 - 0.5 * st);
    _rm.compose(_gp.set(x, y, f.z), _gq, _gs.set(w, sc * st, w));
    if (pose !== 6 || (Math.abs(f.x) < HALF + 0.4 && Math.abs(f.z) < HALF + 0.4)) {
      const bs = sc * (pose === 6 ? Math.max(0.35, 1 - f.fy * 0.12) : pose === 5 ? 1.3 : 1);
      iBlob.setMatrixAt(nBlob++, _gm.makeScale(bs, 1, bs).setPosition(f.x, 0.032, f.z));
    }
  }
  const thrill = !!(seat && ride && ride.state === 'run' && ride.spin > 0.5 && ride.def.exc >= 40);
  // joint angles: thighs, knees, upper arms, elbows, and the head's turn, nod and tilt
  let tl = 0, tr = 0, kl = 0, kr = 0, al = 0.06, ar = 0.06, el = -0.22, er = -0.22, spread = 0, hy = 0, hx = 0, hz = 0;
  if (pose === 1) {
    const sn = Math.sin(p), cs = Math.cos(p);
    tl = -0.6 * sn; tr = 0.6 * sn; kl = Math.max(0, cs); kr = Math.max(0, -cs);
    al = 0.6 * sn; ar = -0.6 * sn; el = -0.4 - 0.35 * Math.max(0, -sn); er = -0.4 - 0.35 * Math.max(0, sn);
    hz = -sn * 0.05; hy = Math.sin(rt * 0.5 + ph * 3) * 0.22;
  } else if (pose === 2 || pose === 4) {
    if (pose === 4) { tl = tr = -1.0; kl = kr = 1.0; spread = 0.5; } else { tl = tr = -1.5; kl = kr = 1.45; }
    al = ar = -0.5; el = er = -1.0; hy = Math.sin(time * 0.9 + ph) * 0.3;
    if (thrill && f.brave > 0.45 && ride.def.exc >= 54) { const w = Math.sin(time * 7 + ph) * 0.2; al = -2.7 + w; ar = -2.7 - w; el = er = -0.15; }
  } else if (pose === 3) { const w = Math.sin(time * 6 + ph); tl = -0.3 - w * 0.2; tr = -0.3 + w * 0.2; kl = kr = 0.6; al = -2.3 + w * 0.4; ar = -2.3 - w * 0.4; el = er = -0.2; }
  else if (pose === 5) { tl = tr = -1.5; kl = kr = 0.06; al = ar = -0.35; el = er = -0.95; hx = f.shake > 0 ? 0.15 : 0.5 + Math.sin(rt * 1.7 + ph) * 0.06; hy = 0.3; hz = 0.12; }
  else if (pose === 6) { const w = rt * 18 + ph; tl = Math.sin(w) * 0.9; tr = -tl; kl = kr = 0.6; al = -2 + Math.cos(w); ar = -2 - Math.cos(w); }
  else if (pose === 7) { const w = (time * 0.9 + ph) % 1; ar = w < 0.35 ? lerp(0.4, -2.6, w / 0.35) : lerp(-2.6, 0.2, Math.min(1, (w - 0.35) / 0.15)); er = -0.5; al = -0.2; }
  else { hy = Math.sin(rt * 0.6 + ph * 3) * 0.5; hz = Math.sin(rt * 0.43 + ph * 5) * 0.07; }
  if (f.state === 'held') { al = ar = -2.75; el = er = -0.25; hy = 0; tl = Math.sin(rt * 31) * 0.05; tr = -tl; }
  if (f.job === 'hold') { ar = -1.35; er = -0.15; hy = 0; }
  if (f.balloon && pose < 2) { ar = -0.5; er = -1.25; }
  if (pose < 2 && tk) {
    if (tk === 'great') { const w = Math.sin(rt * 9 + ph) * 0.25; al = -2.7 + w; ar = -2.7 - w; el = er = -0.2; hx = -0.15; }
    else if (tk === 'bye') { ar = -2.7 + 0.3 * Math.sin(rt * 11); er = -0.35; }
    else if (tk === 'angry') { ar = -2.0 + 0.22 * Math.sin(rt * 15); er = -1.3; }
    else if (tk === 'sick') { ar = -1.2; er = -1.9; hx = 0.1; }
    else if (tk === 'thief') { al = ar = -1.35; el = er = -1.85; }
    else if (tk === 'food') { al = -0.55; el = -1.6; }
  }
  if (f.chatT > 0) { ar = -2.5 + 0.35 * Math.sin(rt * 9); er = -0.3; hy = 0; }
  if (ty === 'jan') { ar = f.job === 'clean' ? -0.45 + 0.3 * Math.sin(time * 10) : -0.35; er = -0.05; }
  else if (ty === 'mech') { al = 0.02; el = 0; if (f.job === 'fix') { ar = -1.25 + 0.5 * Math.sin(time * 12); er = -0.9; hx = 0.2; hy = 0; } }
  else if (ty === 'gard') { al = 0.02; el = 0; if (f.job === 'cut') { ar = -1.2 + 0.35 * Math.sin(time * 13); er = -0.7; hx = 0.15; hy = 0; } else if (f.job === 'water') { al = -0.9; el = -0.5; hx = 0.2; hy = 0; } }
  else if (ty === 'clown' && f.job === 'show') { al = -2.4 + 0.5 * Math.sin(time * 8); el = -0.3; ar = -2.4 - 0.5 * Math.sin(time * 8); er = -0.3; tl = 0.25 * Math.sin(time * 8); tr = -tl; }
  else if (ty === 'jug' && f.job === 'juggle') { al = ar = -0.3; el = -1.3 + 0.25 * Math.sin(time * 9.5); er = -1.3 - 0.25 * Math.sin(time * 9.5); hy = 0; hx = -0.2; }
  else if (ty === 'sec' && f.chase && pose === 1) { ar = -1.5; er = -0.1; hy = 0; }
  const i = nFig, j = nLimb, seated = pose === 2 || pose === 4, u = f.fig && f.mesh ? f.mesh.userData : null, skin = f.skin;
  iTorso.setMatrixAt(i, _rm); iTrim.setMatrixAt(i, _rm); iPelvis.setMatrixAt(i, _rm);
  if (u && u.body) follow(u.body, _rm);
  limb(_rm, 0, FIG.NECK, 0, hx - lean * 0.8, hz, _hm, hy); if (f.hk !== 1) _hm.scale(_gs.set(f.hk, f.hk, f.hk));
  iHead.setMatrixAt(i, _hm);
  if (u && u.head) follow(u.head, _hm);
  if (f.hair >= 0) { const h = f.hair, k = nHair[h]++; iHair[h].setMatrixAt(k, _hm); iHair[h].setColorAt(k, _gc.set(f.hairCol)); }
  if (f.shades) iShades.setMatrixAt(nShades++, _hm);
  if (f.thief && nMask < 16) iMask.setMatrixAt(nMask++, _hm);
  if (figFaces) {
    // the face: mouth shape and size, brow tilt (positive worried, negative angry) and lift, how far the eyes are open,
    // how they are closed (1 asleep or blinking, 2 beaming), where they look and how large the irises are
    let mo = 0, mw = 1, ms = 1, ba = 0, bl = 0, eo = 1, ec = 1, lx = 0, ly = 0, ps = 1;
    if (f.thief) {
      if (f.state === 'held') { mo = 3; ba = 0.5; bl = 0.012; ps = 0.72; lx = Math.sin(rt * 11) * 0.006; }
      else if (f.state === 'thrown') { mo = 1; ms = 1.3; ba = 0.45; bl = 0.016; ps = 0.7; }
      else if (f.state === 'prowl' || f.state === 'in') { ba = -0.4; mw = 0.8; lx = Math.sin(rt * 1.9 + ph) > 0 ? 0.0055 : -0.0055; }
      else { mo = 3; ba = 0.35; bl = 0.01; ps = 0.8; }
    } else if (ty) {
      if (f.asleep) { if (f.shake > 0) { eo = 0.6; bl = 0.014; mo = 3; } else { eo = 0; mo = 3; ms = 0.7 + 0.4 * Math.sin(rt * 1.7 + ph); ba = 0.12; } }
      else if (ty === 'clown') { mo = f.job === 'show' ? 1 : 0; mw = 1.2; bl = 0.008; if (f.job === 'show' && Math.sin(rt * 2.3 + ph) > 0.2) { eo = 0; ec = 2; } }
      else if (ty === 'sec' && f.job === 'hold') { mo = 0; ba = -0.4; }
      else if (ty === 'sec' && f.chase) { mo = 1; ba = -0.55; ms = 0.8; }
      else if (f.job === 'juggle') { mo = 1; ms = 0.7; ly = 0.008; bl = 0.008; }
      else if (f.state === 'quit' || f.mood < 30) { mo = 2; ba = -0.4; }
      else if (f.mood < 50) { mo = 4; ba = 0.12; }
      else if (f.job === 'fix' || f.job === 'clean' || f.job === 'cut') { mo = 4; mw = 0.7; ba = -0.15; ly = -0.006; }
    } else if (thrill) {
      if (f.brave > 0.45) { mo = 1; ms = 1.2; bl = 0.014; if (f.brave > 0.8) { eo = 0; ec = 2; } } else { mo = 3; ms = 1.3; ba = 0.45; bl = 0.014; ps = 0.72; }
    } else if (pose === 3) { mo = 1; bl = 0.01; }
    else if (f.chatT > 0) { mo = 1; ms = 0.6 + 0.4 * Math.abs(Math.sin(rt * 10)); bl = 0.008; }
    else if (tk === 'great') { mo = 1; ms = 1.15; bl = 0.014; eo = 0; ec = 2; }
    else if (tk === 'happy' || tk === 'bye') { mw = 1.15; bl = 0.008; }
    else if (tk === 'sick') { mo = 3; ms = 0.8; ba = 0.5; eo = 0.6; }
    else if (tk === 'thief') { mo = 3; ms = 1.5; mw = 1.2; ba = 0.5; bl = 0.02; ps = 0.7; }
    else if (tk === 'food' || tk === 'drink' || tk === 'wc') { mo = 4; ba = 0.4; ly = 0.006; }
    else if (tk) { mo = 2; ba = -0.5; }
    else if (f.nausea > 55) { mo = 3; ms = 0.8; ba = 0.45; eo = 0.6; }
    else if (f.state === 'queue' && f.qt > f.patience * 0.55) { mo = 4; ba = -0.25; }
    else if (f.happy > 60) mo = 0;
    else if (f.happy > 34) mo = 4;
    else { mo = 2; ba = 0.3; }
    if (eo > 0.3 && (rt * 0.9 + ph * 7) % 4.3 < 0.13) eo = 0;
    if (!lx && !ly && pose !== 5) { const gz = Math.floor(rt * 0.75 + ph), h = Math.sin(gz * 12.9898 + ph * 78.233) * 43758.5453, r = h - Math.floor(h); if (r > 0.45) { lx = (r - 0.725) * (pose === 1 ? 0.018 : 0.04); ly = ((r * 7) % 1 - 0.5) * 0.006; } }
    if (f.shades) { iEyes.setMatrixAt(j, M0); iEyes.setMatrixAt(j + 1, M0); iIris.setMatrixAt(j, M0); iIris.setMatrixAt(j + 1, M0); iLid.setMatrixAt(j, M0); iLid.setMatrixAt(j + 1, M0); }
    else if (eo > 0.3) {
      const ih = ps * Math.min(1, eo * 1.3);
      eyePart(iEyes, j, -1, 0, 0, 1, eo); eyePart(iEyes, j + 1, 1, 0, 0, 1, eo); eyePart(iIris, j, -1, lx, ly, ps, ih); eyePart(iIris, j + 1, 1, lx, ly, ps, ih);
      iLid.setMatrixAt(j, M0); iLid.setMatrixAt(j + 1, M0);
    } else {
      const rz = ec === 2 ? 0 : Math.PI;
      eyePart(iLid, j, -1, 0, 0, 1, 1, rz); eyePart(iLid, j + 1, 1, 0, 0, 1, 1, rz);
      iEyes.setMatrixAt(j, M0); iEyes.setMatrixAt(j + 1, M0); iIris.setMatrixAt(j, M0); iIris.setMatrixAt(j + 1, M0);
    }
    facePart(iBrow, j, -FIG.EX, FIG.BROW[0] + bl, FIG.BROW[1], 1, 1, -0.5, ba); facePart(iBrow, j + 1, FIG.EX, FIG.BROW[0] + bl, FIG.BROW[1], 1, 1, 0.5, -ba);
    facePart(iMouth[mo], nMouth[mo]++, 0, FIG.MOUTH[0], FIG.MOUTH[1], mw, ms);
    _gc.set(f.eye || 0x5b3a1e); iIris.setColorAt(j, _gc); iIris.setColorAt(j + 1, _gc);
    _gc.set(f.browCol || f.hairCol); iBrow.setColorAt(j, _gc); iBrow.setColorAt(j + 1, _gc);
  }
  limb(_rm, -FIG.LX, FIG.HIP, 0, tl, -spread, _tm); iThigh.setMatrixAt(j, _tm); limb(_tm, 0, -FIG.THIGH, 0, kl, 0, _km); iShin.setMatrixAt(j, _km); iShoe.setMatrixAt(j, _km); iSole.setMatrixAt(j, _km);
  limb(_rm, FIG.LX, FIG.HIP, 0, tr, spread, _tm); iThigh.setMatrixAt(j + 1, _tm); limb(_tm, 0, -FIG.THIGH, 0, kr, 0, _km); iShin.setMatrixAt(j + 1, _km); iShoe.setMatrixAt(j + 1, _km); iSole.setMatrixAt(j + 1, _km);
  limb(_rm, -FIG.SX, FIG.SHO, 0, al, -0.09, _tm); iSleeve.setMatrixAt(j, _tm); limb(_tm, 0, -FIG.UARM, 0, el, 0, _km); iFore.setMatrixAt(j, _km); iHand.setMatrixAt(j, _km); if (u && u.handL) follow(u.handL, _km);
  limb(_rm, FIG.SX, FIG.SHO, 0, ar, 0.09, _tm); iSleeve.setMatrixAt(j + 1, _tm); limb(_tm, 0, -FIG.UARM, 0, er, 0, _km); iFore.setMatrixAt(j + 1, _km); iHand.setMatrixAt(j + 1, _km); if (u && u.handR) follow(u.handR, _km);
  const skirt = f.bottom === 2 && !seated;
  if (skirt) { iSkirt.setMatrixAt(nSkirt, _rm); iSkirt.setColorAt(nSkirt, _gc.set(f.pants)); nSkirt++; }
  if (f.pack) { iPack.setMatrixAt(nPack, _rm); iPack.setColorAt(nPack, _gc.set(f.pack)); nPack++; }
  if (f.balloon && nBall < MAXG) { iBall.setMatrixAt(nBall, _rm); iBall.setColorAt(nBall, _gc.set(f.balloon)); nBall++; }
  iTorso.setColorAt(i, _gc.set(f.shirt)); iTrim.setColorAt(i, _gc.set(f.trim === undefined ? 0xffffff : f.trim)); iPelvis.setColorAt(i, _gc.set(f.pants)); iHead.setColorAt(i, _gc.set(skin));
  _gc.set(f.bottom === 2 ? skin : f.pants); iThigh.setColorAt(j, _gc); iThigh.setColorAt(j + 1, _gc);
  _gc.set(f.bottom === 0 ? f.pants : skin); iShin.setColorAt(j, _gc); iShin.setColorAt(j + 1, _gc);
  _gc.set(f.shoe === undefined ? 0xffffff : f.shoe); iShoe.setColorAt(j, _gc); iShoe.setColorAt(j + 1, _gc);
  _gc.set(f.top === 1 ? skin : f.shirt); iSleeve.setColorAt(j, _gc); iSleeve.setColorAt(j + 1, _gc);
  _gc.set(f.top === 2 ? f.shirt : skin); iFore.setColorAt(j, _gc); iFore.setColorAt(j + 1, _gc);
  _gc.set(skin); iHand.setColorAt(j, _gc); iHand.setColorAt(j + 1, _gc);
  nFig++; nLimb += 2;
}
function renderPeople(rdt) {
  nFig = nLimb = nSkirt = nBall = nPack = nShades = nMask = nBlob = 0; nHair.fill(0); nMouth.fill(0);
  figT = performance.now() * 0.001; figFaces = !!(fp || pov) || cam.d < 36;
  const hi = !!(fp || pov) || cam.d < 15, time = S.time;
  if (hi !== figHi) { figHi = hi; for (const m of figParts) m.geometry = m.userData.geo[hi ? 1 : 0]; }
  camera.updateMatrixWorld(); _fr.setFromProjectionMatrix(_fm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
  for (const g of guests) {
    if (nFig >= MAXG) break;
    if (g.state !== 'ride') drawFigure(g, null, null, rdt); else if (g.seat) drawFigure(g, g.seat, g.target, rdt);
  }
  for (const f of thieves) drawFigure(f, null, null, rdt);
  for (const s of staff) {
    const m = s.mesh;
    if (s.state === 'rest') continue;
    if (s.fig) {
      drawFigure(s, null, null, rdt);
      const balls = m.userData.balls;
      if (balls) for (let i = 0; i < 3; i++) {
        if (s.job === 'juggle') { const q = time * 1.5 + i / 3, u = q % 1, dir = Math.floor(q) % 2 ? 1 : -1; balls[i].position.set(dir * lerp(-0.082, 0.082, u), 0.33 + 0.42 * 4 * u * (1 - u), 0.118); }
        else balls[i].position.set(-0.03 + i * 0.03, 0.255 + (i === 1 ? 0.03 : 0), 0.08);
      }
    } else {
      let d = s.rot - s.rr; d = Math.atan2(Math.sin(d), Math.cos(d)); s.rr += d * Math.min(1, rdt * 10);
      const p = time * 8 + s.ph, hop = s.moving ? Math.abs(Math.sin(p)) : 0, st = s.moving ? 0.93 + 0.14 * hop : 1 + Math.sin(figT * 2.4 + s.ph) * 0.025;
      m.position.set(s.x, hop * 0.05, s.z); m.rotation.y = s.rr; m.rotation.z = s.moving ? Math.sin(p) * 0.1 : 0; m.scale.set(1.5 - 0.5 * st, st, 1.5 - 0.5 * st);
      iBlob.setMatrixAt(nBlob++, _gm.makeScale(1.9, 1, 1.9).setPosition(s.x, 0.032, s.z));
    }
  }
  const nFace = figFaces ? nLimb : 0, lv = clamp(hemi.intensity + sun.intensity * 0.9, 0.5, 1); MAT_EYE.color.setRGB(lv, lv, lv);
  iTorso.count = iTrim.count = iPelvis.count = iHead.count = nFig; iThigh.count = iShin.count = iShoe.count = iSole.count = iSleeve.count = iFore.count = iHand.count = nLimb;
  iSkirt.count = nSkirt; iBall.count = nBall; iPack.count = nPack; iShades.count = nShades; iMask.count = nMask; iEyes.count = iIris.count = iLid.count = iBrow.count = nFace; iBlob.count = nBlob; MAT_BLOB.opacity = 0.22 - night * 0.08;
  for (let h = 0; h < iHair.length; h++) iHair[h].count = nHair[h];
  for (let k = 0; k < iMouth.length; k++) iMouth[k].count = figFaces ? nMouth[k] : 0;
  for (const m of figParts) { m.instanceMatrix.needsUpdate = true; m.instanceColor.needsUpdate = true; }
  iBall.instanceMatrix.needsUpdate = iBall.instanceColor.needsUpdate = iBlob.instanceMatrix.needsUpdate = true; colorsDirty = false;
}

/* ----- thought bubbles and status signs ----- */
function bubble(draw) {
  return canvasTex(96, 96, (c) => {
    c.lineJoin = 'round'; c.fillStyle = '#fff'; c.strokeStyle = '#2a2350'; c.lineWidth = 5;
    c.beginPath(); c.moveTo(36, 72); c.lineTo(48, 93); c.lineTo(60, 72); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.arc(48, 41, 37, 0, TAU); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(40, 74); c.lineTo(48, 87); c.lineTo(56, 74); c.closePath(); c.fill();
    c.translate(48, 41); draw(c);
  });
}
const INK = '#2a2350';
const face = (col, mouth) => (c) => {
  c.fillStyle = col; c.beginPath(); c.arc(0, 0, 26, 0, TAU); c.fill();
  c.fillStyle = INK; c.beginPath(); c.arc(-9, -6, 3.8, 0, TAU); c.fill(); c.beginPath(); c.arc(9, -6, 3.8, 0, TAU); c.fill();
  c.strokeStyle = INK; c.lineWidth = 4; c.lineCap = 'round'; mouth(c);
};
const glyph = (txt, col, size) => (c) => { c.fillStyle = col; c.font = '900 ' + size + 'px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 0, 2); };
const ICON_DRAW = {
  happy: face('#ffd447', (c) => { c.beginPath(); c.arc(0, 2, 13, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke(); }),
  great: face('#ffd447', (c) => { c.fillStyle = INK; c.beginPath(); c.arc(0, 4, 13, 0, Math.PI); c.closePath(); c.fill(); }),
  sick: face('#a5dc6e', (c) => { c.beginPath(); c.moveTo(-12, 11); c.quadraticCurveTo(-6, 4, 0, 11); c.quadraticCurveTo(6, 18, 12, 11); c.stroke(); }),
  angry: face('#ff7d6e', (c) => { c.beginPath(); c.arc(0, 19, 11, 1.2 * Math.PI, 1.8 * Math.PI); c.stroke(); c.beginPath(); c.moveTo(-15, -15); c.lineTo(-5, -11); c.moveTo(15, -15); c.lineTo(5, -11); c.stroke(); }),
  bye: (c) => { c.fillStyle = '#ff4f64'; c.beginPath(); c.moveTo(0, 20); c.bezierCurveTo(-34, -4, -14, -30, 0, -10); c.bezierCurveTo(14, -30, 34, -4, 0, 20); c.fill(); },
  queue: (c) => { c.strokeStyle = INK; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.arc(0, 0, 22, 0, TAU); c.stroke(); c.beginPath(); c.moveTo(0, -13); c.lineTo(0, 0); c.lineTo(10, 6); c.stroke(); },
  food: (c) => { c.fillStyle = '#d9a25c'; c.beginPath(); c.arc(0, -4, 22, Math.PI, 0); c.closePath(); c.fill(); c.fillStyle = '#5cb85c'; c.fillRect(-24, -3, 48, 5); c.fillStyle = '#6b3a2a'; c.fillRect(-23, 3, 46, 8); c.fillStyle = '#d9a25c'; c.fillRect(-22, 12, 44, 8); },
  drink: (c) => { c.fillStyle = '#3d8bfd'; c.beginPath(); c.moveTo(-15, -10); c.lineTo(15, -10); c.lineTo(10, 24); c.lineTo(-10, 24); c.closePath(); c.fill(); c.fillStyle = INK; c.fillRect(-18, -15, 36, 6); c.strokeStyle = '#ff4f64'; c.lineWidth = 4; c.beginPath(); c.moveTo(3, -15); c.lineTo(10, -30); c.stroke(); },
  wc: glyph('WC', INK, 34),
  money: glyph('$', '#e0344b', 46),
  zzz: (c) => { c.fillStyle = '#3d8bfd'; c.font = '900 30px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('Z', -10, 8); c.font = '900 22px system-ui, sans-serif'; c.fillText('z', 8, -4); c.font = '900 16px system-ui, sans-serif'; c.fillText('z', 19, -15); },
  alert: glyph('!', '#e0344b', 52),
  hand: (c) => { c.fillStyle = '#fff6dc'; c.strokeStyle = INK; c.lineWidth = 4; c.lineJoin = 'round'; for (const [x, y, h] of [[-17, -14, 22], [-8, -22, 30], [1, -20, 28], [10, -13, 21]]) { c.beginPath(); c.rect(x, y, 8, h); c.fill(); c.stroke(); } c.beginPath(); c.moveTo(-17, 4); c.lineTo(18, 4); c.lineTo(18, 14); c.arc(4, 14, 14, 0, Math.PI); c.lineTo(-17, 4); c.fill(); c.stroke(); c.beginPath(); c.rect(-27, 2, 12, 8); c.fill(); c.stroke(); },
  thief: (c) => { c.fillStyle = '#f1c39a'; c.beginPath(); c.arc(0, 2, 24, 0, TAU); c.fill(); c.fillStyle = INK; c.fillRect(-25, -10, 50, 15); c.beginPath(); c.arc(0, -4, 24, Math.PI, 0); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(-9, -3, 4.5, 0, TAU); c.arc(9, -3, 4.5, 0, TAU); c.fill(); c.strokeStyle = INK; c.lineWidth = 3; c.beginPath(); c.arc(0, 20, 9, 1.15 * Math.PI, 1.85 * Math.PI); c.stroke(); },
  litter: (c) => { c.fillStyle = '#8a8fa8'; c.fillRect(-14, -8, 28, 30); c.fillStyle = INK; c.fillRect(-19, -15, 38, 6); c.fillRect(-6, -21, 12, 6); c.fillStyle = '#fff'; c.fillRect(-7, -2, 3, 18); c.fillRect(4, -2, 3, 18); },
  fix: (c) => { c.fillStyle = '#ffd447'; c.strokeStyle = INK; c.lineWidth = 4; c.beginPath(); c.moveTo(0, -25); c.lineTo(27, 20); c.lineTo(-27, 20); c.closePath(); c.fill(); c.stroke(); c.fillStyle = INK; c.fillRect(-3, -9, 6, 16); c.fillRect(-3, 11, 6, 6); },
  nopath: (c) => { c.fillStyle = '#ead7a6'; c.strokeStyle = INK; c.lineWidth = 3; c.beginPath(); c.moveTo(-8, -24); c.lineTo(8, -24); c.lineTo(20, 22); c.lineTo(-20, 22); c.closePath(); c.fill(); c.stroke(); glyph('?', INK, 34)(c); },
};
const ICON = {};
for (const k in ICON_DRAW) ICON[k] = new T.SpriteMaterial({ map: bubble(ICON_DRAW[k]), depthTest: false });
const SPLASH = new T.SpriteMaterial({ depthTest: false, transparent: true, map: canvasTex(64, 64, (c) => { c.strokeStyle = '#ffffff'; c.lineWidth = 5; c.beginPath(); c.arc(32, 40, 22, Math.PI, 0); c.stroke(); c.fillStyle = '#e9f8ff'; for (const [x, y, r] of [[14, 22, 4], [32, 12, 5], [50, 22, 4], [22, 30, 3], [42, 30, 3]]) { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); } }) });
const sprites = [];
for (let i = 0; i < 44; i++) { const s = new T.Sprite(ICON.happy); s.center.set(0.5, 0); s.visible = false; s.renderOrder = 10; overlay.add(s); sprites.push(s); }
const selMark = new T.Mesh(new T.ConeGeometry(0.13, 0.26, 4), new T.MeshBasicMaterial({ color: 0xffd447 })); selMark.rotation.x = Math.PI; selMark.visible = false; overlay.add(selMark);
// a held thief stands in a pillar of light with a pulsing ring, so he is easy to find from anywhere
const MAT_BEAM = new T.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.2, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide });
const MAT_RING = new T.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0.85, depthWrite: false });
const catchFx = [0, 1, 2].map(() => {
  const g = new T.Group(), beam = new T.Mesh(new T.CylinderGeometry(0.45, 0.45, 10, 16, 1, true), MAT_BEAM), ring = new T.Mesh(new T.RingGeometry(0.52, 0.66, 30), MAT_RING);
  beam.position.y = 5; ring.rotation.x = -Math.PI / 2; ring.position.y = 0.045; ring.renderOrder = 3; g.add(beam, ring); g.visible = false; scene.add(g); return g;
});
function renderIcons() {
  let n = 0, cf = 0; const sz = clamp(cam.d * 0.034, 0.5, 1.7), now = performance.now();
  for (const f of thieves) if (f.state === 'held' && cf < 3) { const g = catchFx[cf++], k = 1 + 0.3 * Math.sin(now * 0.008); g.visible = true; g.position.set(f.x, 0, f.z); g.children[1].scale.set(k, k, 1); }
  for (; cf < 3; cf++) catchFx[cf].visible = false;
  MAT_BEAM.opacity = 0.16 + 0.08 * Math.sin(now * 0.006);
  const put = (mat, x, y, z, k) => { const s = sprites[n++]; s.material = mat; s.position.set(x, y, z); s.scale.set(sz * k, sz * k, 1); s.visible = true; };
  for (const b of builds) {
    if (n >= 12) break;
    if (b.broken) put(ICON.fix, b.group.position.x, b.top + 0.3 + Math.sin(S.time * 3) * 0.08, b.group.position.z, 1.5);
    else if (!b.def.noPath && !connected(b)) put(ICON.nopath, b.group.position.x, b.top + 0.3, b.group.position.z, 1.5);
  }
  for (const f of thieves) { if (n >= 18) break; if (f.state === 'held') put(ICON.hand, f.x, 0.82, f.z, 1.25 + Math.sin(performance.now() * 0.01) * 0.18); else if (f.spotted && f.state !== 'thrown') put(ICON.alert, f.x, 0.76, f.z, 0.9); }
  for (const s of staff) { if (n >= 26) break; if (s.asleep) put(ICON.zzz, s.x + 0.08, 0.56 + Math.sin(performance.now() * 0.003) * 0.04, s.z, 1 + (s.wake || 0) * 0.12); else if (s.type === 'sec' && s.g === 'awake' && s.alertT > 71) put(ICON.alert, s.x, 0.78, s.z, 1); else if (s.mood < 30 && s.state !== 'rest') put(ICON.angry, s.x, 0.78, s.z, 0.8); }
  for (const sp of splashes) { sp.t += 0.03; if (n < sprites.length) put(SPLASH, sp.x, 0.1, sp.z, (0.9 + sp.t * 3.2) / sz); }
  if (splashes.length) { SPLASH.opacity = Math.max(0, 1 - splashes[0].t); if (splashes[0].t >= 1) splashes.shift(); }
  const cap = Math.min(sprites.length, n + 18);
  for (const g of guests) { if (n >= cap) break; if (g.think > 0 && g.state !== 'ride') put(ICON[g.tk] || ICON.happy, g.x, (g.kid ? 0.75 : 0.7) * g.sc, g.z, 0.85 * Math.min(1, g.think * 4, (2.8 - g.think) * 6 + 0.2)); }
  for (let i = n; i < sprites.length; i++) sprites[i].visible = false;
  const sg = sel && (sel.guest || (sel.staff && sel.staff.state !== 'rest' ? sel.staff : null));
  if (sg && sg.state !== 'ride') { selMark.visible = true; selMark.position.set(sg.x, 0.76 * (sg.sc || 1.2) + 0.2 + Math.sin(performance.now() * 0.006) * 0.06, sg.z); selMark.rotation.y += 0.05; } else selMark.visible = false;
}

/* ----- build helpers in the scene ----- */
const hl = new T.Mesh(flatGeo, new T.MeshBasicMaterial({ color: 0x3ddbb4, transparent: true, opacity: 0.5, depthWrite: false })); hl.visible = false; hl.renderOrder = 3; scene.add(hl);
const selHl = new T.Mesh(flatGeo, new T.MeshBasicMaterial({ color: 0xffd447, transparent: true, opacity: 0.55, depthWrite: false })); selHl.visible = false; selHl.renderOrder = 3; scene.add(selHl);
const gridPts = [];
for (let i = 0; i <= N; i++) { const p = -HALF + i; gridPts.push(p, 0.03, -HALF, p, 0.03, HALF, -HALF, 0.03, p, HALF, 0.03, p); }
const gridGeo = new T.BufferGeometry(); gridGeo.setAttribute('position', new T.Float32BufferAttribute(gridPts, 3));
const gridLines = new T.LineSegments(gridGeo, new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 })); gridLines.visible = false; scene.add(gridLines);

