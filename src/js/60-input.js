/* ================= pointer and keyboard ================= */
const ray = new T.Raycaster(), ndc = new T.Vector2(), GROUND = new T.Plane(new T.Vector3(0, 1, 0), 0), gHit = new T.Vector3();
function setRay(cx, cy) { const r = canvas.getBoundingClientRect(); ndc.set((cx - r.left) / r.width * 2 - 1, -((cy - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); }
function tileAt(cx, cy) {
  setRay(cx, cy); if (!ray.ray.intersectPlane(GROUND, gHit)) return null;
  const x = Math.floor(gHit.x + HALF), y = Math.floor(gHit.z + HALF); return inB(x, y) ? [x, y] : null;
}
function objAt(cx, cy) {
  setRay(cx, cy);
  const list = []; for (const o of builds) list.push(o.group); for (const o of decos) if (!o.nat) list.push(o.group); for (const m of plotMesh) if (m) list.push(m);
  const hits = ray.intersectObjects(list, true);
  for (const h of hits) {
    if (h.object.material === MAT_LAMP) continue;
    let o = h.object; while (o && !o.userData.obj) o = o.parent;
    if (o) return o.userData.obj;
    // a wild plant: they share one mesh per plot, so the tile under the hit tells which one it is
    const x = Math.floor(h.point.x + HALF), y = Math.floor(h.point.z + HALF), ob = inB(x, y) ? tObj[idx(x, y)] : null;
    if (ob && ob.nat) return ob;
  }
  return null;
}
function groundPt(cx, cy) { setRay(cx, cy); return ray.ray.intersectPlane(GROUND, gHit) ? [gHit.x, gHit.z] : null; }
// Picks the person under the pointer: the click has to land on the line from feet to head, the nearest one wins.
function figAt(list, cx, cy) {
  const r = canvas.getBoundingClientRect(); let best = null, bd = 9;
  for (const g of list) {
    if (g.state === 'ride' || g.state === 'rest') continue;
    _v.set(g.x, 0.04, g.z).project(camera); if (_v.z > 1) continue;
    const x0 = (_v.x * 0.5 + 0.5) * r.width + r.left, y0 = (-_v.y * 0.5 + 0.5) * r.height + r.top, depth = _v.z;
    _v.set(g.x, 0.64, g.z).project(camera);
    const x1 = (_v.x * 0.5 + 0.5) * r.width + r.left, y1 = (-_v.y * 0.5 + 0.5) * r.height + r.top, len2 = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
    const t = clamp(((cx - x0) * (x1 - x0) + (cy - y0) * (y1 - y0)) / (len2 || 1), 0, 1), d = Math.hypot(cx - (x0 + (x1 - x0) * t), cy - (y0 + (y1 - y0) * t));
    if (d < Math.max(16, Math.sqrt(len2) * 0.4) && depth < bd) { bd = depth; best = g; }
  }
  return best;
}
function hover(cx, cy) {
  if (!tool) return;
  const t = tileAt(cx, cy);
  if (tool.type === 'track') { tool.mouse = true; const key = t ? t[0] + ',' + t[1] : ''; if (key !== tool.hk) { tool.hk = key; trackHover = t; drawTrackPrev(); } return; }
  if (tool.type === 'build') { if (t && !pending) showGhost(t[0], t[1]); return; }
  if (tool.type === 'land') { landHover(t); return; }
  if (!t) { hl.visible = false; return; }
  const i = idx(t[0], t[1]);
  if (tool.type === 'path') setHl(t[0], t[1], 1, 1, tType[i] === 0 && owned[i] === 1 && S.money >= 5, tType[i] === 3 && tObj[i].def.plant && owned[i] === 1);
  else { const ob = tObj[i]; if (ob) setHl(ob.x, ob.y, ob.w, ob.h, false); else if (tType[i] === 1 && i !== ENT) setHl(t[0], t[1], 1, 1, false); else hl.visible = false; }
}
function click(cx, cy, ptype) {
  const t = tileAt(cx, cy);
  if (tool) {
    if (tool.type === 'track') trackClick(t, ptype, groundPt(cx, cy));
    else if (tool.type === 'land') landClick(t);
    else if (tool.type === 'path') { if (t) buildPath(t[0], t[1]); }
    else if (tool.type === 'doze') { const ob = objAt(cx, cy); if (ob) dozeTile(ob.x, ob.y, false); else if (t) dozeTile(t[0], t[1], false); }
    else if (t) {
      const d = DEFS[tool.k];
      if (ptype !== 'mouse' && d.cost >= 100) { pending = { x: t[0], y: t[1] }; showGhost(t[0], t[1]); renderToolbar(); }
      else { showGhost(t[0], t[1]); tryBuild(); }
    }
    return;
  }
  if (pov) return;
  const ht = handTarget(cx, cy);
  if (ht) { handPress(cx, cy, ptype !== 'mouse', ht.guard ? 'knock' : 'grab'); if (ht.thief) throwThief(ht.thief, true); else pokeGuard(ht.guard); return; }
  const th = figAt(thieves.filter(thiefActive), cx, cy); if (th) { markThief(th); return; }
  const g = figAt(guests, cx, cy); if (g) { select({ guest: g }); sfx('click'); return; }
  const sf = figAt(staff, cx, cy); if (sf) { select({ staff: sf }); sfx('click'); return; }
  const ob = objAt(cx, cy) || (t && tObj[idx(t[0], t[1])]);
  if (ob) { select({ obj: ob }); sfx('click'); }
  else if (t && !owned[idx(t[0], t[1])] && plotForSale(plotOf(t[0], t[1]))) { select(null); ui.tab = null; openTab('land'); landClick(t); }   // a tap on land for sale opens the land office
  else select(null);
}
function landHover(t) {
  if (tool.plot >= 0) return;
  const p = t ? plotOf(t[0], t[1]) : -1;
  if (p >= 0 && !plotOwned[p]) setHl((p % PN) * PLOT, ((p / PN) | 0) * PLOT, PLOT, PLOT, plotForSale(p)); else hl.visible = false;
}
function landClick(t) {
  if (!tool || tool.type !== 'land' || !t) return;
  const p = plotOf(t[0], t[1]);
  if (plotOwned[p]) { tool.plot = -1; hl.visible = false; toast('Dieses Land gehört dir schon.'); }
  else if (!plotForSale(p)) { tool.plot = -1; hl.visible = false; sfx('error'); toast('Kaufe zuerst ein Stück, das an dein Land grenzt.', 'bad'); }
  else { tool.plot = p; setHl((p % PN) * PLOT, ((p / PN) | 0) * PLOT, PLOT, PLOT, S.money >= landPrice()); sfx('click'); }
  renderToolbar();
}
const ptr = new Map(); let pmode = 'none', down = null, lastTile = null, pinch = null;
function paintAt(cx, cy) {
  if (tool.type === 'track') { const p = groundPt(cx, cy); if (p) trackDraw(p); return; }
  const t = tileAt(cx, cy); if (!t) return;
  if (lastTile && lastTile[0] === t[0] && lastTile[1] === t[1]) return;
  let x = lastTile ? lastTile[0] : t[0], y = lastTile ? lastTile[1] : t[1];
  const apply = (px, py) => { if (tool.type === 'path') buildPath(px, py); else dozeTile(px, py, true); };
  if (!lastTile) apply(x, y);
  while (x !== t[0] || y !== t[1]) { if (Math.abs(t[0] - x) >= Math.abs(t[1] - y)) x += Math.sign(t[0] - x); else y += Math.sign(t[1] - y); apply(x, y); }
  lastTile = t; setHl(t[0], t[1], 1, 1, tool.type === 'path');
}
function pinchState() {
  const p = Array.from(ptr.values()), dx = p[1].x - p[0].x, dy = p[1].y - p[0].y;
  return { d: Math.max(20, Math.hypot(dx, dy)), a: Math.atan2(dy, dx), mx: (p[0].x + p[1].x) / 2, my: (p[0].y + p[1].y) / 2 };
}
canvas.addEventListener('pointerdown', (e) => {
  try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* not critical */ }
  ptr.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptr.size === 1) { down = { x: e.clientX, y: e.clientY, btn: e.button, type: e.pointerType, moved: false }; pmode = e.button === 0 ? 'pending' : 'rotate'; lastTile = null; }
  else if (ptr.size === 2) { pmode = 'pinch'; pinch = pinchState(); }
  e.preventDefault();
});
canvas.addEventListener('pointermove', (e) => {
  const p = ptr.get(e.pointerId);
  if (!p) { if (e.pointerType === 'mouse') { hover(e.clientX, e.clientY); handHover(e.clientX, e.clientY); } return; }
  const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
  if (pmode === 'pinch') {
    if (ptr.size < 2 || fp || pov) return;
    const s = pinchState(); let da = s.a - pinch.a; if (da > Math.PI) da -= TAU; else if (da < -Math.PI) da += TAU;
    cam.dist = clamp(cam.dist * pinch.d / s.d, 7, 80); cam.az += da; cam.a += da; panPx(s.mx - pinch.mx, s.my - pinch.my); pinch = s; return;
  }
  if (!down) return;
  if (pmode === 'pending' && Math.hypot(e.clientX - down.x, e.clientY - down.y) > (down.type === 'mouse' ? 5 : 10)) {
    pmode = tool && (tool.type === 'path' || tool.type === 'doze' || (tool.type === 'track' && tool.station)) ? 'paint' : 'pan';
    if (pmode === 'paint') { if (tool.type === 'track') tool.sel = null; paintAt(down.x, down.y); } else canvas.style.cursor = 'grabbing';
  }
  if (pmode === 'paint') paintAt(e.clientX, e.clientY);
  else if (pmode === 'pan') { if (fp || pov) modeLook(dx, dy); else panPx(dx, dy); }
  else if (pmode === 'rotate' && (fp || pov)) modeLook(dx, dy);
  else if (pmode === 'rotate') { cam.az -= dx * 0.006; cam.el = clamp(cam.el + dy * 0.005, 0.3, 1.45); if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) down.moved = true; }
  if (e.pointerType === 'mouse' && pmode !== 'paint') hover(e.clientX, e.clientY);
});
function pointerEnd(e) {
  if (!ptr.delete(e.pointerId)) return;
  if (ptr.size > 0) { if (pmode === 'pinch') pmode = 'done'; return; }
  if (pmode === 'pending' && down && e.type === 'pointerup') click(down.x, down.y, down.type);
  else if (pmode === 'rotate' && down && !down.moved && down.btn === 2 && tool) ACT.cancel();
  pmode = 'none'; down = null; lastTile = null; canvas.style.cursor = '';
}
canvas.addEventListener('pointerup', pointerEnd);
canvas.addEventListener('pointercancel', pointerEnd);
canvas.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'mouse') return; handHide(); if (tool && tool.type !== 'build') hl.visible = false; });
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('wheel', (e) => { e.preventDefault(); if (fp || pov) return; cam.dist = clamp(cam.dist * Math.exp(e.deltaY * (e.deltaMode ? 0.04 : 0.0012)), 7, 80); }, { passive: false });
window.addEventListener('keydown', (e) => {
  const tag = e.target && e.target.tagName, k = e.key.toLowerCase();
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (tag === 'INPUT') { if (k === 'enter') e.target.blur(); return; }
  if (ui.title) return;   // no shortcuts on the title screen
  if (k === 'escape') { if (ui.modal) closeModal(); else if (tool) ACT.cancel(); else if (sel) select(null); else if (fp || pov) exitMode(); return; }
  if (ui.modal) { if (ui.mini && (k === 'arrowleft' || k === 'a')) miniLane(-1); else if (ui.mini && (k === 'arrowright' || k === 'd')) miniLane(1); return; }
  keys[k] = true;
  if (fp && (k === 'q' || k === 'e')) { fp.yaw += k === 'q' ? 0.4 : -0.4; return; }
  if (k === 'r') rotateTool();
  else if (k === ' ' && tag !== 'BUTTON') { S.speed = S.speed ? 0 : ui.lastSpeed; e.preventDefault(); audioSync(true); }
  else if (k === '1' || k === '2' || k === '3') { S.speed = ui.lastSpeed = k === '3' ? 4 : +k; audioSync(true); }
  else if (k === 'q') cam.az += Math.PI / 8; else if (k === 'e') cam.az -= Math.PI / 8;
  else if (k.startsWith('arrow') && tag !== 'BUTTON') e.preventDefault();
  uiDirty = true;
});
window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });
window.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

