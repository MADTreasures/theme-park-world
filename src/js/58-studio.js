/* ================= figure studio ================= */
// A stage with every kind of person in the game, in every pose and gesture, for checking figure models (see the figure
// package, ANLEITUNG-FIGUREN.md). It opens instead of the title screen in a page built with "node build.js --studio"
// and in dev.html#figuren. Nothing is simulated and nothing is saved: the people stay where they are put and only their
// bodies move. The view turns, zooms and moves as usual; the buttons jump from row to row and switch day and night.
const STU = { rows: [], row: -1, night: false, spin: [], items: [] };
// one look for everybody, so that only what a row is about differs
const STU_LOOK = { hair: 0, hairCol: 0x6b4423, browCol: 0x4a2f1c, skin: 0xf1c7a0, shirt: 0x3d8bfd, pants: 0x3a4a6b, trim: 0xffffff, shoe: 0xffffff, eye: 0x5b3a1e, top: 0, bottom: 0, pack: 0, shades: 0, cape: 0, sc: 1, hk: 1, kid: false };
function stuGuest(set) {
  const f = { id: uid++, name: '', x: 0, z: 0, rot: 0, rr: 0, sp: 1.2, ph: rnd(TAU), state: 'wander', think: 0, tk: '', chatT: 0, moving: false, happy: 85, nausea: 0, brave: 0.3,
    gone: false, seat: null, target: null, qt: 0, patience: 60, balloon: 0, prize: 0, rides: {}, nRides: 0, cash: 50, hunger: 0, thirst: 0, wc: 0 };
  dress(f, false); Object.assign(f, STU_LOOK, set); f.legs = set && set.legs !== undefined ? set.legs : f.skin;
  guests.push(f); return f;
}
function stuStaff(type, set) {
  const m = mStaff(type); scene.add(m);
  const s = { id: uid++, type, mesh: m, name: '', x: 0, z: 0, rot: 0, rr: 0, sp: 1.3, ph: rnd(TAU), state: 'work', job: null, moving: false, mood: 80, energy: 90, asleep: false, shake: 0,
    chase: null, g: 'awake', alertT: 0, wake: 0, brave: 0, balloon: 0, seat: null, fig: type !== 'ent' };
  if (type !== 'ent') staffLook(s, type);
  Object.assign(s, set); staff.push(s); return s;
}
function stuThief(set) {
  const f = { id: uid++, thief: true, name: '', x: 0, z: 0, rot: 0, rr: 0, sp: 1.25, ph: rnd(TAU), moving: false, state: 'prowl', fy: 0, tum: 0, brave: 0, balloon: 0, gone: false, spotted: false, heldT: 0 };
  dress(f, false);
  Object.assign(f, { shirt: 0xf0f0f0, pants: 0x1c1c22, hair: 11, hairCol: 0x1a1a20, browCol: 0x5a3a22, top: 2, bottom: 0, shades: 0, pack: 0x6b4a2a, trim: 0x25252e, shoe: 0x1c1c22, sc: 1, hk: 1 }, set);
  f.legs = f.skin; thieves.push(f); return f;
}
// a seat for the poses on rides and benches; h is the height of the seat's point above the ground
const MAT_STU = new T.MeshLambertMaterial({ color: 0xd9cfc0 }), MAT_STU_W = new T.MeshLambertMaterial({ color: 0x4cc3f0, transparent: true, opacity: 0.7 });
function stuSeat(f, pose, h, ride, plinth) {
  const s = new T.Object3D(); s.userData.pose = pose; s.userData.h = h; scene.add(s);
  f.state = 'ride'; f.seat = s; f.target = ride || { state: 'idle', spin: 0, def: { exc: 0, grp: '' } }; f.plinth = plinth === undefined ? Math.max(0, h - 0.03) : plinth;
  return f;
}
// the rows of the stage: a title and the people in it, each with its label
function studioRows() {
  const thrill = { state: 'run', spin: 1, def: { exc: 90, grp: 'adr' } }, show = { state: 'run', spin: 1, def: { exc: 40, grp: 'show' } };
  const HAIR_NAMES = ['kurz, Seitenscheitel', 'lang mit Pony', 'Pferdeschwanz', 'Baseballmütze', 'Locken', 'Sonnenhut', 'Bob mit Pony', 'Dutt', 'Tolle', 'Haar unter Mütze', 'Wachmann-Mütze', 'Wollmütze', 'Cowboyhut', 'Partyhut', 'Krone', 'Zauberhut', 'Zylinder'];
  const COLS = [0xff4f64, 0x3d8bfd, 0xffd23f, 0x3ddbb4, 0xff8fc7, 0x8c5cff, 0xf08a24, 0x55c26a];
  return [
    ['Frisuren und Hüte (hair 0 bis 16)', HAIR_NAMES.map((n, i) => [i + ' ' + n, () => stuGuest({ hair: i, shirt: COLS[i % 8], hairCol: i === 3 ? 0xff4f64 : i === 5 ? 0xe8cf8a : i === 13 ? 0x8c5cff : i === 14 ? 0xffd23f : i === 15 ? 0x6f48d6 : i === 16 ? 0x1c1c22 : 0x6b4423, think: 0 })])],
    ['Kleidung (top 0/1/2, bottom 0/1/2) und Zubehör', [
      ['top 0 T-Shirt, bottom 0 Hose', () => stuGuest({ top: 0, bottom: 0 })], ['top 0, bottom 1 Shorts', () => stuGuest({ top: 0, bottom: 1, shirt: 0xff4f64 })], ['top 0, bottom 2 Rock', () => stuGuest({ top: 0, bottom: 2, shirt: 0xffd23f, pants: 0xff8fc7, hair: 1 })],
      ['top 1 ärmellos', () => stuGuest({ top: 1, shirt: 0x3ddbb4 })], ['top 2 Jacke, Shorts', () => stuGuest({ top: 2, bottom: 1, shirt: 0x8c5cff, trim: 0xffd23f })], ['top 2 Jacke, Rock, Leggings', () => stuGuest({ top: 2, bottom: 2, shirt: 0xf08a24, pants: 0x232861, legs: 0x2a2a33, hair: 6 })],
      ['Kind', () => stuGuest({ kid: true, sc: 0.72, hk: 1.13, shirt: 0x55c26a, bottom: 1, hair: 2 })], ['Sonnenbrille', () => stuGuest({ shades: 1, hair: 8 })], ['Rucksack', () => stuGuest({ pack: 0xff4f64, hair: 7 })],
      ['Umhang (Kostüm)', () => stuGuest({ cape: 0xff4f64, top: 2, shirt: 0x3d8bfd, pants: 0x1f3f7a, trim: 0xffd23f })], ['Krone und Umhang', () => stuGuest({ cape: 0xb9243a, shirt: 0xfff6dc, pants: 0x6f48d6, trim: 0xffd23f, top: 2, hair: 14, hairCol: 0xffd23f })],
      ['Influencer mit Selfie-Stick', () => stuGuest({ vip: true, hair: 6, hairCol: 0xff4fa8, browCol: 0xff4fa8, top: 2, shirt: 0xff4fa8, pants: 0xf2f2f2, shoe: 0xff4f64 })],
      ['Ballon', () => stuGuest({ balloon: 0xff4f64 })], ['Plüschtier', () => stuGuest({ prize: 0xb5651d, hair: 4 })],
      ['Regenschirm', () => stuGuest({ umb: 0x3d8bfd, showShade: 1 })], ['Sonnenschirm', () => stuGuest({ sun: 0xff8fc7, showShade: 2 })], ['Taschenlampe', () => stuGuest({ torch: 0xc9a6ff, showTorch: 1 })],
    ]],
    ['Stehen, Gehen, Gesten und Gesichter', [
      ['ruhig stehen', () => stuGuest({})], ['gehen (moving)', () => stuGuest({ moving: true, shirt: 0xff4f64 })], ['Hallo sagen (chatT)', () => stuGuest({ chatT: 99, shirt: 0xffd23f })],
      ['jubeln (tk great)', () => stuGuest({ think: 1.5, tk: 'great', shirt: 0x55c26a })], ['winken (tk bye)', () => stuGuest({ think: 1.5, tk: 'bye', shirt: 0xff8fc7 })], ['Fan (tk fan)', () => stuGuest({ think: 1.5, tk: 'fan', shirt: 0x8c5cff })],
      ['wütend (tk angry)', () => stuGuest({ think: 1.5, tk: 'angry', shirt: 0xf08a24 })], ['übel (tk sick)', () => stuGuest({ think: 1.5, tk: 'sick', shirt: 0x3ddbb4 })], ['Dieb gesehen (tk thief)', () => stuGuest({ think: 1.5, tk: 'thief' })],
      ['hungrig (tk food)', () => stuGuest({ think: 1.5, tk: 'food', shirt: 0xff4f64 })], ['durstig (tk drink)', () => stuGuest({ think: 1.5, tk: 'drink' })], ['zufrieden (tk happy)', () => stuGuest({ think: 1.5, tk: 'happy', shirt: 0xffd23f })],
      ['schlecht gelaunt', () => stuGuest({ happy: 20 })], ['müde vom Warten', () => stuGuest({ state: 'queue', qt: 80, patience: 60 })], ['flau im Magen', () => stuGuest({ nausea: 80 })],
    ]],
    ['Sitzen und Fahren (seat.userData.pose)', [
      ['sitzen', () => stuSeat(stuGuest({}), '', 0.15)], ['essen (eat)', () => stuSeat(stuGuest({ shirt: 0xff4f64 }), 'eat', 0.15)], ['Achterbahn, mutig', () => stuSeat(stuGuest({ brave: 0.9, shirt: 0xffd23f }), '', 0.15, thrill)],
      ['Achterbahn, ängstlich', () => stuSeat(stuGuest({ brave: 0.2, shirt: 0x8c5cff }), '', 0.15, thrill)], ['Show schauen, klatschen', () => stuSeat(stuGuest({ shirt: 0x55c26a }), '', 0.15, show)],
      ['reiten (straddle)', () => stuSeat(stuGuest({ shirt: 0xf08a24 }), 'straddle', 0.3)], ['Trampolin (jump)', () => stuSeat(stuGuest({ shirt: 0x3ddbb4 }), 'jump', 0, null, 0)],
      ['werfen (throw)', () => stuSeat(stuGuest({ shirt: 0xff8fc7 }), 'throw', 0, null, 0)], ['stehend mitfahren (stand)', () => stuSeat(stuGuest({}), 'stand', 0, null, 0)],
      ['Inlineskaten (skate)', () => stuSeat(stuGuest({ shirt: 0xff4f64, bottom: 1 }), 'skate', 0, null, 0)], ['schwimmen (swim)', () => stuSeat(stuGuest({ shirt: 0x3d8bfd, bottom: 1 }), 'swim', 0.08, null, -1)],
    ]],
    ['Personal (type) und ihre Arbeit (job)', [
      ['Reinigung, fegen (jan clean)', () => stuStaff('jan', { job: 'clean' })], ['Mechaniker, repariert (mech fix)', () => stuStaff('mech', { job: 'fix' })], ['Gärtner, schneidet (gard cut)', () => stuStaff('gard', { job: 'cut' })],
      ['Gärtner, giesst (gard water)', () => stuStaff('gard', { job: 'water' })], ['Wachmann (sec)', () => stuStaff('sec', {})], ['Wachmann, jagt (sec chase)', () => stuStaff('sec', { chase: {}, moving: true })],
      ['Wachmann, hält fest (sec hold)', () => stuStaff('sec', { job: 'hold' })], ['Wachmann, schläft am Boden', () => stuStaff('sec', { asleep: true })], ['Wachmann, schläft im Stuhl', () => { const s = stuStaff('sec', { asleep: true }); const o = new T.Object3D(); o.userData.pose = ''; o.userData.h = 0.15; scene.add(o); s.seat = o; s.plinth = 0.12; return s; }],
      ['Bauarbeiter, hämmert (build)', () => stuStaff('build', { job: 'build' })], ['Clown, Show (clown show)', () => stuStaff('clown', { job: 'show' })], ['Jongleur (jug juggle)', () => stuStaff('jug', { job: 'juggle' })],
      ['Maskottchen (ent, eigenes Modell)', () => stuStaff('ent', {})],
    ]],
    ['Taschendieb (thief) in seinen Zuständen', [
      ['schleicht (prowl)', () => stuThief({ moving: true })], ['flieht (flee)', () => stuThief({ state: 'flee', moving: true })], ['gefasst (held)', () => stuThief({ state: 'held' })],
      ['fliegt ins Meer (thrown)', () => { const f = stuThief({ state: 'thrown', fy: 0.75, tum: 0 }); STU.spin.push(f); return f; }],
    ]],
  ];
}
// a label under a person, or the title of a row
function stuLabel(text, x, z, big) {
  const W = big ? 1024 : 512, H = big ? 96 : 72, tex = canvasTex(W, H, (c) => {
    c.font = (big ? '900 52px' : '800 30px') + ' Nunito, system-ui, sans-serif'; c.textAlign = big ? 'left' : 'center'; c.textBaseline = 'middle';
    c.lineJoin = 'round'; c.lineWidth = big ? 10 : 7; c.strokeStyle = '#171a42'; c.fillStyle = big ? '#ffd447' : '#ffffff';
    const lines = big ? [text] : text.length > 18 && text.indexOf(' ') > 0 ? [text.slice(0, text.lastIndexOf(' ', 18) > 0 ? text.lastIndexOf(' ', 18) : 18), text.slice((text.lastIndexOf(' ', 18) > 0 ? text.lastIndexOf(' ', 18) : 18)).trim()] : [text];
    lines.forEach((l, i) => { const y = H / 2 + (i - (lines.length - 1) / 2) * 30; const x0 = big ? 12 : W / 2; c.strokeText(l, x0, y); c.fillText(l, x0, y); });
  });
  const s = new T.Sprite(new T.SpriteMaterial({ map: tex, depthTest: false, transparent: true })); s.center.set(big ? 0 : 0.5, 0.5);
  s.scale.set(big ? 4.4 : 1.0, big ? 0.41 : 0.14, 1); s.position.set(x, big ? 1.2 : 0.02, z); s.renderOrder = 9; overlay.add(s); return s;
}
const STU_DX = 1.05, STU_DZ = 2.1;
function studioStart() {
  // an empty lawn: no paths, buildings or plants in the way; the people stand in rows facing the camera
  for (const o of builds.slice()) removeObj(o); for (const o of decos.slice()) removeObj(o);
  for (let i = 0; i < N * N; i++) if (tType[i] === 1 && i !== ENT) setPath(i, false);
  const all = []; for (let p = 0; p < PN * PN; p++) all.push(p); landSet(all);   // all land, so that nothing is tinted or for sale
  S.muted = true; S.speed = 1; S.time = DAY * 0.3; S.park = 'Figuren-Studio'; curSlot = -1; wxSet('sun', true); WX.t = 1e9; WX.over = WX.wet = WX.bow = 0;
  ui.title = false; $('#title').hidden = true; document.documentElement.classList.remove('tt'); $('#hud').classList.add('studio');
  const rows = studioRows(), z0 = 26 - HALF;
  rows.forEach(([title, items], r) => {
    const z = z0 - r * STU_DZ, x0 = -(items.length - 1) * STU_DX / 2;
    const shown = [stuLabel(title, x0 - 0.4, z, true)];
    items.forEach(([label, make], i) => {
      const f = make(), x = x0 + i * STU_DX; f.x = x; f.z = z; f.name = label;
      if (f.seat) {
        f.seat.position.set(x, f.seat.userData.h, z); f.seat.updateMatrixWorld();
        if (f.plinth > 0) { const b = new T.Mesh(new T.BoxGeometry(0.34, f.plinth, 0.3), MAT_STU); b.position.set(x, f.plinth / 2, z - 0.02); scene.add(b); shown.push(b); }
        else if (f.plinth < 0) { const w = new T.Mesh(new T.CylinderGeometry(0.36, 0.36, 0.2, 20), MAT_STU_W); w.position.set(x, 0.1, z); scene.add(w); shown.push(w); }
      }
      shown.push(stuLabel(label, x, z + 0.42));
      STU.items.push({ f, row: r, list: f.thief ? thieves : f.type ? staff : guests });
    });
    STU.items.push({ row: r, shown });
    STU.rows.push({ title, z, w: items.length * STU_DX });
  });
  colorsDirty = true; uiDirty = true;
  const pn = document.createElement('div'); pn.id = 'studio';
  pn.innerHTML = '<b>Figuren-Studio</b><span id="stu-row">Alle Reihen</span><div class="row"><button class="btn line" data-act="stuRow" data-d="-1">◀</button><button class="btn line" data-act="stuAll">Alle</button><button class="btn line" data-act="stuRow" data-d="1">▶</button><button class="btn" data-act="stuSky">Nacht</button></div><small>Ziehen dreht und verschiebt, Mausrad oder zwei Finger zoomen.</small>';
  $('#app').appendChild(pn);
  studioView(0);
}
// Only the row in view is on the stage; the overview shows all of them.
function studioView(r) {
  STU.row = r;
  guests.length = staff.length = thieves.length = 0;
  for (const it of STU.items) {
    const on = r < 0 || it.row === r;
    if (it.shown) { for (const o of it.shown) o.visible = on; continue; }
    if (on) it.list.push(it.f); else if (it.f.mesh) it.f.mesh.visible = false;
  }
  colorsDirty = true;
  if (r < 0) { cam.tx = 0; cam.tz = (STU.rows[0].z + STU.rows[STU.rows.length - 1].z) / 2; cam.dist = cam.d = 24; cam.az = cam.a = 0.25; cam.el = cam.e = 0.95; $('#stu-row').textContent = 'Alle Reihen'; return; }
  const R = STU.rows[r]; cam.tx = 0; cam.tz = R.z; cam.dist = cam.d = Math.max(6, R.w * 0.78); cam.az = cam.a = 0.1; cam.el = cam.e = 0.32;
  $('#stu-row').textContent = (r + 1) + ' / ' + STU.rows.length + ': ' + R.title;
}
// every frame: time goes on for the bodies; what the game would do over time is held in place
function studioFrame(rdt) {
  S.time += rdt;
  for (const f of STU.spin) f.tum += rdt * 3.2;
  for (const f of guests) { if (f.chatT) f.chatT = 99; if (f.think) f.think = 1.5; }   // a thought lasts 2.8 seconds in the game; held in the middle
}
Object.assign(ACT, {
  stuRow: (el) => { const n = STU.rows.length, r = STU.row < 0 ? (+el.dataset.d > 0 ? 0 : n - 1) : (STU.row + +el.dataset.d + n) % n; studioView(r); },
  stuAll: () => studioView(-1),
  stuSky: (el) => { STU.night = !STU.night; el.textContent = STU.night ? 'Tag' : 'Nacht'; },
});
