/* ================= developer mode ================= */
// Open dev.html, or add #dev to the address. It keeps its own save game, starts with everything unlocked and endless money,
// and adds a panel of switches for trying things out.
const dev = { rich: true, fast: false };
function devAct(k) {
  if (k === 'cash') { S.money += 10000; }
  else if (k === 'rich') dev.rich = !dev.rich;
  else if (k === 'unlock') { S.goal = GOALS.length; renderTray(); }
  else if (k === 'guests') { for (let i = 0; i < 25; i++) if (guests.length < MAXG) spawnGuest(true); }
  else if (k === 'happy') { for (const g of guests) g.happy = 95; }
  else if (k === 'thief') spawnThief();
  else if (k === 'sun' || k === 'cloud' || k === 'rain' || k === 'storm') { WX.wasRain = false; wxSet(k); WX.t = 240; }
  else if (k === 'time') S.time += DAY / 4;
  else if (k === 'fast') { dev.fast = !dev.fast; S.speed = dev.fast ? 10 : 1; }
  else if (k === 'lvl') { for (const b of builds) if (b.def.cat === 'ride') { const l = lvlOf(b); if (l <= LVL.length) b.count = LVL[l - 1]; } if (sel) renderPanel(); }
  else if (k === 'sec+') { if (S.secLvl < 5) secXp(SEC_XP[S.secLvl] - S.secXp); }
  else if (k === 'sec-') { S.secLvl = Math.max(1, S.secLvl - 1); S.secXp = SEC_XP[S.secLvl - 1]; for (const s of staff) if (s.type === 'sec') { s.g = 'sleep'; s.chase = null; } }
  else if (k === 'mood+') { for (const s of staff) { s.mood = 100; s.energy = 100; } }
  else if (k === 'mood-') { for (const s of staff) s.mood = 26; }
  else if (k === 'tired') { for (const s of staff) s.energy = 12; }
  else if (k === 'break') { const r = rideList().filter((b) => !b.broken); if (r.length) breakDown(pick(r)); }
  else if (k === 'litter') { for (let i = 0; i < N * N; i++) if (tType[i] === 1 && Math.random() < 0.3) dropLitter(i); }
  else if (k === 'clean') { litter.fill(0); litterTotal = 0; litterDirty = true; }
  else if (k === 'new') { newGame(); devStart(); renderTray(); }
  else if (k === 'land') { const l = []; for (let p = 0; p < PN * PN; p++) l.push(p); landSet(l); }
  else if (k === 'cut') { for (const o of cuts.slice()) finishCut(o); }
  else if (k === 'hide') { const m = $('#dev').classList.toggle('min'); uiPref('dev', !m); sfx('click'); return; }
  uiDirty = true; devPaint(); sfx('click');
}
function devPaint() {
  const set = (k, on) => { const e = document.querySelector('#dev [data-k="' + k + '"]'); if (e) e.setAttribute('aria-pressed', !!on); };
  set('rich', dev.rich); set('fast', dev.fast); set(WX.k, true); for (const k of ['sun', 'cloud', 'rain', 'storm']) if (k !== WX.k) set(k, false);
  setTxt('dev-sec', 'Wachleute Stufe ' + S.secLvl);
}
function devStart() { S.goal = GOALS.length; S.money = Math.max(S.money, 250000); }
function devInit() {
  if (!DEV) return;
  const el = $('#dev'), btn = (k, t) => '<button data-act="dev" data-k="' + k + '">' + t + '</button>';
  el.innerHTML = '<button class="devhead" data-act="dev" data-k="hide" title="Ein- oder ausklappen">Dev-Modus' + IC.chev + '</button><div class="devbody">' +
    '<b>Geld und Fortschritt</b><div>' + btn('cash', '+10.000') + btn('rich', 'Unendlich Geld') + btn('unlock', 'Alles freischalten') + btn('lvl', 'Attraktionen +1 Stufe') + '</div>' +
    '<b>Gäste</b><div>' + btn('guests', '+25 Gäste') + btn('happy', 'Alle glücklich') + btn('litter', 'Abfall streuen') + btn('clean', 'Alles sauber') + '</div>' +
    '<b>Wetter und Zeit</b><div>' + btn('sun', 'Sonne') + btn('cloud', 'Wolken') + btn('rain', 'Regen') + btn('storm', 'Gewitter') + btn('time', '+6 Stunden') + btn('fast', 'Tempo ×10') + '</div>' +
    '<b id="dev-sec">Wachleute</b><div>' + btn('thief', 'Dieb schicken') + btn('sec+', 'Stufe +') + btn('sec-', 'Stufe −') + '</div>' +
    '<b>Personal und Technik</b><div>' + btn('mood+', 'Stimmung 100') + btn('mood-', 'Stimmung 26') + btn('tired', 'Alle müde') + btn('break', 'Panne auslösen') + btn('new', 'Neues Spiel') + '</div>' +
    '<b>Land und Pflanzen</b><div>' + btn('land', 'Ganzes Land freischalten') + btn('cut', 'Markiertes sofort roden') + '</div></div>';
  el.hidden = false; if (uiPref('dev') !== true) el.classList.add('min');   // folded until it is opened; the choice is remembered
  if (!S.devInit) { S.devInit = true; devStart(); }
  devPaint();
}
function devFrame() { if (DEV && dev.rich && S.money < 200000) S.money = 250000; }
