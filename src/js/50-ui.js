/* ================= interface ================= */
const svg = (p) => '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">' + p + '</svg>';
const stroke = (d, w) => '<path d="' + d + '" fill="none" stroke="currentColor" stroke-width="' + (w || 2.4) + '" stroke-linecap="round" stroke-linejoin="round"/>';
const IC = {
  coin: svg('<circle cx="12" cy="12" r="10"/><path d="M15.5 8.3a4.6 4.6 0 1 0 0 7.4M6.8 10.8h6M6.8 13.2h6" fill="none" stroke="var(--bulb)" stroke-width="1.9" stroke-linecap="round"/>'),
  people: svg('<circle cx="8.5" cy="7.5" r="3.5"/><path d="M1.5 20.5c0-4.4 3-7 7-7s7 2.6 7 7z"/><circle cx="17.5" cy="8.5" r="2.8"/><path d="M16.6 13.4c3.4-.5 5.9 1.9 5.9 6.1h-5.2c-.1-2.3-.3-4.3-.7-6.1z"/>'),
  star: svg('<path d="M12 2.2l3 6.3 6.8.9-5 4.8 1.3 6.8L12 17.7 5.9 21l1.3-6.8-5-4.8L9 8.5z"/>'),
  sun: svg('<circle cx="12" cy="12" r="4.6"/>' + stroke('M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3M4.8 4.8l2.1 2.1M17.1 17.1l2.1 2.1M4.8 19.2l2.1-2.1M17.1 6.9l2.1-2.1', 2.2)),
  moon: svg('<path d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7z"/>'),
  cloud: svg('<path d="M7 19a5 5 0 0 1-.6-10A6.5 6.5 0 0 1 19 10.2 4.4 4.4 0 0 1 18.5 19z"/>'),
  rain: svg('<path d="M7 15a5 5 0 0 1-.6-10A6.5 6.5 0 0 1 19 6.2 4.4 4.4 0 0 1 18.5 15z"/>' + stroke('M8 18l-1 3.5M12.5 18l-1 3.5M17 18l-1 3.5', 2)),
  pause: svg('<rect x="5.5" y="4.5" width="4.5" height="15" rx="1.2"/><rect x="14" y="4.5" width="4.5" height="15" rx="1.2"/>'),
  play: svg('<path d="M7 4.2v15.6L20 12z"/>'),
  ff: svg('<path d="M3 5v14l9-7zM12.5 5v14l9-7z"/>'),
  fff: svg('<path d="M1.5 6v12l7-6zM8.5 6v12l7-6zM15.5 6v12l7-6z"/>'),
  menu: svg(stroke('M4 6.5h16M4 12h16M4 17.5h16', 2.6)),
  path: svg('<path fill-rule="evenodd" d="M8.5 3h7L21 21H3zM11.2 5.5h1.6v3h-1.6zM11.2 11h1.6v3.5h-1.6zM11.2 16.5h1.6V20h-1.6z"/>'),
  ride: svg('<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><circle cx="12" cy="10" r="7.2"/><path d="M12 2.8v14.4M4.8 10h14.4M6.9 4.9l10.2 10.2M17.1 4.9L6.9 15.1"/><path d="M12 10L7.5 21.2h9z"/></g><circle cx="12" cy="10" r="1.7"/>'),
  shop: svg('<path d="M2.5 9.5L4.5 4h15l2 5.5a2.4 2.4 0 0 1-4.7.4 2.4 2.4 0 0 1-4.8 0 2.4 2.4 0 0 1-4.8 0 2.4 2.4 0 0 1-4.7-.4z"/><path fill-rule="evenodd" d="M4.5 13h15v8h-15zM7 15v3.5h4.5V15z"/>'),
  deco: svg('<path d="M12 2a6.5 6.5 0 0 0-5.3 10.3A4.7 4.7 0 0 0 9 17.5h1.7V22h2.6v-4.5H15a4.7 4.7 0 0 0 2.3-5.2A6.5 6.5 0 0 0 12 2z"/>'),
  staff: svg('<circle cx="12" cy="9" r="3.8"/><path d="M7.3 7.2h9.4l-.7-2.7a4.1 4.1 0 0 0-8 0z"/><path d="M4.5 21.5c0-4.7 3.2-7.3 7.5-7.3s7.5 2.6 7.5 7.3z"/>'),
  doze: svg('<path d="M2.5 16.5v-4h3.3V7.5h6l2.2 5h3v4z"/><path d="M18.7 9.5l3.3 9h-4.2z"/><circle cx="6" cy="19" r="2.3"/><circle cx="13" cy="19" r="2.3"/>'),
  land: svg('<path d="M5 22V2.5h2.2v1.3c3.4-1.9 5.6 1.9 9.8.2v9c-4.2 1.7-6.4-2.1-9.8-.2V22z"/><path d="M10.5 17.5l10 1.2-2.2 3.3H9z" opacity=".55"/>'),
  rotl: svg(stroke('M6.3 7.3A7.5 7.5 0 1 1 4.5 12') + '<path d="M2.3 3.3l1.2 6 5.5-2.5z"/>'),
  rotr: svg('<g transform="matrix(-1 0 0 1 24 0)">' + stroke('M6.3 7.3A7.5 7.5 0 1 1 4.5 12') + '<path d="M2.3 3.3l1.2 6 5.5-2.5z"/></g>'),
  turn: svg(stroke('M6.3 7.3A7.5 7.5 0 1 1 4.5 12') + '<path d="M2.3 3.3l1.2 6 5.5-2.5z"/>'),
  walk: svg('<circle cx="13" cy="4.3" r="2.4"/><path d="M10.6 7.6l3.2.5 2.4 3.3 3 .9-.5 1.9-3.9-1-1-1.3-.8 3.6 2.6 2.7.9 5.3h-2.2l-.8-4.3-2.6-2.3-1.5 6.6H7.2l2.1-9.3.3-2.8-2 1.2-.7 2.9-2-.4.9-4z"/>'),
  chev: svg(stroke('M6 9l6 6 6-6', 2.8)),
  plus: svg(stroke('M12 5v14M5 12h14', 2.8)), minus: svg(stroke('M5 12h14', 2.8)), x: svg(stroke('M6 6l12 12M18 6L6 18', 2.8)), check: svg(stroke('M5 12.5l4.5 4.5L19 7.5', 3)),
};
document.querySelectorAll('[data-ic]').forEach((e) => { e.innerHTML = IC[e.dataset.ic]; });
const ui = { tab: null, modal: false, ask: null, lastSpeed: 1, nightIcon: false, onClose: null, mini: false, panelMin: false };
// which boxes are folded away is remembered on this device
const UI_KEY = 'rummelinsel.ui.v1';
function uiPref(k, v) {
  let o = {}; try { o = JSON.parse(localStorage.getItem(UI_KEY) || '{}') || {}; } catch (e) { o = {}; }
  if (v === undefined) return o[k];
  o[k] = v; try { localStorage.setItem(UI_KEY, JSON.stringify(o)); } catch (e) { /* storage is optional */ }
}
let sel = null, tool = null, pending = null, ghost = null, ghostTile = null;

