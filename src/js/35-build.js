/* ================= building sites and builders ================= */
// A new attraction is not there at once: it starts as a building site with scaffolding and rises while builders work on
// it. Every site asks for a number of builders (one to begin with; the player can ask for more), free builders walk over
// by themselves, and more hands finish sooner. Builders are staff like everyone else: wages, mood, breaks, a bed.
// One builder lives in the gate house; every builders' yard has room for three more.
let hammerAt = 0;
const buildTime = (ob) => Math.round(10 + ob.def.cost / 40);   // seconds of work for a single builder
function builderPlaces() { let n = 1; for (const b of builds) if (b.def.builders && !b.removed) n += b.def.builders; return n; }
const anySite = () => { for (const b of builds) if (b.site) return true; return false; };
// scaffolding around the footprint, barrier boards at its foot
function siteFx(ob) {
  const g = new T.Group(), b = new Builder(), hw = ob.w / 2 - 0.06, hh = ob.h / 2 - 0.06, H = clamp((ob.top || 2) + 0.25, 1.3, 6.5), POLE = 0xf2c200;
  for (const [x, z] of [[-hw, -hh], [hw, -hh], [-hw, hh], [hw, hh]]) b.cyl(0.03, 0.03, H, POLE, x, H / 2, z, { seg: 6 });
  for (let y = 0.95; y < H + 0.5; y += 1.1) { const yy = Math.min(y, H); b.box(hw * 2, 0.035, 0.035, POLE, 0, yy, -hh); b.box(hw * 2, 0.035, 0.035, POLE, 0, yy, hh); b.box(0.035, 0.035, hh * 2, POLE, -hw, yy, 0); b.box(0.035, 0.035, hh * 2, POLE, hw, yy, 0); }
  b.box(hw * 2 - 0.1, 0.03, 0.24, 0xc79a5e, 0, 0.985, -hh + 0.12); b.box(0.24, 0.03, hh * 2 - 0.1, 0xc79a5e, -hw + 0.12, 0.985, 0);
  const boards = (x0, z0, x1, z1) => { const n = Math.max(2, Math.round(Math.hypot(x1 - x0, z1 - z0) / 0.32)); for (let i = 0; i < n; i++) { const t = (i + 0.5) / n; b.box(Math.max(0.025, Math.abs(x1 - x0) / n), 0.09, Math.max(0.025, Math.abs(z1 - z0) / n), i % 2 ? K.paper : K.red, lerp(x0, x1, t), 0.3, lerp(z0, z1, t)); } };
  boards(-hw, -hh, hw, -hh); boards(-hw, hh, hw, hh); boards(-hw, -hh, -hw, hh); boards(hw, -hh, hw, hh);
  const m = b.mesh(false); g.add(m); g.position.copy(ob.group.position); g.userData.H = H; scene.add(g); return g;
}
function startSite(ob, saved) {
  const bar = new T.Group(), bg = new T.Mesh(new T.PlaneGeometry(1.12, 0.17), new T.MeshBasicMaterial({ color: 0x171a42, depthTest: false, transparent: true })), fill = new T.Mesh(new T.PlaneGeometry(1, 0.1), new T.MeshBasicMaterial({ color: 0x3ddbb4, depthTest: false, transparent: true }));
  bg.renderOrder = 11; fill.renderOrder = 12; fill.position.z = 0.002; bar.add(bg, fill); overlay.add(bar);
  const fx = siteFx(ob); bar.position.set(ob.group.position.x, fx.userData.H + 0.28, ob.group.position.z);
  ob.site = { total: saved ? saved[1] : buildTime(ob), done: saved ? saved[0] : 0, want: saved ? saved[2] : 1, crew: [], rate: 0, fx, bar, fill };
  ob.group.scale.y = 0.05; uiDirty = true;
}
function endSite(ob) {
  const st = ob.site; if (!st) return;
  for (const s of st.crew.slice()) leaveSite(s);
  scene.remove(st.fx); st.fx.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); overlay.remove(st.bar); st.bar.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  ob.site = null; ob.group.scale.y = 1;
}
function finishSite(ob) {
  endSite(ob); ob.loadT = 0; pathVersion++; uiDirty = true;
  sfx('goal', 0.7); toast(ob.def.name + ' ist fertig gebaut und öffnet.', 'gold', ob);
  if (sel && sel.obj === ob) renderPanel();
}
function leaveSite(s) {
  const b = s.site; if (b && b.site) { const i = b.site.crew.indexOf(s); if (i >= 0) b.site.crew.splice(i, 1); }
  s.site = null; if (s.job === 'build') { s.job = null; s.busy = 0; }
}
// how many builders a site should have; surplus hands are sent away at once
function setCrew(ob, n) { const st = ob.site; if (!st) return; st.want = clamp(n, 0, 6); while (st.crew.length > st.want) leaveSite(st.crew[st.crew.length - 1]); uiDirty = true; }
// the tiles around a site where a builder can stand
function siteRing(ob) {
  const r = new Set();
  for (let j = -1; j <= ob.h; j++) for (let i = -1; i <= ob.w; i++) {
    if (i >= 0 && i < ob.w && j >= 0 && j < ob.h) continue;
    const x = ob.x + i, y = ob.y + j; if (inB(x, y) && walkable(idx(x, y))) r.add(idx(x, y));
  }
  return r;
}
// more builders than places, because a yard was pulled down: those hired last leave, and their hiring fee comes back
function noPlace(s) { let k = 0; for (const o of staff) { if (o === s) break; if (o.type === 'build' && o.state !== 'quit') k++; } return k >= builderPlaces(); }
// What a builder does next: a route to walk, null to stroll, or false when he stays where he is.
function buildPlan(s) {
  if (s.site && (s.site.removed || !s.site.site)) leaveSite(s);
  if (noPlace(s)) { toast(s.name + ' hat keinen Platz im Bauhof mehr und verlässt den Park. Die Einstellungskosten bekommst du zurück.', 'bad'); earn(STAFF.build.hire, 'bonus'); removeStaff(s); return false; }
  if (!s.site) {   // the site that is shortest of hands
    let best = null, lack = 0;
    for (const b of builds) if (b.site) { const l = b.site.want - b.site.crew.length; if (l > lack) { lack = l; best = b; } }
    if (best) { s.site = best; best.site.crew.push(s); }
  }
  const b = s.site;
  if (b) {
    const ring = siteRing(b);
    if (ring.has(s.tile)) { s.busy = 3; s.job = 'build'; s.off = true; s.rot = Math.atan2(b.group.position.x - s.x, b.group.position.z - s.z); return false; }
    const route = fieldRoute(s.tile, (t) => ring.has(t));
    if (!route) { leaveSite(s); return null; }
    s.off = true; return route;
  }
  s.off = false;
  let home = null;   // nothing to build: wait at a yard
  for (const y of builds) if (y.def.builders && !y.removed) for (const a of accessOf(y)) (home || (home = new Set())).add(a);
  if (home) { if (home.has(s.tile)) { s.busy = 3.5; s.job = null; return false; } const r = bfsRoute(s.tile, (t) => home.has(t)); if (r) return r; }
  return null;
}
function stepSites(dt) {
  for (let i = 0; i < builds.length; i++) {
    const b = builds[i], st = b.site; if (!st) continue;
    let rate = 0; for (const s of st.crew) if (s.job === 'build') rate += (s.mood < 35 ? 0.72 : 1) * (s.energy < 8 ? 0.8 : 1);
    st.rate = rate; st.done += dt * rate;
    if (rate && S.time - hammerAt > 0.4) { hammerAt = S.time; sfxAt(Math.random() < 0.82 ? 'hammer' : 'saw', b.group.position.x, b.group.position.z, 0.8); }
    if (st.done >= st.total) finishSite(b);
  }
}
// the attraction rises with the work done, the bar above it fills
function sitesFrame() {
  const sz = clamp(cam.d * 0.034, 0.5, 1.7);
  for (const b of builds) {
    const st = b.site; if (!st) continue; const p = clamp(st.done / st.total, 0, 1);
    b.group.scale.y = 0.05 + 0.95 * p;
    st.bar.quaternion.copy(camera.quaternion); st.bar.scale.setScalar(sz * 1.15); st.fill.scale.x = Math.max(0.001, p); st.fill.position.x = -(1 - p) / 2;
  }
}
