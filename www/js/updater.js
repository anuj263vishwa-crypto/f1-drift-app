/* In-app OTA updater: checks GitHub release "latest", downloads bundle.zip, restarts into it */
(function () {
  var VERSION = "__VERSION__", REPO = "anuj263vishwa-crypto/f1-drift-app";
  var CU = function () { try { return window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.CapacitorUpdater } catch (e) { return null } };
  var cur = parseInt(VERSION, 10) || 0, busy = false, latest = null;
  var css = document.createElement("style");
  css.textContent = "#upd{position:fixed;z-index:99999;left:50%;top:calc(12px + env(safe-area-inset-top,0px));transform:translateX(-50%);background:rgba(14,17,24,.94);color:#fff;border:1px solid #ffffff30;border-radius:14px;padding:10px 14px;font:600 14px system-ui,sans-serif;display:none;align-items:center;gap:10px;box-shadow:0 6px 24px #000a;max-width:90vw}#upd button{background:#e10600;color:#fff;border:0;border-radius:10px;padding:8px 14px;font:700 14px system-ui;cursor:pointer}#upd .x{background:#ffffff22}#upd i{display:block;height:4px;background:#ffffff30;border-radius:2px;width:140px;overflow:hidden}#upd i b{display:block;height:100%;width:0;background:linear-gradient(90deg,#ffd400,#e10600)}";
  document.head.appendChild(css);
  var box = document.createElement("div"); box.id = "upd"; document.body.appendChild(box);
  function show(html) { box.innerHTML = html; box.style.display = "flex" }
  function hide() { box.style.display = "none" }
  function toast(t, ms) { show("<span>" + t + "</span>"); setTimeout(hide, ms || 3000) }
  function check(manual) {
    if (busy) return;
    var cu = CU(); if (!cu) { if (manual) toast("Updates sirf installed app mein chalte hain"); return }
    if (manual) toast("Checking for update…", 8000);
    fetch("https://api.github.com/repos/" + REPO + "/releases/tags/latest", { headers: { Accept: "application/vnd.github+json" } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json() })
      .then(function (j) {
        var m = /v(\d+)/.exec(j.name || "") || /v(\d+)/.exec(j.body || ""), n = m ? +m[1] : 0;
        var a = (j.assets || []).filter(function (x) { return x.name === "bundle.zip" })[0];
        var sm = /sha256=([0-9a-f]{64})/i.exec(j.body || ""), ck = sm ? sm[1].toLowerCase() : String(a && a.digest || "").replace(/^sha256:/, "").toLowerCase();
        if (a && n > cur) { if (ck.length !== 64) { if (manual) toast("Update info adhoori (checksum nahi mila)"); return } latest = { n: n, url: a.browser_download_url, mb: Math.round(a.size / 1048576), ck: ck }; offer() }
        else if (manual) toast("Game up to date ✅ (v" + cur + ")")
        else hide()
      })
      .catch(function (e) { if (manual) toast("Update check fail — net ya repo public check karo") })
  }
  function offer() {
    show("<span>🆕 Update v" + latest.n + " (" + latest.mb + " MB)</span><button id='updgo'>Update</button><button class='x' id='updno'>Later</button>");
    document.getElementById("updgo").onclick = go; document.getElementById("updno").onclick = hide
  }
  function go() {
    var cu = CU(); busy = true;
    show("<span>Downloading…</span><i><b id='updb'></b></i><span id='updp'>0%</span>");
    try { cu.addListener("download", function (e) { var p = e && e.percent || 0, b = document.getElementById("updb"), t = document.getElementById("updp"); if (b) b.style.width = p + "%"; if (t) t.textContent = Math.round(p) + "%" }) } catch (e) { }
    cu.download({ url: latest.url, version: String(latest.n), checksum: latest.ck })
      .then(function (bd) { show("<span>Installing…</span>"); return cu.set(bd) })
      .catch(function (e) { busy = false; show("<span>Update fail: " + (e && e.message || e) + "</span><button id='updgo'>Retry</button><button class='x' id='updno'>Close</button>"); document.getElementById("updgo").onclick = go; document.getElementById("updno").onclick = hide })
  }
  /* menu button + version label */
  function addMenuBtn() {
    var mc = document.getElementById("mc"); if (!mc || document.getElementById("updbtn")) return;
    var b = document.createElement("button"); b.id = "updbtn"; b.className = "mm"; b.style.marginTop = "12px";
    b.textContent = "⬆ Check for update (v" + cur + ")"; b.onclick = function () { check(true) };
    mc.parentNode.insertBefore(b, mc)
  }
  function addBanner() {
    var mt = document.getElementById("mt"); if (!mt || document.getElementById("menuban")) return;
    var im = document.createElement("img"); im.id = "menuban"; im.src = "img/car.jpg";
    im.style.cssText = "display:block;width:100%;max-height:110px;object-fit:cover;border-radius:12px;margin:0 0 8px;box-shadow:0 4px 18px #000a";
    mt.parentNode.insertBefore(im, mt)
  }
  addMenuBtn(); addBanner(); setTimeout(function () { addMenuBtn(); addBanner() }, 1500);
  /* auto-check once the game is up */
  var t0 = setInterval(function () { try { if (typeof ready !== "undefined" && ready === true) { clearInterval(t0); setTimeout(function () { check(false) }, 4000) } } catch (e) { } }, 1000);

  /* keep telling the OTA plugin that this bundle is healthy (a missed call makes it roll back) */
  function notify() { try { var c = CU(); c && c.notifyAppReady && c.notifyAppReady() } catch (e) { } }
  notify(); [300, 1500, 4000, 9000].forEach(function (t) { setTimeout(notify, t) });
  var nn = 0, ni = setInterval(function () { notify(); if (++nn > 12) clearInterval(ni) }, 10000);
  /* tiny diagnostics line (bottom centre): version, OTA bundle, FPS, errors, extra cars */
  var errs = 0, lastE = "", fps = 0, frames = 0, bundle = "?";
  addEventListener("error", function (e) { errs++; lastE = String(e.message || "").slice(0, 60) });
  addEventListener("unhandledrejection", function (e) { errs++; lastE = String(e.reason && e.reason.message || e.reason || "").slice(0, 60) });
  try { var cc = CU(); cc && cc.current().then(function (r) { bundle = (r.bundle.version === "builtin" ? "APK" : "OTA " + r.bundle.version) }).catch(function () { }) } catch (e) { }
  var dbg = document.createElement("div"); dbg.id = "dbg";
  dbg.style.cssText = "position:fixed;z-index:99990;left:50%;bottom:calc(2px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);font:9px/1.2 monospace;color:#fff;opacity:.55;pointer-events:none;white-space:nowrap;text-shadow:0 1px 2px #000";
  document.body.appendChild(dbg);
  (function f() { frames++; requestAnimationFrame(f) })();
  setInterval(function () { fps = frames; frames = 0; var x = document.getElementById("xcr"), m = x ? /extra cars: (\d+)\/(\d+)/.exec(x.textContent) : null;
    var gm = ""; try { gm = " · gpu " + R.info.memory.geometries + "g/" + R.info.memory.textures + "t" } catch (e) { }
    dbg.textContent = "v" + cur + " · " + bundle + " · " + fps + "fps" + gm + " · cars " + (m ? m[1] + "/" + m[2] : "?") + " · err " + errs + (lastE ? " (" + lastE + ")" : "") }, 1000);

  /* share button in the menu */
  var SHARE = "https://github.com/anuj263vishwa-crypto/f1-drift-app/releases/latest/download/F1-Drift.apk";
  function share() {
    var data = { title: "F1 Drift", text: "F1 Drift – racing game, download:", url: SHARE };
    if (navigator.share) { navigator.share(data).catch(function () { }); return }
    try { navigator.clipboard.writeText(SHARE).then(function () { toast("Link copied ✅") }, function () { toast(SHARE, 6000) }) } catch (e) { toast(SHARE, 6000) }
  }
  function addShare() {
    var mc = document.getElementById("mc"); if (!mc || document.getElementById("shbtn")) return;
    var b = document.createElement("button"); b.id = "shbtn"; b.className = "mm"; b.style.marginTop = "8px"; b.textContent = "📤 Share game"; b.onclick = share; mc.parentNode.insertBefore(b, mc);
    var q = document.createElement("img"); q.id = "shqr"; q.src = "img/share-qr.webp"; q.alt = "QR - download F1 Drift";
    q.style.cssText = "display:block;margin:10px auto 4px;width:min(210px,52vw);height:auto;border-radius:12px"; mc.parentNode.insertBefore(q, mc)
  }
  addShare(); setTimeout(addShare, 1500); setTimeout(addShare, 4000);
  window.F1Update = { check: check, version: cur }
})();