const toastQ = [];
function toast(text, kind, focus) {
  const box = $('#toasts');
  if (toastQ.some((t) => t.text === text) || Array.from(box.children).some((c) => c.dataset.t === text)) return;
  if (toastQ.length >= 6) toastQ.shift();
  toastQ.push({ text, kind, focus }); pumpToasts();
}
function pumpToasts() {
  const box = $('#toasts'), max = window.innerWidth < 760 ? 1 : 2;
  while (toastQ.length && box.children.length < max) showToast(toastQ.shift());
  const more = box.querySelectorAll('.more');
  more.forEach((m, i) => { m.textContent = toastQ.length && i === more.length - 1 ? '+' + toastQ.length : ''; });
}
function showToast(t) {
  const box = $('#toasts'), b = document.createElement('button'); let dead = false;
  b.className = 'toast ' + (t.kind || ''); b.dataset.t = t.text; b.innerHTML = '<i></i><span class="tx"></span><span class="more"></span>'; b.children[1].textContent = t.text;
  const kill = () => { if (dead) return; dead = true; b.classList.add('out'); setTimeout(() => { b.remove(); pumpToasts(); }, 220); };
  b.onclick = () => { const o = t.focus; if (o && !o.removed) { cam.tx = o.group.position.x; cam.tz = o.group.position.z; if (!tool) select({ obj: o }); } kill(); };
  box.appendChild(b);
  setTimeout(kill, (2400 + t.text.length * 45) * (toastQ.length > 1 ? 0.6 : 1));
}
function modal(html) {
  const m = $('#modal');
  m.innerHTML = '<div class="box" role="dialog" aria-modal="true"><button class="ibtn x" data-act="closeModal" aria-label="Zuklappen">' + IC.x + '</button>' + html + '</div>';
  m.hidden = false; ui.modal = true;
}
function closeModal() { const f = ui.onClose; ui.onClose = null; if (f) f(); const m = $('#modal'); m.hidden = true; m.innerHTML = ''; ui.modal = false; ui.ask = null; }
$('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });

const SHY = { Schiffschaukel: 'Schiff\u00ADschaukel', Wildwasserbahn: 'Wild\u00ADwasser\u00ADbahn', Kettenflieger: 'Ketten\u00ADflieger', Wirbeltassen: 'Wirbel\u00ADtassen', Freifallturm: 'Freifall\u00ADturm', Autoscooter: 'Auto\u00ADscooter', Reinigungskraft: 'Reinigungs\u00ADkraft', Springbrunnen: 'Spring\u00ADbrunnen', Abfalleimer: 'Abfall\u00ADeimer', Pommesbude: 'Pommes\u00ADbude', Ballonstand: 'Ballon\u00ADstand', Burgerbude: 'Burger\u00ADbude', Maskottchen: 'Maskott\u00ADchen', Blumenbeet: 'Blumen\u00ADbeet', Geisterhaus: 'Geister\u00ADhaus', Personalhaus: 'Personal\u00ADhaus', Pausenraum: 'Pausen\u00ADraum', Sicherheit: 'Sicher\u00ADheit', Wachposten: 'Wach\u00ADposten', Tauchbecken: 'Tauch\u00ADbecken', Himmelsturm: 'Himmels\u00ADturm' };
const nm = (n) => SHY[n] || n;
const TABS = [['path', 'Wege', 'Wege'], ['ride', 'Attraktionen', 'Fahrten'], ['shop', 'Buden', 'Buden'], ['deco', 'Deko', 'Deko'], ['staff', 'Personal', 'Team'], ['land', 'Land', 'Land'], ['doze', 'Abriss', 'Abriss']];
function buildTabs() {
  $('#tabs').innerHTML = TABS.map((t) => '<button data-act="tab" data-k="' + t[0] + '" aria-pressed="false">' + IC[t[0]] + '<span class="l">' + t[1] + '</span><span class="s">' + t[2] + '</span></button>').join('');
}
function openTab(k) {
  sfx('click');
  if (ui.tab === k) { ui.tab = null; setTool(null); renderTray(); return; }
  ui.tab = k;
  setTool(k === 'path' ? { type: 'path' } : k === 'doze' ? { type: 'doze' } : k === 'land' ? { type: 'land', plot: -1 } : null);
  if (k === 'land' && cam.dist < 46) cam.dist = 46;
  renderTray();
}
function renderTray() {
  const tray = $('#tray');
  document.querySelectorAll('#tabs button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.k === ui.tab));
  if (!ui.tab || ui.tab === 'doze' || ui.tab === 'land') { tray.hidden = true; tray.innerHTML = ''; return; }
  let h = '';
  const card = (k) => { const d = DEFS[k], ok = unlocked(d);
    return '<button class="card' + (ok ? '' : ' locked') + '" data-act="card" data-k="' + k + '" aria-pressed="false" title="' + (d.info || d.name) + '"><img src="' + d.thumb + '" alt=""><span class="nm">' + nm(d.name) + '</span><span class="pr">' + (ok ? (d.from ? 'ab ' : '') + eur(d.cost) : 'nach Ziel ' + d.need) + '</span></button>'; };
  if (ui.tab === 'staff') {
    h += '<button class="card team" data-act="team" title="Stimmung, Pausen und Löhne"><span class="big" id="team-mood"></span><span class="nm">Team-Übersicht</span><span class="pr">Stimmung</span></button>';
    for (const k of ORDER.fac) h += card(k);
    for (const k in STAFF) { const d = STAFF[k], ok = S.goal >= (d.need || 0);
      h += '<div class="card staff' + (ok ? '' : ' locked') + '" title="' + d.info + '"><span class="cnt" data-cnt="' + k + '">0</span><img src="' + d.thumb + '" alt=""><span class="nm">' + nm(d.name) + '</span>' +
        (ok ? '<span class="pr" data-hire="' + k + '"></span><span class="pm"><button data-act="fire" data-k="' + k + '" aria-label="' + d.name + ' entlassen">' + IC.minus + '</button><button data-act="hire" data-k="' + k + '" aria-label="' + d.name + ' einstellen">' + IC.plus + '</button></span>' : '<span class="pr">nach Ziel ' + d.need + '</span>') + '</div>'; }
  } else for (const k of ORDER[ui.tab]) h += card(k);
  tray.innerHTML = h; tray.hidden = false; refreshTray();
}
function refreshTray() {
  document.querySelectorAll('#tray .card[data-k]').forEach((c) => {
    const d = DEFS[c.dataset.k];
    c.classList.toggle('poor', unlocked(d) && S.money < d.cost);
    c.setAttribute('aria-pressed', !!tool && ((tool.type === 'build' && tool.k === d.k) || (tool.type === 'path' && d.k === 'path') || (tool.type === 'track' && d.k === 'custom')));
  });
  document.querySelectorAll('#tray [data-cnt]').forEach((c) => { c.textContent = staffN(c.dataset.cnt); });
  document.querySelectorAll('#tray [data-hire]').forEach((c) => { const v = eur(hireCost(c.dataset.hire)); if (c.textContent !== v) c.textContent = v; });
  if (document.getElementById('team-mood')) { let m = 0, n = 0; for (const s of staff) if (s.state !== 'quit') { m += s.mood; n++; } setTxt('team-mood', n ? Math.round(m / n) + ' %' : '–'); }
}

/* ----- tools ----- */
function clearGhost() {
  if (ghost) { scene.remove(ghost); ghost.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); ghost = null; }
  hl.visible = false; ghostTile = null;
}
function setTool(t) {
  tool = t; pending = null; clearGhost(); clearTrackPrev(); trackHover = null;
  if (t) {
    select(null);
    if (t.type === 'build') {
      const m = DEFS[t.k].model();
      m.group.traverse((o) => { if (o.isMesh) { if (o.material === MAT_LAMP) o.visible = false; else if (o.material !== MAT_GLOW) o.material = MAT_GHOST; o.castShadow = false; } });
      ghost = m.group; ghost.visible = false; scene.add(ghost);
    }
  }
  canvas.classList.toggle('build', !!t); gridLines.visible = !!t; $('#hud').classList.toggle('tool', !!t);
  renderToolbar(); refreshTray();
}
function renderToolbar() {
  const tb = $('#toolbar');
  if (!tool) { tb.hidden = true; return; }
  let h;
  if (tool.type === 'path') h = '<div class="t"><b>Weg</b><span>' + eur(5) + ' pro Feld · ziehen zum Verlegen</span></div>';
  else if (tool.type === 'track') h = trackToolbar();
  else if (tool.type === 'doze') h = '<div class="t"><b>Abriss und Roden</b><span>Objekt antippen · über Wege wischen · Pflanzen werden für den Gärtner markiert' + (cuts.length ? ' (' + cuts.length + ' offen)' : '') + '</span></div>';
  else if (tool.type === 'land') {
    const p = tool.plot, c = landPrice(), left = PN * PN - plotsOwned();
    h = '<div class="t"><b>Land kaufen</b><span>' + (!left ? 'Die ganze Insel gehört dir.' : p >= 0 ? '10 × 10 Felder · ' + eur(c) : 'Tippe ein leuchtendes Stück an · das nächste kostet ' + eur(c)) + '</span></div>' +
      (p >= 0 ? '<button class="btn mint" data-act="buyLand"' + (S.money < c ? ' disabled' : '') + '>' + IC.check + 'Kaufen</button>' : '');
  }
  else {
    const d = DEFS[tool.k];
    h = '<div class="t"><b>' + d.name + '</b><span>' + eur(d.cost) + ' · ' + d.w + '×' + d.h + ' Felder' + (d.cat === 'ride' ? ' · ' + d.cap + ' Plätze' : '') + '</span></div>';
    if (d.cat !== 'deco' || d.k === 'bench') h += '<button class="btn line" data-act="rot" aria-label="Drehen" title="Drehen (R)">' + IC.turn + '</button>';
    if (pending) h += '<button class="btn mint" data-act="place">' + IC.check + 'Bauen</button>';
  }
  tb.innerHTML = h + '<button class="btn red" data-act="cancel" aria-label="Werkzeug weglegen" title="Abbrechen (Esc)">' + IC.x + '</button>';
  tb.hidden = false;
}
const anchor = (d, rot, x, y) => { const [w, h] = dims(d, rot); return [x - ((w - 1) >> 1), y - ((h - 1) >> 1), w, h]; };
function setHl(x, y, w, h, ok, warn) { hl.visible = true; hl.position.set(x + w / 2 - HALF, 0.05, y + h / 2 - HALF); hl.scale.set(w, 1, h); hl.material.color.setHex(ok ? 0x3ddbb4 : warn ? 0xffa23f : 0xff4f64); }
function showGhost(gx, gy) {
  if (!tool || tool.type !== 'build' || !ghost) return;
  const d = DEFS[tool.k]; ghostTile = [gx, gy];
  if ((d.cat === 'shop' || d.rest) && !tool.userRot) for (let k = 0; k < 4; k++) { const nx = gx + DIRS[k][0], ny = gy + DIRS[k][1]; if (inB(nx, ny) && tType[idx(nx, ny)] === 1) { tool.rot = k; break; } }
  const [x, y, w, h] = anchor(d, tool.rot, gx, gy);
  ghost.visible = true; ghost.position.set(x + w / 2 - HALF, 0.02, y + h / 2 - HALF); ghost.rotation.y = -tool.rot * Math.PI / 2;
  const nat = natIn(d, x, y, tool.rot), plants = !!nat && nat.length > 0, ok = !!nat && !plants && S.money >= d.cost;   // orange: only plants are in the way
  setHl(x, y, w, h, ok, plants); MAT_GHOST.color.setHex(ok ? 0xffffff : plants ? 0xffc35a : 0xff5a6c);
}
function rotateTool() {
  if (tool && tool.type === 'track') { if (!tool.station) { tool.rot = (tool.rot + 1) % 4; sfx('click'); drawTrackPrev(); } return; }
  if (!tool || tool.type !== 'build') return;
  tool.rot = (tool.rot + 1) % 4; tool.userRot = true; sfx('click');
  if (ghostTile) showGhost(ghostTile[0], ghostTile[1]);
}
function tryBuild() {
  if (!tool || tool.type !== 'build' || !ghostTile) return;
  const d = DEFS[tool.k], gt = ghostTile, [x, y] = anchor(d, tool.rot, gt[0], gt[1]);
  const nat = natIn(d, x, y, tool.rot);
  if (!nat) { if (!ownedFoot(d, x, y, tool.rot)) landHint(); else { sfx('error'); toast('Hier ist kein Platz frei.', 'bad'); } return; }
  if (nat.length) { plantsInWay(nat); pending = null; renderToolbar(); return; }
  if (S.money < d.cost) { sfx('error'); toast('Dafür reicht das Geld nicht.', 'bad'); return; }
  spend(d.cost, 'build'); const ob = placeObj(d.k, x, y, tool.rot); sfx('build'); pending = null; uiDirty = true;
  if (d.cat !== 'deco' && !d.noPath && !accessOf(ob).length) toast(d.name + ' braucht noch einen Weg direkt daneben.', '', ob);
  if (d.cat === 'ride') setTool(null); else { showGhost(gt[0], gt[1]); renderToolbar(); }
}
// Building on a spot where plants still stand marks them for the gardener instead.
function plantsInWay(list) {
  const [n, fee] = markAll(list);
  if (!n) return;
  sfx(fee ? 'mark' : 'error');
  toast(fee ? (n === 1 ? 'Hier steht noch eine Pflanze. Sie ist jetzt zum Roden markiert (' : 'Hier stehen noch ' + n + ' Pflanzen. Sie sind jetzt zum Roden markiert (') + eur(fee) + '). Baue, sobald der Gärtner fertig ist.' : 'Der Gärtner ist hier noch nicht fertig. Baue, sobald die Pflanzen weg sind.', fee ? '' : 'bad');
}
function buildPath(x, y) {
  const i = idx(x, y), ob = tObj[i];
  if (!owned[i]) { landHint(); return; }
  if (tType[i] === 3 && ob && ob.def.plant) { if (ob.cut) ob.then = 'path'; else if (markCut(ob, 'path')) { sfx('mark'); if (S.time - (buildPath.told || -99) > 30) { buildPath.told = S.time; toast('Pflanzen auf dem Weg sind zum Roden markiert. Der Weg wird dort gelegt, sobald der Gärtner fertig ist.'); } } return; }
  if (tType[i] !== 0) return;
  if (S.money < 5) { if (!buildPath.warned) { buildPath.warned = true; sfx('error'); toast('Dafür reicht das Geld nicht.', 'bad'); setTimeout(() => { buildPath.warned = false; }, 3000); } return; }
  if (setPath(i, true)) { spend(5, 'build'); sfx('path'); uiDirty = true; }
}
const refundOf = (ob) => Math.round(ob.def.cost * (ob.def.cat === 'deco' ? 0.3 : 0.4));
function demolish(ob) {
  const r = refundOf(ob);
  if (r < 0 && S.money < -r) { sfx('error'); toast('Dafür reicht das Geld nicht.', 'bad'); return; }
  if (r >= 0) earn(r, 'bonus'); else spend(-r, 'build');
  if (sel && sel.obj === ob) select(null);
  removeObj(ob); sfx('doze'); uiDirty = true; hl.visible = false;
}
function askDemolish(ob) {
  ui.ask = ob;
  modal('<h2>' + ob.def.name + ' abbauen?</h2><p>Du bekommst ' + eur(refundOf(ob)) + ' zurück. Wartende Gäste gehen weiter.</p><div class="row"><button class="btn red" data-act="yesDemolish">Abbauen</button><button class="btn line" data-act="closeModal">Behalten</button></div>');
}
function dozeTile(x, y, drag) {
  const i = idx(x, y);
  if (!owned[i]) { if (!drag) landHint(); return; }
  if (tType[i] === 1) { if (setPath(i, false)) { sfx('doze'); uiDirty = true; } return; }
  const ob = tObj[i]; if (!ob) return;
  if (ob.def.plant) { if (!ob.cut) { if (markCut(ob)) { sfx('mark'); renderToolbar(); } } else if (!drag) { unmarkCut(ob); sfx('click'); renderToolbar(); } return; }   // a second tap takes the mark back
  if (ob.def.cat === 'deco') demolish(ob);
  else if (!drag) { if (ob.def.cost >= 300) askDemolish(ob); else demolish(ob); }
}

/* ----- laying a coaster ----- */
let trackPrev = null, trackHover = null;
const MAT_TP_OK = new T.MeshBasicMaterial({ color: 0xffd447 }), MAT_TP_BAD = new T.MeshBasicMaterial({ color: 0xff4f64 }), MAT_TP_ST = new T.MeshBasicMaterial({ color: 0x3ddbb4, transparent: true, opacity: 0.65 });
function clearTrackPrev() { if (trackPrev) { scene.remove(trackPrev); trackPrev.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); trackPrev = null; } }
function drawTrackPrev() {
  clearTrackPrev(); const t = tool; if (!t || t.type !== 'track') return;
  let stn = t.station;
  if (!stn) { if (!trackHover) return; const an = anchor(DEFS.custom, t.rot, trackHover[0], trackHover[1]); stn = { x: an[0], y: an[1] }; }
  const g = new T.Group(); trackPrev = g; scene.add(g);
  const nodes = t.nodes.slice(); if (t.station && trackHover && t.mouse) nodes.push([trackHover[0], trackHover[1], t.h]);
  const { pts, cx, cz, d, w, h } = coasterPoints(stn.x, stn.y, t.rot, nodes);
  const sb = new T.Mesh(new T.BoxGeometry(w - 0.06, 0.5, h - 0.06), t.station || natIn(DEFS.custom, stn.x, stn.y, t.rot) ? MAT_TP_ST : MAT_TP_BAD); sb.position.set(cx, 0.3, cz); g.add(sb);
  const ar = new T.Mesh(new T.ConeGeometry(0.24, 0.55, 4), MAT_TP_OK); ar.position.set(cx + d[0] * 1.05, 0.95, cz + d[1] * 1.05); ar.quaternion.setFromUnitVectors(UP, _v.set(d[0], 0, d[1])); g.add(ar);
  if (!nodes.length) return;
  const bad = !!analyseTrack(stn.x, stn.y, t.rot, nodes).err, mat = bad ? MAT_TP_BAD : MAT_TP_OK;
  const curve = new T.CatmullRomCurve3(pts.map((p) => new T.Vector3(p[0], p[1], p[2])), true, 'centripetal');
  g.add(new T.Mesh(new T.TubeGeometry(curve, Math.min(420, pts.length * 14), 0.055, 5, true), mat));
  nodes.forEach((n, ni) => {
    const on = ni === t.sel, nm_ = on ? MAT_TP_ST : mat;
    const m = new T.Mesh(new T.SphereGeometry(on ? 0.26 : 0.15, 8, 6), nm_); m.position.set(wX(n[0]), n[2], wZ(n[1])); g.add(m);
    const stem = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, n[2], 5), nm_); stem.position.set(wX(n[0]), n[2] / 2, wZ(n[1])); g.add(stem);
  });
}
function trackChanged() {
  const t = tool; t.info = t.station && t.nodes.length ? analyseTrack(t.station.x, t.station.y, t.rot, t.nodes) : null;
  drawTrackPrev(); renderToolbar();
}
function trackAdd(fx, fy) {
  const t = tool, [w, h] = dims(DEFS.custom, t.rot), st = t.station, gx = Math.floor(fx + 0.5), gy = Math.floor(fy + 0.5);
  if (!inB(gx, gy)) return false;
  if (gx >= st.x && gx < st.x + w && gy >= st.y && gy < st.y + h) return false;
  if (tType[idx(gx, gy)] === 2) return false;
  if (t.nodes.length >= 60) { toast('Mehr als 60 Punkte sind nicht möglich.', 'bad'); return false; }
  t.nodes.push([Math.round(fx * 4) / 4, Math.round(fy * 4) / 4, t.h]); t.sel = null; trackChanged(); return true;
}
// A tap places the station, selects an existing point or adds a new one. pt is the tapped spot on the ground.
function trackClick(tile, ptype, pt) {
  const t = tool; t.mouse = ptype === 'mouse';
  if (!tile || !pt) return;
  if (!t.station) {
    const an = anchor(DEFS.custom, t.rot, tile[0], tile[1]);
    const nat = natIn(DEFS.custom, an[0], an[1], t.rot);
    if (!nat) { if (!ownedFoot(DEFS.custom, an[0], an[1], t.rot)) landHint(); else { sfx('error'); toast('Hier ist kein Platz für die Station.', 'bad'); } return; }
    if (nat.length) { plantsInWay(nat); return; }
    t.station = { x: an[0], y: an[1] }; sfx('path'); trackChanged(); return;
  }
  const fx = pt[0] + HALF - 0.5, fy = pt[1] + HALF - 0.5;
  for (let i = 0; i < t.nodes.length; i++) if (Math.hypot(t.nodes[i][0] - fx, t.nodes[i][1] - fy) < 0.7) { t.sel = t.sel === i ? null : i; sfx('click'); drawTrackPrev(); renderToolbar(); return; }
  if (trackAdd(fx, fy)) sfx('path'); else { sfx('error'); toast('Hier kann kein Streckenpunkt hin.', 'bad'); }
}
// Dragging draws: a new point is dropped whenever the finger has moved far enough from the last one.
function trackDraw(pt) {
  const t = tool, fx = pt[0] + HALF - 0.5, fy = pt[1] + HALF - 0.5, last = t.nodes[t.nodes.length - 1];
  const [w, h] = dims(DEFS.custom, t.rot), lx = last ? last[0] : t.station.x + (w - 1) / 2, ly = last ? last[1] : t.station.y + (h - 1) / 2;
  if (Math.hypot(fx - lx, fy - ly) < (last ? 1.7 : 2.4)) return;
  if (trackAdd(fx, fy)) sfx('path');
}
function finishTrack() {
  const t = tool; if (!t || t.type !== 'track' || !t.station) return;
  if (t.nodes.length < 3) { toast('Setze mindestens 3 Punkte.', 'bad'); return; }
  const a = analyseTrack(t.station.x, t.station.y, t.rot, t.nodes), nat = natIn(DEFS.custom, t.station.x, t.station.y, t.rot);
  if (a.err || !nat || nat.length) { sfx('error'); toast(a.err || 'Die Station ist blockiert.', 'bad'); return; }
  const cost = a.cost;
  if (S.money < cost) { sfx('error'); toast('Dafür reicht das Geld nicht. Die Strecke kostet ' + eur(cost) + '.', 'bad'); return; }
  spend(cost, 'build');
  const ob = placeObj('custom', t.station.x, t.station.y, t.rot, { nodes: t.nodes.map((n) => n.slice()) });
  sfx('goal'); toast('Achterbahn eröffnet · Nervenkitzel ' + a.exc, 'gold', ob);
  if (!accessOf(ob).length) toast('Die Station braucht noch einen Weg direkt daneben.', '', ob);
  setTool(null); uiDirty = true;
}
function trackToolbar() {
  const t = tool, a = t.info, sn = t.sel != null ? t.nodes[t.sel] : null;
  if (!t.station) return '<div class="t"><b>Eigene Achterbahn</b><span>Station setzen: freies Feld antippen. Der Pfeil zeigt die Fahrtrichtung.</span></div><button class="btn line" data-act="rot" aria-label="Station drehen" title="Drehen (R)">' + IC.turn + '</button>';
  const txt = a ? (a.err || Math.round(a.len * 5) + ' m · Nervenkitzel ' + a.exc + ' · ' + eur(a.cost)) : 'Mit dem Finger zeichnen oder Punkte antippen. Zwei Finger bewegen die Karte.';
  return '<div class="t"><b>' + (sn ? 'Punkt ' + (t.sel + 1) + ' gewählt' : 'Strecke zeichnen') + '</b><span' + (a && a.err ? ' class="err"' : '') + '>' + txt + '</span></div>' +
    '<div class="hstep"><button class="sq" data-act="th" data-d="-1" aria-label="Tiefer">' + IC.minus + '</button><output title="' + (sn ? 'Höhe dieses Punkts' : 'Höhe der nächsten Punkte') + '">' + ((sn ? sn[2] : t.h) * 5).toLocaleString('de-DE') + ' m</output><button class="sq" data-act="th" data-d="1" aria-label="Höher">' + IC.plus + '</button></div>' +
    '<button class="btn line" data-act="tundo" aria-label="' + (sn ? 'Gewählten Punkt löschen' : 'Letzten Punkt entfernen') + '" title="' + (sn ? 'Gewählten Punkt löschen' : 'Letzten Punkt entfernen') + '">' + IC.rotl + '</button>' +
    '<button class="btn mint" data-act="tdone"' + (t.nodes.length < 3 ? ' disabled' : '') + '>' + IC.check + 'Fertig</button>';
}

