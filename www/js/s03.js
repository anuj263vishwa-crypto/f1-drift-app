
/* ===== GRAPHICS QUALITY — boot module (runs before the game; defines window.__Q used by the renderer/world code) ===== */
(function () {
  var TI = {
    low:   { n: "Low",   pr: 1,   sh: 0, shs: 1024, ais: 0, rr: 9,  lod2: 4225,  tf: 1500, tl1: 350, tl2: 800,  vr: 7,  vd: .30, aic: 200 },
    mid:   { n: "Mid",   pr: 1.5, sh: 1, shs: 1024, ais: 0, rr: 14, lod2: 9025,  tf: 2200, tl1: 500, tl2: 1200, vr: 10, vd: .42, aic: 350 },
    high:  { n: "High",  pr: 2,   sh: 1, shs: 2048, ais: 1, rr: 18, lod2: 14400, tf: 3000, tl1: 700, tl2: 1600, vr: 12, vd: .50, aic: 0 },
    ultra: { n: "Ultra", pr: 2.5, sh: 1, shs: 2048, ais: 1, rr: 20, lod2: 19600, tf: 3300, tl1: 800, tl2: 1900, vr: 13, vd: .55, aic: 0 },
    /* MAX = the original game, untouched */
    max:   { n: "Max",   pr: 3,   sh: 1, shs: 2048, ais: 1, rr: 22, lod2: 19600, tf: 3700, tl1: 800, tl2: 1900, vr: 13, vd: .55, aic: 0 }
  };
  var ORDER = ["low", "mid", "high", "ultra", "max"];
  function gpuName() {
    try {
      var c = document.createElement("canvas"), g = c.getContext("webgl") || c.getContext("experimental-webgl"); if (!g) return "";
      var e = g.getExtension("WEBGL_debug_renderer_info"), s = e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER);
      var l = g.getExtension("WEBGL_lose_context"); if (l) l.loseContext(); return String(s || "")
    } catch (e) { return "" }
  }
  function detect() {
    var g = (gpuName() || "").toLowerCase(), ua = navigator.userAgent || "";
    var mob = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
    var mem = navigator.deviceMemory || 0, cores = navigator.hardwareConcurrency || 4, dpr = window.devicePixelRatio || 1;
    var px = (screen.width || 1280) * (screen.height || 720) * dpr * dpr, i, m;
    if (/swiftshader|llvmpipe|software|basic render/.test(g)) i = 0;
    else if (!mob) {
      if (/rtx|radeon rx|rx ?[5-9]\d{2,3}|apple m\d|geforce|gtx|quadro|nvidia/.test(g)) i = /rtx|radeon rx ?[6-9]|rx ?[6-9]\d{3}|apple m[2-9]|apple m\d (pro|max|ultra)/.test(g) ? 4 : 3;
      else if (/intel.*arc/.test(g)) i = 2;
      else if (/intel|uhd|iris|hd graphics/.test(g)) i = 1;
      else if (/amd|radeon/.test(g)) i = 2;
      else i = (mem >= 8 || cores >= 8) ? 3 : 2
    } else {
      if (/apple/.test(g)) i = 2;
      else if (/adreno/.test(g)) { m = /(\d{3})/.exec(g); m = m ? +m[1] : 0; i = m >= 740 ? 2 : m >= 640 ? 1 : 0 }
      else if (/mali/.test(g)) { m = /g-?(\d+)/.exec(g); m = m ? +m[1] : 0; i = m >= 715 ? 2 : m >= 76 ? 1 : 0 }
      else i = 1;
      if (mem && mem <= 3) i = Math.min(i, 0); else if (mem && mem <= 4) i = Math.min(i, 1);
      if (cores <= 4) i = Math.min(i, 1)
    }
    if (px > 9e6 && i > 1) i--;
    var ceil = mob ? Math.min(3, i + 1) : 4; i = Math.min(i, ceil);
    return { i: i, ceil: ceil, gpu: g, mob: mob, mem: mem, cores: cores }
  }
  var saved = "auto"; try { var sv = localStorage.getItem("f2008gfx"); if (sv === "auto" || TI[sv]) saved = sv } catch (e) { }
  var det = detect(), tier = saved === "auto" ? ORDER[det.i] : saved;
  window.__GFX = { TI: TI, ORDER: ORDER, det: det, mode: saved, tier: tier };
  window.__Q = Object.assign({}, TI[tier]);
})();

