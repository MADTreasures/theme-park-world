/* ----- the big wooden coaster: a long lift hill, a steep first drop, airtime hills, all on a lattice of timber ----- */
// The track rests on bents: two posts across the track, tied by cross beams and diagonal braces, and the bents are tied
// to each other along the track as well. That lattice is what makes a wooden coaster look like one. The station is at
// the front of the footprint (+z), where the guests come from the path.
const WOOD_T = 0xc8955c, WOOD_L = 0xdcb07a, WOOD_D = 0x8f6238, STEEL = 0xd5d9e2;
// a straight beam from one point to another, w wide and h thick (w stays level)
function beamInto(b, x0, y0, z0, x1, y1, z1, w, h, col) {
  const dx = x1 - x0, dy = y1 - y0, dz = z1 - z0, L = Math.hypot(dx, dy, dz); if (L < 0.01) return;
  b.box(w, h, L, col, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, { ry: Math.atan2(dx, dz), rx: -Math.asin(clamp(dy / L, -1, 1)) });
}
// the bents under the track and the ties between them
function woodFrameInto(b, tr) {
  const KN = tr.K, every = Math.max(1, Math.round(0.5 / (tr.len / KN))), W = 0.17, bents = [];
  for (let i = 0; i < KN; i += every) {
    const p = tr.P[i], sd = tr.SD[i];
    if (p.y < 0.68) { bents.push(null); continue; }   // at the station the track lies on the platform
    // where a lower part of the track passes underneath, the bent is left out and the lower track runs through the lattice
    let free = true;
    for (let j = 0; j < KN; j += 2) { const q = tr.P[j]; if (q.y < p.y - 0.45 && Math.hypot(q.x - p.x, q.z - p.z) < 0.5) { free = false; break; } }
    if (!free) { bents.push(null); continue; }
    const top = p.y - 0.085, L = [p.x - sd.x * W, p.z - sd.z * W], R = [p.x + sd.x * W, p.z + sd.z * W], lv = [];
    for (let y = 0.45; y < top - 0.22; y += 0.55) lv.push(y);
    for (const q of [L, R]) { beamInto(b, q[0], 0, q[1], q[0], top, q[1], 0.05, 0.05, WOOD_T); b.box(0.1, 0.05, 0.1, K.stoneD, q[0], 0.025, q[1]); }
    beamInto(b, L[0], top, L[1], R[0], top, R[1], 0.05, 0.05, WOOD_D);   // the cap under the track
    let y0 = 0.06;
    lv.forEach((y, k) => {
      beamInto(b, L[0], y, L[1], R[0], y, R[1], 0.032, 0.032, WOOD_L);
      if (k % 2) beamInto(b, L[0], y0, L[1], R[0], y, R[1], 0.026, 0.026, WOOD_L); else beamInto(b, R[0], y0, R[1], L[0], y, L[1], 0.026, 0.026, WOOD_L);
      y0 = y;
    });
    if (top - y0 > 0.2) beamInto(b, L[0], y0, L[1], R[0], top, R[1], 0.026, 0.026, WOOD_L);
    bents.push({ L, R, lv });
  }
  // along the track, on both sides: a stringer at every level both bents share and a brace across every panel
  for (let k = 0; k < bents.length; k++) {
    const a = bents[k], c = bents[(k + 1) % bents.length]; if (!a || !c) continue;
    const n = Math.min(a.lv.length, c.lv.length);
    for (const sd of ['L', 'R']) {
      const p = a[sd], q = c[sd];
      for (let m = 0; m < n; m++) beamInto(b, p[0], a.lv[m], p[1], q[0], c.lv[m], q[1], 0.028, 0.028, WOOD_L);
      for (let m = 0; m + 1 < n; m += 2) beamInto(b, p[0], a.lv[m + (k % 2)], p[1], q[0], c.lv[m + 1 - (k % 2)], q[1], 0.022, 0.022, WOOD_T);
    }
  }
}
// the wooden deck under the steel rails, plank by plank
function woodDeckInto(b, tr) {
  for (let i = 0; i < tr.K; i++) {
    const p = tr.P[i], q = tr.P[(i + 1) % tr.K];
    beamInto(b, p.x, p.y - 0.045, p.z, q.x, q.y - 0.045, q.z, 0.34, 0.04, i % 6 < 3 ? WOOD_D : 0x9c6c40);
  }
}
function mWoodCoaster() {
  const pts = [[-0.3, 0.55, 2.55], [1.4, 0.55, 2.55], [2.9, 0.6, 2.5], [4.3, 0.7, 2.0], [4.75, 0.85, 1.2], [4.1, 1.05, 0.6],   // out of the station and round
    [2.8, 1.7, 0.6], [0.4, 3.1, 0.6], [-2.0, 4.5, 0.6], [-3.2, 5.15, 0.55],                                                          // the lift hill
    [-4.05, 5.3, 0.15], [-4.2, 5.25, -0.7], [-3.6, 5.1, -1.3], [-2.6, 4.55, -1.4], [-1.2, 2.3, -1.4], [0.3, 0.75, -1.4],           // over the top and down
    [1.8, 2.2, -1.4], [3.05, 1.05, -1.45], [4.2, 1.2, -1.65], [4.75, 1.4, -2.35], [4.1, 1.55, -2.95],                               // airtime hill, turn
    [2.6, 2.4, -3.0], [1.2, 1.0, -3.0], [-0.4, 2.0, -3.0], [-1.9, 0.95, -3.0], [-3.4, 1.5, -2.95],                                   // camel hills along the back
    [-4.7, 1.3, -2.55], [-5.1, 1.15, -1.4], [-5.1, 1.2, 0.2], [-4.75, 1.0, 1.5], [-3.7, 0.75, 2.35], [-2.0, 0.58, 2.55]];            // home under the top
  return trackRide({
    pts, K: 520, cars: 5, gap: 0.47,
    seats: [[-0.07, 0.11, 0.09], [0.07, 0.11, 0.09], [-0.07, 0.11, -0.1], [0.07, 0.11, -0.1]],
    base(b, tr) {
      plate(b, 11, 7, LAWN);
      b.box(10.7, 0.03, 0.5, SANDY, 0, 0.07, 3.15);   // gravel along the front
      woodFrameInto(b, tr); woodDeckInto(b, tr);
      railInto(b, tr, 0.1, 0, 0.02, STEEL); railInto(b, tr, -0.1, 0, 0.02, STEEL);
      // the lift: a chain between the rails and a catwalk with a handrail beside it
      const KN = tr.K, i0 = Math.round(tr.uOf(5) * KN), i1 = Math.round(tr.uOf(9) * KN);
      railPart(b, tr, i0, i1, 0, -0.012, 0.014, K.inkD, 4);
      for (let i = i0; i <= i1; i++) { const p = tr.P[i % KN], q = tr.P[(i + 1) % KN], s = tr.SD[i % KN]; beamInto(b, p.x + s.x * 0.28, p.y - 0.06, p.z + s.z * 0.28, q.x + s.x * 0.28, q.y - 0.06, q.z + s.z * 0.28, 0.14, 0.025, WOOD_L); }
      for (let i = i0; i <= i1; i += 5) { const p = tr.P[i % KN], s = tr.SD[i % KN]; b.box(0.022, 0.3, 0.022, WOOD_D, p.x + s.x * 0.34, p.y + 0.09, p.z + s.z * 0.34); }
      railPart(b, tr, i0, i1, 0.34, 0.24, 0.012, WOOD_D, 4);
      // station: platform at the front, a wooden house with a striped gable roof over track and platform
      b.box(3.7, 0.36, 0.46, K.stone, 0.15, 0.18, 3.0); b.box(3.7, 0.3, 0.2, K.stone, 0.15, 0.15, 2.12);
      for (const x of [-1.62, 0.15, 1.92]) for (const z of [2.05, 3.2]) b.box(0.08, 1.46, 0.08, WOOD_D, x, 0.73 + (z > 3 ? 0.18 : 0.15), z);
      for (const z of [2.05, 3.2]) b.box(3.7, 0.08, 0.08, WOOD_D, 0.15, 1.6, z);
      const n = 8, rw = 3.9 / n;
      for (let i = 0; i < n; i++) {
        const x = 0.15 - 1.95 + (i + 0.5) * rw, c = i % 2 ? K.paper : K.redD;
        b.box(rw, 0.05, 0.86, c, x, 1.86, 2.3, { rx: -0.55 }); b.box(rw, 0.05, 0.86, c, x, 1.86, 2.95, { rx: 0.55 });
      }
      b.box(3.96, 0.07, 0.07, WOOD_D, 0.15, 2.1, 2.62);
      for (let i = 0; i < 12; i++) b.sph(0.04, K.bulb, -1.7 + i * 0.335, 1.5, 3.32, { glow: true, seg: 6, seg2: 4 });
      fenceInto(b, -5.3, 3.32, -1.9, 3.32, WOOD_D, 0.24); fenceInto(b, 2.2, 3.32, 5.3, 3.32, WOOD_D, 0.24);
    },
    car(c) {
      c.box(0.32, 0.13, 0.42, K.red, 0, 0.075, 0); c.box(0.335, 0.03, 0.4, K.paper, 0, 0.13, 0);
      c.box(0.3, 0.13, 0.05, K.redD, 0, 0.19, 0.2); c.box(0.28, 0.16, 0.04, 0x6a4428, 0, 0.21, -0.19); c.box(0.28, 0.14, 0.04, 0x6a4428, 0, 0.2, 0.0);
      for (const z of [0.13, -0.06]) c.box(0.26, 0.022, 0.022, STEEL, 0, 0.25, z);
      for (const x of [-0.13, 0.13]) for (const z of [-0.13, 0.13]) c.cyl(0.04, 0.04, 0.03, K.inkD, x, 0, z, { rz: Math.PI / 2, seg: 8 });
    },
  });
}
