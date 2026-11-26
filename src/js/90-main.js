/* ================= main loop ================= */
let last = 0, acc = 0, uiT = 0, saveT = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const rdt = Math.min(0.1, (now - last) / 1000 || 0); last = now;
  const running = S.speed > 0 && !ui.mini && !ui.title;
  worldDt = running || STUDIO ? rdt : 0; worldT += worldDt;
  if (STUDIO) studioFrame(rdt);   // the figure studio: bodies move, nothing else happens
  else if (running) {
    acc += rdt * S.speed; let n = 0;
    while (acc >= STEP && n < 14) { simStep(STEP); acc -= STEP; n++; }
    if (n === 14) acc = 0;
  }
  if (pathDirty) rebuildPaths();
  if (litterDirty) rebuildLitter();
  if (!modeCamera(rdt)) updateCamera(rdt);
  trackFrame();
  weatherFrame(worldDt); updateSky(); updateWorldExtras(worldDt); thumbTick(); landFrame(); sitesFrame(); renderPeople(worldDt); renderIcons(); audioSync(false); audioFrame(rdt); devFrame();
  for (const c of clouds) { c.position.x += c.userData.v * worldDt; if (c.position.x > 150) c.position.x = -150; }
  uiT += rdt; if (uiT > 0.25 || uiDirty) { uiT = 0; uiDirty = false; refreshUI(); }
  saveT += rdt; if (saveT > 15) { saveT = 0; if (!ui.title && !STUDIO) save(); }
  if (!ui.title) { renderScene(); gfxWatch(rdt); }   // the title screen covers the island: no need to draw it
}
function start() {
  buildWorld(); buildWorldExtras(); buildWeather(); makeThumbs(); resize();
  if (!STUDIO) versionCheck();   // a new version starts from scratch (the figure studio leaves the saved parks alone)
  audioCreate();    // unpacking the recordings starts now; the sound itself only starts in a park
  newGame();        // a fresh island behind the title screen; it is only kept when a park is started on it
  buildTabs(); renderTray(); renderCoach(); applyCurrency(); refreshUI();
  devInit(); if (DEV) renderTray();
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  window.__park = { S, DEFS, STAFF, cam, audioTime: () => (actx ? actx.currentTime : -1), titleSkip: () => { if (ui.title) newPark(0, 'Testpark', true); }, showTitle, hideTitle, readMeta, SKEY, BUILD, loadSlot, newPark, curSlot: () => curSlot, rufInfo, priceLock, willing, worldT: () => worldT, fpAt: () => (fp ? [fp.x, fp.z] : null), placeObj, canPlace, ownedAt, tool: () => tool, finishSite, accessOf, connected, setPath, removeObj, landSet,
    trackBox: () => { const m = trackPrev && trackPrev.children[0]; return m ? [m.geometry.parameters.width, m.geometry.parameters.depth, +m.position.x.toFixed(2), +m.position.z.toFixed(2), m.material === MAT_TP_ST ? 'ok' : 'bad'] : null; },
    camera, viewMid, groundPt, FGL, FGH, STU, FIG, HR, HC, objPick, figPick, figAt, spawnGuest, selectNone: () => select(null), selected: () => (!sel ? '' : sel.obj ? 'obj:' + sel.obj.id : sel.guest ? 'guest:' + sel.guest.id : sel.staff ? 'staff:' + sel.staff.id : '?'), lvlOfS, staffBenefit, audioProbe, REC, MUSIC, BED, recAt, recPick, recHas, hearing, audioReady, audioState: () => (actx ? actx.state : 'none'), audioTest: () => { if (!audioReady()) return 'audio not running'; const bad = []; for (const k in SFX) { try { SFX[k](0.01); } catch (e) { bad.push(k + ': ' + e.message); } } for (const w of ['laugh', 'woo', 'scream', 'bleh', 'hey', 'nom', 'stop', 'aww']) { try { speak(w, 1, 0.001); } catch (e) { bad.push(w + ': ' + e.message); } } try { musicFrame(); } catch (e) { bad.push('music: ' + e.message); } return bad.length ? bad.join(' | ') : 'all ' + Object.keys(SFX).length + ' effects, 8 voices and the music scheduler ran'; }, info: () => ({ tris: renderer.info.render.triangles, calls: renderer.info.render.calls, pr: renderer.getPixelRatio(), lines: LINE.on, hi: HI.nFig, lo: LO.nFig, reach: +figReach.toFixed(2) }), figTris: () => { const o = {}; for (const k in FGL) { const c = (g) => (Array.isArray(g) ? g.map(c) : g.index ? g.index.count / 3 : g.attributes.position.count / 3); o[k] = [c(FGL[k]), c(FGH[k])]; } return o; }, startSite, setCrew, builderPlaces, land: { N, PN, plotsOwned, landPrice, plotForSale, buyPlot, markCut, unmarkCut, landSet, plotOwned, cuts: () => cuts, ownedAt }, canPlace, get decos() { return decos; }, spawnThief, grabThief, throwThief, pokeGuard, wakeGuard, markThief, secXp, wxSet, WX, DEV, devAct, enterFP, enterPOV, exitMode, openMini, openCurrency, lvlOf, socialTick, quit, get thieves() { return thieves; }, get fp() { return fp; }, get pov() { return pov; }, get mini() { return mini; }, GROUPS, thumbNow, spawnVip, inviteVip, buyAd, adBoost, guestCap, ADS, get vip() { return vipG; }, get plane() { return adPlane; }, litterTotal: () => litterTotal, litter, dropLitter, entDist, spawnGuest, complaints: () => complaints, renderPeople, landCap, staffMax, toast, msgLog, showJob, quit, planeOnScreen: () => { if (!adPlane.visible) return false; _v.copy(adPlane.position).project(camera); return Math.abs(_v.x) < 0.6 && Math.abs(_v.y) < 0.7 && _v.z < 1; }, analyseTrack, tool: () => tool, removeObj, fire, load, demolish, tType, toScreen: (x, z) => { _v.set(x, 0, z).project(camera); const r = canvas.getBoundingClientRect(); return [(_v.x * 0.5 + 0.5) * r.width + r.left, (-_v.y * 0.5 + 0.5) * r.height + r.top]; }, simStep, placeObj, setPath, hire, idx, newGame, save, serialize, setTool, select, get guests() { return guests; }, get builds() { return builds; }, get staff() { return staff; }, get fin() { return fin; } };
  if (STUDIO) { studioStart(); requestAnimationFrame(frame); return; }   // the figure studio: a stage instead of the title screen
  showTitle(false);
  requestAnimationFrame(frame);
}
const HOT = window.claude && window.claude.hot;
try { if (HOT && HOT.snapshot) HOT.snapshot(() => { save(); return {}; }); } catch (e) { /* only present inside the viewer */ }
if (HOT && HOT.ready) HOT.ready(() => start()); else start();
