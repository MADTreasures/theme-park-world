/* ================= the park's own money ================= */
// The player names the currency and designs its coin: a shape, a metal, then free painting and stamps on top.
const COIN_SHAPES = ['Rund', 'Sechseck', 'Achteck', 'Quadrat', 'Zacken', 'Blume'];
const COIN_COLS = [['#ffd447', '#c9940a'], ['#dfe3ee', '#8a8fa8'], ['#e7a063', '#9a5a2a'], ['#3ddbb4', '#14957a'], ['#ff9fd0', '#c2417f'], ['#8dbbff', '#2f63c9'], ['#ff7b7b', '#b9243a'], ['#bda6ff', '#6a45c9']];
const PAINT_COLS = ['#2a2350', '#ffffff', '#ff4f64', '#ffd447', '#3d8bfd', '#14957a', '#ff8fc7', '#f08a24'];
const STAMPS = ['Stern', 'Herz', 'Kreis', 'Quadrat', 'Dreieck', 'Krone', 'Blitz', 'Kürzel'];
const CUR_NAMES = ['Taler', 'Rummel', 'Jubel', 'Glückis', 'Zuckerlinge', 'Muscheln', 'Funken', 'Kringel', 'Sternchen', 'Lose'];
function coinPath(c, shape, cx, cy, r) {
  c.beginPath();
  if (shape === 0) c.arc(cx, cy, r, 0, TAU);
  else if (shape === 1 || shape === 2) { const n = shape === 1 ? 6 : 8; for (let i = 0; i < n; i++) { const a = i / n * TAU + (shape === 2 ? Math.PI / 8 : 0); c[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * r, cy + Math.sin(a) * r); } }
  else if (shape === 3) { const s = r * 0.86, q = r * 0.24; c.moveTo(cx - s + q, cy - s); c.arcTo(cx + s, cy - s, cx + s, cy + s, q); c.arcTo(cx + s, cy + s, cx - s, cy + s, q); c.arcTo(cx - s, cy + s, cx - s, cy - s, q); c.arcTo(cx - s, cy - s, cx + s, cy - s, q); }
  else if (shape === 4) { for (let i = 0; i < 24; i++) { const a = i / 24 * TAU - Math.PI / 2, rr = i % 2 ? r * 0.86 : r; c[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } }
  else { for (let i = 0; i <= 72; i++) { const a = i / 72 * TAU, rr = r * (0.92 + 0.08 * Math.cos(a * 8)); c[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } }
  c.closePath();
}
function stampShape(c, kind, x, y, s, sym) {
  c.beginPath();
  if (kind === 0) { for (let i = 0; i < 10; i++) { const a = i / 10 * TAU - Math.PI / 2, r = i % 2 ? s * 0.45 : s; c[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r); } }
  else if (kind === 1) { c.moveTo(x, y + s * 0.85); c.bezierCurveTo(x - s * 1.5, y - s * 0.2, x - s * 0.6, y - s * 1.3, x, y - s * 0.4); c.bezierCurveTo(x + s * 0.6, y - s * 1.3, x + s * 1.5, y - s * 0.2, x, y + s * 0.85); }
  else if (kind === 2) c.arc(x, y, s * 0.85, 0, TAU);
  else if (kind === 3) c.rect(x - s * 0.75, y - s * 0.75, s * 1.5, s * 1.5);
  else if (kind === 4) { c.moveTo(x, y - s); c.lineTo(x + s * 0.95, y + s * 0.75); c.lineTo(x - s * 0.95, y + s * 0.75); }
  else if (kind === 5) { c.moveTo(x - s, y + s * 0.7); c.lineTo(x - s, y - s * 0.5); c.lineTo(x - s * 0.45, y + s * 0.05); c.lineTo(x, y - s * 0.85); c.lineTo(x + s * 0.45, y + s * 0.05); c.lineTo(x + s, y - s * 0.5); c.lineTo(x + s, y + s * 0.7); }
  else if (kind === 6) { c.moveTo(x + s * 0.25, y - s); c.lineTo(x - s * 0.6, y + s * 0.15); c.lineTo(x - s * 0.05, y + s * 0.15); c.lineTo(x - s * 0.3, y + s); c.lineTo(x + s * 0.6, y - s * 0.2); c.lineTo(x + s * 0.05, y - s * 0.2); }
  else { c.font = '900 ' + Math.round(s * 1.7) + 'px Bungee, Impact, "Arial Black", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(sym, x, y + s * 0.08); return; }
  c.closePath(); c.fill();
}
function drawCoin(c, size, shape, col, paint) {
  const r = size * 0.47, m = size / 2, cc = COIN_COLS[col];
  c.clearRect(0, 0, size, size);
  coinPath(c, shape, m, m, r); c.fillStyle = cc[1]; c.fill();
  coinPath(c, shape, m, m, r * 0.86); c.fillStyle = cc[0]; c.fill();
  c.save(); coinPath(c, shape, m, m, r * 0.86); c.clip();
  if (paint) c.drawImage(paint, 0, 0, size, size);
  const g = c.createLinearGradient(0, 0, size, size); g.addColorStop(0, 'rgba(255,255,255,.38)'); g.addColorStop(0.45, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.14)');
  c.fillStyle = g; c.fillRect(0, 0, size, size); c.restore();
}
function coinImage(shape, col, paint) { const cv = document.createElement('canvas'); cv.width = cv.height = 128; drawCoin(cv.getContext('2d'), 128, shape, col, paint); return cv.toDataURL('image/png'); }
function defaultCoin() { const p = document.createElement('canvas'); p.width = p.height = 256; const c = p.getContext('2d'); c.fillStyle = '#2a2350'; stampShape(c, 7, 128, 128, 62, CUR.sym); return coinImage(0, 0, p); }

let coinSprites = null;
function applyCurrency() {
  if (S.cur) { CUR.name = S.cur.name; CUR.sym = S.cur.sym; CUR.shape = S.cur.shape; CUR.col = S.cur.col; CUR.img = S.cur.img; }
  if (!CUR.img) CUR.img = defaultCoin();
  $('#coin-img').src = CUR.img;
  const im = new Image();
  im.onload = () => {
    ICON.money.map = bubble((c) => { c.drawImage(im, -29, -29, 58, 58); }); ICON.money.needsUpdate = true;
    const tex = new T.Texture(im); tex.needsUpdate = true;
    if (!coinSprites) {
      coinSprites = [-1.84, 1.84].map((sx) => { const s = new T.Sprite(new T.SpriteMaterial({ map: tex })); s.scale.set(0.62, 0.62, 1); s.position.set(wX(HALF) + sx, 1.55, HALF + 0.83); scene.add(s); return s; });
    } else for (const s of coinSprites) { s.material.map = tex; s.material.needsUpdate = true; }
  };
  im.src = CUR.img;
  uiDirty = true; if (ui.tab) renderTray(); renderToolbar(); if (sel) renderPanel();
}

let cd = null;   // designer state while the dialog is open
function openCurrency(first) {
  const cur = S.cur || { name: pick(CUR_NAMES), sym: '', shape: 0, col: 0 };
  cd = { shape: cur.shape, col: cur.col, tool: 'brush', stamp: 0, pc: 0, size: 2, first, paint: document.createElement('canvas'), drawing: false, lx: 0, ly: 0 };
  cd.paint.width = cd.paint.height = 256;
  const chips = (id, list, act) => '<div class="chips" id="' + id + '">' + list.map((n, i) => '<button data-act="' + act + '" data-v="' + i + '">' + n + '</button>').join('') + '</div>';
  const sw = (id, list, act) => '<div class="sw" id="' + id + '">' + list.map((n, i) => '<button data-act="' + act + '" data-v="' + i + '" style="background:' + (Array.isArray(n) ? n[0] : n) + '" aria-label="Farbe ' + (i + 1) + '"></button>').join('') + '</div>';
  modal('<h2>' + (first ? 'Erfinde deine Währung' : 'Währung gestalten') + '</h2><p class="note">Auf der Rummelinsel zahlt man mit deinem Geld. Gib ihm einen Namen und gestalte die Münze.</p>' +
    '<div class="cur"><canvas id="cur-cv" width="256" height="256" aria-label="Münze zum Bemalen"></canvas><div class="curf">' +
    '<label for="cur-name">Name</label><input id="cur-name" maxlength="14" autocomplete="off" spellcheck="false">' +
    '<label for="cur-sym">Kürzel (1 bis 3 Zeichen)</label><input id="cur-sym" maxlength="3" autocomplete="off" spellcheck="false">' +
    '<p class="note" id="cur-ex"></p></div></div>' +
    '<h3>Form</h3>' + chips('cur-shape', COIN_SHAPES, 'curShape') + '<h3>Metall</h3>' + sw('cur-col', COIN_COLS, 'curCol') +
    '<h3>Malen und stempeln</h3>' + chips('cur-tool', ['Pinsel', 'Radierer'].concat(STAMPS), 'curTool') + sw('cur-pc', PAINT_COLS, 'curPc') +
    '<div class="stepper"><span class="lbl">Grösse</span><button class="sq" data-act="curSize" data-v="-1" aria-label="Kleiner">' + IC.minus + '</button><output id="cur-size"></output><button class="sq" data-act="curSize" data-v="1" aria-label="Grösser">' + IC.plus + '</button></div>' +
    '<div class="row"><button class="btn line" data-act="curRandom">Zufall</button><button class="btn line" data-act="curClear">Leeren</button><button class="btn" data-act="curDone">Fertig</button></div>');
  ui.onClose = finishCurrency;
  const name = $('#cur-name'), sym = $('#cur-sym'); name.value = cur.name; sym.value = cur.sym || cur.name.slice(0, 1).toUpperCase();
  const ex = () => { $('#cur-ex').textContent = 'So steht es im Park: 450 ' + (sym.value.trim() || '?'); if (cd && cd.auto) curAuto(); else if (cd) curRedraw(); };
  name.addEventListener('input', () => { if (!sym.dataset.touched) sym.value = name.value.trim().slice(0, 1).toUpperCase(); ex(); });
  sym.addEventListener('input', () => { sym.dataset.touched = '1'; ex(); });
  const cv = $('#cur-cv');
  const pos = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * 256 / r.width, (e.clientY - r.top) * 256 / r.height]; };
  cv.addEventListener('pointerdown', (e) => {
    const [x, y] = pos(e), c = cd.paint.getContext('2d'); e.preventDefault();
    try { cv.setPointerCapture(e.pointerId); } catch (_) { /* fine without */ }
    cd.auto = false;
    if (cd.tool === 'stamp') { c.globalCompositeOperation = 'source-over'; c.fillStyle = PAINT_COLS[cd.pc]; stampShape(c, cd.stamp, x, y, 10 + cd.size * 9, sym.value.trim() || '?'); curRedraw(); return; }
    cd.drawing = true; cd.lx = x; cd.ly = y; curStroke(x, y);
  });
  cv.addEventListener('pointermove', (e) => { if (cd && cd.drawing) { const [x, y] = pos(e); curStroke(x, y); } });
  const stop = () => { if (cd) cd.drawing = false; };
  cv.addEventListener('pointerup', stop); cv.addEventListener('pointercancel', stop);
  if (first || !S.cur) curRandomize(); else curRedraw();
  ex(); curMarks();
}
function curStroke(x, y) {
  const c = cd.paint.getContext('2d');
  c.globalCompositeOperation = cd.tool === 'erase' ? 'destination-out' : 'source-over';
  c.strokeStyle = PAINT_COLS[cd.pc]; c.lineWidth = 4 + cd.size * 5; c.lineCap = c.lineJoin = 'round';
  c.beginPath(); c.moveTo(cd.lx, cd.ly); c.lineTo(x + 0.01, y + 0.01); c.stroke(); c.globalCompositeOperation = 'source-over';
  cd.lx = x; cd.ly = y; curRedraw();
}
function curRedraw() { const cv = $('#cur-cv'); if (cv) drawCoin(cv.getContext('2d'), 256, cd.shape, cd.col, cd.paint); }
function curMarks() {
  const mark = (id, v) => document.querySelectorAll('#' + id + ' button').forEach((b, i) => b.setAttribute('aria-pressed', i === v));
  mark('cur-shape', cd.shape); mark('cur-col', cd.col); mark('cur-pc', cd.pc); mark('cur-tool', cd.tool === 'brush' ? 0 : cd.tool === 'erase' ? 1 : cd.stamp + 2);
  setTxt('cur-size', ['fein', 'mittel', 'breit', 'riesig'][cd.size - 1]);
}
function curRandomize() { cd.shape = rint(0, 5); cd.col = rint(0, COIN_COLS.length - 1); cd.ink = pick(['#2a2350', '#ffffff', '#b9243a']); curAuto(); }
// The starter design: the short name in the middle with a ring of stars and dots. It follows the short name until the player paints.
function curAuto() {
  const c = cd.paint.getContext('2d'); c.clearRect(0, 0, 256, 256); cd.auto = true;
  const sym = ($('#cur-sym').value || 'T').trim() || 'T', ink = cd.ink || '#2a2350';
  c.fillStyle = ink; stampShape(c, 7, 128, 132, 58, sym);
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; c.fillStyle = ink; stampShape(c, i % 2 ? 2 : 0, 128 + Math.cos(a) * 84, 128 + Math.sin(a) * 84, i % 2 ? 6 : 9, sym); }
  curRedraw(); curMarks();
}
function finishCurrency() {
  if (!cd) return;
  const name = ($('#cur-name').value || '').trim().replace(/[<>&"]/g, '') || 'Taler', sym = ($('#cur-sym').value || '').trim().replace(/[<>&"]/g, '') || name.slice(0, 1).toUpperCase();
  S.cur = { name, sym, shape: cd.shape, col: cd.col, img: coinImage(cd.shape, cd.col, cd.paint) };
  const first = cd.first; cd = null;
  applyCurrency(); save();
  toast(first ? 'Ab sofort zahlt man hier mit ' + name + '.' : 'Neue Münzen sind im Umlauf: ' + name + '.', 'gold'); sfx('goal');
}
