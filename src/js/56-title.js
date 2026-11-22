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

const TT = { view: 'main', mode: '', i: -1, from: false, shown: false };
function showTitle(fromGame) {
  if (fromGame) save();   // the park that was open keeps its progress
  select(null); if (ui.modal) closeModal(); if (tool) ACT.cancel(); if (pov || fp) exitMode();
  TT.from = !!fromGame && curSlot >= 0; TT.view = 'main';
  ui.title = true; $('#hud').setAttribute('aria-hidden', 'true'); audioSync(false);   // the park falls silent at once
  const t = $('#title'); t.hidden = false; renderTitle();
}
function hideTitle() { ui.title = false; $('#title').hidden = true; $('#hud').removeAttribute('aria-hidden'); uiDirty = true; audioSync(true); }   // called from a tap: the sound may start right away
function titleSkyline() {
  // bunting across the top, and the dark outline of a fairground along the bottom: big wheel, circus tent, roller coaster
  let flags = '';
  for (let k = 0; k < 15; k++) {
    const t = (k + 0.5) / 15, x = 1200 * t, y = (1 - t) * (1 - t) * 6 + 2 * t * (1 - t) * 58 + t * t * 6, c = ['#ff4f64', '#ffd23f', '#3ddbb4', '#3d8bfd', '#ff8fc7'][k % 5];
    flags += '<path d="M' + (x - 26).toFixed(1) + ' ' + (y - 3).toFixed(1) + ' L' + (x + 26).toFixed(1) + ' ' + (y - 3).toFixed(1) + ' L' + x.toFixed(1) + ' ' + (y + 44).toFixed(1) + 'Z" fill="' + c + '"/>';
  }
  let spokes = '', cabins = '', bulbs = '';
  for (let k = 0; k < 12; k++) {
    const a = k / 12 * Math.PI * 2, cx = 930 + Math.cos(a) * 112, cy = 150 + Math.sin(a) * 112;
    spokes += '<line x1="930" y1="150" x2="' + cx.toFixed(1) + '" y2="' + cy.toFixed(1) + '"/>';
    cabins += '<rect x="' + (cx - 11).toFixed(1) + '" y="' + (cy - 2).toFixed(1) + '" width="22" height="18" rx="5"/>';
    bulbs += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="3.2"/>';
  }
  let tentB = ''; for (let k = 0; k < 9; k++) tentB += '<circle cx="' + (150 + k * 27.5) + '" cy="' + (214 - Math.abs(k - 4) * 2) + '" r="3"/>';
  return '<div class="tt-rays"></div>' +
    '<svg class="tt-bunting" viewBox="0 0 1200 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 6 Q600 58 1200 6" fill="none" stroke="#fff6dc" stroke-width="3"/>' + flags + '</svg>' +
    '<svg class="tt-sky" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
    '<g fill="#2a2168"><path d="M470 300 C520 160 560 120 600 190 C640 260 680 70 730 120 C770 160 790 230 820 300Z" opacity=".55"/></g>' +
    '<g stroke="#2a2168" stroke-width="5" fill="none" opacity=".9"><path d="M470 296 C520 160 560 120 600 190 C640 260 680 70 730 120 C770 160 790 230 820 296"/>' +
    '<line x1="560" y1="140" x2="560" y2="300"/><line x1="600" y1="190" x2="600" y2="300"/><line x1="690" y1="98" x2="690" y2="300"/><line x1="730" y1="120" x2="730" y2="300"/></g>' +
    '<g class="tt-wheel"><g stroke="#2a2168" stroke-width="4">' + spokes + '</g><circle cx="930" cy="150" r="112" fill="none" stroke="#2a2168" stroke-width="9"/><circle cx="930" cy="150" r="16" fill="#2a2168"/><g fill="#2a2168">' + cabins + '</g><g fill="#ffd23f">' + bulbs + '</g></g>' +
    '<path d="M930 150 L880 300 M930 150 L980 300" stroke="#211a54" stroke-width="12"/>' +
    '<g><path d="M130 300 L130 222 L258 132 L386 222 L386 300Z" fill="#241c5c"/><path d="M258 132 L178 222 L210 222Z M258 132 L242 222 L274 222Z M258 132 L306 222 L338 222Z" fill="#3a2b86"/>' +
    '<path d="M222 300 Q258 236 294 300Z" fill="#160f3c"/><line x1="258" y1="132" x2="258" y2="96" stroke="#241c5c" stroke-width="4"/><path d="M258 96 L292 106 L258 116Z" fill="#ff4f64"/><g fill="#ffd23f">' + tentB + '</g></g>' +
    '<g fill="#1d1650"><circle cx="70" cy="262" r="34"/><circle cx="1110" cy="258" r="40"/><circle cx="1160" cy="270" r="30"/><rect x="0" y="282" width="1200" height="18"/></g></svg>';
}
function slotCard(i, info, mode, last, allFull) {
  const free = !info, on = mode === 'main' || (mode === 'load' ? !free : free || allFull);
  const sub = free ? (mode === 'new' ? 'Hier einen neuen Park anlegen' : mode === 'main' ? 'Antippen für einen neuen Park' : '') : 'Tag ' + (info.day || 1) + ' · gespeichert ' + savedWhen(info.at);
  return '<button class="tt-slot' + (free ? ' free' : '') + (!free && last === i ? ' last' : '') + '" data-act="ttSlot" data-i="' + i + '"' + (on ? '' : ' disabled') + '>' +
    '<span class="tt-n">Platz ' + (i + 1) + (!free && last === i ? '<em>Zuletzt gespielt</em>' : '') + '</span>' +
    '<b>' + (free ? 'Freier Speicherplatz' : esc(info.name || 'Mein Park')) + '</b><small>' + sub + '</small>' +
    (mode === 'new' && allFull && !free ? '<span class="tt-rep">Ersetzen</span>' : '') + '</button>';
}
function renderTitle() {
  const t = $('#title'), m = readMeta(), any = m.slots.some(Boolean), allFull = m.slots.every(Boolean);
  if (!t.firstChild) t.innerHTML = '<div class="tt-bg" aria-hidden="true">' + titleSkyline() + '</div><div class="tt-main"><h1 class="logo3d" aria-label="Rummelinsel"><span data-t="RUMMEL">RUMMEL</span><span data-t="INSEL">INSEL</span></h1><div class="tt-view" id="tt-view"></div><small class="tt-ver"></small></div>';
  t.querySelector('.tt-ver').textContent = 'Version ' + BUILD + (DEV ? ' · Entwicklermodus' : '');
  let h = '';
  if (TT.view === 'main') {
    h = '<div class="tt-menu">' + (TT.from ? '<button class="btn tt-b" data-act="ttResume">Zurück zu «' + esc(S.park || 'Mein Park') + '»</button>' : '') +
      (any ? '<button class="btn tt-b' + (TT.from ? ' line' : '') + '" data-act="ttPick" data-m="load">Spiel fortsetzen</button><button class="btn tt-b line" data-act="ttPick" data-m="new">Neues Spiel</button>'
        : '<button class="btn tt-b" data-act="ttPick" data-m="new">Spiel starten</button>') +
      '<button class="btn tt-b line" data-act="ttCredits">Mitwirkende</button></div>' +
      '<h2 class="tt-h">Deine Parks</h2><div class="tt-slots">' + m.slots.map((s, i) => slotCard(i, s, 'main', m.last, allFull)).join('') + '</div>';
  } else if (TT.view === 'pick') {
    const q = TT.mode === 'load' ? 'Welchen Park möchtest du weiterspielen?' : allFull ? 'Alle drei Plätze sind belegt. Welchen Park möchtest du durch einen neuen ersetzen?' : any ? 'Wähle einen freien Platz für deinen neuen Park.' : 'Wähle einen Platz für deinen ersten Park.';
    h = '<h2 class="tt-h big">' + q + '</h2><div class="tt-slots">' + m.slots.map((s, i) => slotCard(i, s, TT.mode, m.last, allFull)).join('') + '</div><div class="tt-row"><button class="btn line" data-act="ttBack">Zurück</button></div>';
  } else if (TT.view === 'confirm') {
    const s = m.slots[TT.i] || {};
    h = '<div class="tt-card"><h2 class="tt-h big">«' + esc(s.name || 'Mein Park') + '» ersetzen?</h2><p>Der Park «' + esc(s.name || 'Mein Park') + '» auf Platz ' + (TT.i + 1) + ' (Tag ' + (s.day || 1) + ') wird gelöscht und durch einen neuen Park ersetzt. Das lässt sich nicht rückgängig machen.</p>' +
      '<div class="tt-row"><button class="btn red" data-act="ttReplace">Ja, ersetzen</button><button class="btn line" data-act="ttBack">Abbrechen</button></div></div>';
  } else if (TT.view === 'name') {
    const used = m.slots.filter(Boolean).map((s) => s.name), def = !used.length ? 'Mein Park' : ['Sonnenpark', 'Glückspark', 'Rummelplatz', 'Wunderpark'].find((n) => used.indexOf(n) < 0) || 'Park ' + (TT.i + 1);
    h = '<div class="tt-card"><h2 class="tt-h big">Wie soll dein Park heissen?</h2><p>Platz ' + (TT.i + 1) + '. Den Namen siehst du später im Parkbüro und hier auf dem Titelbildschirm.</p>' +
      '<input id="tt-name" class="tt-in" maxlength="24" autocomplete="off" spellcheck="false" value="' + esc(def) + '" aria-label="Name des Parks">' +
      '<div class="tt-row"><button class="btn" data-act="ttCreate">Park eröffnen</button><button class="btn line" data-act="ttBack">Zurück</button></div></div>';
  } else if (TT.view === 'credits') {
    const au = audioCredits();
    h = '<div class="tt-card tt-cred"><h2 class="tt-h big">Mitwirkende</h2><dl>' +
      '<dt>Spielidee, Gestaltung und Spielleitung</dt><dd>Das Rummelinsel-Team</dd>' +
      '<dt>Spieltest</dt><dd>Unser Testspieler. Danke für die vielen genauen Hinweise!</dd>' +
      '<dt>Programmierung, Figuren und Grafik</dt><dd>Entwickelt mit Claude Code (Anthropic)</dd>' +
      (au.length ? '<dt>Musik und Geräusche</dt><dd><ul>' + au.map((c) => '<li><b>' + esc(c.t) + '</b><span>' + esc(c.a) + ' · ' + esc(c.l) + '</span></li>').join('') + '</ul></dd>' : '') +
      '<dt>Schriften</dt><dd>Bungee von David Jonathan Ross und Nunito von Vernon Adams, beide unter der SIL Open Font License 1.1</dd>' +
      '<dt>3D-Grafik</dt><dd>three.js (r128), MIT-Lizenz</dd></dl>' +
      '<div class="tt-row"><button class="btn" data-act="ttBack">Zurück zum Titel</button></div></div>';
  }
  const v = $('#tt-view'); v.innerHTML = h; v.className = 'tt-view ' + TT.view;
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
Object.assign(ACT, {
  ttPick: (el) => { sfx('click'); TT.mode = el.dataset.m; TT.view = 'pick'; renderTitle(); },
  ttBack: () => { sfx('click'); TT.view = TT.view === 'confirm' || TT.view === 'name' ? (TT.mode ? 'pick' : 'main') : 'main'; if (TT.view === 'main') TT.mode = ''; renderTitle(); },
  ttCredits: () => { sfx('click'); TT.view = 'credits'; renderTitle(); },
  ttResume: () => { sfx('click'); hideTitle(); },
  ttSlot: (el) => {
    const i = +el.dataset.i, m = readMeta(), info = m.slots[i], allFull = m.slots.every(Boolean), mode = TT.view === 'pick' ? TT.mode : 'main';
    sfx('click'); TT.i = i;
    if (info && (mode === 'main' || mode === 'load')) { loadSlot(i); return; }
    if (!info) { if (mode === 'main') TT.mode = 'new'; TT.view = 'name'; renderTitle(); return; }
    if (mode === 'new' && allFull) { TT.view = 'confirm'; renderTitle(); }
  },
  ttReplace: () => { sfx('click'); TT.view = 'name'; renderTitle(); },
  ttCreate: () => {
    const inp = $('#tt-name'), name = ((inp && inp.value) || '').replace(/\s+/g, ' ').trim().slice(0, 24) || 'Mein Park';
    try { localStorage.removeItem(SKEY.slot(TT.i)); } catch (e) { /* storage is optional */ }
    newPark(TT.i, name);
  },
  toTitle: () => { sfx('click'); showTitle(true); },
});
