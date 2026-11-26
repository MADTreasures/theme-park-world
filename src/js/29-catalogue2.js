/* ================= catalogue, second part: the newer attractions, shows, food and shops ================= */
// grp sorts the cards in the tray: kid, fam (special), crazy, adr (adrenaline), water, show for attractions;
// eat, sweet, rest (restaurants), fun (shops and games) for booths.
// children
def('train', { cat: 'ride', grp: 'kid', name: 'Kindereisenbahn', w: 4, h: 3, cost: 700, cap: 8, dur: 16, exc: 30, nau: 2, price: 2.5, upkeep: 36, need: 1, model: mTrain, info: 'Eine kleine Lok zieht vier Wagen im Kreis, durch den Tunnel und am Wäldchen vorbei.' });
def('tramp', { cat: 'ride', grp: 'kid', name: 'Salto-Trampolin', w: 2, h: 2, cost: 550, cap: 4, dur: 12, exc: 36, nau: 14, price: 2.5, upkeep: 28, need: 1, model: mTramp, info: 'Vier Trampoline. Jeder zweite Sprung wird ein Salto.' });
def('pony', { cat: 'ride', grp: 'kid', name: 'Ponyhof', w: 4, h: 3, cost: 900, cap: 6, dur: 16, exc: 32, nau: 2, price: 2.5, upkeep: 60, need: 2, model: mPony, info: 'Sechs Ponys drehen gemütlich ihre Runden durch die Koppel.' });
def('petting', { cat: 'ride', grp: 'kid', name: 'Streichelzoo', w: 3, h: 3, cost: 650, cap: 8, dur: 14, exc: 28, nau: 0, price: 2, upkeep: 48, need: 2, model: mPetting, info: 'Ziegen, Schafe und Kaninchen zum Anfassen.' });
def('ponyc', { cat: 'ride', grp: 'kid', name: 'Pferde-Achterbahn', w: 5, h: 3, cost: 1500, cap: 8, dur: 0, exc: 44, nau: 12, price: 3.5, upkeep: 56, need: 3, model: mPonyCoaster, info: 'Die erste Achterbahn für Kinder: sanfte Hügel, und die Wagen sind Pferde.' });
// special
def('rest', { cat: 'ride', grp: 'fam', calm: true, name: 'Ruhepark', w: 3, h: 3, cost: 500, cap: 8, dur: 12, exc: 12, nau: 0, price: 0, upkeep: 20, need: 1, beauty: 3, rad: 3, model: mRest, info: 'Bänke am Teich. Wem flau ist, der erholt sich hier, und die Umgebung wird schöner.' });
def('mirror', { cat: 'ride', grp: 'fam', name: 'Spiegellabyrinth', w: 3, h: 3, cost: 1100, cap: 10, dur: 14, exc: 44, nau: 6, price: 3.5, upkeep: 44, need: 3, model: mMirror, info: 'Glas und Spiegel in alle Richtungen. Wer hineingeht, braucht eine Weile wieder heraus.' });
def('skate', { cat: 'ride', grp: 'fam', name: 'Inline-Parcours', w: 5, h: 3, cost: 1200, cap: 8, dur: 16, exc: 48, nau: 8, price: 3.5, upkeep: 40, need: 4, model: mSkate, info: 'Parcoursbahn für Inlineskater: Wellen, Steilkurve und Slalom.' });
def('pump', { cat: 'ride', grp: 'fam', name: 'Pumptrack', w: 5, h: 3, cost: 1300, cap: 6, dur: 15, exc: 52, nau: 10, price: 4, upkeep: 44, need: 5, model: mPump, info: 'Wellen und Anlieger für kleine Räder. Wer richtig pumpt, braucht nicht zu treten.' });
def('cable', { cat: 'ride', grp: 'fam', name: 'Seilbahn', w: 8, h: 2, cost: 2800, cap: 12, dur: 22, exc: 46, nau: 2, price: 3.5, upkeep: 96, need: 7, model: mCable, info: 'Gondeln schweben von der Talstation über zwei Masten und zurück. Die beste Aussicht im Park.' });
def('castle', { cat: 'ride', grp: 'fam', name: 'Schloss Schwanenstein', w: 5, h: 4, cost: 6000, cap: 20, dur: 18, exc: 58, nau: 0, price: 4.5, upkeep: 150, need: 9, beauty: 6, rad: 5, model: mCastle, info: 'Märchenschloss mit fünf Türmen und einem Schwanenteich. Besucher winken vom Balkon, und der ganze Park wirkt schöner.' });
// water
def('splash', { cat: 'ride', grp: 'water', name: 'Wasserpark', w: 3, h: 3, cost: 800, cap: 10, dur: 14, exc: 34, nau: 2, price: 2.5, upkeep: 40, need: 3, model: mSplash, info: 'Fontänen schiessen aus dem Boden, und die Kinder rennen mitten hindurch.' });
def('slide', { cat: 'ride', grp: 'water', name: 'Wasserrutsche', w: 3, h: 4, cost: 1800, cap: 6, dur: 14, exc: 60, nau: 14, price: 4.5, upkeep: 80, need: 5, model: mSlide, info: 'Vom Turm durch drei Kurven ins Becken.' });
def('pool', { cat: 'ride', grp: 'water', name: 'Schwimmbad', w: 5, h: 4, cost: 2400, cap: 14, dur: 18, exc: 46, nau: 2, price: 3.5, upkeep: 110, need: 6, model: mPool, info: 'Grosses Becken mit Rutsche, Sprungbrett und Liegestühlen.' });
def('wcoaster', { cat: 'ride', grp: 'water', name: 'Wasserachterbahn', w: 7, h: 4, cost: 5600, cap: 8, dur: 0, exc: 92, nau: 36, price: 7.5, upkeep: 230, need: 10, model: mWCoaster, info: 'Boote klettern hoch hinauf, stürzen ins Becken und nehmen auf dem Heimweg noch einen Hügel.' });
// crazy
def('octo', { cat: 'ride', grp: 'crazy', name: 'Wilde Krake', w: 3, h: 3, cost: 1700, cap: 10, dur: 15, exc: 66, nau: 40, price: 5, upkeep: 84, need: 5, model: mOcto, info: 'Fünf Arme heben und senken sich, und die Gondeln daran drehen sich auch noch.' });
def('ufo', { cat: 'ride', grp: 'crazy', name: 'Ufo-Wirbel', w: 3, h: 3, cost: 2300, cap: 12, dur: 15, exc: 74, nau: 48, price: 6, upkeep: 100, need: 7, model: mUfo, info: 'Die Scheibe dreht sich erst flach und stellt sich dann fast senkrecht auf.' });
// adrenaline
def('swing2', { cat: 'ride', grp: 'adr', name: 'Hoher Kettenflieger', w: 3, h: 3, cost: 2900, cap: 12, dur: 16, exc: 78, nau: 30, price: 6, upkeep: 120, need: 8, model: () => mSwing(true), info: 'Der Kettenflieger für Mutige: die Krone steigt am Mast doppelt so hoch.' });
def('bungee', { cat: 'ride', grp: 'adr', name: 'Bungee-Jumping', w: 2, h: 2, cost: 2000, cap: 2, dur: 9, exc: 90, nau: 26, price: 7.5, upkeep: 70, need: 8, model: mBungee, info: 'Kopfüber vom Turm, am Gummiseil. Zwei springen nacheinander.' });
def('loop', { cat: 'ride', grp: 'adr', name: 'Überschlag-Schaukel', w: 4, h: 2, cost: 3400, cap: 12, dur: 14, exc: 88, nau: 56, price: 7, upkeep: 150, need: 9, model: () => mShip(true), info: 'Schwingt immer höher und geht dann mehrmals ganz über den Kopf.' });
def('woodie', { cat: 'ride', grp: 'adr', name: 'Grosse Holzachterbahn', w: 11, h: 7, cost: 9800, cap: 20, dur: 0, exc: 112, nau: 58, price: 8.5, upkeep: 320, need: 10, model: mWoodCoaster, info: 'Die Riesin aus Holz: 26 Meter Lifthügel, eine steile erste Abfahrt und Luftzeit auf den Hügeln. Das ganze Gerüst ist gezimmert, und es rumpelt herrlich.' });
// shows
def('magic', { cat: 'ride', grp: 'show', name: 'Zaubershow', w: 4, h: 3, cost: 1500, cap: 14, dur: 18, exc: 42, nau: 0, price: 3.5, upkeep: 70, need: 3, model: mMagic, info: 'Ein Zauberer, ein Zylinder, ein Kaninchen. Das Publikum sitzt auf der Tribüne.' });
def('animals', { cat: 'ride', grp: 'show', name: 'Tiershow', w: 4, h: 4, cost: 1900, cap: 16, dur: 18, exc: 46, nau: 0, price: 3.5, upkeep: 100, need: 4, model: mAnimals, info: 'Zwei Hunde springen durch den Reifen, ein Seehund balanciert den Ball.' });
def('freak', { cat: 'ride', grp: 'show', name: 'Freakshow', w: 4, h: 3, cost: 1700, cap: 12, dur: 16, exc: 50, nau: 4, price: 4, upkeep: 64, need: 5, model: mFreak, info: 'Der stärkste Mann der Insel, Fackeln und eine Kristallkugel.' });
def('dolphin', { cat: 'ride', grp: 'show', name: 'Delfinshow', w: 5, h: 4, cost: 4200, cap: 18, dur: 20, exc: 54, nau: 0, price: 4.5, upkeep: 150, need: 7, model: () => mSeaShow(false), info: 'Zwei Delfine springen durch die Reifen.' });
def('circus', { cat: 'ride', grp: 'show', name: 'Zirkus', w: 5, h: 5, cost: 7500, cap: 30, dur: 22, exc: 62, nau: 0, price: 5, upkeep: 180, need: 8, model: mCircus, info: 'Das grosse Zelt: dreissig Plätze pro Vorstellung.' });
def('orca', { cat: 'ride', grp: 'show', name: 'Orca-Show', w: 6, h: 4, cost: 6500, cap: 22, dur: 20, exc: 60, nau: 0, price: 5, upkeep: 200, need: 9, model: () => mSeaShow(true), info: 'Der Orca springt in voller Länge aus dem Wasser. Die vorderen Reihen werden nass.' });
// food stalls
def('wurst', { cat: 'shop', grp: 'eat', sells: 'food', name: 'Wurstbude', cost: 240, price: 3.5, fair: 3.7, goods: 1.2, upkeep: 20, svc: 1.3, need: 1, model: () => mShop('wurst'), info: 'Bratwurst im Brötchen, mit Senf.' });
def('doener', { cat: 'shop', grp: 'eat', sells: 'food', name: 'Dönerbude', cost: 360, price: 5, fair: 5.3, goods: 1.8, upkeep: 24, svc: 1.5, need: 5, model: () => mShop('doener'), info: 'Frisch vom Spiess. Macht lange satt.' });
def('brezel', { cat: 'shop', grp: 'sweet', sells: 'treat', name: 'Brezelbude', cost: 200, price: 2.5, fair: 2.7, goods: 0.5, upkeep: 16, svc: 1.0, need: 1, model: () => mShop('brezel'), info: 'Etwas Kleines auf die Hand.' });
def('candy', { cat: 'shop', grp: 'sweet', sells: 'treat', name: 'Süssigkeitenbude', cost: 240, price: 2.5, fair: 2.7, goods: 0.5, upkeep: 18, svc: 1.0, need: 2, model: () => mShop('candy'), info: 'Lutscher und Bonbons in allen Farben.' });
def('cotton', { cat: 'shop', grp: 'sweet', sells: 'treat', name: 'Zuckerwattebude', cost: 230, price: 2.5, fair: 2.8, goods: 0.4, upkeep: 18, svc: 1.1, need: 2, model: () => mShop('cotton'), info: 'Rosa Wolken am Stiel.' });
def('marroni', { cat: 'shop', grp: 'sweet', sells: 'treat', name: 'Marronistand', cost: 220, price: 3, fair: 3.2, goods: 0.7, upkeep: 18, svc: 1.1, need: 3, model: () => mShop('marroni'), info: 'Heisse Marroni aus der Pfanne.' });
// restaurants: guests sit down at a table
def('pizza', { cat: 'shop', grp: 'rest', sells: 'food', dine: 9, name: 'Pizzarestaurant', w: 3, h: 2, cost: 1400, price: 8, fair: 8.5, goods: 3, upkeep: 70, svc: 1.0, need: 4, model: () => mRestaurant('pizza'), info: 'Gäste setzen sich an die Tische. Ein Essen macht ganz satt, stillt auch den Durst und hebt die Laune.' });
def('vegan', { cat: 'shop', grp: 'rest', sells: 'food', dine: 9, name: 'Veganes Restaurant', w: 3, h: 2, cost: 1300, price: 7.5, fair: 8, goods: 2.6, upkeep: 64, svc: 1.0, need: 5, model: () => mRestaurant('vegan'), info: 'Frisch vom Feld auf den Teller. Gäste essen am Tisch.' });
def('fish', { cat: 'shop', grp: 'rest', sells: 'food', dine: 10, name: 'Fischrestaurant', w: 3, h: 2, cost: 1800, price: 10, fair: 10.5, goods: 4, upkeep: 84, svc: 1.0, need: 7, model: () => mRestaurant('fish'), info: 'Fisch vom Grill, serviert unter blauen Sonnenschirmen.' });
def('steak', { cat: 'shop', grp: 'rest', sells: 'food', dine: 11, name: 'Steakhouse', w: 3, h: 2, cost: 2200, price: 12, fair: 12.5, goods: 5, upkeep: 100, svc: 1.0, need: 8, model: () => mRestaurant('steak'), info: 'Das teuerste Essen im Park, und das beliebteste bei Gästen mit vollem Geldbeutel.' });
// shops and games
def('hats', { cat: 'shop', grp: 'fun', sells: 'hat', name: 'Hutgeschäft', w: 2, h: 1, cost: 500, price: 6, fair: 6.5, goods: 2, upkeep: 28, svc: 1.6, need: 4, model: () => mStore('hat'), info: 'Cowboyhut, Partyhut, Krone, Zauberhut oder Zylinder: Wer hier einkauft, trägt den Hut den ganzen Tag.' });
def('costume', { cat: 'shop', grp: 'fun', sells: 'costume', name: 'Kostümgeschäft', w: 2, h: 1, cost: 700, price: 9, fair: 9.5, goods: 3.5, upkeep: 32, svc: 2, need: 6, model: () => mStore('costume'), info: 'Gäste verlassen den Laden als Superheldin, König, Zauberer oder Cowboy.' });
def('lukas', { cat: 'shop', grp: 'fun', sells: 'game', prize: 0.28, name: 'Hau den Lukas', cost: 320, price: 3, fair: 3.2, goods: 0.6, upkeep: 16, svc: 1.8, need: 2, model: mLukas, info: 'Wer die Glocke trifft, gewinnt ein Plüschtier. Du kannst hier selbst zuschlagen.' });
def('umbrella', { cat: 'shop', grp: 'fun', sells: 'umbrella', name: 'Regenschirmstand', cost: 260, price: 4, fair: 4.3, goods: 1.5, upkeep: 16, svc: 1.2, need: 2, model: () => mShop('umbrella'), info: 'Bei Regen kaufen Gäste hier einen Schirm. Wer einen hat, bleibt trocken und gut gelaunt und geht nicht früher heim. Mit einem Stand im Park kommen auch bei Regen mehr Gäste.' });
def('parasol', { cat: 'shop', grp: 'fun', sells: 'parasol', name: 'Sonnenschirmstand', cost: 260, price: 4, fair: 4.3, goods: 1.4, upkeep: 16, svc: 1.2, need: 2, model: () => mShop('parasol'), info: 'Bei Sonnenschein kaufen Gäste einen Sonnenschirm. Im Schatten sind sie besser gelaunt und bekommen langsamer Durst.' });
def('torch', { cat: 'shop', grp: 'fun', sells: 'torch', name: 'Geister-Taschenlampen', cost: 320, price: 4, fair: 4.5, goods: 1.4, upkeep: 18, svc: 1.2, need: 2, model: () => mShop('torch'), info: 'Nachts kaufen Gäste hier leuchtende Geister-Taschenlampen und leuchten sich damit durch den dunklen Park. Tagsüber hat kaum jemand Bedarf.' });
const TORCH_COLS = [0xb7ff7a, 0xc9a6ff, 0x8fe9ff, 0xfff07a, 0xff9ad5];
const UMB_COLS = [0xff4f64, 0x3d8bfd, 0xffd23f, 0x3ddbb4, 0x8c5cff, 0x2b2b33, 0xff8fc7], SUN_COLS = [0xfff6dc, 0xff8fc7, 0xffd23f, 0x9fe0ff, 0xffb347, 0x9be7c4];
// the existing ones get their groups, and the can toss its prizes
Object.assign(DEFS.throw, { name: 'Büchsenwerfen', prize: 0.3, goods: 0.6, info: 'Wer alle Büchsen abräumt, gewinnt ein Plüschtier. Du kannst hier selbst mitspielen.' });
{
  const G = { bouncy: 'kid', carousel: 'kid', custom: 'adr', cups: 'crazy', dunk: 'fam', swing: 'fam', mini: 'kid', ship: 'crazy', ghost: 'fam', bumper: 'crazy', wheel: 'fam', kart: 'adr', tower: 'adr', tower2: 'adr', flume: 'water', coaster: 'adr',
    fries: 'eat', drink: 'eat', wc: 'eat', burger: 'eat', ice: 'sweet', balloon: 'fun', throw: 'fun' };
  for (const k in G) DEFS[k].grp = G[k];
  // in the tray: what unlocks first comes first
  for (const t of ['ride', 'shop']) ORDER[t].sort((a, b) => DEFS[a].need - DEFS[b].need || DEFS[a].cost - DEFS[b].cost);
}
const GROUPS = {
  ride: [['', 'Alle'], ['kid', 'Kinder'], ['fam', 'Spezial'], ['crazy', 'Crazy'], ['adr', 'Adrenalin'], ['water', 'Wasser'], ['show', 'Shows']],
  shop: [['', 'Alle'], ['eat', 'Imbiss'], ['sweet', 'Süsses'], ['rest', 'Restaurants'], ['fun', 'Läden & Spiele']],
};
// hats that the hat shop sells, with the colours they come in; soft toys to win; costumes
const HAT_SHOP = [[12, [0x9b6a4a, 0x5a4636, 0xe8cf8a]], [13, [0xff4f64, 0x3d8bfd, 0xffd23f, 0x3ddbb4, 0xff8fc7]], [14, [0xffd23f]], [15, [0x6f48d6, 0x3d5fd0, 0x1c1c22]], [16, [0x1c1c22, 0x3a2f5a]], [5, [0xe8cf8a, 0xfff6dc, 0xff8fc7]], [3, [0xff4f64, 0x3d8bfd, 0x3ddbb4]]];
const PLUSH = [0xb5651d, 0xff8fc7, 0xffffff, 0x9fd8ff, 0xffd23f, 0x8a6a4a];
const COSTUMES = [
  { cape: 0xff4f64, shirt: 0x3d8bfd, pants: 0x1f3f7a, trim: 0xffd23f, top: 2, bottom: 0 },                       // superhero
  { cape: 0xb9243a, shirt: 0xfff6dc, pants: 0x6f48d6, trim: 0xffd23f, top: 2, bottom: 0, hair: 14, hairCol: 0xffd23f },   // king or queen (trousers: a skirt would push through the cape)
  { cape: 0x6f48d6, shirt: 0x3a2f5a, pants: 0x2a2350, trim: 0xffd23f, top: 2, bottom: 0, hair: 15, hairCol: 0x6f48d6 },   // wizard
  { shirt: 0xc8a96a, pants: 0x4f6fb0, trim: 0xb9243a, top: 0, bottom: 0, hair: 12, hairCol: 0x9b6a4a },            // cowboy
  { cape: 0x1c1c22, shirt: 0xb9243a, pants: 0x1c1c22, trim: 0xffffff, top: 2, bottom: 0, hair: 16, hairCol: 0x1c1c22 },   // magician
];
function wearCostume(g) {
  const c = pick(COSTUMES); g.cape = c.cape || 0; g.shirt = c.shirt; g.pants = c.pants; g.trim = c.trim; g.top = c.top; if (c.bottom !== undefined) g.bottom = c.bottom;
  if (c.hair) { g.hair = c.hair; g.hairCol = c.hairCol; }
  g.pack = 0; g.legs = g.skin; g.costume = 1; colorsDirty = true;
}
function wearHat(g) { const h = pick(HAT_SHOP); g.hair = h[0]; g.hairCol = pick(h[1]); g.hat = 1; colorsDirty = true; }
