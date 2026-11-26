// Writes the figure parts of the game as OBJ files with colours (MTL), a table of all parts (figuren-spec.json) and
// pictures of the figure studio. The OBJ files are the templates for new models: same names, same pivot, same scale.
//   node tools/figuren/vorlagen-export.js <figuren-studio.html> <out-dir>
// Needs Node and Playwright with Chromium (npm i playwright; npx playwright install chromium).
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const [studio, out] = process.argv.slice(2);
if (!studio || !out) { console.log('Aufruf: node tools/figuren/vorlagen-export.js <figuren-studio.html> <zielordner>'); process.exit(1); }
const hex = (r, g, b) => [r, g, b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await (await browser.newContext({ viewport: { width: 1600, height: 900 } })).newPage();
  await p.goto('file://' + path.resolve(studio)); await p.waitForFunction(() => window.__park && window.__park.STU && window.__park.STU.rows.length, null, { timeout: 180000 });
  // every part of both sets as plain arrays: positions, normals, colours of a triangle list
  const sets = await p.evaluate(() => {
    const P = window.__park, res = {};
    for (const [set, G] of [['hoch', P.FGH], ['leicht', P.FGL]]) {
      res[set] = {};
      const add = (name, g) => {
        const geo = g.index ? g.toNonIndexed() : g, a = (n) => (geo.attributes[n] ? Array.from(geo.attributes[n].array) : null);
        res[set][name] = { p: a('position'), n: a('normal'), c: a('color') };
      };
      for (const k in G) { if (Array.isArray(G[k])) G[k].forEach((g, i) => add(k + '-' + i, g)); else if (G[k] && G[k].isBufferGeometry) add(k, G[k]); }
    }
    return { sets: res, FIG: P.FIG, HR: P.HR, HC: P.HC };
  });
  const spec = { einheiten: 'Spieleinheiten; y nach oben, die Figur schaut nach +z; 1 Feld = 1 Einheit', FIG: sets.FIG, HR: sets.HR, HC: sets.HC, teile: {} };
  for (const set of ['hoch', 'leicht']) {
    const dir = path.join(out, 'vorlagen', set); fs.mkdirSync(dir, { recursive: true });
    for (const name of Object.keys(sets.sets[set]).sort()) {
      const d = sets.sets[set][name], nv = d.p.length / 3, keyOf = {}, vs = [], vns = [], faces = {}, cols = new Set();
      let x0 = 1e9, y0 = 1e9, z0 = 1e9, x1 = -1e9, y1 = -1e9, z1 = -1e9;
      const vi = (i) => {
        const c = d.c ? hex(d.c[i * 3], d.c[i * 3 + 1], d.c[i * 3 + 2]) : 'ffffff';
        const k = [0, 1, 2].map((a) => d.p[i * 3 + a].toFixed(5)).join(' ') + '|' + [0, 1, 2].map((a) => d.n[i * 3 + a].toFixed(4)).join(' ') + '|' + c;
        if (keyOf[k] === undefined) { keyOf[k] = vs.length + 1; vs.push([d.p[i * 3], d.p[i * 3 + 1], d.p[i * 3 + 2], c]); vns.push([d.n[i * 3], d.n[i * 3 + 1], d.n[i * 3 + 2]]); }
        x0 = Math.min(x0, d.p[i * 3]); x1 = Math.max(x1, d.p[i * 3]); y0 = Math.min(y0, d.p[i * 3 + 1]); y1 = Math.max(y1, d.p[i * 3 + 1]); z0 = Math.min(z0, d.p[i * 3 + 2]); z1 = Math.max(z1, d.p[i * 3 + 2]);
        return { n: keyOf[k], c };
      };
      for (let t = 0; t < nv; t += 3) { const a = vi(t), b = vi(t + 1), c = vi(t + 2); cols.add(a.c); (faces[a.c] = faces[a.c] || []).push([a.n, b.n, c.n]); }
      const obj = ['# Rummelinsel, Figurenteil "' + name + '" (' + set + '): ' + nv / 3 + ' Dreiecke', '# Einheiten des Spiels, y oben, die Figur schaut nach +z. Drehpunkt (0,0,0) siehe ANLEITUNG-FIGUREN.md.', 'mtllib ' + name + '.mtl', 'o ' + name];
      for (const v of vs) { const c = [0, 2, 4].map((o) => (parseInt(v[3].slice(o, o + 2), 16) / 255).toFixed(4)); obj.push('v ' + v.slice(0, 3).map((x) => x.toFixed(5)).join(' ') + ' ' + c.join(' ')); }
      for (const n of vns) obj.push('vn ' + n.map((x) => x.toFixed(4)).join(' '));
      for (const c of Object.keys(faces)) { obj.push('usemtl farbe_' + c); for (const f of faces[c]) obj.push('f ' + f.map((i) => i + '//' + i).join(' ')); }
      fs.writeFileSync(path.join(dir, name + '.obj'), obj.join('\n') + '\n');
      fs.writeFileSync(path.join(dir, name + '.mtl'), Array.from(cols).map((c) => 'newmtl farbe_' + c + '\nKd ' + [0, 2, 4].map((o) => (parseInt(c.slice(o, o + 2), 16) / 255).toFixed(4)).join(' ') + '\n').join('\n'));
      (spec.teile[name] = spec.teile[name] || {})[set] = { dreiecke: nv / 3, eckpunkte: vs.length, min: [x0, y0, z0].map((v) => +v.toFixed(4)), max: [x1, y1, z1].map((v) => +v.toFixed(4)), farben: Array.from(cols).sort() };
    }
  }
  fs.writeFileSync(path.join(out, 'figuren-spec.json'), JSON.stringify(spec, null, 1));
  // pictures of every row of the studio, in pieces of a few people each, and the whole row
  const bd = path.join(out, 'bilder'); fs.mkdirSync(bd, { recursive: true });
  const rows = await p.evaluate(() => window.__park.STU.rows.map((r) => r.title));
  for (let r = 0; r < rows.length; r++) {
    await p.evaluate((r) => { const b = document.querySelector('[data-act=stuAll]'); b.click(); }, r);
    for (let k = 0; k <= r; k++) await p.click('[data-act=stuRow][data-d="1"]');
    await p.waitForTimeout(1200); await p.screenshot({ path: path.join(bd, 'reihe-' + (r + 1) + '.png') });
    const n = await p.evaluate(() => window.__park.STU.items.filter((i) => i.f && i.row === window.__park.STU.row).length);
    for (let a = 0, part = 1; a < n; a += 5, part++) {
      await p.evaluate(([a, n]) => { const P = window.__park, its = P.STU.items.filter((i) => i.f && i.row === P.STU.row), lo = its[a].f.x, hi = its[Math.min(n, a + 5) - 1].f.x; P.cam.tx = (lo + hi) / 2; P.cam.tz = its[a].f.z; P.cam.dist = P.cam.d = 2.9 + (hi - lo) * 0.38; P.cam.az = P.cam.a = 0.12; P.cam.el = P.cam.e = 0.2; }, [a, n]);
      await p.waitForTimeout(900); await p.screenshot({ path: path.join(bd, 'reihe-' + (r + 1) + '-teil-' + part + '.png') });
    }
  }
  console.log('Vorlagen: ' + Object.keys(spec.teile).length + ' Teile in ' + path.join(out, 'vorlagen') + ', Bilder in ' + bd);
  await browser.close();
})();
