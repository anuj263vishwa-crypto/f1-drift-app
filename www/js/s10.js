
/* ===== GRAPHICS QUALITY — runtime module (menu UI, live apply, FPS overlay, Auto governor) ===== */
(function () {
  var G = window.__GFX, Q = window.__Q, TI = G.TI, ORDER = G.ORDER;
  if (!G || typeof R === "undefined") return;
  var $g = function (id) { return document.getElementById(id) };
  var gMode = G.mode, tier = G.tier, showFps = false;
  try { showFps = localStorage.getItem("f2008gfxf") === "1" } catch (e) { }
  var idx = function () { return ORDER.indexOf(tier) };

  /* ---------- apply a tier live ---------- */
  function applyTier(t, why) {
    var q = TI[t]; if (!q) return; tier = t; G.tier = t; Object.assign(Q, q);
    try { R.setPixelRatio(Math.min(window.devicePixelRatio || 1, Q.pr)); rs() } catch (e) { }
    try {
      sun.castShadow = !!Q.sh;
      if (sun.shadow.mapSize.x !== Q.shs) { sun.shadow.mapSize.set(Q.shs, Q.shs); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null } }
    } catch (e) { }
    try { RR = Q.rr; LOD2 = Q.lod2; if (mode !== "show") scatter(true) } catch (e) { }
    try { if (window.WORLD3) { WORLD3.terrUpdate(true); WORLD3.vegUpdate(0, true) } } catch (e) { }
    try { ais.forEach(function (a) { a.g.traverse(function (o) { if (o.isMesh) o.castShadow = !!Q.ais }); if (!Q.aic && a.__gc) { a.g.visible = true; a.__gc = 0 } }) } catch (e) { }
    refreshUI(why)
  }
  function setMode(m) {
    gMode = m; G.mode = m; try { localStorage.setItem("f2008gfx", m) } catch (e) { }
    gov.cool = performance.now() + 4000; gov.badN = gov.good = 0; gov.w.length = 0;
    applyTier(m === "auto" ? G.ORDER[G.det.i] : m)
  }

  /* ---------- menu UI ---------- */
  function refreshUI(why) {
    var b = $g("gfxB"); if (b) Array.prototype.forEach.call(b.querySelectorAll("button"), function (x) { x.classList.toggle("on", x.getAttribute("data-q") === gMode) });
    var s = $g("gfxS"); if (s) s.textContent = gMode === "auto" ? "Auto · running " + TI[tier].n : TI[tier].n;
    var f = $g("gfxF"); if (f) f.checked = showFps;
    var o = $g("gfxfps"); if (o) o.style.display = showFps ? "block" : "none";
    if (why) toast(why)
  }
  var tEl = null, tTm = 0;
  function toast(t) {
    if (!tEl) { tEl = document.createElement("div"); tEl.id = "gfxtoast"; document.body.appendChild(tEl) }
    tEl.textContent = t; tEl.style.opacity = 1; clearTimeout(tTm); tTm = setTimeout(function () { tEl.style.opacity = 0 }, 3200)
  }
  var bx = $g("gfxB");
  if (bx) bx.addEventListener("click", function (e) { var q = e.target && e.target.getAttribute && e.target.getAttribute("data-q"); if (q) setMode(q) });
  var fx = $g("gfxF");
  if (fx) fx.addEventListener("change", function () { showFps = fx.checked; try { localStorage.setItem("f2008gfxf", showFps ? "1" : "0") } catch (e) { } refreshUI() });

  /* ---------- FPS overlay + Auto governor ---------- */
  var ov = document.createElement("div"); ov.id = "gfxfps"; document.body.appendChild(ov);
  var fpsAcc = 0, fpsN = 0, fpsVal = 0;
  var gov = { w: [], ws: 0, last: 0, hz: 0, bad: {}, good: 0, badN: 0, cool: 0, was: false };
  var HZ = [30, 45, 48, 50, 60, 72, 75, 90, 100, 120, 144, 165, 240];
  function snap(v) { var b = HZ[0], d = 1e9; for (var i = 0; i < HZ.length; i++) { var k = Math.abs(HZ[i] - v); if (k < d) { d = k; b = HZ[i] } } return b }
  function evalWin(now) {
    var a = gov.w.slice().sort(function (x, y) { return x - y }), n = a.length, mean = 0, i;
    for (i = 0; i < n; i++) mean += a[i]; mean /= n;
    var fps = 1000 / mean, hz = snap(1000 / a[Math.floor(n * .25)]); gov.hz = Math.max(gov.hz, hz);
    var H = gov.hz || 60, down = fps < Math.min(.7 * H, 45), up = H >= 50 && fps >= .95 * H;
    if (down) { gov.badN++; gov.good = 0 } else if (up) { gov.good++; gov.badN = 0 } else { gov.badN = 0; gov.good = 0 }
    var ix = idx();
    if (gov.badN >= 2 && ix > 0) { gov.bad[tier] = now; var nt = ORDER[ix - 1]; gov.cool = now + 8000; gov.badN = gov.good = 0; applyTier(nt, "Auto: " + TI[ORDER[ix]].n + " → " + TI[nt].n + " (FPS " + Math.round(fps) + ")") }
    else if (gov.good >= 4 && ix < G.det.ceil && !(gov.bad[ORDER[ix + 1]] && now - gov.bad[ORDER[ix + 1]] < 120000)) { var nu = ORDER[ix + 1]; gov.cool = now + 8000; gov.badN = gov.good = 0; applyTier(nu, "Auto: " + TI[ORDER[ix]].n + " → " + TI[nu].n) }
  }
  function tick(now) {
    requestAnimationFrame(tick);
    var dt = now - gov.last; gov.last = now; if (!(dt > 0)) return;
    fpsAcc += dt; fpsN++;
    if (fpsAcc >= 500) {
      fpsVal = 1000 * fpsN / fpsAcc; fpsAcc = 0; fpsN = 0;
      if (showFps) { try { ov.textContent = Math.round(fpsVal) + " FPS · " + R.info.render.calls + " calls · " + Math.round(R.info.render.triangles / 1000) + "k tris · " + TI[tier].n + (gMode === "auto" ? " (auto)" : "") } catch (e) { } }
    }
    if (typeof ready !== "undefined" && ready && !gov.was) { gov.was = true; gov.cool = now + 6000 }
    if (gMode !== "auto" || !gov.was || menuOn || mode === "show" || document.hidden || now < gov.cool) { gov.w.length = 0; return }
    if (dt > 200) { gov.w.length = 0; return }
    if (!gov.w.length) gov.ws = now;
    gov.w.push(dt);
    if (now - gov.ws >= 3000) { var w = gov.w; evalWin(now); gov.w.length = 0 }
  }
  requestAnimationFrame(tick);

  /* ---------- far AI cars: skip drawing them (race only), invisible at distance ---------- */
  setInterval(function () {
    try {
      if (!Q.aic || mode !== "race") return;
      ais.forEach(function (a) {
        var far = Math.hypot(a.g.position.x - P.x, a.g.position.z - P.z) > Q.aic;
        if (far && a.g.visible) { a.g.visible = false; a.__gc = 1 } else if (!far && a.__gc) { a.g.visible = true; a.__gc = 0 }
      })
    } catch (e) { }
  }, 250);

  /* initial UI state (renderer/world already booted with the tier's values via window.__Q) */
  refreshUI();
  window.__GFX.setMode = setMode; window.__GFX.apply = applyTier;
})();

