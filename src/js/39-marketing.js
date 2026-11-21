/* ================= advertising and influencers ================= */
// A campaign raises for a few days how many guests the park attracts; the shares of all running campaigns add up.
// S.ads maps a key to [time it ends, share]. An influencer's video is such an entry too: its share depends on how the
// visit went, and a bad one is negative.
const ADS = {
  news: { name: 'Zeitungsanzeige', short: 'Zeitung', cost: 300, days: 1, k: 0.15, need: 0, info: 'In der Inselzeitung. Lockt vor allem Familien mit Kindern.' },
  radio: { name: 'Radiospot', short: 'Radio', cost: 700, days: 2, k: 0.25, need: 2, info: 'Läuft zwei Tage im Inselradio und erreicht alle.' },
  web: { name: 'Internetwerbung', short: 'Internet', cost: 1200, days: 2, k: 0.35, need: 4, info: 'Videos und Banner im Netz. Lockt Mutige, die wilde Fahrten suchen.' },
  tv: { name: 'Fernsehspot', short: 'Fernsehen', cost: 3000, days: 3, k: 0.6, need: 6, info: 'Zur besten Sendezeit. Bringt am meisten Besucher, und sie haben mehr Geld dabei.' },
};
const VIP = { cost: 1000, need: 5, stay: 160 };
const VIP_NAMES = ['@lia.unterwegs', '@noah.on.tour', '@mia.erlebt', '@tim.testet', '@zoe.entdeckt', '@leon.checkt', '@yara.reist', '@ben.will.spass'];
// what a video does, by its stars: [share of visitors, days]
const VIP_EFFECT = [[-0.2, 1.5], [0.05, 1], [0.18, 1.5], [0.35, 2], [0.5, 2]];
let vipG = null;   // the influencer who is in the park right now
const adOn = (k) => { const a = S.ads && S.ads[k]; return a && a[0] > S.time ? a : null; };
function adBoost() { let b = 0; if (S.ads) for (const k in S.ads) { const a = S.ads[k]; if (a[0] > S.time) b += a[1]; } return clamp(b, -0.3, 1.6); }
const pct = (k) => (k < 0 ? '−' : '+') + Math.round(Math.abs(k) * 100) + ' %';
function buyAd(k) {
  const a = ADS[k]; if (!a || S.goal < a.need || adOn(k)) return false;
  if (S.money < a.cost) { sfx('error'); toast('Dafür reicht das Geld nicht.', 'bad'); return false; }
  spend(a.cost, 'ads'); if (!S.ads) S.ads = {}; S.ads[k] = [S.time + a.days * DAY, a.k]; S.adsN = (S.adsN || 0) + 1;
  sfx('build'); toast(a.name + ' gebucht: ' + pct(a.k) + ' Besucher für ' + dayTxt(a.days) + '.', 'good'); uiDirty = true; return true;
}
const dayTxt = (d) => (d === 1 ? 'einen Tag' : String(d).replace('.', ',') + ' Tage');
/* ----- the influencer ----- */
function spawnVip(inside) {
  const g = spawnGuest(inside); g.vip = true; g.name = S.vip.name;
  dress(g, false); g.sc = 1.04; g.hair = pick([1, 2, 6, 7, 8]); g.browCol = g.hairCol = pick(HAIR_FUN); g.top = 2; g.bottom = 0; g.shirt = pick([0xff4fa8, 0xffd23f, 0x3ddbb4, 0x8c5cff]); g.trim = 0xffffff; g.pants = 0xf2f2f2; g.shoe = 0xff4f64;
  g.pack = 0; g.shades = 0; g.balloon = 0; g.legs = g.skin;
  g.cash = 400; g.happy = 62; g.stay = S.vip.left; g.t = 0; g.brave = Math.max(g.brave, 0.6); g.hunger = rnd(35, 50); g.thirst = rnd(20, 40);
  g.log = { n: {}, rides: [], buys: [] };
  vipG = g; colorsDirty = true; return g;
}
function inviteVip() {
  if (S.goal < VIP.need || S.vip || (vipG && !vipG.gone)) return false;
  if (S.money < VIP.cost) { sfx('error'); toast('Dafür reicht das Geld nicht.', 'bad'); return false; }
  spend(VIP.cost, 'ads'); S.vip = { name: pick(VIP_NAMES), left: VIP.stay };
  const g = spawnVip(false);
  sfx('build'); toast(g.name + ' ist auf dem Weg in deinen Park und filmt alles. Achte auf kurze Schlangen und saubere Wege.', 'gold', g); uiDirty = true; return true;
}
// The visit is over: the video goes online. How it turns out depends on the mood at the gate and on what there was to see.
function vipDone(g) {
  const L = g.log || { n: {}, rides: [], buys: [] }, n = L.n;
  const score = g.happy + Math.min(L.rides.length, 5) * 2 - (L.rides.length ? 0 : 12);
  const stars = score >= 80 ? 5 : score >= 66 ? 4 : score >= 52 ? 3 : score >= 38 ? 2 : 1, eff = VIP_EFFECT[stars - 1];
  const good = [], bad = [], best = L.rides.slice().sort((a, b) => b[1] - a[1])[0];
  if (best && best[1] > 3) good.push('«' + best[0] + ' war der Hammer!»');
  if (L.rides.length >= 3) good.push(L.rides.length + ' Attraktionen ausprobiert.');
  if (L.buys.length) good.push('Eingekauft: ' + Array.from(new Set(L.buys)).slice(0, 2).join(' und ') + '.');
  if (n.great || n.happy) good.push('Viel gelacht.');
  if (!L.rides.length) bad.push('Keine einzige Attraktion erlebt.');
  if (n.queue) bad.push('Die Warteschlangen waren zu lang.');
  if (n.litter) bad.push('Auf den Wegen lag Abfall.');
  if (n.food) bad.push('Nichts zu essen gefunden.');
  if (n.drink) bad.push('Nichts zu trinken gefunden.');
  if (n.wc) bad.push('Kein WC in der Nähe.');
  if (n.money) bad.push('Die Preise waren zu hoch.');
  if (n.sick) bad.push('Nach einer Fahrt war ganz flau im Magen.');
  if (n.thief) bad.push('Ein Taschendieb hat zugegriffen.');
  if (!S.ads) S.ads = {};
  S.ads.vip = [S.time + eff[1] * DAY, eff[0]];
  S.vipLast = { name: g.name, stars, k: eff[0], days: eff[1], good: good.slice(0, 3), bad: bad.slice(0, 3) };
  S.vip = null; if (vipG === g) vipG = null;
  const st = '★'.repeat(stars) + '☆'.repeat(5 - stars);
  toast('Das Video von ' + g.name + ' ist online: ' + st + ' · ' + (eff[0] < 0 ? 'ein Verriss, ' + pct(eff[0]) + ' Besucher' : pct(eff[0]) + ' Besucher') + ' für ' + dayTxt(eff[1]) + '. Antippen für Einzelheiten.', stars >= 3 ? 'gold' : 'bad', showAds);
  sfx(stars >= 3 ? 'goal' : 'error'); uiDirty = true;
}
// once per game second: campaigns run out, the influencer's fans wave
function adTick() {
  if (S.ads) for (const k in S.ads) if (S.ads[k][0] <= S.time) {
    delete S.ads[k]; uiDirty = true;
    toast(k === 'vip' ? 'Das Video des Influencers wird kaum noch angeschaut.' : ADS[k] ? ADS[k].name + ' ist ausgelaufen.' : 'Eine Werbung ist ausgelaufen.');
  }
  if (vipG && vipG.gone) vipG = null;
  if (S.vip && !vipG) S.vip = null;   // the visitor got lost: the next one can be invited
  const v = vipG; if (!v) return;
  S.vip.left = Math.max(5, v.stay - v.t);
  if (v.state === 'ride' || v.state === 'arrive' || v.state === 'exit') return;
  for (const g of guests) {
    if (g === v || g.state === 'ride' || g.think > 0) continue;
    const dx = g.x - v.x, dz = g.z - v.z;
    if (dx * dx + dz * dz < 5 && Math.random() < 0.1) { g.happy = Math.min(100, g.happy + 1.5); think(g, 'fan'); g.rot = Math.atan2(v.x - g.x, v.z - g.z); }
  }
}
/* ----- the dialog ----- */
function showAds() {
  let h = '<h2>Besucher und Werbung</h2><div class="kv"><span>Gäste im Park</span><b id="a-now"></b><span>Der Park zieht zurzeit an</span><b id="a-cap"></b><span>Wirkung der Werbung</span><b id="a-boost"></b></div>' +
    '<p class="note">Mehr Gäste kommen durch mehr Attraktionen, eine hohe Parkwertung und einen fairen Eintritt. Werbung bringt zusätzlich Besucher, solange sie läuft; mehrere Kampagnen addieren sich.</p><h3>Werbung schalten</h3><div class="ads">';
  for (const k in ADS) { const a = ADS[k];
    h += '<div class="ad" data-ad="' + k + '"><span class="ic">' + IC['ad_' + k] + '</span><div class="tx"><div class="hd"><b>' + a.name + '</b><span class="fx">' + pct(a.k) + ' Besucher · ' + dayTxt(a.days) + '</span></div><span class="sub">' + a.info + '</span><div class="meter" hidden><i></i></div></div>' +
      '<button class="btn" data-act="ad" data-k="' + k + '"></button></div>'; }
  h += '</div><h3>Influencer</h3><div class="ads"><div class="ad" data-ad="vip"><span class="ic">' + IC.ad_vip + '</span><div class="tx"><div class="hd"><b>Influencer einladen</b><span class="fx" id="a-vipfx"></span></div>' +
    '<span class="sub">Kommt für gut einen halben Tag, fährt, isst und filmt. Gefällt es, bringt das Video bis zu 50 % mehr Besucher; ein Verriss schreckt Gäste ab. Lade erst ein, wenn die Wege sauber und die Schlangen kurz sind.</span><div class="meter" hidden><i></i></div></div>' +
    '<button class="btn" data-act="vip"></button></div></div><div id="a-last"></div>';
  modal(h); fillAds();
}
function fillAds() {
  const b = adBoost(), cap = guestCap();
  setTxt('a-now', guests.length); setTxt('a-cap', 'bis zu ' + Math.round(cap) + ' Gäste' + (cap >= MAXG - 10.5 ? ' (mehr passen nicht auf die Insel)' : '')); setTxt('a-boost', Math.abs(b) < 0.005 ? 'keine' : pct(b) + ' Besucher');
  const left = (a) => { const d = (a[0] - S.time) / DAY; return d >= 1 ? 'noch ' + d.toFixed(1).replace('.', ',') + ' Tage' : 'noch ' + Math.max(1, Math.round(d * 24)) + ' Std.'; };
  document.querySelectorAll('#modal .ad').forEach((el) => {
    const k = el.dataset.ad, btn = el.querySelector('.btn'), m = el.querySelector('.meter'), on = adOn(k);
    let txt, dis = false, share = 0;
    if (k === 'vip') {
      const here = !!(vipG && !vipG.gone);
      setTxt('a-vipfx', here ? vipG.name + ' ist gerade im Park' : on ? 'Das Video läuft: ' + pct(on[1]) + ' Besucher' : 'bis ' + pct(0.5) + ' Besucher · 2 Tage');
      if (S.goal < VIP.need) { txt = 'nach Ziel ' + VIP.need; dis = true; }
      else if (here) txt = 'Hinspringen';
      else { txt = eur(VIP.cost); dis = S.money < VIP.cost; }
      if (here) share = clamp(1 - vipG.t / vipG.stay, 0, 1); else if (on && S.vipLast) share = (on[0] - S.time) / (S.vipLast.days * DAY);
      el.classList.toggle('bad', !!on && on[1] < 0);
    } else {
      const a = ADS[k];
      if (S.goal < a.need) { txt = 'nach Ziel ' + a.need; dis = true; }
      else if (on) { txt = left(on); dis = true; share = (on[0] - S.time) / (a.days * DAY); }
      else { txt = eur(a.cost); dis = S.money < a.cost; }
    }
    if (btn.textContent !== txt) btn.textContent = txt; btn.disabled = dis;
    el.classList.toggle('on', share > 0); m.hidden = share <= 0; m.firstChild.style.width = clamp(share * 100, 0, 100) + '%';
  });
  const L = S.vipLast, box = document.getElementById('a-last');
  if (box) {
    const h = L ? '<h3>Letztes Video</h3><p class="vid"><b>' + L.name + '</b> <span class="stars">' + '★'.repeat(L.stars) + '<i>' + '★'.repeat(5 - L.stars) + '</i></span> · ' + pct(L.k) + ' Besucher für ' + dayTxt(L.days) + '</p>' +
      (L.good.length || L.bad.length ? '<ul class="vidl">' + L.good.map((t) => '<li class="g">' + t + '</li>').join('') + L.bad.map((t) => '<li class="b">' + t + '</li>').join('') + '</ul>' : '') : '';
    if (box.dataset.h !== h) { box.dataset.h = h; box.innerHTML = h; }
  }
}
