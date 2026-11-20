/* ================= economy, rating, goals ================= */
const rideList = () => builds.filter((b) => b.def.cat === 'ride');
const rideTypes = () => new Set(rideList().map((b) => b.k)).size;
const has = (k) => (builds.some((b) => b.k === k) ? 1 : 0);
const GOALS = [
  { t: 'Baue eine zweite Attraktion', r: 200, p: () => rideList().length / 2 },
  { t: 'Habe 15 Gäste gleichzeitig im Park', r: 200, p: () => guests.length / 15 },
  { t: 'Stelle einen Limostand und Toiletten auf', r: 250, p: () => (has('drink') + has('wc')) / 2 },
  { t: 'Stelle eine Reinigungskraft ein und baue einen Pausenraum', r: 300, p: () => (Math.min(1, staffN('jan')) + has('breakroom')) / 2 },
  { t: 'Habe 30 Gäste gleichzeitig im Park', r: 400, p: () => guests.length / 30 },
  { t: 'Betreibe 3 verschiedene Attraktionen', r: 500, p: () => rideTypes() / 3 },
  { t: 'Parkwertung 60 mit mindestens 40 Gästen', r: 600, p: () => Math.min(S.rating / 60, guests.length / 40) },
  { t: 'Stelle einen Mechaniker ein und setze 10 Deko-Objekte', r: 500, p: () => (Math.min(1, staffN('mech')) + Math.min(1, decos.filter((d) => !d.nat).length / 10)) / 2 },
  { t: '5 verschiedene Attraktionen und 70 Gäste', r: 800, p: () => Math.min(rideTypes() / 5, guests.length / 70) },
  { get t() { return 'Spare ' + eur(6000) + ' an'; }, r: 1000, p: () => S.money / 6000 },
  { t: 'Baue ein Riesenrad', r: 800, p: () => has('wheel') },
  { t: '120 Gäste bei Parkwertung 70', r: 1500, p: () => Math.min(guests.length / 120, S.rating / 70) },
  { t: 'Betreibe eine Achterbahn mit Nervenkitzel 100', r: 2000, p: () => rideList().reduce((m, b) => (b.k === 'coaster' || b.k === 'custom' ? Math.max(m, b.def.exc) : m), 0) / 100 },
  { t: '200 Gäste bei Parkwertung 80', r: 3000, p: () => Math.min(guests.length / 200, S.rating / 80) },
  { get t() { return 'Spare ' + eur(30000) + ' an'; }, r: 5000, p: () => S.money / 30000 },
  { t: 'Kaufe 4 Stücke Land dazu', r: 2500, p: () => (plotsOwned() - START_PLOTS.length) / 4 },
  { t: 'Besitze die halbe Insel (18 Stücke Land)', r: 8000, p: () => plotsOwned() / 18 },
  { t: 'Die ganze Insel gehört dir', r: 25000, p: () => plotsOwned() / (PN * PN) },
];
function checkGoal() {
  const g = GOALS[S.goal]; if (!g || g.p() < 1) return;
  S.goal++; earn(g.r, 'bonus'); sfx('goal');
  const news = Object.values(DEFS).filter((d) => d.need === S.goal).map((d) => d.name);
  toast('Ziel ' + S.goal + ' geschafft · +' + eur(g.r) + (news.length ? ' · Neu: ' + news.join(', ') : ''), 'gold');
  if (S.goal === GOALS.length) toast('Alle Ziele geschafft. Die Rummelinsel ist eine Legende!', 'gold');
  uiDirty = true; renderTray();
}
const ADVICE = { wc: 'Viele Gäste suchen ein WC.', food: 'Deine Gäste haben Hunger. Eine Imbissbude fehlt.', drink: 'Deine Gäste haben Durst. Ein Limostand hilft.', money: 'Einigen Gästen sind die Preise zu hoch.',
  queue: 'Die Warteschlangen sind zu lang. Mehr Attraktionen oder ein Clown entlasten.', thief: 'Taschendiebe sind unterwegs. Sicherheitspersonal fängt sie, oder du tippst sie selbst an.', litter: 'Auf den Wegen liegt Abfall. Reinigungskräfte und Abfalleimer helfen.' };
