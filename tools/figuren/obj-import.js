// Brings new figure parts into the game: reads OBJ files (with their MTL colours) and writes src/js/26b-figure-import.js.
//   node tools/figuren/obj-import.js <ordner>            the folder holds hoch/<teil>.obj and/or leicht/<teil>.obj
//   node tools/figuren/obj-import.js --leeren            back to the game's own parts
// Then build the game as usual (node build.js) and look at the result in the figure studio (node build.js --studio F).
// A part only in hoch/ is used for both sets. Colours: a vertex colour (v x y z r g b) wins, otherwise the Kd colour of
// the material; white takes the colour of the person (shirt, skin, hair ...), grey gives a darker shade of it.
// Normals come from the file (vn); without them they are computed (smooth, or flat with --flach).
// Needs only Node, no other packages.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../..'), OUT = path.join(ROOT, 'src/js/26b-figure-import.js');
const HEAD = `/* ================= figure parts brought in from outside ================= */
// Parts of the people that were modelled outside the game and brought in with tools/figuren/obj-import.js (see the
// figure package, ANLEITUNG-FIGUREN.md). Each entry takes the place of the built-in part of the same name: "hoch" is the
// smooth set for the people closest to the camera, "leicht" the light set for the crowd; a part that is only given for
// "hoch" is used for both. Each part is a triangle list: positions, normals and vertex colours (r, g, b as bytes),
// base64-coded. This file is written by the tool; as long as it is empty, the game uses its own parts.
`;
const PARTS = ['torso', 'trim', 'zip', 'stripe', 'hoops', 'pelvis', 'thigh', 'shin', 'short', 'shoe', 'sole', 'upper', 'cap', 'forearm', 'wrist', 'hand', 'head', 'eye', 'iris', 'lid', 'brow',
  'cape', 'umb', 'sun', 'stick', 'torch', 'torchGlow', 'plush', 'skirt', 'pack', 'shades', 'mask', 'balloon', 'blob']
  .concat([0, 1, 2, 3, 4].map((i) => 'mouth-' + i), Array.from({ length: 17 }, (_, i) => 'hair-' + i));
const args = process.argv.slice(2), flat = args.includes('--flach');
if (args.includes('--leeren')) { fs.writeFileSync(OUT, HEAD + 'const FIG_IMPORT = { hoch: {}, leicht: {} };\n'); console.log('Leer: das Spiel nutzt wieder seine eigenen Figurenteile.'); process.exit(0); }
const dir = args.find((a) => !a.startsWith('--'));
if (!dir) { console.log('Aufruf: node tools/figuren/obj-import.js <ordner mit hoch/ und leicht/>  (oder --leeren)'); process.exit(1); }
// the templates of the game, for comparing size and detail
let spec = null; for (const f of [path.join(dir, 'figuren-spec.json'), path.join(dir, '..', 'figuren-spec.json'), path.join(ROOT, '..', 'figuren-spec.json'), path.join(ROOT, 'tools/figuren/figuren-spec.json')]) if (fs.existsSync(f)) { spec = JSON.parse(fs.readFileSync(f, 'utf8')); break; }

