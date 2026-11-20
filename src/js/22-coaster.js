/* ================= self-built coaster ================= */
// The player sets the station and then a chain of points (tile, height). The track is a closed spline through them.
const TDIR = [[1, 0], [0, 1], [-1, 0], [0, -1]], CO = { g: 4.2, fric: 0.05, chain: 1.4, max: 7, brake: 3.2, home: 1.3 };
function coasterPoints(x, y, rot, nodes) {
  const [w, h] = dims(DEFS.custom, rot), cx = x + w / 2 - HALF, cz = y + h / 2 - HALF, d = TDIR[rot];
  const pts = [[cx - d[0] * 1.25, 0.55, cz - d[1] * 1.25], [cx, 0.55, cz], [cx + d[0] * 1.25, 0.55, cz + d[1] * 1.25]];
  for (const n of nodes) pts.push([wX(n[0]), n[2], wZ(n[1])]);
  return { pts, cx, cz, d, w, h };
}
// Gravity speeds the train up and slows it down; a chain keeps it moving wherever it would stall, brakes catch it before the station.
function coasterAdvance(st, dt, curve, len) {
  curve.getTangentAt(((CO.home + st.s) / len) % 1, _tt);
  st.v += (-CO.g * _tt.y - CO.fric * st.v) * dt;
  st.v = clamp(st.v, st.s < 1 ? 0.6 + st.s * 0.8 : CO.chain, CO.max);
  const left = len - st.s; if (left < CO.brake) st.v = Math.min(st.v, 0.8 + 6 * left / CO.brake);
  st.s += st.v * dt; return st.s >= len;
}
function analyseTrack(x, y, rot, nodes) {
  const { pts, w, h } = coasterPoints(x, y, rot, nodes);
  const curve = new T.CatmullRomCurve3(pts.map((p) => new T.Vector3(p[0], p[1], p[2])), true, 'centripetal');
  curve.arcLengthDivisions = 600;
  const len = curve.getLength(), Kn = Math.round(clamp(len * 4, 60, 520)), P = [], low = new Set();
  let maxH = 0, drop = 0, err = '';
  for (let i = 0; i < Kn; i++) P.push(curve.getPointAt(i / Kn));
  for (let i = 0; i < Kn; i++) { const p = P[i], q = P[(i + 1) % Kn]; if (p.y > maxH) maxH = p.y; if (q.y < p.y) drop += p.y - q.y; }
  if (len > 150) err = 'Die Strecke ist zu lang.';
  for (let i = 0; i < Kn && !err; i++) {
    const p = P[i], px = Math.floor(p.x + HALF), py = Math.floor(p.z + HALF);
    if (!inB(px, py)) { err = 'Die Strecke verlässt das Parkgelände.'; break; }
    if (p.y < 0.3) { err = 'Die Strecke taucht in den Boden ein. Setze die Punkte dort höher.'; break; }
    if (px >= x && px < x + w && py >= y && py < y + h) continue;
    const t = idx(px, py), tt = tType[t];
    if (p.y < 1.25) { if (tt === 0 || (tt === 3 && tObj[t].nat)) low.add(t); else err = tt === 1 ? 'Über Wegen muss die Strecke höher liegen (ab 7,5 m).' : 'Hier steht etwas im Weg.'; }
    else if (tt === 2) err = 'Die Strecke führt über ein Gebäude.';
  }
  for (let i = 0; i < Kn && !err; i++) for (let j = i + 10; j < Kn; j++) {
    if (Kn - j + i < 10) break;
    if (P[i].distanceToSquared(P[j]) < 0.09) { err = 'Die Strecke kreuzt sich. Ändere dort die Höhe.'; break; }
  }
  const st = { s: 0, v: 0 }; let vmax = 0, time = 0;
  while (time < 240 && !coasterAdvance(st, 1 / 30, curve, len)) { time += 1 / 30; if (st.v > vmax) vmax = st.v; }
  return { len, maxH, drop, vmax, time, low: Array.from(low), err,
    exc: Math.round(Math.min(150, 20 + 9 * maxH + 2.2 * drop + 0.5 * len + 4 * vmax)), nau: Math.round(clamp(15 + 6 * vmax + 1.5 * drop, 10, 80)),
    cost: Math.round((600 + 150 * len + 120 * maxH) / 10) * 10 };
}
function mCustomCoaster(x, y, rot, nodes) {
  const g = new T.Group(), b = new Builder(), a = analyseTrack(x, y, rot, nodes), { pts, cx, cz, d } = coasterPoints(x, y, rot, nodes);
  const tr = makeTrack(pts.map((p) => [p[0] - cx, p[1], p[2] - cz]), Math.round(clamp(a.len * 8, 120, 640)));
  railInto(b, tr, 0.1, 0, 0.024, K.blue); railInto(b, tr, -0.1, 0, 0.024, K.blue); railInto(b, tr, 0, -0.08, 0.042, K.ink, 6);
  for (let i = 0; i < tr.K; i += 3) { const p = tr.P[i], t = tr.TG[i]; b.box(0.22, 0.022, 0.035, K.inkD, p.x, p.y - 0.035, p.z, { ry: Math.atan2(t.x, t.z) }); }
  for (let i = 4; i < tr.K; i += 9) {
    const p = tr.P[i]; if (p.y < 0.62) continue;
    const gx = Math.floor(p.x + cx + HALF), gy = Math.floor(p.z + cz + HALF);
    if (!inB(gx, gy) || tType[idx(gx, gy)] === 1 || tType[idx(gx, gy)] === 2) continue;
    let ok = true;
    for (let j = 0; j < tr.K; j += 2) { const q = tr.P[j]; if (q.y < p.y - 0.4 && Math.hypot(q.x - p.x, q.z - p.z) < 0.3) { ok = false; break; } }
    if (ok) b.cyl(0.03, 0.03, p.y - 0.1, K.paper, p.x, (p.y - 0.1) / 2, p.z, { seg: 5 });
  }
  const th = Math.atan2(-d[1], d[0]), px = -d[1], pz = d[0];
  b.box(2.96, 0.06, 0.96, K.stoneD, 0, 0.03, 0, { ry: th });
  for (const sd of [-1, 1]) {
    b.box(2.9, 0.34, 0.22, K.stone, px * 0.37 * sd, 0.2, pz * 0.37 * sd, { ry: th });
    for (const e of [-1.38, 0, 1.38]) b.cyl(0.03, 0.03, 1.5, K.paper, d[0] * e + px * 0.45 * sd, 0.75, d[1] * e + pz * 0.45 * sd, { seg: 6 });
    for (let i = 0; i < 10; i++) b.sph(0.04, K.bulb, d[0] * (-1.35 + i * 0.3) + px * 0.54 * sd, 1.5, d[1] * (-1.35 + i * 0.3) + pz * 0.54 * sd, { glow: true, seg: 6, seg2: 4 });
  }
  for (let i = 0; i < 6; i++) b.box(0.5, 0.05, 1.04, i % 2 ? K.paper : K.yel, d[0] * (-1.25 + i * 0.5), 1.52, d[1] * (-1.25 + i * 0.5), { ry: th });
  g.add(b.mesh());
  const cb = new Builder();
  cb.box(0.3, 0.13, 0.4, K.red, 0, 0.07, 0); cb.box(0.3, 0.1, 0.05, K.yel, 0, 0.18, 0.19); cb.box(0.26, 0.16, 0.04, K.yel, 0, 0.2, -0.18); cb.box(0.26, 0.14, 0.04, K.yel, 0, 0.19, 0.01);
  for (const wx of [-0.13, 0.13]) for (const wz of [-0.13, 0.13]) cb.cyl(0.04, 0.04, 0.03, K.inkD, wx, 0, wz, { rz: Math.PI / 2, seg: 8 });
  const car0 = cb.mesh(), cars = [], seats = [], nCars = a.len < 45 ? 3 : a.len < 90 ? 4 : 5;
  for (let i = 0; i < nCars; i++) { const c = i ? car0.clone() : car0; g.add(c); cars.push(c); for (const sz of [0.09, -0.1]) for (const sx of [-0.07, 0.07]) seats.push(seatAt(c, sx, 0.11, sz)); }
  const st = { s: 0, v: 0 }; let running = false, fin = false;
  const pose = () => { for (let i = 0; i < nCars; i++) onTrack(cars[i], tr, (CO.home + st.s - i * 0.46) / tr.len, 0.09); };
  pose();
  const def = Object.assign({}, DEFS.custom, { from: false, cap: nCars * 4, exc: a.exc, nau: a.nau, cost: a.cost, upkeep: Math.round(a.cost * 0.04), price: Math.round(a.exc / 12 * 0.92 * 2) / 2,
    info: 'Selbst gebaut: ' + Math.round(a.len * 5) + ' m lang, ' + Math.round(a.maxH * 5) + ' m hoch, Spitze ' + Math.round(a.vmax * 18) + ' km/h, ' + nCars * 4 + ' Plätze.' });
  return { group: g, seats, def, tiles: a.low, start() { st.s = 0; st.v = 0; running = true; fin = false; }, done() { return fin; }, update(dt) {
    if (!running) return;
    if (coasterAdvance(st, dt, tr.curve, tr.len)) { st.s = 0; running = false; fin = true; }
    pose();
  } };
}