/* ----- selection panel ----- */
const opinion = (r) => (r < 0.5 ? 'geschenkt' : r < 0.85 ? 'günstig' : r <= 1.0 ? 'fair' : r <= 1.35 ? 'teuer' : 'viel zu teuer');
function select(s) { sel = s; ui.panelMin = false; renderPanel(); }
function renderPanel() {
  const p = $('#panel'), mid = $('#mid');
  $('#hud').classList.toggle('sheet', !!sel);
  selHl.visible = false;
  if (!sel) { p.hidden = true; mid.classList.remove('sheet'); return; }
  let h = '<button class="ibtn x" data-act="unselect" aria-label="Schliessen" title="Schliessen">' + IC.x + '</button><button class="ibtn x fx" data-act="panelFold" aria-label="Ein- oder ausklappen" title="Ein- oder ausklappen">' + IC.chev + '</button>';
  p.classList.toggle('min', ui.panelMin);
  if (sel.obj) {
    const b = sel.obj, d = b.def;
    selHl.visible = true; selHl.position.set(b.x + b.w / 2 - HALF, 0.045, b.y + b.h / 2 - HALF); selHl.scale.set(b.w + 0.3, 1, b.h + 0.3);
    h += '<h2>' + d.name + '</h2>';
    if (d.plant) h += '<p class="note">' + (b.cut ? 'Zum Roden markiert. Ein Gärtner entfernt die Pflanze, sobald er Zeit hat.' : 'Verschönert die Umgebung. Wer hier bauen will, lässt die Pflanze vom Gärtner roden.') + '</p><div class="row"><button class="btn red" data-act="demolish">' + (b.cut ? 'Markierung aufheben · +' + eur(b.fee) : 'Roden lassen · ' + eur(d.cut)) + '</button></div>';
    else if (d.cat === 'deco') h += '<p class="note">' + (d.info || 'Verschönert die Umgebung. Gäste, die vorbeigehen, bekommen bessere Laune.') + '</p><div class="row"><button class="btn red" data-act="demolish">Abriss · +' + eur(refundOf(b)) + '</button></div>';
    else if (d.cat === 'fac') h += '<p class="note">' + d.info + '</p><div class="kv">' + (d.rest ? '<span>Gerade in der Pause</span><b id="f-rest"></b>' : '<span>Belegte Wohnplätze im Park</span><b id="f-house"></b>') + '<span>Unterhalt pro Tag</span><b>' + eur(d.upkeep) + '</b></div>' +
      '<div class="row"><button class="btn line" data-act="team">Team-Übersicht</button><button class="btn red" data-act="demolish">Abriss · +' + eur(refundOf(b)) + '</button></div>';
    else {
      const ride = d.cat === 'ride', lv = ride ? lvlOf(b) : 0; let extra = '';
      if (b.k === 'throw') extra = '<button class="btn" data-act="mini" data-k="cans">Dosenwerfen spielen</button>';
      else if (ride && (lv >= 2 || DEV)) extra = (b.k === 'ghost' ? '<button class="btn" data-act="mini" data-k="ghosts">Hineingehen: Geisterjagd</button>' : '') + (b.k === 'kart' ? '<button class="btn" data-act="mini" data-k="kart">Selbst ans Steuer</button>' : '') + (b.k === 'dunk' ? '<button class="btn" data-act="mini" data-k="dunk">Selbst werfen</button>' : '') + (b.model.povSeat || b.model.seats.length ? '<button class="btn" data-act="ridePov">' + (b.k === 'ghost' ? 'Mit dem Gespenst fliegen' : 'Mitfahren') + '</button>' : '');
      h += '<span class="pill" id="p-status"></span>' + (ride ? ' <span class="pill warn" id="p-lvl"></span>' : '') + '<p class="note">' + d.info + '</p>' +
        '<div class="stepper"><span class="lbl">' + (ride ? 'Preis pro Fahrt' : 'Preis') + '</span><button class="sq" data-act="price" data-d="-1" aria-label="Preis senken">' + IC.minus + '</button><output id="p-price"></output><button class="sq" data-act="price" data-d="1" aria-label="Preis erhöhen">' + IC.plus + '</button></div>' +
        '<p class="note">Gäste finden das <b id="p-op"></b>.</p>' +
        '<div class="kv"><span>In der Schlange</span><b id="p-q"></b><span>' + (ride ? 'Fahrgäste bisher' : 'Kunden bisher') + '</span><b id="p-n"></b><span>' + (ride ? 'Einnahmen' : 'Gewinn') + '</span><b id="p-inc"></b><span>Unterhalt pro Tag</span><b>' + eur(d.upkeep) + '</b>' +
        (ride ? '<span>Plätze · Nervenkitzel</span><b id="p-exc"></b><span>Nächste Stufe</span><b id="p-next"></b>' : '') + '</div>' +
        (extra ? '<div class="row">' + extra + '</div>' : ride ? '<p class="note">Ab Stufe 2 kannst du selbst hinein.</p>' : '') +
        '<div class="row"><button class="btn line" data-act="toggle" id="p-toggle"></button><button class="btn mint" data-act="repair" id="p-repair" hidden>Reparieren · ' + eur(Math.round(d.cost * 0.06)) + '</button><button class="btn red" data-act="demolish">Abriss · +' + eur(refundOf(b)) + '</button></div>';
    }
  } else if (sel.staff) {
    const s = sel.staff, d = STAFF[s.type];
    h += '<h2>' + s.name + '</h2><span class="pill">' + d.name + '</span> <span class="pill" id="s-state"></span><p class="note" id="s-note"></p>' +
      '<div class="meters"><span>Stimmung</span><div class="meter"><i id="s-mood"></i></div><span>Energie</span><div class="meter need"><i id="s-energy"></i></div></div>' +
      '<div class="kv"><span>Lohn pro Tag</span><b>' + eur(d.wage * WAGE[S.wage]) + '</b><span>Wohnplatz</span><b id="s-house"></b></div>' +
      '<div class="row"><button class="btn line" data-act="team">Team-Übersicht</button><button class="btn red" data-act="fireOne">Entlassen</button></div>';
  } else {
    h += '<h2>' + sel.guest.name + '</h2><p class="note" id="g-th"></p>' +
      '<div class="meters"><span>Laune</span><div class="meter"><i id="g-happy"></i></div><span>Hunger</span><div class="meter need"><i id="g-hunger"></i></div><span>Durst</span><div class="meter need"><i id="g-thirst"></i></div><span>WC</span><div class="meter need"><i id="g-wc"></i></div></div>' +
      '<div class="kv"><span>Geld dabei</span><b id="g-cash"></b><span>Fahrten</span><b id="g-rides"></b><span>Macht gerade</span><b id="g-state"></b></div>' +
      '<div class="row"><button class="btn" data-act="hello">Hallo sagen</button><button class="btn line" data-act="gift">Gutschein schenken · ' + eur(5) + '</button></div>';
  }
  p.innerHTML = h; p.hidden = false; mid.classList.add('sheet'); refreshPanel();
}
const setTxt = (id, v) => { const e = document.getElementById(id); if (e && e.textContent !== String(v)) e.textContent = v; };
const setW = (id, v) => { const e = document.getElementById(id); if (e) e.style.width = clamp(v, 0, 100) + '%'; };
function refreshPanel() {
  if (!sel) return;
  if (sel.obj) {
    const b = sel.obj, d = b.def; if (d.cat === 'deco') return;
    if (d.cat === 'fac') { setTxt('f-rest', b.resting.length + ' von ' + (d.rest || 0)); setTxt('f-house', Math.min(staffAll(), housing()) + ' von ' + housing()); return; }
    const st = $('#p-status'); if (!st) return;
    let txt, cls = 'ok';
    if (b.broken) { txt = 'Defekt'; cls = 'bad'; } else if (!connected(b)) { txt = 'Kein Weg zum Eingang'; cls = 'warn'; } else if (!b.open) { txt = d.cat === 'ride' ? 'Angehalten' : 'Geschlossen'; cls = 'warn'; }
    else if (d.cat !== 'ride') txt = 'Geöffnet'; else if (b.state === 'run') txt = 'Fährt'; else if (b.queue.length) txt = 'Einstieg'; else { txt = 'Wartet auf Gäste'; cls = ''; }
    st.textContent = txt; st.className = 'pill ' + cls;
    setTxt('p-price', eur2(b.price)); setTxt('p-op', opinion(b.price / fairB(b))); setTxt('p-q', b.queue.length); setTxt('p-n', b.count); setTxt('p-inc', eur(b.income));
    if (d.cat === 'ride') { const lv = lvlOf(b); setTxt('p-lvl', 'Stufe ' + lv); setTxt('p-exc', d.cap + ' · ' + Math.round(excOf(b))); setTxt('p-next', lv > LVL.length ? 'höchste Stufe' : 'noch ' + (LVL[lv - 1] - b.count) + ' Fahrgäste'); }
    setTxt('p-toggle', b.open ? (d.cat === 'ride' ? 'Anhalten' : 'Zumachen') : 'Wieder öffnen');
    const rp = $('#p-repair'); if (rp) rp.hidden = !b.broken;
  } else if (sel.staff) {
    const s = sel.staff;
    setW('s-mood', s.mood); setW('s-energy', s.energy);
    setTxt('s-state', s.asleep ? 'Schläft am Posten' : s.hold ? 'Hält einen Dieb fest' : s.state === 'rest' ? 'In der Pause' : s.state === 'toBreak' ? 'Geht in die Pause' : s.state === 'quit' ? 'Hat gekündigt' : 'Arbeitet');
    setTxt('s-house', s.housed ? 'ja' : 'fehlt');
    const why = []; if (!s.housed) why.push('hat kein Zuhause'); if (s.energy < 8) why.push('ist völlig erschöpft'); else if (S.time - s.lastBreak >= 320) why.push('hatte lange keine Pause'); if (S.wage === 0) why.push('findet den Lohn knapp');
    setTxt('s-note', (why.length ? s.name + ' ' + why.join(', ') + '.' : s.name + ' fühlt sich wohl im Team.') + (s.type === 'sec' ? ' Wachleute Stufe ' + S.secLvl + ': ' + SEC_INFO[S.secLvl - 1] : ''));
  } else {
    const g = sel.guest;
    setTxt('g-th', g.tk && THOUGHT[g.tk] ? '„' + THOUGHT[g.tk] + '“' : 'Schaut sich um.');
    setW('g-happy', g.happy); setW('g-hunger', g.hunger); setW('g-thirst', g.thirst); setW('g-wc', g.wc);
    setTxt('g-cash', eur(g.cash)); setTxt('g-rides', g.nRides);
    setTxt('g-state', { arrive: 'Kommt an', decide: 'Überlegt', walk: g.target ? 'Geht zu: ' + g.target.def.name : 'Unterwegs', wander: 'Bummelt', queue: 'Steht an', buy: 'Kauft ein', ride: 'Fährt', leave: 'Geht heim', exit: 'Geht heim' }[g.state]);
  }
}
function showTeam() {
  const list = staff.filter((s) => s.state !== 'quit');
  const rows = list.map((s) => '<tr><td>' + s.name + '<small> · ' + STAFF[s.type].name + '</small></td><td><div class="meter"><i style="width:' + Math.round(s.mood) + '%"></i></div></td><td><div class="meter need"><i style="width:' + Math.round(s.energy) + '%"></i></div></td><td>' + (s.state === 'rest' ? 'Pause' : s.housed ? '' : 'ohne Bett') + '</td></tr>').join('');
  modal('<h2>Dein Team</h2><p class="note">Zufriedenes Personal bleibt und arbeitet schneller. Es braucht einen Wohnplatz, regelmässige Pausen und fairen Lohn. Wer unzufrieden kündigt, schadet deinem Ruf, und neue Leute werden teurer.</p>' +
    '<div class="kv"><span>Ruf als Arbeitgeber</span><b id="t-rep"></b><span>Wohnplätze (2 im Torhaus)</span><b>' + Math.min(list.length, housing()) + ' von ' + housing() + '</b><span>Plätze in Pausenräumen</span><b>' + builds.reduce((n, b) => n + (b.def.rest || 0), 0) + '</b><span>Löhne pro Tag</span><b id="t-sum"></b><span>Wachleute</span><b id="t-sec"></b></div><p class="note" id="t-secinfo"></p>' +
    '<h3>Lohnniveau</h3><div class="stepper"><span class="lbl">Alle Löhne</span><button class="sq" data-act="wage" data-d="-1" aria-label="Löhne senken">' + IC.minus + '</button><output id="t-wage"></output><button class="sq" data-act="wage" data-d="1" aria-label="Löhne erhöhen">' + IC.plus + '</button></div>' +
    (rows ? '<h3>Mitarbeitende</h3><table class="fin team"><thead><tr><th>Name</th><th>Stimmung</th><th>Energie</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' : '<p class="note">Noch niemand eingestellt.</p>'));
  fillTeam();
}
function fillTeam() {
  setTxt('t-sec', 'Stufe ' + S.secLvl + ' · ' + SEC_NAME[S.secLvl - 1] + (S.secLvl < 5 ? ' · noch ' + Math.max(0, SEC_XP[S.secLvl] - S.secXp) + ' Punkte' : ''));
  setTxt('t-secinfo', 'Wachleute: ' + SEC_INFO[S.secLvl - 1] + ' Fangchance pro Versuch: ' + Math.round(catchChance() * 100) + ' %. Jeder weitere Wachmann erhöht sie. Wachposten: ' + staffN('sec') + ' von ' + postPlaces() + ' Plätzen besetzt.');
  setTxt('t-rep', repWord() + ' (' + Math.round(S.rep) + ' von 100)'); setTxt('t-wage', WAGE_NAME[S.wage]);
  setTxt('t-sum', eur(staff.reduce((n, s) => n + (s.state === 'quit' ? 0 : STAFF[s.type].wage), 0) * WAGE[S.wage]));
}

