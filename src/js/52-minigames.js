/* ================= mini games ================= */
// Three small games the player can step into: can toss at the Wurfbude, ghost hunt in the Geisterhaus, a kart dash at the Gokart.
// The park pauses while one is open. Prize money is paid once per day and attraction.
let mini = null;
const MINI = {
  cans: { title: 'Büchsenwerfen', help: 'Tippe auf die Büchsen, bevor sie weiterwandern. Ab 10 Treffern gewinnst du ein Plüschtier.', unit: 'Treffer', pay: 2, max: 60, plush: 10 },
  lukas: { title: 'Hau den Lukas', help: 'Tippe, wenn der Zeiger im grünen Feld steht. Je genauer, desto höher steigt der Puck. Ab 3 Glockenschlägen gewinnst du ein Plüschtier.', unit: 'Glockenschläge', pay: 6, max: 90, plush: 3 },
  ghosts: { title: 'Geisterjagd', help: 'Tippe die Geister an. Fledermäuse kosten einen Punkt.', unit: 'Geister', pay: 3, max: 80 },
  kart: { title: 'Kart-Rennen', help: 'Tippe links oder rechts, um die Spur zu wechseln. Sammle Münzen, weiche den Hütchen aus.', unit: 'Münzen', pay: 3, max: 90 },
  dunk: { title: 'Tauchbecken', help: 'Tippe auf die wandernde Zielscheibe. Bei einem Treffer plumpst der Sitzende ins Wasser.', unit: 'Treffer', pay: 4, max: 80 },
};
function openMini(kind, b) {
  const m = MINI[kind];
  modal('<h2>' + m.title + '</h2><p class="note">' + m.help + '</p><canvas id="mini-cv" width="320" height="380"></canvas>' +
    '<div class="minibar"><b id="mini-score">0 ' + m.unit + '</b><span id="mini-time">30 s</span></div><div class="row" id="mini-end" hidden></div>');
  ui.onClose = () => { mini = null; ui.mini = false; };
  ui.mini = true;
  const cv = $('#mini-cv'), coin = new Image(); coin.src = CUR.img;
  mini = { kind, b, m, cv, c: cv.getContext('2d'), t: 30, score: 0, last: performance.now(), over: false, coin, clock: 0, flash: 0,
    shelves: [0, 1, 2].map((i) => ({ y: 95 + i * 82, off: rnd(60), v: (40 + i * 22) * (i % 2 ? -1 : 1), cans: [0, 1, 2, 3].map(() => ({ down: 0 })) })), balls: [],
    win: Array.from({ length: 9 }, () => ({ k: 0, t: 0, hit: 0 })), spawn: 0.4,
    lane: 1, kx: 160, things: [], next: 0.5, road: 0, tgt: { x: 160, v: 105 }, dunkT: 0,
    mk: 0.1, mv: 0.9, md: 1, puck: 0, pv: 0, cool: 0, swing: 0, rung: 0, pow: 0 };
  cv.addEventListener('pointerdown', (e) => { const r = cv.getBoundingClientRect(); miniTap((e.clientX - r.left) * 320 / r.width, (e.clientY - r.top) * 380 / r.height); e.preventDefault(); });
  requestAnimationFrame(miniFrame);
}
function miniTap(x, y) {
  const g = mini; if (!g || g.over) return;
  if (g.kind === 'lukas') {   // the nearer the pointer is to the middle, the harder the blow
    if (g.cool > 0) return;
    g.pow = clamp(1 - Math.abs(g.mk - 0.5) * 1.6, 0.12, 1); g.pv = Math.sqrt(2 * 3.2 * Math.min(1.06, g.pow * 1.1)); g.cool = 1.15; g.swing = 0.22; sfx('hammer'); return;
  }
  if (g.kind === 'cans' || g.kind === 'dunk') { g.balls.push({ x, y, t: 0 }); sfx('path'); }
  else if (g.kind === 'ghosts') {
    for (let i = 0; i < 9; i++) { const w = g.win[i], wx_ = 60 + (i % 3) * 100, wy = 85 + ((i / 3) | 0) * 100; if (w.k && !w.hit && Math.abs(x - wx_) < 42 && Math.abs(y - wy) < 46) { if (w.k === 1) { g.score++; sfx('build'); } else { g.score = Math.max(0, g.score - 1); g.flash = 0.3; sfx('error'); } w.hit = 0.25; return; } }
  } else miniLane(x < 160 ? -1 : 1);
}
function miniLane(d) { const g = mini; if (!g || g.over || g.kind !== 'kart') return; g.lane = clamp(g.lane + d, 0, 2); sfx('click'); }
function miniOver() {
  const g = mini; g.over = true;
  const first = g.b && g.b.miniDay !== curDay, prize = first ? Math.min(g.m.max, g.score * g.m.pay) : 0, toy = !!g.m.plush && g.score >= g.m.plush;
  if (first) { g.b.miniDay = curDay; if (prize) earn(prize, 'bonus'); uiDirty = true; }
  if (toy) { S.plush = (S.plush || 0) + 1; g.toy = true; }
  const end = $('#mini-end'); end.hidden = false;
  end.innerHTML = '<p class="note" style="flex:1 1 100%;margin:0">' + g.score + ' ' + g.m.unit + (first ? ' · Preisgeld ' + eur(prize) : ' · Preisgeld gibt es einmal pro Tag') + (toy ? '<br><b>Gewonnen: ein Plüschtier!</b> In deiner Sammlung: ' + S.plush : g.m.plush ? '<br>Ein Plüschtier gibt es ab ' + g.m.plush + ' ' + g.m.unit + '.' : '') + '</p><button class="btn" data-act="miniAgain">Nochmal</button><button class="btn line" data-act="closeModal">Zurück in den Park</button>';
  sfx(prize ? 'goal' : 'click');
}
function miniFrame(now) {
  const g = mini; if (!g) return;
  const dt = Math.min(0.05, (now - g.last) / 1000); g.last = now;
  if (!g.over) { g.t -= dt; g.clock += dt; if (g.flash > 0) g.flash -= dt; miniStep(g, dt); if (g.t <= 0) { g.t = 0; miniOver(); } }
  miniDraw(g);
  setTxt('mini-score', g.score + ' ' + g.m.unit); setTxt('mini-time', Math.ceil(g.t) + ' s');
  requestAnimationFrame(miniFrame);
}
function miniStep(g, dt) {
  if (g.kind === 'lukas') {
    g.mk += g.mv * g.md * dt; if (g.mk > 1 || g.mk < 0) { g.md = -g.md; g.mk = clamp(g.mk, 0, 1); }
    if (g.cool > 0) g.cool -= dt; if (g.swing > 0) g.swing -= dt; if (g.rung > 0) g.rung -= dt;
    if (g.pv || g.puck > 0) {
      g.puck += g.pv * dt; g.pv -= 3.2 * dt;
      if (g.puck >= 1) { g.puck = 1; if (g.pv > 0) { g.pv = -0.4; g.score++; g.rung = 0.7; g.mv *= 1.13; sfx('bell'); } }
      if (g.puck <= 0) { g.puck = 0; g.pv = 0; }
    }
    return;
  }
  if (g.kind === 'cans') {
    for (const s of g.shelves) { s.off += s.v * dt; if (s.off > 70 || s.off < 0) { s.v = -s.v; s.off = clamp(s.off, 0, 70); } for (const cn of s.cans) if (cn.down > 0) cn.down -= dt; }
    for (const bl of g.balls) {
      bl.t += dt * 3.6;
      if (bl.t >= 1 && !bl.done) { bl.done = true; for (const s of g.shelves) s.cans.forEach((cn, i) => { const cx = 45 + i * 62 + s.off; if (cn.down <= 0 && Math.abs(bl.x - cx) < 20 && Math.abs(bl.y - (s.y - 24)) < 28) { cn.down = 1.6; g.score++; sfx('build'); } }); }
    }
    g.balls = g.balls.filter((bl) => bl.t < 1.4);
  } else if (g.kind === 'dunk') {
    const tg = g.tgt; tg.x += tg.v * dt; if (tg.x > 272 || tg.x < 48) { tg.v = -tg.v; tg.x = clamp(tg.x, 48, 272); }
    if (g.dunkT > 0) g.dunkT -= dt;
    for (const bl of g.balls) { bl.t += dt * 3.2; if (bl.t >= 1 && !bl.done) { bl.done = true; if (Math.hypot(bl.x - tg.x, bl.y - 262) < 27 && g.dunkT <= 0) { g.score++; g.dunkT = 1.5; tg.v *= 1.12; sfx('splash'); } } }
    g.balls = g.balls.filter((bl) => bl.t < 1.3);
  } else if (g.kind === 'ghosts') {
    g.spawn -= dt;
    if (g.spawn <= 0) { g.spawn = lerp(0.35, 0.6, g.t / 30); const free = g.win.filter((w) => !w.k); if (free.length) { const w = pick(free); w.k = Math.random() < 0.8 ? 1 : 2; w.t = lerp(0.8, 1.3, g.t / 30); w.hit = 0; } }
    for (const w of g.win) { if (!w.k) continue; if (w.hit > 0) { w.hit -= dt; if (w.hit <= 0) w.k = 0; } else { w.t -= dt; if (w.t <= 0) w.k = 0; } }
  } else {
    const sp = lerp(330, 190, g.t / 30); g.road += sp * dt; g.kx = lerp(g.kx, 80 + g.lane * 80, 1 - Math.exp(-dt * 16));
    g.next -= dt;
    if (g.next <= 0) { g.next = lerp(0.36, 0.62, g.t / 30); g.things.push({ lane: rint(0, 2), y: -30, coin: Math.random() < 0.55 }); }
    for (const th of g.things) {
      th.y += sp * dt;
      if (!th.gone && th.y > 296 && th.y < 348 && th.lane === g.lane) { th.gone = true; if (th.coin) { g.score++; sfx('path'); } else { g.score = Math.max(0, g.score - 2); g.flash = 0.35; sfx('error'); } }
    }
    g.things = g.things.filter((th) => th.y < 420 && !th.gone);
  }
}
// a soft toy for the canvas games: drawn where a prize is shown
function drawTeddy(c, x, y, s, col) {
  c.fillStyle = col; c.beginPath(); c.ellipse(x, y + 16 * s, 15 * s, 18 * s, 0, 0, TAU); c.fill(); c.beginPath(); c.arc(x, y - 8 * s, 13 * s, 0, TAU); c.fill();
  for (const d of [-1, 1]) { c.beginPath(); c.arc(x + d * 10 * s, y - 19 * s, 5 * s, 0, TAU); c.fill(); c.beginPath(); c.arc(x + d * 15 * s, y + 8 * s, 6 * s, 0, TAU); c.fill(); c.beginPath(); c.arc(x + d * 9 * s, y + 31 * s, 7 * s, 0, TAU); c.fill(); }
  c.fillStyle = '#fff6dc'; c.beginPath(); c.ellipse(x, y - 4 * s, 6 * s, 5 * s, 0, 0, TAU); c.fill(); c.beginPath(); c.ellipse(x, y + 18 * s, 8 * s, 10 * s, 0, 0, TAU); c.fill();
  c.fillStyle = '#232861'; for (const d of [-1, 1]) { c.beginPath(); c.arc(x + d * 5 * s, y - 11 * s, 1.8 * s, 0, TAU); c.fill(); } c.beginPath(); c.arc(x, y - 5 * s, 2 * s, 0, TAU); c.fill();
}
function drawLukas(g, c) {
  c.fillStyle = '#8fd3ff'; c.fillRect(0, 0, 320, 380); c.fillStyle = '#7cc65a'; c.fillRect(0, 300, 320, 80);
  for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#ff4f64' : '#fff6dc'; c.beginPath(); c.moveTo(i * 40, 0); c.lineTo(i * 40 + 40, 0); c.lineTo(i * 40 + 20, 26); c.closePath(); c.fill(); }
  // the tower with its scale, the bell on top
  const X = 214, Y0 = 296, Y1 = 62;
  c.fillStyle = '#b9243a'; c.fillRect(X - 26, Y1 - 8, 52, Y0 - Y1 + 16); c.fillStyle = '#ff4f64'; c.fillRect(X - 22, Y1 - 4, 44, Y0 - Y1 + 8);
  for (let i = 0; i < 9; i++) { c.fillStyle = i % 2 ? '#fff6dc' : '#ffd447'; c.fillRect(X - 18, Y0 - 12 - i * 26, 36, 5); }
  c.fillStyle = '#232861'; c.fillRect(X - 3, Y1, 6, Y0 - Y1);
  const sh = g.rung > 0 ? Math.sin(g.clock * 60) * 4 * g.rung : 0;
  c.fillStyle = '#ffd447'; c.beginPath(); c.arc(X + sh, Y1 - 22, 17, Math.PI, 0); c.lineTo(X + 21 + sh, Y1 - 8); c.lineTo(X - 21 + sh, Y1 - 8); c.closePath(); c.fill(); c.fillStyle = '#c9940a'; c.fillRect(X - 21 + sh, Y1 - 10, 42, 4);
  if (g.rung > 0) { c.strokeStyle = '#fff6dc'; c.lineWidth = 3; for (const d of [-1, 1]) { c.beginPath(); c.arc(X + d * 30, Y1 - 22, 8 + (0.7 - g.rung) * 26, d < 0 ? Math.PI * 0.75 : -Math.PI * 0.25, d < 0 ? Math.PI * 1.25 : Math.PI * 0.25); c.stroke(); } }
  const py = lerp(Y0 - 6, Y1 + 4, g.puck); c.fillStyle = '#3ddbb4'; c.fillRect(X - 14, py - 7, 28, 14); c.fillStyle = '#14957a'; c.fillRect(X - 14, py + 3, 28, 4);
  // the pad and the mallet
  c.fillStyle = '#232861'; c.fillRect(X - 34, Y0 + 8, 68, 16); c.fillStyle = '#ff4f64'; c.beginPath(); c.ellipse(X, Y0 + 8, 22, 7, 0, 0, TAU); c.fill();
  c.save(); c.translate(X - 78, Y0 + 14); c.rotate(g.swing > 0 ? 0.25 : -0.95 + Math.sin(g.clock * 3) * 0.05); c.fillStyle = '#8a623c'; c.fillRect(0, -4, 72, 8); c.fillStyle = '#b98a5a'; c.fillRect(58, -17, 24, 34); c.restore();
  // prizes on a shelf
  c.fillStyle = '#8a623c'; c.fillRect(20, 250, 110, 8); c.fillRect(20, 150, 110, 8);
  drawTeddy(c, 50, 212, 0.9, '#b5651d'); drawTeddy(c, 100, 214, 0.8, '#ff8fc7'); drawTeddy(c, 75, 112, 0.9, '#fff6dc');
  // the pointer runs to and fro along the strength bar
  const bx = 30, bw = 260, by = 338;
  c.fillStyle = '#232861'; c.fillRect(bx - 6, by - 6, bw + 12, 34);
  const zone = (w, col) => { c.fillStyle = col; c.fillRect(bx + bw * (0.5 - w / 2), by, bw * w, 22); };
  zone(1, '#ff4f64'); zone(0.56, '#f08a24'); zone(0.3, '#ffd447'); zone(0.115, '#3ddbb4');
  const mx = bx + bw * g.mk; c.fillStyle = '#fff6dc'; c.beginPath(); c.moveTo(mx, by + 12); c.lineTo(mx - 9, by - 10); c.lineTo(mx + 9, by - 10); c.closePath(); c.fill(); c.fillRect(mx - 2, by, 4, 22);
  if (g.cool > 0.2) { c.fillStyle = '#232861'; c.font = '900 15px Nunito, sans-serif'; c.textAlign = 'center'; c.fillText(g.pow > 0.9 ? 'Volltreffer!' : g.pow > 0.7 ? 'Fast!' : g.pow > 0.45 ? 'Mehr Kraft!' : 'Daneben …', 80, 290); }
}
function miniDraw(g) {
  const c = g.c; c.clearRect(0, 0, 320, 380);
  if (g.kind === 'lukas') { drawLukas(g, c); if (g.toy) { c.fillStyle = 'rgba(255,246,220,.9)'; c.beginPath(); c.arc(88, 180, 82, 0, TAU); c.fill(); drawTeddy(c, 88, 172, 1.9, '#b5651d'); } return; }
  if (g.kind === 'cans') {
    c.fillStyle = '#232861'; c.fillRect(0, 0, 320, 380);
    for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#ff4f64' : '#fff6dc'; c.beginPath(); c.moveTo(i * 40, 0); c.lineTo(i * 40 + 40, 0); c.lineTo(i * 40 + 20, 34); c.closePath(); c.fill(); }
    for (const s of g.shelves) {
      c.fillStyle = '#8a623c'; c.fillRect(10, s.y, 300, 10); c.fillStyle = '#b98a5a'; c.fillRect(10, s.y, 300, 4);
      s.cans.forEach((cn, i) => {
        const x = 45 + i * 62 + s.off; c.save(); c.translate(x, s.y);
        if (cn.down > 0) { c.rotate(1.45); c.globalAlpha = 0.45; c.translate(-8, 6); }
        c.fillStyle = '#b9bdd0'; c.fillRect(-14, -46, 28, 46); c.fillStyle = '#ff4f64'; c.fillRect(-14, -34, 28, 14); c.fillStyle = '#8a8fa8'; c.fillRect(-14, -46, 28, 4); c.fillRect(-14, -4, 28, 4);
        c.restore();
      });
    }
    c.fillStyle = '#3ddbb4'; c.fillRect(0, 344, 320, 36); c.fillStyle = '#14957a'; c.fillRect(0, 344, 320, 6);
    for (const bl of g.balls) { const u = Math.min(1, bl.t), x = lerp(160, bl.x, u), y = lerp(360, bl.y, u) - Math.sin(u * Math.PI) * 40, r = lerp(15, 8, u); if (bl.t < 1.15) { c.fillStyle = '#ffd447'; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.strokeStyle = '#c9940a'; c.lineWidth = 2; c.stroke(); } }
  } else if (g.kind === 'dunk') {
    const down = g.dunkT > 0, py = down ? 196 + Math.sin(g.clock * 12) * 3 : 96, tg = g.tgt;
    for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#ff4f64' : '#fff6dc'; c.fillRect(i * 40, 0, 40, 160); }
    c.fillStyle = '#8fd3ff'; c.fillRect(0, 160, 320, 190); c.fillStyle = '#ffd447'; c.fillRect(0, 154, 320, 8);
    if (!down) { c.fillStyle = '#8a623c'; c.fillRect(104, 150, 112, 9); }
    c.fillStyle = '#3d8bfd'; c.fillRect(148, py - 2, 24, 34); c.fillStyle = '#232861'; c.fillRect(148, py + 30, 10, down ? 14 : 30); c.fillRect(162, py + 30, 10, down ? 14 : 30);
    c.fillStyle = '#f1c39a'; c.beginPath(); c.arc(160, py - 16, 14, 0, TAU); c.fill(); c.fillStyle = '#4a2f1b'; c.beginPath(); c.arc(160, py - 19, 14, Math.PI, 0); c.fill();
    c.fillStyle = '#232861'; c.beginPath(); c.arc(155, py - 15, 2, 0, TAU); c.arc(165, py - 15, 2, 0, TAU); c.fill(); c.strokeStyle = '#232861'; c.lineWidth = 2; c.beginPath(); if (down) c.arc(160, py - 6, 4, 0, TAU); else c.arc(160, py - 12, 5, 0.2 * Math.PI, 0.8 * Math.PI); c.stroke();
    c.fillStyle = 'rgba(76,195,240,.82)'; c.fillRect(88, 178, 144, 112); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(88, 178, 144, 10); c.strokeStyle = '#2f63c9'; c.lineWidth = 6; c.strokeRect(88, 178, 144, 112);
    if (down) { c.fillStyle = '#ffffff'; for (let i = 0; i < 9; i++) { const a = Math.PI + i / 8 * Math.PI, r = 30 + (1.5 - g.dunkT) * 50; c.beginPath(); c.arc(160 + Math.cos(a) * r, 182 + Math.sin(a) * r * 0.8, 5, 0, TAU); c.fill(); } }
    c.fillStyle = '#232861'; c.fillRect(tg.x - 3, 262, 6, 84);
    for (const [r, col] of [[27, '#fff6dc'], [18, '#ff4f64'], [8, '#fff6dc']]) { c.fillStyle = col; c.beginPath(); c.arc(tg.x, 262, r, 0, TAU); c.fill(); }
    c.strokeStyle = '#232861'; c.lineWidth = 3; c.beginPath(); c.arc(tg.x, 262, 27, 0, TAU); c.stroke();
    c.fillStyle = '#3ddbb4'; c.fillRect(0, 344, 320, 36); c.fillStyle = '#14957a'; c.fillRect(0, 344, 320, 6);
    for (const bl of g.balls) { const u = Math.min(1, bl.t), x = lerp(160, bl.x, u), y = lerp(362, bl.y, u) - Math.sin(u * Math.PI) * 40, r = lerp(15, 8, u); if (bl.t < 1.12) { c.fillStyle = '#ffd447'; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.strokeStyle = '#c9940a'; c.lineWidth = 2; c.stroke(); } }
  } else if (g.kind === 'ghosts') {
    c.fillStyle = '#3a3052'; c.fillRect(0, 0, 320, 380); c.fillStyle = '#2a2350'; c.beginPath(); c.moveTo(0, 30); c.lineTo(160, 0); c.lineTo(320, 30); c.lineTo(320, 0); c.lineTo(0, 0); c.fill();
    for (let i = 0; i < 9; i++) {
      const w = g.win[i], x = 60 + (i % 3) * 100, y = 85 + ((i / 3) | 0) * 100;
      c.fillStyle = '#1b1530'; c.fillRect(x - 38, y - 44, 76, 88); c.fillStyle = w.k ? '#b7ff7a' : '#4a4070'; c.fillRect(x - 32, y - 38, 64, 76);
      if (w.k === 1) {
        const pop = w.hit > 0 ? w.hit * 4 : 1; c.globalAlpha = pop; c.fillStyle = '#f4f6ff'; c.beginPath(); c.arc(x, y - 6, 22, Math.PI, 0); c.lineTo(x + 22, y + 26); c.lineTo(x + 11, y + 18); c.lineTo(x, y + 26); c.lineTo(x - 11, y + 18); c.lineTo(x - 22, y + 26); c.closePath(); c.fill();
        c.fillStyle = '#1b1530'; c.beginPath(); c.arc(x - 8, y - 8, 4, 0, TAU); c.arc(x + 8, y - 8, 4, 0, TAU); c.fill(); c.beginPath(); c.ellipse(x, y + 5, 4, 6, 0, 0, TAU); c.fill(); c.globalAlpha = 1;
      } else if (w.k === 2) {
        const f = Math.sin(g.clock * 20) * 6; c.globalAlpha = w.hit > 0 ? w.hit * 4 : 1; c.fillStyle = '#15101f'; c.beginPath(); c.arc(x, y, 9, 0, TAU); c.fill();
        c.beginPath(); c.moveTo(x - 6, y); c.lineTo(x - 30, y - 10 + f); c.lineTo(x - 20, y + 8); c.closePath(); c.fill(); c.beginPath(); c.moveTo(x + 6, y); c.lineTo(x + 30, y - 10 + f); c.lineTo(x + 20, y + 8); c.closePath(); c.fill(); c.globalAlpha = 1;
      }
      c.strokeStyle = '#1b1530'; c.lineWidth = 4; c.beginPath(); c.moveTo(x, y - 38); c.lineTo(x, y + 38); c.moveTo(x - 32, y); c.lineTo(x + 32, y); c.stroke();
    }
  } else {
    c.fillStyle = '#7fb45f'; c.fillRect(0, 0, 320, 380); c.fillStyle = '#4a4d5e'; c.fillRect(36, 0, 248, 380);
    for (let y = -40 + (g.road % 40); y < 380; y += 40) { c.fillStyle = '#fff6dc'; c.fillRect(118, y, 4, 22); c.fillRect(198, y, 4, 22); c.fillStyle = ((y - g.road % 40) / 40 | 0) % 2 ? '#ff4f64' : '#fff6dc'; c.fillRect(30, y, 8, 40); c.fillRect(282, y, 8, 40); }
    for (const th of g.things) {
      const x = 80 + th.lane * 80;
      if (th.coin) { if (g.coin.complete && g.coin.naturalWidth) c.drawImage(g.coin, x - 15, th.y - 15, 30, 30); else { c.fillStyle = '#ffd447'; c.beginPath(); c.arc(x, th.y, 13, 0, TAU); c.fill(); } }
      else { c.fillStyle = '#f08a24'; c.beginPath(); c.moveTo(x, th.y - 18); c.lineTo(x + 13, th.y + 12); c.lineTo(x - 13, th.y + 12); c.closePath(); c.fill(); c.fillStyle = '#fff6dc'; c.fillRect(x - 8, th.y - 2, 16, 5); c.fillStyle = '#b9243a'; c.fillRect(x - 16, th.y + 12, 32, 5); }
    }
    const x = g.kx, y = 322; c.fillStyle = '#1c1c22'; for (const [dx, dy] of [[-19, -16], [19, -16], [-19, 14], [19, 14]]) c.fillRect(x + dx - 5, y + dy - 8, 10, 16);
    c.fillStyle = '#ff4f64'; c.fillRect(x - 14, y - 24, 28, 48); c.fillStyle = '#b9243a'; c.fillRect(x - 9, y - 30, 18, 10); c.fillStyle = '#ffdcb3'; c.beginPath(); c.arc(x, y + 2, 8, 0, TAU); c.fill(); c.fillStyle = '#232861'; c.beginPath(); c.arc(x, y + 1, 8, Math.PI, 0); c.fill();
  }
  if (g.flash > 0) { c.fillStyle = 'rgba(255,79,100,' + g.flash + ')'; c.fillRect(0, 0, 320, 380); }
  if (g.toy) { c.fillStyle = 'rgba(255,246,220,.9)'; c.beginPath(); c.arc(160, 178, 90, 0, TAU); c.fill(); drawTeddy(c, 160, 170, 2.1, '#b5651d'); }
}
