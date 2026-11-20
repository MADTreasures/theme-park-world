/* ================= catalogue ================= */
const DEFS = {}, ORDER = { path: [], ride: [], shop: [], deco: [], fac: [] };
function def(k, o) { o.k = k; o.w = o.w || 1; o.h = o.h || 1; o.need = o.need || 0; DEFS[k] = o; if (ORDER[o.cat]) ORDER[o.cat].push(k); }
def('path', { cat: 'path', name: 'Weg', cost: 5, model: mPathThumb, info: 'Ziehen, um Wege zu legen. Gäste laufen nur auf Wegen.' });
def('bouncy', { cat: 'ride', name: 'Hüpfburg', w: 2, h: 2, cost: 300, cap: 6, dur: 11, exc: 26, nau: 6, price: 2, upkeep: 24, model: mBouncy, info: 'Sanfter Einstieg für kleine Gäste.' });
def('carousel', { cat: 'ride', name: 'Karussell', w: 3, h: 3, cost: 450, cap: 8, dur: 13, exc: 34, nau: 6, price: 2.5, upkeep: 32, model: mCarousel, info: 'Der Klassiker. Fast alle fahren mit.' });
def('custom', { cat: 'ride', name: 'Eigene Achterbahn', w: 3, h: 1, cost: 2300, from: true, cap: 12, dur: 0, exc: 60, nau: 30, price: 5, upkeep: 60,
  model: () => mCustomCoaster(18, 20, 0, [[23, 20, 1.5], [24, 18, 3], [21, 17, 3.5], [18, 17, 1.5], [16, 18, 2.5], [15, 20, 1]]), info: 'Du legst die Strecke selbst: Station setzen, Punkte antippen, Höhe wählen.' });
