/* NITRO + DRIFT SCORE (Asphalt-style). Hooks: NITRO.step() in physics, NITRO.a in gearbox/speed cap/FOV */
(function () {
  var N = window.NITRO = { a: 0, on: false, nt: 1, pts: 0, dur: 0, gap: 0, mult: 1, total: 0, bank: 0, bankT: 0, m: "" };
  try { N.total = +localStorage.getItem("f1drift_pts") || 0 } catch (e) { }
  var css = document.createElement("style");
  css.textContent = "#nbar{width:96px;height:7px;margin:5px 0 0 auto;background:#ffffff30;border-radius:4px;overflow:hidden;position:relative}#nbar i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#00c6ff,#7df9ff);transition:width .1s}#nbar.on i{background:linear-gradient(90deg,#fff,#00e5ff);box-shadow:0 0 10px #00e5ff}#nlab{font-size:9px;letter-spacing:.16em;opacity:.85;text-align:right;margin-top:3px}"
    + "#nbtn{position:fixed;z-index:6;right:calc(var(--u,84px)*2.55);bottom:calc(14px + env(safe-area-inset-bottom,0px));width:calc(var(--u,84px)*.95);height:calc(var(--u,84px)*.95);border-radius:50%;border:3px solid #00e5ff;background:radial-gradient(circle,#0a3550cc,#06121dcc);color:#fff;font:800 12px system-ui,sans-serif;letter-spacing:.06em;display:none;align-items:center;justify-content:center;touch-action:none;user-select:none;-webkit-user-select:none;box-shadow:0 0 14px #00e5ff66}#nbtn.on{background:radial-gradient(circle,#00e5ff,#0077aa);box-shadow:0 0 28px #00e5ff;color:#001a26}#nbtn.mt{border-color:#666;box-shadow:none;opacity:.55}"
    + "#dft{position:fixed;z-index:4;left:50%;top:calc(26% + env(safe-area-inset-top,0px));transform:translateX(-50%);text-align:center;pointer-events:none;font:italic 900 26px system-ui,sans-serif;color:#fff;text-shadow:0 2px 10px #000c,0 0 18px #ffd40088;opacity:0;transition:opacity .2s;white-space:nowrap}#dft small{display:block;font-size:13px;letter-spacing:.2em;color:#ffd400}#dft.bk{color:#7dff9e}"
    + "#nfx{position:fixed;inset:0;z-index:2;pointer-events:none;display:none;background:radial-gradient(ellipse at 50% 50%,transparent 42%,rgba(0,150,255,.38) 100%)}#nfx:before{content:'';position:absolute;inset:-20%;background:repeating-conic-gradient(from 0deg at 50% 50%,transparent 0 2.4deg,rgba(170,225,255,.30) 2.4deg 2.9deg);-webkit-mask-image:radial-gradient(circle at 50% 50%,transparent 34%,#000 82%);mask-image:radial-gradient(circle at 50% 50%,transparent 34%,#000 82%);animation:nspin .22s steps(3) infinite}@keyframes nspin{to{transform:rotate(7deg)}}";
  document.head.appendChild(css);
  function el(t, id, html) { var e = document.createElement(t); e.id = id; if (html) e.innerHTML = html; document.body.appendChild(e); return e }
  var fx = el("div", "nfx"), dft = el("div", "dft"), btn = el("div", "nbtn", "NITRO");
  var spd = document.getElementById("spd");
  var bar = document.createElement("div"); bar.id = "nbar"; bar.innerHTML = "<i></i>";
  var lab = document.createElement("div"); lab.id = "nlab"; lab.textContent = "NITRO";
  if (spd) { spd.appendChild(bar); spd.appendChild(lab) }
  function live() { try { return ready && !menuOn && !gOn && mode !== "show" } catch (e) { return false } }
  function toggle() {
    if (!live()) return;
    try { if ((mode === "race" || mode === "ghost") && cd > 0) return } catch (e) { }
    if (N.on) { N.on = false; return }
    if (N.nt > .04) {
      N.on = true;
      try { var v = Math.hypot(P.vx, P.vz); if (v > 3 && !P.air) { P.vx += Math.sin(P.h) * 4.5; P.vz += Math.cos(P.h) * 4.5 } } catch (e) { }   /* kick */
    }
  }
  btn.addEventListener("pointerdown", function (e) { e.preventDefault(); e.stopPropagation(); toggle() });
  addEventListener("keydown", function (e) { if (e.code === "KeyN" && !e.repeat) toggle() });
  /* physics hook: returns extra acceleration (m/s^2) */
  N.step = function (dt, can, fv, hb, dn) {
    try {
      if (!live()) { N.on = false; N.a += (0 - N.a) * Math.min(1, dt * 6); return 0 }
      if (N.m !== mode) { N.m = mode; N.nt = 1; N.on = false; N.pts = N.dur = N.gap = 0 }
      try { if ((mode === "race" || mode === "ghost") && cd > 0) { N.nt = Math.max(N.nt, .6); N.on = false } } catch (e) { }
      var spd0 = Math.hypot(P.vx, P.vz), sl = Math.min(1, Math.abs(P.sl || 0) / .6);
      var drifting = P.dr > .35 && spd0 > 12 && !P.air;
      if (drifting) {
        N.gap = 0; N.dur += dt; N.mult = 1 + Math.min(4, Math.floor(N.dur / 2.5));
        N.pts += dt * (spd0 * 3.6 * .9) * (.4 + sl * 1.2) * N.mult;
        if (!N.on) N.nt = Math.min(1, N.nt + dt * (.10 + .16 * sl))
      } else if (N.dur > 0) {
        N.gap += dt;
        if (spd0 < 6) { N.pts = N.dur = N.gap = 0 }                         /* crashed: combo lost */
        else if (N.gap > .6) {
          if (N.pts > 150) { var b = Math.round(N.pts); N.bank = b; N.bankT = performance.now(); N.total += b; N.nt = Math.min(1, N.nt + Math.min(.12, b / 12000)); try { localStorage.setItem("f1drift_pts", String(N.total)) } catch (e) { } }
          N.pts = N.dur = N.gap = 0
        }
      }
      if (N.on) { N.nt -= dt * .26; if (N.nt <= 0) { N.nt = 0; N.on = false } }
      N.a += ((N.on ? 1 : 0) - N.a) * Math.min(1, dt * (N.on ? 6 : 3));
      if (N.a < .002) N.a = 0;
      P.nb = Math.max(P.nb || 0, N.a);                                        /* flames + motion blur */
      return (can && N.a > .02 && fv > -1 && !hb && !dn) ? 30 * N.a : 0
    } catch (e) { return 0 }
  };
  /* HUD refresh (10 Hz) */
  setInterval(function () {
    var lv = live();
    btn.style.display = lv ? "flex" : "none";
    btn.className = (N.on ? "on" : "") + (N.nt < .04 && !N.on ? " mt" : "");
    var i = bar.firstChild; i.style.width = Math.round(N.nt * 100) + "%"; bar.className = N.on ? "on" : "";
    fx.style.display = (lv && N.a > .03) ? "block" : "none"; fx.style.opacity = Math.min(1, N.a);
    var now = performance.now();
    if (lv && N.dur > .35 && N.pts > 20) { dft.className = ""; dft.style.opacity = 1; dft.innerHTML = "DRIFT " + Math.round(N.pts).toLocaleString("en-US") + "<small>× " + N.mult + "</small>" }
    else if (N.bank && now - N.bankT < 1800) { dft.className = "bk"; dft.style.opacity = 1; dft.innerHTML = "+" + N.bank.toLocaleString("en-US") + "<small>DRIFT BANKED</small>" }
    else dft.style.opacity = 0
  }, 100)
})();
