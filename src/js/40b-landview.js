/* ================= how the land looks ================= */
// Land that is not owned lies under a dark tint. A white fence runs around the park's own land, plots that can be bought
// carry a sign, and plants marked for the gardener get a red marker above them.
const landCv = document.createElement('canvas'); landCv.width = landCv.height = N * 2;
const landTex = new T.CanvasTexture(landCv);
const landPlane = new T.Mesh(new T.PlaneGeometry(N, N), new T.MeshBasicMaterial({ map: landTex, transparent: true, depthWrite: false }));
landPlane.rotation.x = -Math.PI / 2; landPlane.position.y = 0.012; landPlane.renderOrder = 1; scene.add(landPlane);
function drawSale(c, w, h) {
  c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.strokeStyle = '#232861'; c.lineWidth = 12; c.strokeRect(6, 6, w - 12, h - 12);
  c.fillStyle = '#232861'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = '400 58px Bungee, Impact, "Arial Black", sans-serif'; c.fillText('LAND', w / 2, h * 0.36);
  c.font = '400 25px Bungee, Impact, "Arial Black", sans-serif'; c.fillText('ZU VERKAUFEN', w / 2, h * 0.73);
}
const saleTex = canvasTex(256, 128, drawSale);
if (document.fonts && document.fonts.load) document.fonts.load('40px Bungee').then(() => { drawSale(saleTex.image.getContext('2d'), 256, 128); saleTex.needsUpdate = true; }).catch(() => {});
const iSign = inst(new T.BoxGeometry(1.6, 0.8, 0.08), softMat({ map: saleTex }, 0.2), PN * PN, true);
const iSignPost = inst(new T.CylinderGeometry(0.05, 0.06, 1.0, 8), softMat({ color: K.woodD }, 0.2), PN * PN * 2, true);
const MAT_SALE = new T.MeshBasicMaterial({ color: 0xffd447, transparent: true, opacity: 0.3, depthWrite: false });
const iSale = inst(flatGeo, MAT_SALE, PN * PN, false, false); iSale.renderOrder = 2; iSale.visible = false;
const iCut = inst(new T.OctahedronGeometry(0.13, 0), new T.MeshBasicMaterial({ color: 0xff4f64 }), 300, false, false);
let fenceMesh = null;
function rebuildLand() {
  landDirty = false;
  // tint
  const c = landCv.getContext('2d'), s = landCv.width / N; c.clearRect(0, 0, landCv.width, landCv.height); c.fillStyle = 'rgba(16,48,66,0.36)';
  for (let p = 0; p < PN * PN; p++) if (!plotOwned[p]) c.fillRect((p % PN) * PLOT * s, ((p / PN) | 0) * PLOT * s, PLOT * s, PLOT * s);
  landTex.needsUpdate = true;
  // fence along every edge between the park's land and anything else; the gate stays open
  if (fenceMesh) { scene.remove(fenceMesh); fenceMesh.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); }
  const b = new Builder(), posts = new Set();
  const post = (x, z) => { const k = x + ',' + z; if (posts.has(k)) return; posts.add(k); b.box(0.07, 0.42, 0.07, K.paper, x, 0.21, z); };
  const rail = (x0, z0, x1, z1) => { b.box(Math.abs(x1 - x0) + 0.04, 0.05, Math.abs(z1 - z0) + 0.04, K.paper, (x0 + x1) / 2, 0.33, (z0 + z1) / 2); post(x0, z0); post(x1, z1); };
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (!owned[idx(x, y)]) continue;
    const wx0 = x - HALF, wz0 = y - HALF;
    if (!ownedAt(x, y - 1)) rail(wx0, wz0, wx0 + 1, wz0);
    if (!ownedAt(x - 1, y)) rail(wx0, wz0, wx0, wz0 + 1);
    if (!ownedAt(x + 1, y)) rail(wx0 + 1, wz0, wx0 + 1, wz0 + 1);
    if (!ownedAt(x, y + 1)) {
      if (y === N - 1 && Math.abs(x - HALF) <= 1) { if (x === HALF - 1) rail(wx0, wz0 + 1, wx0 + 0.27, wz0 + 1); else if (x === HALF + 1) rail(wx0 + 0.73, wz0 + 1, wx0 + 1, wz0 + 1); }
      else rail(wx0, wz0 + 1, wx0 + 1, wz0 + 1);
    }
  }
  fenceMesh = b.mesh(); scene.add(fenceMesh);
  // signs and highlights on the plots that can be bought next
  let n = 0;
  for (let p = 0; p < PN * PN; p++) {
    if (!plotForSale(p)) continue;
    const cx = (p % PN) * PLOT + PLOT / 2 - HALF, cz = ((p / PN) | 0) * PLOT + PLOT / 2 - HALF;
    iSign.setMatrixAt(n, _gm.makeTranslation(cx, 1.25, cz)); iSignPost.setMatrixAt(n * 2, _gm.makeTranslation(cx - 0.55, 0.5, cz)); iSignPost.setMatrixAt(n * 2 + 1, _gm.makeTranslation(cx + 0.55, 0.5, cz));
    iSale.setMatrixAt(n, _gm.makeScale(PLOT - 0.5, 1, PLOT - 0.5).setPosition(cx, 0.04, cz)); n++;
  }
  iSign.count = iSale.count = n; iSignPost.count = n * 2;
  iSign.instanceMatrix.needsUpdate = iSignPost.instanceMatrix.needsUpdate = iSale.instanceMatrix.needsUpdate = true;
}
function landFrame() {
  if (landDirty) rebuildLand();
  rebuildPlots();
  const t = worldT, n = Math.min(cuts.length, 300), k = clamp(cam.d / 22, 0.9, 2.4);
  for (let i = 0; i < n; i++) {
    const o = cuts[i];
    _gq.setFromAxisAngle(UP, t * 2 + i); _gp.set(wX(o.x), PLANT_TOP[o.k] + 0.2 + Math.sin(t * 3 + i) * 0.06, wZ(o.y));
    iCut.setMatrixAt(i, _gm.compose(_gp, _gq, _gs.set(k, k * 1.3, k)));
  }
  iCut.count = n; iCut.instanceMatrix.needsUpdate = true;
  const land = !!tool && tool.type === 'land'; iSale.visible = land; if (land) MAT_SALE.opacity = 0.24 + 0.12 * Math.sin(t * 4);
}