const adviceAt = {};
function advisor() {
  let best = null, n = 3 + guests.length * 0.05;
  for (const k in complaints) { if (complaints[k] > n && S.time - (adviceAt[k] || -999) > 180) { n = complaints[k]; best = k; } complaints[k] = 0; }
  if (best) { adviceAt[best] = S.time; toast(ADVICE[best], 'bad'); return; }
  const sn = staffAll();
  if (sn > housing() && S.time - (adviceAt.house || -999) > 240) { adviceAt.house = S.time; toast('Nicht alle im Team haben ein Zuhause. Ein Personalhaus hebt die Stimmung.', 'bad'); return; }
  if (sn && !builds.some((b) => b.def.rest) && staff.some((s) => s.energy < 15) && S.time - (adviceAt.rest || -999) > 240) { adviceAt.rest = S.time; toast('Dein Personal ist erschöpft. Ein Pausenraum am Weg hilft.', 'bad'); return; }
  if (cuts.length && !staffN('gard') && S.time - (adviceAt.gard || -999) > 150) { adviceAt.gard = S.time; toast('Markierte Pflanzen warten auf einen Gärtner. Stelle einen ein (Personal).', 'bad'); return; }
  if (plotsOwned() < PN * PN && S.time - (adviceAt.land || -999) > 420) {
    let own = 0, free = 0; for (let i = 0; i < N * N; i++) if (owned[i]) { own++; if (tType[i] === 0) free++; }
    if (free < own * 0.22) { adviceAt.land = S.time; toast('Dein Park wird eng. Über «Land» kaufst du neue Flächen dazu, das nächste Stück kostet ' + eur(landPrice()) + '.'); return; }
  }
  const lost = builds.find((b) => !b.def.noPath && !connected(b));
  if (lost && S.time - (adviceAt.lost || -999) > 120) { adviceAt.lost = S.time; toast(lost.def.name + ' hat keinen Weg zum Eingang.', 'bad', lost); }
}
function secondTick() {
  let up = 0; for (const b of builds) up += b.def.upkeep;
  spend(up / DAY, 'upkeep');
  socialTick(); thiefTick(); weatherTick();
  if (S.loan > 0) spend(S.loan * 0.012 / DAY, 'loan');
  let sum = 0;
  for (const g of guests) sum += g.happy;
  const avg = guests.length ? sum / guests.length : 55, clean = 1 - Math.min(1, litterTotal / (pathCount * 0.2 + 2));
  S.rating = lerp(S.rating, 0.55 * avg + 18 * Math.min(1, rideTypes() / 8) + 12 * clean + 0.15 * S.exitAvg, 0.04);
  checkGoal();
  if (++hintT >= 25) { hintT = 0; advisor(); }
}
function simStep(dt) {
  S.time += dt;
  const day = Math.floor(S.time / DAY);
  if (day !== curDay) { curDay = day; fin.yest = fin.today; fin.today = newFin(); }
  spawnTick(dt);
  for (let i = 0; i < guests.length; i++) stepGuest(guests[i], dt);
  if (anyGone) { guests = guests.filter((g) => !g.gone); anyGone = false; colorsDirty = true; if (sel && sel.guest && sel.guest.gone) select(null); }
  for (let i = 0; i < builds.length; i++) stepBuild(builds[i], dt);
  for (let i = staff.length - 1; i >= 0; i--) stepStaff(staff[i], dt);
  if (thieves.length) { let gone = false; for (const f of thieves) { stepThief(f, dt); if (f.gone) gone = true; } if (gone) thieves = thieves.filter((f) => !f.gone); }
  for (const d of animDecos) d.model.update(dt, S.time);
  secAcc += dt; if (secAcc >= 1) { secAcc -= 1; secondTick(); }
}