/* ----- top bar, goal, modals ----- */
function refreshUI() {
  setTxt('v-money', eur(S.money)); $('#st-money').classList.toggle('neg', S.money < 0);
  setTxt('v-guests', guests.length); setTxt('v-rating', Math.round(S.rating));
  const d = (S.time % DAY) / DAY, hh = (6 + d * 24) % 24, hr = Math.floor(hh), mn = Math.floor((hh - hr) * 6) * 10;
  const dayTxt = 'Tag ' + (curDay + 1) + ' · ' + String(hr).padStart(2, '0') + ':' + String(mn).padStart(2, '0');
  const vd = $('#v-day'); if (vd.dataset.t !== dayTxt) { vd.dataset.t = dayTxt; vd.innerHTML = 'Tag ' + (curDay + 1) + '<span class="hm"> · ' + String(hr).padStart(2, '0') + ':' + String(mn).padStart(2, '0') + '</span>'; }
  const wi = WX.k === 'rain' || WX.k === 'storm' ? 'rain' : WX.k === 'cloud' ? 'cloud' : night > 0.5 ? 'moon' : 'sun';
  if (wi !== ui.dayIcon) { ui.dayIcon = wi; $('#ic-day').innerHTML = IC[wi]; $('#st-day').title = WX_NAME[WX.k]; }
  document.querySelectorAll('.seg button').forEach((b) => b.setAttribute('aria-pressed', +b.dataset.v === S.speed));
  const g = GOALS[S.goal];
  if (g) { setTxt('goal-tag', 'Ziel ' + (S.goal + 1) + '/' + GOALS.length); setTxt('goal-txt', g.t); setTxt('goal-rew', '+' + eur(g.r)); $('#goal-bar').style.width = clamp(g.p() * 100, 0, 100) + '%'; }
  else { setTxt('goal-tag', 'Geschafft'); setTxt('goal-txt', 'Alle Ziele erreicht. Bau einfach weiter.'); setTxt('goal-rew', ''); $('#goal-bar').style.width = '100%'; }
  refreshTray(); refreshPanel(); refreshAlert();
  if (ui.modal && document.getElementById('m-ticket')) fillMenu();
}
// the banner for a caught thief: who is held shortest decides the countdown
function refreshAlert() {
  let f = null, n = 0; for (const t of thieves) if (t.state === 'held') { n++; if (!f || t.heldT < f.heldT) f = t; }
  const el = $('#alert'); $('#mid').classList.toggle('alerting', !!f); el.hidden = !f;
  if (f) { setTxt('alert-t', n > 1 ? n + ' Diebe gefasst!' : 'Dieb gefasst!'); setTxt('alert-n', Math.max(0, Math.ceil(f.heldT)) + ' s'); }
}
const signed = (n) => (n < -0.5 ? '−' : n > 0.5 ? '+' : '') + eur(Math.abs(n));
function showFinance() {
  const net = (f) => f.tick + f.ride + f.shop + f.bonus - f.goods - f.upkeep - f.wage - f.build - f.loan;
  const row = (lbl, k, s) => '<tr><td>' + lbl + '</td><td' + (s < 0 && fin.today[k] > 0.5 ? ' class="neg"' : '') + '>' + signed(fin.today[k] * s) + '</td><td' + (s < 0 && fin.yest[k] > 0.5 ? ' class="neg"' : '') + '>' + signed(fin.yest[k] * s) + '</td></tr>';
  modal('<h2>Finanzen</h2><table class="fin"><thead><tr><th>Posten</th><th>Heute</th><th>Gestern</th></tr></thead><tbody>' +
    row('Eintritt', 'tick', 1) + row('Attraktionen', 'ride', 1) + row('Buden', 'shop', 1) + row('Prämien und Rückbau', 'bonus', 1) +
    row('Wareneinkauf', 'goods', -1) + row('Unterhalt', 'upkeep', -1) + row('Löhne', 'wage', -1) + row('Bau', 'build', -1) + row('Kreditzinsen', 'loan', -1) +
    '<tr class="sum"><td>Ergebnis</td><td>' + signed(net(fin.today)) + '</td><td>' + signed(net(fin.yest)) + '</td></tr></tbody></table>' +
    '<div class="kv"><span>Kontostand</span><b>' + eur(S.money) + '</b><span>Schulden</span><b>' + eur(S.loan) + '</b><span>Laufende Kosten pro Tag</span><b>' + eur(builds.reduce((n, b) => n + b.def.upkeep, 0) + staff.reduce((n, s) => n + STAFF[s.type].wage, 0)) + '</b></div>');
}
function showGoals() {
  modal('<h2>Ziele</h2><ol class="goals">' + GOALS.map((g, i) => '<li class="' + (i < S.goal ? 'done' : i === S.goal ? 'now' : '') + '"><span class="n">' + (i < S.goal ? '✓' : i + 1) + '</span><span>' + g.t + '</span><span class="r">+' + eur(g.r) + '</span></li>').join('') + '</ol>');
}
function showMenu() {
  modal('<h2>Parkbüro</h2><div class="kv"><span>Parkwertung</span><b id="m-rate"></b><span>Gäste im Park</span><b id="m-now"></b><span>Gäste insgesamt</span><b id="m-all"></b><span>Wetter</span><b id="m-wx"></b></div>' +
    '<h3>Eintritt</h3><div class="stepper"><span class="lbl">Ticketpreis</span><button class="sq" data-act="ticket" data-d="-1" aria-label="Eintritt senken">' + IC.minus + '</button><output id="m-ticket"></output><button class="sq" data-act="ticket" data-d="1" aria-label="Eintritt erhöhen">' + IC.plus + '</button></div><p class="note">Gäste finden den Eintritt <b id="m-op"></b>. Mehr und aufregendere Attraktionen und mehr Land erlauben höhere Preise.</p>' +
    '<h3>Kredit</h3><div class="stepper"><span class="lbl">Schulden · 1,2 % Zinsen pro Tag</span><button class="sq" data-act="loan" data-d="-1" aria-label="Kredit tilgen">' + IC.minus + '</button><output id="m-loan"></output><button class="sq" data-act="loan" data-d="1" aria-label="Kredit aufnehmen">' + IC.plus + '</button></div>' +
    '<h3>Einstellungen</h3><div class="row"><button class="btn line" data-act="mute" id="m-mute"></button><button class="btn line" data-act="music" id="m-music"></button><button class="btn line" data-act="shadows" id="m-shadow"></button><button class="btn line" data-act="outline" id="m-outline"></button><button class="btn line" data-act="currency">Währung gestalten</button><button class="btn line" data-act="help">Steuerung zeigen</button><button class="btn red" data-act="askNew">Neues Spiel</button></div>');
  fillMenu();
}
function fillMenu() {
  setTxt('m-rate', Math.round(S.rating) + ' von 100'); setTxt('m-now', guests.length); setTxt('m-all', S.visitors);
  setTxt('m-ticket', eur(S.ticket)); setTxt('m-op', opinion(S.ticket / willing() / 0.8)); setTxt('m-loan', eur(S.loan));
  setTxt('m-music', S.music ? 'Musik ausschalten' : 'Musik einschalten'); setTxt('m-wx', WX_NAME[WX.k] + (WX.bonus > 0 && WX.k !== 'rain' && WX.k !== 'storm' ? ' mit Regenbogen' : ''));
  setTxt('m-mute', S.muted ? 'Ton einschalten' : 'Ton ausschalten'); setTxt('m-shadow', S.shadows ? 'Schatten ausschalten' : 'Schatten einschalten'); setTxt('m-outline', S.outline === true ? 'Comic-Linien ausschalten' : 'Comic-Linien einschalten');
}
function renderCoach() {
  // open it is the welcome box, folded it is a small "Hilfe" tab that brings it back
  const c = $('#coach'), touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  c.classList.toggle('min', !S.coach);
  c.innerHTML = '<button class="fold-h" data-act="coachFold" aria-expanded="' + !!S.coach + '" title="' + (S.coach ? 'Einklappen' : 'Hilfe aufklappen') + '"><h1>' + (S.coach ? 'Willkommen auf der Rummelinsel' : 'Hilfe') + '</h1>' + IC.chev + '</button>' +
    '<div class="fold-b"><p>Dein kleiner Park hat schon geöffnet. Bau ihn aus und erfülle die Ziele.</p><ul>' +
    (touch ? '<li>Ein Finger: Karte verschieben</li><li>Zwei Finger: zoomen und drehen</li><li>Antippen: Attraktion oder Gast ansehen</li>'
      : '<li>Linke Maustaste ziehen: Karte verschieben</li><li>Rechte Maustaste ziehen: drehen und neigen</li><li>Mausrad: zoomen · R dreht ein Gebäude</li>') +
    '<li>Gebaut wird über die Leiste unten. Jede Attraktion braucht einen Weg direkt daneben.</li><li>Stehen Pflanzen im Weg, rodet sie dein Gärtner. Wird es eng, kaufst du über «Land» neue Flächen dazu.</li></ul><button class="btn" data-act="coachOk">Los geht es</button></div>';
  c.hidden = false;
}

