
/* ===================== Mercedes-AMG One (external GLB, converted) ===================== */
(function () {
  async function load() {
    await new Promise((res, rej) => { const e = document.createElement("script"); e.src = "js/lz/amg1.js"; e.onload = () => { e.remove(); res() }; e.onerror = () => rej(new Error("data file missing")); document.head.appendChild(e) }); const B64 = window.__B64_amg1; window.__B64_amg1 = null;
    const bin = Uint8Array.from(atob(B64), c => c.charCodeAt(0));
    const D = await new Response(new Blob([bin]).stream().pipeThrough(new DecompressionStream("gzip"))).json();
    const CARB = (() => { const N = 256, cv = document.createElement("canvas"); cv.width = cv.height = N; const g = cv.getContext("2d"), c = N / 4, nS = 4;
      g.fillStyle = "#08090b"; g.fillRect(0, 0, N, N);
      for (let j = 0; j < 4; j++)for (let i = 0; i < 4; i++) { const warp = ((i + j) % 4) < 2, x = i * c, y = j * c, w = c / nS;
        for (let k = 0; k < nS; k++) { const gr = warp ? g.createLinearGradient(x + k * w, 0, x + (k + 1) * w, 0) : g.createLinearGradient(0, y + k * w, 0, y + (k + 1) * w);
          const hi = warp ? "#33363b" : "#25282c"; gr.addColorStop(0, "#0a0b0d"); gr.addColorStop(.5, hi); gr.addColorStop(1, "#0a0b0d"); g.fillStyle = gr;
          if (warp) g.fillRect(x + k * w, y, w, c); else g.fillRect(x, y + k * w, c, w) }
        const sh = g.createLinearGradient(warp ? x : x, y, warp ? x : x + c, warp ? y + c : y); sh.addColorStop(0, "rgba(0,0,0,.45)"); sh.addColorStop(.2, "rgba(0,0,0,0)"); sh.addColorStop(.8, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(0,0,0,.45)"); g.fillStyle = sh; g.fillRect(x, y, c, c) }
      const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t })();
    const tx = D.tex.map(u => { const t = new THREE.TextureLoader().load(u); t.flipY = false; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t });
    const PAINT = /^(Doorrfok0011|Chassis0071)Mtl$/;
    const mats = D.mats.map((m, i) => {
      const paint = PAINT.test(m.n), glass = m.bl && m.t < 0 && m.a < .6;
      const carbon = !m.bl && m.t < 0 && m.c[0] + m.c[1] + m.c[2] < .12 && m.a > .95;
      const M = carbon ? new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .38, metalness: .55, clearcoat: 1, clearcoatRoughness: .06, side: THREE.DoubleSide }) : new THREE.MeshStandardMaterial({ color: new THREE.Color(m.c[0], m.c[1], m.c[2]), roughness: paint ? .3 : Math.max(m.r, glass ? .05 : .3), metalness: paint ? .4 : Math.min(m.m, .5), side: THREE.DoubleSide });
      if (carbon) { M.map = CARB; M.onBeforeCompile = sh => {
        sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vOP; varying vec3 vON;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvOP = position; vON = normal;");
        sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vOP; varying vec3 vON;").replace("#include <map_fragment>", `
          vec3 cw = pow(abs(normalize(vON)), vec3(6.)); cw /= (cw.x + cw.y + cw.z + 1e-5);
          float cs = 1. / .07;
          vec4 cc = texture2D(map, vOP.yz * cs) * cw.x + texture2D(map, vOP.xz * cs) * cw.y + texture2D(map, vOP.xy * cs) * cw.z;
          diffuseColor.rgb *= cc.rgb;`) } }
      if (m.t >= 0) M.map = tx[m.t];
      if (m.bl) { M.transparent = true; M.opacity = m.a; M.depthWrite = !(glass || m.a < .85) ; if (m.t >= 0 && m.ta) M.alphaTest = .02 }
      if (glass) { M.color.set(0x0b1016); M.opacity = .55; M.metalness = .3; M.roughness = .05 }
      if (m.em) { M.emissive = new THREE.Color(1, 1, 1); if (M.map) M.emissiveMap = M.map; M.emissiveIntensity = .7 }
      if (paint) { M.userData = { k: "amg_p" + i, fin: 1, bp: 1 }; M3["amg_p" + i] = M } else M.userData = { k: m.n };
      return M
    });
    const c = new THREE.Group(), bd = new THREE.Group(); bd.position.y = D.by; c.add(bd); c.rotation.order = "YXZ";
    const wh = {}; for (const k in D.wc) { const st = new THREE.Group(), sp = new THREE.Group(); st.position.fromArray(D.wc[k]); st.add(sp); bd.add(st); wh[k] = { st, sp, y0: D.wc[k][1] } }
    const swG = new THREE.Group(); swG.position.fromArray(D.sw); bd.add(swG); const swAx = new THREE.Vector3(0, -.14, .99).normalize();
    const dec = (b64, T) => { const s = atob(b64), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++)u[i] = s.charCodeAt(i); return new T(u.buffer) };
    for (const p of D.prims) {
      const P = dec(p.P, Uint16Array), N = dec(p.N, Int8Array), U = dec(p.U, Uint16Array), I = dec(p.I, Uint16Array), n = p.n;
      const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2);
      for (let i = 0; i < n; i++) { for (let k = 0; k < 3; k++) { pos[i * 3 + k] = p.mn[k] + P[i * 3 + k] / 65535 * (p.mx[k] - p.mn[k]); nor[i * 3 + k] = N[i * 3 + k] / 127 } uv[i * 2] = p.umn[0] + U[i * 2] / 65535 * (p.umx[0] - p.umn[0]); uv[i * 2 + 1] = p.umn[1] + U[i * 2 + 1] / 65535 * (p.umx[1] - p.umn[1]) }
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.BufferAttribute(nor, 3)); g.setAttribute("uv", new THREE.BufferAttribute(uv, 2)); g.setIndex(new THREE.BufferAttribute(I, 1));
      const mk = (geo, off) => { const m_ = new THREE.Mesh(geo, mats[p.m]); m_.userData.k = D.mats[p.m].n; m_.castShadow = !mats[p.m].transparent; if (off) m_.position.set(-off[0], -off[1], -off[2]); return m_ };
      if (p.w) { (p.w == "sw" ? swG : (p.g == "st" ? wh[p.w].st : wh[p.w].sp)).add(mk(g)); continue }
      /* FIX: rim inner blades / hub ring and steering grips are baked into the big body meshes -> cut those triangles out and
         hang them on the spinning wheel group (sp) / the steering group (swG) so they rotate with them.
         Steering: whole connected pieces (grips, hub...) that touch the wheel box, so nothing is left half-cut behind. */
      const bk = { body: [], sw: [], fl: [], fr: [], rl: [], rr: [] }, WCE = Object.entries(D.wc);
      let swC = null;
      if (/^Fsteer/.test(D.mats[p.m].n)) {
        const key = new Map(), vid = new Int32Array(n);
        for (let i = 0; i < n; i++) { const kk = Math.round(pos[i * 3] * 1e4) + "," + Math.round(pos[i * 3 + 1] * 1e4) + "," + Math.round(pos[i * 3 + 2] * 1e4); let id = key.get(kk); if (id === undefined) { id = key.size; key.set(kk, id) } vid[i] = id }
        const par = new Int32Array(key.size); for (let i = 0; i < par.length; i++) par[i] = i;
        const find = x => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x] } return x };
        for (let t = 0; t < I.length; t += 3) { const a = find(vid[I[t]]); par[find(vid[I[t + 1]])] = a; par[find(vid[I[t + 2]])] = a }
        const cb = new Map();
        for (let t = 0; t < I.length; t += 3) {
          const r = find(vid[I[t]]); let e = cb.get(r); if (!e) { e = { mn: [9, 9, 9], mx: [-9, -9, -9], core: 0 }; cb.set(r, e) }
          const c3 = [0, 0, 0]; for (let j = 0; j < 3; j++) { const v = I[t + j]; for (let k = 0; k < 3; k++) { const d = pos[v * 3 + k] - D.sw[k]; c3[k] += d / 3; if (d < e.mn[k]) e.mn[k] = d; if (d > e.mx[k]) e.mx[k] = d } }
          if (Math.abs(c3[0]) < .147 && Math.abs(c3[1]) < .101 && c3[2] > -.037 && c3[2] < .071) e.core++
        }
        const ok = new Set(); for (const [r, e] of cb) if (e.core > 0 && e.mn[0] > -.25 && e.mx[0] < .25 && e.mn[1] > -.2 && e.mx[1] < .2 && e.mn[2] > -.1 && e.mx[2] < .15) ok.add(r);
        swC = { ok, find, vid }
      }
      for (let t = 0; t < I.length; t += 3) {
        const a = I[t], b = I[t + 1], c = I[t + 2];
        const cx = (pos[a * 3] + pos[b * 3] + pos[c * 3]) / 3, cy = (pos[a * 3 + 1] + pos[b * 3 + 1] + pos[c * 3 + 1]) / 3, cz = (pos[a * 3 + 2] + pos[b * 3 + 2] + pos[c * 3 + 2]) / 3;
        let dst = "body";
        if (swC && swC.ok.has(swC.find(swC.vid[a]))) dst = "sw";
        else for (const [k, wc] of WCE) { const ax = (cx - wc[0]) * (wc[0] > 0 ? 1 : -1); if (ax > -.16 && ax < .16 && Math.hypot(cy - wc[1], cz - wc[2]) < .29) { dst = k; break } }
        bk[dst].push(a, b, c)
      }
      for (const k in bk) {
        if (!bk[k].length) continue;
        let geo = g; if (k != "body" || bk.body.length != I.length) { geo = new THREE.BufferGeometry(); for (const an in g.attributes) geo.setAttribute(an, g.attributes[an]); geo.setIndex(new THREE.BufferAttribute(Uint16Array.from(bk[k]), 1)) }
        if (k == "body") bd.add(mk(geo)); else if (k == "sw") swG.add(mk(geo, D.sw)); else wh[k].sp.add(mk(geo, D.wc[k]))
      }
    }
    /* contact shadow */
    { const cv = document.createElement("canvas"); cv.width = cv.height = 64; const g = cv.getContext("2d"), r = g.createRadialGradient(32, 32, 1, 32, 32, 32); r.addColorStop(0, "rgba(0,0,0,.85)"); r.addColorStop(.55, "rgba(0,0,0,.4)"); r.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64);
      const csM = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6 }), gg = new THREE.Group();
      const pl = (w, l, x, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, l).rotateX(-Math.PI / 2), csM); m.position.set(x, .012, z); m.renderOrder = 2; gg.add(m) };
      pl(2.3, 5.2, 0, -.1); for (const k in wh) { const p = wh[k].st.position; pl(.62, 1.25, p.x, p.z) } c.add(gg) }
    const fl = new THREE.Group(); fl.userData = { ms: [], sp: [], cx: 0, cy: .4, cz: -1.4 }; fl.visible = false; bd.add(fl);
    /* FIX: booster flame -- AMG ONE central tailpipe [x,y,z,diameter] in mm (model coords) */
    { const EX = [[2, 372, -2336, 120]]; let cx = 0, cy = 0, cz = 0;
      for (const [x, y, z, d] of EX) {
        const r = Math.max(.035, d * .0006), cone = (rr, L) => new THREE.Mesh(new THREE.CylinderGeometry(.01, rr, L, 16, 1, true).rotateX(-Math.PI / 2).translate(0, 0, -L / 2), FLM), q = [x * .001, y * .001, z * .001 + .03],
          m1 = cone(r, 1.9), m2 = cone(r * .5, 1.2), gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, fog: false }));
        m1.position.set(...q); m2.position.set(...q); gl.position.set(q[0], q[1], q[2] - .05); gl.userData.s = r * 7 + .3;
        fl.userData.ms.push(m1, m2); fl.userData.sp.push(gl); fl.add(m1, m2, gl); cx += q[0]; cy += q[1]; cz += q[2] }
      fl.userData.cx = cx / EX.length; fl.userData.cy = cy / EX.length; fl.userData.cz = cz / EX.length }
    c.visible = false; S.add(c);
    const X = { c, wh, pt: [], fl };
    Object.defineProperty(CARS, "amg1", { value: X, writable: true, configurable: true, enumerable: false });
    CN.amg1 = "AMG ONE"; TT.amg1 = "MERCEDES-AMG ONE"; WR.amg1 = D.wr; ORD.push("amg1");

    const _set = window.setCar; window.setCar = function (id) { _set(id); X.c.visible = id == "amg1" };
    const _apply = window.applyCfg; window.applyCfg = function () { _apply(); for (const k in wh) { const w = wh[k]; w.st.scale.setScalar(CFG.ws); w.st.position.y = w.by = w.y0 + D.wr * (CFG.ws - 1) } };
    const _ref = window.refreshUI; window.refreshUI = function () { _ref(); if (cur == "amg1") document.querySelectorAll("#opts .row").forEach(r => { r.style.display = ["body", "fin", "ws"].includes(r.dataset.rk) ? "" : "none" }) };
    /* driver view: eye + cut-away of the seat/head area */
    const EYE = [D.sw[0], D.sw[1] + .12 + D.by, D.sw[2] - .42], cuts = [], cutOn = { v: false };
    bd.traverse(o => { if (!o.isMesh || !o.geometry.index) return; let a = o.parent; while (a && a !== bd) { if (wh && Object.values(wh).some(w => w.st === a || w.sp === a)) return; a = a.parent }
      if (o.parent === swG) return; const g = o.geometry, ix = g.index.array, pa = g.attributes.position, keep = [];
      for (let i = 0; i < ix.length; i += 3) { let cx = 0, cy = 0, cz = 0; for (let k = 0; k < 3; k++) { cx += pa.getX(ix[i + k]); cy += pa.getY(ix[i + k]); cz += pa.getZ(ix[i + k]) } cx /= 3; cy = cy / 3 + D.by; cz /= 3;
        if (!(Math.abs(cx - EYE[0]) < .26 && cy > EYE[1] - .38 && cy < EYE[1] + .3 && cz > EYE[2] - .32 && cz < EYE[2] + .3)) keep.push(ix[i], ix[i + 1], ix[i + 2]) }
      if (keep.length < ix.length) cuts.push({ g, full: g.index, cut: new THREE.BufferAttribute(new Uint16Array(keep), 1) }) });
    X.dv = { q: { e: EYE }, parts: [], cuts: [], ratio: 0, baked: false, sp: { rotation: { z: 0 } } };
    const _dvs = window.dvSteer; window.dvSteer = function () { _dvs(); if (cur == "amg1") { swG.quaternion.setFromAxisAngle(swAx, -wh.fl.st.rotation.y * 2.6) }
      const on = cur == "amg1" && dv && mode != "show"; if (on !== cutOn.v) { cutOn.v = on; cuts.forEach(c => c.g.setIndex(on ? c.cut : c.full)) } };
    /* FIX: boostFx() loops `for (k in CARS)` which skips the non-enumerable amg1 -> flame group never became visible */
    const _bfx = window.boostFx; window.boostFx = function (dt) { _bfx(dt); X.fl.visible = cur == "amg1" && mode != "show" && P.nb > .05 };
    applyCfg(); window.AMG1 = X
  }
  let busy = false;
  function lazyBtn() {
    const b = document.createElement("button"); b.dataset.c = "amg1"; b.textContent = "AMG ONE";
    b.onclick = () => { if (!ready) return; if (window.AMG1) { setCar("amg1"); return } if (busy) return; busy = true; lzToast("Loading AMG ONE…"); load().then(() => { lzToast(""); setCar("amg1") }).catch(e => { busy = false; lzToast("Load failed: " + (e && e.message || e)); setTimeout(() => lzToast(""), 3500) }) };
    $("cs").append(b)
  }
  const w = setInterval(() => { try { if (typeof ready !== "undefined" && ready === true) { clearInterval(w); lazyBtn() } } catch (e) { } }, 400)
})();

