/* ================= economy, rating, goals ================= */
const rideList = () => builds.filter((b) => b.def.cat === 'ride' && !b.site);   // an attraction counts once it is built
const rideTypes = () => new Set(rideList().map((b) => b.k)).size;
const has = (k) => (builds.some((b) => b.k === k) ? 1 : 0);
const GOALS = [
  { t: 'Baue eine zweite Attraktion', r: 200, p: () => rideList().length / 2 },
  { t: 'Habe 15 Gäste gleichzeitig im Park', r: 200, p: () => guests.length / 15 },
  { t: 'Stelle einen Limostand und Toiletten auf', r: 250, p: () => (has('drink') + has('wc')) / 2 },
  { t: 'Stelle eine Reinigungskraft ein und baue einen Pausenraum', r: 300, p: () => (Math.min(1, staffN('jan')) + has('breakroom')) / 2 },
  { t: 'Habe 30 Gäste gleichzeitig im Park', r: 400, p: () => guests.length / 30 },
  { t: 'Betreibe 3 verschiedene Attraktionen', r: 500, p: () => rideTypes() / 3 },
  { t: 'Parkruf 60 mit mindestens 40 Gästen', r: 600, p: () => Math.min(S.rating / 60, guests.length / 40) },
  { t: 'Stelle einen Mechaniker ein und setze 10 Deko-Objekte', r: 500, p: () => (Math.min(1, staffN('mech')) + Math.min(1, decos.filter((d) => !d.nat).length / 10)) / 2 },
  { t: '5 verschiedene Attraktionen und 70 Gäste', r: 800, p: () => Math.min(rideTypes() / 5, guests.length / 70) },
  { get t() { return 'Spare ' + eur(6000) + ' an'; }, r: 1000, p: () => S.money / 6000 },
  { t: 'Baue ein Riesenrad', r: 800, p: () => has('wheel') },
  { t: '120 Gäste bei Parkruf 70', r: 1500, p: () => Math.min(guests.length / 120, S.rating / 70) },
  { t: 'Betreibe eine Achterbahn mit Nervenkitzel 100', r: 2000, p: () => rideList().reduce((m, b) => (b.k === 'coaster' || b.k === 'custom' ? Math.max(m, b.def.exc) : m), 0) / 100 },
  { t: '200 Gäste bei Parkruf 80', r: 3000, p: () => Math.min(guests.length / 200, S.rating / 80) },
  { get t() { return 'Spare ' + eur(30000) + ' an'; }, r: 5000, p: () => S.money / 30000 },
  { t: 'Kaufe 4 Stücke Land dazu', r: 2500, p: () => (plotsOwned() - START_PLOTS.length) / 4 },
  { t: 'Besitze die halbe Insel (18 Stücke Land)', r: 8000, p: () => plotsOwned() / 18 },
  { t: 'Die ganze Insel gehört dir', r: 25000, p: () => plotsOwned() / (PN * PN) },
  { t: 'Zeige zwei verschiedene Shows', r: 3000, p: () => new Set(rideList().filter((b) => b.def.grp === 'show').map((b) => b.k)).size / 2 },
  { t: 'Eröffne ein Restaurant, ein Hutgeschäft und ein Kostümgeschäft', r: 4000, p: () => ((builds.some((b) => b.def.dine) ? 1 : 0) + has('hats') + has('costume')) / 3 },
  { t: 'Betreibe 20 verschiedene Attraktionen', r: 15000, p: () => rideTypes() / 20 },
  { t: 'Schalte eine Werbung und lade einen Influencer ein', r: 3000, p: () => (S.adsN ? 0.5 : 0) + (S.vipLast ? 0.5 : 0) },
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
  // break rooms exist, but there are not enough places: several people are worn out and still at work
  if (sn >= 4 && S.time - (adviceAt.rooms || -999) > 300 && builds.some((b) => b.def.rest)) {
    let worn = 0; for (const s of staff) if (s.energy < 8 && s.state === 'work') worn++;
    if (worn >= 3) { adviceAt.rooms = S.time; toast('Mehrere im Team sind erschöpft und finden keinen freien Platz zum Ausruhen. Baue weitere Pausenräume: einer reicht für etwa vier Leute.', 'bad'); return; }
  }
  if (anySite() && !staffN('build') && S.time - (adviceAt.build || -999) > 120) { adviceAt.build = S.time; toast('Auf deiner Baustelle arbeitet niemand. Stelle einen Bauarbeiter ein (Personal).', 'bad'); return; }
  if (cuts.length && !staffN('gard') && S.time - (adviceAt.gard || -999) > 150) { adviceAt.gard = S.time; toast('Markierte Pflanzen warten auf einen Gärtner. Stelle einen ein (Personal).', 'bad'); return; }
  if (plotsOwned() < PN * PN && S.time - (adviceAt.land || -999) > 420) {
    let own = 0, free = 0; for (let i = 0; i < N * N; i++) if (owned[i]) { own++; if (tType[i] === 0) free++; }
    if (free < own * 0.22) { adviceAt.land = S.time; toast('Dein Park wird eng. Über «Land» kaufst du neue Flächen dazu, das nächste Stück kostet ' + eur(landPrice()) + '.'); return; }
  }
  // room for more visitors, money in the till and no advertising running: a reminder now and then
  if (guests.length > 12 && guestCap() < landCap() - 20 && S.money > 1500 && adBoost() < 0.01 && !S.vip && S.time - (adviceAt.ads || -999) > 900 && S.time > DAY * 1.2) {
    adviceAt.ads = S.time; toast('Mehr Besucher? Mit Werbung in Zeitung, Radio, Internet oder Fernsehen kommen mehr Gäste. Tippe hier oder oben auf die Besucherzahl.', '', showAds); return;
  }
  const lost = builds.find((b) => !b.def.noPath && !connected(b));
  if (lost && S.time - (adviceAt.lost || -999) > 120) { adviceAt.lost = S.time; toast(lost.def.name + ' hat keinen Weg zum Eingang.', 'bad', lost); }
}
/* ----- Parkruf: what the guests think of the park (0 to 100), in a word, and where it is heading ----- */
const RUF = { h: [], t: 0 };
function rufReset() { RUF.h.length = 0; RUF.t = 0; }
// change per minute: a straight line through the samples of the last minute, taken every two seconds
function rufSlope() {
  const h = RUF.h, n = h.length; if (n < 8) return 0;
  let sx = 0, sy = 0, sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sx += i; sy += h[i]; sxy += i * h[i]; sxx += i * i; }
  return (n * sxy - sx * sy) / (n * sxx - sx * sx) * 30;
}
const rufWord = (r) => (r >= 85 ? 'Ausgezeichnet' : r >= 65 ? 'Gut' : r >= 50 ? 'Mittel' : r >= 35 ? 'Mässig' : 'Schlecht');
function rufInfo() {
  const r = S.rating, sl = rufSlope(), tr = sl > 1 ? 1 : sl < -1 ? -1 : 0, word = rufWord(r);
  return { r, word, good: r >= 65, trend: tr, arrow: tr > 0 ? '↑' : tr < 0 ? '↓' : '→', text: word + ' ' + (tr > 0 ? '↑ steigend' : tr < 0 ? '↓ sinkend' : '→ stabil') };
}
// Prices may only go up while the park's reputation is good and not falling. Lowering a price is always possible.
function priceLock() {
  const f = rufInfo();
  if (f.trend < 0) return 'Dein Parkruf sinkt. Preiserhöhungen sind momentan gesperrt.';
  if (!f.good) return 'Dein Parkruf ist «' + f.word + '». Preise erhöhen kannst du erst ab «Gut».';
  return '';
}
function secondTick() {
  let up = 0; for (const b of builds) if (!b.site) up += b.def.upkeep;
  spend(up / DAY, 'upkeep');
  socialTick(); thiefTick(); weatherTick(); adTick();
  if (S.loan > 0) spend(S.loan * 0.012 / DAY, 'loan');
  let sum = 0;
  for (const g of guests) sum += g.happy;
  const avg = guests.length ? sum / guests.length : 55, clean = 1 - Math.min(1, litterTotal / (pathCount * 0.2 + 2));
  S.rating = lerp(S.rating, 0.55 * avg + 18 * Math.min(1, rideTypes() / 8) + 12 * clean + 0.15 * S.exitAvg, 0.04);
  if ((RUF.t = (RUF.t + 1) % 2) === 0) { RUF.h.push(S.rating); if (RUF.h.length > 30) RUF.h.shift(); }
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
  stepSites(dt);
  for (let i = staff.length - 1; i >= 0; i--) stepStaff(staff[i], dt);
  if (thieves.length) { let gone = false; for (const f of thieves) { stepThief(f, dt); if (f.gone) gone = true; } if (gone) thieves = thieves.filter((f) => !f.gone); }
  for (const d of animDecos) d.model.update(dt, S.time);
  secAcc += dt; if (secAcc >= 1) { secAcc -= 1; secondTick(); }
}

