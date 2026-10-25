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
        if (a && n > cur) { latest = { n: n, url: a.browser_download_url, mb: Math.round(a.size / 1048576) }; offer() }
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
    cu.download({ url: latest.url, version: String(latest.n) })
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
  addMenuBtn(); setTimeout(addMenuBtn, 1500);
  /* auto-check once the game is up */
  var t0 = setInterval(function () { try { if (typeof ready !== "undefined" && ready === true) { clearInterval(t0); setTimeout(function () { check(false) }, 4000) } } catch (e) { } }, 1000);
  window.F1Update = { check: check, version: cur }
})();
