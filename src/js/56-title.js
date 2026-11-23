/* ================= title screen, the three parks, and a fresh start with every new version ================= */
// Every published version carries its own build mark (written by build.js). When the game is opened in a version it has
// not seen before, every Rummelinsel save of earlier versions is deleted: all three parks, the developer copies too.
// The remembered layout of folded boxes is not a save and stays.
const BUILD = window.RUMMEL_BUILD || 'lokal';
const SKEY = { build: 'rummelinsel.build', meta: DEV ? 'rummelinsel.dev.meta' : 'rummelinsel.meta', slot: (i) => (DEV ? 'rummelinsel.dev.park' : 'rummelinsel.park') + (i + 1) };
let curSlot = -1;   // which of the three parks is being played; -1 while none is (the island behind the title screen)
function versionCheck() {
  try {
    if (localStorage.getItem(SKEY.build) === BUILD) return 0;
    const gone = [];
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.indexOf('rummelinsel') === 0 && k !== UI_KEY) gone.push(k); }
    for (const k of gone) localStorage.removeItem(k);
    localStorage.setItem(SKEY.build, BUILD);
    return gone.length;
  } catch (e) { return 0; }
}
function readMeta() {
  let m = null; try { m = JSON.parse(localStorage.getItem(SKEY.meta) || 'null'); } catch (e) { m = null; }
  if (!m || !Array.isArray(m.slots)) m = { last: -1, slots: [] };
  for (let i = 0; i < 3; i++) if (!m.slots[i] || typeof m.slots[i] !== 'object') m.slots[i] = null;
  return m;
}
function writeMeta(m) { try { localStorage.setItem(SKEY.meta, JSON.stringify(m)); } catch (e) { /* storage is optional */ } }
const esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function savedWhen(at) {
  if (!at) return '';
  const d = new Date(at), now = new Date(), hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  const day = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime(), diff = Math.round((day(now) - day(d)) / 864e5);
  return diff === 0 ? 'heute ' + hm : diff === 1 ? 'gestern ' + hm : d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + hm;
}