def('cups', { cat: 'ride', name: 'Wirbeltassen', w: 3, h: 3, cost: 650, cap: 12, dur: 13, exc: 42, nau: 34, price: 3, upkeep: 40, need: 1, model: mCups, info: 'Dreht sich doppelt. Nichts für volle Bäuche.' });
def('dunk', { cat: 'ride', name: 'Tauchbecken', w: 2, h: 3, cost: 800, cap: 4, dur: 12, exc: 46, nau: 4, price: 3.5, upkeep: 44, need: 2, model: mDunk, info: 'Drei werfen, einer sitzt über dem Wasser. Trifft ein Ball die Scheibe, macht es platsch.' });
def('swing', { cat: 'ride', name: 'Kettenflieger', w: 3, h: 3, cost: 950, cap: 12, dur: 15, exc: 54, nau: 24, price: 4, upkeep: 56, need: 2, model: mSwing, info: 'Sitze an Ketten, hoch über dem Park.' });
def('mini', { cat: 'ride', name: 'Mini-Achterbahn', w: 5, h: 3, cost: 1400, cap: 8, dur: 0, exc: 56, nau: 22, price: 4, upkeep: 60, need: 3, model: mMini, info: 'Fertige kleine Achterbahn: ein Hügel, eine Abfahrt, viel Gekreische.' });
def('ship', { cat: 'ride', name: 'Schiffschaukel', w: 4, h: 2, cost: 1300, cap: 12, dur: 15, exc: 62, nau: 44, price: 4.5, upkeep: 72, need: 4, model: mShip, info: 'Schwingt fast bis in die Senkrechte.' });
def('ghost', { cat: 'ride', name: 'Geisterhaus', w: 4, h: 3, cost: 1900, cap: 8, dur: 16, exc: 64, nau: 8, price: 5, upkeep: 76, need: 4, model: mGhost, info: 'Gäste verschwinden im Dunkeln und kommen kichernd wieder heraus.' });
def('bumper', { cat: 'ride', name: 'Autoscooter', w: 4, h: 3, cost: 1600, cap: 8, dur: 16, exc: 58, nau: 14, price: 4.5, upkeep: 80, need: 5, model: mBumper, info: 'Acht Wagen, ein Ziel: rempeln.' });
def('wheel', { cat: 'ride', name: 'Riesenrad', w: 4, h: 2, cost: 2200, cap: 16, dur: 22, exc: 60, nau: 4, price: 4.5, upkeep: 104, need: 6, model: mWheel, info: 'Ruhige Runde mit Aussicht. Viele Plätze.' });
def('kart', { cat: 'ride', name: 'Gokart', w: 6, h: 4, cost: 2600, cap: 6, dur: 18, exc: 70, nau: 16, price: 5.5, upkeep: 110, need: 7, model: mKart, info: 'Sechs Karts jagen um das Oval.' });
def('tower', { cat: 'ride', name: 'Freifallturm', w: 2, h: 2, cost: 3000, cap: 8, dur: 12, exc: 80, nau: 50, price: 6, upkeep: 136, need: 8, model: mTower, info: 'Langsam hoch, sehr schnell runter.' });
def('tower2', { cat: 'ride', name: 'Himmelsturm', w: 3, h: 3, cost: 5200, cap: 12, dur: 14, exc: 96, nau: 58, price: 7.5, upkeep: 208, need: 11, model: mSkyTower, info: 'Der grosse Freifallturm: 55 Meter hoch, zwölf Plätze, der Ring dreht sich beim Aufstieg.' });
def('flume', { cat: 'ride', name: 'Wildwasserbahn', w: 6, h: 3, cost: 4200, cap: 8, dur: 0, exc: 78, nau: 20, price: 6, upkeep: 176, need: 9, model: mFlume, info: 'Baumstammboote und ein nasser Abgang.' });
def('coaster', { cat: 'ride', name: 'Achterbahn', w: 7, h: 4, cost: 6500, cap: 12, dur: 0, exc: 100, nau: 55, price: 8, upkeep: 260, need: 10, model: mCoaster, info: 'Das Aushängeschild jedes Parks.' });
def('fries', { cat: 'shop', sells: 'food', name: 'Pommesbude', cost: 220, price: 3, fair: 3.2, goods: 1, upkeep: 20, svc: 1.3, model: () => mShop('fries'), info: 'Stillt Hunger, macht aber durstig.' });
def('drink', { cat: 'shop', sells: 'drink', name: 'Limostand', cost: 200, price: 2.5, fair: 2.7, goods: 0.6, upkeep: 20, svc: 1.0, model: () => mShop('drink'), info: 'Löscht Durst. Danach suchen Gäste ein WC.' });
def('wc', { cat: 'shop', sells: 'wc', name: 'Toiletten', cost: 150, price: 0, fair: 0.6, goods: 0, upkeep: 16, svc: 1.2, model: mWC, info: 'Ohne WC kippt die Laune schnell.' });
def('ice', { cat: 'shop', sells: 'treat', name: 'Eisdiele', cost: 260, price: 2.5, fair: 2.8, goods: 0.6, upkeep: 20, svc: 1.0, need: 2, model: () => mShop('ice'), info: 'Kleine Freude für zwischendurch.' });
def('balloon', { cat: 'shop', sells: 'balloon', name: 'Ballonstand', cost: 240, price: 3.5, fair: 3.8, goods: 0.7, upkeep: 16, svc: 1.0, need: 3, model: () => mShop('balloon'), info: 'Ballons heben die Laune sichtbar.' });
def('throw', { cat: 'shop', sells: 'game', name: 'Wurfbude', cost: 280, price: 2.5, fair: 2.8, goods: 0.4, upkeep: 16, svc: 1.6, need: 1, model: () => mShop('throw'), info: 'Dosenwerfen macht Laune. Du kannst hier selbst mitspielen.' });
def('burger', { cat: 'shop', sells: 'food', name: 'Burgerbude', cost: 340, price: 4.5, fair: 4.8, goods: 1.6, upkeep: 24, svc: 1.5, need: 4, model: () => mShop('burger'), info: 'Macht richtig satt und bringt mehr ein.' });
// plants: "cut" is what a gardener charges to remove one
def('tree', { cat: 'deco', name: 'Laubbaum', cost: 15, beauty: 1, rad: 2, plant: true, cut: 20, model: deco1(addTree) });
def('pine', { cat: 'deco', name: 'Tanne', cost: 15, beauty: 1, rad: 2, plant: true, cut: 20, model: deco1(addPine) });
def('palm', { cat: 'deco', name: 'Palme', cost: 25, beauty: 1.2, rad: 2, plant: true, cut: 25, model: deco1(addPalm) });
def('bush', { cat: 'deco', name: 'Busch', cost: 12, beauty: 0.8, rad: 1, plant: true, cut: 10, model: deco1(addBush) });
def('flowers', { cat: 'deco', name: 'Blumenbeet', cost: 20, beauty: 1.6, rad: 2, plant: true, cut: 8, model: deco1(addFlowers) });
def('bench', { cat: 'deco', name: 'Parkbank', cost: 25, beauty: 0.6, rad: 1, model: deco1(addBench) });
def('bin', { cat: 'deco', name: 'Abfalleimer', cost: 15, beauty: 0, rad: 0, bin: true, model: deco1(addBin), info: 'Gäste im Umkreis von 3 Feldern werfen nichts mehr auf den Weg.' });
def('lamp', { cat: 'deco', name: 'Laterne', cost: 30, beauty: 0.8, rad: 2, model: mLamp });
def('fountain', { cat: 'deco', name: 'Springbrunnen', w: 2, h: 2, cost: 260, beauty: 4, rad: 3, need: 3, model: mFountain });
def('breakroom', { cat: 'fac', name: 'Pausenraum', w: 2, h: 1, cost: 320, upkeep: 16, rest: 3, model: mBreak, info: 'Müdes Personal ruht sich hier aus. Platz für drei gleichzeitig.' });
def('house', { cat: 'fac', name: 'Personalhaus', w: 2, h: 2, cost: 600, upkeep: 20, housing: 4, noPath: true, model: mHouse, info: 'Wohnraum für vier Mitarbeitende. Wer ein Zuhause hat, bleibt gern.' });
def('yard', { cat: 'fac', name: 'Bauhof', w: 2, h: 2, cost: 450, upkeep: 18, builders: 3, model: mYard, info: 'Platz für drei weitere Bauarbeiter. Hier lagern sie ihr Werkzeug und warten auf den nächsten Auftrag.' });
def('post', { cat: 'fac', name: 'Wachposten', w: 1, h: 1, cost: 250, upkeep: 12, guards: 2, need: 4, model: mPost, info: 'Platz für zwei Wachleute. Ohne Posten kannst du keine einstellen; hier sitzen sie auf ihren Stühlen und schlafen.' });
const STAFF = {
  jan: { name: 'Reinigungskraft', wage: 60, hire: 50, info: 'Sammelt Abfall von den Wegen.' },
  mech: { name: 'Mechaniker', wage: 100, hire: 80, info: 'Repariert defekte Attraktionen und beugt Pannen vor.' },
  build: { name: 'Bauarbeiter', wage: 60, hire: 70, info: 'Baut neue Attraktionen. Je mehr du einer Baustelle zuweist, desto schneller ist sie fertig. Einer wohnt im Torhaus, jeder Bauhof bietet Platz für drei weitere.' },
  gard: { name: 'Gärtner', wage: 65, hire: 60, info: 'Entfernt Bäume, Büsche und Blumen, die du mit «Abriss» markierst. Jede Pflanze kostet eine Gebühr. Sonst pflegt er das Grün.' },
  ent: { name: 'Maskottchen', wage: 80, hire: 60, info: 'Hebt die Laune aller Gäste in der Nähe.' },
  clown: { name: 'Clown', wage: 70, hire: 60, need: 2, info: 'Geht zur längsten Schlange und unterhält die Wartenden. Sie bleiben länger geduldig.' },
  jug: { name: 'Jongleur', wage: 75, hire: 70, need: 3, info: 'Zeigt Kunststücke. Zuschauer freuen sich und geben Trinkgeld.' },
  sec: { name: 'Sicherheit', wage: 90, hire: 80, need: 4, info: 'Fängt Taschendiebe. Braucht einen freien Platz in einem Wachposten. Wachleute sammeln gemeinsam Erfahrung, mehrere fangen sicherer.' },
};
const fairOf = (d) => (d.cat === 'ride' ? d.exc / 12 : d.fair);
// Attractions gain a level as more guests ride them. Each level adds a little excitement and unlocks extras.
const LVL = [40, 120, 300, 700];
const lvlOf = (b) => { let l = 1; for (const t of LVL) if (b.count >= t) l++; return l; };
const excOf = (b) => b.def.exc * (1 + 0.05 * (lvlOf(b) - 1));
const fairB = (b) => (b.def.cat === 'ride' ? excOf(b) / 12 : b.def.fair);

