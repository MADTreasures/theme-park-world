/* ================= instanced rendering ================= */
const FIGMAX = MAXG + 80;
function inst(geo, mat, n, shadow) {
  const m = new T.InstancedMesh(geo, mat, n);
  m.instanceMatrix.setUsage(T.DynamicDrawUsage); m.frustumCulled = false; m.castShadow = !!shadow; m.receiveShadow = !shadow;
  m.setColorAt(0, new T.Color(1, 1, 1)); m.instanceColor.array.fill(1); m.count = 0; scene.add(m); return m;
}
const FG = figureGeos(), MAT_FIG = MAT_INST();
const iTorso = inst(FG.torso, MAT_FIG, FIGMAX, true), iPelvis = inst(FG.pelvis, MAT_FIG, FIGMAX, true), iHead = inst(FG.head, MAT_FIG, FIGMAX, true);
const iThigh = inst(FG.thigh, MAT_FIG, FIGMAX * 2, true), iShin = inst(FG.shin, MAT_FIG, FIGMAX * 2, true), iSleeve = inst(FG.sleeve, MAT_FIG, FIGMAX * 2, true), iFore = inst(FG.forearm, MAT_FIG, FIGMAX * 2, true);
const iHair = FG.hair.map((g) => inst(g, MAT_FIG, FIGMAX, true)), iSkirt = inst(FG.skirt, MAT_FIG, FIGMAX, true), iPack = inst(FG.pack, MAT_FIG, FIGMAX, true), iShades = inst(FG.shades, MAT_FIG, FIGMAX, false);
const iBall = inst(FG.balloon, MAT_INST(), MAXG, false);
iBall.receiveShadow = false; iShades.receiveShadow = false;
const flatGeo = new T.PlaneGeometry(1, 1); flatGeo.rotateX(-Math.PI / 2);
const iPath = inst(flatGeo, new T.MeshLambertMaterial({ map: pathTex }), N * N, false);
const iLit = inst(new T.IcosahedronGeometry(0.07, 0), new T.MeshLambertMaterial({ color: 0xf6f2e4 }), 700, false);
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
const _rm = new T.Matrix4(), _lm = new T.Matrix4(), _tm = new T.Matrix4(), _km = new T.Matrix4(), _eu = new T.Euler(), _lq = new T.Quaternion(), _lp = new T.Vector3(), ONE = new T.Vector3(1, 1, 1);
function limb(parent, x, y, z, rx, rz, out, ry) { _lq.setFromEuler(_eu.set(rx, ry || 0, rz)); _lm.compose(_lp.set(x, y, z), _lq, ONE); return out.multiplyMatrices(parent, _lm); }
let nFig = 0, nLimb = 0, nSkirt = 0, nBall = 0, nPack = 0, nShades = 0; const nHair = FG.hair.map(() => 0);
function drawFigure(f, seat, ride, rdt, setCol) {
  if (nFig >= FIGMAX) return;
  const sc = f.sc, time = S.time; let pose = 0, p = 0;
  if (seat) {
    const sp = seat.userData.pose;
    _rm.copy(seat.matrixWorld);
    if (sp !== 'jump') _rm.multiply(_lm.makeTranslation(0, -FIG.SEAT * sc, 0));
    _rm.scale(_gs.set(sc, sc, sc));
    pose = sp === 'jump' ? 3 : sp === 'straddle' ? 4 : 2;
  } else {
    let d = f.rot - f.rr; d = Math.atan2(Math.sin(d), Math.cos(d)); f.rr += d * Math.min(1, rdt * 14);
    p = time * 9.5 * f.sp / sc + f.ph; pose = f.moving ? 1 : 0;
    _gq.setFromAxisAngle(UP, f.rr); _gp.set(f.x, pose ? Math.abs(Math.sin(p)) * 0.014 * sc : 0, f.z); _rm.compose(_gp, _gq, _gs.set(sc, sc, sc));
  }
  // joint angles: thighs, knees, upper arms, elbows, head turn
  let tl = 0, tr = 0, kl = 0, kr = 0, al = 0.06, ar = 0.06, el = -0.22, er = -0.22, spread = 0, hy = 0;
  if (pose === 1) {
    const sn = Math.sin(p), cs = Math.cos(p);
    tl = -0.55 * sn; tr = 0.55 * sn; kl = 0.95 * Math.max(0, cs); kr = 0.95 * Math.max(0, -cs);
    al = 0.5 * sn; ar = -0.5 * sn; el = -0.35 - 0.3 * Math.max(0, -sn); er = -0.35 - 0.3 * Math.max(0, sn);
  } else if (pose === 2 || pose === 4) {
    if (pose === 4) { tl = tr = -1.0; kl = kr = 1.0; spread = 0.5; } else { tl = tr = -1.5; kl = kr = 1.45; }
    al = ar = -0.5; el = er = -1.0; hy = Math.sin(time * 0.9 + f.ph) * 0.3;
    if (ride && f.brave > 0.45 && ride.def.exc >= 54 && ride.state === 'run' && ride.spin > 0.5) { const w = Math.sin(time * 7 + f.ph) * 0.2; al = -2.7 + w; ar = -2.7 - w; el = er = -0.15; }
  } else if (pose === 3) { const w = Math.sin(time * 6 + f.ph); tl = -0.3 - w * 0.2; tr = -0.3 + w * 0.2; kl = kr = 0.6; al = -2.3 + w * 0.4; ar = -2.3 - w * 0.4; el = er = -0.2; }
  else hy = Math.sin(time * 0.6 + f.ph * 3) * 0.45;
  if (f.balloon && pose < 2) { ar = -0.5; er = -1.25; }
  if (f.chatT > 0) { ar = -2.5 + 0.35 * Math.sin(time * 9); er = -0.3; hy = 0; }
  const ty = f.type;
  if (ty === 'jan') { ar = f.job === 'clean' ? -0.45 + 0.3 * Math.sin(time * 10) : -0.35; er = -0.05; }
  else if (ty === 'mech') { if (f.job === 'fix') { al = -1.0 + 0.3 * Math.sin(time * 12); ar = -1.0 - 0.3 * Math.sin(time * 12); el = er = -0.7; } else { al = 0.02; el = 0; } }
  else if (ty === 'clown' && f.job === 'show') { al = -2.4 + 0.5 * Math.sin(time * 8); el = -0.3; ar = -2.4 - 0.5 * Math.sin(time * 8); er = -0.3; tl = 0.25 * Math.sin(time * 8); tr = -tl; }
  else if (ty === 'jug' && f.job === 'juggle') { al = ar = -0.3; el = -1.3 + 0.25 * Math.sin(time * 9.5); er = -1.3 - 0.25 * Math.sin(time * 9.5); hy = 0; }
  const i = nFig, j = nLimb, seated = pose === 2 || pose === 4;
  iTorso.setMatrixAt(i, _rm); iPelvis.setMatrixAt(i, _rm);
  limb(_rm, 0, FIG.NECK, 0, 0, 0, _tm, hy); if (f.hk !== 1) _tm.scale(_gs.set(f.hk, f.hk, f.hk));
  iHead.setMatrixAt(i, _tm);
  if (f.hair >= 0) { const h = f.hair, k = nHair[h]++; iHair[h].setMatrixAt(k, _tm); if (setCol) iHair[h].setColorAt(k, _gc.set(f.hairCol)); }
  if (f.shades) iShades.setMatrixAt(nShades++, _tm);
  limb(_rm, -FIG.LX, FIG.HIP, 0, tl, -spread, _tm); iThigh.setMatrixAt(j, _tm); iShin.setMatrixAt(j, limb(_tm, 0, -FIG.THIGH, 0, kl, 0, _km));
  limb(_rm, FIG.LX, FIG.HIP, 0, tr, spread, _tm); iThigh.setMatrixAt(j + 1, _tm); iShin.setMatrixAt(j + 1, limb(_tm, 0, -FIG.THIGH, 0, kr, 0, _km));
  limb(_rm, -FIG.SX, FIG.SHO, 0, al, -0.07, _tm); iSleeve.setMatrixAt(j, _tm); iFore.setMatrixAt(j, limb(_tm, 0, -FIG.UARM, 0, el, 0, _km));
  limb(_rm, FIG.SX, FIG.SHO, 0, ar, 0.07, _tm); iSleeve.setMatrixAt(j + 1, _tm); iFore.setMatrixAt(j + 1, limb(_tm, 0, -FIG.UARM, 0, er, 0, _km));
  const skirt = f.bottom === 2 && !seated;
  if (skirt) { iSkirt.setMatrixAt(nSkirt, _rm); if (setCol) iSkirt.setColorAt(nSkirt, _gc.set(f.pants)); nSkirt++; }
  if (f.pack) { iPack.setMatrixAt(nPack, _rm); if (setCol) iPack.setColorAt(nPack, _gc.set(f.pack)); nPack++; }
  if (f.balloon) { iBall.setMatrixAt(nBall, _rm); iBall.setColorAt(nBall, _gc.set(f.balloon)); nBall++; }
  if (setCol) {
    iTorso.setColorAt(i, _gc.set(f.shirt)); iPelvis.setColorAt(i, _gc.set(f.pants)); iHead.setColorAt(i, _gc.set(f.skin));
    _gc.set(skirt ? f.skin : f.pants); iThigh.setColorAt(j, _gc); iThigh.setColorAt(j + 1, _gc);
    _gc.set(f.bottom === 0 ? f.pants : f.skin); iShin.setColorAt(j, _gc); iShin.setColorAt(j + 1, _gc);
    _gc.set(f.top === 1 ? f.skin : f.shirt); iSleeve.setColorAt(j, _gc); iSleeve.setColorAt(j + 1, _gc);
    _gc.set(f.top === 2 ? f.shirt : f.skin); iFore.setColorAt(j, _gc); iFore.setColorAt(j + 1, _gc);
  }
  nFig++; nLimb += 2;
}
function renderPeople(rdt) {
  nFig = nLimb = nSkirt = nBall = nPack = nShades = 0; nHair.fill(0);
  const setCol = colorsDirty, time = S.time;
  for (const g of guests) {
    if (nFig >= MAXG) break;
    if (g.state !== 'ride') drawFigure(g, null, null, rdt, setCol); else if (g.seat) drawFigure(g, g.seat, g.target, rdt, setCol);
  }
  for (const f of thieves) drawFigure(f, null, null, rdt, setCol);
  for (const s of staff) {
    const m = s.mesh;
    if (s.state === 'rest') continue;
    if (s.fig) {
      drawFigure(s, null, null, rdt, setCol);
      m.position.set(s.x, s.job === 'fix' ? -0.16 : 0, s.z); m.rotation.y = s.rr; m.rotation.x = s.job === 'clean' ? Math.sin(time * 10) * 0.22 : 0;
      const balls = m.userData.balls;
      if (balls) for (let i = 0; i < 3; i++) {
        if (s.job === 'juggle') { const q = time * 1.5 + i / 3, u = q % 1, dir = Math.floor(q) % 2 ? 1 : -1; balls[i].position.set(dir * lerp(-0.1, 0.1, u), 0.4 + 0.44 * 4 * u * (1 - u), 0.14); }
        else balls[i].position.set(-0.03 + i * 0.03, 0.3 + (i === 1 ? 0.03 : 0), 0.06);
      }
    } else {
      let d = s.rot - s.rr; d = Math.atan2(Math.sin(d), Math.cos(d)); s.rr += d * Math.min(1, rdt * 10);
      const p = time * 8 + s.ph;
      m.position.set(s.x, s.moving ? Math.abs(Math.sin(p)) * 0.035 : 0, s.z); m.rotation.y = s.rr; m.rotation.z = s.moving ? Math.sin(p) * 0.08 : 0;
    }
  }
  iTorso.count = iPelvis.count = iHead.count = nFig; iThigh.count = iShin.count = iSleeve.count = iFore.count = nLimb; iSkirt.count = nSkirt; iBall.count = nBall; iPack.count = nPack; iShades.count = nShades;
  for (const m of [iTorso, iPelvis, iHead, iThigh, iShin, iSleeve, iFore, iSkirt, iBall, iPack, iShades]) m.instanceMatrix.needsUpdate = true;
  for (let h = 0; h < iHair.length; h++) { iHair[h].count = nHair[h]; iHair[h].instanceMatrix.needsUpdate = true; if (setCol) iHair[h].instanceColor.needsUpdate = true; }
  iBall.instanceColor.needsUpdate = true;
  if (setCol) { for (const m of [iTorso, iPelvis, iHead, iThigh, iShin, iSleeve, iFore, iSkirt, iPack]) m.instanceColor.needsUpdate = true; colorsDirty = false; }
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
  thief: (c) => { c.fillStyle = '#f1c39a'; c.beginPath(); c.arc(0, 2, 24, 0, TAU); c.fill(); c.fillStyle = INK; c.fillRect(-25, -10, 50, 15); c.beginPath(); c.arc(0, -4, 24, Math.PI, 0); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(-9, -3, 4.5, 0, TAU); c.arc(9, -3, 4.5, 0, TAU); c.fill(); c.strokeStyle = INK; c.lineWidth = 3; c.beginPath(); c.arc(0, 20, 9, 1.15 * Math.PI, 1.85 * Math.PI); c.stroke(); },
  litter: (c) => { c.fillStyle = '#8a8fa8'; c.fillRect(-14, -8, 28, 30); c.fillStyle = INK; c.fillRect(-19, -15, 38, 6); c.fillRect(-6, -21, 12, 6); c.fillStyle = '#fff'; c.fillRect(-7, -2, 3, 18); c.fillRect(4, -2, 3, 18); },
  fix: (c) => { c.fillStyle = '#ffd447'; c.strokeStyle = INK; c.lineWidth = 4; c.beginPath(); c.moveTo(0, -25); c.lineTo(27, 20); c.lineTo(-27, 20); c.closePath(); c.fill(); c.stroke(); c.fillStyle = INK; c.fillRect(-3, -9, 6, 16); c.fillRect(-3, 11, 6, 6); },
  nopath: (c) => { c.fillStyle = '#ead7a6'; c.strokeStyle = INK; c.lineWidth = 3; c.beginPath(); c.moveTo(-8, -24); c.lineTo(8, -24); c.lineTo(20, 22); c.lineTo(-20, 22); c.closePath(); c.fill(); c.stroke(); glyph('?', INK, 34)(c); },
};
const ICON = {};
for (const k in ICON_DRAW) ICON[k] = new T.SpriteMaterial({ map: bubble(ICON_DRAW[k]), depthTest: false });
const sprites = [];
for (let i = 0; i < 44; i++) { const s = new T.Sprite(ICON.happy); s.center.set(0.5, 0); s.visible = false; s.renderOrder = 10; scene.add(s); sprites.push(s); }
const selMark = new T.Mesh(new T.ConeGeometry(0.13, 0.26, 4), new T.MeshBasicMaterial({ color: 0xffd447 })); selMark.rotation.x = Math.PI; selMark.visible = false; scene.add(selMark);
function renderIcons() {
  let n = 0; const sz = clamp(cam.d * 0.034, 0.5, 1.7);
  const put = (mat, x, y, z, k) => { const s = sprites[n++]; s.material = mat; s.position.set(x, y, z); s.scale.set(sz * k, sz * k, 1); s.visible = true; };
  for (const b of builds) {
    if (n >= 12) break;
    if (b.broken) put(ICON.fix, b.group.position.x, b.top + 0.3 + Math.sin(S.time * 3) * 0.08, b.group.position.z, 1.5);
    else if (!b.def.noPath && !connected(b)) put(ICON.nopath, b.group.position.x, b.top + 0.3, b.group.position.z, 1.5);
  }
  for (const f of thieves) if (f.spotted && n < 16) put(ICON.fix, f.x, 0.68, f.z, 0.9);
  for (const s of staff) if (s.mood < 30 && s.state !== 'rest' && n < 20) put(ICON.angry, s.x, 0.7, s.z, 0.8);
  const cap = Math.min(sprites.length, n + 18);
  for (const g of guests) { if (n >= cap) break; if (g.think > 0 && g.state !== 'ride') put(ICON[g.tk] || ICON.happy, g.x, 0.6 * g.sc + 0.03, g.z, 0.85 * Math.min(1, g.think * 4, (2.8 - g.think) * 6 + 0.2)); }
  for (let i = n; i < sprites.length; i++) sprites[i].visible = false;
  const sg = sel && (sel.guest || (sel.staff && sel.staff.state !== 'rest' ? sel.staff : null));
  if (sg && sg.state !== 'ride') { selMark.visible = true; selMark.position.set(sg.x, 0.66 * (sg.sc || 1.2) + 0.22 + Math.sin(performance.now() * 0.006) * 0.06, sg.z); selMark.rotation.y += 0.05; } else selMark.visible = false;
}

/* ----- build helpers in the scene ----- */
const hl = new T.Mesh(flatGeo, new T.MeshBasicMaterial({ color: 0x3ddbb4, transparent: true, opacity: 0.5, depthWrite: false })); hl.visible = false; hl.renderOrder = 3; scene.add(hl);
const selHl = new T.Mesh(flatGeo, new T.MeshBasicMaterial({ color: 0xffd447, transparent: true, opacity: 0.55, depthWrite: false })); selHl.visible = false; selHl.renderOrder = 3; scene.add(selHl);
const gridPts = [];
for (let i = 0; i <= N; i++) { const p = -HALF + i; gridPts.push(p, 0.03, -HALF, p, 0.03, HALF, -HALF, 0.03, p, HALF, 0.03, p); }
const gridGeo = new T.BufferGeometry(); gridGeo.setAttribute('position', new T.Float32BufferAttribute(gridPts, 3));
const gridLines = new T.LineSegments(gridGeo, new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 })); gridLines.visible = false; scene.add(gridLines);