// The title screen shows the logo and one or two buttons: «Neues Spiel», and «Spiel fortsetzen» once a park has been saved.
// The three parks have a view of their own, «Deine Parks», which opens from «Neues Spiel».
const TT = { view: 'main', i: -1, from: false };
function showTitle(fromGame) {
  if (fromGame) save();   // the park that was open keeps its progress
  select(null); if (ui.modal) closeModal(); if (tool) ACT.cancel(); if (pov || fp) exitMode();
  TT.from = !!fromGame && curSlot >= 0; TT.view = 'main';
  ui.title = true; $('#hud').setAttribute('aria-hidden', 'true'); audioSync(false);   // the park falls silent at once
  const t = $('#title'); t.hidden = false; renderTitle();
}
function hideTitle() { ui.title = false; $('#title').hidden = true; $('#hud').removeAttribute('aria-hidden'); uiDirty = true; audioSync(true); }   // called from a tap: the sound may start right away
// The backdrop of the title screen, in the colours and the soft toy look of the logo: puffy clouds in a warm sky, two
// small hot-air balloons where there is room, and a calm sea with paper-cut waves along the bottom. All of it pale and
// quiet, so that the animated logo stays the centre. (The sky itself, its glow and its rays are CSS.)
function titleBackdrop() {
  const defs = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<linearGradient id="ttc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#fff1dc"/></linearGradient>' +
    '<radialGradient id="ttbs" cx=".34" cy=".26" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#5a2a0a" stop-opacity=".26"/></radialGradient>' +
    '<linearGradient id="tts0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6f0e3"/><stop offset="1" stop-color="#c0e8da"/></linearGradient>' +
    '<linearGradient id="tts1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bde7d9"/><stop offset="1" stop-color="#a6dccd"/></linearGradient>' +
    '<linearGradient id="tts2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6ddce"/><stop offset="1" stop-color="#8dd1c1"/></linearGradient>' +
    '<linearGradient id="tts3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd3c3"/><stop offset="1" stop-color="#74c5b4"/></linearGradient>' +
    '</defs></svg>';
  // a cloud: a few round puffs on a flat base, a little darker underneath
  const cloud = (cls) => '<svg class="tt-cloud ' + cls + '" viewBox="-112 -60 224 104" aria-hidden="true"><g class="d"><ellipse cx="2" cy="30" rx="88" ry="10" fill="#f0b98a" opacity=".3"/>' +
    '<circle cx="-50" cy="8" r="28" fill="url(#ttc)"/><circle cx="-10" cy="-14" r="40" fill="url(#ttc)"/><circle cx="36" cy="-2" r="31" fill="url(#ttc)"/><circle cx="70" cy="12" r="20" fill="url(#ttc)"/><rect x="-78" y="6" width="168" height="28" rx="14" fill="url(#ttc)"/>' +
    '<ellipse cx="-18" cy="-30" rx="20" ry="9" fill="#fff" opacity=".7"/></g></svg>';
  // a hot-air balloon with stripes, a highlight and a little basket
  const ENV = 'M30 2 C52 2 58 22 56 34 C54 48 40 58 36 66 L24 66 C20 58 6 48 4 34 C2 22 8 2 30 2Z';
  const ball = (cls, id, c1, c2) => '<svg class="tt-ball ' + cls + '" viewBox="0 0 60 90" aria-hidden="true"><g class="d"><clipPath id="' + id + '"><path d="' + ENV + '"/></clipPath><path d="' + ENV + '" fill="' + c1 + '"/>' +
    '<g clip-path="url(#' + id + ')"><ellipse cx="30" cy="34" rx="8.5" ry="42" fill="' + c2 + '"/><ellipse cx="7" cy="34" rx="6" ry="42" fill="' + c2 + '"/><ellipse cx="53" cy="34" rx="6" ry="42" fill="' + c2 + '"/><rect x="0" y="0" width="60" height="70" fill="url(#ttbs)"/></g>' +
    '<path d="M25 66 L26 76 M35 66 L34 76" stroke="#8a5a2a" stroke-width="1.2" fill="none"/><rect x="24" y="76" width="12" height="9" rx="2.5" fill="#b9772f"/><rect x="24" y="76" width="12" height="3.2" rx="1.6" fill="#dca24f"/></g></svg>';
  // one row of waves: pointed crests with a light rim, reaching beyond both edges so that it can sway
  const wave = (y, n, sag, shift, fill, cls) => {
    const w = 1500 / n; let d = 'M' + (-150 + shift) + ' ' + y;
    for (let k = 0; k < n; k++) { const x0 = -150 + shift + k * w; d += ' Q' + (x0 + w / 2).toFixed(1) + ' ' + (y + sag) + ' ' + (x0 + w).toFixed(1) + ' ' + y; }
    return '<g class="' + cls + '"><path d="' + d + ' L1400 200 L-200 200Z" fill="url(#' + fill + ')"/><path d="' + d + '" fill="none" stroke="#f3fffa" stroke-width="2.6" stroke-linecap="round" opacity=".85"/></g>';
  };
  const sea = '<svg class="tt-sea" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">' +
    '<path d="M150 26 Q215 4 290 26Z" fill="#e7d9a2"/><path d="M905 26 Q990 -2 1085 26Z" fill="#dfe0a0"/><path d="M1010 26 Q1050 12 1100 26Z" fill="#cfdc94"/>' +   // two far islands on the horizon
    '<rect x="0" y="24" width="1200" height="176" fill="url(#tts0)"/><rect x="0" y="23" width="1200" height="2.5" fill="#f3fffa" opacity=".8"/>' +
    wave(58, 13, 13, 0, 'tts1', 'w1') + wave(102, 10, 16, 55, 'tts2', 'w2') + wave(150, 8, 19, 20, 'tts3', 'w3') + '</svg>';
  return defs + '<div class="tt-glow"></div><div class="tt-rays"></div>' + cloud('c1') + cloud('c2') + cloud('c3') + cloud('c4') +
    ball('b1', 'ttb1', '#f0503c', '#fff3d6') + ball('b2', 'ttb2', '#ffc21a', '#1f8f78') + sea;
}
// the park that «Spiel fortsetzen» opens: the one played last, otherwise the one saved last; -1 without any park
function lastSlot(m) {
  if (m.last >= 0 && m.slots[m.last]) return m.last;
  let best = -1; for (let i = 0; i < 3; i++) if (m.slots[i] && (best < 0 || (m.slots[i].at || 0) > (m.slots[best].at || 0))) best = i;
  return best;
}
function slotCard(i, info, last, allFull) {
  if (!info) return '<div class="tt-slot free"><button class="tt-open" data-act="ttSlot" data-i="' + i + '"><span class="tt-n">Platz ' + (i + 1) + '</span><b>Freier Speicherplatz</b><small>Hier einen neuen Park anlegen</small></button></div>';
  return '<div class="tt-slot' + (last === i ? ' last' : '') + '"><button class="tt-open" data-act="ttSlot" data-i="' + i + '"><span class="tt-n">Platz ' + (i + 1) + (last === i ? '<em>Zuletzt gespielt</em>' : '') + '</span>' +
    '<b>' + esc(info.name || 'Mein Park') + '</b><small>Tag ' + (info.day || 1) + ' · gespeichert ' + savedWhen(info.at) + '</small><span class="tt-go">Park öffnen</span></button>' +
    (allFull ? '<button class="tt-repb" data-act="ttAskReplace" data-i="' + i + '">Durch neuen Park ersetzen</button>' : '') + '</div>';
}
// builds the frame of the title screen once; the animated logo is already in the page (put there by build.js) and moves into it
function titleBuild() {
  const t = $('#title'); if (t.querySelector('.tt-main')) return;
  const logo = document.getElementById('tt-logo'); if (logo) logo.remove();
  t.innerHTML = '<div class="tt-bg" aria-hidden="true">' + titleBackdrop() + '</div><div class="tt-main"><h1 class="tt-logow" id="tt-logow"></h1><div class="tt-view" id="tt-view"></div><small class="tt-ver"></small></div>';
  if (logo) $('#tt-logow').appendChild(logo);
  else $('#tt-logow').innerHTML = '<span class="logo3d" aria-label="Rummelinsel"><span data-t="RUMMEL">RUMMEL</span><span data-t="INSEL">INSEL</span></span>';   // a build without the logo file
}
function renderTitle() {
  titleBuild();
  const t = $('#title'), m = readMeta(), any = m.slots.some(Boolean), allFull = m.slots.every(Boolean), last = lastSlot(m);
  t.querySelector('.tt-ver').textContent = 'Version ' + BUILD + (DEV ? ' · Entwicklermodus' : '');
  let h = '';
  if (TT.view === 'main') {
    const li = last >= 0 ? m.slots[last] : null;
    h = '<div class="tt-menu">' + (li ? '<button class="btn tt-b" data-act="ttContinue">Spiel fortsetzen<small>' + esc(li.name || 'Mein Park') + ' · Tag ' + (li.day || 1) + '</small></button>' : '') +
      '<button class="btn tt-b' + (li ? ' line' : '') + '" data-act="ttParks">Neues Spiel</button></div>';
  } else if (TT.view === 'parks') {
    h = '<h2 class="tt-h big">Deine Parks</h2><p class="tt-sub">' + (allFull ? 'Alle drei Plätze sind belegt. Öffne einen deiner Parks, oder ersetze einen durch einen neuen.' : any ? 'Lege auf einem freien Platz einen neuen Park an, oder öffne einen deiner Parks.' : 'Wähle einen Platz für deinen ersten Park.') + '</p>' +
      '<div class="tt-slots">' + m.slots.map((s, i) => slotCard(i, s, last, allFull)).join('') + '</div><div class="tt-row"><button class="btn line" data-act="ttBack">Zurück</button></div>';
  } else if (TT.view === 'confirm') {
    const s = m.slots[TT.i] || {};
    h = '<div class="tt-card"><h2 class="tt-h big">«' + esc(s.name || 'Mein Park') + '» ersetzen?</h2><p>Der Park «' + esc(s.name || 'Mein Park') + '» auf Platz ' + (TT.i + 1) + ' (Tag ' + (s.day || 1) + ') wird gelöscht und durch einen neuen Park ersetzt. Das lässt sich nicht rückgängig machen.</p>' +
      '<div class="tt-row"><button class="btn red" data-act="ttReplace">Ja, ersetzen</button><button class="btn line" data-act="ttBack">Abbrechen</button></div></div>';
  } else if (TT.view === 'name') {
    const used = m.slots.filter(Boolean).map((s) => s.name), def = !used.length ? 'Mein Park' : ['Sonnenpark', 'Glückspark', 'Rummelplatz', 'Wunderpark'].find((n) => used.indexOf(n) < 0) || 'Park ' + (TT.i + 1);
    h = '<div class="tt-card"><h2 class="tt-h big">Wie soll dein Park heissen?</h2><p>Platz ' + (TT.i + 1) + '. Den Namen siehst du später im Parkbüro und bei deinen Parks.</p>' +
      '<input id="tt-name" class="tt-in" maxlength="24" autocomplete="off" spellcheck="false" value="' + esc(def) + '" aria-label="Name des Parks">' +
      '<div class="tt-row"><button class="btn" data-act="ttCreate">Park eröffnen</button><button class="btn line" data-act="ttBack">Zurück</button></div></div>';
  }
  const v = $('#tt-view'); v.innerHTML = h; v.className = 'tt-view ' + TT.view;
  t.classList.toggle('sub', TT.view !== 'main');   // in the other views the logo steps back
  if (TT.view === 'name') { const inp = $('#tt-name'); inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); ACT.ttCreate(); } }); setTimeout(() => { try { inp.focus(); inp.select(); } catch (e) { /* not everywhere */ } }, 60); }
  t.scrollTop = 0;
}
function loadSlot(i) {
  let data = null; try { data = JSON.parse(localStorage.getItem(SKEY.slot(i)) || 'null'); } catch (e) { data = null; }
  if (!data || data.build !== BUILD || data.v !== 1 || !Array.isArray(data.paths) || !Array.isArray(data.objs)) { sfx('error'); toast('Dieser Park liess sich nicht laden.', 'bad'); return; }
  try { load(data); } catch (e) { sfx('error'); toast('Dieser Park liess sich nicht laden.', 'bad'); newGame(); curSlot = -1; return; }
  curSlot = i; const m = readMeta(); m.last = i; writeMeta(m);
  parkOpened(); toast('Willkommen zurück in «' + (S.park || 'deinem Park') + '».', 'good');
}
function newPark(i, name, quiet) {
  newGame(); S.park = name; curSlot = i; save(); parkOpened();
  if (!S.cur) { if (DEV || quiet) { S.cur = { name: 'Testtaler', sym: 'T', shape: 0, col: 0, img: '' }; applyCurrency(); } else openCurrency(true); }
}
// the camera at the gate, nothing selected, and every display about the park filled in afresh
function parkOpened() {
  hideTitle(); select(null); ui.tab = null; renderTray(); renderCoach(); applyCurrency(); rufReset();
  cam.tx = cam.tx0; cam.tz = cam.tz0; cam.dist = cam.d = cam.dist0; ui.goalAt = 0;
  uiDirty = true; sfx('goal');
}
// opens a saved park; the one that is still loaded behind the title screen simply carries on
function openSlot(i) { if (TT.from && curSlot === i) hideTitle(); else loadSlot(i); }
Object.assign(ACT, {
  ttParks: () => { TT.view = 'parks'; renderTitle(); },
  ttContinue: () => { const i = lastSlot(readMeta()); if (i >= 0) openSlot(i); },
  ttBack: () => { TT.view = TT.view === 'parks' ? 'main' : 'parks'; renderTitle(); },
  ttSlot: (el) => { const i = +el.dataset.i; TT.i = i; if (readMeta().slots[i]) openSlot(i); else { TT.view = 'name'; renderTitle(); } },
  ttAskReplace: (el) => { TT.i = +el.dataset.i; TT.view = 'confirm'; renderTitle(); },
  ttReplace: () => { TT.view = 'name'; renderTitle(); },
  ttCreate: () => {
    const inp = $('#tt-name'), name = ((inp && inp.value) || '').replace(/\s+/g, ' ').trim().slice(0, 24) || 'Mein Park';
    try { localStorage.removeItem(SKEY.slot(TT.i)); } catch (e) { /* storage is optional */ }
    newPark(TT.i, name);
  },
  toTitle: () => { sfx('click'); showTitle(true); },
});