function readMtl(file) {
  const mats = {}; let cur = null; if (!fs.existsSync(file)) return mats;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const t = line.trim().split(/\s+/);
    if (t[0] === 'newmtl') cur = mats[t.slice(1).join(' ')] = [1, 1, 1];
    else if (t[0] === 'Kd' && cur) { cur[0] = +t[1]; cur[1] = +t[2]; cur[2] = +t[3]; }
  }
  return mats;
}
function readObj(file) {
  const V = [], VC = [], N = [], tri = [], warn = []; let mats = {}, col = null;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const t = line.trim().split(/\s+/);
    if (t[0] === 'v') { V.push([+t[1], +t[2], +t[3]]); VC.push(t.length >= 7 ? [+t[4], +t[5], +t[6]].map((c) => (c > 1 ? c / 255 : c)) : null); }
    else if (t[0] === 'vn') N.push([+t[1], +t[2], +t[3]]);
    else if (t[0] === 'mtllib') mats = Object.assign(mats, readMtl(path.join(path.dirname(file), t.slice(1).join(' '))));
    else if (t[0] === 'usemtl') { col = mats[t.slice(1).join(' ')] || null; if (!col) warn.push('Material ohne Farbe: ' + t.slice(1).join(' ')); }
    else if (t[0] === 'f') {
      const idx = t.slice(1).map((s) => { const q = s.split('/'), vi = +q[0], ni = q[2] ? +q[2] : 0; return { v: vi < 0 ? V.length + vi : vi - 1, n: ni < 0 ? N.length + ni : ni - 1 }; });
      for (let k = 1; k + 1 < idx.length; k++) tri.push([idx[0], idx[k], idx[k + 1]].map((c) => ({ v: c.v, n: c.n, col })));
    }
  }
  // normals that the file does not give: smooth over faces sharing a position, or flat
  const fn = tri.map((f) => { const [a, b, c] = f.map((x) => V[x.v]), u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]; return [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]; });
  const sm = V.map(() => [0, 0, 0]); tri.forEach((f, i) => f.forEach((c) => { for (let a = 0; a < 3; a++) sm[c.v][a] += fn[i][a]; }));
  const unit = (n) => { const l = Math.hypot(n[0], n[1], n[2]) || 1; return [n[0] / l, n[1] / l, n[2] / l]; };
  const p = [], n = [], c = [];
  tri.forEach((f, i) => f.forEach((x) => {
    p.push(...V[x.v]); n.push(...unit(x.n >= 0 && N[x.n] ? N[x.n] : flat ? fn[i] : sm[x.v]));
    const k = VC[x.v] || x.col || [1, 1, 1]; c.push(...k.map((v) => Math.max(0, Math.min(255, Math.round(v * 255)))));
  }));
  return { p, n, c, tris: tri.length, warn };
}
const b64f = (a) => Buffer.from(new Float32Array(a).buffer).toString('base64'), b64b = (a) => Buffer.from(Uint8Array.from(a)).toString('base64');
const res = { hoch: {}, leicht: {} }; let count = 0, problems = 0;
for (const set of ['hoch', 'leicht']) {
  const sd = path.join(dir, set); if (!fs.existsSync(sd)) continue;
  for (const file of fs.readdirSync(sd).filter((f) => f.toLowerCase().endsWith('.obj')).sort()) {
    const name = file.slice(0, -4);
    if (!PARTS.includes(name)) { console.log('  ! ' + set + '/' + file + ': unbekannter Teilname, übersprungen'); problems++; continue; }
    const o = readObj(path.join(sd, file)); if (!o.tris) { console.log('  ! ' + set + '/' + file + ': keine Flächen'); problems++; continue; }
    const notes = o.warn.slice();
    let x0 = 1e9, y0 = 1e9, z0 = 1e9, x1 = -1e9, y1 = -1e9, z1 = -1e9;
    for (let i = 0; i < o.p.length; i += 3) { x0 = Math.min(x0, o.p[i]); x1 = Math.max(x1, o.p[i]); y0 = Math.min(y0, o.p[i + 1]); y1 = Math.max(y1, o.p[i + 1]); z0 = Math.min(z0, o.p[i + 2]); z1 = Math.max(z1, o.p[i + 2]); }
    const ref = spec && spec.teile[name] && (spec.teile[name][set] || spec.teile[name].hoch);
    if (ref) {
      const size = Math.max(x1 - x0, y1 - y0, z1 - z0), rsize = Math.max(...[0, 1, 2].map((a) => ref.max[a] - ref.min[a]));
      if (size > rsize * 1.6 || size < rsize / 1.6) notes.push('Grösse ' + size.toFixed(3) + ' statt etwa ' + rsize.toFixed(3) + ' (Massstab prüfen)');
      const mid = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], rmid = [0, 1, 2].map((a) => (ref.min[a] + ref.max[a]) / 2);
      if (Math.hypot(mid[0] - rmid[0], mid[1] - rmid[1], mid[2] - rmid[2]) > rsize * 0.35) notes.push('Mitte liegt woanders als in der Vorlage (Drehpunkt prüfen)');
      const budget = ref.dreiecke * (set === 'hoch' ? 2 : 1.5);
      if (o.tris > budget) notes.push(o.tris + ' Dreiecke, Vorlage ' + ref.dreiecke + ' (bei vielen Gästen wird es langsam)');
    }
    res[set][name] = { p: b64f(o.p), n: b64f(o.n), c: b64b(o.c) }; count++;
    console.log('  ' + set + '/' + name + ': ' + o.tris + ' Dreiecke' + (notes.length ? '  ! ' + notes.join('; ') : ''));
    if (notes.length) problems++;
  }
}
fs.writeFileSync(OUT, HEAD + 'const FIG_IMPORT = ' + JSON.stringify(res) + ';\n');
console.log(count + ' Teile übernommen' + (problems ? ', ' + problems + ' mit Hinweisen' : '') + '. Jetzt: node build.js (Spiel) und node build.js --studio figuren-studio.html (Prüfen).');