const ACT = {
  speed: (el) => { S.speed = +el.dataset.v; if (S.speed) ui.lastSpeed = S.speed; uiDirty = true; sfx('click'); },
  finance: showFinance, menu: showMenu, goals: showGoals, closeModal,
  tab: (el) => openTab(el.dataset.k),
  card: (el) => {
    const d = DEFS[el.dataset.k];
    if (!unlocked(d)) { toast(d.name + ' gibt es, sobald Ziel ' + d.need + ' erreicht ist.'); return; }
    sfx('click');
    if (d.k === 'custom') setTool(tool && tool.type === 'track' ? null : { type: 'track', rot: 0, nodes: [], h: 2, station: null, info: null, mouse: false, hk: '', sel: null });
    else if (d.cat === 'path') setTool(tool && tool.type === 'path' ? null : { type: 'path' });
    else if (tool && tool.type === 'build' && tool.k === d.k) setTool(null);
    else setTool({ type: 'build', k: d.k, rot: 0 });
  },
  hire: (el) => {
    const k = el.dataset.k;
    if (k === 'sec' && !freePost(null)) { sfx('error'); toast(postPlaces() ? 'Alle Wachposten sind besetzt. Baue einen weiteren (unter Personal), jeder bietet Platz für zwei.' : 'Baue zuerst einen Wachposten (unter Personal). Dort haben zwei Wachleute ihren Platz.', 'bad'); return; }
    if (staffN(k) >= 12) { toast('Mehr als 12 pro Beruf passen nicht in den Park.', 'bad'); return; }
    const s = hire(k);
    if (s) { sfx('build'); toast(s.name + ' fängt als ' + STAFF[k].name + ' an.', 'good'); } else { sfx('error'); toast('Dafür reicht das Geld nicht.', 'bad'); }
    uiDirty = true;
  },
  fire: (el) => { if (fire(el.dataset.k)) sfx('doze'); uiDirty = true; },
  fireOne: () => { const s = sel && sel.staff; if (s && fire(s.type, s)) sfx('doze'); },
  team: showTeam,
  wage: (el) => { S.wage = clamp(S.wage + +el.dataset.d, 0, 2); fillTeam(); sfx('click'); uiDirty = true; },
  hello: () => { if (sel && sel.guest) sayHello(sel.guest); },
  gift: () => { if (sel && sel.guest) giveVoucher(sel.guest); },
  ridePov: () => { if (sel && sel.obj) enterPOV(sel.obj); },
  mini: (el) => { const b = sel && sel.obj; if (b) openMini(el.dataset.k, b); },
  miniAgain: () => { if (!mini) return; const k = mini.kind, b = mini.b; closeModal(); openMini(k, b); },
  walk: () => { if (fp) exitMode(); else enterFP(); },
  exitMode: () => exitMode(),
  currency: () => { closeModal(); openCurrency(false); },
  curShape: (el) => { cd.shape = +el.dataset.v; curRedraw(); curMarks(); },
  curCol: (el) => { cd.col = +el.dataset.v; curRedraw(); curMarks(); },
  curPc: (el) => { cd.pc = +el.dataset.v; if (cd.tool === 'erase') cd.tool = 'brush'; curMarks(); },
  curTool: (el) => { const v = +el.dataset.v; if (v === 0) cd.tool = 'brush'; else if (v === 1) cd.tool = 'erase'; else { cd.tool = 'stamp'; cd.stamp = v - 2; } curMarks(); },
  curSize: (el) => { cd.size = clamp(cd.size + +el.dataset.v, 1, 4); curMarks(); },
  curRandom: () => curRandomize(),
  curClear: () => { cd.auto = false; cd.paint.getContext('2d').clearRect(0, 0, 256, 256); curRedraw(); },
  curDone: () => closeModal(),
  rot: rotateTool, place: tryBuild, tdone: finishTrack,
  th: (el) => { const t = tool; if (!t || t.type !== 'track') return; if (t.sel != null && t.nodes[t.sel]) { t.nodes[t.sel][2] = clamp(t.nodes[t.sel][2] + el.dataset.d * 0.5, 0.5, 6.5); sfx('click'); trackChanged(); } else { t.h = clamp(t.h + el.dataset.d * 0.5, 0.5, 6.5); sfx('click'); drawTrackPrev(); renderToolbar(); } },
  tundo: () => { const t = tool; if (!t || t.type !== 'track') return; if (t.sel != null && t.nodes[t.sel]) t.nodes.splice(t.sel, 1); else if (t.nodes.length) t.nodes.pop(); else t.station = null; t.sel = null; sfx('click'); trackChanged(); },
  cancel: () => { setTool(null); if (ui.tab === 'path' || ui.tab === 'doze' || ui.tab === 'land') { ui.tab = null; renderTray(); } },
  unselect: () => select(null),
  price: (el) => { const b = sel && sel.obj; if (!b) return; b.price = clamp(Math.round((b.price + el.dataset.d * 0.5) * 2) / 2, 0, 25); uiDirty = true; sfx('click'); },
  toggle: () => {
    const b = sel && sel.obj; if (!b) return;
    b.open = !b.open;
    if (!b.open) { for (const g of b.queue) { g.state = 'decide'; g.wait = rnd(0.2, 1); g.tile = g.acc; } b.queue = []; }
    uiDirty = true; sfx('click');
  },
  repair: () => {
    const b = sel && sel.obj; if (!b || !b.broken) return;
    const c = Math.round(b.def.cost * 0.06);
    if (S.money < c) { sfx('error'); toast('Dafür reicht das Geld nicht.', 'bad'); return; }
    spend(c, 'upkeep'); repair(b); sfx('build');
  },
  demolish: () => { const b = sel && sel.obj; if (!b) return; if (b.def.plant) { if (b.cut) { unmarkCut(b); sfx('click'); } else if (markCut(b)) sfx('mark'); renderPanel(); } else if (b.def.cost >= 300) askDemolish(b); else demolish(b); },
  buyLand: () => { const t = tool; if (!t || t.type !== 'land' || t.plot < 0) return; if (buyPlot(t.plot)) { t.plot = -1; hl.visible = false; } renderToolbar(); },
  yesDemolish: () => { const b = ui.ask; closeModal(); if (b && !b.removed) demolish(b); },
  ticket: (el) => { S.ticket = clamp(S.ticket + +el.dataset.d, 0, 90); fillMenu(); sfx('click'); },
  loan: (el) => {
    if (+el.dataset.d > 0) { if (S.loan >= 10000) { toast('Mehr als ' + eur(10000) + ' leiht dir die Bank nicht.', 'bad'); return; } S.loan += 1000; S.money += 1000; }
    else { const pay = Math.min(1000, S.loan); if (!pay) return; if (S.money < pay) { toast('Dafür reicht das Geld nicht.', 'bad'); return; } S.loan -= pay; S.money -= pay; }
    fillMenu(); uiDirty = true; sfx('click');
  },
  mute: () => { S.muted = !S.muted; fillMenu(); sfx('click'); },
  music: () => { S.music = !S.music; fillMenu(); sfx('click'); },
  dev: (el) => devAct(el.dataset.k),
  shadows: () => { S.shadows = !S.shadows; sun.castShadow = S.shadows; fillMenu(); },
  outline: () => { S.outline = S.outline !== true; LINE.auto = true; fillMenu(); },
  help: () => { closeModal(); S.coach = true; renderCoach(); },
  askNew: () => modal('<h2>Neues Spiel beginnen?</h2><p>Dein jetziger Park wird dabei gelöscht.</p><div class="row"><button class="btn red" data-act="yesNew">Neu anfangen</button><button class="btn line" data-act="closeModal">Weiterspielen</button></div>'),
  yesNew: () => { closeModal(); setTool(null); select(null); ui.tab = null; newGame(); renderTray(); toast('Neuer Park eröffnet.', 'good'); uiDirty = true; save(); },
  coachOk: () => { S.coach = false; renderCoach(); sfx('click'); },
  coachFold: () => { S.coach = !S.coach; renderCoach(); sfx('click'); },
  panelFold: () => { ui.panelMin = !ui.panelMin; $('#panel').classList.toggle('min', ui.panelMin); sfx('click'); },
  alertGo: () => {
    let f = null; for (const t of thieves) if (t.state === 'held' && (!f || t.heldT < f.heldT)) f = t;
    if (!f) return; if (fp || pov) exitMode(); setTool(null); if (ui.tab) { ui.tab = null; renderTray(); }
    cam.tx = f.x; cam.tz = f.z; cam.dist = Math.min(cam.dist, 13); sfx('click');
  },
  camL: () => { cam.az += Math.PI / 4; }, camR: () => { cam.az -= Math.PI / 4; },
  zin: () => { cam.dist = clamp(cam.dist * 0.78, 7, 80); }, zout: () => { cam.dist = clamp(cam.dist * 1.28, 7, 80); },
};
document.addEventListener('click', (e) => { const el = e.target.closest && e.target.closest('[data-act]'); if (el && ACT[el.dataset.act]) ACT[el.dataset.act](el, e); });

