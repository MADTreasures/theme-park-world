/* ================= main loop ================= */
let last = 0, acc = 0, uiT = 0, saveT = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const rdt = Math.min(0.1, (now - last) / 1000 || 0); last = now;
  if (S.speed > 0 && !ui.mini) {
    acc += rdt * S.speed; let n = 0;
    while (acc >= STEP && n < 14) { simStep(STEP); acc -= STEP; n++; }
    if (n === 14) acc = 0;
  }
  if (pathDirty) rebuildPaths();
  if (litterDirty) rebuildLitter();
  if (!modeCamera(rdt)) updateCamera(rdt);
  weatherFrame(rdt); updateSky(); updateWorldExtras(rdt); landFrame(); sitesFrame(); renderPeople(rdt); renderIcons(); audioFrame(rdt); devFrame();
  for (const c of clouds) { c.position.x += c.userData.v * rdt; if (c.position.x > 150) c.position.x = -150; }
  uiT += rdt; if (uiT > 0.25 || uiDirty) { uiT = 0; uiDirty = false; refreshUI(); }
  saveT += rdt; if (saveT > 15) { saveT = 0; save(); }
  renderScene(); gfxWatch(rdt);
}
function start(hot) {
  buildWorld(); buildWorldExtras(); buildWeather(); makeThumbs(); resize();
  let data = hot && hot.save;
  if (!data) { try { data = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { data = null; } }
  let loaded = false;
  if (data && data.v === 1 && Array.isArray(data.paths) && Array.isArray(data.objs)) { try { load(data); loaded = true; } catch (e) { loaded = false; } }
  if (!loaded) newGame();
  buildTabs(); renderTray(); renderCoach(); applyCurrency(); refreshUI();
  devInit(); if (DEV) renderTray();
  if (!S.cur) { if (DEV) { S.cur = { name: 'Testtaler', sym: 'T', shape: 0, col: 0, img: '' }; applyCurrency(); } else openCurrency(true); }
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  window.__park = { S, DEFS, STAFF, cam, audioTest: () => { if (!audioReady()) return 'audio not running'; const bad = []; for (const k in SFX) { try { SFX[k](0.01); } catch (e) { bad.push(k + ': ' + e.message); } } for (const w of ['laugh', 'woo', 'scream', 'bleh', 'hey', 'nom', 'stop', 'aww']) { try { speak(w, 1, 0.001); } catch (e) { bad.push(w + ': ' + e.message); } } try { musicFrame(); } catch (e) { bad.push('music: ' + e.message); } return bad.length ? bad.join(' | ') : 'all ' + Object.keys(SFX).length + ' effects, 8 voices and the music scheduler ran'; }, info: () => ({ tris: renderer.info.render.triangles, calls: renderer.info.render.calls, pr: renderer.getPixelRatio(), lines: LINE.on, hi: HI.nFig, lo: LO.nFig, reach: +figReach.toFixed(2) }), figTris: () => { const o = {}; for (const k in FGL) { const c = (g) => (Array.isArray(g) ? g.map(c) : g.index ? g.index.count / 3 : g.attributes.position.count / 3); o[k] = [c(FGL[k]), c(FGH[k])]; } return o; }, startSite, setCrew, builderPlaces, land: { N, PN, plotsOwned, landPrice, plotForSale, buyPlot, markCut, unmarkCut, landSet, plotOwned, cuts: () => cuts, ownedAt }, canPlace, get decos() { return decos; }, spawnThief, grabThief, throwThief, pokeGuard, wakeGuard, markThief, secXp, wxSet, WX, DEV, devAct, enterFP, enterPOV, exitMode, openMini, openCurrency, lvlOf, socialTick, quit, get thieves() { return thieves; }, get fp() { return fp; }, get pov() { return pov; }, get mini() { return mini; }, analyseTrack, tool: () => tool, removeObj, fire, load, demolish, tType, toScreen: (x, z) => { _v.set(x, 0, z).project(camera); const r = canvas.getBoundingClientRect(); return [(_v.x * 0.5 + 0.5) * r.width + r.left, (-_v.y * 0.5 + 0.5) * r.height + r.top]; }, simStep, placeObj, setPath, hire, idx, newGame, save, serialize, setTool, select, get guests() { return guests; }, get builds() { return builds; }, get staff() { return staff; }, get fin() { return fin; } };
  requestAnimationFrame(frame);
}
const HOT = window.claude && window.claude.hot;
try { if (HOT && HOT.snapshot) HOT.snapshot(() => ({ save: serialize() })); } catch (e) { /* only present inside the viewer */ }
if (HOT && HOT.ready) HOT.ready(start); else start((HOT && HOT.data) || {});
