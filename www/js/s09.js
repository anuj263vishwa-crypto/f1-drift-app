
/* ===================== Lamborghini V12 Vision GT (external GLB, converted + decimated) ===================== */
(function () {
  const EX = [[-400,420,-2200,110],[400,420,-2200,110]]; /* tailpipes [x,y,z,diameter] in mm, model coords */
  async function load() {
    await new Promise((res, rej) => { const e = document.createElement("script"); e.src = "js/lz/lv12.js"; e.onload = () => { e.remove(); res() }; e.onerror = () => rej(new Error("data file missing")); document.head.appendChild(e) }); const B64 = window.__B64_lv12; window.__B64_lv12 = null;
    const bin = Uint8Array.from(atob(B64), c => c.charCodeAt(0));
    const D = await new Response(new Blob([bin]).stream().pipeThrough(new DecompressionStream("gzip"))).json();
    const CARB = (() => { const N = 256, cv = document.createElement("canvas"); cv.width = cv.height = N; const g = cv.getContext("2d"), c = N / 4, nS = 4;
      g.fillStyle = "#08090b"; g.fillRect(0, 0, N, N);
      for (let j = 0; j < 4; j++)for (let i = 0; i < 4; i++) { const warp = ((i + j) % 4) < 2, x = i * c, y = j * c, w = c / nS;
        for (let k = 0; k < nS; k++) { const gr = warp ? g.createLinearGradient(x + k * w, 0, x + (k + 1) * w, 0) : g.createLinearGradient(0, y + k * w, 0, y + (k + 1) * w);
          const hi = warp ? "#33363b" : "#25282c"; gr.addColorStop(0, "#0a0b0d"); gr.addColorStop(.5, hi); gr.addColorStop(1, "#0a0b0d"); g.fillStyle = gr;
          if (warp) g.fillRect(x + k * w, y, w, c); else g.fillRect(x, y + k * w, c, w) }
        const sh = g.createLinearGradient(x, y, warp ? x : x + c, warp ? y + c : y); sh.addColorStop(0, "rgba(0,0,0,.45)"); sh.addColorStop(.2, "rgba(0,0,0,0)"); sh.addColorStop(.8, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(0,0,0,.45)"); g.fillStyle = sh; g.fillRect(x, y, c, c) }
      const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t })();
    const tx = D.tex.map(u => { const t = new THREE.TextureLoader().load(u); t.flipY = false; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t });
    const mats = D.mats.map((m, i) => {
      const col = new THREE.Color(m.c[0], m.c[1], m.c[2]), S2 = { side: THREE.DoubleSide }; let M, k = m.k;
      const std = (o) => new THREE.MeshStandardMaterial(Object.assign({ color: col, roughness: .6, metalness: 0, side: THREE.DoubleSide }, o));
      if (k == "carbon") { M = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .38, metalness: .55, clearcoat: 1, clearcoatRoughness: .06, side: THREE.DoubleSide }); M.map = CARB;
        M.onBeforeCompile = sh => {
          sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vOP; varying vec3 vON;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvOP = position; vON = normal;");
          sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vOP; varying vec3 vON;").replace("#include <map_fragment>", `
            vec3 cw = pow(abs(normalize(vON)), vec3(6.)); cw /= (cw.x + cw.y + cw.z + 1e-5);
            float cs = 1. / .07;
            vec4 cc = texture2D(map, vOP.yz * cs) * cw.x + texture2D(map, vOP.xz * cs) * cw.y + texture2D(map, vOP.xy * cs) * cw.z;
            diffuseColor.rgb *= cc.rgb;`) } }
      else if (k == "paint") { M = std({ roughness: .3, metalness: .4 }); M.userData = { k: "lv_p" + i, fin: 1, bp: 1 }; M3["lv_p" + i] = M }
      else if (k == "blackgloss") M = std({ roughness: .25, metalness: .3 });
      else if (k == "blackmat") M = std({ roughness: .75, metalness: .1 });
      else if (k == "bronze") M = std({ roughness: .32, metalness: .8 });
      else if (k == "silver") M = std({ roughness: .25, metalness: .85 });
      else if (k == "chrome") M = std({ color: 0xd8dde4, roughness: .06, metalness: 1 });
      else if (k == "gold") M = std({ roughness: .3, metalness: .9 });
      else if (k == "rimblack") M = std({ roughness: .35, metalness: .6 });
      else if (k == "disc") M = std({ color: 0xffffff, map: tx[m.t], roughness: .45, metalness: .7 });
      else if (k == "caliper") M = std({ roughness: .4, metalness: .35 });
      else if (k == "mirror") M = std({ color: 0xffffff, map: tx[m.t], roughness: .05, metalness: 1 });
      else if (k == "tire") M = std({ color: 0xffffff, map: tx[m.t], roughness: .85, metalness: 0 });
      else if (k == "alca") M = std({ color: 0xffffff, map: tx[m.t], roughness: .95, metalness: 0 });
      else if (k == "tex") M = std({ color: 0xffffff, map: tx[m.t], roughness: .6, metalness: .1 });
      else if (k == "screen") M = std({ color: 0xffffff, map: tx[m.t], emissive: 0xffffff, emissiveMap: tx[m.t], emissiveIntensity: .9, roughness: .4 });
      else if (k == "decal") { M = std({ color: 0xffffff, map: tx[m.t], roughness: .5, alphaTest: .5, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }) }
      else if (k == "lamp") M = std({ roughness: .3, metalness: .2, emissive: col, emissiveIntensity: .55 });
      else if (k == "glass") M = std({ color: 0x0b1016, roughness: .05, metalness: .3, transparent: true, opacity: .16, depthWrite: false });
      else if (k == "dglass") M = std({ color: 0x0d141a, roughness: .05, metalness: .3, transparent: true, opacity: .26, depthWrite: false });
      else if (k == "rglass") M = std({ color: 0x7a0606, roughness: .08, metalness: .2, transparent: true, opacity: .5, depthWrite: false });
      else if (k == "win") M = std({ color: 0x0b1016, roughness: .05, metalness: .3, transparent: true, opacity: .12, depthWrite: false });
      else M = std({});
      if (!M.userData || !M.userData.k) M.userData = Object.assign(M.userData || {}, { k: m.n });
      return M
    });
    const c = new THREE.Group(), bd = new THREE.Group(); bd.position.y = D.by; c.add(bd); c.rotation.order = "YXZ";
    /* FIX: the real wheels have camber (front 3.0deg, rear 2.3deg). The game spins sp around local X, so a cambered wheel wobbled.
       -> st (steer) > cg (camber tilt) > sp (spin around the true axle); spinning meshes are counter-rotated inside sp. */
    const CAM = { fl: 3.0, fr: -3.0, rl: 2.3, rr: -2.3 }, camR = {};
    const wh = {}; for (const k in D.wc) { const st = new THREE.Group(), sp = new THREE.Group(), cg = new THREE.Group(); camR[k] = CAM[k] * Math.PI / 180; cg.rotation.z = camR[k]; st.position.fromArray(D.wc[k]); cg.add(sp); st.add(cg); bd.add(st); wh[k] = { st, sp, cg, y0: D.wc[k][1], rk: D.wr / D.wrs[k], R: D.wrs[k] } }
    const swG = new THREE.Group(); swG.position.fromArray(D.sw); bd.add(swG); const swAx = new THREE.Vector3().fromArray(D.sa).normalize();
    const dec = (b64, T) => { const s = atob(b64), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++)u[i] = s.charCodeAt(i); return new T(u.buffer) };
    for (const p of D.prims) {
      const P = dec(p.P, Uint16Array), N = dec(p.N, Int8Array), U = dec(p.U, Uint16Array), I = dec(p.I, Uint16Array), n = p.n;
      const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2);
      for (let i = 0; i < n; i++) { for (let k = 0; k < 3; k++) { pos[i * 3 + k] = p.mn[k] + P[i * 3 + k] / 65535 * (p.mx[k] - p.mn[k]); nor[i * 3 + k] = N[i * 3 + k] / 127 } uv[i * 2] = p.umn[0] + U[i * 2] / 65535 * (p.umx[0] - p.umn[0]); uv[i * 2 + 1] = p.umn[1] + U[i * 2 + 1] / 65535 * (p.umx[1] - p.umn[1]) }
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.BufferAttribute(nor, 3)); g.setAttribute("uv", new THREE.BufferAttribute(uv, 2)); g.setIndex(new THREE.BufferAttribute(I, 1));
      const me = new THREE.Mesh(g, mats[p.m]); me.userData.k = D.mats[p.m].n; me.castShadow = !mats[p.m].transparent; if (mats[p.m].transparent) me.renderOrder = 1;
      if (p.w && p.w != "sw" && p.g != "st") me.rotation.z = -camR[p.w];
      (p.w == "sw" ? swG : p.w ? (p.g == "st" ? wh[p.w].st : wh[p.w].sp) : bd).add(me)
    }
    /* contact shadow */
    { const cv = document.createElement("canvas"); cv.width = cv.height = 64; const g = cv.getContext("2d"), r = g.createRadialGradient(32, 32, 1, 32, 32, 32); r.addColorStop(0, "rgba(0,0,0,.85)"); r.addColorStop(.55, "rgba(0,0,0,.4)"); r.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64);
      const csM = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6 }), gg = new THREE.Group();
      const pl = (w, l, x, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, l).rotateX(-Math.PI / 2), csM); m.position.set(x, .012, z); m.renderOrder = 2; gg.add(m) };
      pl(2.5, 5.6, 0, -.1); for (const k in wh) { const p = wh[k].st.position; pl(.7, 1.3, p.x, p.z) } c.add(gg) }
    /* booster flames at the tailpipes */
    const fl = new THREE.Group(); fl.userData = { ms: [], sp: [], cx: 0, cy: .4, cz: -1.4 }; fl.visible = false; bd.add(fl);
    { let cx = 0, cy = 0, cz = 0;
      for (const [x, y, z, d] of EX) {
        const r = Math.max(.035, d * .0006), cone = (rr, L) => new THREE.Mesh(new THREE.CylinderGeometry(.01, rr, L, 16, 1, true).rotateX(-Math.PI / 2).translate(0, 0, -L / 2), FLM), q = [x * .001, y * .001, z * .001 + .03],
          m1 = cone(r, 1.9), m2 = cone(r * .5, 1.2), gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, fog: false }));
        m1.position.set(...q); m2.position.set(...q); gl.position.set(q[0], q[1], q[2] - .05); gl.userData.s = r * 7 + .3;
        fl.userData.ms.push(m1, m2); fl.userData.sp.push(gl); fl.add(m1, m2, gl); cx += q[0]; cy += q[1]; cz += q[2] }
      fl.userData.cx = cx / EX.length; fl.userData.cy = cy / EX.length; fl.userData.cz = cz / EX.length }
    c.visible = false; S.add(c);
    const X = { c, wh, pt: [], fl };
    Object.defineProperty(CARS, "lv12", { value: X, writable: true, configurable: true, enumerable: false });
    CN.lv12 = "LAMBO V12"; TT.lv12 = "LAMBORGHINI V12 VISION GT"; WR.lv12 = D.wr; ORD.push("lv12");

    const _set = window.setCar; window.setCar = function (id) { _set(id); X.c.visible = id == "lv12" };
    const _apply = window.applyCfg; window.applyCfg = function () { _apply(); for (const k in wh) { const w = wh[k]; w.st.scale.setScalar(CFG.ws); w.st.position.y = w.by = w.y0 + w.R * (CFG.ws - 1) } };
    const _ref = window.refreshUI; window.refreshUI = function () { _ref(); if (cur == "lv12") document.querySelectorAll("#opts .row").forEach(r => { r.style.display = ["body", "fin", "ws"].includes(r.dataset.rk) ? "" : "none" }) };
    const _bfx = window.boostFx; window.boostFx = function (dt) { _bfx(dt); X.fl.visible = cur == "lv12" && mode != "show" && P.nb > .05 };
    /* driver view: eye + cut-away of the seat/head area */
    const EYE = [D.sw[0], D.sw[1] + .12 + D.by, D.sw[2] - .42], cuts = [], cutOn = { v: false };
    bd.traverse(o => { if (!o.isMesh || !o.geometry.index) return; let a = o.parent; while (a && a !== bd) { if (Object.values(wh).some(w => w.st === a || w.sp === a)) return; a = a.parent }
      if (o.parent === swG) return; const g = o.geometry, ix = g.index.array, pa = g.attributes.position, keep = [];
      for (let i = 0; i < ix.length; i += 3) { let cx = 0, cy = 0, cz = 0; for (let k = 0; k < 3; k++) { cx += pa.getX(ix[i + k]); cy += pa.getY(ix[i + k]); cz += pa.getZ(ix[i + k]) } cx /= 3; cy = cy / 3 + D.by; cz /= 3;
        if (!(Math.abs(cx - EYE[0]) < .26 && cy > EYE[1] - .38 && cy < EYE[1] + .3 && cz > EYE[2] - .32 && cz < EYE[2] + .3)) keep.push(ix[i], ix[i + 1], ix[i + 2]) }
      if (keep.length < ix.length) cuts.push({ g, full: g.index, cut: new THREE.BufferAttribute(new Uint16Array(keep), 1) }) });
    X.dv = { q: { e: EYE }, parts: [], cuts: [], ratio: 0, baked: false, sp: { rotation: { z: 0 } } };
    const _dvs = window.dvSteer; window.dvSteer = function () { _dvs(); if (cur == "lv12") { swG.quaternion.setFromAxisAngle(swAx, -wh.fl.st.rotation.y * 2.6) }
      const on = cur == "lv12" && dv && mode != "show"; if (on !== cutOn.v) { cutOn.v = on; cuts.forEach(c => c.g.setIndex(on ? c.cut : c.full)) } };
    applyCfg(); window.LV12 = X
  }
  let busy = false;
  function lazyBtn() {
    const b = document.createElement("button"); b.dataset.c = "lv12"; b.textContent = "LAMBO V12";
    b.onclick = () => { if (!ready) return; if (window.LV12) { setCar("lv12"); return } if (busy) return; busy = true; lzToast("Loading LAMBO V12…"); load().then(() => { lzToast(""); setCar("lv12") }).catch(e => { busy = false; lzToast("Load failed: " + (e && e.message || e)); setTimeout(() => lzToast(""), 3500) }) };
    $("cs").append(b)
  }
  const w = setInterval(() => { try { if (typeof ready !== "undefined" && ready === true) { clearInterval(w); lazyBtn() } } catch (e) { } }, 400)
})();
