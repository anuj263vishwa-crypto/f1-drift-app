/* ===== External cars: 2026 Red Bull RB22 + Mercedes-AMG GT3 (converted GLB data in car_*.js) =====
   Hierarchy per wheel:  st (steer + suspension height, at wheel centre)  ->  sp (spin, tyre + rim + brake disc + cover)
   Calipers sit in st (they steer, they do not spin).  Steering wheel = model's own wheel, rotated about its column axis.
   Flames only leave the model's own tailpipe.  Wheel geometry is stored exactly concentric around the spin axis (no wobble). */
(function () {
  "use strict";
  const DEFS = [
    { id: "rb22", btn: "RB22 2026", title: "RED BULL RACING RB22", ratio: 3.0 },
    { id: "gt3", btn: "AMG GT3", title: "MERCEDES-AMG GT3 RED BULL", ratio: 3.4 },
    { id: "jesko", btn: "JESKO", title: "KOENIGSEGG JESKO", ratio: 3.2 },
    { id: "fxxk", btn: "FXX-K EVO", title: "FERRARI FXX-K EVO", ratio: 3.2 },
    { id: "furai", btn: "FURAI", title: "MAZDA FURAI", ratio: 3.2 },
    { id: "apollo", btn: "APOLLO IE", title: "APOLLO INTENSA EMOZIONE", ratio: 3.2 }
  ];
  const CREDITS = "Models (CC BY 4.0, Sketchfab): RB22 – Dave Love · AMG GT3 Evo – vecarz · Jesko, FXX-K Evo, Furai, Apollo IE – kevin (sohyalebret)";
  const b64u8 = b => { const s = atob(b), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u };
  async function inflate(b64) { return await new Response(new Blob([b64u8(b64)]).stream().pipeThrough(new DecompressionStream("gzip"))).json() }
  const dq = (b, T) => new T(b64u8(b).buffer);
  function geo(p) {
    const P = dq(p.P, Uint16Array), N = dq(p.N, Int8Array), U = dq(p.U, Uint16Array), I = dq(p.I, Uint16Array), n = p.n;
    const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      for (let k = 0; k < 3; k++) { pos[i * 3 + k] = p.mn[k] + P[i * 3 + k] / 65535 * (p.mx[k] - p.mn[k]); nor[i * 3 + k] = N[i * 3 + k] / 127 }
      uv[i * 2] = p.umn[0] + U[i * 2] / 65535 * (p.umx[0] - p.umn[0]); uv[i * 2 + 1] = p.umn[1] + U[i * 2 + 1] / 65535 * (p.umx[1] - p.umn[1])
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    g.setAttribute("uv", new THREE.BufferAttribute(uv, 2)); g.setIndex(new THREE.BufferAttribute(I, 1)); g.computeBoundingSphere(); return g
  }
  function build(def, D) {
    const tx = D.tex.map(u => { const t = new THREE.TextureLoader().load(u); t.flipY = false; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t });
    const mats = D.mats.map(m => {
      const glass = m.bl && /glass|windscreen|window/i.test(m.n) && !(m.t >= 0 && /sticker/i.test(m.n));
      const M = new THREE.MeshStandardMaterial({ color: new THREE.Color(m.c[0], m.c[1], m.c[2]), roughness: Math.max(m.r, glass ? .05 : .28), metalness: Math.min(m.m, .5), side: (m.ds || m.bl) ? THREE.DoubleSide : THREE.FrontSide });
      if (m.t >= 0) M.map = tx[m.t];
      if (m.bl || m.ta) { M.transparent = !!m.bl; M.opacity = m.a; M.depthWrite = !(glass || m.a < .85); if (m.t >= 0 && m.ta) M.alphaTest = .04 }
      if (m.mk) M.alphaTest = .5;
      if (glass) { M.color.set(0x0b1016); M.opacity = .45; M.metalness = .3; M.roughness = .05; M.map = null; M.alphaTest = 0; M.transparent = true; M.depthWrite = false }
      if (m.em) { M.emissive = new THREE.Color(m.em[0], m.em[1], m.em[2]); const et = m.et >= 0 ? tx[m.et] : M.map; if (et) M.emissiveMap = et; M.emissiveIntensity = 1 }
      M.userData = { k: m.n }; return M
    });
    const mesh = (p, parent) => { const m = new THREE.Mesh(geo(p), mats[p.m]); m.userData.k = D.mats[p.m].n; m.castShadow = false; parent.add(m); return m };
    const c = new THREE.Group(), bd = new THREE.Group(); c.add(bd); c.rotation.order = "YXZ";
    const bodyMeshes = D.g.body.map(p => mesh(p, bd));
    const wh = {}; let maxX = 0, zF = -9, zR = 9;
    for (const k in D.g.wheels) {
      const w = D.g.wheels[k], st = new THREE.Group(), sp = new THREE.Group(); st.position.fromArray(w.c); st.add(sp); bd.add(st);
      w.sp.forEach(p => mesh(p, sp)); w.st.forEach(p => mesh(p, st)); wh[k] = { st, sp, y0: w.c[1] };
      maxX = Math.max(maxX, Math.abs(w.c[0])); zF = Math.max(zF, w.c[2]); zR = Math.min(zR, w.c[2])
    }
    /* steering wheel: pivot on the hub, local +Z = column axis pointing at the driver */
    const sw = D.g.sw, swPar = new THREE.Group(), swSp = new THREE.Group(); let eye = D.eye;
    if (sw) {
      const e1 = new THREE.Vector3().fromArray(sw.B, 0), e2 = new THREE.Vector3().fromArray(sw.B, 3), n = new THREE.Vector3().fromArray(sw.B, 6);
      swPar.position.fromArray(sw.c); swPar.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(e1, e2, n)); swPar.add(swSp); bd.add(swPar);
      sw.prims.forEach(p => mesh(p, swSp))
    }
    /* contact shadow blob */
    { const cv = document.createElement("canvas"); cv.width = cv.height = 64; const g = cv.getContext("2d"), r = g.createRadialGradient(32, 32, 1, 32, 32, 32);
      r.addColorStop(0, "rgba(0,0,0,.85)"); r.addColorStop(.55, "rgba(0,0,0,.4)"); r.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64);
      const csM = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6 }), gg = new THREE.Group();
      const pl = (w, l, x, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, l).rotateX(-Math.PI / 2), csM); m.position.set(x, .012, z); m.renderOrder = 2; gg.add(m) };
      pl(maxX * 2 + .5, zF - zR + 2.4, 0, (zF + zR) / 2); for (const k in wh) { const p = wh[k].st.position; pl(.6, 1.2, p.x, p.z) } c.add(gg) }
    /* booster flame: ONLY from the model's own tailpipe(s)  D.ex = [[x,y,z,diameter_m]] , blowing out towards -Z */
    const fl = new THREE.Group(); fl.userData = { ms: [], sp: [], cx: 0, cy: .4, cz: -1.4 }; fl.visible = false; bd.add(fl);
    { let cx = 0, cy = 0, cz = 0;
      for (const [x, y, z, d] of D.ex) {
        const r = Math.max(.035, d * .6), cone = (rr, L) => new THREE.Mesh(new THREE.CylinderGeometry(.01, rr, L, 16, 1, true).rotateX(-Math.PI / 2).translate(0, 0, -L / 2), FLM), q = [x, y, z + .02],
          m1 = cone(r, 1.9), m2 = cone(r * .5, 1.2), gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, fog: false }));
        m1.position.set(...q); m2.position.set(...q); gl.position.set(q[0], q[1], q[2] - .05); gl.userData.s = r * 7 + .3;
        fl.userData.ms.push(m1, m2); fl.userData.sp.push(gl); fl.add(m1, m2, gl); cx += q[0]; cy += q[1]; cz += q[2] }
      fl.userData.cx = cx / D.ex.length; fl.userData.cy = cy / D.ex.length; fl.userData.cz = cz / D.ex.length }
    c.visible = false; S.add(c);
    const X = { c, wh, pt: [], fl };
    /* driver view: eye + cut-away of the seat / head area; wheel turns with the front wheels */
    const cuts = [], cutOn = { v: false }, E = eye;
    bodyMeshes.forEach(o => { const g = o.geometry, ix = g.index.array, pa = g.attributes.position, keep = [];
      for (let i = 0; i < ix.length; i += 3) { let cx = 0, cy = 0, cz = 0; for (let k = 0; k < 3; k++) { cx += pa.getX(ix[i + k]); cy += pa.getY(ix[i + k]); cz += pa.getZ(ix[i + k]) } cx /= 3; cy /= 3; cz /= 3;
        if (!(Math.abs(cx - E[0]) < .26 && cy > E[1] - .38 && cy < E[1] + .3 && cz > E[2] - .32 && cz < E[2] + .3)) keep.push(ix[i], ix[i + 1], ix[i + 2]) }
      if (keep.length < ix.length) cuts.push({ g, full: g.index, cut: new THREE.BufferAttribute(new Uint16Array(keep), 1) }) });
    X.dv = { q: { e: E }, parts: [], cuts: [], ratio: def.ratio, baked: false, sp: swSp };
    X._cuts = cuts; X._cutOn = cutOn; return X
  }
  async function install(def) {
    const D = await inflate(window.__CD[def.id]); const X = build(def, D), id = def.id;
    Object.defineProperty(CARS, id, { value: X, writable: true, configurable: true, enumerable: false });
    CN[id] = def.btn; TT[id] = def.title; WR[id] = D.wr; ORD.push(id);
    const _set = window.setCar; window.setCar = function (i) { _set(i); X.c.visible = i == id };
    const _apply = window.applyCfg; window.applyCfg = function () { _apply(); for (const k in X.wh) { const w = X.wh[k]; w.st.scale.setScalar(CFG.ws); w.st.position.y = w.by = w.y0 + D.wr * (CFG.ws - 1) } };
    const _ref = window.refreshUI; window.refreshUI = function () { _ref(); if (cur == id) document.querySelectorAll("#opts .row").forEach(r => { r.style.display = ["ws"].includes(r.dataset.rk) ? "" : "none" }) };
    const _dvs = window.dvSteer; window.dvSteer = function () { _dvs(); const on = cur == id && dv && mode != "show"; if (on !== X._cutOn.v) { X._cutOn.v = on; X._cuts.forEach(c => c.g.setIndex(on ? c.cut : c.full)) } };
    const _bfx = window.boostFx; window.boostFx = function (dt) { _bfx(dt); X.fl.visible = cur == id && mode != "show" && P.nb > .05 };
    window.applyCfg(); (window.EXTCARS = window.EXTCARS || {})[id] = X; delete window.__CD[id]
  }
  function credits() {
    const mc = document.getElementById("mc"); if (!mc || document.getElementById("xcr")) return;
    const d = document.createElement("div"); d.id = "xcr"; d.style.cssText = "font:10px/1.4 system-ui,sans-serif;opacity:.55;margin:10px 4px 0;text-align:center"; d.textContent = CREDITS; mc.parentNode.insertBefore(d, mc)
  }
  const built = {}, toast = t => { let e = document.getElementById("xld"); if (!e) { e = document.createElement("div"); e.id = "xld"; e.style.cssText = "position:fixed;z-index:99998;left:50%;top:18%;transform:translateX(-50%);background:rgba(14,17,24,.92);color:#fff;border:1px solid #ffffff30;border-radius:12px;padding:10px 16px;font:600 14px system-ui,sans-serif"; document.body.appendChild(e) } e.textContent = t; e.style.display = t ? "block" : "none" };
  async function ensure(def) { if (built[def.id]) return built[def.id]; return built[def.id] = (async () => { toast("Loading " + def.btn + "…"); await new Promise(r => setTimeout(r, 60)); try { await install(def) } finally { toast("") } })() }
  function releaseCar(id) {
    if (!id || id === "f26") return; const X = CARS[id]; if (!X || !X.c) return;
    X.c.traverse(o => { if (!o.isMesh) return; try { o.geometry.dispose() } catch (e) { }
      (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if (!m) return; ["map", "emissiveMap", "normalMap", "roughnessMap", "metalnessMap", "aoMap", "alphaMap"].forEach(k => { if (m[k] && m[k].dispose) m[k].dispose() }) }) })
  }
  let gHook = false;
  function hookRelease() { if (gHook) return; gHook = true; const _s = window.setCar; window.setCar = function (i) { const prev = cur; _s(i); if (prev && prev !== i) releaseCar(prev) } }
  let firstSel = false, lastErr = "";
  function sync() {   /* keeps the two buttons + status line alive no matter what the game does with #cs */
    hookRelease(); const cs = document.getElementById("cs"); if (!cs) return;
    for (const d of DEFS) {
      if (!built[d.id] && !(window.__CD && window.__CD[d.id])) continue;
      if (!cs.querySelector('[data-c="' + d.id + '"]')) {
        const b = document.createElement("button"); b.dataset.c = d.id; b.textContent = d.btn;
        b.onclick = () => { if (ready) ensure(d).then(() => setCar(d.id)).catch(e => { lastErr = String(e && e.message || e); toast("Car load fail: " + lastErr); setTimeout(() => toast(""), 4000) }) }; cs.append(b) } }
    credits(); const st = document.getElementById("xcr");
    if (st) st.textContent = CREDITS + "  ·  extra cars: " + DEFS.filter(d => built[d.id] || (window.__CD && window.__CD[d.id])).length + "/" + DEFS.length + (lastErr ? "  ·  err: " + lastErr : "");
    if (!firstSel) { firstSel = true; try { const sc = localStorage.getItem("f2008car"), d = DEFS.find(x => x.id == sc); if (d) setTimeout(() => ensure(d).then(() => setCar(d.id)).catch(e => { lastErr = String(e && e.message || e) }), 1500) } catch (e) { } }
  }
  setInterval(() => { try { if (typeof ready !== "undefined" && ready === true) sync() } catch (e) { lastErr = String(e && e.message || e) } }, 1000)
})();
