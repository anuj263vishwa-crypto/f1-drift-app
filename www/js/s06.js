

 
    const TOUCH = matchMedia("(pointer:coarse)").matches || "ontouchstart" in window; if (TOUCH) document.body.classList.add("touch");
    const $ = id => document.getElementById(id), VCAP = 400 / 3.6, VMAX = 111, rnd = Math.random, CS = 22; let RR = __Q.rr;
    const COL = { CARBFER: [0x1a1a1c, .45, .5], F2008_LEFT_NT: [0xc40a0a, .35, .1], F2008_RIGHT_NT: [0xc40a0a, .35, .1], F2008_TOP_NT1: [0xc40a0a, .35, .1], F2008_TOP_NT2: [0xc40a0a, .3, .1], F2008_LEFT_NTB: [0xc40a0a, .35, .1], F2008_RIGHT_NTB: [0xc40a0a, .35, .1], F2008_TOP_NTB1: [0xc40a0a, .35, .1], F2008_LEFT_CL: [0xe8e8e8, .4, .1], FERWIND: [0x0a0c12, .1, .3], MIRROR: [0xcfd4da, .1, 1], TREADBS: [0x111111, .9, 0], RING_FER: [0xd8d8d8, .3, .8], RIM_FER: [0xb8bcc2, .3, .8], FER_BRAKE: [0x555a60, .5, .7], "08BRID": [0x1b1b1b, .8, 0], FERCOVR: [0x2a2a2d, .5, .3], FERCOVRF: [0x2a2a2d, .5, .3], FERCOVLF: [0x2a2a2d, .5, .3], Shaft: [0x888888, .4, .8], LEDSL: [0xff5522, .5, .2] };
    const MT = {}, mat = (k, g) => { const f = k.startsWith("F2008"), key = f ? k + "|" + g : k; if (MT[key]) return MT[key]; const [c, r, m] = COL[k] || [0x999999, .5, .3]; const M = new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m, side: THREE.DoubleSide, transparent: k == "FERWIND", opacity: k == "FERWIND" ? .85 : 1 }); M.userData = { k, g, f }; return MT[key] = M };
    const mkTex = (w, h, f) => { const c = document.createElement("canvas"); c.width = w; c.height = h; f(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t };
    const R = new THREE.WebGLRenderer({ canvas: $("c"), antialias: true }); R.setPixelRatio(Math.min(window.devicePixelRatio || 1, __Q.pr)); R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.15;
    const S = new THREE.Scene(), C = new THREE.PerspectiveCamera(55, 1, .3, 5000);
    S.fog = new THREE.Fog(0xbdd4eb, 120, 850); S.background = new THREE.Color(0xbdd4eb);
    S.add(new THREE.HemisphereLight(0xcfe3ff, 0x5c5a3c, .8));
    const SUN = new THREE.Vector3(300, 500, 200).normalize(), sun = new THREE.DirectionalLight(0xffe8c4, 2.4); sun.castShadow = !!__Q.sh; sun.shadow.mapSize.set(__Q.shs, __Q.shs);
    { const c = sun.shadow.camera; c.left = c.bottom = -38; c.right = c.top = 38; c.near = 10; c.far = 900 } sun.shadow.bias = -.0002; sun.shadow.normalBias = .012; S.add(sun, sun.target);
    const sun2 = new THREE.DirectionalLight(0x99aaff, .4); sun2.position.set(-300, 150, -300); S.add(sun2);
    function rs() { R.setSize(innerWidth, innerHeight, false); C.aspect = innerWidth / innerHeight; C.updateProjectionMatrix(); $("fx").width = innerWidth; $("fx").height = innerHeight } addEventListener("resize", rs); addEventListener("orientationchange", () => setTimeout(rs, 200)); if (window.visualViewport) visualViewport.addEventListener("resize", rs); rs();

    /* ---------- world ---------- */
    const world = new THREE.Group(); S.add(world);
    function mergeG(gs) { const p = [], n = []; gs.forEach(g => { g = g.toNonIndexed(); for (const v of g.attributes.position.array) p.push(v); for (const v of g.attributes.normal.array) n.push(v) }); const m = new THREE.BufferGeometry(); m.setAttribute("position", new THREE.Float32BufferAttribute(p, 3)); m.setAttribute("normal", new THREE.Float32BufferAttribute(n, 3)); return m }
    function asphalt(g, w, h, tint) {
      g.fillStyle = tint || "#3a3c40"; g.fillRect(0, 0, w, h); for (let i = 0; i < w * h / 5; i++) { const v = 40 + rnd() * 45 | 0; g.fillStyle = "rgba(" + (v + 6) + "," + (v + 6) + "," + (v + 10) + "," + (.25 + rnd() * .35) + ")"; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 1.6, 1 + rnd() * 1.6) }
      for (let i = 0; i < 16; i++) { g.fillStyle = rnd() < .5 ? "rgba(0,0,0,.07)" : "rgba(255,255,255,.035)"; g.fillRect(rnd() * w, rnd() * h, 20 + rnd() * 90, 10 + rnd() * 60) }
      g.strokeStyle = "rgba(8,8,10,.4)"; g.lineWidth = 1; for (let i = 0; i < 0; i++) { let x = rnd() * w, y = rnd() * h; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 8; k++) { x += (rnd() - .5) * 30; y += rnd() * 25; g.lineTo(x, y) } g.stroke() }
    }
    const nzT = mkTex(64, 64, (g, w, h) => { for (let i = 0; i < w; i++)for (let j = 0; j < h; j++) { const v = rnd() * 255 | 0; g.fillStyle = "rgb(" + v + "," + v + "," + v + ")"; g.fillRect(i, j, 1, 1) } });
    const winT = mkTex(64, 64, (g, w, h) => { g.fillStyle = "#b8b3a8"; g.fillRect(0, 0, w, h); const gr = g.createLinearGradient(0, 14, 0, 46); gr.addColorStop(0, "#5d7388"); gr.addColorStop(1, "#1f2a36"); g.fillStyle = "#8d887e"; g.fillRect(9, 11, 46, 38); g.fillStyle = gr; g.fillRect(12, 14, 40, 32); g.fillStyle = "#8d887e"; g.fillRect(31, 14, 2, 32) });
    const gt = mkTex(512, 512, (g, w, h) => { g.fillStyle = "#46703a"; g.fillRect(0, 0, w, h); for (let i = 0; i < 15000; i++) { g.fillStyle = "hsla(" + (80 + rnd() * 45) + "," + (35 + rnd() * 25) + "%," + (20 + rnd() * 22) + "%," + (.35 + rnd() * .5) + ")"; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 1.3, 2 + rnd() * 4) } for (let i = 0; i < 260; i++) { g.fillStyle = "rgba(" + (110 + rnd() * 40 | 0) + "," + (95 + rnd() * 30 | 0) + ",60,.22)"; g.beginPath(); g.arc(rnd() * w, rnd() * h, 2 + rnd() * 7, 0, 6.3); g.fill() } });
    gt.repeat.set(250, 250);
    const gmat = new THREE.MeshStandardMaterial({ map: gt, roughness: 1, side: THREE.DoubleSide });
    gmat.onBeforeCompile = sh => {
      sh.uniforms.nz = { value: nzT };
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vW;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvW=(modelMatrix*vec4(transformed,1.)).xyz;");
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vW;uniform sampler2D nz;").replace("#include <map_fragment>", "#include <map_fragment>\nfloat n=texture2D(nz,vW.xz/600.).r*.6+texture2D(nz,vW.xz/97.).r*.4;diffuseColor.rgb*=.62+.76*n;float mm=texture2D(nz,vW.xz/1800.+.3).r,m2=texture2D(nz,vW.xz/420.+.7).r;diffuseColor.rgb*=mix(vec3(.88,1.05,.86),vec3(1.2,1.06,.7),smoothstep(.3,.72,mm))*(.92+.16*m2);")
    };
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000).rotateX(-Math.PI / 2), gmat); ground.receiveShadow = true; world.add(ground);

    /* ===== ROADFX: procedural albedo+normal+roughness ===== */
    const RAIN = { on: false }, RW = { value: 0 };
    function nrmTex(gh, w, h, s) {
      const d = gh.getImageData(0, 0, w, h).data, o = gh.createImageData(w, h), H = (x, y) => d[(((y + h) % h) * w + ((x + w) % w)) * 4];
      for (let y = 0; y < h; y++)for (let x = 0; x < w; x++) { const dx = (H(x + 1, y) - H(x - 1, y)) * s / 255, dy = (H(x, y + 1) - H(x, y - 1)) * s / 255, l = Math.hypot(dx, dy, 1), i = (y * w + x) * 4; o.data[i] = (-dx / l * .5 + .5) * 255; o.data[i + 1] = (dy / l * .5 + .5) * 255; o.data[i + 2] = (.5 / l + .5) * 255; o.data[i + 3] = 255 }
      const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").putImageData(o, 0, 0); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t
    }
    function roadTex(w, h, tint, lanes, mark) {
      const C2 = () => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c }, ca = C2(), ch = C2(), cr = C2(), a = ca.getContext("2d"), e = ch.getContext("2d"), r = cr.getContext("2d"), T = c => { const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t };
      asphalt(a, w, h, tint); e.fillStyle = "#808080"; e.fillRect(0, 0, w, h); r.fillStyle = "#fff"; r.fillRect(0, 0, w, h);
      for (let i = 0; i < w * h / 2.5; i++) { const v = 85 + rnd() * 90 | 0; e.fillStyle = "rgb(" + v + "," + v + "," + v + ")"; e.fillRect(rnd() * w, rnd() * h, 1 + rnd(), 1 + rnd()) }
      const g1 = a.createLinearGradient(0, 0, w, 0), g2 = r.createLinearGradient(0, 0, w, 0); lanes.forEach(([p, q]) => { g1.addColorStop(p, "rgba(0,0,0," + q * 1.4 + ")"); g2.addColorStop(p, "rgba(150,150,150," + Math.min(1, q * 3) + ")") }); a.fillStyle = g1; a.fillRect(0, 0, w, h); r.fillStyle = g2; r.fillRect(0, 0, w, h);
      for (let i = 0; i < 5; i++) { const x = rnd() * w, y = rnd() * h, pw = 30 + rnd() * 70, ph = 40 + rnd() * 110; a.fillStyle = "rgba(18,18,22,.45)"; a.fillRect(x, y, pw, ph); e.strokeStyle = "#c8c8c8"; e.lineWidth = 2; e.strokeRect(x, y, pw, ph); r.fillStyle = "rgb(170,170,170)"; r.fillRect(x, y, pw, ph) }
      for (let i = 0; i < 0; i++) {
        let x = rnd() * w, y = rnd() * h; const pt = [[x, y]]; for (let k = 0; k < 9; k++) { x += (rnd() - .5) * 26; y += 4 + rnd() * 24; pt.push([x, y]) }
        for (const [g, c, lw] of [[a, "rgba(6,6,8,.65)", 1.2], [e, "#000", 2.4]]) { g.strokeStyle = c; g.lineWidth = lw; g.beginPath(); pt.forEach((p, k) => k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke() }
      }
      for (let i = 0; i < 8; i++) { const x = rnd() * w, y = rnd() * h, rr = 6 + rnd() * 16; for (const [g, c0] of [[a, "rgba(0,0,0,.6)"], [r, "rgba(30,30,30,.95)"]]) { const q = g.createRadialGradient(x, y, 0, x, y, rr); q.addColorStop(0, c0); q.addColorStop(1, c0.replace(/[\d.]+\)$/, "0)")); g.fillStyle = q; g.fillRect(x - rr, y - rr, rr * 2, rr * 2) } }
      mark(a, w, h); return { a: T(ca), n: nrmTex(e, w, h, 2), r: T(cr) }
    }
    const rt = mkTex(256, 512, (g, w, h) => {
      asphalt(g, w, h); g.fillStyle = "#6b5d45"; g.fillRect(0, 0, 14, h); g.fillRect(w - 14, 0, 14, h);
      const gr = g.createLinearGradient(14, 0, w - 14, 0);[[.14, 0], [.24, .22], [.34, 0], [.66, 0], [.76, .22], [.86, 0]].forEach(([a, b]) => gr.addColorStop(a, "rgba(0,0,0," + b + ")")); g.fillStyle = gr; g.fillRect(14, 0, w - 28, h);
      g.fillStyle = "#e8e6df"; g.fillRect(24, 0, 4, h); g.fillRect(w - 28, 0, 4, h); g.fillRect(w / 2 - 2, 0, 4, h * .45)
    }); rt.repeat.set(1, 250);
    const rmA = new THREE.MeshStandardMaterial({ map: rt, roughness: .85, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const rmB = rmA.clone(); rmB.polygonOffsetFactor = rmB.polygonOffsetUnits = -3;
    const roads = []; for (let k = -2; k <= 2; k++) { const a = new THREE.Mesh(new THREE.PlaneGeometry(22, 6000).rotateX(-Math.PI / 2), rmA); a.userData = { ax: "z", k }; const b = new THREE.Mesh(new THREE.PlaneGeometry(22, 6000).rotateX(-Math.PI / 2).rotateY(Math.PI / 2), rmB); b.userData = { ax: "x", k }; a.receiveShadow = b.receiveShadow = true; roads.push(a, b); world.add(a, b) }
    /* sky, clouds, hills */
    const sky = new THREE.Mesh(new THREE.SphereGeometry(4000, 32, 16), new THREE.ShaderMaterial({
      uniforms: { sun: { value: SUN } }, side: THREE.BackSide, depthWrite: false, fog: false,
      vertexShader: "varying vec3 d;void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: "varying vec3 d;uniform vec3 sun;void main(){float h=clamp(d.y,0.,1.);vec3 hz=vec3(.74,.83,.92),md=vec3(.36,.58,.86),zn=vec3(.1,.28,.64);vec3 c=mix(hz,md,smoothstep(0.,.28,h));c=mix(c,zn,smoothstep(.22,.9,h));float s=max(dot(normalize(d),sun),0.);c+=vec3(1.,.78,.5)*pow(s,5.)*.1*(1.-h*.6)+vec3(1.,.85,.6)*pow(s,22.)*.35+vec3(1.,.95,.85)*pow(s,700.)*4.;c=mix(c,hz*1.04,exp(-h*14.)*.5);if(d.y<0.)c=hz*.92;gl_FragColor=vec4(c,1.);}"
    }));
    sky.renderOrder = -1; world.add(sky);
    const cloudT = mkTex(256, 128, (g, w, h) => { for (let i = 0; i < 24; i++) { const x = 40 + rnd() * 176, y = 40 + rnd() * 50, r = 20 + rnd() * 30, q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, "rgba(255,255,255,.55)"); q.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = q; g.fillRect(0, 0, w, h) } });
    const clouds = new THREE.Group(); for (let i = 0; i < 30; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudT, transparent: true, depthWrite: false, fog: false, opacity: .45 + rnd() * .45 })), a = rnd() * 6.283, r = 1200 + rnd() * 2200; s.position.set(Math.cos(a) * r, 450 + rnd() * 350, Math.sin(a) * r); s.scale.set(900 + rnd() * 500, 450, 1); clouds.add(s) } world.add(clouds);
    function ridge(Rr, h0, h1, top, sd) {
      const g = new THREE.CylinderGeometry(Rr, Rr, 1, 160, 3, true), p = g.attributes.position, c = [], hz = new THREE.Color(0xbdd4eb), tc = new THREE.Color(top);
      for (let i = 0; i < p.count; i++) { const a = Math.atan2(p.getZ(i), p.getX(i)), hh = h0 + (h1 - h0) * (.5 + .5 * (Math.sin(a * 3 + sd) * .5 + Math.sin(a * 7 + sd * 2.3) * .3 + Math.sin(a * 19 + sd * 3.7) * .2)), y = p.getY(i) + .5; p.setY(i, y * hh - 20); const q = hz.clone().lerp(tc, Math.pow(y, .7)); c.push(q.r, q.g, q.b) }
      g.setAttribute("color", new THREE.Float32BufferAttribute(c, 3)); return new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false }))
    }
    const mount = new THREE.Group(); mount.add(ridge(1500, 50, 140, 0x4f7050, 1.3), ridge(2800, 250, 520, 0x8497ad, 4.1)); world.add(mount);
    /* instanced trees & buildings */
    function BUSHGEO() {
      let sd = 7; const R = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647 }, M = THREE.Matrix4, gs = [];
      const rot = (yaw, el, roll) => new M().makeRotationY(yaw).multiply(new M().makeRotationX(-el)).multiply(new M().makeRotationZ(roll));
      /* leaves: flat blades of different length / width / thickness, spread outward and upward */
      for (let i = 0; i < 26; i++) {
        const L = .4 + R() * .55, W = .06 + R() * .17, T = .02 + R() * .05, g = new THREE.OctahedronGeometry(1, 0).scale(W, T, L * .5).translate(0, 0, L * .5);
        g.applyMatrix4(rot(R() * 6.283, .25 + R() * 1.15, (R() - .5) * 1.2)); g.translate((R() - .5) * .25, .08 + R() * .15, (R() - .5) * .25); gs.push(g)
      }
      /* a few thin woody stems at the base */
      for (let i = 0; i < 4; i++) { const g = new THREE.CylinderGeometry(.015, .035, .5, 4).translate(0, .25, 0); g.applyMatrix4(rot(R() * 6.283, .9 + R() * .5, 0)); gs.push(g) }
      const P = [], N = []; for (const g of gs) { const h = g.index ? g.toNonIndexed() : g; for (const v of h.attributes.position.array) P.push(v); for (const v of h.attributes.normal.array) N.push(v) }
      const m = new THREE.BufferGeometry(); m.setAttribute("position", new THREE.Float32BufferAttribute(P, 3)); m.setAttribute("normal", new THREE.Float32BufferAttribute(N, 3)); return m
    }
    const MAXI = (2 * RR + 1) ** 2, sm = () => new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true });
    const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(.35, .55, 4, 6).translate(0, 2, 0), new THREE.MeshStandardMaterial({ color: 0x4a3524, roughness: 1 }), MAXI);
    const crownP = new THREE.InstancedMesh(mergeG([new THREE.ConeGeometry(3.2, 5, 8).translate(0, 4.3, 0), new THREE.ConeGeometry(2.5, 4.5, 8).translate(0, 7, 0), new THREE.ConeGeometry(1.7, 4, 8).translate(0, 9.4, 0)]), sm(), MAXI);
    const crownD = new THREE.InstancedMesh(mergeG([new THREE.IcosahedronGeometry(2.8, 1).translate(0, 6.2, 0), new THREE.IcosahedronGeometry(2.1, 1).translate(1.6, 5.2, .6), new THREE.IcosahedronGeometry(2.2, 1).translate(-1.4, 5.6, -.8)]), sm(), MAXI);
    const uT = { value: 0 };[crownP, crownD].forEach(m => { m.material.onBeforeCompile = sh => { sh.uniforms.uT = uT; sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nuniform float uT;").replace("#include <begin_vertex>", "#include <begin_vertex>\n{float ph=instanceMatrix[3].x*.21+instanceMatrix[3].z*.17,k=max(position.y-3.,0.)*.011;transformed.x+=(sin(uT*1.7+ph)+.5*sin(uT*3.1+ph*2.))*k;transformed.z+=cos(uT*1.4+ph*1.3)*k*.7;}") } });
    /* ---- booster FX ---- */
    const FLM = new THREE.ShaderMaterial({
      uniforms: { uT: { value: 0 }, uI: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
      vertexShader: "varying vec2 vU;varying vec3 vN,vV;void main(){vU=uv;vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}",
      fragmentShader: "varying vec2 vU;varying vec3 vN,vV;uniform float uT,uI;void main(){float v=vU.y,f=pow(abs(dot(normalize(vN),normalize(vV))),1.1),fl=.72+.28*sin(v*38.-uT*70.)*sin(v*11.+uT*37.),dm=.8+.2*sin(v*22.);vec3 c=mix(vec3(1.,.97,.9),vec3(.3,.6,1.),smoothstep(0.,.4,v));c=mix(c,vec3(.12,.25,1.),smoothstep(.45,1.,v));gl_FragColor=vec4(c*1.7,f*pow(1.-v,1.3)*fl*dm*uI);}"
    });
    const glowT = mkTex(64, 64, (g, w, h) => { const q = g.createRadialGradient(32, 32, 0, 32, 32, 32); q.addColorStop(0, "rgba(255,255,255,1)"); q.addColorStop(.22, "rgba(130,190,255,.75)"); q.addColorStop(.6, "rgba(50,100,255,.22)"); q.addColorStop(1, "rgba(30,70,255,0)"); g.fillStyle = q; g.fillRect(0, 0, 64, 64) });
    const NP = 100, npP = new Float32Array(NP * 3).fill(-999), npA = new Float32Array(NP), npV = new Float32Array(NP * 3), npL = new Float32Array(NP); let npI = 0;
    const npG = new THREE.BufferGeometry(); npG.setAttribute("position", new THREE.BufferAttribute(npP, 3).setUsage(THREE.DynamicDrawUsage)); npG.setAttribute("a", new THREE.BufferAttribute(npA, 1).setUsage(THREE.DynamicDrawUsage));
    const npM = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, uniforms: { uK: { value: 600 } }, vertexShader: "attribute float a;varying float vA;uniform float uK;void main(){vA=a;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=uK*(.02+.05*a)/max(-mv.z,.5);gl_Position=projectionMatrix*mv;}", fragmentShader: "varying float vA;void main(){float r=length(gl_PointCoord-.5);if(r>.5)discard;gl_FragColor=vec4(mix(vec3(1.,.3,.04),vec3(1.,.88,.55),vA),vA*(1.-r*2.));}" });
    const npPts = new THREE.Points(npG, npM); npPts.frustumCulled = false; npPts.renderOrder = 6; S.add(npPts);
    const nLight = new THREE.PointLight(0x78b4ff, 0, 10, 2); S.add(nLight); const _v1 = new THREE.Vector3(), _v2 = new THREE.Vector3();
    /* har car ke asli exhaust/silencer ki jagah [x,y,z,diameter] mm me (model coords) -- adjust karna ho to yahi edit karo */
    const EXH = { f60: [[0, 371, -2550, 100]], f26: [[0, 524, -1280, 74]], rb: [[0, 628, -1534, 90]], rc13: [[0, 294, -1981, 70]], c44: [[-3, 502, -1398, 95]], bol: [[-107, 506, -1898, 104], [107, 506, -1898, 104], [-107, 648, -1898, 104], [107, 648, -1898, 104]], cf: [[0, 88, -2304, 100]], pt2: [[0, 496, -1960, 80]], fp: [[-3.9, 580.2, -2414.0, 76.0]], w17: [[0, 470, -2200, 70]], w13: [[0, 632, -2470, 60]], sb: [[0, 520, -2350, 70]], w20: [[0, 554, -2246, 90]] };
    function boostFx(dt) {
      const on = mode != "show" && P.nb > .05 && car && CARS[cur] && CARS[cur].fl; FLM.uniforms.uT.value = T; FLM.uniforms.uI.value = P.nb;
      for (const k in CARS) { const f = CARS[k].fl; if (f) f.visible = !!on && k == cur }
      if (on) {
        const f = CARS[cur].fl, u = f.userData, len = P.nb * (.7 + .5 * P.bt / .6) * (1 + .14 * Math.sin(T * 85)); u.ms.forEach(m => m.scale.set(1, 1, len)); u.sp.forEach(s => s.scale.setScalar(s.userData.s * (1.05 + .5 * P.bt / .6) * P.nb * (1 + .2 * Math.sin(T * 60))));
        car.updateMatrixWorld(true); f.localToWorld(_v2.set(u.cx, u.cy, u.cz - .5)); nLight.position.copy(_v2); nLight.intensity = P.nb * 5 * (.85 + .15 * Math.sin(T * 70))
      } else nLight.intensity = 0
    }
    const bmat = new THREE.MeshStandardMaterial({ roughness: .85 });
    bmat.onBeforeCompile = sh => {
      sh.uniforms.win = { value: winT };
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vW;").replace("#include <project_vertex>", "#include <project_vertex>\nvW=(modelMatrix*instanceMatrix*vec4(transformed,1.)).xyz;");
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vW;uniform sampler2D win;").replace("#include <color_fragment>", "#include <color_fragment>\nvec3 nrm=normalize(cross(dFdx(vW),dFdy(vW)));float sd=1.-abs(nrm.y);diffuseColor.rgb*=mix(vec3(1.),texture2D(win,vec2((vW.x+vW.z)/5.5,vW.y/3.6)).rgb*1.25,sd);")
    };
    const bldInst = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1).translate(0, .5, 0), bmat, MAXI);
    [trunk, crownP, crownD, bldInst].forEach(m => { m.frustumCulled = false; m.castShadow = m.receiveShadow = true; world.add(m) });
    const bush = new THREE.InstancedMesh(BUSHGEO(), sm(), MAXI), rock = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0).scale(1.3, .7, 1).translate(0, .35, 0), sm(), MAXI);
    [bush, rock].forEach(m => { m.frustumCulled = false; m.receiveShadow = true; world.add(m) });
    const studio = new THREE.Group(); S.add(studio);
    studio.add(new THREE.Mesh(new THREE.CircleGeometry(7, 64).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x1a1f2b, transparent: true, opacity: .55, side: THREE.DoubleSide })));
    const gh = new THREE.GridHelper(30, 30, 0x445066, 0x232a38); gh.position.y = -.01; studio.add(gh);
    studio.add(new THREE.Mesh(new THREE.RingGeometry(6.6, 7, 64).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xe10600, side: THREE.DoubleSide })));

    /* ---------- track ---------- */
    /* NEW CIRCUIT (4.9 km): main straight, T1, 4-flick esses, fast sweeper, hairpin bite, double-apex finish */
    /* CIRCUIT v2 (6 km): figure-8 crossover bridge, hairpin, esses, tunnel, big elevation */
    const TP = [[0.0,-300.0],[0.0,-277.6],[0.0,-255.3],[0.0,-232.9],[0.0,-210.6],[0.0,-188.2],[0.0,-165.9],[0.0,-143.5],[0.0,-121.2],[0.0,-98.8],[0.0,-76.5],[0.0,-54.1],[0.0,-31.8],[0.0,-9.4],[0.0,12.9],[0.0,35.3],[0.0,57.6],[0.0,80.0],[0.0,102.4],[0.0,124.7],[0.0,147.1],[0.0,169.4],[0.0,191.8],[0.0,214.1],[0.0,236.5],[0.0,258.8],[0.0,281.2],[0.0,303.5],[0.0,325.9],[0.0,348.2],[0.0,370.6],[0.0,392.9],[0.0,415.3],[0.0,437.6],[0.0,460.0],[0.6,484.4],[2.4,508.8],[5.4,533.0],[9.5,557.1],[14.9,581.0],[23.9,603.2],[38.7,622.0],[58.2,635.9],[80.8,643.8],[104.7,645.1],[129.6,642.9],[154.5,640.7],[182.7,645.1],[205.7,661.9],[225.7,677.2],[250.2,682.6],[274.7,677.2],[294.6,661.9],[314.5,646.6],[339.0,641.2],[363.5,646.6],[383.5,661.9],[406.5,678.8],[434.7,683.1],[456.9,681.2],[479.2,679.2],[501.5,677.3],[523.8,675.3],[546.1,673.4],[568.4,671.4],[590.7,669.5],[613.0,667.5],[635.3,665.6],[657.6,663.6],[679.9,661.7],[702.2,659.7],[724.5,657.8],[746.8,655.8],[769.1,653.9],[791.4,651.9],[813.7,650.0],[836.0,648.0],[858.3,646.1],[880.6,644.1],[902.9,642.2],[930.1,638.9],[957.2,633.8],[983.8,627.0],[1009.9,618.4],[1036.0,609.9],[1062.6,603.1],[1089.7,598.0],[1116.9,594.7],[1146.8,592.1],[1176.7,589.5],[1198.7,586.9],[1220.4,583.1],[1242.0,578.0],[1263.1,571.6],[1283.9,564.1],[1304.2,555.3],[1323.9,545.4],[1343.1,534.3],[1361.6,522.2],[1381.6,505.4],[1398.4,485.4],[1411.5,462.7],[1420.2,442.0],[1427.3,420.8],[1432.9,399.0],[1436.8,376.9],[1439.0,354.6],[1439.6,332.2],[1438.4,309.8],[1438.3,308.8],[1437.2,286.5],[1437.6,264.1],[1439.5,241.9],[1443.0,219.8],[1448.0,198.1],[1454.6,176.7],[1462.6,155.9],[1470.6,135.0],[1477.1,113.7],[1482.1,91.9],[1485.6,69.8],[1487.6,47.6],[1488.0,25.2],[1486.8,2.9],[1484.4,-24.4],[1482.0,-51.7],[1483.0,-75.1],[1490.1,-97.5],[1502.7,-117.4],[1520.0,-133.2],[1540.9,-144.1],[1563.8,-149.2],[1585.9,-156.3],[1602.6,-172.2],[1610.8,-193.9],[1608.8,-216.9],[1597.0,-236.8],[1577.7,-249.6],[1554.8,-252.8],[1532.2,-249.0],[1510.4,-241.9],[1490.0,-231.6],[1471.4,-218.3],[1452.8,-204.9],[1432.4,-194.6],[1410.7,-187.5],[1388.1,-183.7],[1363.2,-181.5],[1338.3,-179.4],[1313.4,-177.2],[1288.5,-175.0],[1265.0,-176.6],[1243.3,-185.4],[1225.3,-200.5],[1212.9,-220.4],[1207.2,-243.2],[1205.2,-265.6],[1203.3,-288.0],[1201.3,-310.4],[1199.4,-332.8],[1198.7,-356.1],[1200.7,-379.3],[1205.4,-402.0],[1210.1,-424.8],[1212.1,-448.0],[1211.5,-471.2],[1206.1,-495.4],[1194.6,-517.4],[1177.9,-535.7],[1157.0,-549.1],[1133.3,-556.5],[1108.5,-557.6],[1086.6,-555.7],[1064.6,-553.8],[1042.6,-551.8],[1020.7,-549.9],[998.7,-548.0],[976.7,-546.1],[954.7,-544.1],[932.8,-542.2],[910.8,-540.3],[888.8,-538.4],[866.8,-536.5],[844.9,-534.5],[822.9,-532.6],[800.9,-530.7],[779.0,-528.8],[757.0,-526.8],[735.0,-524.9],[713.0,-523.0],[691.1,-521.1],[669.1,-519.1],[647.1,-517.2],[625.1,-515.3],[603.2,-513.4],[581.2,-511.5],[559.2,-509.5],[537.3,-507.6],[515.3,-505.7],[491.1,-507.8],[469.0,-518.1],[451.8,-535.3],[434.6,-552.5],[412.6,-562.7],[388.4,-564.9],[358.5,-562.2],[328.6,-559.6],[305.7,-554.5],[284.8,-543.7],[267.5,-527.8],[254.9,-508.0],[247.8,-485.6],[246.8,-462.1],[248.9,-437.9],[251.0,-413.7],[253.2,-389.5],[255.3,-365.4],[257.4,-341.2],[259.5,-317.0],[261.6,-292.8],[258.7,-265.6],[245.5,-241.7],[224.2,-224.6],[198.0,-216.9],[176.1,-215.0],[154.2,-213.1],[132.2,-211.2],[110.3,-209.3],[88.4,-207.4],[66.5,-205.4],[44.6,-203.5],[22.7,-201.6],[0.7,-199.7],[-21.2,-197.8],[-43.1,-195.8],[-65.0,-193.9],[-86.9,-192.0],[-108.8,-190.1],[-130.8,-188.2],[-157.9,-191.2],[-181.8,-204.3],[-198.9,-225.6],[-206.6,-251.8],[-210.1,-291.7],[-207.1,-318.8],[-194.0,-342.8],[-172.7,-359.9],[-146.4,-367.5],[-116.6,-370.1],[-86.7,-372.7],[-61.7,-371.0],[-38.5,-361.6],[-19.3,-345.5],[-6.1,-324.3]].map(p => new THREE.Vector3(p[0], 0, p[1]));
    const crv0 = new THREE.CatmullRomCurve3(TP, true, "centripetal"), N = 900; let SP = crv0.getSpacedPoints(N); SP.pop();
    /* turn radius badhaya: track ko low-pass smooth karo (W = window, PASS = kitni baar). Aur halka curve chahiye to W/PASS badhao */
    { const W = 4, PASS = 1; for (let ps = 0; ps < PASS; ps++) { const n = SP.length, o = []; for (let i = 0; i < n; i++) { let x = 0, z = 0, c = 0; for (let j = -W; j <= W; j++) { const wt = 1 - Math.abs(j) / (W + 1), r = SP[(i + j + n) % n]; x += r.x * wt; z += r.z * wt; c += wt } o.push(new THREE.Vector3(x / c, 0, z / c)) } SP = o } }
    const crv = new THREE.CatmullRomCurve3(SP.filter((_, i) => i % 5 == 0), true, "centripetal"); SP = crv.getSpacedPoints(N); SP.pop(); const DS = crv.getLength() / N, L0 = 60;
    const TN = [], LF = [], CV = [];
    for (let i = 0; i < N; i++) { const a = SP[(i + 1) % N], b = SP[(i - 1 + N) % N], dx = a.x - b.x, dz = a.z - b.z, l = Math.hypot(dx, dz); TN.push([dx / l, dz / l]); LF.push([dz / l, -dx / l]) }
    for (let i = 0; i < N; i++) { const a = TN[i], b = TN[(i + 1) % N]; CV.push(Math.abs(Math.atan2(a[0] * b[1] - a[1] * b[0], a[0] * b[0] + a[1] * b[1])) / DS) }

    /* ===== ELEVATION + BANKING ===== */
    const ELT = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.06,0.11,0.17,0.25,0.34,0.46,0.59,0.73,0.9,1.07,1.27,1.47,1.69,1.91,2.15,2.39,2.63,2.88,3.12,3.37,3.61,3.85,4.09,4.31,4.53,4.73,4.93,5.1,5.27,5.41,5.54,5.66,5.75,5.83,5.89,5.94,5.99,6.02,6.06,6.11,6.16,6.23,6.3,6.39,6.49,6.6,6.73,6.86,7.01,7.17,7.34,7.51,7.7,7.89,8.1,8.3,8.52,8.74,8.96,9.19,9.42,9.65,9.88,10.12,10.35,10.58,10.81,11.04,11.26,11.48,11.7,11.9,12.11,12.3,12.49,12.66,12.83,12.99,13.14,13.27,13.4,13.51,13.61,13.7,13.77,13.84,13.89,13.93,13.96,13.99,14.01,14.03,14.06,14.09,14.13,14.17,14.22,14.28,14.34,14.41,14.49,14.58,14.67,14.77,14.87,14.98,15.1,15.22,15.35,15.49,15.62,15.77,15.92,16.07,16.22,16.38,16.54,16.71,16.87,17.04,17.21,17.39,17.56,17.74,17.91,18.09,18.26,18.44,18.61,18.79,18.96,19.13,19.29,19.46,19.62,19.78,19.93,20.08,20.23,20.38,20.51,20.65,20.78,20.9,21.02,21.13,21.23,21.33,21.42,21.51,21.59,21.66,21.72,21.78,21.83,21.87,21.91,21.94,21.96,21.98,21.99,22.01,22.02,22.04,22.06,22.09,22.11,22.15,22.18,22.23,22.27,22.32,22.37,22.43,22.49,22.55,22.62,22.68,22.75,22.82,22.89,22.96,23.04,23.11,23.18,23.25,23.32,23.38,23.45,23.51,23.57,23.63,23.68,23.73,23.77,23.82,23.85,23.89,23.91,23.94,23.96,23.97,23.98,23.99,24.0,24.01,24.02,24.03,24.04,24.05,24.07,24.08,24.1,24.12,24.15,24.17,24.2,24.23,24.26,24.29,24.33,24.36,24.4,24.44,24.48,24.52,24.56,24.6,24.65,24.69,24.74,24.79,24.83,24.88,24.93,24.98,25.02,25.07,25.12,25.17,25.21,25.26,25.31,25.35,25.4,25.44,25.48,25.52,25.56,25.6,25.64,25.67,25.71,25.74,25.77,25.8,25.83,25.85,25.88,25.9,25.92,25.93,25.95,25.96,25.97,25.98,25.99,25.99,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,26.0,25.99,25.97,25.94,25.88,25.78,25.63,25.43,25.18,24.87,24.52,24.14,23.74,23.32,22.89,22.46,22.03,21.6,21.17,20.74,20.31,19.88,19.45,19.02,18.59,18.16,17.73,17.3,16.87,16.44,16.01,15.58,15.15,14.72,14.29,13.85,13.42,12.99,12.56,12.13,11.7,11.27,10.84,10.41,9.98,9.55,9.12,8.69,8.26,7.83,7.4,6.97,6.55,6.15,5.77,5.43,5.14,4.91,4.74,4.63,4.58,4.56,4.56,4.58,4.61,4.64,4.66,4.69,4.72,4.75,4.77,4.8,4.82,4.84,4.86,4.88,4.9,4.92,4.93,4.95,4.96,4.97,4.98,4.99,5.0,5.01,5.03,5.06,5.1,5.15,5.22,5.3,5.4,5.51,5.64,5.78,5.93,6.09,6.26,6.44,6.62,6.81,7.0,7.19,7.38,7.56,7.74,7.91,8.07,8.22,8.36,8.49,8.6,8.7,8.78,8.85,8.9,8.95,8.99,9.02,9.05,9.09,9.14,9.19,9.25,9.32,9.41,9.5,9.59,9.7,9.81,9.93,10.05,10.18,10.31,10.43,10.57,10.69,10.82,10.95,11.07,11.19,11.3,11.41,11.5,11.59,11.68,11.75,11.81,11.86,11.9,11.93,11.95,11.95,11.95,11.93,11.9,11.86,11.81,11.75,11.67,11.59,11.49,11.39,11.28,11.15,11.02,10.88,10.74,10.58,10.42,10.26,10.09,9.91,9.73,9.55,9.37,9.19,9.0,8.81,8.63,8.45,8.27,8.09,7.91,7.74,7.58,7.42,7.26,7.12,6.98,6.85,6.72,6.61,6.51,6.41,6.33,6.25,6.19,6.13,6.07,6.01,5.94,5.85,5.75,5.62,5.48,5.33,5.19,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.18,5.33,5.51,5.72,5.96,6.23,6.5,6.77,7.03,7.27,7.48,7.64,7.77,7.86,7.92,7.96,7.98,7.99,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.0,8.01,8.01,8.02,8.03,8.04,8.06,8.08,8.1,8.13,8.17,8.21,8.25,8.3,8.35,8.4,8.46,8.53,8.59,8.66,8.73,8.81,8.88,8.96,9.05,9.13,9.22,9.3,9.39,9.48,9.57,9.66,9.75,9.84,9.93,10.02,10.11,10.2,10.28,10.37,10.45,10.54,10.62,10.69,10.77,10.84,10.91,10.97,11.04,11.1,11.15,11.2,11.25,11.29,11.33,11.37,11.4,11.42,11.44,11.46,11.47,11.48,11.49,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.5,11.46,11.42,11.36,11.28,11.17,11.04,10.87,10.68,10.47,10.24,10.0,9.75,9.5,9.26,9.03,8.82,8.63,8.46,8.31,8.19,8.07,7.96,7.85,7.71,7.54,7.34,7.09,6.81,6.5,6.15,5.78,5.39,5.0,4.61,4.22,3.85,3.5,3.19,2.91,2.66,2.46,2.28,2.14,2.01,1.89,1.76,1.62,1.46,1.28,1.1,0.9,0.72,0.54,0.39,0.27,0.17,0.1,0.06,0.03,0.01,0.01,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]; /* designed height profile (m) */
    const EL = new Float32Array(N), BK = new Float32Array(N), SCV = [];
    {
      const Rr = [[11, 1, .6], [6, 2, 1.9], [3.5, 4, 0], [2.5, 7, .4]], sh = []; let mn = 1e9; for (let i = 0; i < N; i++) { let v = 0; for (const [a, f, p] of Rr) v += a * Math.sin(6.2832 * f * i / N + p); sh.push(v); mn = Math.min(mn, v) }
      const wn = i => { const d = Math.abs(i - L0), t = Math.min(1, Math.max(0, (Math.min(d, N - d) - 45) / 110)); return t * t * (3 - 2 * t) };
      for (let i = 0; i < N; i++) { EL[i] = ELT[i]; const a = TN[i], b = TN[(i + 1) % N]; SCV.push((a[0] * b[1] - a[1] * b[0]) / DS) }
      let sc = SCV.slice(); for (let p = 0; p < 2; p++) { const t = []; for (let i = 0; i < N; i++) { let q = 0; for (let j = -12; j <= 12; j++)q += sc[(i + j + N) % N]; t.push(q / 25) } sc = t }
      for (let i = 0; i < N; i++)BK[i] = Math.max(-.11, Math.min(.11, sc[i] * 7)) * wn(i)
    }
    const EY = (k, o) => { k = (k % N + N) % N; return EL[k] + BK[k] * o };
    const TUN = [632, 674], BRG = 814, TUN_W = 13.5, TUN_H = 9;
    const bw = k => { let d = Math.abs(k - BRG); d = Math.min(d, N - d); return d <= 14 ? 1 : d >= 20 ? 0 : (t => t * t * (3 - 2 * t))(1 - (d - 14) / 6) };
    const limAt = k => { const d = k < TUN[0] ? TUN[0] - k : k > TUN[1] ? k - TUN[1] : 0; return d == 0 ? TUN_W - .5 : d < 8 ? TUN_W - .5 + (25 - TUN_W + .5) * d / 8 : 25 };
    function ELUP(dt) {
      if (mode == "nature") {
        const x = P.x, z = P.z, gx = (TrM(x + 1.5, z) - TrM(x - 1.5, z)) / 3, gz = (TrM(x, z + 1.5) - TrM(x, z - 1.5)) / 3, sh = Math.sin(P.h), ch = Math.cos(P.h), q = Math.min(1, dt * 22); P.gx = gx; P.gz = gz;
        const hw = (a, b) => TrM(x + sh * a + ch * b, z + ch * a - sh * b), hFL = hw(1.7, -.85), hFR = hw(1.7, .85), hRL = hw(-1.7, -.85), hRR = hw(-1.7, .85), gnd = (hFL + hFR + hRL + hRR) / 4, tp = -Math.atan(((hFL + hFR) - (hRL + hRR)) / 6.8), tr = Math.atan(((hFR + hRR) - (hFL + hRL)) / 3.4);
        if (P.hz === undefined) { P.hz = gnd; P.bh = gnd; P.bv = 0; P.gpv = gnd; P.air = 0 }
        const vg = Math.max(-20, Math.min(20, (gnd - P.gpv) / Math.max(dt, 1e-3))); P.gpv = gnd;
        { const vv = Math.hypot(P.vx, P.vz); P.bv -= (9.81 + .0045 * vv * vv) * dt } P.bh += P.bv * dt;
        if (P.air) { if (P.bh <= gnd) { P.air = 0; P.pv = (P.pv || 0) + P.bv * .02; P.bh = gnd; P.bv = vg } }
        else if (P.bh <= gnd) { P.bh = gnd; P.bv = vg }
        else if (P.bh > gnd + .1 && Math.hypot(P.vx, P.vz) > 6) P.air = 1;
        P.hz = P.air ? P.bh : gnd;
        P.ey = P.hz + (P.air ? 0 : Math.abs(tp - P.sp) * 2.2 + Math.abs(tr - P.sr) + .02); const qa = P.air ? q * .3 : q; P.sp += (tp - P.sp) * qa; P.sr += (tr - P.sr) * qa; return
      } if (mode != "race" && mode != "ghost") { P.ey = P.sp = P.sr = 0; P.gx = P.gz = 0; P.air = 0; P.hz = undefined; return }
      const k = li, pl = Math.max(-25.5, Math.min(25.5, (P.x - SP[k].x) * LF[k][0] + (P.z - SP[k].z) * LF[k][1])), u = ((P.x - SP[k].x) * TN[k][0] + (P.z - SP[k].z) * TN[k][1]) / DS, k2 = (k + (u >= 0 ? 1 : N - 1)) % N, t = Math.min(1, Math.abs(u));
      P.ey = EY(k, pl) * (1 - t) + EY(k2, pl) * t;
      const sl = (EL[(k + 1) % N] - EL[(k + N - 1) % N]) / (2 * DS), bk = BK[k], f0 = Math.sin(P.h), f1 = Math.cos(P.h), gx = sl * TN[k][0] + bk * LF[k][0], gz = sl * TN[k][1] + bk * LF[k][1], q = Math.min(1, dt * 10); P.gx = gx; P.gz = gz; P.air = 0; P.hz = undefined;
      P.sp += (-Math.atan(gx * f0 + gz * f1) - P.sp) * q; P.sr += (Math.atan(gx * f1 - gz * f0) - P.sr) * q
    }
    const CBN = (() => { const c = document.createElement("canvas"); c.width = 32; c.height = 64; const g = c.getContext("2d"); for (let y = 0; y < 64; y++) { const v = 128 + 110 * Math.sin(y * .7854) | 0; g.fillStyle = "rgb(" + v + "," + v + "," + v + ")"; g.fillRect(0, y, 32, 1) } return nrmTex(g, 32, 64, 2.2) })();
    let LAMPM = null; const TZG = new Set();
    const trackG = new THREE.Group(); S.add(trackG);
    const tm = (map, lay) => new THREE.MeshStandardMaterial({ map, roughness: .92, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -lay, polygonOffsetUnits: -lay });
    function strip(a, b, y, mt, vs, ur) {
      const p = [], uv = [], ix = [], nm = []; for (let i = 0; i <= N; i++) { const k = i % N; for (const o of [a, b]) { p.push(SP[k].x + LF[k][0] * o, y + EY(k, o), SP[k].z + LF[k][1] * o); nm.push(0, 1, 0) } uv.push(0, i * DS / vs, ur || 1, i * DS / vs) }
      const fl = ((p[5] - p[2]) * (p[6] - p[0]) - (p[3] - p[0]) * (p[8] - p[2])) < 0; for (let i = 0; i < N; i++) { const q = i * 2; if (fl) ix.push(q, q + 2, q + 1, q + 1, q + 2, q + 3); else ix.push(q, q + 1, q + 2, q + 1, q + 3, q + 2) } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(ix); g.computeVertexNormals(); const m = new THREE.Mesh(g, mt); m.receiveShadow = true; trackG.add(m)
    }
    const tkT = mkTex(256, 512, (g, w, h) => { asphalt(g, w, h, "#3a3c40"); const gr = g.createLinearGradient(0, 0, w, 0);[[.25, 0], [.4, .16], [.55, 0], [.7, .12], [.85, 0]].forEach(([a, b]) => gr.addColorStop(a, "rgba(0,0,0," + b + ")")); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = "#f0f0ea"; g.fillRect(6, 0, 5, h); g.fillRect(w - 11, 0, 5, h) });
    const cbT = mkTex(32, 64, (g, w, h) => { g.fillStyle = "#d91e18"; g.fillRect(0, 0, w, h / 2); g.fillStyle = "#f2f2f2"; g.fillRect(0, h / 2, w, h / 2) });
    const roT = mkTex(128, 128, (g, w, h) => asphalt(g, w, h, "#5c5e63")), grT = mkTex(128, 128, (g, w, h) => { g.fillStyle = "#9b8e76"; g.fillRect(0, 0, w, h); for (let i = 0; i < 5000; i++) { const v = 110 + rnd() * 90 | 0; g.fillStyle = "rgba(" + v + "," + (v - 8) + "," + (v - 28) + ",.7)"; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2) } });
    const wlT = mkTex(256, 64, (g, w, h) => { g.fillStyle = "#b9bec4"; g.fillRect(0, 0, w, h); g.fillStyle = "#8a9098"; g.fillRect(0, 14, w, 6); g.fillRect(0, 40, w, 6); g.fillStyle = "#d8dce0"; g.fillRect(0, 20, w, 2); g.fillRect(0, 46, w, 2); g.fillStyle = "#5a5f66"; g.fillRect(0, 0, 9, h) });
    const RDM = tm(tkT, 3); strip(-9, 9, .02, RDM, 16, 1);
    for (const s of [1, -1]) {
      const a = s > 0, rg = (x, y) => a ? [x, y] : [-y, -x];
      strip(...rg(9, 11.5), .03, tm(cbT, 4), 3.2, 1); strip(...rg(11.5, 18), .01, tm(roT, 1), 8, 6.5 / 8); strip(...rg(18, 25.5), .01, tm(grT, 1), 6, 7.5 / 6)
    }
    function wall(o, hg) {
      const p = [], uv = [], ix = []; for (let i = 0; i <= N; i++) { const k = i % N, x = SP[k].x + LF[k][0] * o, z = SP[k].z + LF[k][1] * o; { const e = EY(k, o); p.push(x, e, z, x, e + hg, z) } uv.push(i * DS / 4, 0, i * DS / 4, 1) } for (let i = 0; i < N; i++) { const q = i * 2; ix.push(q, q + 1, q + 2, q + 1, q + 3, q + 2) }
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(ix); g.computeVertexNormals(); const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: wlT, roughness: .5, metalness: .5, side: THREE.DoubleSide })); m.castShadow = m.receiveShadow = true; trackG.add(m)
    }
    wall(25.5, 1.1); wall(-25.5, 1.1);
    { /* hot-air balloons */
      const cols = [["#e8341c", "#ffd23a"], ["#1b7be0", "#ffffff"], ["#12a56a", "#ffe04a"], ["#8a2be2", "#ff9ad5"], ["#ff8a00", "#ffffff"], ["#d4145a", "#222222"]];
      for (let b = 0; b < 12; b++) {
        const i = Math.floor(b * N / 12 + 20) % N, side = b % 2 ? 1 : -1, o = side * (140 + (b * 53) % 220), r = 9 + (b * 7) % 6, [c1, c2] = cols[b % cols.length];
        const tx = mkTex(64, 64, (g, w, h) => { for (let s = 0; s < 8; s++) { g.fillStyle = s % 2 ? c1 : c2; g.fillRect(s * w / 8, 0, w / 8, h) } });
        tx.wrapS = THREE.RepeatWrapping; const bl = new THREE.Group();
        const env = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), new THREE.MeshStandardMaterial({ map: tx, roughness: .8 })); env.scale.y = 1.15; env.position.y = r * 1.6; bl.add(env);
        const bk = new THREE.Mesh(new THREE.BoxGeometry(r * .35, r * .25, r * .35), new THREE.MeshStandardMaterial({ color: 0x6b4a2b, roughness: .9 })); bk.position.y = r * .2; bl.add(bk);
        bl.position.set(SP[i].x + LF[i][0] * o, 70 + (b * 37) % 90 + EL[i], SP[i].z + LF[i][1] * o); trackG.add(bl)
      }
    }
    /* embankment skirts, chevron signs, street lamps, manholes */
    for (const s of [1, -1]) {
      const p = [], ix = []; for (let i = 0; i <= N; i++) { const k = i % N, o = s * 25.5, e = EY(k, o), bw_ = bw(k), r = s * (25.5 + (e * 1.5 + .5) * (1 - bw_)); p.push(SP[k].x + LF[k][0] * o, e, SP[k].z + LF[k][1] * o, SP[k].x + LF[k][0] * r, -.05 * (1 - bw_) + (e - 2.2) * bw_, SP[k].z + LF[k][1] * r) }
      for (let i = 0; i < N; i++) { const q = i * 2; ix.push(q, q + 1, q + 2, q + 1, q + 3, q + 2) } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3)); g.setIndex(ix); g.computeVertexNormals(); const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0x56753f, roughness: 1, side: THREE.DoubleSide })); m.receiveShadow = true; trackG.add(m)
    }
    /* ===== BRIDGE (deck, piers) + TUNNEL (inside a hill) ===== */
    {
      const dm = c => new THREE.MeshStandardMaterial({ color: c, roughness: .85, side: THREE.DoubleSide });
      const grid = (rows, mat, cast) => { const R = rows.length, C = rows[0].length, p = [], ix = []; for (const row of rows) for (const v of row) p.push(v[0], v[1], v[2]);
        for (let r = 0; r < R - 1; r++) for (let c = 0; c < C - 1; c++) { const a = r * C + c, b = a + 1, d = a + C, e = d + 1; ix.push(a, b, d, b, e, d) }
        const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3)); g.setIndex(ix); g.computeVertexNormals();
        const m = new THREE.Mesh(g, mat); m.receiveShadow = true; m.castShadow = !!cast; trackG.add(m); return m };
      const P3 = (i, o, y) => { const k = (i % N + N) % N; return [SP[k].x + LF[k][0] * o, y, SP[k].z + LF[k][1] * o] };
      const conc = dm(0x9a9ea4), under = dm(0x6f7379);
      /* bridge: underside + concrete fascia + piers */
      { const rows = [], fl = [[], []]; for (let i = BRG - 19; i <= BRG + 19; i++) { const k = (i % N + N) % N, w = bw(k); rows.push([P3(i, -25.5, EY(k, -25.5) - 2.2 * w - .03), P3(i, 25.5, EY(k, 25.5) - 2.2 * w - .03)]);
          [-1, 1].forEach((s, q) => fl[q].push([P3(i, s * 25.55, EY(k, s * 25.5)), P3(i, s * 25.55, EY(k, s * 25.5) - 2.2 * w - .03)])) }
        grid(rows, under, true); fl.forEach(f => grid(f, conc, true));
        for (const di of [-14, -7, 7, 14]) for (const s of [-1, 1]) { const k = (BRG + di + N) % N, h = EL[k] - 2.2; if (h < 1) continue;
          const pr = new THREE.Mesh(new THREE.BoxGeometry(4, h, 4), conc); pr.position.set(SP[k].x + LF[k][0] * s * 15, h / 2, SP[k].z + LF[k][1] * s * 15); pr.rotation.y = Math.atan2(TN[k][0], TN[k][1]); pr.castShadow = pr.receiveShadow = true; trackG.add(pr) } }
      /* tunnel */
      { const A = TUN[0], B = TUN[1], TW = TUN_W, TH = TUN_H, MW = 70, FL = 26, wallM = dm(0x4a4e55), roofM = dm(0x2e3136), hill = dm(0x4f7a38), portM = dm(0x8d9096);
        for (const s of [-1, 1]) { const rows = []; for (let i = A; i <= B; i++) rows.push([P3(i, s * TW, EL[i]), P3(i, s * TW, EL[i] + TH)]); grid(rows, wallM, true) }
        { const rows = []; for (let i = A; i <= B; i++) rows.push([P3(i, -TW - 1, EL[i] + TH), P3(i, TW + 1, EL[i] + TH)]); grid(rows, roofM, true) }
        const tap = i => { const d = Math.min(i - A, B - i), t = Math.min(1, d / 14); return t * t * (3 - 2 * t) };
        const prof = u => { const a = Math.abs(u); return a <= FL ? 1 : a >= MW ? 0 : .5 * (1 + Math.cos(Math.PI * (a - FL) / (MW - FL))) };
        const Hh = (i, u) => (EL[i] + TH + 2 + (7 + 2.5 * Math.sin(i * .35 + u * .05)) * tap(i)) * prof(u);
        const us = []; for (let u = -MW; u <= MW; u += 5) us.push(u);
        { const rows = []; for (let i = A; i <= B; i++) rows.push(us.map(u => P3(i, u, Hh(i, u)))); grid(rows, hill, true) }
        for (const i of [A, B]) for (let q = 0; q < us.length - 1; q++) { const u1 = us[q], u2 = us[q + 1], um = (u1 + u2) / 2, y1 = Hh(i, u1), y2 = Hh(i, u2);
          if (Math.abs(um) < TW + 1) { grid([[P3(i, u1, 0), P3(i, u2, 0)], [P3(i, u1, EL[i]), P3(i, u2, EL[i])]], portM); grid([[P3(i, u1, EL[i] + TH), P3(i, u2, EL[i] + TH)], [P3(i, u1, y1), P3(i, u2, y2)]], portM) }
          else grid([[P3(i, u1, 0), P3(i, u2, 0)], [P3(i, u1, y1), P3(i, u2, y2)]], portM) }
        const lm = new THREE.InstancedMesh(new THREE.BoxGeometry(.5, .12, 2.2), new THREE.MeshBasicMaterial({ color: 0xfff1c4 }), 120), d = new THREE.Object3D(); let c = 0;
        for (let i = A + 2; i < B - 1 && c < 118; i += 3) for (const o of [-5, 5]) { const k = i % N; d.position.set(SP[k].x + LF[k][0] * o, EL[k] + TH - .1, SP[k].z + LF[k][1] * o); d.rotation.y = Math.atan2(TN[k][0], TN[k][1]); d.updateMatrix(); lm.setMatrixAt(c++, d.matrix) } lm.count = c; trackG.add(lm) }
    }
    {
      const o3 = new THREE.Object3D(), gry =
 new THREE.MeshStandardMaterial({ color: 0x7a8087, roughness: .6, metalness: .5 }), Ls = [], Rs = [],
      tex = sg => mkTex(64, 64, (g, w, h) => { g.fillStyle = "#ffd400"; g.fillRect(0, 0, w, h); g.strokeStyle = "#111"; g.lineWidth = 8; g.strokeRect(4, 4, 56, 56); g.beginPath(); g.moveTo(sg ? 22 : 42, 12); g.lineTo(sg ? 44 : 20, 32); g.lineTo(sg ? 22 : 42, 52); g.stroke() });
      /* ---- har turn detect karo (smoothed curvature) ---- */
      const KS = SCV.map((_, i) => { let q = 0; for (let j = -10; j <= 10; j++) q += SCV[(i + j + N) % N]; return q / 21 }), TURNS = [];
      /* turns = curvature ke peaks (radius < ~1000m). a = turn ka entry index, n = length */
      for (let i = 0; i < N; i++) { const k = Math.abs(KS[i]); if (k < 1 / 1000) continue; let ok = true; for (let j = -30; j <= 30; j++) { const m = Math.abs(KS[(i + j + N) % N]); if (m > k || (m == k && j < 0)) ok = false } if (!ok) continue;
        let a = 0, b = 0; while (a < 60 && Math.abs(KS[(i - a - 1 + N) % N]) > k * .5) a++; while (b < 60 && Math.abs(KS[(i + b + 1) % N]) > k * .5) b++;
        TURNS.push({ a: (i - a + N) % N, n: a + b + 1, s: KS[i] < 0 ? -1 : 1, km: k }) }
      TURNS.sort((x, y) => ((x.a - L0 + N) % N) - ((y.a - L0 + N) % N));
      const CHD = new Set(); KS.forEach((k, i) => { if (Math.abs(k) > 1 / 2500) for (let q = -8; q <= 8; q++) TZG.add((i + q + N) % N) }); TURNS.forEach(t => { for (let q = -4; q < t.n + 4; q++) TZG.add((t.a + q + N) % N) });
      TURNS.forEach(t => { for (let q = 0; q < t.n; q += 3) { const i = (t.a + q) % N; if (Math.abs(i - L0) < 30 || CHD.has(i >> 1)) continue; CHD.add(i >> 1); const o = t.s * 25.1; (t.s < 0 ? Ls : Rs).push([SP[i].x + LF[i][0] * o, EY(i, o), SP[i].z + LF[i][1] * o, Math.atan2(-t.s * LF[i][0] - TN[i][0] * .8, -t.s * LF[i][1] - TN[i][1] * .8)]) } });
      /* turn se pehle bade warning boards (2 baar: ~160m aur ~80m pehle) */
      TURNS.forEach((t, ti) => {
        const ch = t.km > 1 / 600 ? 3 : t.km > 1 / 850 ? 2 : 1, rt = t.s > 0, wt = mkTex(256, 256, (g, w, h) => {
          g.fillStyle = "#ffd400"; g.fillRect(0, 0, w, h); g.strokeStyle = "#111"; g.lineWidth = 12; g.strokeRect(6, 6, w - 12, h - 12); g.fillStyle = "#111"; g.font = "bold 56px system-ui,sans-serif"; g.textAlign = "center"; g.fillText("TURN " + (ti + 1), 128, 74);
          g.lineWidth = 18; g.lineCap = g.lineJoin = "round"; for (let c = 0; c < ch; c++) { const x = 128 - (ch - 1) * 24 + c * 48, d = rt ? 1 : -1; g.beginPath(); g.moveTo(x - 20 * d, 112); g.lineTo(x + 20 * d, 168); g.lineTo(x - 20 * d, 224); g.stroke() } }),
          bmw = new THREE.MeshStandardMaterial({ map: wt, roughness: .5, side: THREE.DoubleSide, emissive: 0xffffff, emissiveMap: wt, emissiveIntensity: .18 });
        for (const back of [22, 11]) { const i = (t.a - back + N * 2) % N; if (Math.abs(i - L0) < 25) continue; const o = t.s * 25.0, gp = new THREE.Group();
          const bd = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 4.4), bmw); bd.position.y = 3.9; gp.add(bd);
          gp.position.set(SP[i].x + LF[i][0] * o, EY(i, o), SP[i].z + LF[i][1] * o); gp.rotation.y = Math.atan2(-t.s * LF[i][0] * .45 - TN[i][0], -t.s * LF[i][1] * .45 - TN[i][1]); trackG.add(gp) }
      });
      const put = (m, L, f) => { L.forEach((t, j) => { o3.position.set(t[0], t[1], t[2]); o3.rotation.set(0, f(t), 0); o3.updateMatrix(); m.setMatrixAt(j, o3.matrix) }); m.castShadow = true; trackG.add(m) };
      [[Ls, 0], [Rs, 1]].forEach(([L, sg]) => { if (!L.length) return; put(new THREE.InstancedMesh(new THREE.PlaneGeometry(3.2, 3.2).translate(0, 3.7, 0), new THREE.MeshStandardMaterial({ map: tex(sg), roughness: .5, side: THREE.DoubleSide }), L.length), L, t => t[3]) });
      const A = []; for (let i = 0; i < N; i += 6) { if (Math.abs(i - L0) < 40 || TZG.has(i)) continue; for (const s of [1, -1]) { const o = s * 27; A.push([SP[i].x + LF[i][0] * o, EY(i, o) - .8, SP[i].z + LF[i][1] * o, Math.atan2(s * LF[i][1], -s * LF[i][0])]) } }
      LAMPM = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffd9a0, emissiveIntensity: 0 });
      put(new THREE.InstancedMesh(mergeG([new THREE.CylinderGeometry(.1, .14, 9, 6).translate(0, 4.5, 0), new THREE.BoxGeometry(3, .15, .15).translate(1.5, 9, 0)]), gry, A.length), A, t => t[3]); put(new THREE.InstancedMesh(new THREE.BoxGeometry(.9, .18, .4).translate(3, 8.9, 0), LAMPM, A.length), A, t => t[3]);
      const mt = mkTex(64, 64, (g, w, h) => { g.fillStyle = "#222428"; g.fillRect(0, 0, w, h); g.strokeStyle = "#52565c"; g.lineWidth = 3; g.beginPath(); g.arc(32, 32, 28, 0, 6.3); g.stroke(); g.lineWidth = 2; for (let i = -24; i <= 24; i += 8) { g.beginPath(); g.moveTo(8, 32 + i); g.lineTo(56, 32 + i); g.stroke() } }), M = [];
      for (let j = 0; j < 0; j++) { const i = (L0 + 70 + Math.floor(rnd() * (N - 140))) % N, o = (rnd() - .5) * 11; M.push([SP[i].x + LF[i][0] * o, EY(i, o) + .05, SP[i].z + LF[i][1] * o, rnd() * 6]) }
      const mm = new THREE.InstancedMesh(new THREE.CircleGeometry(.5, 20).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: mt, roughness: .45, metalness: .6, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6 }), M.length); put(mm, M, t => t[3]); mm.castShadow = false; mm.receiveShadow = true
    }

    function band(o, y0, y1, mat, tile) { const p = [], uv = [], ix = []; for (let i = 0; i <= N; i++) { const k = i % N, x = SP[k].x + LF[k][0] * o, z = SP[k].z + LF[k][1] * o; { const e = EY(k, o); p.push(x, y0 + e, z, x, y1 + e, z) } uv.push(i * DS / tile, 0, i * DS / tile, 1) } for (let i = 0; i < N; i++) { const q = i * 2; ix.push(q, q + 1, q + 2, q + 1, q + 3, q + 2) } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(ix); g.computeVertexNormals(); const m = new THREE.Mesh(g, mat); m.receiveShadow = true; trackG.add(m) }
    {
      const bnT = mkTex(512, 64, (g, w, h) => { const cs = ["#e10600", "#ffd400", "#1d4ed8", "#f5f5f5", "#0f7a3e", "#ff6a00", "#7b2cbf", "#00a3b4"]; for (let i = 0; i < 8; i++) { g.fillStyle = cs[i]; g.fillRect(i * 64, 0, 64, h); g.fillStyle = "rgba(255,255,255,.85)"; g.fillRect(i * 64, h - 10, 64, 4); g.fillStyle = i % 2 ? "rgba(0,0,0,.25)" : "rgba(255,255,255,.3)"; g.beginPath(); g.moveTo(i * 64 + 10, 10); g.lineTo(i * 64 + 54, 32); g.lineTo(i * 64 + 10, 54); g.closePath(); g.fill() } }),
      fnT = mkTex(64, 64, (g, w, h) => { g.strokeStyle = "rgba(205,210,215,.95)"; g.lineWidth = 2; for (let i = -64; i < 128; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 64, 64); g.stroke(); g.beginPath(); g.moveTo(i + 64, 0); g.lineTo(i, 64); g.stroke() } }),
      bm = new THREE.MeshStandardMaterial({ map: bnT, roughness: .6, side: THREE.DoubleSide }), fm = new THREE.MeshBasicMaterial({ map: fnT, transparent: true, alphaTest: .4, side: THREE.DoubleSide });
      for (const o of [25.5, -25.5]) { band(o, 1.1, 2.3, bm, 64); band(o, 2.3, 5.1, fm, 2.8) }
      const pm = new THREE.InstancedMesh(new THREE.BoxGeometry(.14, 5.2, .14).translate(0, 2.6, 0), new THREE.MeshStandardMaterial({ color: 0x6b7077, roughness: .6, metalness: .4 }), 2 * Math.ceil(N / 3)), d = new THREE.Object3D(); let c = 0;
      for (const o of [25.4, -25.4]) for (let i = 0; i < N; i += 3) { if (TZG.has(i)) continue; d.position.set(SP[i].x + LF[i][0] * o, EY(i, o), SP[i].z + LF[i][1] * o); d.updateMatrix(); pm.setMatrixAt(c++, d.matrix) } pm.count = c; pm.castShadow = true; trackG.add(pm)
    }
    {
      const p = SP[L0], h = Math.atan2(TN[L0][0], TN[L0][1]), m = new THREE.MeshStandardMaterial({ color: 0xd91e18, roughness: .5 }), g = new THREE.Group();
      const ck = mkTex(128, 16, gg => { for (let i = 0; i < 16; i++)for (let j = 0; j < 2; j++) { gg.fillStyle = (i + j) & 1 ? "#111" : "#f5f5f5"; gg.fillRect(i * 8, j * 8, 8, 8) } }), ln = new THREE.Mesh(new THREE.PlaneGeometry(18, 1.6).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: ck, roughness: .8, polygonOffset: true, polygonOffsetFactor: -5, polygonOffsetUnits: -5 })); ln.position.y = .04; ln.receiveShadow = true; g.add(ln);
      for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.BoxGeometry(1, 9, 1), m); b.position.set(s * 11, 4.5, 0); b.castShadow = true; g.add(b) }
      const bm = new THREE.Mesh(new THREE.BoxGeometry(23, 2, 1), m); bm.position.y = 9; bm.castShadow = true; g.add(bm); g.position.set(p.x, 0, p.z); g.rotation.y = h; trackG.add(g)
    }
    {
      const k = L0 + 10, hd = Math.atan2(TN[k][0], TN[k][1]), cr = mkTex(64, 64, (g, w, h) => { g.fillStyle = "#2b2e36"; g.fillRect(0, 0, w, h); for (let i = 0; i < 260; i++) { g.fillStyle = "hsl(" + rnd() * 360 + ",60%," + (45 + rnd() * 25) + "%)"; g.fillRect(rnd() * w, rnd() * h, 3, 3) } }), m = new THREE.MeshStandardMaterial({ map: cr, roughness: .9 }), rf = new THREE.MeshStandardMaterial({ color: 0xd9d9d9, roughness: .6 }); cr.repeat.set(14, 3);
      for (const s of [1, -1]) {
        const g = new THREE.Group();[[34, 3, 5], [38.5, 6, 5], [43, 9, 5]].forEach(([x, hh, wd]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(wd, hh, 90), m); b.position.set(s * x, hh / 2, 0); b.castShadow = b.receiveShadow = true; g.add(b) });
        const r = new THREE.Mesh(new THREE.BoxGeometry(16, .5, 90), rf); r.position.set(s * 40, 9.6, 0); r.castShadow = true; g.add(r); g.position.set(SP[k].x, 0, SP[k].z); g.rotation.y = hd; trackG.add(g)
      }
    }
    const postMat = new THREE.MeshStandardMaterial({ roughness: .7, color: 0xffffff });
    const op = new THREE.InstancedMesh(new THREE.BoxGeometry(.12, .9, .12).translate(0, .45, 0), postMat, 260), lp = new THREE.InstancedMesh(mergeG([new THREE.CylinderGeometry(.1, .14, 9, 6).translate(0, 4.5, 0), new THREE.BoxGeometry(3, .15, .15).translate(1.5, 9, 0), new THREE.BoxGeometry(.9, .18, .4).translate(3, 8.9, 0)]), new THREE.MeshStandardMaterial({ color: 0x8a8f96, metalness: .6, roughness: .5 }), 80);
    [op, lp].forEach(m => { m.frustumCulled = false; m.castShadow = true; world.add(m) }); let opk = "";
    /* ---- open world: rounded junction corners + junction warning boards ---- */
    const FR = 24, FO = 10.2, inFil = (x, z) => { const u = rd(x) - FO, v = rd(z) - FO; return u >= 0 && v >= 0 && u < FR && v < FR && Math.hypot(u - FR, v - FR) > FR };
    const frG = (() => { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(FR, 0); for (let a = 0; a <= 12; a++) { const th = -Math.PI / 2 - a * (Math.PI / 2) / 12; sh.lineTo(FR + FR * Math.cos(th), FR + FR * Math.sin(th)) } sh.lineTo(0, 0); return new THREE.ShapeGeometry(sh).rotateX(-Math.PI / 2) })();
    const frM = new THREE.MeshStandardMaterial({ color: 0x3f4146, roughness: .9, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
    const flI = new THREE.InstancedMesh(frG, frM, 100), jT = mkTex(256, 256, (g, w, h) => { g.fillStyle = "#ffd400"; g.fillRect(0, 0, w, h); g.strokeStyle = "#111"; g.lineWidth = 12; g.strokeRect(6, 6, w - 12, h - 12); g.fillStyle = "#111"; g.fillRect(112, 44, 32, 150); g.fillRect(50, 102, 156, 32); g.font = "bold 40px system-ui,sans-serif"; g.textAlign = "center"; g.fillText("JUNCTION", 128, 232) });
    const sgB = new THREE.InstancedMesh(new THREE.PlaneGeometry(4.2, 4.2).translate(0, 5.4, 0), new THREE.MeshStandardMaterial({ map: jT, roughness: .5, side: THREE.DoubleSide, emissive: 0xffffff, emissiveMap: jT, emissiveIntensity: .18 }), 208), sgP = new THREE.InstancedMesh(new THREE.BoxGeometry(.14, 5.4, .14).translate(0, 2.7, 0), new THREE.MeshStandardMaterial({ color: 0x7a8087, roughness: .6, metalness: .5 }), 208);
    flI.receiveShadow = true; sgB.castShadow = sgP.castShadow = true; [flI, sgB, sgP].forEach(m => { m.frustumCulled = false; m.visible = false; world.add(m) });
    const JDIR = [[1, 0], [-1, 0], [0, 1], [0, -1]]; let oek = "";
    function opExtra(kx, kz) {
      const key = kx + "," + kz; if (key == oek) return; oek = key; let f = 0, b = 0; const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(), ps = new THREE.Vector3();
      for (let i = -2; i <= 2; i++)for (let j = -2; j <= 2; j++) {
        const ix = kx + i * 800, iz = kz + j * 800;
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) { m.compose(ps.set(ix + sx * FO, .03, iz + sz * FO), q.identity(), sc.set(sx, 1, -sz)); flI.setMatrixAt(f++, m) }
        for (const [dx, dz] of JDIR) for (const d of [150, 70]) { ps.set(ix - dx * d - dz * 13, 0, iz - dz * d + dx * 13); if (BRK.has(bk("s", ps.x, ps.z))) continue; q.setFromEuler(e.set(0, Math.atan2(-dx, -dz), 0)); m.compose(ps, q, sc.set(1, 1, 1)); sgB.setMatrixAt(b, m); sgP.setMatrixAt(b, m); b++ }
      }
      flI.count = f; sgB.count = sgP.count = b; flI.instanceMatrix.needsUpdate = sgB.instanceMatrix.needsUpdate = sgP.instanceMatrix.needsUpdate = true
    }
    /* ================= TUTNE WALE KHAMBE / PILLARS / SIGNS ================= */
    const BRK = new Set(), bk = (c, x, z) => c + Math.round(x * 10) + "," + Math.round(z * 10), brkG = new THREE.Group(), BDY = [], MAXB = 70;
    brkG.visible = false; world.add(brkG);
    const stubG = new THREE.CylinderGeometry(.12, .17, .4, 8).translate(0, .2, 0), stubM = new THREE.MeshStandardMaterial({ color: 0x7d838b, metalness: .6, roughness: .5 });
    function mkEm(n, size, grav, drag) {
      const pos = new Float32Array(n * 3).fill(-999), col = new Float32Array(n * 3), vel = new Float32Array(n * 3), base = new Float32Array(n * 3), life = new Float32Array(n), mx = new Float32Array(n).fill(1); let k = 0;
      const g = new THREE.BufferGeometry(), pa = new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage), ca = new THREE.BufferAttribute(col, 3).setUsage(THREE.DynamicDrawUsage); g.setAttribute("position", pa); g.setAttribute("color", ca);
      const pts = new THREE.Points(g, new THREE.PointsMaterial({ size, map: ptT, alphaTest: .01, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); pts.frustumCulled = false; brkG.add(pts);
      return {
        emit(x, y, z, vx, vy, vz, lf, r, gg, b) { const i = k; k = (k + 1) % n; pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z; vel[i * 3] = vx; vel[i * 3 + 1] = vy; vel[i * 3 + 2] = vz; life[i] = mx[i] = lf; base[i * 3] = r; base[i * 3 + 1] = gg; base[i * 3 + 2] = b },
        update(dt) {
          const dq = Math.exp(-drag * dt);
          for (let i = 0; i < n; i++) {
            if (life[i] <= 0) continue; life[i] -= dt; const j = i * 3;
            if (life[i] <= 0) { pos[j + 1] = -999; col[j] = col[j + 1] = col[j + 2] = 0; continue }
            vel[j + 1] -= grav * dt; vel[j] *= dq; vel[j + 1] *= dq; vel[j + 2] *= dq; pos[j] += vel[j] * dt; pos[j + 1] += vel[j + 1] * dt; pos[j + 2] += vel[j + 2] * dt;
            if (grav > 0 && pos[j + 1] < .03) { pos[j + 1] = .03; vel[j + 1] *= -.35; vel[j] *= .7; vel[j + 2] *= .7 }
            const f = life[i] / mx[i]; col[j] = base[j] * f; col[j + 1] = base[j + 1] * f; col[j + 2] = base[j + 2] * f
          }
          pa.needsUpdate = ca.needsUpdate = true
        }
      }
    }
    const ptT = mkTex(64, 64, (g, w, h) => { const q = g.createRadialGradient(32, 32, 0, 32, 32, 32); q.addColorStop(0, "rgba(255,255,255,1)"); q.addColorStop(.35, "rgba(255,255,255,.45)"); q.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = q; g.fillRect(0, 0, w, h) });
    const sparkE = mkEm(240, .22, 9.8, .5), dustE = mkEm(160, 1.2, -.5, 2);
    let nbuf = null;
    function bang(v, k) {
      if (!au || muted || menuOn || au.state != "running") return;
      try {
        const t = au.currentTime, g = au.createGain(); g.gain.setValueAtTime(Math.min(.45, .06 + v * .012), t); g.gain.exponentialRampToValueAtTime(.001, t + (k == "o" ? .2 : .7)); g.connect(au.destination);
        const f0 = k == "l" ? 330 : k == "s" ? 520 : k == "f" ? 110 : 240;
        for (const m of (k == "o" || k == "f") ? [1] : [1, 2.76, 5.4]) { const o = au.createOscillator(), og = au.createGain(); o.type = k == "o" ? "triangle" : "sine"; o.frequency.setValueAtTime(f0 * m, t); o.frequency.exponentialRampToValueAtTime(f0 * m * .85, t + .4); og.gain.value = 1 / (m * m); o.connect(og); og.connect(g); o.start(t); o.stop(t + .75) }
        if (!nbuf) { nbuf = au.createBuffer(1, au.sampleRate * .3, au.sampleRate); const d = nbuf.getChannelData(0); for (let i = 0; i < d.length; i++)d[i] = (rnd() * 2 - 1) * (1 - i / d.length) }
        const ns = au.createBufferSource(), bf = au.createBiquadFilter(), ng = au.createGain(); ns.buffer = nbuf; bf.type = "bandpass"; bf.frequency.value = k == "f" ? 400 : 2200; ng.gain.value = .8; ns.connect(bf); bf.connect(ng); ng.connect(g); ns.start(t)
      } catch (e) { }
    }
    const addB = b => { BDY.push(b); brkG.add(b.g); if (b.st) brkG.add(b.st); if (BDY.length > MAXB) { const o = BDY.shift(); brkG.remove(o.g); if (o.st) brkG.remove(o.st) } };
    function topple(c, x, z, th, dx, dz, sp) {
      const L = c == "l" ? 9.2 : 6.6, g = new THREE.Group(), tl = new THREE.Group(), st = new THREE.Mesh(stubG, stubM);
      g.position.set(x, 0, z); st.position.set(x, 0, z); st.castShadow = true;
      if (c == "l") { const m = new THREE.Mesh(lp.geometry, lp.material); m.rotation.y = th; m.castShadow = true; tl.add(m) }
      else { const p = new THREE.Mesh(sgP.geometry, sgP.material), bd = new THREE.Mesh(sgB.geometry, sgB.material); p.rotation.y = bd.rotation.y = th; p.castShadow = bd.castShadow = true; tl.add(p, bd) }
      g.add(tl); addB({ k: 1, g, tl, st, ax: new THREE.Vector3(dz, 0, -dx), th: .05, w: Math.min(2.2, .15 + sp * .05), L, dx, dz, vb: sp * .22, done: 0 })
    }
    function tumble(x, z, dx, dz, sp) {
      const g = new THREE.Group(), m = new THREE.Mesh(op.geometry, op.material); m.position.y = -.45; m.castShadow = true; g.add(m); g.position.set(x, .45, z);
      const v = sp * .8 + 1.5, wv = 3 + sp * .25; addB({ k: 2, g, vx: dx * v + (rnd() - .5) * 1.5, vy: 2 + sp * .1 + rnd() * 1.5, vz: dz * v + (rnd() - .5) * 1.5, wx: dz * wv + (rnd() - .5) * 4, wy: (rnd() - .5) * 6, wz: -dx * wv + (rnd() - .5) * 4, done: 0 })
    }
    function breakIt(c, x, z, th, sp) {
      const vl = Math.hypot(P.vx, P.vz) || 1, ax = x - P.x, az = z - P.z, al = Math.hypot(ax, az) || 1; let dx = P.vx / vl * .75 + ax / al * .25, dz = P.vz / vl * .75 + az / al * .25; const dl = Math.hypot(dx, dz) || 1; dx /= dl; dz /= dl;
      const loss = c == "l" ? .9 : c == "s" ? .94 : .975; P.vx *= loss; P.vz *= loss; P.pv = (P.pv || 0) - Math.min(.05, sp * .0012);
      bang(sp, c);
      for (let i = 0; i < (c == "o" ? 0 : 22); i++) { const a = rnd() * 6.283, s2 = 1 + rnd() * 4; sparkE.emit(x, .25 + rnd() * .5, z, Math.cos(a) * s2 + dx * sp * .15, 1 + rnd() * 4, Math.sin(a) * s2 + dz * sp * .15, .4 + rnd() * .7, 1, .62 + rnd() * .25, .2) }
      for (let i = 0; i < 9; i++)dustE.emit(x + (rnd() - .5) * .5, .2 + rnd() * .4, z + (rnd() - .5) * .5, (rnd() - .5) * 2 + dx * sp * .1, .4 + rnd(), (rnd() - .5) * 2 + dz * sp * .1, 1 + rnd() * 1.2, .13, .125, .115);
      if (c == "o") tumble(x, z, dx, dz, sp); else topple(c, x, z, th, dx, dz, sp)
    }
    function hitBrk(c, x, z, rr, th) {
      const k = bk(c, x, z); if (BRK.has(k) || !circIn(x, z, rr)) return; const sp = Math.hypot(P.vx, P.vz);
      if (sp < 2.2) { circHit(x, z, rr, .15); return } BRK.add(k); opk = ""; oek = ""; breakIt(c, x, z, th, sp)
    }
    const _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _v = new THREE.Vector3(), _u = new THREE.Vector3();
    function brkUpdate(dt) {
      if (!brkG.visible) return; dt = Math.min(dt, .05);
      for (const b of BDY) {
        if (b.done) continue;
        if (b.k == 1) {
          b.w += 14.7 / b.L * Math.sin(b.th) * dt; b.th += b.w * dt; b.g.position.x += b.dx * b.vb * dt; b.g.position.z += b.dz * b.vb * dt; b.vb *= Math.exp(-2.2 * dt);
          if (b.th >= 1.5708) { b.th = 1.5708; if (b.w > .9) { const ex = b.g.position.x + b.dx * b.L, ez = b.g.position.z + b.dz * b.L; bang(b.w * 9, "f"); for (let i = 0; i < 12; i++)dustE.emit(ex + (rnd() - .5) * 1.5, .15, ez + (rnd() - .5) * 1.5, (rnd() - .5) * 3, .3 + rnd() * .8, (rnd() - .5) * 3, 1 + rnd() * 1.3, .13, .125, .115); for (let i = 0; i < 6; i++)sparkE.emit(ex, .1, ez, (rnd() - .5) * 5, 1 + rnd() * 3, (rnd() - .5) * 5, .3 + rnd() * .4, 1, .6, .2); b.w = -b.w * .26 } else { b.w = 0; b.done = 1 } }
          b.tl.quaternion.setFromAxisAngle(b.ax, b.th)
        } else {
          const p = b.g.position; b.vy -= 9.81 * dt; p.x += b.vx * dt; p.y += b.vy * dt; p.z += b.vz * dt;
          _v.set(b.wx, b.wy, b.wz); const wl = _v.length(); if (wl > 1e-4) { _q.setFromAxisAngle(_v.multiplyScalar(1 / wl), wl * dt); b.g.quaternion.premultiply(_q) }
          _u.set(0, 1, 0).applyQuaternion(b.g.quaternion); const h = .45 * Math.abs(_u.y) + .06 * Math.sqrt(Math.max(0, 1 - _u.y * _u.y));
          if (p.y <= h) {
            p.y = h; if (b.vy < -1.2) { bang(-b.vy * 2, "o"); for (let i = 0; i < 4; i++)dustE.emit(p.x, .1, p.z, (rnd() - .5) * 2, .3 + rnd() * .5, (rnd() - .5) * 2, .8 + rnd() * .6, .13, .125, .115); b.vy = -b.vy * .32 } else b.vy = 0;
            const f = Math.exp(-5 * dt), g2 = Math.exp(-6 * dt); b.vx *= f; b.vz *= f; b.wx *= g2; b.wy *= g2; b.wz *= g2;
            const hy = Math.hypot(_u.x, _u.z); if (hy > .01) { _v.set(_u.x / hy, 0, _u.z / hy); _q2.setFromUnitVectors(_u, _v).multiply(b.g.quaternion); b.g.quaternion.slerp(_q2, Math.min(1, 7 * dt)) }
            if (Math.hypot(b.vx, b.vz) < .3 && Math.abs(_u.y) < .12 && wl < .6) { b.done = 1; _u.set(0, 1, 0).applyQuaternion(b.g.quaternion); p.y = .45 * Math.abs(_u.y) + .06 * Math.sqrt(Math.max(0, 1 - _u.y * _u.y)) }
          }
        }
      }
      sparkE.update(dt); dustE.update(dt)
    }
    function opPosts() {
      const kx = Math.round(P.x / 800) * 800, kz = Math.round(P.z / 800) * 800, x0 = Math.round(P.x / 20) * 20, z0 = Math.round(P.z / 20) * 20, key = [kx, kz, x0, z0].join(); if (key == opk) return; opExtra(kx, kz); opk = key; let n = 0, q = 0;
      const put = (M, i, x, z, th) => { dm.position.set(x, 0, z); dm.scale.setScalar(1); dm.rotation.set(0, th, 0); dm.updateMatrix(); M.setMatrixAt(i, dm.matrix) }, x6 = Math.round(P.x / 60) * 60, z6 = Math.round(P.z / 60) * 60;
      for (let s = -1; s <= 1; s += 2) {
        for (let i = -30; i <= 30; i++) { if (rdd(z0 + i * 20) > 15 && !BRK.has(bk("o", kx + s * 11.9, z0 + i * 20))) put(op, n++, kx + s * 11.9, z0 + i * 20, 0); if (rdd(x0 + i * 20) > 15 && !BRK.has(bk("o", x0 + i * 20, kz + s * 11.9))) put(op, n++, x0 + i * 20, kz + s * 11.9, 0) }
        for (let i = -8; i <= 8; i++) { if (rdd(z6 + i * 60) > 15 && !BRK.has(bk("l", kx + s * 13.5, z6 + i * 60))) put(lp, q++, kx + s * 13.5, z6 + i * 60, s > 0 ? Math.PI : 0); if (rdd(x6 + i * 60) > 15 && !BRK.has(bk("l", x6 + i * 60, kz + s * 13.5))) put(lp, q++, x6 + i * 60, kz + s * 13.5, s > 0 ? Math.PI / 2 : -Math.PI / 2) }
      }
      op.count = n; lp.count = q; op.instanceMatrix.needsUpdate = lp.instanceMatrix.needsUpdate = true
    }
    const mapBase = document.createElement("canvas"); mapBase.width = mapBase.height = 150;
    {
      let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9; SP.forEach(p => { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); z0 = Math.min(z0, p.z); z1 = Math.max(z1, p.z) });
      var MS = 126 / Math.max(x1 - x0, z1 - z0), MX = x0, MZ = z0; const g = mapBase.getContext("2d"); g.strokeStyle = "#fff"; g.lineWidth = 4; g.beginPath(); SP.forEach((p, i) => { const x = 12 + (p.x - MX) * MS, y = 138 - (p.z - MZ) * MS; i ? g.lineTo(x, y) : g.moveTo(x, y) }); g.closePath(); g.stroke()
    }
    const mg = $("map").getContext("2d");

    /* ---------- car ---------- */
    let car, body, wheels = {}, ais = [], ready = false, gOn = false, parts = [], CARS = {}, cur = "f26";
    const VM = { fer01_fwing_early: ["fw", "early"], fer01_fwing_mid: ["fw", "mid"], fer01_fwing_monza: ["fw", "monza"], fer01_nose_normal: ["nose", "normal"], fer01_nose_hole: ["nose", "hole"], fer01_rwing_normal: ["rw", "normal"], fer01_rwing_monza: ["rw", "monza"], fer_sdwing_bl: ["sw", "a"], fer_sdwing_br: ["sw", "a"], fer_sdwing_l: ["sw", "b"], fer_sdwing_r: ["sw", "b"], fer_cov_lf: ["cov", "on"], fer_cov_fr: ["cov", "on"], fer_cov_rl: ["cov", "on"], fer_cov_rr: ["cov", "on"] };
    const CFG = { pbody: "#0050ff", shell: "on", body: "#c40a0a", wing: "#c40a0a", carb: "#1a1a1c", fin: "gloss", fw: "mid", nose: "normal", rw: "normal", sw: "a", cov: "on", rim: "stock", band: "#1b1b1b", ws: 1, rpaint: "#7a1126", fpm: "carbon", fpc: "#1d4ed8" }, DEF = { ...CFG };
    const GC = ["#c40a0a", "#f5c518", "#1d4ed8", "#e8e8e8", "#111111", "#9aa3ad", "#0f7a3e", "#ff6a00", "#7b2cbf"];
    const UI = [["Royal paint", "rpaint", "c", ["#7a1126", "#0c2a6b", "#14151a", "#eeeeea", "#0f5a3a", "#c9a227", "#d9480f", "#5b21b6"]], ["Body colour", "body", "c", GC], ["Wing colour", "wing", "c", GC], ["Carbon / details", "carb", "c", ["#1a1a1c", "#3a3a40", "#c40a0a", "#f5c518", "#e8e8e8"]], ["Paint finish", "fin", "o", [["gloss", "Gloss"], ["matte", "Matte"], ["metal", "Metallic"]]], ["Front wing", "fw", "o", [["early", "Early"], ["mid", "Mid"], ["monza", "Monza"]]], ["Nose", "nose", "o", [["normal", "Normal"], ["hole", "Vented"]]], ["Rear wing", "rw", "o", [["normal", "Normal"], ["monza", "Monza"]]], ["Side wings", "sw", "o", [["a", "Standard"], ["b", "Alt"]]], ["Wheel covers", "cov", "o", [["on", "On"], ["off", "Off"]]], ["Rims", "rim", "c", ["stock", "#d4af37", "#111111", "#e10600", "#f2f2f2", "#1d4ed8"]], ["Tyre sidewall", "band", "c", ["#1b1b1b", "#e10600", "#f5c518", "#f2f2f2", "#1f9d3a", "#1d4ed8"]], ["Wheel size", "ws", "r"], ["Prototype paint", "pbody", "c", ["#0050ff", "#c40a0a", "#14151a", "#eeeeea", "#f5c518", "#0f7a3e", "#ff6a00", "#7b2cbf"]], ["Body shell", "shell", "o", [["on", "Solid"], ["x", "See-through"]]], ["FP04 body", "fpm", "o", [["carbon", "Carbon"], ["metal", "Metallic"], ["gloss", "Gloss"], ["matte", "Matte"]]], ["FP04 paint colour", "fpc", "c", ["#1d4ed8", "#c40a0a", "#9aa3ad", "#111111", "#e8e8e8", "#0f7a3e", "#ff6a00", "#f5c518", "#7b2cbf", "#00b3b3"]]];
    const saveCfg = () => { try { localStorage.setItem("f2008cfg", JSON.stringify(CFG)) } catch (e) { } };
    const loadCfg = () => { try { Object.assign(CFG, JSON.parse(localStorage.getItem("f2008cfg") || "{}")) } catch (e) { } };
    function applyCfg() {
      const fn = { gloss: [.35, .1], matte: [.85, 0], metal: [.3, .5] }[CFG.fin] || [.35, .1];
      for (const key in MT) {
        const M = MT[key], u = M.userData;
        if (u.f) { M.color.set(u.g == "w" ? CFG.wing : CFG.body); M.roughness = fn[0]; M.metalness = fn[1] }
        else if (u.k == "CARBFER" || u.k.startsWith("FERCOV")) M.color.set(CFG.carb);
        else if (u.k == "RIM_FER" || u.k == "RING_FER") CFG.rim == "stock" ? M.color.setHex(COL[u.k][0]) : M.color.set(CFG.rim);
        else if (u.k == "08BRID") M.color.set(CFG.band)
      }
      for (const id in CARS) { const X = CARS[id]; X.pt.forEach(p => { const [c, o] = p.userData.v; p.visible = CFG[c] == o }); for (const k in X.wh) { const w = X.wh[k]; w.st.scale.setScalar(CFG.ws); w.st.position.y = w.by = w.y0 + WR[id] * (CFG.ws - 1) } }
      for (const k in M2) { const M = M2[k], u = M.userData; if (u.l) { const h = u.g == "w" ? CFG.wing : CFG.body, c = new THREE.Color(h); u.tc.value.set(c.r, c.g, c.b, h.toLowerCase() == "#c40a0a" ? 0 : 1); M.roughness = fn[0]; M.metalness = fn[1] } else if (u.k == "RIM_FER" || u.k == "RING_FER") CFG.rim == "stock" ? M.color.setHex(0xffffff) : M.color.set(CFG.rim) }
      for (const k in M3) { const M = M3[k]; if (M.userData.fin) { M.roughness = fn[0]; M.metalness = Math.min(.6, fn[1] + .05) } if (M.userData.rp) M.color.set(CFG.rpaint); if (M.userData.bp) M.color.set(CFG.body); if (M.userData.pp) M.color.set(CFG.pbody) } if (window.pt2Shell) pt2Shell(); fpPaint()
    }
    function setC(k, v) { CFG[k] = v; applyCfg(); refreshUI(); saveCfg() }
    function buildUI() {
      const el = $("opts"); UI.forEach(([lb, k, t, ch]) => {
        const r = document.createElement("div"); r.className = "row"; r.dataset.rk = k; r.innerHTML = "<label>" + lb + "</label>"; const b = document.createElement("div"); b.className = "ch";
        if (t == "r") { const i = document.createElement("input"); i.type = "range"; i.min = .9; i.max = 1.12; i.step = .01; i.dataset.k = k; i.oninput = () => setC(k, +i.value); b.append(i) }
        else {
          ch.forEach(c => { const x = document.createElement("button"), v = t == "o" ? c[0] : c; x.dataset.k = k; x.dataset.v = v; if (t == "o") x.textContent = c[1]; else if (v == "stock") x.textContent = "Stock"; else { x.className = "sw"; x.style.background = v } x.onclick = () => setC(k, v); b.append(x) });
          if (t == "c") { const i = document.createElement("input"); i.type = "color"; i.dataset.k = k; i.oninput = () => setC(k, i.value); b.append(i) }
        }
        r.append(b); el.append(r)
      });
      $("gReset").onclick = () => { Object.assign(CFG, DEF); applyCfg(); refreshUI(); saveCfg() };
      $("gRand").onclick = () => { const p = a => a[Math.floor(rnd() * a.length)]; Object.assign(CFG, { body: p(GC), wing: p(GC), fw: p(["early", "mid", "monza"]), nose: p(["normal", "hole"]), rw: p(["normal", "monza"]), sw: p(["a", "b"]), rim: p(UI[10][3]), band: p(UI[11][3]), rpaint: p(UI[0][3]), pbody: p(UI[13][3]), fin: p(["gloss", "matte", "metal"]) }); applyCfg(); refreshUI(); saveCfg() }
    }
    function refreshUI() { document.querySelectorAll("#opts .row").forEach(r => { const k = r.dataset.rk, L = cur == "cf" ? "body,fin,ws" : cur == "pt2" ? "pbody,shell,fin,ws" : cur == "fp" ? "fpm,fpc,ws" : (cur == "f26" || cur == "rb" || cur == "rc13" || cur == "c44" || cur == "bol" || cur == "fp" || cur == "w17" || cur == "w13" || cur == "sb" || cur == "w20" || cur == "fe") ? "fin,ws" : "body,wing,fin,cov,rim,ws"; r.style.display = (L.split(",").includes(k)) && !(k == "fpc" && CFG.fpm == "carbon") ? "" : "none" }); document.querySelectorAll("#opts [data-k]").forEach(x => { const v = CFG[x.dataset.k]; if (x.tagName == "INPUT") x.value = x.type == "range" ? v : (/^#[0-9a-f]{6}$/i.test(v) ? v : "#888888"); else x.classList.toggle("on", String(v).toLowerCase() == x.dataset.v.toLowerCase()) }) }
    const gPanel = v => { gOn = v; $("gar").style.display = v ? "block" : "none" };
    const M2 = {}, TXC = {}, CN = { f60: "F60", f26: "2026", rb: "RB 2022", rc13: "RC-13", c44: "C44", bol: "BOLIDE", cf: "CUSTOM F1", pt2: "PROTO 2", fp: "FP04 RB", w17: "W17 2026", w13: "W13 CONCEPT", sb: "C44 #27", w20: "W11 2020", fe: "FORMULA E" }, TT = { f60: "FERRARI F60", f26: "F1 CONCEPT 2026", rb: "RED BULL 2022", rc13: "RC-13 FORMULA", c44: "STAKE C44", bol: "BUGATTI BOLIDE", cf: "CUSTOM F1 22", pt2: "PROTOTYPE 2", fp: "FP04 RB FORMULA", w17: "MERCEDES W17 2026", w13: "MERCEDES W13 CONCEPT", sb: "KICK SAUBER C44 #27", w20: "MERCEDES W11 2020", fe: "FORMULA E GEN2 SRT05E" }, WR = { f60: .322, f26: .369, rb: .392, rc13: .333, c44: .331, bol: .353, cf: .358, pt2: .36, fp: .3545, w17: .3545, w13: .3603, sb: .357, w20: .3354, fe: .333 }, ORD = ["f60", "f26", "rb", "rc13", "c44", "bol", "cf", "pt2", "fp", "w17", "w13", "sb", "w20", "fe"], M3 = {};
    const RBM = { rbbody: [0x1b3484, .3, .25], rbred: [0xd01820, .35, .2], rbyellow: [0xf0c81e, .4, .2], rbcarbon: [0x2d2d32, .45, .45], rbblack: [0x141416, .7, .1], rblight: [0xff2828, .4, .1], rbglass: [0x0f1a28, .1, .6], rbmetal: [0x9a9ca2, .35, .8], rbtire: [0x121212, .9, 0], rbrim: [0x3c3e44, .35, .8] };
    function mat3(k, g) {
      if (M3[k]) return M3[k]; if (RBM[k]) { const c = RBM[k], M = new THREE.MeshStandardMaterial({ color: c[0], roughness: c[1], metalness: c[2], side: THREE.DoubleSide, transparent: k == "rbglass", opacity: k == "rbglass" ? .85 : 1 }); M.userData = { k, fin: k == "rbbody" || k == "rbred" }; return M3[k] = M } const t = T3[k] ? (TXC[k] || (TXC[k] = new THREE.TextureLoader().load(T3[k]))) : null; if (t) t.anisotropy = 8;
      const o = k == "f26livery" ? { roughness: .35, metalness: .1 } : k == "f26wheel" ? { roughness: .65, metalness: .05 } : k == "f26carbon" ? { roughness: .4, metalness: .45 } : { roughness: .6, metalness: .2 };
      const M = new THREE.MeshStandardMaterial({ map: t, color: t ? 0xffffff : 0x1c1c1e, roughness: o.roughness, metalness: o.metalness, side: THREE.DoubleSide }); M.userData = { k, fin: k == "f26livery" }; return M3[k] = M
    }
    function mat2(k, g) {
      const u = k.toUpperCase(), l = /^FERRARI/.test(u), key = l ? k + "|" + g : k; if (M2[key]) return M2[key]; let M; const t = T2[k] ? (TXC[k] || (TXC[k] = new THREE.TextureLoader().load(T2[k]))) : null, St = o => new THREE.MeshStandardMaterial(o);
      if (u == "FER_COCKWIND") M = St({ color: 0x0a0c12, roughness: .1, metalness: .3, transparent: true, opacity: .75 });
      else if (u == "MIRROR") M = St({ color: 0xcfd4da, roughness: .1, metalness: 1 });
      else if (u == "LEDSL") M = St({ color: 0xff5522, roughness: .5, metalness: .2 });
      else M = St({ map: t, color: t ? 0xffffff : 0x888888, roughness: /TIRE|TREAD/.test(u) ? .9 : .4, metalness: /TIRE|TREAD/.test(u) ? 0 : .25 });
      M.side = THREE.DoubleSide; M.userData = { k, g, l: l ? 1 : 0 };
      if (l) { const tc = { value: new THREE.Vector4() }; M.userData.tc = tc; M.onBeforeCompile = sh => { sh.uniforms.tc = tc; sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform vec4 tc;").replace("#include <map_fragment>", "#include <map_fragment>\nfloat rd=diffuseColor.r-max(diffuseColor.g,diffuseColor.b);diffuseColor.rgb=mix(diffuseColor.rgb,tc.rgb*clamp(diffuseColor.r*1.25,0.,1.3),smoothstep(.12,.4,rd)*tc.w);") } }
      return M2[key] = M
    }
    function bld(id, O, W, tp, mf, vm, y0) {
      const ctr = {}, wh = {}, pt = []; let mnY = 1e9;
      for (const o of O) if (o.n.startsWith(tp)) { const b = [1e9, 1e9, 1e9, -1e9, -1e9, -1e9]; for (let i = 0; i < o.v.length; i += 3)for (let k = 0; k < 3; k++) { b[k] = Math.min(b[k], o.v[i + k]); b[k + 3] = Math.max(b[k + 3], o.v[i + k]) } mnY = Math.min(mnY, b[1]); ctr[W[o.n]] = [0, 1, 2].map(k => (b[k] + b[k + 3]) / 2 * .001) }
      const c = new THREE.Group(), bd = new THREE.Group(); bd.position.y = mnY < 1e8 ? -mnY * .001 : y0; c.add(bd);
      for (const k in ctr) { const st = new THREE.Group(); st.position.fromArray(ctr[k]); const sp = new THREE.Group(); st.add(sp); bd.add(st); wh[k] = { st, sp, y0: ctr[k][1] } }
      for (const o of O) {
        const k = W[o.n], cc = k ? ctr[k] : [0, 0, 0], pos = new Float32Array(o.v.length); for (let i = 0; i < pos.length; i++)pos[i] = o.v[i] * .001 - cc[i % 3];
        const at = new THREE.BufferAttribute(pos, 3), tg = !k ? bd : (o.n.startsWith("fer_brake") || /^(rhx_c_|cf_c_|pt_c_|fp_c_|rb_c_|c_c_|w17_c_|w13_c_|sb_c_|w20_c_|fe_c_)/.test(o.n)) ? wh[k].st : wh[k].sp, og = new THREE.Group(), gp = /fwing|rwing/.test(o.n) ? "w" : "b",
          an = o.q ? new THREE.BufferAttribute(Float32Array.from(o.q, x => x / 127), 3) : null, au = o.t ? new THREE.BufferAttribute(Float32Array.from(o.t), 2) : null;
        for (const m in o.m) { const g = new THREE.BufferGeometry(); g.setAttribute("position", at); if (au) g.setAttribute("uv", au); g.setIndex(o.m[m]); if (an) g.setAttribute("normal", an); else g.computeVertexNormals(); const me = new THREE.Mesh(g, mf(m, gp)); me.userData.k = m; og.add(me) }
        og.name = o.n; tg.add(og); if (vm[o.n]) { og.userData.v = vm[o.n]; pt.push(og) }
      }
      c.rotation.order = "YXZ"; S.add(c); c.traverse(o => { if (o.isMesh) o.castShadow = true }); CARS[id] = { c, wh, pt }; {
        const ex = EXH[id] || [], fl = new THREE.Group(), ms = [], sp = []; let cx = 0, cy = 0, cz = 0;
        for (const [x, y, z, d] of ex) {
          const r = Math.max(.035, d * .0006), cone = (rr, L) => new THREE.Mesh(new THREE.CylinderGeometry(.01, rr, L, 16, 1, true).rotateX(-Math.PI / 2).translate(0, 0, -L / 2), FLM), p = [x * .001, y * .001, z * .001 + .03], m1 = cone(r, 1.9), m2 = cone(r * .5, 1.2), g = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, fog: false }));
          m1.position.set(...p); m2.position.set(...p); g.position.set(p[0], p[1], p[2] - .05); g.userData.s = r * 7 + .3; ms.push(m1, m2); sp.push(g); fl.add(m1, m2, g); cx += p[0]; cy += p[1]; cz += p[2]
        }
        const n = Math.max(1, ex.length); fl.userData = { ms, sp, cx: cx / n, cy: cy / n, cz: cz / n }; fl.visible = false; bd.add(fl); CARS[id].fl = fl
      }
    }
    const LZC = {}, LZB = {}, lzS = {}; let LZPOST = null;
    function lzLoad(...n) { return Promise.all(n.map(k => lzS[k] || (lzS[k] = new Promise((res, rej) => { const e = document.createElement("script"); e.src = "js/lz/" + k + ".js"; e.onload = () => { e.remove(); res() }; e.onerror = () => rej(new Error("data file missing: " + k)); document.head.appendChild(e) })))) }
    function lzToast(t) { let e = document.getElementById("xld"); if (!e) { e = document.createElement("div"); e.id = "xld"; e.style.cssText = "position:fixed;z-index:99998;left:50%;top:18%;transform:translateX(-50%);background:rgba(14,17,24,.92);color:#fff;border:1px solid #ffffff30;border-radius:12px;padding:10px 16px;font:600 14px system-ui,sans-serif"; document.body.appendChild(e) } e.textContent = t; e.style.display = t ? "block" : "none" }
    function setCar(id) {
      if (!CARS[id] && LZC[id]) { if (!LZB[id]) { lzToast("Loading " + (CN[id] || id) + "…"); LZB[id] = LZC[id]().then(() => { if (LZPOST) LZPOST(id); lzToast(""); delete LZB[id]; setCar(id) }).catch(e => { lzToast("Load failed: " + (e && e.message || e)); delete LZB[id]; setTimeout(() => lzToast(""), 3500) }) } return }
      const o = car; cur = id; for (const k in CARS) CARS[k].c.visible = k == id; const X = CARS[id]; if (o && o !== X.c) { X.c.position.copy(o.position); X.c.rotation.copy(o.rotation) } car = X.c; wheels = X.wh; parts = X.pt;
      $("bcar").innerHTML = '🏎<span class="tx"> ' + CN[id] + '</span>'; $("mt").textContent = TT[id]; { const nx = ORD[(ORD.indexOf(id) + 1) % ORD.length]; $("mcar").innerHTML = '🏎 Change car<small>Now: ' + TT[id] + ' · tap for ' + TT[nx] + '</small>' }
      document.querySelectorAll("#cs button").forEach(b => b.classList.toggle("on", b.dataset.c == id)); try { localStorage.setItem("f2008car", id) } catch (e) { } refreshUI(); if (dv && typeof dvSet == "function") dvSet(true)
    }
    const nextCar = () => { if (ready) setCar(ORD[(ORD.indexOf(cur) + 1) % ORD.length]) };
    document.querySelectorAll("#cs button").forEach(b => b.onclick = () => ready && setCar(b.dataset.c)); $("mcar").onclick = nextCar; $("bcar").onclick = nextCar;
    async function unz(s) {
      const bin = Uint8Array.from(atob(s), c => c.charCodeAt(0)); if (window.DecompressionStream) return await new Response(new Blob([bin]).stream().pipeThrough(new DecompressionStream("gzip"))).json();
      if (!window.pako) await new Promise((ok, no) => { const sc = document.createElement("script"); sc.src = "https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako_inflate.min.js"; sc.onload = ok; sc.onerror = () => no(new Error("pako load failed")); document.head.appendChild(sc) }); return JSON.parse(pako.ungzip(bin, { to: "string" }))
    }
    /* ---------- McLaren MP4/5 loader ---------- */
    async function unzB(s) {
      const bin = Uint8Array.from(atob(s), c => c.charCodeAt(0)); if (window.DecompressionStream) return new Uint8Array(await new Response(new Blob([bin]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer());
      if (!window.pako) await new Promise((ok, no) => { const sc = document.createElement("script"); sc.src = "https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako_inflate.min.js"; sc.onload = ok; sc.onerror = () => no(new Error("pako load failed")); document.head.appendChild(sc) }); return pako.ungzip(bin)
    }
    function dec5(u) {
      const dv = new DataView(u.buffer, u.byteOffset, u.byteLength), hl = dv.getUint32(0, true), H = JSON.parse(new TextDecoder().decode(u.subarray(4, 4 + hl))); let p = 4 + hl; const res = [];
      for (const o of H) {
        const nv = o.nv, v = new Int16Array(nv * 3), q = new Int8Array(nv * 3), t = new Float32Array(nv * 2), m = {};
        for (let i = 0; i < nv * 3; i++)v[i] = u[p + i] | (u[p + nv * 3 + i] << 8); p += nv * 6;
        for (let i = 0; i < nv * 3; i++)q[i] = (u[p + i] << 24) >> 24; p += nv * 3;
        for (let i = 0; i < nv * 2; i++)t[i] = (u[p + i] | (u[p + nv * 2 + i] << 8)) / 32767; p += nv * 4;
        for (const [mn, n] of o.m) { const a = new Array(n); let prev = 0; for (let i = 0; i < n; i++) { const z = u[p + i] | (u[p + n + i] << 8) | (u[p + 2 * n + i] << 16), d = (z >>> 1) ^ -(z & 1); prev += d; a[i] = prev } p += n * 3; m[mn] = a }
        res.push({ n: o.n, v, q, t, m })
      }
      return res
    }
    function mat4(k, g) {
      const key = "mp_" + k; if (M3[key]) return M3[key]; const t = new THREE.TextureLoader().load(T5[k]); t.anisotropy = 8;
      const o = { bottom_details_mat: [.55, .3], wheels_mat: [.7, .15], body_mat: [.35, .1], glass_details_mat: [.1, .4], interior_mat: [.6, .2] }[k] || [.6, .2], gl = k == "glass_details_mat";
      const M = new THREE.MeshStandardMaterial({ map: t, roughness: o[0], metalness: o[1], side: THREE.DoubleSide, transparent: gl, depthWrite: !gl }); M.userData = { k, fin: k == "body_mat" }; return M3[key] = M
    }
    function dec6(u) {
      const dv = new DataView(u.buffer, u.byteOffset, u.byteLength), hl = dv.getUint32(0, true), HD = JSON.parse(new TextDecoder().decode(u.subarray(4, 4 + hl))), US = HD.uvs; let p = 4 + hl; const res = [];
      for (const o of HD.o) {
        const nv = o.nv, v = new Int16Array(nv * 3), q = new Int8Array(nv * 3), t = new Float32Array(nv * 2), m = {};
        for (let i = 0; i < nv * 3; i++)v[i] = u[p + i] | (u[p + nv * 3 + i] << 8); p += nv * 6;
        for (let i = 0; i < nv * 3; i++)q[i] = (u[p + i] << 24) >> 24; p += nv * 3;
        for (let i = 0; i < nv * 2; i++)t[i] = (((u[p + i] | (u[p + nv * 2 + i] << 8)) << 16) >> 16) / US; p += nv * 4;
        for (const [mn, n] of o.m) { const a = new Array(n); let prev = 0; for (let i = 0; i < n; i++) { const z = u[p + i] | (u[p + n + i] << 8) | (u[p + 2 * n + i] << 16); prev += (z >>> 1) ^ -(z & 1); a[i] = prev } p += n * 3; m[mn] = a }
        res.push({ n: o.n, v, q, t, m })
      }
      return res
    }
    function mat6(k, g) {
      const key = "p1_" + k; if (M3[key]) return M3[key];
      const P = { carbon: [0xffffff, .4, .4], tyresw: [0xffffff, .75, 0], tyre: [0x101010, .92, 0], black: [0x16161c, .3, .2], purple: [0x4a08c0, .3, .2], red: [0xff2418, .4, .1], grey: [0x3c3c42, .5, .6], silver: [0xc8ccd2, .25, .8], glass: [0x0c141c, .08, .5] }[k] || [0x777777, .5, .3];
      const o = { color: P[0], roughness: P[1], metalness: P[2], side: THREE.DoubleSide };
      if (T6[k]) { const t = new THREE.TextureLoader().load(T6[k]); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; o.map = t }
      if (k == "glass") { o.transparent = true; o.opacity = .45; o.depthWrite = false }
      const M = new THREE.MeshStandardMaterial(o); M.userData = { k, fin: k == "black" || k == "purple" }; return M3[key] = M
    }
    function mat7(k, g) {
      const key = "rc_" + k; if (M3[key]) return M3[key];
      const P = { carb: [.45, .4], liv1: [.35, .1], liv2: [.35, .1], liv3: [.35, .1], cp1: [.6, .2], cp2: [.6, .2], cp3: [.6, .2], tread: [.9, 0], tyre: [.8, 0], hub: [.5, .6], glass: [.08, .5] }[k] || [.6, .2];
      const o = { color: k == "hub" ? 0x1a1a1e : k == "glass" ? 0x0c141c : 0xffffff, roughness: P[0], metalness: P[1], side: THREE.DoubleSide };
      if (T7[k]) { const t = new THREE.TextureLoader().load(T7[k]); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; o.map = t }
      if (k == "cp1" || k == "cp2" || k == "cp3") o.alphaTest = .4;
      if (k == "glass") { o.transparent = true; o.opacity = .45; o.depthWrite = false }
      const M = new THREE.MeshStandardMaterial(o); M.userData = { k, fin: k == "liv1" || k == "liv2" || k == "liv3" }; return M3[key] = M
    }
    function mat8(k, g) {
      const key = "c4_" + k; if (M3[key]) return M3[key];
      const P = { liv1: [.32, .12], liv2: [.32, .12], wht: [.5, .3], dash: [.5, .2], tyre: [.8, 0], m0: [.5, .3], k5: [.55, .3], k6: [.55, .3], k7: [.55, .3] }[k] || [.6, .2];
      const blk = k == "k5" || k == "k6" || k == "k7";
      const o = { color: blk ? 0x0b0b0d : k == "m0" ? 0x26262b : 0xffffff, roughness: P[0], metalness: P[1], side: THREE.DoubleSide };
      if (T8[k]) { const t = new THREE.TextureLoader().load(T8[k]); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; o.map = t }
      const M = new THREE.MeshStandardMaterial(o); M.userData = { k, fin: k == "liv1" || k == "liv2" }; return M3[key] = M
    }
    function mat9(k, g) {
      const key = "bol_" + k; if (M3[key]) return M3[key];
      const P = { mat: [0x10131a, .3, .4], paint: [0x0036b4, .3, .25], col: [0x1a1b21, .5, .35], carb: [0x0d0d10, .4, .5], rim: [0x70747c, .3, .85], rub: [0x111112, .9, 0], rot: [0x9a9ca2, .4, .8], grl1: [0x18181b, .6, .3], grl2: [0x0a0a0c, .6, .3], calb: [0xdddddd, .4, .6], calc: [0x1e3fb5, .4, .3], calt: [0x1a1a1c, .5, .4], logo: [0xe4e7ee, .25, .9], base: [0x0e0e10, .8, .1], int: [0x24252a, .6, .2], badge: [0xc8201a, .4, .3], ledf: [0xf4f8ff, .2, .1], ledr: [0xff2a1a, .4, .1], win: [0x0c141c, .08, .5] }[k] || [0x777777, .5, .3];
      const o = { color: P[0], roughness: P[1], metalness: P[2], side: THREE.DoubleSide };
      if (k == "win") { o.transparent = true; o.opacity = .5; o.depthWrite = false }
      if (k == "ledf") { o.emissive = 0xcfe0ff; o.emissiveIntensity = .6 }
      if (k == "ledr") { o.emissive = 0xff1a0a; o.emissiveIntensity = .7 }
      const M = new THREE.MeshStandardMaterial(o); M.userData = { k, fin: k == "mat" || k == "paint" }; return M3[key] = M
    }

    function mat11(k, g) {
      const key = "cf_" + k; if (M3[key]) return M3[key];
      const P = { carbon: [0x1b1b1e, .42, .5], livery: [0xc40a0a, .3, .15], gold: [0xe8b030, .3, .7], chrome: [0xdfe2e6, .18, 1], tyre: [0x101010, .92, 0], glass: [0x0c141c, .08, .5], mirror: [0xcfd4da, .1, 1] }[k] || [0x777777, .5, .3];
      const o = { color: P[0], roughness: P[1], metalness: P[2], side: THREE.DoubleSide };
      if (k == "glass") { o.transparent = true; o.opacity = .45; o.depthWrite = false }
      const M = new THREE.MeshStandardMaterial(o); M.userData = { k, fin: k == "livery", bp: k == "livery" }; return M3[key] = M
    }

    function mat12(k, g) {
      const key = "pt_" + k; if (M3[key]) return M3[key];
      const P = {
        paint: [0x0050ff, .3, .2], epaint: [0x0a3cff, .35, .3], black: [0x111113, .85, 0], rubber: [0x0e0e10, .9, 0], bplastic: [0x202024, .5, .1], plastic2: [0x303034, .5, .1], pwhite: [0xdcdcdc, .5, .1],
        screen: [0x050507, .1, .3], dash: [0x0b1a33, .2, .2], logo: [0xf5c518, .4, .2], sticker: [0x8a8a92, .5, .1], carbon: [0x1b1b1e, .42, .35], carbonr: [0x151517, .55, .25], strut: [0x30333a, .45, .4], rim: [0x9a9ea6, .35, .5],
        metal: [0xb0b4bc, .35, .55], joints: [0x8e929a, .4, .55], turbo: [0x8a6a50, .4, .6], comb: [0x70747c, .4, .6], anod: [0x5060ff, .35, .6], brass: [0x9a9138, .35, .6], light: [0xd01020, .3, .1], mirror: [0xcfd4da, .1, 1], glass: [0x0c141c, .08, .5],
        lgreen: [0x3dff3d, .3, 0], lblue: [0x3d7bff, .3, 0], lyellow: [0xffd400, .3, 0], lred: [0xff2a2a, .3, 0]
      }[k] || [0x777777, .5, .3];
      const o = { color: P[0], roughness: P[1], metalness: P[2], side: THREE.DoubleSide };
      if (k == "glass") { o.transparent = true; o.opacity = .45; o.depthWrite = false }
      if (k == "lgreen" || k == "lblue" || k == "lyellow" || k == "lred") { o.emissive = new THREE.Color(P[0]); o.emissiveIntensity = .6 }
      if (k == "dash") { o.emissive = new THREE.Color(0x0b2a66); o.emissiveIntensity = .8 }
      const M = new THREE.MeshStandardMaterial(o); M.userData = { k, fin: k == "paint", pp: k == "paint" }; return M3[key] = M
    }
    function mat10(k, g) {
      const key = "rhx_" + k; if (M3[key]) return M3[key];
      const P = { wine: [0x7a1126, .3, .3], white: [0xf1f1ec, .4, .1], bwhite: [0xffffff, .5, .1], alu: [0xc4c8cd, .28, .9], steel: [0xb2b6bb, .35, .9], bronze: [0x9a6330, .5, .8], blk: [0x111113, .4, .3], merc: [0xe2e6ea, .12, 1], tail: [0xd01020, .3, .1], gun: [0x3a3d42, .35, .85], glass: [0x9fb8c8, .08, .5], gold: [0xd4af37, .2, 1], lam: [0x222226, .6, .2], leather: [0xc9b08a, .7, .05], dark: [0x1b1c20, .45, .5], tyre: [0x0e0e0f, .9, 0], disc: [0x6b6f76, .45, .8], cal: [0xc99a2e, .35, .7] }[k] || [0x777777, .5, .3];
      const o = { color: P[0], roughness: P[1], metalness: P[2], side: THREE.DoubleSide };
      if (k == "glass") { o.transparent = true; o.opacity = .3; o.depthWrite = false }
      if (k == "tail") { o.emissive = 0xff1020; o.emissiveIntensity = .55 }
      const M = new THREE.MeshStandardMaterial(o); M.userData = { k, fin: k == "wine" || k == "white" || k == "bwhite", rp: k == "wine" }; return M3[key] = M
    }
    /* ===== FP04 RB (OBJ import): compact decoder + procedural PBR materials ===== */
    function dec13(u) {
      const dv = new DataView(u.buffer, u.byteOffset, u.byteLength), hl = dv.getUint32(0, true), H = JSON.parse(new TextDecoder().decode(u.subarray(4, 4 + hl))); let p = 4 + hl; const res = [];
      for (const o of H.o) {
        const nv = o.nv, v = new Float32Array(nv * 3), q = new Float32Array(nv * 3);
        for (let k = 0; k < 3; k++) { const a = o.bmin[k], e = (o.bmax[k] - a) || 1; for (let i = 0; i < nv; i++)v[i * 3 + k] = (a + ((u[p + i] | (u[p + nv + i] << 8)) / 65535) * e) * 1000; p += nv * 2 }
        const ox = new Int16Array(nv), oy = new Int16Array(nv);
        for (let i = 0; i < nv; i++)ox[i] = u[p + i] | (u[p + nv + i] << 8); p += nv * 2;
        for (let i = 0; i < nv; i++)oy[i] = u[p + i] | (u[p + nv + i] << 8); p += nv * 2;
        for (let i = 0; i < nv; i++) {
          let x = ox[i] / 32767, y = oy[i] / 32767, z = 1 - Math.abs(x) - Math.abs(y);
          if (z < 0) { const nx = (1 - Math.abs(y)) * (x >= 0 ? 1 : -1), ny = (1 - Math.abs(x)) * (y >= 0 ? 1 : -1); x = nx; y = ny }
          const l = Math.hypot(x, y, z) || 1; q[i * 3] = x / l * 127; q[i * 3 + 1] = y / l * 127; q[i * 3 + 2] = z / l * 127
        }
        const m = {};
        for (const [mn, n] of o.m) { const a = new Array(n); let prev = 0; for (let i = 0; i < n; i++) { const z = u[p + i] | (u[p + n + i] << 8) | (u[p + 2 * n + i] << 16); prev += (z >>> 1) ^ -(z & 1); a[i] = prev } p += 3 * n; m[mn] = a }
        res.push({ n: o.n, v, q, t: null, m })
      }
      return res
    }
    function dec17(u) {
      const dv = new DataView(u.buffer, u.byteOffset, u.byteLength), hl = dv.getUint32(0, true), H = JSON.parse(new TextDecoder().decode(u.subarray(4, 4 + hl))); let p = 4 + hl; const res = [];
      for (const o of H.o) {
        const nv = o.nv, v = new Int16Array(nv * 3), q = new Int8Array(nv * 3), m = {};
        for (let i = 0; i < nv * 3; i++)v[i] = u[p + i] | (u[p + nv * 3 + i] << 8); p += nv * 6;
        for (let i = 0; i < nv * 3; i++)q[i] = (u[p + i] << 24) >> 24; p += nv * 3;
        const n2 = nv * 2, tb = new Uint8Array(n2 * 4); for (let b = 0; b < 4; b++)for (let i = 0; i < n2; i++)tb[i * 4 + b] = u[p + b * n2 + i]; p += n2 * 4; const t = new Float32Array(tb.buffer);
        for (const [mn, n] of o.m) { const a = new Array(n); let prev = 0; for (let i = 0; i < n; i++) { const z = u[p + i] | (u[p + n + i] << 8) | (u[p + 2 * n + i] << 16); prev += (z >>> 1) ^ -(z & 1); a[i] = prev } p += n * 3; m[mn] = a }
        res.push({ n: o.n, v, q, t, m })
      }
      return res
    }

    /* ---------- Mercedes W17 2026 (OBJ -> packed, float UVs, 4 wheels split from the merged tyre/hub meshes) ---------- */
    const W17T = [], W17K = { c3: { r: .4, m: .45 } };
    const W17M = {
      "generics.007": { r: .6, m: .2 }, "mercedes_decals.005": { d: 1 }, "mercedes_carbon3.007": { r: .4, m: .45 }, "mercedes_detail.007": { r: .55, m: .3 }, "mercedes_carbon1.007": { r: .4, m: .45 },
      "rear_light_2.007": { r: .4, m: .1, e: 1 }, "mercedes_number_63.005": { d: 1 }, "mercedes_mirror_left.005": { r: .1, m: .9 }, "mercedes_paint.007": { r: .3, m: .15, fin: 1 }, "mercedes_paint2.007": { r: .3, m: .15, fin: 1 },
      "mercedes_mirror_right.005": { r: .1, m: .9 }, "mercedes_wheel_hub.007": { r: .35, m: .7 }, "discs.007": { r: .5, m: .6 }, "sidewall.007": { r: .9, m: 0 }, "tread_medium.007": { r: .92, m: 0 },
      "chrome.004": { r: .15, m: 1, c: 0xcfd4da }, "gp21_cinture.004": { r: .9, m: 0 }, "mercedes_carbon2.005": { r: .4, m: .45 }, "mercedes_sw.005": { r: .5, m: .3 }, "sw_decals.003": { d: 1 },
      "sw_carbon.003": { r: .4, m: .45 }, "indicator_lights.004": { r: .5, m: .1, e: 1 }, "rev_lights.003": { r: .4, m: .45 }, "generics_lcd.003": { r: .2, m: .3 },
      "kers_red.003": { r: .4, m: .1, c: 0xff2a1a, ec: 0xff2a1a }, "kers_green.003": { r: .4, m: .1, c: 0x2aff55, ec: 0x2aff55 }, "whitelight.003": { r: .4, m: .1, c: 0xffffff, ec: 0xffffff }, "CLEARLED.003": { d: 1, e: 1 }
    };
    function mat14(k, g) {
      const key = "w17_" + k; if (M3[key]) return M3[key]; const P = W17M[k] || { r: .6, m: .2 }, ti = T14.map[k]; let t = null;
      if (ti !== undefined && !P.c) { t = W17T[ti] || (W17T[ti] = new THREE.TextureLoader().load(T14.imgs[ti])); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8 }
      const o = { map: t, color: P.c || (t ? 0xffffff : 0x1c1c1e), roughness: P.r === undefined ? .5 : P.r, metalness: P.m === undefined ? .1 : P.m, side: THREE.DoubleSide };
      if (P.d) { o.transparent = true; o.depthWrite = false; o.polygonOffset = true; o.polygonOffsetFactor = -2; o.polygonOffsetUnits = -2 }
      if (P.e && t) { o.emissive = new THREE.Color(0xffffff); o.emissiveMap = t; o.emissiveIntensity = .5 }
      if (P.ec) { o.emissive = new THREE.Color(P.ec); o.emissiveIntensity = 1.2 }
      const M = new THREE.MeshStandardMaterial(o); M.userData = { k, fin: !!P.fin }; return M3[key] = M
    }

    /* ---------- Mercedes W13 concept ---------- */
    const W13T = [], W13M = {
      BlackHole: { c: 0x070707, r: .7, m: .1 }, Body_Wings: { r: .35, m: .3 }, Titanium: { r: .3, m: .8 }, Details: { r: .5, m: .3 }, Carbon_Fiber: { r: .4, m: .45 },
      Tyre: { r: .92, m: 0 }, Body_Main: { r: .28, m: .2, fin: 1 }, Mirror: { c: 0xd0d4d8, r: .05, m: 1 }, Glass: { c: 0x0b0b0d, r: .05, m: .6, t: .5 }, GlassLight: { c: 0x2a2a2e, r: .1, m: .2, t: .43 }
    };
    function mat15(k, g) {
      const key = "w13_" + k; if (M3[key]) return M3[key]; const P = W13M[k] || { r: .6, m: .2 }, ti = T15.map[k]; let t = null;
      if (ti !== undefined && !P.c) { t = W13T[ti] || (W13T[ti] = new THREE.TextureLoader().load(T15.imgs[ti])); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8 }
      const o = { map: t, color: P.c || 0xffffff, roughness: P.r, metalness: P.m, side: THREE.DoubleSide };
      if (P.t) { o.transparent = true; o.opacity = P.t; o.depthWrite = false }
      const M = new THREE.MeshStandardMaterial(o); M.userData = { k, fin: !!P.fin }; return M3[key] = M
    }

    /* ---------- Kick Sauber C44 #27 ---------- */
    const SBT = [], SBM = {
      "generics.007": { r: .6, m: .2 }, "sauber_decals.005": { d: 1 }, "sauber_carbon3.007": { r: .4, m: .45 }, "sauber_carbon1.007": { r: .4, m: .45 }, "sauber_detail.007": { r: .55, m: .3 },
      "rear_light_2.015": { r: .4, m: .1, e: 1 }, "sauber_number_27.005": { d: 1 }, "sauber_mirror_right.005": { r: .05, m: 1, c: 0xd0d4d8 }, "sauber_mirror_left.005": { r: .05, m: 1, c: 0xd0d4d8 },
      "glass.011": { r: .05, m: .6, t: .45 }, "sauber_paint.007": { r: .3, m: .15, fin: 1 }, "sauber_wheel_hub.007": { r: .35, m: .7 }, "discs.015": { r: .5, m: .6 }, "sidewall.015": { r: .9, m: 0 }, "tread_medium.015": { r: .92, m: 0 },
      "chrome.012": { r: .15, m: 1, c: 0xcfd4da }, "chrome_ao.004": { r: .3, m: .8 }, "black_s.012": { r: .6, m: .1 }, "gp21_cinture.008": { r: .9, m: 0 }, "audi_steeringwheel.003": { r: .5, m: .3 }, "sw_decals.007": { d: 1 },
      "indicator_lights.007": { r: .5, m: .1, e: 1 }, "indicator_lights.008": { r: .5, m: .1, e: 1 }, "vehicle_revs_type2.004": { r: .4, m: .45 }, "generic_lcd.004": { r: .2, m: .3 }, "CLEARLED.003": { r: .3, m: 0, e: 1 }, "driver_color.005": { r: .5, m: 0 },
      "kers_red.003": { r: .4, m: .1, c: 0xff2a1a, ec: 0xff2a1a }, "kers_green.003": { r: .4, m: .1, c: 0x2aff55, ec: 0x2aff55 }, "kers_yellow.003": { r: .4, m: .1, c: 0xffe83a, ec: 0xffe83a }, "whitelight.003": { r: .4, m: .1, c: 0xffffff, ec: 0xffffff }
    };
    function mat16(k, g) {
      const key = "sb_" + k; if (M3[key]) return M3[key]; const P = SBM[k] || { r: .6, m: .2 }, ti = T16.map[k]; let t = null;
      if (ti !== undefined && !P.c) { t = SBT[ti] || (SBT[ti] = new THREE.TextureLoader().load(T16.imgs[ti])); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8 }
      const o = { map: t, color: P.c || (t ? 0xffffff : 0x1c1c1e), roughness: P.r === undefined ? .5 : P.r, metalness: P.m === undefined ? .1 : P.m, side: THREE.DoubleSide };
      if (P.d) { o.transparent = true; o.depthWrite = false; o.polygonOffset = true; o.polygonOffsetFactor = -2; o.polygonOffsetUnits = -2 }
      if (P.t) { o.transparent = true; o.opacity = P.t; o.depthWrite = false }
      if (P.e && t) { o.emissive = new THREE.Color(0xffffff); o.emissiveMap = t; o.emissiveIntensity = .5 }
      if (P.ec) { o.emissive = new THREE.Color(P.ec); o.emissiveIntensity = 1.2 }
      const M = new THREE.MeshStandardMaterial(o); M.userData = { k, fin: !!P.fin }; return M3[key] = M
    }
    /* ---------- Mercedes W11 2020 ---------- */
    const W20T = [], W20M = {
      Mirror: { c: 0xd0d4d8, r: .05, m: 1 }, WeRaceLogo: { d: 1 }, MERCEDES_CARBON1: { r: .4, m: .45 }, MERCEDES_CARBON2: { r: .4, m: .45 }, mercedes_carbon3: { r: .4, m: .45 }, mercedes_carbon4: { r: .4, m: .45 },
      EXT_Decals_Lights: { d: 1 }, Material__2: { d: 1 }, MERCEDES_PAINT: { r: .3, m: .15, fin: 1 }, merc1: { r: .3, m: .15, fin: 1 }, GENERIC: { r: .6, m: .2 }, GENERICS: { r: .6, m: .2 },
      car_chassis: { r: .45, m: .35 }, tvcam: { c: 0x060606, r: .5, m: .2 }, MERCEDES_DETAIL: { r: .55, m: .3 }, EXT_Caliper_Logo: { d: 1 }, EXT_Caliper: { c: 0x9aa0a6, r: .4, m: .6 },
      Tyre: { r: .92, m: 0 }, mercedes_wheel_hub: { r: .35, m: .7 }, discs: { r: .5, m: .6 }, EXT_Disc: { r: .5, m: .6 }, Halo_Stripes: { d: 1 }, driver_number: { d: 1 }, _decals: { d: 1 },
      GLASS: { c: 0x0b0b0d, r: .05, m: .6, t: .45 }, Car_wing: { r: .4, m: .4 }, "2020_light": { d: 1, e: 1 }, REAR_LIGHT: { d: 1, e: 1 }, mercedes_steeringwheel: { r: .5, m: .3 },
      CLEARLED: { d: 1, e: 1 }, CLEARLED_PRE: { d: 1, e: 1 }, W11_DISPLAY: { r: .2, m: .3, e: 1 }, kers_brown: { r: .4, m: .1, e: 1 }, kers_green: { r: .4, m: .1, e: 1 }, kers_red: { r: .4, m: .1, e: 1 },
      gp21_LCD: { r: .2, m: .3, e: 1 }, TAG_DRS_ON: { d: 1 }, SW_ALPHA: { d: 1 }, Steer_Logo: { d: 1 }, vehicle_revs_type2: { r: .4, m: .45 }, "Material.001": { d: 1 }
    };
    function mat17(k, g) {
      const key = "w20_" + k; if (M3[key]) return M3[key]; const P = W20M[k] || { r: .6, m: .2 }, ti = T17.map[k]; let t = null;
      if (ti !== undefined && !P.c) { t = W20T[ti] || (W20T[ti] = new THREE.TextureLoader().load(T17.imgs[ti])); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8 }
      const o = { map: t, color: P.c || (t ? 0xffffff : 0x1c1c1e), roughness: P.r === undefined ? .5 : P.r, metalness: P.m === undefined ? .1 : P.m, side: THREE.DoubleSide };
      if (P.d) { o.transparent = true; o.depthWrite = false; o.polygonOffset = true; o.polygonOffsetFactor = -2; o.polygonOffsetUnits = -2 }
      if (P.t) { o.transparent = true; o.opacity = P.t; o.depthWrite = false }
      if (P.e && t) { o.emissive = new THREE.Color(0xffffff); o.emissiveMap = t; o.emissiveIntensity = .5 }
      const M = new THREE.MeshStandardMaterial(o); M.userData = { k, fin: !!P.fin }; return M3[key] = M
    }
    /* ---------- Formula E Gen2 Spark SRT05e (OBJ -> packed; body/decals/wheels split, atlas + decal textures) ---------- */
    const FET = [], FEM = {
      atlas: { r: .6, m: .15 }, watlas: { r: .7, m: .1 }, black: { c: 0x141416, r: .4, m: .4, fin: 1 }, wblack: { c: 0x141416, r: .5, m: .3 }, wgrey: { c: 0x2d3036, r: .5, m: .4 },
      carbon: { c: 0x0d0d0f, r: .35, m: .5, fin: 1 }, grey: { c: 0x2d3036, r: .45, m: .5, fin: 1 },
      accent: { c: 0x00b4ff, r: .3, m: .2, ec: 0x00a8ff, ei: .7 }, decal_a: { d: 1 }, decal_b: { d: 1 },
      glass: { c: 0x0b0b0d, r: .05, m: .6, t: .5 }, rlight: { c: 0xff2010, r: .3, m: .1, ec: 0xff1a0a, ei: 1.1, t: .9 }
    };
    function mat18(k, g) {
      const key = "fe_" + k; if (M3[key]) return M3[key]; const P = FEM[k] || { r: .6, m: .2 }, ti = T18.map[k]; let t = null;
      if (ti !== undefined && !P.c) { t = FET[ti] || (FET[ti] = new THREE.TextureLoader().load(T18.imgs[ti])); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8 }
      const o = { map: t, color: P.c || (t ? 0xffffff : 0x1c1c1e), roughness: P.r === undefined ? .5 : P.r, metalness: P.m === undefined ? .1 : P.m, side: THREE.DoubleSide };
      if (P.d) { o.transparent = true; o.depthWrite = false; o.polygonOffset = true; o.polygonOffsetFactor = -2; o.polygonOffsetUnits = -2 }
      if (P.t) { o.transparent = true; o.opacity = P.t; o.depthWrite = false }
      if (P.ec) { o.emissive = new THREE.Color(P.ec); o.emissiveIntensity = P.ei || .6 }
      const M = new THREE.MeshStandardMaterial(o); M.userData = { k, fin: !!P.fin }; return M3[key] = M
    }
    /* 2/2 twill carbon weave, projected triplanar from object-space position (no UVs needed, mip-mapped => no shimmer) */
    const carbT = mkTex(128, 128, (g, w, h) => {
      g.fillStyle = "#222"; g.fillRect(0, 0, w, h); const cs = 16;
      for (let j = 0; j < h / cs; j++)for (let i = 0; i < w / cs; i++) {
        const warp = ((((i - j) % 4) + 4) % 4) < 2, x = i * cs, y = j * cs, gr = warp ? g.createLinearGradient(x, 0, x + cs, 0) : g.createLinearGradient(0, y, 0, y + cs);
        gr.addColorStop(0, "#3c3c3c"); gr.addColorStop(.5, warp ? "#f2f2f2" : "#c8c8c8"); gr.addColorStop(1, "#3c3c3c"); g.fillStyle = gr; g.fillRect(x, y, cs, cs)
      }
    }), carbU = { value: carbT };
    const carbHook = sh => {
      sh.uniforms.cT = carbU; sh.uniforms.cM = { value: 1 };
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vLP,vLN;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvLP=position;vLN=normal;");
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform sampler2D cT;uniform float cM;varying vec3 vLP,vLN;").replace("#include <map_fragment>", "{vec3 an=pow(abs(normalize(vLN)),vec3(6.));an/=(an.x+an.y+an.z);vec3 t=texture2D(cT,vLP.yz*6.25).rgb*an.x+texture2D(cT,vLP.xz*6.25).rgb*an.y+texture2D(cT,vLP.xy*6.25).rgb*an.z;diffuseColor.rgb*=mix(vec3(1.),t,cM);}")
    };
    const FPC = { c: 0x2e3036, r: .3, m: .3, w: 1, f: 1 }, FPR = { c: 0x2a2c31, r: .55, m: .2, w: 1 }, FPP = { c: 0x2b2d31, r: .55, m: .1 }, FPK = { c: 0x0f0f11, r: .9, m: 0 }, FPA = { c: 0x80858d, r: .35, m: .9 }, FPX = { c: 0xdfe3e8, r: .12, m: 1 }, FPB = { c: 0xb8993a, r: .3, m: .9 }, FPS = { c: 0x0a1a33, r: .2, m: .2, e: [0x0b2a66, .8] }, FPL = { c: 0x121214, r: .55, m: .05 }, FPD = { c: 0x8e9299, r: .4, m: .9 }, FPE = c => ({ c, r: .3, m: 0, e: [c, 1.1] });
    const FPM = {
      "Carbon_Fiber_no_UV_": FPC, "Carbon_Fiber_no_UV_.001": FPC, "Carbon_Fiber_Procedural": FPC, "Carbon_Fiber_no_UV__rough": FPR, "Carbon_Fiber_no_UV__rough.002": FPR, "Carbon_Fiber_no_UV__rough_steering_wheel.002": FPR,
      "mat_Plastic.001": FPP, "mat_Plastic.002": FPP, "Rubber": FPK, "Rubber.002": FPK, "Tyre_Thread_": { c: 0x161617, r: .92, m: 0 },
      "Glossy_Paint_wheel": { c: 0x1a1b20, r: .28, m: .6 }, "Paint_wheel_cover": { c: 0x181a1f, r: .3, m: .4 }, "reflex_yellow": { c: 0xffd800, r: .35, m: .1 },
      "AnodizedMetal_silver": { c: 0xc2c7cf, r: .28, m: 1 }, "AnodizedMetal_grey": FPA, "AnodizedMetal_grey.001": FPA, "Anodized_Metal_grey": { c: 0xd0121f, r: .35, m: .7 },
      "chrome_exhaust": { c: 0xa89c8a, r: .35, m: .95 }, "chrome_exhaust_inner": { c: 0x2a2623, r: .6, m: .8 }, "chrome": FPX, "Chrome.001": FPX, "metal": { c: 0xcfd4da, r: .2, m: 1 }, "default": { c: 0xcfd4da, r: .08, m: 1 },
      "BMD_Brass": FPB, "BMD_Brass.001": FPB, "ferrari_dashboard_screen": FPS, "display_screen.001": FPS,
      "blacklather": { c: 0x151515, r: .65, m: 0 }, "leather2": { c: 0xb40f0a, r: .55, m: 0 }, "helmet": { c: 0xf06a10, r: .3, m: .1 }, "audi_white": { c: 0xf2f2ee, r: .25, m: .05, f: 1 }, "suit": { c: 0x1c2747, r: .85, m: 0 },
      "glass": { c: 0x7a8896, r: .05, m: .3, o: .3 }, "Polycarbonate.001": { c: 0x1a2430, r: .05, m: .3, o: .55 }, "Polycarbonate_dark.001": { c: 0x0c0f14, r: .05, m: .3, o: .7 }, "PP.001": { c: 0x9aa0a6, r: .6, m: .1 },
      "blackdiffuse": { c: 0x0b0b0c, r: .9, m: 0 }, "Material_map.001": { c: 0x303338, r: .6, m: .1 }, "Black_plastic_PL.001": FPL, "Black_plastic_PL.002": FPL, "Black_plastic_PL.003": FPL,
      "Degradable_Metal.002": FPD, "Degradable_Metal.003": FPD, "Fabric_02.001": { c: 0x2a2a30, r: .95, m: 0 }, "BMD_Felt_0018": { c: 0x1d1d22, r: 1, m: 0 }, "Fabric_seatbelts": { c: 0x1c1f2a, r: .9, m: 0 },
      "rear_led_emmitor": FPE(0xff1a0a), "glass_clear_headlight": { c: 0xaa1010, r: .05, m: .2, o: .45 }, "glass_clear_headlight.001": { c: 0xc8d4e0, r: .05, m: .2, o: .15 },
      "steering_wheel_stickers.001": { c: 0xe9e9e9, r: .5, m: 0 }, "plastic_white": { c: 0xeeeeee, r: .5, m: 0 },
      "Translucent_Plastic_green": FPE(0x37ff2a), "Translucent_Plastic_blue": FPE(0x2a6bff), "Translucent_Plastic_red": FPE(0xff2a2a), "Translucent_Plastic_yellow": FPE(0xffd400)
    };
    const FPPNT = new Set(["Carbon_Fiber_no_UV_", "Carbon_Fiber_no_UV_.001", "Carbon_Fiber_Procedural"]);
    /* FP04 body paint: carbon weave OR solid / metallic / gloss / matte paint */
    function fpPaint() {
      const m = CFG.fpm || "carbon", Pm = { metal: [.3, .7, 1, .04], gloss: [.2, .1, 1, .03], matte: [.82, .05, 0, 0] }[m];
      for (const k in M3) {
        const M = M3[k], u = M.userData; if (!u.fpp) continue;
        if (!Pm) { M.color.setHex(u.d.c); M.roughness = u.d.r; M.metalness = u.d.m; M.clearcoat = 0; u.cM.value = 1 }
        else { M.color.set(CFG.fpc); M.roughness = Pm[0]; M.metalness = Pm[1]; M.clearcoat = Pm[2]; M.clearcoatRoughness = Pm[3]; u.cM.value = 0 }
        if (u.pm !== m) { u.pm = m; M.needsUpdate = true }
      }
    }
    function mat13(k, g) {
      const key = "fp_" + k; if (M3[key]) return M3[key];
      const d = FPM[k] || { c: 0x777777, r: .5, m: .3 }, o = { color: d.c, roughness: d.r, metalness: d.m, side: THREE.DoubleSide }, pn = FPPNT.has(k);
      if (d.o) { o.transparent = true; o.opacity = d.o; o.depthWrite = false }
      if (d.e) { o.emissive = new THREE.Color(d.e[0]); o.emissiveIntensity = d.e[1] }
      const M = pn ? new THREE.MeshPhysicalMaterial(o) : new THREE.MeshStandardMaterial(o); if (d.w) M.onBeforeCompile = pn ? (sh => { carbHook(sh); sh.uniforms.cM = M.userData.cM }) : carbHook; M.userData = pn ? { k, fin: false, fpp: 1, cM: { value: 1 }, d } : { k, fin: !!d.f }; return M3[key] = M
    }
    /* Royal X: model ke wheel axles tirche export hue the (front ~12-16 deg steered, rear ~2 deg toe/camber) -> spin wobble. Har wheel + caliper ko axle->X pe straighten karo */
    function fixRhx(O) {
      const AX = { "fl": [0.9776, -0.0302, -0.2081], "fr": [0.9631, 0.0263, -0.2677], "rl": [0.9991, -0.0202, -0.037], "rr": [0.9986, 0.0395, 0.0359] };
      for (const k in AX) {
        const w = O.find(o => o.n == "rhx_w_" + k); if (!w) continue; const c = O.find(o => o.n == "rhx_c_" + k), a = AX[k], l = Math.hypot(a[0], a[1], a[2]), ax = a[0] / l, ay = a[1] / l, az = a[2] / l,
          ux = 0, uy = az, uz = -ay, s2 = uy * uy + uz * uz; if (s2 < 1e-12) continue; const f = (1 - ax) / s2,
            R = [1 + f * (-s2), -uz, uy, uz, 1 + f * (-uz * uz), f * (uy * uz), -uy, f * (uy * uz), 1 + f * (-uy * uy)];
        /* R=I+[u]x+[u]x^2*(1-c)/s^2, u=a x X */
        const b = [1e9, 1e9, 1e9, -1e9, -1e9, -1e9]; for (let i = 0; i < w.v.length; i += 3)for (let j = 0; j < 3; j++) { b[j] = Math.min(b[j], w.v[i + j]); b[j + 3] = Math.max(b[j + 3], w.v[i + j]) }
        const px = (b[0] + b[3]) / 2, py = (b[1] + b[4]) / 2, pz = (b[2] + b[5]) / 2;
        for (const o of [w, c]) {
          if (!o) continue; const V = new Float32Array(o.v.length);
          for (let i = 0; i < V.length; i += 3) { const x = o.v[i] - px, y = o.v[i + 1] - py, z = o.v[i + 2] - pz; V[i] = px + R[0] * x + R[1] * y + R[2] * z; V[i + 1] = py + R[3] * x + R[4] * y + R[5] * z; V[i + 2] = pz + R[6] * x + R[7] * y + R[8] * z }
          o.v = V; if (o.q) { const Q = new Int8Array(o.q.length); for (let i = 0; i < Q.length; i += 3) { const x = o.q[i], y = o.q[i + 1], z = o.q[i + 2]; Q[i] = Math.round(R[0] * x + R[1] * y + R[2] * z); Q[i + 1] = Math.round(R[3] * x + R[4] * y + R[5] * z); Q[i + 2] = Math.round(R[6] * x + R[7] * y + R[8] * z) } o.q = Q }
        }
      }
      return O
    }
    /* RB 2022 / C44: the front wheel cover (hub / brake disc fairing) was baked into the single body mesh, so it stayed fixed while the wheel steered. Pull those triangles out into their own object (compact vertex copy) so bld() attaches them to the wheel steer group.
       mode "cc": the connected shell around the wheel axle (RB 2022) | mode "cyl": every triangle fully inside the wheel's cylinder (C44, whose cover is welded to other parts) */
    function splitCov(O, bn, wp, cp, mode) {
      const body = O.find(o => o.n == bn); if (!body) return O; const P = body.v, out = [];
      for (const k of ["fl", "fr"]) {
        const w = O.find(o => o.n == wp + k); if (!w) continue;
        const b = [1e9, 1e9, 1e9, -1e9, -1e9, -1e9]; for (let i = 0; i < w.v.length; i += 3) for (let j = 0; j < 3; j++) { b[j] = Math.min(b[j], w.v[i + j]); b[j + 3] = Math.max(b[j + 3], w.v[i + j]) }
        const cx = (b[0] + b[3]) / 2, cy = (b[1] + b[4]) / 2, cz = (b[2] + b[5]) / 2, R = (b[4] - b[1]) / 2, hw = (b[3] - b[0]) / 2, sg = Math.sign(cx), tris = [];
        for (const mk in body.m) { const a = body.m[mk]; for (let t = 0; t < a.length; t += 3) { let x = 0, y = 0, z = 0; for (let q = 0; q < 3; q++) { const i = a[t + q] * 3; x += P[i]; y += P[i + 1]; z += P[i + 2] } x /= 3; y /= 3; z /= 3; if (Math.abs(x - cx) < hw * 4 && Math.hypot(y - cy, z - cz) < R * 1.4) tris.push([mk, t]) } }
        const mm = {}, add = (mk, t) => (mm[mk] = mm[mk] || []).push(t);
        const id = new Map(), par = [], find = a => { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a] } return a };
        const vid = i => { const s = Math.round(P[i * 3] * 4) + "," + Math.round(P[i * 3 + 1] * 4) + "," + Math.round(P[i * 3 + 2] * 4); let r = id.get(s); if (r === undefined) { r = par.length; par.push(r); id.set(s, r) } return r };
        const tv = tris.map(([mk, t]) => { const a = body.m[mk]; return [vid(a[t]), vid(a[t + 1]), vid(a[t + 2])] });
        tv.forEach(([a, b, c]) => { par[find(b)] = find(a); par[find(c)] = find(a) });
        if (mode == "cyl") {
          /* core = triangles fully inside the wheel cylinder; then take everything of the same welded shell that lies near the wheel (also the fairing that sits just above the tyre) */
          const inC = i => Math.hypot(P[i * 3 + 1] - cy, P[i * 3 + 2] - cz) <= R && (P[i * 3] - cx) * sg >= -260 && (P[i * 3] - cx) * sg <= hw + 20;
          const core = new Map(); tris.forEach(([mk, t], n) => { const a = body.m[mk]; if (inC(a[t]) && inC(a[t + 1]) && inC(a[t + 2])) { const r = find(tv[n][0]); core.set(r, (core.get(r) || 0) + 1) } });
          const keep = new Set(); core.forEach((c, r) => { if (c > 300) keep.add(r) });
          tris.forEach(([mk, t], n) => { if (!keep.has(find(tv[n][0]))) return; const a = body.m[mk]; let x = 0, y = 0, z = 0; for (let q = 0; q < 3; q++) { const i = a[t + q] * 3; x += P[i]; y += P[i + 1]; z += P[i + 2] } x /= 3; y /= 3; z /= 3; const ax = (x - cx) * sg; if (Math.hypot(y - cy, z - cz) <= R * 1.3 && ax >= -260 && ax <= hw + 40) add(mk, t) })
        } else {
          const cm = new Map(); tris.forEach(([mk, t], n) => { const r = find(tv[n][0]); let e = cm.get(r); if (!e) { e = { n: 0, b: [1e9, 1e9, 1e9, -1e9, -1e9, -1e9] }; cm.set(r, e) } e.n++; for (let q = 0; q < 3; q++) { const i = body.m[mk][t + q] * 3; for (let j = 0; j < 3; j++) { e.b[j] = Math.min(e.b[j], P[i + j]); e.b[j + 3] = Math.max(e.b[j + 3], P[i + j]) } } });
          let best = null, ba = 0; cm.forEach((e, r) => { const sx = e.b[3] - e.b[0], sy = e.b[4] - e.b[1], sz = e.b[5] - e.b[2], ey = (e.b[1] + e.b[4]) / 2, ez = (e.b[2] + e.b[5]) / 2; if (e.n >= 200 && sx < hw * 1.6 && Math.abs(ey - cy) < R * .5 && Math.abs(ez - cz) < R * .5 && sy * sz > ba) { ba = sy * sz; best = r } });
          if (best === null) continue; tris.forEach(([mk, t], n) => { if (find(tv[n][0]) === best) add(mk, t) })
        }
        let any = false; for (const mk in mm) if (mm[mk].length) any = true; if (!any) continue;
        const used = new Map(), nv = [], nq = [], nt = [], idx = i => { let r = used.get(i); if (r === undefined) { r = used.size; used.set(i, r); nv.push(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]); if (body.q) nq.push(body.q[i * 3], body.q[i * 3 + 1], body.q[i * 3 + 2]); if (body.t) nt.push(body.t[i * 2], body.t[i * 2 + 1]) } return r };
        const cover = { n: cp + k, m: {} };
        for (const mk in mm) { const a = body.m[mk], drop = new Set(mm[mk]), keep = [], mv = []; for (let t = 0; t < a.length; t += 3) (drop.has(t) ? mv : keep).push(a[t], a[t + 1], a[t + 2]); if (keep.length) body.m[mk] = keep; else delete body.m[mk]; cover.m[mk] = mv.map(idx) }
        cover.v = nv; if (body.q) cover.q = nq; if (body.t) cover.t = nt; out.push(cover)
      }
      return O.concat(out)
    }

    /* ================= STICKERS: one decal / pattern layer over every opaque body panel of every car =================
       Projected in car-local space (triplanar), so it wraps the whole body: sides, top, nose, rear.
       Wheels, tyres, glass and lights are skipped. Patched lazily (first time a sticker is picked) so default look/perf is untouched. */
    const STKU = { sT: { value: null }, sP: { value: new THREE.Vector4(1.2, 0, 0, 0) }, sQ: { value: new THREE.Vector4(0, .45, 0, 0) } };
    const STK = { id: "none", mode: "tile", size: 1.2, op: 1, ox: 0, oy: .45, txt: "F1", data: null }; let stkTex = null, stkPatched = false;
    function stkHook(sh) {
      sh.uniforms.sT = STKU.sT; sh.uniforms.sP = STKU.sP; sh.uniforms.sQ = STKU.sQ;
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vSP,vSN;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvSP=position;vSN=normal;");
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", `#include <common>
uniform sampler2D sT;uniform vec4 sP,sQ;varying vec3 vSP,vSN;
vec4 stkS(){
 vec3 n=abs(normalize(vSN)); vec3 w=pow(n,vec3(8.)); w/=(w.x+w.y+w.z+1e-5);
 vec2 ux,uy,uz;
 if(sP.z<.5){ ux=vSP.zy/sP.x; uy=vSP.xz/sP.x; uz=vSP.xy/sP.x; }
 else { float sg=vSP.x>0.?-1.:1.; ux=vec2(sg*(vSP.z-sQ.x),vSP.y-sQ.y)/sP.x+.5; uy=vec2(vSP.x,-(vSP.z-sQ.x))/sP.x+.5; uz=vec2(vSP.x,vSP.y-sQ.y)/sP.x+.5; }
 vec4 a=texture2D(sT,ux),b=texture2D(sT,uy),d=texture2D(sT,uz);
 if(sP.z>.5){ a.a*=step(0.,ux.x)*step(ux.x,1.)*step(0.,ux.y)*step(ux.y,1.); b.a*=step(0.,uy.x)*step(uy.x,1.)*step(0.,uy.y)*step(uy.y,1.); d.a*=step(0.,uz.x)*step(uz.x,1.)*step(0.,uz.y)*step(uz.y,1.); }
 float aa=a.a*w.x+b.a*w.y+d.a*w.z; vec3 col=(a.rgb*a.a*w.x+b.rgb*b.a*w.y+d.rgb*d.a*w.z)/max(aa,1e-4);
 return vec4(col,aa);
}`).replace("#include <color_fragment>", "#include <color_fragment>\nif(sP.y>.001){vec4 sc=stkS();diffuseColor.rgb=mix(diffuseColor.rgb,sc.rgb,sc.a*sP.y);}")
    }
    function stkPatch() {
      if (stkPatched) return; stkPatched = true; for (const id in CARS) stkPatchCar(id)
    }
    function stkPatchCar(id) {
      {
        const X = CARS[id], wst = new Set(Object.values(X.wh).map(w => w.st));
        X.c.traverse(me => {
          if (!me.isMesh) return; for (let a = me; a && a !== X.c; a = a.parent) if (wst.has(a) || a === X.fl) return;
          if (/FERWH|LEDSL|Shaft|glass|glas|lens|tire|tyre|rubber/i.test(me.userData.k || "")) return;
          [].concat(me.material).forEach(M => {
            if (!M || !M.isMeshStandardMaterial || M.transparent || M.userData.stk || (M.emissive && M.emissive.getHex() > 0)) return;
            const prev = M.onBeforeCompile; M.onBeforeCompile = function (sh, r) { if (prev) prev.call(this, sh, r); stkHook(sh) };
            M.customProgramCacheKey = () => "stk" + (prev ? prev.toString() : ""); M.userData.stk = 1; M.needsUpdate = true
          })
        })
      }
    }
    function stkCanvas() { const c = document.createElement("canvas"); c.width = c.height = 512; return [c, c.getContext("2d")] }
    function stkWrap(ctx, fn) { for (const dx of [-512, 0, 512]) for (const dy of [-512, 0, 512]) { ctx.save(); ctx.translate(dx, dy); fn(); ctx.restore() } }
    const STKP = {
      flames(c, x) { stkWrap(x, () => { const g = (cx, cy, h, w, col) => { x.fillStyle = col; x.beginPath(); x.moveTo(cx - w, cy); x.bezierCurveTo(cx - w, cy - h * .5, cx - w * .2, cy - h * .55, cx, cy - h); x.bezierCurveTo(cx + w * .1, cy - h * .6, cx + w, cy - h * .5, cx + w, cy); x.closePath(); x.fill() }; for (let i = 0; i < 4; i++) { const cx = 64 + i * 128; g(cx, 400, 300, 62, "#d90f00"); g(cx, 400, 220, 42, "#ff7a00"); g(cx, 400, 130, 22, "#ffd400") } x.fillStyle = "#d90f00"; x.fillRect(0, 400, 512, 112) }) },
      stars(c, x) { let r = 7; const R = () => (r = (r * 16807) % 2147483647) / 2147483647; stkWrap(x, () => { x.fillStyle = "#fff"; for (let i = 0; i < 14; i++) { const cx = R() * 512, cy = R() * 512, s = 22 + R() * 30; x.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, q = k % 2 ? s * .45 : s; x.lineTo(cx + Math.cos(a) * q, cy + Math.sin(a) * q) } x.closePath(); x.fill() } }) },
      checker(c, x) { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { x.fillStyle = (i + j) % 2 ? "#fff" : "#111"; x.fillRect(i * 64, j * 64, 64, 64) } },
      stripes(c, x) { stkWrap(x, () => { x.fillStyle = "#fff"; x.save(); x.rotate(-Math.PI / 4); x.fillRect(-800, 140, 2200, 70); x.fillStyle = "#e10600"; x.fillRect(-800, 230, 2200, 30); x.restore() }); x.globalCompositeOperation = "source-over" },
      camo(c, x) { let r = 11; const R = () => (r = (r * 16807) % 2147483647) / 2147483647; x.fillStyle = "#4b5320"; x.fillRect(0, 0, 512, 512); const cols = ["#2f3a1a", "#8a8f55", "#1b1b17", "#6b6b3a"]; for (let k = 0; k < 4; k++)stkWrap(x, () => { x.fillStyle = cols[k]; for (let i = 0; i < 5; i++) { const cx = R() * 512, cy = R() * 512; x.beginPath(); for (let a = 0; a < 6.3; a += .7) { const q = 40 + R() * 55; x.lineTo(cx + Math.cos(a) * q * 1.4, cy + Math.sin(a) * q) } x.closePath(); x.fill() } }) },
      dots(c, x) { x.fillStyle = "#fff"; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { x.beginPath(); x.arc(32 + i * 64 + (j % 2) * 32 - 16, 32 + j * 64, 15, 0, 7); x.fill() } },
      hex(c, x) { x.strokeStyle = "#fff"; x.lineWidth = 5; const R = 42, w = Math.sqrt(3) * R; for (let j = -1; j < 10; j++) for (let i = -1; i < 10; i++) { const cx = i * w + (j % 2) * w / 2, cy = j * R * 1.5; x.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; x.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R) } x.closePath(); x.stroke() } },
      bolts(c, x) { stkWrap(x, () => { x.fillStyle = "#ffd400"; x.strokeStyle = "#111"; x.lineWidth = 6; for (const [ox, oy] of [[40, 40], [290, 250]]) { x.beginPath(); [[0, 0], [90, 0], [55, 80], [110, 80], [20, 220], [45, 110], [-5, 110]].forEach(([a, b], i) => i ? x.lineTo(ox + a, oy + b) : x.moveTo(ox + a, oy + b)); x.closePath(); x.fill(); x.stroke() } }) },
      text(c, x) { x.fillStyle = "#fff"; x.strokeStyle = "#111"; x.lineWidth = 14; x.textAlign = "center"; x.textBaseline = "middle"; const t = (STK.txt || "F1").slice(0, 12); let f = 300; x.font = "900 " + f + "px Arial Black,Impact,sans-serif"; while (x.measureText(t).width > 470 && f > 40) { f -= 10; x.font = "900 " + f + "px Arial Black,Impact,sans-serif" } x.lineJoin = "round"; x.strokeText(t, 256, 262); x.fillText(t, 256, 262) }
    };
    function stkImg(img) { const [c, x] = stkCanvas(), r = Math.min(512 / img.width, 512 / img.height), w = img.width * r, h = img.height * r; x.drawImage(img, (512 - w) / 2, (512 - h) / 2, w, h); return c }
    function stkApplyAll() {
      if (STK.id == "none") { STKU.sP.value.y = 0; return }
      stkPatch(); let c;
      if (STK.id == "upload") { if (!STK.img) { STKU.sP.value.y = 0; return } c = stkImg(STK.img) } else { let q; [c, q] = stkCanvas(); STKP[STK.id](c, q) }
      if (stkTex) stkTex.dispose(); stkTex = new THREE.CanvasTexture(c); stkTex.wrapS = stkTex.wrapT = THREE.RepeatWrapping; stkTex.anisotropy = 4; STKU.sT.value = stkTex;
      STKU.sP.value.set(STK.size, STK.op, STK.mode == "place" ? 1 : 0, 0); STKU.sQ.value.set(STK.ox, STK.oy, 0, 0)
    }
    function stkSave() { try { localStorage.setItem("f2008stk", JSON.stringify({ id: STK.id, mode: STK.mode, size: STK.size, op: STK.op, ox: STK.ox, oy: STK.oy, txt: STK.txt, data: STK.id == "upload" ? STK.data : null })) } catch (e) { } }
    function stkSet(k, v, redraw) {
      STK[k] = v; if (k == "id" || k == "txt" || redraw) stkApplyAll(); else if (STK.id != "none") { STKU.sP.value.set(STK.size, STK.op, STK.mode == "place" ? 1 : 0, 0); STKU.sQ.value.set(STK.ox, STK.oy, 0, 0) }
      stkRefresh(); stkSave()
    }
    function stkRefresh() {
      document.querySelectorAll("#stk [data-sk]").forEach(x => { if (x.tagName == "INPUT") x.value = STK[x.dataset.sk]; else x.classList.toggle("on", STK[x.dataset.sk] == x.dataset.v) });
      const pl = $("stk").querySelectorAll(".stkpl"); pl.forEach(r => r.style.display = STK.mode == "place" && STK.id != "none" ? "" : "none");
      $("stk").querySelectorAll(".stkon").forEach(r => r.style.display = STK.id != "none" ? "" : "none")
    }
    function buildStk() {
      const el = $("stk"), row = (lb, cls) => { const r = document.createElement("div"); r.className = "row " + (cls || ""); r.innerHTML = "<label>" + lb + "</label>"; const b = document.createElement("div"); b.className = "ch"; r.append(b); el.append(r); return b };
      let b = row("Stickers (all cars)");
      [["none", "None"], ["flames", "Flames"], ["stars", "Stars"], ["checker", "Checker"], ["stripes", "Stripes"], ["camo", "Camo"], ["dots", "Dots"], ["hex", "Hex"], ["bolts", "Bolts"], ["text", "Text…"], ["upload", "Upload…"]].forEach(([v, t]) => {
        const x = document.createElement("button"); x.dataset.sk = "id"; x.dataset.v = v; x.textContent = t;
        x.onclick = () => {
          if (v == "text") { const t = prompt("Sticker text / number", STK.txt || "F1"); if (t === null) return; STK.txt = t || "F1" }
          if (v == "upload") { $("stkFile").click(); return }
          stkSet("id", v)
        }; b.append(x)
      });
      const f = document.createElement("input"); f.type = "file"; f.accept = "image/*"; f.id = "stkFile"; f.style.display = "none";
      f.onchange = () => { const fl = f.files[0]; if (!fl) return; const fr = new FileReader(); fr.onload = () => { const im = new Image(); im.onload = () => { const c = stkImg(im); STK.img = im; try { STK.data = c.toDataURL("image/png") } catch (e) { STK.data = null } stkSet("id", "upload") }; im.src = fr.result }; fr.readAsDataURL(fl); f.value = "" }; el.append(f);
      b = row("Sticker mode", "stkon"); [["tile", "Cover whole car"], ["place", "Place logo"]].forEach(([v, t]) => { const x = document.createElement("button"); x.dataset.sk = "mode"; x.dataset.v = v; x.textContent = t; x.onclick = () => stkSet("mode", v, true); b.append(x) });
      const sl = (lb, k, mn, mx, st, cls) => { const b = row(lb, cls); const i = document.createElement("input"); i.type = "range"; i.min = mn; i.max = mx; i.step = st; i.dataset.sk = k; i.oninput = () => stkSet(k, +i.value); b.append(i) };
      sl("Sticker size", "size", .3, 3, .05, "stkon"); sl("Sticker opacity", "op", .2, 1, .05, "stkon"); sl("Position along car", "ox", -2.5, 2.5, .05, "stkon stkpl"); sl("Position height", "oy", 0, 1, .02, "stkon stkpl");
      stkRefresh()
    }
    function stkLoad() {
      try { const o = JSON.parse(localStorage.getItem("f2008stk") || "null"); if (!o) return; Object.assign(STK, { mode: o.mode || "tile", size: o.size || 1.2, op: o.op == null ? 1 : o.op, ox: o.ox || 0, oy: o.oy == null ? .45 : o.oy, txt: o.txt || "F1" });
        if (o.id == "upload" && o.data) { const im = new Image(); im.onload = () => { STK.img = im; STK.data = o.data; stkSet("id", "upload") }; im.src = o.data } else if (o.id && o.id != "none" && o.id != "upload") stkSet("id", o.id); else stkRefresh() } catch (e) { }
    }
    function fixBol(O) {
      for (const o of O) {
        if (!/^bol_w_/.test(o.n)) continue;
        const V = Float32Array.from(o.v), Q = o.q ? Float32Array.from(o.q) : null, U = k => [...new Set(o.m[k] || [])], rub = U("rub"), rot = U("rot"), rim = U("rim").concat(U("carb"));
        if (!rub.length || !rot.length) continue;
        let hx = 0, hy = 0, hz = 0; for (const i of rot) { hx += V[i * 3]; hy += V[i * 3 + 1]; hz += V[i * 3 + 2] } hx /= rot.length; hy /= rot.length; hz /= rot.length;
        let mx = 0, my = 0, mz = 0; for (const i of rub) { mx += V[i * 3]; my += V[i * 3 + 1]; mz += V[i * 3 + 2] } mx /= rub.length; my /= rub.length; mz /= rub.length;
        let a = 0, b = 0, c = 0, d = 0, e = 0, f = 0; for (const i of rub) { const x = V[i * 3] - mx, y = V[i * 3 + 1] - my, z = V[i * 3 + 2] - mz; a += x * x; b += y * y; c += z * z; d += x * y; e += x * z; f += y * z }
        const tr = a + b + c, M = [tr - a, -d, -e, -d, tr - b, -f, -e, -f, tr - c]; let u = [1, 0, 0];
        for (let k = 0; k < 150; k++) { const w = [M[0] * u[0] + M[1] * u[1] + M[2] * u[2], M[3] * u[0] + M[4] * u[1] + M[5] * u[2], M[6] * u[0] + M[7] * u[1] + M[8] * u[2]], l = Math.hypot(w[0], w[1], w[2]); u = [w[0] / l, w[1] / l, w[2] / l] }
        if (u[0] < 0) u = [-u[0], -u[1], -u[2]];
        const ky = u[2], kz = -u[1], s = 1 / (1 + u[0]), rv = (x, y, z) => { const cx = ky * z - kz * y, cy = kz * x, cz = -ky * x, dx = ky * cz - kz * cy, dy = kz * cx, dz = -ky * cx; return [x + cx + dx * s, y + cy + dy * s, z + cz + dz * s] };
        for (let i = 0; i < V.length; i += 3) { const r = rv(V[i] - hx, V[i + 1] - hy, V[i + 2] - hz); V[i] = r[0] + hx; V[i + 1] = r[1] + hy; V[i + 2] = r[2] + hz }
        if (Q) for (let i = 0; i < Q.length; i += 3) { const r = rv(Q[i], Q[i + 1], Q[i + 2]), l = Math.hypot(r[0], r[1], r[2]) || 1; Q[i] = Math.round(r[0] / l * 127); Q[i + 1] = Math.round(r[1] / l * 127); Q[i + 2] = Math.round(r[2] / l * 127) }
        let a0 = 1e9, a1 = -1e9, b0 = 1e9, b1 = -1e9; for (const i of rub) { a0 = Math.min(a0, V[i * 3]); a1 = Math.max(a1, V[i * 3]) } for (const i of rim) { b0 = Math.min(b0, V[i * 3]); b1 = Math.max(b1, V[i * 3]) }
        const t0 = b0 - 8, t1 = b1 + 8, sc = (t1 - t0) / (a1 - a0); for (const i of rub) V[i * 3] = t0 + (V[i * 3] - a0) * sc;
        o.v = V; if (Q) o.q = Int8Array.from(Q)
      } return O
    }
    /* ===== DRIVER VIEW + STEERING WHEEL RIG =====
       dv  : first-person driver-seat camera (key F / 👁 button) - look around by dragging, wheel/pinch = zoom
       DVC : per-car cockpit data in car space (x = left, y = up, z = forward, metres)
             e = eye point · w = steering-wheel centre · n = wheel normal (towards the driver) · r = radius
             s = wheel style ("f1" / "rd") · k = steering ratio · b = regex of meshes in the model that ARE the wheel
             x = box [x0,x1,y0,y1,z0,z1] of wheel triangles baked into the body mesh (cut out & made spinnable)
             c = {k:material, b:box} triangles hidden only in driver view (opaque painted canopy)
       The wheel turns with the front wheels in every camera mode. */
    let dv = false, dvYaw = 0, dvPit = 0, dvZ = 1;
    const DVC = {
      f60: { e: [0, .86, -.26], w: [0, .51, .19], n: [0, .34, -.94], r: .14, s: "f1", b: /^fer_wheel$/ },
      f26: { e: [0, .86, .4], w: [0, .62, .92], n: [0, .34, -.94], r: .14, s: "f1" },
      rb: { e: [0, .88, .12], w: [0, .62, .66], n: [0, .34, -.94], r: .14, s: "f1", x: [-.22, .22, .45, .78, .5, .85] },
      rc13: { e: [0, .88, .25], w: [0, .6, .72], n: [0, .34, -.94], r: .14, s: "f1" },
      c44: { e: [0, .88, .03], w: [0, .62, .55], n: [0, .34, -.94], r: .14, s: "f1" },
      bol: { e: [0, .8, .2], w: [0, .58, .7], n: [0, .34, -.94], r: .16, s: "rd" },
      cf: { e: [0, .92, .28], w: [0, .63, .8], n: [0, .34, -.94], r: .14, s: "f1", b: /^steering_wheel$/, px: .06 },
      pt2: { e: [0, .9, -.05], w: [0, .63, .43], n: [0, .3, -.95], r: .14, s: "f1", b: /^(pt_steering_wheel_(?!mount_shaft)|pt_ferrari_dashboard_screen)/ },
      fp: { e: [0, .87, -.1], w: [0, .61, .4], n: [0, .3, -.95], r: .14, s: "f1", b: /^(steering_wheel_(?!mount_shaft|to_body)|ferrari_dashboard_screen)/ },
      w17: { e: [0, .86, .06], w: [0, .6, .6], n: [0, .34, -.94], r: .14, s: "f1", b: /^w17_b_(2[0-9])$/ },
      w13: { e: [0, .88, .03], w: [0, .62, .55], n: [0, .34, -.94], r: .14, s: "f1" },
      sb: { e: [0, .9, 0], w: [0, .64, .54], n: [0, .34, -.94], r: .14, s: "f1", b: /^sb_b_(1[89]|2[0-9])$/ },
      w20: { e: [0, .89, .1], w: [0, .63, .64], n: [0, .34, -.94], r: .14, s: "f1", b: /^w20_b_(3[0-9]|4[0-3])$/ },
      fe: { e: [0, .84, .07], w: [0, .56, .57], n: [0, .34, -.94], r: .14, s: "f1" }
    };
    function dvWheelMesh(st, r) {
      const g = new THREE.Group(), carb = new THREE.MeshStandardMaterial({ color: 0x1b1c21, roughness: .45, metalness: .35, side: THREE.DoubleSide }), rub = new THREE.MeshStandardMaterial({ color: 0x0d0d0f, roughness: .9, metalness: 0 }),
        led = (c, i) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i || 1, roughness: .4 }), add = (geo, m, x, y, z, rz) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); if (rz) me.rotation.z = rz; g.add(me); return me };
      if (st == "f1") {
        const w = r * 2.1, h = r * 1.05;
        add(new THREE.BoxGeometry(w * .62, h * .85, .03), carb, 0, 0, 0);
        for (const sx of [-1, 1]) { add(new THREE.BoxGeometry(w * .2, h * 1.18, .05), rub, sx * w * .42, -h * .04, .005); add(new THREE.BoxGeometry(w * .17, h * .5, .035), carb, sx * w * .3, h * .08, 0) }
        add(new THREE.PlaneGeometry(w * .3, h * .3), led(0x66ccff, 1.4), 0, h * .16, .017);
        [[0xff2a1f, -.18], [0x22dd55, -.06], [0xffd400, .06], [0x2a8cff, .18]].forEach(([c, x]) => add(new THREE.CylinderGeometry(.012, .012, .014, 14).rotateX(Math.PI / 2), led(c, .8), x * w, -h * .12, .02));
        for (const sx of [-1, 1]) { add(new THREE.CylinderGeometry(.022, .022, .018, 16).rotateX(Math.PI / 2), led(0xff7a00, .5), sx * w * .13, -h * .26, .02); add(new THREE.CylinderGeometry(.016, .016, .016, 14).rotateX(Math.PI / 2), led(0xeeeeee, .3), sx * w * .24, -h * .05, .02) }
        for (let i = 0; i < 9; i++)add(new THREE.BoxGeometry(.016, .008, .006), led(i < 3 ? 0x22dd55 : i < 6 ? 0xff2a1f : 0x4466ff, 1.2), (i - 4) * .02, h * .39, .017)
      } else {
        g.add(new THREE.Mesh(new THREE.TorusGeometry(r, r * .12, 14, 48), rub));
        for (const a of [0, 2.2, 4.08]) { const sp = new THREE.Mesh(new THREE.BoxGeometry(r * .95, r * .1, .018), carb); sp.position.set(Math.cos(a) * r * .48, Math.sin(a) * r * .48, 0); sp.rotation.z = a; g.add(sp) }
        add(new THREE.CylinderGeometry(r * .28, r * .28, .035, 24).rotateX(Math.PI / 2), carb, 0, 0, 0); add(new THREE.BoxGeometry(r * .13, r * .26, .01), led(0xff2a1f, .8), 0, r, 0);
        add(new THREE.PlaneGeometry(r * .36, r * .2), led(0x66ccff, 1.2), 0, r * .08, .02)
      }
      return g
    }
    /* best-fit plane (smallest-variance axis) of a vertex cloud -> wheel centre + axis that points at the driver */
    function dvPlane(vs) {
      const m = new THREE.Vector3(); vs.forEach(v => m.add(v)); m.multiplyScalar(1 / vs.length);
      const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], V = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      vs.forEach(v => { const d = [v.x - m.x, v.y - m.y, v.z - m.z]; for (let i = 0; i < 3; i++)for (let j = 0; j < 3; j++)A[i][j] += d[i] * d[j] });
      for (let it = 0; it < 40; it++) {
        let p = 0, q = 1, mx = Math.abs(A[0][1]); if (Math.abs(A[0][2]) > mx) { p = 0; q = 2; mx = Math.abs(A[0][2]) } if (Math.abs(A[1][2]) > mx) { p = 1; q = 2; mx = Math.abs(A[1][2]) } if (mx < 1e-14) break;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]), t = (th >= 0 ? 1 : -1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
        for (let k = 0; k < 3; k++) { const x = A[k][p], y = A[k][q]; A[k][p] = c * x - s * y; A[k][q] = s * x + c * y }
        for (let k = 0; k < 3; k++) { const x = A[p][k], y = A[q][k]; A[p][k] = c * x - s * y; A[q][k] = s * x + c * y }
        for (let k = 0; k < 3; k++) { const x = V[k][p], y = V[k][q]; V[k][p] = c * x - s * y; V[k][q] = s * x + c * y }
      }
      const ev = [A[0][0], A[1][1], A[2][2]], i = ev.indexOf(Math.min(...ev)), n = new THREE.Vector3(V[0][i], V[1][i], V[2][i]).normalize(); if (n.z > 0) n.negate();
      const u = new THREE.Vector3(0, 1, 0).cross(n).normalize(), w = n.clone().cross(u); let u0 = 1e9, u1 = -1e9, w0 = 1e9, w1 = -1e9;
      vs.forEach(v => { const a = v.dot(u), b = v.dot(w); u0 = Math.min(u0, a); u1 = Math.max(u1, a); w0 = Math.min(w0, b); w1 = Math.max(w1, b) });
      return { n, c: u.multiplyScalar((u0 + u1) / 2).add(w.multiplyScalar((w0 + w1) / 2)).add(n.clone().multiplyScalar(m.dot(n))) }
    }
    function dvBuild(only) {
      const up = new THREE.Vector3(0, 0, 1);
      for (const id in DVC) {
        if (only && id !== only) continue; const X = CARS[id]; if (!X || X.dv) continue; const q = DVC[id], bd = X.c.children[0], by = bd.position.y, rig = { q, parts: [], g: null, ratio: q.k || (q.s == "rd" ? 3.6 : 3), cuts: [] };
        if (q.b) bd.children.forEach(og => { if (og.name && q.b.test(og.name)) rig.parts.push(og) });
        if (q.x) { /* wheel baked into the body mesh: cut those triangles out into their own spinnable group */
          const bx = q.x, ng = new THREE.Group(); ng.name = "dvx"; let any = false;
          bd.children.slice().forEach(og => { if (!og.name || og === ng || !og.children.length || !og.children[0].isMesh) return; og.children.slice().forEach(me => {
            const g = me.geometry, pa = g.attributes.position, ix = g.index.array, keep = [], take = []; for (let i = 0; i < ix.length; i += 3) { let cx = 0, cy = 0, cz = 0; for (let k = 0; k < 3; k++) { cx += pa.getX(ix[i + k]); cy += pa.getY(ix[i + k]); cz += pa.getZ(ix[i + k]) } cx /= 3; cy = cy / 3 + by; cz /= 3; (cx > bx[0] && cx < bx[1] && cy > bx[2] && cy < bx[3] && cz > bx[4] && cz < bx[5] ? take : keep).push(ix[i], ix[i + 1], ix[i + 2]) }
            if (take.length) { const g2 = new THREE.BufferGeometry(); for (const k in g.attributes) g2.setAttribute(k, g.attributes[k]); g2.setIndex(take); g.setIndex(keep); const m2 = new THREE.Mesh(g2, me.material); m2.userData.k = me.userData.k; ng.add(m2); any = true }
          }) });
          if (any) { bd.add(ng); rig.parts.push(ng) }
        }
        if (rig.parts.length) {
          const vs = []; rig.parts.forEach(og => og.traverse(m => { if (m.isMesh) { const pa = m.geometry.attributes.position, ix = m.geometry.index.array, st = Math.max(1, Math.floor(ix.length / 6000)); for (let i = 0; i < ix.length; i += st) { const v = new THREE.Vector3().fromBufferAttribute(pa, ix[i]); if (!q.px || Math.abs(v.x) > q.px) vs.push(v) } } }));
          const pl = dvPlane(vs); rig.n = pl.n; rig.pivot = pl.c; rig.baked = true; q.wc = [pl.c.x, pl.c.y + by, pl.c.z]; q.nn = [pl.n.x, pl.n.y, pl.n.z]
        } else {
          const n = new THREE.Vector3(...q.n).normalize(), h = new THREE.Group(), sp = new THREE.Group(); h.position.set(q.w[0], q.w[1] - by, q.w[2]); h.quaternion.setFromUnitVectors(up, n); h.add(sp); sp.add(dvWheelMesh(q.s, q.r));
          h.add(new THREE.Mesh(new THREE.CylinderGeometry(.016, .02, .34, 12).rotateX(Math.PI / 2).translate(0, 0, -.17), new THREE.MeshStandardMaterial({ color: 0x1a1a1d, roughness: .5, metalness: .6 }))); bd.add(h); rig.g = h; rig.sp = sp
        }
        if (q.c) { const cb = q.c.b; X.c.traverse(me => { if (!me.isMesh || me.userData.k != q.c.k) return; const g = me.geometry, pa = g.attributes.position, ix = g.index.array, keep = []; for (let i = 0; i < ix.length; i += 3) { let cx = 0, cy = 0, cz = 0; for (let k = 0; k < 3; k++) { cx += pa.getX(ix[i + k]); cy += pa.getY(ix[i + k]); cz += pa.getZ(ix[i + k]) } cx /= 3; cy = cy / 3 + by; cz /= 3; if (!(cx > cb[0] && cx < cb[1] && cy > cb[2] && cy < cb[3] && cz > cb[4] && cz < cb[5])) keep.push(ix[i], ix[i + 1], ix[i + 2]) } rig.cuts.push({ g, full: g.index, cut: new THREE.BufferAttribute(new (pa.count > 65535 ? Uint32Array : Uint16Array)(keep), 1) }) }) }
        X.dv = rig
      }
    }
    const dvQ = new THREE.Quaternion(), dvV = new THREE.Vector3(), dvE = new THREE.Euler(0, 0, 0, "YXZ"), dvFlip = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    function dvSteer() {
      const X = CARS[cur]; if (!X || !X.dv || !X.wh.fl) return; const Rg = X.dv, a = X.wh.fl.st.rotation.y * Rg.ratio;
      if (Rg.baked) { dvQ.setFromAxisAngle(Rg.n, a); dvV.copy(Rg.pivot).sub(Rg.pivot.clone().applyQuaternion(dvQ)); Rg.parts.forEach(og => { og.quaternion.copy(dvQ); og.position.copy(dvV) }) }
      else Rg.sp.rotation.z = a
    }
    function dvCam(dt) {
      const X = CARS[cur], q = X && X.dv && X.dv.q; if (!q) return false; car.updateMatrixWorld(true);
      const sf = Math.min(1, Math.hypot(P.vx, P.vz) / VCAP), sh = .006 * sf * sf, jj = () => (rnd() - .5) * sh;
      if (!ptr.size) { const k = Math.exp(-2.6 * dt); dvYaw *= k; dvPit *= k }
      dvV.set(q.e[0], q.e[1], q.e[2]); car.localToWorld(dvV); C.position.copy(dvV); C.position.x += jj(); C.position.y += jj();
      dvE.set(dvPit - .13, dvYaw, 0); dvQ.setFromEuler(dvE); C.quaternion.copy(car.quaternion).multiply(dvFlip).multiply(dvQ);
      const hf = (100 + 14 * Math.pow(sf, 1.05)) * dvZ * Math.PI / 180, vf = 2 * Math.atan(Math.tan(hf / 2) / Math.max(C.aspect, 1.15)) * 180 / Math.PI, f = Math.max(50, Math.min(100, vf));
      C.near = .04; C.fov += (f - C.fov) * Math.min(1, dt * 6); C.updateProjectionMatrix(); return true
    }
    const dvSet = v => {
      dv = !!v && mode != "show"; if (!dv) { C.near = .3; C.updateProjectionMatrix() } dvYaw = dvPit = 0;
      for (const id in CARS) { const Rg = CARS[id].dv; if (Rg) Rg.cuts.forEach(c => c.g.setIndex(dv && id == cur ? c.cut : c.full)) }
      $("bdv").classList.toggle("on", dv); $("bdv").innerHTML = (dv ? "🚘" : "👁") + '<span class="tx"> ' + (dv ? "Chase view" : "Driver view") + "</span>"
    };
    (async () => {
      /* ---- lazy car builders: data file + decode + build happen only when the car is selected ---- */
      LZC.f60 = async () => { await lzLoad("D2", "T2"); const O2 = await unz(D2); D2 = null; const W2 = {}, V2 = {}; for (const p of ["fl", "fr", "rl", "rr"]) { W2["f60_tire_" + p] = p; W2["fer_brake_" + p] = p; W2["fer_cov_" + p] = p; V2["fer_cov_" + p] = ["cov", "on"] } bld("f60", O2, W2, "f60_tire_", mat2, V2, .045);  };
      LZC.f26 = async () => { await lzLoad("D3", "T3"); const O3 = await unz(D3); D3 = null; bld("f26", O3, { f26_w_fl: "fl", f26_w_fr: "fr", f26_w_rl: "rl", f26_w_rr: "rr" }, "f26_w_", mat3, {}, .023);  };
      LZC.rb = async () => { await lzLoad("D4", "T3"); const O4 = await unz(D4); D4 = null; bld("rb", splitCov(O4, "rb_body", "rb_w_", "rb_c_", "cc"), { rb_w_fl: "fl", rb_w_fr: "fr", rb_w_rl: "rl", rb_w_rr: "rr", rb_c_fl: "fl", rb_c_fr: "fr" }, "rb_w_", mat3, {}, 0);  };
      LZC.rc13 = async () => { await lzLoad("D7", "T7"); const O7 = dec6(await unzB(D7)); D7 = null; bld("rc13", O7, { rc_w_fl: "fl", rc_w_fr: "fr", rc_w_rl: "rl", rc_w_rr: "rr" }, "rc_w_", mat7, {}, .047);  };
      LZC.c44 = async () => { await lzLoad("D8", "T8"); const O8 = dec6(await unzB(D8)); D8 = null; bld("c44", splitCov(O8, "c_body", "c_w_", "c_c_", "cyl"), { c_w_fl: "fl", c_w_fr: "fr", c_w_rl: "rl", c_w_rr: "rr", c_c_fl: "fl", c_c_fr: "fr" }, "c_w_", mat8, {}, 0);  };
      LZC.bol = async () => { await lzLoad("D9"); const O9 = fixBol(dec6(await unzB(D9))); D9 = null; bld("bol", O9, { bol_w_fl: "fl", bol_w_fr: "fr", bol_w_rl: "rl", bol_w_rr: "rr" }, "bol_w_", mat9, {}, 0);  };
      LZC.cf = async () => { await lzLoad("D11"); const O11 = dec6(await unzB(D11)); D11 = null; bld("cf", O11, { cf_w_fl: "fl", cf_w_fr: "fr", cf_w_rl: "rl", cf_w_rr: "rr", cf_r_fl: "fl", cf_r_fr: "fr", cf_r_rl: "rl", cf_r_rr: "rr", cf_c_fl: "fl", cf_c_fr: "fr", cf_c_rl: "rl", cf_c_rr: "rr" }, "cf_w_", mat11, {}, 0); CARS.cf.c.traverse(me => { if (me.isMesh && me.userData.k == "glass") me.castShadow = false }); };
      LZC.pt2 = async () => { await lzLoad("D12"); const O12 = dec6(await unzB(D12)); D12 = null; bld("pt2", O12, { pt_w_fl: "fl", pt_w_fr: "fr", pt_w_rl: "rl", pt_w_rr: "rr", pt_c_fl: "fl", pt_c_fr: "fr", pt_c_rl: "rl", pt_c_rr: "rr" }, "pt_w_", mat12, {}, 0); {
        const X = CARS.pt2; let bm = null, bn = 0; X.c.traverse(o => { if (o.isMesh) { const n = o.geometry.attributes.position.count; if (n > bn) { bn = n; bm = o } } });
        const ms = []; bm.parent.traverse(o => { if (o.isMesh) ms.push(o) }); let xi = 0;
        window.pt2Shell = () => { const x = CFG.shell == "x"; ms.forEach(me => { const u = me.userData; if (!u.m0) { u.m0 = me.material; const c = me.material.clone(); c.userData = Object.assign({}, me.material.userData); c.transparent = true; c.opacity = .16; c.depthWrite = false; u.m1 = c; M3["pt_x_" + (xi++)] = c } me.material = x ? u.m1 : u.m0; me.castShadow = !x }) }
      } };
      LZC.fp = async () => { await lzLoad("D13"); const O13 = dec13(await unzB(D13)).filter(o => !/^(racer|shoes\.|helmet|shell|vizor|seatbelts_new_driver)/.test(o.n)).map(o => { if (/^(gearbox_cover|exhaust_cover|rear_body_inner)$/.test(o.n) && o.m["Carbon_Fiber_no_UV__rough"]) { o.m["Carbon_Fiber_no_UV_"] = o.m["Carbon_Fiber_no_UV__rough"]; delete o.m["Carbon_Fiber_no_UV__rough"] } return o }); D13 = null; bld("fp", O13, {"fp_w_fl":"fl","fp_r_rim_fl":"fl","fp_r_vent_fl":"fl","fp_r_cov_fl":"fl","fp_r_nab_fl":"fl","fp_r_nut_fl":"fl","fp_r_brk_fl":"fl","fp_c_duct_fl":"fl","fp_c_ductin_fl":"fl","fp_c_fins_fl":"fl","fp_w_fr":"fr","fp_r_rim_fr":"fr","fp_r_vent_fr":"fr","fp_r_cov_fr":"fr","fp_r_nab_fr":"fr","fp_r_nut_fr":"fr","fp_r_brk_fr":"fr","fp_c_duct_fr":"fr","fp_c_ductin_fr":"fr","fp_c_fins_fr":"fr","fp_w_rl":"rl","fp_r_rim_rl":"rl","fp_r_vent_rl":"rl","fp_r_cov_rl":"rl","fp_r_nab_rl":"rl","fp_r_nut_rl":"rl","fp_r_brk_rl":"rl","fp_c_duct_rl":"rl","fp_c_blades_rl":"rl","fp_w_rr":"rr","fp_r_rim_rr":"rr","fp_r_vent_rr":"rr","fp_r_cov_rr":"rr","fp_r_nab_rr":"rr","fp_r_nut_rr":"rr","fp_r_brk_rr":"rr","fp_c_duct_rr":"rr","fp_c_blades_rr":"rr"}, "fp_w_", mat13, {}, 0); CARS.fp.c.traverse(me => { if (!me.isMesh) return; me.geometry.computeBoundingSphere(); if (me.material.transparent || me.geometry.boundingSphere.radius < .07) me.castShadow = false }); };
      LZC.w17 = async () => { await lzLoad("D14", "T14"); const O14 = dec17(await unzB(D14)); D14 = null; bld("w17", O14, { w17_w_fl: "fl", w17_w_fr: "fr", w17_w_rl: "rl", w17_w_rr: "rr", w17_c_fl: "fl", w17_c_fr: "fr", w17_c_rl: "rl", w17_c_rr: "rr" }, "w17_w_", mat14, {}, 0); CARS.w17.c.traverse(me => { if (me.isMesh && me.material.transparent) me.castShadow = false });  };
      LZC.w13 = async () => { await lzLoad("D15", "T15"); const O15 = dec17(await unzB(D15)); D15 = null; bld("w13", O15, { w13_w_fl: "fl", w13_w_fr: "fr", w13_w_rl: "rl", w13_w_rr: "rr", w13_c_fl: "fl", w13_c_fr: "fr", w13_c_rl: "rl", w13_c_rr: "rr" }, "w13_w_", mat15, {}, 0); CARS.w13.c.traverse(me => { if (me.isMesh && me.material.transparent) me.castShadow = false });  };
      LZC.sb = async () => { await lzLoad("D16", "T16"); const O16 = dec17(await unzB(D16)); D16 = null; bld("sb", O16, { sb_w_fl: "fl", sb_w_fr: "fr", sb_w_rl: "rl", sb_w_rr: "rr", sb_c_fl: "fl", sb_c_fr: "fr" }, "sb_w_", mat16, {}, 0); CARS.sb.c.traverse(me => { if (me.isMesh && me.material.transparent) me.castShadow = false });  };
      LZC.w20 = async () => { await lzLoad("D17", "T17"); const O17 = dec17(await unzB(D17)); D17 = null; bld("w20", O17, { w20_w_fl: "fl", w20_r_hub_fl: "fl", w20_r_disc_fl: "fl", w20_r_edisc_fl: "fl", w20_c_cal_fl: "fl", w20_c_logo_fl: "fl", w20_w_fr: "fr", w20_r_hub_fr: "fr", w20_r_disc_fr: "fr", w20_r_edisc_fr: "fr", w20_c_cal_fr: "fr", w20_c_logo_fr: "fr", w20_w_rl: "rl", w20_r_hub_rl: "rl", w20_r_disc_rl: "rl", w20_r_edisc_rl: "rl", w20_c_cal_rl: "rl", w20_c_logo_rl: "rl", w20_w_rr: "rr", w20_r_hub_rr: "rr", w20_r_disc_rr: "rr", w20_r_edisc_rr: "rr", w20_c_cal_rr: "rr", w20_c_logo_rr: "rr" }, "w20_w_", mat17, {}, 0); CARS.w20.c.traverse(me => { if (me.isMesh && me.material.transparent) me.castShadow = false });  };
      LZC.fe = async () => { await lzLoad("D18", "T18"); const O18 = dec17(await unzB(D18)); D18 = null; bld("fe", O18, { fe_w_fl: "fl", fe_r_cover_fl: "fl", fe_r_nut_fl: "fl", fe_c_cal_fl: "fl", fe_c_up_fl: "fl", fe_c_up_fr: "fr", fe_c_up_rl: "rl", fe_c_up_rr: "rr", fe_w_fr: "fr", fe_r_cover_fr: "fr", fe_r_nut_fr: "fr", fe_c_cal_fr: "fr", fe_w_rl: "rl", fe_r_cover_rl: "rl", fe_r_nut_rl: "rl", fe_c_cal_rl: "rl", fe_w_rr: "rr", fe_r_cover_rr: "rr", fe_r_nut_rr: "rr", fe_c_cal_rr: "rr" }, "fe_w_", mat18, {}, 0); CARS.fe.c.traverse(me => { if (me.isMesh && me.material.transparent) me.castShadow = false });  };
      await LZC.f26();
      car = CARS.f26.c; wheels = CARS.f26.wh; parts = CARS.f26.pt;
      const sh = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 6).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: mkTex(64, 64, (g, w, h) => { const r = g.createRadialGradient(32, 32, 2, 32, 32, 32); r.addColorStop(0, "rgba(0,0,0,.6)"); r.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = r; g.fillRect(0, 0, w, h) }), transparent: true, depthWrite: false })); sh.position.y = .04; sh.position.z = -.2; car.add(sh);
      sh.visible = false;
      const csT = mkTex(64, 64, (g, w, h) => { const r = g.createRadialGradient(32, 32, 1, 32, 32, 32); r.addColorStop(0, "rgba(0,0,0,.85)"); r.addColorStop(.55, "rgba(0,0,0,.4)"); r.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = r; g.fillRect(0, 0, w, h) }),
        csM = new THREE.MeshBasicMaterial({ map: csT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6 }),
        mkCS = wh => {
          const g = new THREE.Group(), pl = (w, l, x, z, o) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, l).rotateX(-Math.PI / 2), csM); m.position.set(x, .012, z); m.renderOrder = 2; m.scale.setScalar(o || 1); g.add(m) };
          pl(2.3, 5.2, 0, -.1, 1); for (const k in wh) { const p = wh[k].st.position; pl(.62, 1.25, p.x, p.z, 1) } return g
        };
      LZPOST = id => { CARS[id].c.add(mkCS(CARS[id].wh)); dvBuild(id); if (stkPatched) stkPatchCar(id); applyCfg() }; LZPOST("f26");
      applyCfg(); car.updateMatrixWorld(true);
      {
        const cat = {}, v = new THREE.Vector3();
        car.traverse(me => {
          if (!me.isMesh || !me.userData.k) return; const k = me.userData.k; if (/^(FERWH|LEDSL|Shaft)/.test(k)) return; for (let a = me; a && a !== car; a = a.parent)if (!a.visible) return;
          const key = (k.startsWith("F2008") || k == "f26livery") ? "paint" : k, g = me.geometry, pa = g.attributes.position, nr = g.attributes.normal, ix = g.index.array, mp = new Int32Array(pa.count).fill(-1), c = cat[key] || (cat[key] = { p: [], n: [], i: [], o: 0, mat: me.material }), nm = new THREE.Matrix3().getNormalMatrix(me.matrixWorld);
          for (let q = 0; q < ix.length; q++) { const j = ix[q]; if (mp[j] < 0) { mp[j] = c.o++; v.fromBufferAttribute(pa, j).applyMatrix4(me.matrixWorld); c.p.push(v.x, v.y, v.z); v.fromBufferAttribute(nr, j).applyMatrix3(nm).normalize(); c.n.push(v.x, v.y, v.z) } c.i.push(mp[j]) }
        });
        const MG = Object.keys(cat).map(key => { const c = cat[key], g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(c.p, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(c.n, 3)); g.setIndex(c.i); return { g, key, mat: c.mat } });
        const AIC = [0xf5c518, 0x1d4ed8, 0xe8e8e8, 0xff6a00, 0x0f7a3e, 0x9aa3ad, 0x161616, 0x7b2cbf, 0x00a3b4, 0xc40a0a];
        for (let n = 0; n < 5; n++) { const g = new THREE.Group(), pm = new THREE.MeshStandardMaterial({ color: AIC[n % 10], roughness: .35, metalness: .1, side: THREE.DoubleSide }); MG.forEach(m => { const me = new THREE.Mesh(m.g, m.key == "paint" ? pm : m.mat); me.castShadow = !!__Q.ais; g.add(me) }); g.add(sh.clone()); g.add(mkCS(CARS.f26.wh)); S.add(g); ais.push({ g, col: AIC[n % 10], s: 0, v: 0, lane: 0, tl: 0, top: 58 + rnd() * 14 }) }
        const gm = new THREE.MeshStandardMaterial({ color: 0x7fd8ff, emissive: 0x1a6fa0, transparent: true, opacity: .42, depthWrite: false, roughness: .5 });
        ghostG = new THREE.Group(); MG.forEach(m => { if (m.key != "FERWIND") ghostG.add(new THREE.Mesh(m.g, gm)) }); ghostG.visible = false; S.add(ghostG)
      }
      dvBuild(); loadGhost(); loadCfg(); applyCfg(); buildUI(); buildStk(); stkLoad(); { let sc = "f60"; try { sc = localStorage.getItem("f2008car") || sc } catch (e) { } if (!CARS[sc] && !LZC[sc]) sc = "f60"; if (!CARS[sc]) { await LZC[sc](); LZPOST(sc) } setCar(sc) } ready = true; $("load").remove(); go("show"); menuOn = true; $("menu").style.display = "grid";
    })().catch(e => { const l = $("load"); if (l) l.textContent = "Load error: " + (e && e.message || e) });

    /* ---------- NATURE MODE ---------- */
    const natG = new THREE.Group(); natG.visible = false; world.add(natG);
    const pX = z => 70 * Math.sin(z / 260) + 35 * (Math.sin(z / 97 + 1) - Math.sin(1)), pDX = z => 70 / 260 * Math.cos(z / 260) + 35 / 97 * Math.cos(z / 97 + 1);
    const PG = 420, pond = (gx, gz) => { if (hs(gx, gz, 31) < .5) return null; const x = gx * PG + (hs(gx, gz, 32) - .5) * 160, z = gz * PG + (hs(gx, gz, 33) - .5) * 160; return Math.hypot(x, z) < 170 ? null : { x, z, r: 26 + hs(gx, gz, 34) * 26 } };
    function nearPond(x, z, m, k) { k = k || 1.25; const gx = Math.round(x / PG), gz = Math.round(z / PG); for (let i = -1; i <= 1; i++)for (let j = -1; j <= 1; j++) { const p = pond(gx + i, gz + j); if (p && Math.hypot(x - p.x, z - p.z) < p.r * k + m) return p } return null }
    const natOk = (x, z) => Math.abs(x - pX(z)) > 15 && !nearPond(x, z, 7) && Math.hypot(x, z) > 20;
    const pW = new THREE.MeshStandardMaterial({ color: 0x2b7c93, roughness: .06, metalness: .55, transparent: true, opacity: .86, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }),
      pS = new THREE.MeshStandardMaterial({ color: 0xcdbb8a, roughness: 1, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }), pools = [];
    for (let i = 0; i < 12; i++) { const w = new THREE.Mesh(new THREE.CircleGeometry(1, 48).rotateX(-Math.PI / 2), pW), q = new THREE.Mesh(new THREE.CircleGeometry(1, 48).rotateX(-Math.PI / 2), pS); w.receiveShadow = q.receiveShadow = true; w.renderOrder = 2; w.visible = q.visible = false; natG.add(q, w); pools.push([w, q]) }
    const trl = new THREE.InstancedMesh(new THREE.PlaneGeometry(11, 9.8).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), 130);
    trl.frustumCulled = false; trl.receiveShadow = true; natG.add(trl);
    const FLN = 900, flw = new THREE.InstancedMesh(mergeG([new THREE.IcosahedronGeometry(.3, 0).translate(0, .22, 0), new THREE.IcosahedronGeometry(.22, 0).translate(.32, .15, .1), new THREE.IcosahedronGeometry(.22, 0).translate(-.26, .16, -.12)]), new THREE.MeshStandardMaterial({ roughness: .7, flatShading: true }), FLN),
      tuft = new THREE.InstancedMesh(mergeG([new THREE.ConeGeometry(.22, 1.1, 4).translate(0, .55, 0), new THREE.ConeGeometry(.2, .9, 4).translate(.25, .45, .1), new THREE.ConeGeometry(.2, .8, 4).translate(-.2, .4, -.15)]), new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true }), FLN);
    [flw, tuft].forEach(m => { m.frustumCulled = false; m.receiveShadow = true; natG.add(m) });
    const ffT = mkTex(64, 64, (g) => { const q = g.createRadialGradient(32, 32, 0, 32, 32, 32); q.addColorStop(0, "rgba(255,255,230,1)"); q.addColorStop(.25, "rgba(255,230,120,.6)"); q.addColorStop(1, "rgba(255,200,60,0)"); g.fillStyle = q; g.fillRect(0, 0, 64, 64) }),
      FF = 140, ffP = new Float32Array(FF * 3), ffB = []; for (let i = 0; i < FF; i++)ffB.push([rnd() * 90, rnd() * 90, rnd() * 6.28, .6 + rnd() * 2.2]);
    const ffG = new THREE.BufferGeometry(); ffG.setAttribute("position", new THREE.BufferAttribute(ffP, 3).setUsage(THREE.DynamicDrawUsage));
    const ffPts = new THREE.Points(ffG, new THREE.PointsMaterial({ map: ffT, size: .8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); ffPts.frustumCulled = false; ffPts.renderOrder = 6; natG.add(ffPts);
    let nlz = 1e9, nfx = 1e9, nfz = 1e9, npx = 1e9, npz = 1e9;
    function natAtmo(m) { const n = m == "nature"; SUN.set(n ? 260 : 300, n ? 240 : 500, 200).normalize(); sun.color.setHex(n ? 0xffd49a : 0xffe8c4); gmat.color.setHex(n ? 0xb8e6a2 : 0xffffff) }
    function natUpdate(dt, f) {
      const cz = Math.round(P.z / 8);
      if (f || cz != nlz) {
        nlz = cz; let n = 0; for (let i = -60; i <= 60; i++) { const z = (cz + i) * 8; dm.position.set(pX(z), .025, z); dm.rotation.set(0, Math.atan2(pDX(z), 1), 0); dm.scale.setScalar(1); dm.updateMatrix(); trl.setMatrixAt(n, dm.matrix); col.setHSL(.08, .38, .27 + hs(cz + i, 0, 40) * .06); trl.setColorAt(n++, col) }
        trl.count = n; trl.instanceMatrix.needsUpdate = true; trl.instanceColor.needsUpdate = true
      }
      const fx = Math.round(P.x / 6), fz = Math.round(P.z / 6);
      if (f || fx != nfx || fz != nfz) {
        nfx = fx; nfz = fz; let a = 0, b = 0; const HU = [0, .08, .13, .78, .92, .58];
        for (let i = -__Q.vr; i <= __Q.vr; i++)for (let j = -__Q.vr; j <= __Q.vr; j++) {
          const ci = fx + i, cj = fz + j, h = hs(ci, cj, 41); if (h > __Q.vd) continue; const x = ci * 6 + hs(ci, cj, 42) * 6, z = cj * 6 + hs(ci, cj, 43) * 6; if (Math.abs(x - pX(z)) < 8 || nearPond(x, z, 0)) continue;
          dm.position.set(x, TrH(x, z), z); dm.rotation.set(0, hs(ci, cj, 44) * 6.28, 0);
          if (h < .2 && a < FLN) { dm.scale.setScalar(.6 + hs(ci, cj, 45) * .7); dm.updateMatrix(); flw.setMatrixAt(a, dm.matrix); col.setHSL(HU[Math.floor(hs(ci, cj, 46) * 6)], .8, .6); flw.setColorAt(a++, col) }
          else if (h >= .2 && b < FLN) { dm.scale.set(.8 + hs(ci, cj, 47), .7 + hs(ci, cj, 45) * .9, .8 + hs(ci, cj, 47)); dm.updateMatrix(); tuft.setMatrixAt(b, dm.matrix); col.setHSL(.2 + hs(ci, cj, 48) * .1, .5, .26 + hs(ci, cj, 49) * .1); tuft.setColorAt(b++, col) }
        }
        flw.count = a; tuft.count = b;[flw, tuft].forEach(m => { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true })
      }
      const gx = Math.round(P.x / PG), gz = Math.round(P.z / PG);
      if (f || gx != npx || gz != npz) { npx = gx; npz = gz; let k = 0; for (let i = -2; i <= 2; i++)for (let j = -2; j <= 2; j++) { const p = pond(gx + i, gz + j); if (p && k < 12) { const [w, q] = pools[k++]; TrPO[k - 1].set(p.x, p.z, p.r); w.position.set(p.x, .045, p.z); w.scale.set(p.r, 1, p.r); q.position.set(p.x, .03, p.z); q.scale.set(p.r * 1.22, 1, p.r * 1.22); w.visible = q.visible = true } } for (; k < 12; k++) { TrPO[k].set(0, 0, 0); pools[k][0].visible = pools[k][1].visible = false } }
      if (dt > 0) {
        if (nearPond(P.x, P.z, 0, 1)) { const k = Math.exp(-1.3 * dt); P.vx *= k; P.vz *= k }
        for (let i = 0; i < FF; i++) { const b = ffB[i]; ffP[i * 3] = P.x + ((b[0] - P.x) % 90 + 90) % 90 - 45 + Math.sin(T * .6 + b[2]) * 1.5; ffP[i * 3 + 1] = 1 + 1.6 * (.5 + .5 * Math.sin(T * b[3] + b[2])); ffP[i * 3 + 2] = P.z + ((b[1] - P.z) % 90 + 90) % 90 - 45 + Math.cos(T * .5 + b[2]) * 1.5 }
        ffG.attributes.position.needsUpdate = true
      }
    }
    /* ---------- obstacles ---------- */
    const memo = new Map(); let mode = "show", menuOn = true;
    const hs = (a, b, c) => { const h = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453; return h - Math.floor(h) };
    const rd = x => Math.abs(((x + 400) % 800 + 800) % 800 - 400);
    function cellObj(ix, iz) {
      const key = ix + "," + iz; if (memo.has(key)) return memo.get(key); let o = null;
      const zn = hs(Math.floor(ix / 12), Math.floor(iz / 12), 11), h = hs(ix, iz, 1), pT = mode == "nature" ? (zn < .3 ? .2 : .82) : zn < .4 ? .8 : zn > .82 ? .22 : .3, pB = mode == "nature" ? 0 : zn > .82 ? .4 : zn < .4 ? 0 : .03;
      if (h < pT + pB) {
        const x = ix * CS + hs(ix, iz, 2) * CS * .9, z = iz * CS + hs(ix, iz, 3) * CS * .9, t = mode == "nature" ? 0 : h < pT ? 0 : 1, s = mode == "nature" ? 1 + hs(ix, iz, 4) * 1.1 : .7 + hs(ix, iz, 4) * .8; let ok = true;
        if (mode == "nature") ok = natOk(x, z); else if (mode == "open") ok = rd(x) > (t ? 32 : 14) && rd(z) > (t ? 32 : 14) && !(rd(x) < 40 && rd(z) < 40);
        else if (mode == "race" || mode == "ghost") { const m = t ? 80 : 46; for (let i = 0; i < N; i++) { const dx = x - SP[i].x, dz = z - SP[i].z; if (dx * dx + dz * dz < m * m) { ok = false; break } } }
        if (ok) { o = { x, z, t, s, r: t ? 0 : .9 * s, k: hs(ix, iz, 12) > .5 ? 1 : 0, c: hs(ix, iz, 13), ry: hs(ix, iz, 8) * 6.28 }; if (t) { o.sx = 10 + hs(ix, iz, 5) * 14; o.sz = 10 + hs(ix, iz, 6) * 14; o.sy = 9 + hs(ix, iz, 7) * (zn > .82 ? 60 : 25); o.r = Math.hypot(o.sx, o.sz) * .4 } }
      }
      memo.set(key, o); return o
    }
    const dm = new THREE.Object3D(), dm2 = new THREE.Object3D(), col = new THREE.Color(); let lcx = 1e9, lcz = 1e9;
    function scatter(f) {
      const cx = Math.round(P.x / CS), cz = Math.round(P.z / CS); if (!f && cx == lcx && cz == lcz) return; lcx = cx; lcz = cz; let nt = 0, np = 0, nd = 0, nb = 0, nr = 0, nbu = 0, nbd = 0, nbp = 0, nbB = 0, nbC = 0;
      for (let i = -RR; i <= RR; i++)for (let j = -RR; j <= RR; j++) {
        const o = cellObj(cx + i, cz + j); if (!o) continue; dm.position.set(o.x, TrY(o.x, o.z), o.z); dm.rotation.set(0, o.ry, 0);
        if (!o.t && (o.x - P.x) ** 2 + (o.z - P.z) ** 2 > LOD2) { dm.scale.set((o.k ? 8.4 : 6.6) * o.s, (o.k ? 10.8 : 11.6) * o.s, 1); dm.updateMatrix(); if (o.k) { bbD.setMatrixAt(nbd, dm.matrix); col.setHSL(.2 + o.c * .09, .4, .5 + o.c * .2); bbD.setColorAt(nbd++, col) } else { bbP.setMatrixAt(nbp, dm.matrix); col.setHSL(.33 + o.c * .05, .35, .45 + o.c * .2); bbP.setColorAt(nbp++, col) } } else if (!o.t) {
          const a = o.ry * 3, bs = .8 + o.c * .9, bx = o.x + Math.cos(a) * 3.4 * o.s, bz = o.z + Math.sin(a) * 3.4 * o.s; dm2.position.set(bx, TrY(bx, bz), bz); dm2.rotation.set(0, o.ry, 0); dm2.scale.setScalar(bs); dm2.updateMatrix(); if (o.c > .72) { rock.setMatrixAt(nr, dm2.matrix); col.setHSL(.1, .05, .32 + o.c * .2); rock.setColorAt(nr++, col) } else if (o.c < .55) { bush.setMatrixAt(nbu, dm2.matrix); col.setHSL(.22 + o.c * .1, .45, .17 + o.c * .12); bush.setColorAt(nbu++, col) }
          dm.scale.setScalar(o.s); dm.updateMatrix(); trunk.setMatrixAt(nt++, dm.matrix);
          if (o.k) { crownD.setMatrixAt(nd, dm.matrix); if (mode == "nature" && o.c > .62) col.setHSL(.03 + (o.c - .62) * .3, .7, .4); else col.setHSL(.2 + o.c * .09, .45, .2 + o.c * .14); crownD.setColorAt(nd++, col) } else { crownP.setMatrixAt(np, dm.matrix); col.setHSL(.33 + o.c * .05, .4, .12 + o.c * .1); crownP.setColorAt(np++, col) }
        }
        else { dm.scale.set(o.sx, o.sy, o.sz); dm.updateMatrix(); bldInst.setMatrixAt(nb, dm.matrix); col.setHSL(.08 + o.c * .1, .08, .5 + o.c * .3); bldInst.setColorAt(nb++, col) }
      }
      bldB.count = nbB; bldC.count = nbC; bbD.count = nbd; bbP.count = nbp; trunk.count = nt; crownP.count = np; crownD.count = nd; bldInst.count = nb; rock.count = nr; bush.count = nbu;[trunk, crownP, crownD, bldInst, bldB, bldC, bbD, bbP, rock, bush].forEach(m => { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true })
    }

    /* ---------- state & physics ---------- */
    const P = { gn: 1, sc: 0, nb: 0, bt: 0, g: 0, x: 0, z: 0, h: 0, vx: 0, vz: 0, sm: 0, pit: 0, roll: 0, off: false, gy: 0, ey: 0, sp: 0, sr: 0, gb: 0, dr: 0, dd: 0, hold: 0, gp: 7, sl: 0, yv: 0 }, K = {};
    let cd = 0, clock = 0, lapStart = 0, lapPrev = -1, best = null, cum = 0, li = 0, finished = false, finMsg = "", lastLap = null;
    function place(i, lane) { P.x = SP[i].x + LF[i][0] * lane; P.z = SP[i].z + LF[i][1] * lane; P.h = Math.atan2(TN[i][0], TN[i][1]); P.vx = P.vz = P.sm = 0; P.dr = P.dd = P.hold = P.yv = 0 }
    function pose(a) {
      const f = ((a.s + L0) % N + N) % N, i = Math.floor(f), j = (i + 1) % N, u = f - i, L = (k, n) => k * (1 - u) + n * u, tx = L(TN[i][0], TN[j][0]), tz = L(TN[i][1], TN[j][1]), l = Math.hypot(tx, tz);
      a.g.position.set(L(SP[i].x, SP[j].x) + tz / l * a.lane, .016 + L(EL[i], EL[j]) + L(BK[i], BK[j]) * a.lane, L(SP[i].z, SP[j].z) - tx / l * a.lane); a.g.rotation.order = "YXZ"; a.g.rotation.set(-Math.atan((EL[j] - EL[i]) / DS), Math.atan2(tx, tz), Math.atan(BK[i]))
    }
    let _gK = -1; function ghostK(x, z) { if (_gK >= 0) { const r = near(x, z, _gK, 40); if (r[1] < 14) { _gK = (_gK + r[0] + N) % N; return _gK } } _gK = (near(x, z, 0, 450)[0] + N) % N; return _gK }
    function near(x, z, last, win) { let bj = 0, bd = 1e18; for (let j = -win; j <= win; j++) { const k = (last + j + N) % N, dx = x - SP[k].x, dz = z - SP[k].z, d = dx * dx + dz * dz; if (d < bd) { bd = d; bj = j } } return [bj, Math.sqrt(bd)] }
    function go(m) {
      mode = m; memo.clear(); lcx = 1e9;
      world.visible = m != "show"; studio.visible = m == "show"; roads.forEach(r => r.visible = m == "open"); op.visible = lp.visible = flI.visible = sgB.visible = sgP.visible = brkG.visible = m == "open"; oek = ""; opk = ""; trackG.visible = m == "race" || m == "ghost"; if (ghostG) ghostG.visible = m == "ghost" && !!ghostData; ais.forEach(a => a.g.visible = m == "race"); natG.visible = m == "nature"; natAtmo(m);
      const bg = m == "show" ? 0x0b0d12 : m == "nature" ? 0xbcd8d2 : 0xbdd4eb; S.background.setHex(bg); S.fog.color.setHex(bg); S.fog.near = m == "show" ? 1e5 : m == "nature" ? 70 : 120; S.fog.far = m == "show" ? 2e5 : m == "nature" ? 640 : 850;
      document.body.dataset.mode = m; $("spd").style.display = m == "show" ? "none" : ""; $("race").style.display = $("map").style.display = (m == "race" || m == "ghost") ? "" : "none"; $("lb").style.display = m == "race" ? "" : "none"; $("ba").style.display = m == "show" ? "" : "none";
      $("hint").textContent = m == "show" ? "Drag: orbit — top, bottom, left, right, every angle · Scroll/pinch: zoom · V: reset · C: car · G: garage" : "W/↑ gas · S/↓ brake/reverse · A/D steer · E/Q gear up/down · Space handbrake · Drag: look around the car · F: driver-seat view · V: reset cam · C: car · R: restart · G: garage · M: mute · Esc: menu";
      P.ey = P.sp = P.sr = P.gb = 0; P.vx = P.vz = P.sm = P.pit = P.roll = 0; P.dr = P.dd = P.hold = P.yv = 0; P.gn = 1; P.sc = 0; finished = false; finMsg = ""; $("msg").textContent = "";
      if (m == "race" || m == "ghost") { const rc = m == "race", pi = Math.round((rc ? 48 : 12) / DS); li = L0 - pi; place(li, rc ? -3.5 : 0); cum = -pi; lapPrev = -1; lapStart = clock = 0; best = m == "ghost" && ghostData && ghostData.own ? ghostData.t : null; rec = newRec(); lastLap = null; cd = 3.2; let sl = 0; ais.forEach(a => { if (sl == 9) sl++; a.s = -(12 + 9 * Math.floor(sl / 2)) / DS; a.lane = a.tl = sl % 2 ? -3.5 : 3.5; a.v = 0; sl++; pose(a) }); lbT = 0 }
      else if (m == "nature") { P.x = P.z = 0; P.h = Math.atan2(pDX(0), 1); scatter(true); natUpdate(0, 1) } else if (m == "open") { P.x = P.z = P.h = 0; scatter(true) } else { P.x = P.z = P.h = 0 }
      if (m == "show") dvSet(false); $("bdv").style.display = m == "show" ? "none" : "";
      camReset()
    }
    /* ===== REAL PHYSICS PACK v2 ===== */
    const CHL = 2.5, CHW = .95, HN = [0, 0];
    /* exact height of the rendered terrain mesh (14 m grid, triangles split b-d) so wheels sit ON the visible surface */
    function TrM(x, z) {
      const X = Math.floor(x / 14), Z = Math.floor(z / 14), u = x / 14 - X, v = z / 14 - Z, x0 = X * 14, z0 = Z * 14, ha = TrH(x0, z0), hc = TrH(x0 + 14, z0 + 14);
      if (u + v <= 1) return ha + (TrH(x0 + 14, z0) - ha) * u + (TrH(x0, z0 + 14) - ha) * v;
      return hc + (TrH(x0, z0 + 14) - hc) * (1 - u) + (TrH(x0 + 14, z0) - hc) * (1 - v)
    }
    function rdd(x) { return Math.abs(((x + 400) % 800 + 800) % 800 - 400) }
    function surfF() {
      const o = { g: 1, r: 0, w: 0 };
      if (mode == "nature") { if (nearPond(P.x, P.z, 0, 1)) { o.g = .45; o.w = 1 } else if (nearPond(P.x, P.z, 0, 1.22)) { o.g = .85; o.r = .5 } else if (Math.abs(P.x - pX(P.z)) < 5.5) { o.g = .95; o.r = .1 } else { o.g = .8; o.r = .6 } }
      else if (mode == "open" && rd(P.x) > 14 && rd(P.z) > 14 && !inFil(P.x, P.z)) { o.g = .8; o.r = .7 } return o
    }
    /* soft foliage: true if the car body overlaps a circle (no impulse - the car just pushes through) */
    function circIn(ox, oz, rr) { const ch = Math.sin(P.h), cs = Math.cos(P.h), dx = ox - P.x, dz = oz - P.z, lf = dx * ch + dz * cs, lr = dx * cs - dz * ch; return Math.hypot(lf - Math.max(-CHL, Math.min(CHL, lf)), lr - Math.max(-CHW, Math.min(CHW, lr))) < rr }
    /* impulse: n = obstacle->car, (cx,cz) = contact point on car body, mo = other mass (car=1) */
    function hitP(nx, nz, cx, cz, mo, ovx, ovz, e) {
      const vrn = (P.vx - ovx) * nx + (P.vz - ovz) * nz; if (vrn >= 0) return 0;
      const vn = -vrn, e2 = vn < 3 ? 0 : e, sp = Math.min(1, vn / 6), rx = cx - P.x, rz = cz - P.z, rxn = rz * nx - rx * nz, K2 = 1.6, im = mo > 1e8 ? 0 : 1 / mo, J = (1 + e2) * vn / (1 + im + rxn * rxn / K2);
      P.vx += J * nx; P.vz += J * nz;
      const tx = -nz, tz = nx, vt = (P.vx - ovx) * tx + (P.vz - ovz) * tz, fr = Math.min(Math.abs(vt), .3 * J) * Math.sign(vt); P.vx -= fr * tx; P.vz -= fr * tz;
      P.cw = Math.max(-3, Math.min(3, (P.cw || 0) + (rz * J * nx - rx * J * nz) / K2 * sp));
      P.pv = (P.pv || 0) - Math.min(.05, J * .006) * sp; P.rv = (P.rv || 0) + Math.max(-.05, Math.min(.05, rxn * J * .01)) * sp; return J
    }
    /* car box vs circle (tree, rock, post) */
    function circHit(ox, oz, rr, e) {
      const ch = Math.sin(P.h), cs = Math.cos(P.h), dx = ox - P.x, dz = oz - P.z, lf = dx * ch + dz * cs, lr = dx * cs - dz * ch, cf = Math.max(-CHL, Math.min(CHL, lf)), cr = Math.max(-CHW, Math.min(CHW, lr)), ef = lf - cf, er = lr - cr, dd = Math.hypot(ef, er);
      if (dd >= rr) return 0; let nf, nr, pen = rr - dd; if (dd < 1e-4) { if (CHL - Math.abs(lf) < CHW - Math.abs(lr)) { nf = lf >= 0 ? 1 : -1; nr = 0; pen = rr + CHL - Math.abs(lf) } else { nf = 0; nr = lr >= 0 ? 1 : -1; pen = rr + CHW - Math.abs(lr) } } else { nf = ef / dd; nr = er / dd }
      const nx = -(nf * ch + nr * cs), nz = -(nf * cs - nr * ch), cx = P.x + ch * cf + cs * cr, cz = P.z + cs * cf - ch * cr; P.x += nx * pen; P.z += nz * pen; return hitP(nx, nz, cx + nx * pen, cz + nz * pen, 1e9, 0, 0, e)
    }
    /* car box vs oriented box (building, AI car, traffic) via SAT. box centre (bx,bz), forward (fx,fz), half length hl, half width hw */
    function obbHit(bx, bz, fx, fz, hl, hw, mo, ovx, ovz, e) {
      const ax = Math.sin(P.h), az = Math.cos(P.h), cx2 = az, cz2 = -ax, gx = fz, gz = -fx, A = [[ax, az], [cx2, cz2], [fx, fz], [gx, gz]], dx = P.x - bx, dz = P.z - bz; let best = 1e9, nx = 0, nz = 0;
      for (const a of A) { const rC = CHL * Math.abs(a[0] * ax + a[1] * az) + CHW * Math.abs(a[0] * cx2 + a[1] * cz2), rB = hl * Math.abs(a[0] * fx + a[1] * fz) + hw * Math.abs(a[0] * gx + a[1] * gz), d = dx * a[0] + dz * a[1], ov = rC + rB - Math.abs(d); if (ov <= 0) return 0; if (ov < best) { best = ov; const s = d >= 0 ? 1 : -1; nx = a[0] * s; nz = a[1] * s } }
      let cx = P.x, cz = P.z, md = 1e9; for (const sl of [-1, 1]) for (const sw of [-1, 1]) { const px = P.x + ax * sl * CHL + cx2 * sw * CHW, pz = P.z + az * sl * CHL + cz2 * sw * CHW, q = (px - bx) * nx + (pz - bz) * nz; if (q < md) { md = q; cx = px; cz = pz } }
      P.x += nx * best; P.z += nz * best; HN[0] = nx; HN[1] = nz; return hitP(nx, nz, cx + nx * best, cz + nz * best, mo, ovx, ovz, e) || 1e-6
    }
    function PHYS_AI(list, dt) {
      for (const a of list) {
        if (!a.g) continue; a.lv = a.lv || 0; a.lane += a.lv * dt; a.lv *= Math.exp(-2.2 * dt); a.lane = Math.max(-7, Math.min(7, a.lane)); const ax = a.g.position.x, az = a.g.position.z; if ((P.x - ax) ** 2 + (P.z - az) ** 2 > 64) continue; const ry = a.g.rotation.y, fx = Math.sin(ry), fz = Math.cos(ry), lx = fz, lz = -fx, J = obbHit(ax, az, fx, fz, 2.75, .95, 1, fx * a.v, fz * a.v, .15);
        if (J > 0) { a.v = Math.max(0, a.v - Math.min(8, J * (HN[0] * fx + HN[1] * fz))); a.lv = Math.max(-6, Math.min(6, a.lv - Math.min(6, J * (HN[0] * lx + HN[1] * lz)) * .8)) }
      }
    }
    function statics(dt) {
      brkUpdate(dt); const cx = Math.round(P.x / CS), cz = Math.round(P.z / CS);
      for (let i = -2; i <= 2; i++)for (let j = -2; j <= 2; j++) {
        const o = cellObj(cx + i, cz + j); if (!o) continue;
        if (o.t) { obbHit(o.x, o.z, Math.sin(o.ry), Math.cos(o.ry), o.sz * .5, o.sx * .5, 1e9, 0, 0, .2) }
        else {
          circHit(o.x, o.z, o.r, .25); const a = o.ry * 3, s = .8 + o.c * .9, bx = o.x + Math.cos(a) * 3.4 * o.s, bz = o.z + Math.sin(a) * 3.4 * o.s;
          if (o.c > .72) circHit(bx, bz, 1.2 * s, .1);
          else if (o.c < .55 && circIn(bx, bz, 1.0 * s)) { const q = Math.exp(-2.2 * dt); P.vx *= q; P.vz *= q }
        }
      }
      if (mode == "open" && Math.max(Math.abs(P.x), Math.abs(P.z)) < 830) {
        const kx = Math.round(P.x / 800) * 800, kz = Math.round(P.z / 800) * 800, z20 = Math.round(P.z / 20) * 20, x20 = Math.round(P.x / 20) * 20, z60 = Math.round(P.z / 60) * 60, x60 = Math.round(P.x / 60) * 60;
        for (const [jx, jz] of JDIR) for (const d of [150, 70]) { const sx = kx - jx * d - jz * 13, sz = kz - jz * d + jx * 13; if (Math.abs(P.x - sx) < 6 && Math.abs(P.z - sz) < 6) hitBrk("s", sx, sz, .2, Math.atan2(-jx, -jz)) }
        for (const s of [-1, 1]) {
          const px = kx + s * 11.9, pz = kz + s * 11.9, lx = kx + s * 13.5, lz = kz + s * 13.5;
          if (Math.abs(P.x - px) < 4) for (let i = -1; i <= 1; i++) { const zz = z20 + i * 20; if (rdd(zz) > 15) hitBrk("o", px, zz, .2, 0) }
          if (Math.abs(P.z - pz) < 4) for (let i = -1; i <= 1; i++) { const xx = x20 + i * 20; if (rdd(xx) > 15) hitBrk("o", xx, pz, .2, 0) }
          if (Math.abs(P.x - lx) < 4) for (let i = -1; i <= 1; i++) { const zz = z60 + i * 60; if (rdd(zz) > 15) hitBrk("l", lx, zz, .3, s > 0 ? Math.PI : 0) }
          if (Math.abs(P.z - lz) < 4) for (let i = -1; i <= 1; i++) { const xx = x60 + i * 60; if (rdd(xx) > 15) hitBrk("l", xx, lz, .3, s > 0 ? Math.PI / 2 : -Math.PI / 2) }
        }
      }
    }
    /* ---------- 8-speed manual gearbox (top speed 400 km/h) ---------- */
    const GMAX = [60, 108, 156, 204, 252, 300, 352, 400].map(k => k / 3.6); let gtMsg = "", gtUntil = 0;
    function gcur(r) { return r < .35 ? .2 + .8 * Math.pow(r / .35, .8) : r < .85 ? 1 : r < 1 ? 1 - .6 * (r - .85) / .15 : 0 }
    function gearAcc(v) { const g = P.gn; if (g < 1 || P.sc > 0) return 0; const gm = GMAX[g - 1] * (1 + .2 * (window.NITRO ? NITRO.a : 0)), r = v / gm; if (r >= 1) return -Math.min(30, (r - 1) * gm * 4 + 2); return 24 * Math.pow(60 / (gm * 3.6), .42) * gcur(r) }
    function engBrake(v) { const g = P.gn; if (g < 1) return 0; const gm = GMAX[g - 1], r = Math.min(1.3, v / gm); return (.8 + 5 * r) * (1.2 - g / 10) }
    function shiftGear(d) {
      if (menuOn || gOn || mode == "show" || !ready) return; const n = P.gn + d; if (n < 0 || n > 8) return; const v = Math.hypot(P.vx, P.vz);
      if (d < 0 && n > 0 && v > GMAX[n - 1] * 1.08) { gtMsg = "REV LIMIT - too fast for gear " + n; gtUntil = performance.now() + 1100; return }
      P.gn = n; P.sc = .18; if (d > 0 && v > 8) P.bt = .6
    }
    addEventListener("keydown", e => { if (e.repeat) return; if (e.code == "KeyE" || e.code == "ShiftLeft" || e.code == "ShiftRight") shiftGear(1); else if (e.code == "KeyQ") shiftGear(-1) });
    [["gup", 1], ["gdn", -1]].forEach(([id, d]) => { const b = $(id); if (!b) return; const off = () => b.classList.remove("on"); b.addEventListener("pointerdown", e => { e.preventDefault(); shiftGear(d); b.classList.add("on") }); b.addEventListener("pointerup", off); b.addEventListener("pointercancel", off); b.addEventListener("pointerleave", off) });
    function physics(dt) {
      const up = K.ArrowUp || K.KeyW, dn = K.ArrowDown || K.KeyS, lf = K.ArrowLeft || K.KeyA, rt = K.ArrowRight || K.KeyD, hb = K.Space, can = !((mode == "race" || mode == "ghost") && cd > 0) && !P.air, grass = (mode == "race" || mode == "ghost") && P.off;
      const SF = surfF(), fx = Math.sin(P.h), fz = Math.cos(P.h), fv = P.vx * fx + P.vz * fz; let acc = 0; const gk = Math.hypot(P.vx, P.vz) * 3.6, gi = Math.floor(gk / 37.5), go = can && up && fv > 0 && !hb && P.dr < .3 && !grass; P.sc = Math.max(0, P.sc - dt); P.bt = go ? Math.max(0, P.bt - dt) : Math.max(0, P.bt - dt * 4); const bf = P.bt / .6; P.nb += ((bf > 0 ? 1 : 0) - P.nb) * Math.min(1, dt * 10);
      if (can && up) { if (fv < -.5) acc += 35; else acc += gearAcc(Math.max(fv, P.dr * Math.hypot(P.vx, P.vz), 0)) * (grass ? .45 : 1) }
      if (can && dn) { if (fv > .5) { if (P.dr > .05 || Math.abs(P.sl) > .12) { const s1 = Math.hypot(P.vx, P.vz), s2 = Math.max(0, s1 - 38 * dt) / Math.max(s1, 1e-3); P.vx *= s2; P.vz *= s2 } else acc += -38 } else acc += -9 * (1 - Math.min(1, -fv / 16)) }
      if (!(can && (up || dn))) { acc -= Math.sign(fv) * (1.5 + .0005 * fv * fv) * (1 - P.dr); if (P.dr > .02) { const s1 = Math.hypot(P.vx, P.vz), dv = P.dr * (1.5 + .0005 * s1 * s1) * 1.1 * dt; if (s1 > dv) { const q = (s1 - dv) / s1; P.vx *= q; P.vz *= q } else { P.vx = P.vz = 0 } } }
      if (grass) acc -= Math.sign(fv) * (5 + .004 * fv * fv); if (!(can && up) && P.gn > 0 && fv > 1 && !hb) acc -= engBrake(fv) * (1 - P.dr);
      P.sm += ((can ? (lf ? 1 : 0) - (rt ? 1 : 0) : 0) - P.sm) * Math.min(1, dt * (11 - 3 * Math.min(1, Math.hypot(P.vx, P.vz) / 70)));
      /* DRIFT: handbrake+steer starts it. Holding ANY steer key (left or right) keeps it (speed is kept); right while drifting left only changes the angle. Brake, or no steering for ~.45s -> drift ends, car straightens. */
      const st = P.sm, ast = Math.abs(st), spd0 = Math.hypot(P.vx, P.vz), brk = can && dn && fv > 2;
      if (brk) P.hold = 0;
      else if (can && hb && ast > .3 && spd0 > 14 && fv > 0 && !grass) { P.dd = st > 0 ? 1 : -1; P.hold = .45 }
      else if (ast > .25 && spd0 > 9 && P.dr > .15) P.hold = .45;
      else P.hold = Math.max(0, P.hold - dt);
      const want = (P.hold > 0 && spd0 > 8) ? 1 : 0;
      P.dr += (want - P.dr) * Math.min(1, dt * (want ? 7 : brk ? 6 : 2.4)); if (!want && P.dr < .02) { P.dr = 0; P.dd = 0 }
      const dr = P.dr, gasOn = can && up;
      if (can && hb) acc -= Math.sign(fv) * 14 * (1 - dr * .9);
      acc += (window.NITRO ? NITRO.step(dt, can, fv, hb, dn) : 0); let nfv = fv + acc * dt; if (!(up || dn) && fv * nfv < 0) nfv = 0; P.vx += fx * (nfv - fv); P.vz += fz * (nfv - fv);
      const spd = Math.hypot(P.vx, P.vz);
      const rx = Math.cos(P.h), rz = -Math.sin(P.h), fvn = P.vx * fx + P.vz * fz, slip = Math.atan2(P.vx * rx + P.vz * rz, Math.max(fvn, .1)); P.sl = slip;
      const yb = Math.min(2.1, 68 / Math.max(spd, 1)), yd = Math.min(2.6, 125 / Math.max(spd, 1));
      let yr = st * (yb + (yd - yb) * dr) * Math.min(1, spd / 5) * (1 + (hb ? .6 * (1 - dr) + .6 * dr : 0)) * ((nfv >= 0 || dr > .05) ? 1 : -1);
      if (dr > 0 && yr * slip < 0) { const ex = Math.abs(slip) - .7; if (ex > 0) yr *= Math.max(0, 1 - ex / .25) }
      { const ym = hb ? 3.4 : 2.6; yr = Math.max(-ym, Math.min(ym, yr)) } P.yv += (yr - P.yv) * Math.min(1, dt * ((dr > .02 || hb) ? 14 : 40)); yr = P.yv; P.h += yr * dt; P.h += (P.cw || 0) * dt; P.cw = (P.cw || 0) * Math.exp(-2.8 * dt);
      { const w = Math.max(0, 1 - ast / .35) * Math.min(1, (spd - 4) / 8) * (1 - dr); if (w > 0 && fvn > 0) { const ra = Math.atan2(P.vx, P.vz), dh = Math.atan2(Math.sin(ra - P.h), Math.cos(ra - P.h)); P.h += Math.max(-.9, Math.min(.9, dh)) * (1 - Math.exp(-4 * w * dt)) } }
      const gb = grass ? 3.5 : 7, gt_ = dr > 0 ? gb + (2.5 - gb) * dr : (hb ? 3.2 : gb); P.gp += (gt_ * Math.min(1.8, 1 + .00018 * spd * spd) * (brk ? .8 : 1) * SF.g - P.gp) * Math.min(1, dt * 10);
      const k = P.air ? 0 : 1 - Math.exp(-P.gp * dt), nx = Math.sin(P.h), nz = Math.cos(P.h), f2 = P.vx * nx + P.vz * nz; P.vx -= (P.vx - nx * f2) * k; P.vz -= (P.vz - nz * f2) * k;
      if (dr > .02) { const sa = Math.hypot(P.vx, P.vz); if (sa > .5) { const cf = 1 + (spd / sa - 1) * dr * (gasOn ? 1 : 1); P.vx *= cf; P.vz *= cf } }
      if (dr > .02) { const s3 = Math.hypot(P.vx, P.vz), dv2 = dr * Math.abs(Math.sin(slip)) * (gasOn ? 0 : .8) * dt; if (s3 > dv2) { const q = (s3 - dv2) / s3; P.vx *= q; P.vz *= q } }
      if (hb && can) { const sb = Math.hypot(P.vx, P.vz), db = (ast > .3 ? 20 + 30 * dr : 44) * dt; if (sb > db) { const q = (sb - db) / sb; P.vx *= q; P.vz *= q } else { P.vx = P.vz = 0 } }
      const s2 = Math.hypot(P.vx, P.vz), VC_ = VCAP * (1 + .2 * (window.NITRO ? NITRO.a : 0)); if (s2 > VC_) { P.vx *= VC_ / s2; P.vz *= VC_ / s2 }
      {
        const v = Math.hypot(P.vx, P.vz), gx = P.gx || 0, gz = P.gz || 0, gd = 1 / (1 + gx * gx + gz * gz), sx = -9.81 * gx * gd, sz = -9.81 * gz * gd;
        if (!P.air && (v > 1.2 || Math.hypot(gx, gz) > .62)) { const lon = sx * fx + sz * fz, lat = sx * fz - sz * fx, ex = Math.abs(lat) - 8; P.vx += fx * lon * dt; P.vz += fz * lon * dt; if (ex > 0) { const sg = lat > 0 ? 1 : -1; P.vx += fz * sg * ex * dt; P.vz -= fx * sg * ex * dt } }
        const dv = (.00035 * v * v + (P.air ? 0 : SF.r)) * dt; if (v > dv) { const q = (v - dv) / v; P.vx *= q; P.vz *= q } else { P.vx = P.vz = 0 }
        if (SF.w) { const q = Math.exp(-.9 * dt); P.vx *= q; P.vz *= q }
      }
      P.x += P.vx * dt; P.z += P.vz * dt;
      const cx = 0, cz = 0;
      statics(dt);
      { const k = 95, c = 11, tp = -acc * .0025, tr = yr * spd * .0012; P.pv = (P.pv || 0) + ((tp - P.pit) * k - (P.pv || 0) * c) * dt; P.pit += P.pv * dt; P.rv = (P.rv || 0) + ((tr - P.roll) * k - (P.rv || 0) * c) * dt; P.roll += P.rv * dt }
      {
        const gt = (mode == "race" || mode == "ghost") ? (P.off ? .01 : .02) : (SF.w ? -.12 : 0); P.gb += (gt - P.gb) * Math.min(1, dt * 12); ELUP(dt); P.gy = P.gb + P.ey;
        const cp = Math.max(-.014, Math.min(.014, P.pit * .4)), cr = Math.max(-.02, Math.min(.02, P.roll * .4)), sc_ = Math.sin(cr), cc_ = Math.cos(cp), sp_ = Math.sin(cp), ys = {}; let ym = 1e9;
        for (const k in wheels) { const p = wheels[k].st.position, y = p.x * sc_ * cc_ - p.z * sp_; ys[k] = y; if (y < ym) ym = y }
        for (const k in wheels) { const w = wheels[k]; if (w.by !== undefined) w.st.position.y = w.by - (ys[k] - ym) }
        car.rotation.order = "YXZ"; car.rotation.set(cp + P.sp, P.h, cr + P.sr); car.position.set(P.x, P.gy - .004 - ym + Math.abs(P.sp) * 1.2 + Math.abs(P.sr) * .6, P.z)
      }
      const sp = Math.hypot(P.vx, P.vz) * (nfv >= 0 ? 1 : -1);
      for (const w in wheels) { { let d = sp * dt / (WR[cur] * CFG.ws); if (cur == "w17" || cur == "w13" || cur == "sb" || cur == "w20" || cur == "fe" || cur == "amg1" || cur == "lv12") d = Math.max(-.5, Math.min(.5, d)); wheels[w].sp.rotation.x += d * (wheels[w].rk || 1) } if (w[0] == "f") wheels[w].st.rotation.y = Math.max(-.5, Math.min(.5, P.sm * .4 / (1 + spd / 20) + slip * dr)) }
    }
    /* ---------- drift smoke + skid marks ---------- */
    const SMN = 360, sm_age = new Float32Array(SMN).fill(9), sm_life = new Float32Array(SMN), sm_vel = new Float32Array(SMN * 3), sm_s0 = new Float32Array(SMN), sm_pos = new Float32Array(SMN * 3), sm_S = new Float32Array(SMN), sm_A = new Float32Array(SMN); let smI = 0;
    const smG = new THREE.BufferGeometry(), DU = THREE.DynamicDrawUsage;
    smG.setAttribute("position", new THREE.BufferAttribute(sm_pos, 3).setUsage(DU)); smG.setAttribute("aS", new THREE.BufferAttribute(sm_S, 1).setUsage(DU)); smG.setAttribute("aA", new THREE.BufferAttribute(sm_A, 1).setUsage(DU));
    const smM = new THREE.ShaderMaterial({
      uniforms: { uK: { value: 600 } }, transparent: true, depthWrite: false, fog: false,
      vertexShader: "attribute float aS;attribute float aA;varying float vA;uniform float uK;void main(){vA=aA;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=aS*uK/max(.1,-mv.z);gl_Position=projectionMatrix*mv;}",
      fragmentShader: "varying float vA;void main(){float d=length(gl_PointCoord-.5)*2.;float a=smoothstep(1.,.15,d)*vA;if(a<.004)discard;gl_FragColor=vec4(vec3(.88,.89,.92),a);}"
    });
    const smPts = new THREE.Points(smG, smM); smPts.frustumCulled = false; smPts.renderOrder = 5; S.add(smPts);
    const SKN = 1600, sk_pos = new Float32Array(SKN * 18); let sk_i = 0, sk_n = 0;
    const skG = new THREE.BufferGeometry(); skG.setAttribute("position", new THREE.BufferAttribute(sk_pos, 3).setUsage(DU)); skG.setDrawRange(0, 0);
    const skM = new THREE.Mesh(skG, new THREE.MeshBasicMaterial({ color: 0x050505, transparent: true, opacity: .55, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -8, polygonOffsetUnits: -8 })); skM.frustumCulled = false; S.add(skM);
    const fxV = new THREE.Vector3(), fxLast = {}, fxAcc = {}; let fxMode = "";
    function fxUpdate(dt) {
      smM.uniforms.uK.value = innerHeight * R.getPixelRatio() / (2 * Math.tan(C.fov * Math.PI / 360));
      if (mode !== fxMode) { fxMode = mode; sk_n = 0; sk_i = 0; skG.setDrawRange(0, 0); for (const k in fxLast) fxLast[k].v = 0 }
      const vis = mode != "show"; smPts.visible = skM.visible = vis;
      const run = vis && ready && !menuOn && !gOn && car, spd = Math.hypot(P.vx, P.vz), act = run ? P.dr * Math.min(1, Math.max(0, (spd - 6) / 12)) : 0, sl = Math.abs(P.sl || 0), inten = Math.min(1, .35 + sl / .5); let wrote = false;
      if (run) for (const k in wheels) {
        if (k[0] == "f") continue; wheels[k].st.getWorldPosition(fxV);
        if (act > .15) {
          fxAcc[k] = (fxAcc[k] || 0) + dt * 100 * act * inten; let n = fxAcc[k] | 0; fxAcc[k] -= n;
          while (n-- > 0) {
            const j = smI; smI = (smI + 1) % SMN; sm_age[j] = 0; sm_life[j] = 1.1 + rnd() * .9; sm_s0[j] = 1.2 + rnd() * .9;
            sm_pos[j * 3] = fxV.x + (rnd() - .5) * .4; sm_pos[j * 3 + 1] = P.gy + .15; sm_pos[j * 3 + 2] = fxV.z + (rnd() - .5) * .4;
            sm_vel[j * 3] = P.vx * .12 + (rnd() - .5) * 1.4; sm_vel[j * 3 + 1] = .5 + rnd() * 1.1; sm_vel[j * 3 + 2] = P.vz * .12 + (rnd() - .5) * 1.4
          }
        }
        let L = fxLast[k]; if (!L) L = fxLast[k] = { x: 0, z: 0, v: 0 };
        if (act > .2 && sl > .06) {
          if (L.v) {
            const dx = fxV.x - L.x, dz = fxV.z - L.z, d = Math.hypot(dx, dz);
            if (d > .05 && d < 4) {
              const nx = -dz / d * .13, nz = dx / d * .13, y = P.gy + .035, o = sk_i * 18, ax = L.x + nx, az = L.z + nz, bx = L.x - nx, bz = L.z - nz, cx = fxV.x + nx, cz = fxV.z + nz, ex = fxV.x - nx, ez = fxV.z - nz;
              sk_pos.set([ax, y, az, bx, y, bz, cx, y, cz, bx, y, bz, ex, y, ez, cx, y, cz], o); sk_i = (sk_i + 1) % SKN; sk_n = Math.min(SKN, sk_n + 1); wrote = true
            }
          }
          L.x = fxV.x; L.z = fxV.z; L.v = 1
        } else L.v = 0
      }
      if (wrote) { skG.attributes.position.needsUpdate = true; skG.setDrawRange(0, sk_n * 6) }
      for (let j = 0; j < SMN; j++) {
        let a = sm_age[j]; if (a >= sm_life[j]) { sm_S[j] = 0; sm_A[j] = 0; continue }
        a += dt; sm_age[j] = a; const u = a / sm_life[j], dk = Math.exp(-1.6 * dt);
        sm_vel[j * 3] *= dk; sm_vel[j * 3 + 2] *= dk; sm_vel[j * 3 + 1] *= Math.exp(-.8 * dt);
        sm_pos[j * 3] += sm_vel[j * 3] * dt; sm_pos[j * 3 + 1] += sm_vel[j * 3 + 1] * dt; sm_pos[j * 3 + 2] += sm_vel[j * 3 + 2] * dt;
        sm_S[j] = sm_s0[j] * (1 + u * 5); sm_A[j] = .75 * Math.pow(1 - u, 1.3) * Math.min(1, a * 7)
      }
      smG.attributes.position.needsUpdate = smG.attributes.aS.needsUpdate = smG.attributes.aA.needsUpdate = true
    }
    function sfxD(sf, th, rpm) { const dq = P.dr * Math.min(1, .35 + Math.abs(P.sl || 0) / .6); sfx(sf, th, rpm + (Math.max(rpm, .8) - rpm) * P.dr, dq) }
    let ghostData = null, ghostG = null, rec = null; const DT = .05, newRec = () => ({ x: [], z: [], h: [], s: [] });
    function synthGhost() {
      const X = [], Z = [], H = [], Sg = []; let s = 0, v = 30;
      while (s < N && X.length < 5000) {
        const f = ((s + L0) % N + N) % N, i = Math.floor(f), j = (i + 1) % N, u = f - i, tx = TN[i][0] * (1 - u) + TN[j][0] * u, tz = TN[i][1] * (1 - u) + TN[j][1] * u;
        X.push(+(SP[i].x * (1 - u) + SP[j].x * u).toFixed(1)); Z.push(+(SP[i].z * (1 - u) + SP[j].z * u).toFixed(1)); H.push(+Math.atan2(tx, tz).toFixed(2)); Sg.push(+s.toFixed(2));
        let km = 0; for (let q = 0; q < 40; q += 4)km = Math.max(km, CV[(i + q) % N]); const tg = Math.min(70, Math.sqrt(30 / Math.max(km, 1e-4))); v += Math.max(-28 * DT, Math.min(14 * DT, tg - v)); s += v * DT / DS
      }
      return { t: X.length * DT, x: X, z: Z, h: H, s: Sg, own: false }
    }
    function loadGhost() { try { const g = JSON.parse(localStorage.getItem("f2008ghost")); if (g && g.x && g.x.length > 20) ghostData = g } catch (e) { } if (!ghostData) ghostData = synthGhost() }
    function ghostDone(tm) { if (rec && rec.x.length > 20 && (!ghostData || tm < ghostData.t - .01)) { ghostData = { t: tm, x: rec.x, z: rec.z, h: rec.h, s: rec.s, own: true }; try { localStorage.setItem("f2008ghost", JSON.stringify(ghostData)) } catch (e) { } finMsg = "NEW GHOST SAVED!"; setTimeout(() => finMsg = "", 3000) } rec = newRec() }
    function gsample(tm) {
      const G = ghostData, n = G.x.length, f = Math.min(Math.max(tm / DT, 0), n - 1.001), i = Math.floor(f), u = f - i, dh = Math.atan2(Math.sin(G.h[i + 1] - G.h[i]), Math.cos(G.h[i + 1] - G.h[i]));
      { const gx = G.x[i] * (1 - u) + G.x[i + 1] * u, gz = G.z[i] * (1 - u) + G.z[i + 1] * u, k = ghostK(gx, gz), pl = (gx - SP[k].x) * LF[k][0] + (gz - SP[k].z) * LF[k][1]; ghostG.position.set(gx, .016 + EY(k, pl), gz); ghostG.rotation.order = "YXZ"; ghostG.rotation.set(-Math.atan((EL[(k + 1) % N] - EL[k]) / DS), G.h[i] + dh * u, Math.atan(BK[k])) }
    }
    function ghostInfo() { if (!ghostData) return ""; let d = ""; if (lapPrev >= 0 && cd <= 0) { const u = cum - lapPrev * N, Sa = ghostData.s; let lo = 0, hi = Sa.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; Sa[m] < u ? lo = m + 1 : hi = m } const dl = (clock - lapStart) - lo * DT; d = ' <b style="color:' + (dl <= 0 ? "#4ade80" : "#f87171") + '">' + (dl <= 0 ? "−" : "+") + Math.abs(dl).toFixed(2) + "</b>" } return "👻 " + (ghostData.own ? "YOUR BEST" : "PACE GHOST") + d }
    let lbT = 0;
    function lboard(dt) {
      lbT -= dt; if (lbT > 0) return; lbT = .25; const r = ais.map((a, n) => ({ s: a.s, c: "#" + a.col.toString(16).padStart(6, "0"), n: "CAR " + String(n + 1).padStart(2, "0") })); r.push({ s: cum, c: "#ff2a1f", n: "YOU", me: 1 }); r.sort((a, b) => b.s - a.s); const mi = r.findIndex(x => x.me);
      const row = (x, i) => '<div' + (x.me ? ' style="font-weight:800;color:#ffd400"' : '') + '>' + (i + 1) + ' <span style="color:' + x.c + '">■</span> ' + x.n + '</div>';
      $("lb").innerHTML = r.slice(0, 10).map(row).join("") + (mi > 9 ? row(r[mi], mi) : "")
    }
    function raceStep(dt) {
      cd -= dt; if (cd <= 0) clock += dt;
      const [j, d] = near(P.x, P.z, li, 30); li = (li + j + N) % N; cum += j; P.off = d > 18; {
        const lt = LF[li], pl = (P.x - SP[li].x) * lt[0] + (P.z - SP[li].z) * lt[1], ch = Math.sin(P.h), cs = Math.cos(P.h); let mx = 0, wx = P.x, wz = P.z;
        for (const sl of [-1, 1]) for (const sw of [-1, 1]) { const px = P.x + ch * sl * CHL + cs * sw * CHW, pz = P.z + cs * sl * CHL - ch * sw * CHW, q = Math.abs((px - SP[li].x) * lt[0] + (pz - SP[li].z) * lt[1]); if (q > mx) { mx = q; wx = px; wz = pz } }
        const LIM = limAt(li); if (mx > LIM) { const sg = pl >= 0 ? 1 : -1, nx = -sg * lt[0], nz = -sg * lt[1], pen = mx - LIM; P.x += nx * pen; P.z += nz * pen; hitP(nx, nz, wx + nx * pen, wz + nz * pen, 1e9, 0, 0, .2) }
      }
      const lp = Math.floor(cum / N);
      if (lp > lapPrev) {
        if (lapPrev == -1) { lapStart = clock; rec = newRec() } else if (lp >= 1) { lastLap = clock - lapStart; if (mode == "ghost") ghostDone(lastLap); if (best == null || lastLap < best) best = lastLap; lapStart = clock }
        if (mode == "race" && lp >= 3 && !finished) { finished = true; finMsg = "P" + (1 + ais.filter(a => a.s > cum).length) + " · FINISH!"; setTimeout(() => finMsg = "", 6000) } lapPrev = lp
      }
      const plat = (P.x - SP[li].x) * LF[li][0] + (P.z - SP[li].z) * LF[li][1], all = ais.concat([{ s: cum, v: Math.hypot(P.vx, P.vz), lane: plat }]);
      if (mode == "race" && cd <= 0) ais.forEach(a => {
        const i = ((Math.floor(a.s) + L0) % N + N) % N; let km = 0; for (let q = 0; q < 40; q += 4)km = Math.max(km, CV[(i + q) % N]); let t = Math.min(a.top * 1.3, Math.sqrt(30 / Math.max(km, 1e-4)));
        a.tw = (a.tw || 0) - dt; for (const o of all) { if (o === a) continue; const d = (o.s - a.s) * DS; if (d > 0 && d < 32 && Math.abs(o.lane - a.lane) < 3.2) { if (!(a.tw > 0)) { a.tl = o.lane > 0 ? -4.8 : 4.8; a.tw = 1.5 } if (d < 14) t = Math.min(t, o.v + 4); if (d < 7) t = Math.min(t, o.v) } }
        a.lv = a.lv || 0; a.lv += ((a.tl - a.lane) * 6 - a.lv * 5) * dt; a.lv = Math.max(-5, Math.min(5, a.lv)); a.lane += a.lv * dt; a.v += Math.max(-28 * dt, Math.min(16 * dt, t - a.v)); a.s += a.v * dt / DS; pose(a)
      }); PHYS_AI(ais, dt);
      if (mode == "race") lboard(dt);
      if (mode == "race") ais.forEach(a => { const dx = P.x - a.g.position.x, dz = P.z - a.g.position.z, q = Math.hypot(dx, dz); if (q < 3.2 && q > .01 && Math.abs(P.ey - a.g.position.y) < 4) { P.x += dx / q * (3.2 - q) * .6; P.z += dz / q * (3.2 - q) * .6; P.vx *= .985; P.vz *= .985 } });
      if (mode == "ghost") {
        if (ghostG && ghostData) gsample(lapPrev >= 0 ? clock - lapStart : 0);
        if (lapPrev >= 0 && cd <= 0) { const tt = clock - lapStart; while (rec.x.length * DT <= tt) { rec.x.push(+P.x.toFixed(1)); rec.z.push(+P.z.toFixed(1)); rec.h.push(+P.h.toFixed(2)); rec.s.push(+(cum - lapPrev * N).toFixed(2)) } }
      }
      $("msg").textContent = cd > 0 ? Math.ceil(cd) : cd > -.9 ? "GO!" : finMsg;
    }

    /* ---------- camera ---------- */
    let cth = Math.PI, cph = 1.3, crad = 9, camPsi = 0, auto = true;
    function camReset() { cth = Math.PI; cph = mode == "show" ? 1.35 : 1.3; crad = mode == "show" ? 7.5 : 9; camPsi = P.h }
    function cam(dt) {
      if (dv && mode != "show" && dvCam(dt)) return;
      let dd = Math.atan2(Math.sin(P.h - camPsi), Math.cos(P.h - camPsi)); camPsi += dd * (1 - Math.exp(-5 * dt));
      const w = (mode == "show" ? 0 : camPsi) + cth, ty = .8 + P.ey, sf = Math.min(1, Math.hypot(P.vx, P.vz) / VCAP), er = mode == "show" ? crad : crad * (1 + .2 * sf), sh = mode == "show" ? 0 : .07 * sf * sf * sf, j = () => (rnd() - .5) * sh;
      C.position.set(P.x + er * Math.sin(cph) * Math.sin(w) + j(), ty + er * Math.cos(cph) + j(), P.z + er * Math.sin(cph) * Math.cos(w) + j());
      if (mode != "show") C.position.y = Math.max(C.position.y, window.__camMin ? window.__camMin(C.position.x, C.position.z) : .4);
      C.lookAt(P.x, ty, P.z); const f = (mode == "show" ? 42 : 55 + 47 * Math.pow(sf, 1.05) + (window.NITRO ? 16 * NITRO.a : 0)); C.fov += (f - C.fov) * Math.min(1, dt * 5); C.updateProjectionMatrix()
    }
    const cv = $("c"), ptr = new Map(); let pd = 0; const pdist = () => { const a = [...ptr.values()]; return Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) };
    const zoom = f => { if (dv) { dvZ = Math.min(1.3, Math.max(.6, dvZ * f)); return } crad = Math.min(mode == "show" ? 20 : 45, Math.max(mode == "show" ? 3 : 4, crad * f)) };
    cv.addEventListener("pointerdown", e => { cv.setPointerCapture(e.pointerId); ptr.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (mode == "show") { auto = false; $("ba").textContent = "Auto-rotate: off" } if (ptr.size == 2) pd = pdist() });
    const pup = e => ptr.delete(e.pointerId); cv.addEventListener("pointerup", pup); cv.addEventListener("pointercancel", pup);
    cv.addEventListener("pointermove", e => {
      const p = ptr.get(e.pointerId); if (!p) return; const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
      if (ptr.size == 2) { const d = pdist(); zoom(pd / d); pd = d; return } if (dv) { dvYaw = Math.max(-2.4, Math.min(2.4, dvYaw + dx * .006)); dvPit = Math.max(-1, Math.min(1, dvPit + dy * .006)); return } cth -= dx * .006; cph = Math.min(mode == "show" ? 3.09 : 1.75, Math.max(.05, cph - dy * .006))
    });
    cv.addEventListener("wheel", e => { e.preventDefault(); zoom(1 + e.deltaY * .001) }, { passive: false }); cv.addEventListener("contextmenu", e => e.preventDefault());

    /* ---------- speed fx & sound ---------- */
    const fxc = $("fx"), fg = fxc.getContext("2d"); let au, muted = false;
    function drawFx(s) {
      const w = fxc.width, h = fxc.height; fg.clearRect(0, 0, w, h); const k = Math.max(0, (s - .25) / .75); if (k <= .01) return; const cx = w / 2, cy = h * .5, R = Math.hypot(w, h) * .5, n = 40 + Math.floor(44 * k); fg.lineCap = "round";
      for (let i = 0; i < n; i++) {
        const a = i * 2.399963 + (i % 7) * .31, ph = (i * .6180339) % 1, f = (ph + T * (.8 + 1.9 * k) + (i % 5) * .2) % 1, r0 = R * (.32 + .68 * f * f), len = R * (.04 + .3 * k) * f, ca = Math.cos(a), sa = Math.sin(a);
        fg.strokeStyle = "rgba(255,255,255," + ((.05 + .3 * k) * f).toFixed(3) + ")"; fg.lineWidth = (1 + 2.5 * k) * f + .4; fg.beginPath(); fg.moveTo(cx + ca * r0, cy + sa * r0); fg.lineTo(cx + ca * (r0 + len), cy + sa * (r0 + len)); fg.stroke()
      }
      const g = fg.createRadialGradient(cx, cy, R * .45, cx, cy, R); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0," + (.5 * k).toFixed(3) + ")"); fg.fillStyle = g; fg.fillRect(0, 0, w, h)
    }
    const SPROF = [
      { n: "Original", o: ["sawtooth", "square"], a: [80, 320], b: [40, 160], f: [500, 1800], g: [.06, .05], w: .55 },
      { n: "Soft", o: ["sawtooth", "square"], a: [70, 240], b: [35, 120], f: [400, 1000], g: [.04, .03], w: .12 },
      { n: "Smooth hum", o: ["sawtooth", "triangle"], a: [70, 200], b: [35, 100], f: [350, 700], g: [.04, .03], w: .04 },
      { n: "Turbine", o: ["sine", "triangle"], a: [120, 500], b: [60, 250], f: [800, 1500], g: [.035, .02], w: .06 },
      { n: "Very quiet", o: ["sawtooth", "sine"], a: [60, 160], b: [30, 80], f: [300, 500], g: [.025, .015], w: 0 }];
    let sIdx = 1; try { const v = localStorage.getItem("f2008snd"); if (v !== null) sIdx = Math.max(-1, Math.min(4, +v)) } catch (e) { }
    const SNDP = () => SPROF[Math.max(0, sIdx)];
    function applySnd() {
      const b = $("bmu"); if (b) b.innerHTML = sIdx < 0 ? "🔇<span class=\"tx\"> Off</span>" : "🔊 " + (sIdx + 1) + "<span class=\"tx\"> " + SNDP().n + "</span>"; muted = sIdx < 0;
      if (au && au.n) { au.n.o.type = SNDP().o[0]; au.n.o2.type = SNDP().o[1] } try { localStorage.setItem("f2008snd", sIdx) } catch (e) { }
    }
    function initAudio() {
      if (au) return; try {
        au = new (window.AudioContext || window.webkitAudioContext)(); const o = au.createOscillator(), o2 = au.createOscillator(), g = au.createGain(), f = au.createBiquadFilter(); o.type = SNDP().o[0]; o2.type = SNDP().o[1]; f.type = "lowpass"; f.frequency.value = 900; o.connect(f); o2.connect(f); f.connect(g); g.connect(au.destination); g.gain.value = 0; o.start(); o2.start();
        const nb = au.createBuffer(1, au.sampleRate * 2, au.sampleRate), d = nb.getChannelData(0); for (let i = 0; i < d.length; i++)d[i] = rnd() * 2 - 1; const ns = au.createBufferSource(); ns.buffer = nb; ns.loop = true; const bf = au.createBiquadFilter(); bf.type = "bandpass"; const wg = au.createGain(); wg.gain.value = 0; ns.connect(bf); bf.connect(wg); wg.connect(au.destination); ns.start();
        const sn = au.createBufferSource(); sn.buffer = nb; sn.loop = true; const sb = au.createBiquadFilter(); sb.type = "bandpass"; sb.frequency.value = 2200; sb.Q.value = 7; const sg = au.createGain(); sg.gain.value = 0; sn.connect(sb); sb.connect(sg); sg.connect(au.destination); sn.start();
        const so = au.createOscillator(); so.type = "triangle"; so.frequency.value = 1200; const lfo = au.createOscillator(); lfo.frequency.value = 7; const lg = au.createGain(); lg.gain.value = 80; lfo.connect(lg); lg.connect(so.frequency); const og = au.createGain(); og.gain.value = 0; so.connect(og); og.connect(au.destination); so.start(); lfo.start();
        au.n = { o, o2, g, f, wg, bf, sg, sb, so, og }
      } catch (e) { au = null }
    }
    function sfx(sf, th, rpm, dq) {
      dq = dq || 0; if (!au || !au.n) return; const n = au.n, t = au.currentTime, off = menuOn || gOn || mode == "show" || muted;
      const p = SNDP(); n.o.frequency.setTargetAtTime(p.a[0] + rpm * p.a[1], t, .05); n.o2.frequency.setTargetAtTime(p.b[0] + rpm * p.b[1], t, .05); n.f.frequency.setTargetAtTime(p.f[0] + rpm * p.f[1], t, .1);
      n.g.gain.setTargetAtTime(off ? 0 : p.g[0] + p.g[1] * th + .02 * dq, t, .08); n.wg.gain.setTargetAtTime(off ? 0 : p.w * sf * sf + .05 * dq, t, .1); n.bf.frequency.setTargetAtTime(400 + 1200 * sf + 500 * dq, t, .1);
      if (n.sg) { n.sg.gain.setTargetAtTime(off ? 0 : .12 * dq, t, .06); n.og.gain.setTargetAtTime(off ? 0 : .04 * dq, t, .06); n.so.frequency.setTargetAtTime(1050 + 450 * sf + 250 * dq * (.5 + .5 * Math.sin(t * 9)), t, .05); n.sb.frequency.setTargetAtTime(1900 + 900 * sf, t, .1) }
    }
    /* ---------- ui ---------- */
    const toggleMenu = () => { menuOn = !menuOn; $("menu").style.display = menuOn ? "grid" : "none" };
    addEventListener("keydown", e => { initAudio(); K[e.code] = 1; if (e.code == "KeyM") { sIdx = sIdx >= 4 ? -1 : sIdx + 1; applySnd() } if (e.code == "Escape") toggleMenu(); if (e.code == "KeyC" && ready) nextCar(); if (e.code == "KeyV") { camReset(); dvYaw = dvPit = 0 } if (e.code == "KeyF" && ready && !menuOn) dvSet(!dv); if (e.code == "KeyX" && mode == "ghost" && ready) { try { localStorage.removeItem("f2008ghost") } catch (x) { } ghostData = synthGhost(); go("ghost") } if (e.code == "KeyG" && ready) gPanel(!gOn); if (e.code == "KeyR" && !menuOn && ready) go(mode); if (/^(Arrow|Space)/.test(e.code)) e.preventDefault() });
    addEventListener("keyup", e => K[e.code] = 0); addEventListener("blur", () => { for (const k in K) K[k] = 0 });
    $("bm").onclick = toggleMenu; $("ba").onclick = () => { auto = !auto; $("ba").textContent = "Auto-rotate: " + (auto ? "on" : "off") };
    document.querySelectorAll(".m").forEach(b => b.onclick = () => { initAudio(); const m = b.dataset.m; go(m == "garage" ? "show" : m); menuOn = false; $("menu").style.display = "none"; gPanel(m == "garage") }); $("bg").onclick = () => gPanel(!gOn); document.addEventListener("click", e => e.target.blur && e.target.blur());

    /* ---------- touch controls ---------- */
    addEventListener("touchstart", () => document.body.classList.add("touch"), { passive: true, once: true });
    addEventListener("pointerdown", () => { initAudio(); if (au && au.state == "suspended") au.resume() }, { passive: true });
    document.querySelectorAll("#tc [data-k]").forEach(b => {
      const k = b.dataset.k, off = e => { K[k] = 0; b.classList.remove("on") };
      b.addEventListener("pointerdown", e => { e.preventDefault(); try { b.setPointerCapture(e.pointerId) } catch (x) { } K[k] = 1; b.classList.add("on") });
      ["pointerup", "pointercancel", "lostpointercapture"].forEach(t => b.addEventListener(t, off))
    });
    {
      const sp = $("sp"), sl = $("sl"), sr = $("sr"); let id = null;
      const st = e => { const r = sp.getBoundingClientRect(), L = e.clientX - r.left < r.width / 2, Rr = !L; K.KeyA = L ? 1 : 0; K.KeyD = Rr ? 1 : 0; sl.classList.toggle("on", L); sr.classList.toggle("on", Rr) };
      const off = e => { if (e.pointerId !== id) return; id = null; K.KeyA = K.KeyD = 0; sl.classList.remove("on"); sr.classList.remove("on") };
      sp.addEventListener("pointerdown", e => { e.preventDefault(); id = e.pointerId; try { sp.setPointerCapture(id) } catch (x) { } st(e) });
      sp.addEventListener("pointermove", e => { if (e.pointerId === id) st(e) });
      ["pointerup", "pointercancel", "lostpointercapture"].forEach(t => sp.addEventListener(t, off))
    }
    $("br").onclick = () => { if (ready && !menuOn) go(mode) };
    $("bc").onclick = camReset; $("bdv").onclick = () => { if (ready && !menuOn) dvSet(!dv) };
    $("bmu").onclick = () => { sIdx = sIdx >= 4 ? -1 : sIdx + 1; applySnd() }; applySnd();
    $("mc").onclick = toggleMenu;
    $("menu").addEventListener("click", e => { if (e.target.id == "menu") toggleMenu() });
    addEventListener("blur", () => { for (const k in K) K[k] = 0 });
    document.addEventListener("visibilitychange", () => { if (document.hidden) for (const k in K) K[k] = 0 });
    document.addEventListener("contextmenu", e => { if (e.target.closest && e.target.closest("#tc")) e.preventDefault() });
    const fmt = t => t == null ? "–" : Math.floor(t / 60) + ":" + (t % 60).toFixed(2).padStart(5, "0");
    function hud() {
      if (mode == "show") { sfx(0, 0, 0); return } const kmh = Math.round(Math.hypot(P.vx, P.vz) * 3.6), fv = P.vx * Math.sin(P.h) + P.vz * Math.cos(P.h), gw = 300 / 8;
      const up_ = K.KeyW || K.ArrowUp, gm_ = GMAX[Math.max(0, P.gn - 1)], rr = P.gn > 0 ? Math.min(1.05, Math.max(0, fv) / gm_) : 0, rpm = P.gn > 0 ? .18 + .82 * Math.min(1, rr) : (up_ ? .75 : .15);
      if (kmh !== hud._k) { hud._k = kmh; $("sv").textContent = kmh } { const gv = fv < -.5 ? "R" : P.gn == 0 ? "N" : P.gn; if (gv !== hud._g) { hud._g = gv; $("gr").textContent = gv } }
      const rbE = $("rb"), rbw = (8 + 92 * rpm).toFixed(1) + "%", rbc = (P.gn > 0 && rr > .94) ? "#e10600" : ""; if (rbw !== hud._w) { hud._w = rbw; rbE.style.width = rbw } if (rbc !== hud._c) { hud._c = rbc; rbE.style.background = rbc }
      let tx_ = ""; if (performance.now() < gtUntil) tx_ = gtMsg; else if (P.gn > 0 && P.gn < 8 && rr > .9 && up_ && P.sc <= 0) tx_ = "SHIFT UP \u25B2";
      if (tx_ !== hud._t) { hud._t = tx_; const gtE = $("gtip"); gtE.textContent = tx_; gtE.style.opacity = tx_ ? 1 : 0 }
      sfxD(kmh / 400, up_ ? 1 : 0, Math.min(1, rpm));
      if (mode != "race" && mode != "ghost") return;
      $("lap").textContent = "LAP " + (mode == "race" ? Math.min(3, Math.max(1, Math.floor(cum / N) + 1)) + " / 3" : Math.max(1, Math.floor(cum / N) + 1)); $("tm").textContent = "TIME " + fmt(Math.max(0, clock - lapStart)); $("bt").textContent = "BEST " + fmt(best);
      if (mode == "race") $("ps").textContent = "POS " + (1 + ais.filter(a => a.s > cum).length) + " / " + (ais.length + 1); else $("ps").innerHTML = ghostInfo();
      mg.clearRect(0, 0, 150, 150); mg.drawImage(mapBase, 0, 0); const dot = (x, z, c, r) => { mg.fillStyle = c; mg.beginPath(); mg.arc(12 + (x - MX) * MS, 138 - (z - MZ) * MS, r, 0, 6.3); mg.fill() };
      if (mode == "race") ais.forEach(a => dot(a.g.position.x, a.g.position.z, "#" + a.col.toString(16).padStart(6, "0"), 2.5)); else if (ghostG && ghostData) dot(ghostG.position.x, ghostG.position.z, "#7fd8ff", 4); dot(P.x, P.z, "#ff2a1f", 5)
    }

    /* ---------- loop ---------- */
    let last = performance.now(), T = 0;
    function loop(now) { try { loop0(now) } catch (e) { __showErr(e) } }
    function loop0(now) {
      requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000 || 0); last = now; T += dt; if (!ready) return;
      if (mode == "show") { if (auto) cth += dt * .35; car.position.set(0, 0, 0); car.rotation.set(0, 0, 0); for (const w in wheels) { if (wheels[w].by !== undefined) wheels[w].st.position.y = wheels[w].by; wheels[w].sp.rotation.x += dt * 2; if (w[0] == "f") wheels[w].st.rotation.y = Math.sin(T * .8) * .3 } }
      else if (!menuOn && !gOn) { try { { const ns = Math.hypot(P.vx, P.vz) > 55 ? 3 : 1; for (let i = 0; i < ns; i++)physics(dt / ns) } if (mode == "race" || mode == "ghost") raceStep(dt) } catch (e) { __showErr(e) } }
      if (mode != "show") {
        ground.position.set(Math.round(P.x / 16) * 16, 0, Math.round(P.z / 16) * 16); mount.position.set(P.x, 0, P.z);
        roads.forEach(r => { const u = r.userData; if (u.ax == "z") r.position.set(Math.round(P.x / 800) * 800 + u.k * 800, 0, Math.round(P.z / 24) * 24); else r.position.set(Math.round(P.x / 24) * 24, 0, Math.round(P.z / 800) * 800 + u.k * 800) }); try { scatter(); if (mode == "open") opPosts(); if (mode == "nature") natUpdate(dt) } catch (e) { __showErr(e) }
      }
      uT.value = T; boostFx(dt); clouds.rotation.y = T * .004; fxUpdate(dt); dvSteer(); cam(dt); { const tx = Math.round(P.x / 2) * 2, tz = Math.round(P.z / 2) * 2; sun.target.position.set(tx, P.ey, tz); sun.position.set(tx + SUN.x * 400, SUN.y * 400, tz + SUN.z * 400) } sky.position.copy(C.position); clouds.position.set(C.position.x, 0, C.position.z); hud(); drawFx(mode == "show" || menuOn || gOn ? 0 : Math.min(1, Math.hypot(P.vx, P.vz) / VCAP)); RAINFX(dt); ENVFX(dt); __look(dt)
    }
    /* ===== LOOK PACK: env map, bloom/grain/vignette/motion-blur/god-rays, time of day, height fog, headlights ===== */
    let __look = dt => R.render(S, C);
    try {
      __look = (() => {
        const V3 = THREE.Vector3, Co = THREE.Color, cl = (x, a, b) => Math.max(a, Math.min(b, x)), ss = (a, b, x) => { const t = cl((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t) }, mx = (a, b, t) => a + (b - a) * t;
        /* height fog (patched into every material) */
        Object.assign(THREE.ShaderChunk, {
          fog_pars_vertex: "#ifdef USE_FOG\nvarying float vFogDepth;varying vec3 vFogW;\n#endif",
          fog_vertex: "#ifdef USE_FOG\nvFogDepth=-mvPosition.z;vFogW=cameraPosition+mvPosition.xyz*mat3(viewMatrix);\n#endif",
          fog_pars_fragment: "#ifdef USE_FOG\nuniform vec3 fogColor;varying float vFogDepth;varying vec3 vFogW;\n#ifdef FOG_EXP2\nuniform float fogDensity;\n#else\nuniform float fogNear;uniform float fogFar;\n#endif\n#endif",
          fog_fragment: "#ifdef USE_FOG\n#ifdef FOG_EXP2\nvec3 fv=vFogW-cameraPosition;float fk=.016*fv.y;float fq=abs(fk)<1e-3?1.:(1.-exp(-fk))/fk;float fogFactor=1.-exp(-clamp(fogDensity*exp(-.016*cameraPosition.y)*max(length(fv)-40.,0.)*fq,0.,14.));\n#else\nfloat fogFactor=smoothstep(fogNear,fogFar,vFogDepth);\n#endif\ngl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,fogFactor);\n#endif"
        });
        S.fog = new THREE.FogExp2(0xbdd4eb, .002);
        /* sky shader: parametric colours, moon/sun disc, stars */
        const SKYF = "varying vec3 d;uniform vec3 sun,uHz,uMd,uZn,uSunC,uGnd;uniform float uNight,uCT;float ch2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float cn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(ch2(i),ch2(i+vec2(1.,0.)),f.x),mix(ch2(i+vec2(0.,1.)),ch2(i+vec2(1.,1.)),f.x),f.y);}float cl(vec2 p){float s=0.,a=.5;for(int i=0;i<3;i++){s+=a*cn(p);p=p*2.03+vec2(7.1,3.3);a*=.5;}return s/.875;}float h3(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}void main(){float h=clamp(d.y,0.,1.);vec3 c=mix(uHz,uMd,smoothstep(0.,.28,h));c=mix(c,uZn,smoothstep(.22,.9,h));vec3 n=normalize(d);float s=max(dot(n,sun),0.);c+=uSunC*(pow(s,5.)*.1*(1.-h*.6)+pow(s,22.)*.35)*(1.-.75*uNight)+uSunC*pow(s,700.)*4.;if(d.y>.015){vec2 cp=n.xz/(n.y+.14)*1.5+vec2(uCT*.01,uCT*.004);float cd=cl(cp),dn=smoothstep(.52,.85,cd),sh=clamp(.62+(.62-cd)*.9,.4,1.1);vec3 cc=mix(uHz*1.05,uSunC*1.1+.25,.5)*sh+uSunC*pow(s,6.)*(1.-dn)*.5;cc*=1.-.8*uNight;c=mix(c,cc,dn*smoothstep(.015,.2,d.y)*.92);}c=mix(c,uHz*1.04,exp(-h*14.)*.5);c+=vec3(.9,.95,1.)*smoothstep(.992,1.,h3(floor(n*160.)))*uNight*smoothstep(.04,.35,d.y)*.9;if(d.y<0.)c=uGnd;gl_FragColor=vec4(c,0.);}";
        const sm = sky.material, su = sm.uniforms;
        Object.assign(su, { uHz: { value: new Co() }, uMd: { value: new Co() }, uZn: { value: new Co() }, uSunC: { value: new Co() }, uGnd: { value: new Co() }, uNight: { value: 0 }, uCT: { value: 0 } });
        sm.fragmentShader = SKYF; sm.needsUpdate = true;
        /* procedural environment map (PMREM) from the same sky */
        const envS = new THREE.Scene(), envGnd = new Co(), envU = { sun: { value: SUN }, uHz: su.uHz, uMd: su.uMd, uZn: su.uZn, uSunC: su.uSunC, uNight: su.uNight, uCT: su.uCT, uGnd: { value: envGnd } };
        envS.add(new THREE.Mesh(new THREE.SphereGeometry(50, 24, 12), new THREE.ShaderMaterial({ uniforms: envU, vertexShader: sm.vertexShader, fragmentShader: SKYF, side: THREE.BackSide, depthWrite: false })));
        const pmrem = new THREE.PMREMGenerator(R); let envRT = null, envH = -9, envShow = null, envT = -9;
        function regen(h, show) { if (envRT) envRT.dispose(); envRT = pmrem.fromScene(envS, 0, .1, 100); S.environment = envRT.texture; envH = h; envShow = show; envT = T }
        /* lights */
        const hemi = S.children.find(o => o.isHemisphereLight), fill = S.children.find(o => o.isDirectionalLight && o !== sun);
        /* time of day keyframes: h, horizon, mid, zenith, sunCol, sunI, hemiSky, hemiGnd, hemiI, fogK, exposure, bloom, night */
        const NG = [0x1a2540, 0x0d1630, 0x04081a, 0x9fb4ff, .55, 0x3a4a80, 0x151820, .36, .9, 1.3, .9, 1];
        const RAW = [[0, ...NG], [4.5, ...NG], [5.8, 0x4a4a6e, 0x1e2b55, 0x0a1230, 0x9fb0ff, .45, 0x5a5a8a, 0x1c1c26, .34, 1.1, 1.28, .8, .6], [6.6, 0xffb88a, 0x8aa3d0, 0x34518f, 0xffa860, 1.9, 0xffd9b8, 0x4a4034, .55, 1.3, 1.2, .55, .05], [8.5, 0xc9d7e4, 0x6a9be0, 0x2a58b0, 0xffe2b8, 2.2, 0xcfe3ff, 0x5c5a3c, .7, 1.05, 1.15, .4, 0], [12.5, 0xbdd4eb, 0x5c94db, 0x1a47a3, 0xffe8c4, 2.4, 0xcfe3ff, 0x5c5a3c, .7, 1, 1.15, .35, 0], [16, 0xc4d3e6, 0x5e92d8, 0x1f4eaa, 0xffe0b0, 2.3, 0xcfe3ff, 0x5c5a3c, .68, 1.05, 1.15, .38, 0], [17.5, 0xffc48a, 0x86a0d2, 0x30508f, 0xffb070, 2, 0xffdcb8, 0x4d4234, .6, 1.25, 1.2, .5, 0], [18.5, 0xff7a4a, 0x7a6a9f, 0x232f66, 0xff7a3a, 1.3, 0xc99aa0, 0x3a3038, .42, 1.4, 1.2, .7, .15], [19.6, 0x6a5a86, 0x2c3a6e, 0x0e1a3d, 0x8fa6ff, .4, 0x6a7ab0, 0x20222c, .34, 1.2, 1.25, .75, .75], [21, ...NG], [24, ...NG]];
        const KF = RAW.map(r => ({ h: r[0], c: [1, 2, 3, 4, 6, 7].map(i => new Co(r[i])), n: [5, 8, 9, 10, 11, 12].map(i => r[i]) }));
        const E = { c: [0, 1, 2, 3, 4, 5].map(() => new Co()), n: [0, 0, 0, 0, 0, 0] }, fogC = new Co(), tmpC = new Co();
        function sample(h) { let i = 0; while (i < KF.length - 2 && KF[i + 1].h <= h) i++; const a = KF[i], b = KF[i + 1], u = ss(0, 1, (h - a.h) / (b.h - a.h)); for (let k = 0; k < 6; k++) { E.c[k].copy(a.c[k]).lerp(b.c[k], u); E.n[k] = mx(a.n[k], b.n[k], u) } }
        let sunEl = 1;
        function apply(h, show, nat) {
          sample(h); const [hz, md, zn, sc, hs, hg] = E.c, [sI, hI, fK, ex, bl, ni] = E.n;
          const day = h >= 5.5 && h < 19, th = day ? Math.PI * (h - 5.5) / 13.5 : Math.PI * (((h - 19) % 24 + 24) % 24) / 10.5; sunEl = Math.sin(th) * .85;
          SUN.set(Math.cos(th) * .9, Math.max(.03, sunEl), .4).normalize();
          sun.color.copy(sc); sun.intensity = sI * ss(-.02, .16, sunEl) * (1 - .55 * RW.value);
          if (hemi) { hemi.color.copy(hs); hemi.groundColor.copy(hg); hemi.intensity = hI } if (fill) fill.intensity = .4 * (1 - .6 * ni);
          su.uHz.value.copy(hz); su.uMd.value.copy(md); su.uZn.value.copy(zn); su.uSunC.value.copy(sc); su.uGnd.value.copy(hz).multiplyScalar(.92); su.uNight.value = ni; envGnd.copy(hg).multiplyScalar(1.4).lerp(hz, .2);
          fogC.copy(hz); if (nat) { tmpC.setHex(0xbcd8d2).multiplyScalar(1 - .8 * ni); fogC.lerp(tmpC, .4 * (1 - ni)) } if (show) fogC.setHex(0x0b0d12);
          S.background.copy(fogC); S.fog.color.copy(fogC); S.fog.density = show ? 0 : (nat ? .0042 : .0026) * fK * (1 + 1.8 * RW.value);
          R.toneMappingExposure = ex * (1 - .28 * RW.value); const cc = 1 - .85 * ni; tmpC.setRGB(1, 1, 1).lerp(sc, .5).multiplyScalar(cc); clouds.children.forEach(s => s.material.color.copy(tmpC)); return E
        }
        /* time-of-day state + UI */
        const PRE = [{ n: "Day", e: "☀️", h: 12.5 }, { n: "Night", e: "🌙", h: 23 }];
        let idx = 0; try { if (localStorage.getItem("f2008dn") === "1") idx = 1 } catch (e) { }
        let hCur = PRE[idx].h || 12.5, hTgt = hCur, ovr = false, lastMode = mode, clk = "";
        const wrap = h => ((h % 24) + 24) % 24, fwd = h => { let t = wrap(h); while (t < hCur - .02) t += 24; return t };
        const btod = document.createElement("button"); btod.id = "btod"; $("top").append(btod);
        function lab() { const p = PRE[idx]; btod.innerHTML = p.e + '<span class="tx"> ' + p.n + "</span>" }
        function setIdx(i) { ovr = false; idx = i; if (PRE[i].h != null) hTgt = fwd(PRE[i].h); try { localStorage.setItem("f2008dn", i) } catch (e) { } lab() }
        const POST = { on: false };
        btod.onclick = () => setIdx(1 - idx);
        addEventListener("keydown", e => { if (e.code == "KeyT") btod.onclick() });
        /* materials: env intensity + wet roads */
        const wet = [rmA, rmB]; wet.forEach(m => m.userData.r0 = .85); const seen = new WeakSet(); let scanT = -9, lastWet = -1;
        function scan() {
          const f = (o, car) => { if (!o.isMesh) return;[].concat(o.material).forEach(m => { if (!m || !m.isMeshStandardMaterial || seen.has(m)) return; seen.add(m); m.envMapIntensity = car ? (m.roughness > .8 ? .5 : 1.1) : .15; if (!car && m.map === tkT && !wet.includes(m)) { wet.push(m); m.userData.r0 = m.roughness } }) };
          if (typeof CARS != "undefined") for (const k in CARS) CARS[k].c.traverse(o => f(o, 1)); S.traverse(o => f(o, 0))
        }
        /* headlights, glow, beams, contact shadow */
        const hl = new THREE.Group(); S.add(hl);
        const spots = [-1, 1].map(() => { const s = new THREE.SpotLight(0xfff0d0, 0, 110, .55, .55, 1.2); hl.add(s, s.target); return s });
        const tex = (w, h, f) => { const c = document.createElement("canvas"); c.width = w; c.height = h; f(c.getContext("2d"), w, h); return new THREE.CanvasTexture(c) };
        const glowT = tex(64, 64, g => { const q = g.createRadialGradient(32, 32, 0, 32, 32, 32); q.addColorStop(0, "rgba(255,255,255,1)"); q.addColorStop(.3, "rgba(255,255,255,.35)"); q.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = q; g.fillRect(0, 0, 64, 64) });
        const beamT = tex(4, 64, g => { const q = g.createLinearGradient(0, 0, 0, 64); q.addColorStop(0, "#fff"); q.addColorStop(1, "#000"); g.fillStyle = q; g.fillRect(0, 0, 4, 64) });
        const blobT = tex(64, 64, g => { const q = g.createRadialGradient(32, 32, 0, 32, 32, 32); q.addColorStop(0, "rgba(0,0,0,.75)"); q.addColorStop(.55, "rgba(0,0,0,.35)"); q.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = q; g.fillRect(0, 0, 64, 64) });
        const spr = (c) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, color: c, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, opacity: 0 })); hl.add(s); return s };
        const heads = [spr(0xfff0c8), spr(0xfff0c8)], tails = [spr(0xff2a1a), spr(0xff2a1a)];
        const beamG = new THREE.CylinderGeometry(.08, 3.2, 34, 20, 1, true).rotateX(-Math.PI / 2).translate(0, 0, 17);
        const beams = [0, 1].map(() => { const m = new THREE.Mesh(beamG, new THREE.MeshBasicMaterial({ map: beamT, color: 0xffefc8, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); hl.add(m); return m });
        const blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: blobT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -8, polygonOffsetUnits: -8, fog: false })); blob.renderOrder = 3; S.add(blob);
        let mCur = null, CW = 1.9, CL = 5, hX = .6, hY = .5, hZ = 2.1, tZ = -2.2;
        function measure() {
          const bb = new THREE.Box3(), p = car.position.clone(), r = car.rotation.clone(); car.position.set(0, 0, 0); car.rotation.set(0, 0, 0); car.updateMatrixWorld(true); bb.setFromObject(car); car.position.copy(p); car.rotation.copy(r); car.updateMatrixWorld(true);
          const w = bb.max.x - bb.min.x, l = bb.max.z - bb.min.z, h = bb.max.y - bb.min.y; if (!(w > .5 && l > 1.5)) return; CW = Math.min(w, 2.8); CL = Math.min(l, 7); hX = Math.min(.7, w * .19); hY = bb.min.y + h * .35; hZ = bb.max.z - .4; tZ = bb.min.z + .25
        }
        /* post-processing: bloom + motion blur + god rays + vignette + grain */
        const quadV = "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}", mk = (f, u) => new THREE.ShaderMaterial({ uniforms: u, vertexShader: quadV, fragmentShader: f, depthTest: false, depthWrite: false });
        const mBr = mk("uniform sampler2D tS;uniform vec2 uT;uniform float uThr;varying vec2 vUv;void main(){vec4 q=(texture2D(tS,vUv+vec2(-uT.x,-uT.y))+texture2D(tS,vUv+vec2(uT.x,-uT.y))+texture2D(tS,vUv+vec2(-uT.x,uT.y))+texture2D(tS,vUv+uT))*.25;vec3 c=q.rgb;float l=max(c.r,max(c.g,c.b)),k=smoothstep(uThr,uThr+.2,l);gl_FragColor=vec4(c*k,1.-q.a);}", { tS: { value: null }, uT: { value: new THREE.Vector2() }, uThr: { value: .9 } });
        const mBl = mk("uniform sampler2D tS;uniform vec2 uD;varying vec2 vUv;void main(){vec4 c=texture2D(tS,vUv)*.227027;c+=(texture2D(tS,vUv+uD*1.3846)+texture2D(tS,vUv-uD*1.3846))*.3162162;c+=(texture2D(tS,vUv+uD*3.2308)+texture2D(tS,vUv-uD*3.2308))*.0702703;gl_FragColor=c;}", { tS: { value: null }, uD: { value: new THREE.Vector2() } });
        const mCo = mk("uniform sampler2D tS,tB;uniform vec2 uRes,uCen,uSun;uniform vec3 uRC;uniform float uBloom,uSpd,uRays,uVig,uGrain,uTime;varying vec2 vUv;float hh(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}void main(){vec2 dv=vUv-uCen;float rr=length(dv);vec3 c=vec3(0.);if(uSpd>.01){float k=uSpd*.11*smoothstep(.1,.55,rr);for(int i=0;i<4;i++){c+=texture2D(tS,vUv-dv*k*(float(i)/3.)).rgb;}c*=.25;}else c=texture2D(tS,vUv).rgb;c+=texture2D(tB,vUv).rgb*uBloom;if(uRays>.002){vec2 sd=uSun-vUv;float dist=length(sd);vec2 st=sd/12.*.92,p=vUv;float a=0.,w=1.;for(int i=0;i<12;i++){p+=st;a+=texture2D(tB,p).a*w;w*=.91;}c+=uRC*(a/7.5)*uRays*max(0.,1.-dist*.85);}c*=1.-uVig*smoothstep(.3,1.,rr*1.25);c+=(hh(vUv*uRes+fract(uTime)*91.)-.5)*uGrain;gl_FragColor=vec4(c,1.);}", { tS: { value: null }, tB: { value: null }, uRes: { value: new THREE.Vector2() }, uCen: { value: new THREE.Vector2(.5, .42) }, uSun: { value: new THREE.Vector2() }, uRC: { value: new Co() }, uBloom: { value: .4 }, uSpd: { value: 0 }, uRays: { value: 0 }, uVig: { value: .25 }, uGrain: { value: .03 }, uTime: { value: 0 } });
        const qs = new THREE.Scene(), qc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mBr); quad.frustumCulled = false; qs.add(quad);
        let rtS, rtA, rtB, pw = 0, ph = 0; const sz = new THREE.Vector2(), fw = new V3(), sp = new V3();
        function resize() {
          R.getDrawingBufferSize(sz); let w = sz.x, h = sz.y; const s = Math.min(1, Math.sqrt((window.PQP || 1e9) / (w * h))); w = Math.max(2, Math.round(w * s)); h = Math.max(2, Math.round(h * s)); if (rtS && w == pw && h == ph) return; pw = w; ph = h;
          if (!rtS) { const o = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat }, ms = R.capabilities.isWebGL2 && THREE.WebGLMultisampleRenderTarget && !(window.__GFX && __GFX.det && __GFX.det.mob); rtS = ms ? new THREE.WebGLMultisampleRenderTarget(w, h, o) : new THREE.WebGLRenderTarget(w, h, o); if (ms) rtS.samples = 4; const o2 = Object.assign({ depthBuffer: false }, o); rtA = new THREE.WebGLRenderTarget(4, 4, o2); rtB = new THREE.WebGLRenderTarget(4, 4, o2) }
          rtS.setSize(w, h); const bw = Math.max(2, w >> 2), bh = Math.max(2, h >> 2); rtA.setSize(bw, bh); rtB.setSize(bw, bh); mBr.uniforms.uT.value.set(.5 / w, .5 / h); mCo.uniforms.uRes.value.set(w, h)
        }
        function pass(m, rt) { quad.material = m; R.setRenderTarget(rt); R.render(qs, qc) }
        function post(sp01, ni, rays, sc) {
          resize(); R.setRenderTarget(rtS); R.render(S, C);
          mBr.uniforms.tS.value = rtS.texture; mBr.uniforms.uThr.value = mx(.9, .6, ni); pass(mBr, rtA);
          mBl.uniforms.tS.value = rtA.texture; mBl.uniforms.uD.value.set(2 / rtA.width, 0); pass(mBl, rtB);
          mBl.uniforms.tS.value = rtB.texture; mBl.uniforms.uD.value.set(0, 2 / rtA.height); pass(mBl, rtA);
          const u = mCo.uniforms; u.tS.value = rtS.texture; u.tB.value = rtA.texture; u.uBloom.value = E.n[4]; u.uSpd.value = sp01; u.uRays.value = rays; u.uRC.value.setRGB(1, 1, 1).lerp(sc, .7); u.uVig.value = .22 + .25 * sp01 + .1 * ni; u.uGrain.value = .03 + .03 * ni; u.uTime.value = T;
          C.updateMatrixWorld(); sp.copy(C.position).addScaledVector(SUN, 1000).project(C); u.uSun.value.set(sp.x * .5 + .5, sp.y * .5 + .5);
          pass(mCo, null)
        }
        lab();
        return function (dt) {
          const show = mode === "show", nat = mode === "nature";
          lastMode = mode;
          if (!ovr && idx == 4) { hCur += dt * .12; hTgt = hCur } else { const d = hTgt - hCur; hCur = Math.abs(d) < .01 ? hTgt : hCur + d * Math.min(1, dt * 1.7) }
          if (hCur > 48) { hCur -= 24; hTgt -= 24 }
          const hE = show ? 12.5 : wrap(hCur); apply(hE, show, nat); const ni = E.n[5];
          if (idx == 4 && !ovr) { const c = (hE | 0) + ":" + String((hE % 1 * 60) | 0).padStart(2, "0"); if (c != clk) { clk = c; lab() } }
          if (!envRT || (T - envT > .35 && (Math.abs(hE - envH) > .1 || show !== envShow))) regen(hE, show);
          if (T - scanT > 1.2) { scanT = T; scan() }
          const wv = show ? 0 : ss(.45, .85, ni); if (Math.abs(wv - lastWet) > .01) { lastWet = wv; wet.forEach(m => { m.roughness = mx(m.userData.r0, .2, wv); m.metalness = mx(0, .3, wv); m.envMapIntensity = mx(.15, 1.4, wv); m.color.setScalar(mx(1, .62, wv)) }) }
          if (cur !== mCur) { mCur = cur; measure() }
          const on = show ? 0 : ss(.25, .6, ni), yaw = car.rotation.y; hl.position.copy(car.position); hl.rotation.y = yaw;
          spots.forEach((s, i) => { const sx = i ? 1 : -1; s.intensity = 3.2 * on; s.position.set(sx * hX, hY, hZ); s.target.position.set(sx * hX * .6, -.6, hZ + 38) });
          const brk = (K.KeyS || K.ArrowDown) && !show ? 1 : 0;
          heads.forEach((s, i) => { s.position.set((i ? 1 : -1) * hX, hY, hZ + .1); s.scale.setScalar(1.4); s.material.opacity = .9 * on });
          tails.forEach((s, i) => { s.position.set((i ? 1 : -1) * hX * .9, hY + .05, tZ - .1); s.scale.setScalar(1); s.material.opacity = Math.max(.5 * on, .85 * brk) });
          beams.forEach((b, i) => { b.visible = on > .02; b.position.set((i ? 1 : -1) * hX, hY, hZ); b.rotation.x = .03; b.material.opacity = .13 * on });
          blob.position.set(car.position.x, .05 + P.ey, car.position.z); blob.rotation.y = yaw; blob.scale.set(CW * .78, 1, CL * .8); blob.material.opacity = .55;
          if (!POST.on) { R.setRenderTarget(null); R.render(S, C); return }
          const sp01 = show ? 0 : Math.min(1, Math.hypot(P.vx, P.vz) / VCAP + P.nb * .3), pw_ = Math.pow(sp01, 1.4);
          C.getWorldDirection(fw); const face = ss(.05, .5, fw.dot(SUN)), low = 1 - ss(.25, .7, sunEl), rays = show ? 0 : face * (1 - ni) * ss(0, .3, sunEl) * (nat ? .3 * mx(.6, 1, low) : .12 * low);
          post(pw_, ni, rays, E.c[3])
        }
      })()
    } catch (e) { console.error("look pack failed", e); __look = dt => { R.setRenderTarget(null); R.render(S, C) } }

    /* ===== RAIN + PUDDLES ===== */
    const ROADM = [rmA, rmB, RDM];
    function RAINFX(dt) { if (LAMPM) LAMPM.emissiveIntensity += ((sun.intensity < .5 ? 3 : 0) - LAMPM.emissiveIntensity) * Math.min(1, dt * 3) }
    /* ===== ENVIRONMENT PACK ===== */
    let LOD2 = __Q.lod2; const NBv = { value: 0 }, TrPO = Array.from({ length: 12 }, () => new THREE.Vector3());
    const thn = (x, z) => Math.sin(x * .0113 + 1.3) * Math.cos(z * .0127) + .55 * Math.sin(x * .0271 + z * .0213 + 2) + .3 * Math.sin(z * .0473 - x * .0311 + .5), sst = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) };
    function TrH(x, z) { let h = 9 * thn(x, z) + 3 * thn(x * 2.3 + 17, z * 2.3 + 17); h *= sst(14, 48, Math.abs(x - pX(z))) * sst(25, 90, Math.hypot(x, z)); for (const p of TrPO) if (p.z > 0) h *= sst(p.z * 1.3, p.z * 2.2, Math.hypot(x - p.x, z - p.y)); return h }
    function TrY(x, z) { return mode == "nature" ? TrH(x, z) : 0 }
    function mergeUV(gs, cn) { const Pp = [], U = [], Nn = []; gs.forEach(g => { g = g.toNonIndexed(); const a = g.attributes; for (let i = 0; i < a.position.count; i++) { const x = a.position.getX(i), y = a.position.getY(i), z = a.position.getZ(i); Pp.push(x, y, z); U.push(a.uv.getX(i), a.uv.getY(i)); if (cn) { const dx = x - cn[0], dy = y - cn[1], dz = z - cn[2], l = Math.hypot(dx, dy, dz) || 1; Nn.push(dx / l, dy / l, dz / l) } else Nn.push(0, 1, 0) } }); const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(Pp, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(U, 2)); g.setAttribute("normal", new THREE.Float32BufferAttribute(Nn, 3)); return g }
    const gv = () => Math.floor(150 + rnd() * 105);
    const leafT = mkTex(128, 128, g => { for (let i = 0; i < 140; i++) { const a = rnd() * 6.28, r = Math.sqrt(rnd()) * 54, v = gv(); g.fillStyle = "rgb(" + v + "," + v + "," + v + ")"; g.beginPath(); g.ellipse(64 + Math.cos(a) * r, 64 + Math.sin(a) * r * .85, 5 + rnd() * 5, 3 + rnd() * 3, rnd() * 3, 0, 6.3); g.fill() } });
    const coniT = mkTex(128, 128, g => { g.fillStyle = "#bbb"; g.beginPath(); g.moveTo(64, 2); for (let i = 1; i <= 10; i++)g.lineTo(64 + i * 6 + (i % 2 ? -5 : 3), 2 + i * 12); for (let i = 10; i >= 0; i--)g.lineTo(64 - i * 6 - (i % 2 ? -5 : 3), 2 + i * 12); g.fill(); for (let i = 0; i < 220; i++) { const y = 10 + rnd() * 108, v = gv(); g.strokeStyle = "rgb(" + v + "," + v + "," + v + ")"; g.lineWidth = 1.5; g.beginPath(); const x = 64 + (rnd() - .5) * y * .9; g.moveTo(x, y); g.lineTo(x + (rnd() - .5) * 10, y + 7); g.stroke() } });
    const bladeT = mkTex(64, 64, (g, w, h) => { for (let i = 0; i < 14; i++) { const x = 6 + i * 3.8 + rnd() * 3, hh = 26 + rnd() * 34, v = gv() + 20; g.fillStyle = "rgb(" + Math.min(255, v) + "," + Math.min(255, v) + "," + Math.min(255, v) + ")"; g.beginPath(); g.moveTo(x - 2.2, h); g.quadraticCurveTo(x, h - hh * .6, x + (rnd() - .5) * 14, h - hh); g.quadraticCurveTo(x + 1, h - hh * .5, x + 2.2, h); g.fill() } });
    const cardGeo = (list, cn) => mergeUV(list.map(([w, h, y, ry, rx, ox, oz]) => { const p = new THREE.PlaneGeometry(w, h); p.rotateX(rx); p.rotateY(ry); p.translate(ox, y, oz); return p }), cn);
    {
      const L = [], C = []; for (let i = 0; i < 14; i++)L.push([5.2, 4.4, 5.3 + rnd() * 2.6, rnd() * 6.28, (rnd() - .5) * 1.1, (rnd() - .5) * 3.2, (rnd() - .5) * 3.2]);
      [[6.8, 5.2, 4.3], [5.4, 4.6, 7], [3.6, 4, 9.4]].forEach(([w, h, y]) => { for (let k = 0; k < 3; k++)C.push([w, h, y, k * 1.047, 0, 0, 0]) });
      crownD.geometry = cardGeo(L, [0, 6.2, 0]); crownP.geometry = cardGeo(C, [0, 6.5, 0]);
      [[crownD, leafT], [crownP, coniT]].forEach(([m, t]) => { Object.assign(m.material, { map: t, alphaTest: .5, side: THREE.DoubleSide, flatShading: false, roughness: .9 }); m.material.needsUpdate = true; m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: t, alphaTest: .5 }) })
    }
    const bbT = dr => mkTex(128, 128, g => { g.fillStyle = "rgb(120,92,72)"; g.fillRect(60, dr ? 66 : 108, 8, 62); if (dr) { for (let i = 0; i < 50; i++) { const a = rnd() * 6.28, r = Math.sqrt(rnd()) * 44, v = gv(); g.fillStyle = "rgb(" + v + "," + v + "," + v + ")"; g.beginPath(); g.arc(64 + Math.cos(a) * r, 46 + Math.sin(a) * r * .9, 6 + rnd() * 6, 0, 6.3); g.fill() } } else[[4, 52, 26, 205], [30, 78, 36, 175], [52, 106, 48, 150]].forEach(([y0, y1, hw, v]) => { g.fillStyle = "rgb(" + v + "," + v + "," + v + ")"; g.beginPath(); g.moveTo(64, y0); g.lineTo(64 + hw, y1); g.lineTo(64 - hw, y1); g.fill() }) });
    const BBM = [], mkBB = dr => { const m = new THREE.MeshBasicMaterial({ map: bbT(dr), alphaTest: .5, side: THREE.DoubleSide }); m.onBeforeCompile = sh => { sh.vertexShader = sh.vertexShader.replace("#include <project_vertex>", "vec4 bc=modelMatrix*instanceMatrix*vec4(0.,0.,0.,1.);vec3 bd=cameraPosition-bc.xyz;vec3 brt=normalize(vec3(bd.z,0.,-bd.x));vec4 mvPosition=viewMatrix*vec4(bc.xyz+brt*position.x*length(instanceMatrix[0].xyz)+vec3(0.,position.y*length(instanceMatrix[1].xyz),0.),1.);gl_Position=projectionMatrix*mvPosition;") }; BBM.push(m); const o = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1).translate(0, .5, 0), m, MAXI); o.frustumCulled = false; world.add(o); return o }, bbD = mkBB(1), bbP = mkBB(0);
    const windM = (m, a) => { m.onBeforeCompile = sh => { sh.uniforms.uT = uT; sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nuniform float uT;").replace("#include <begin_vertex>", "#include <begin_vertex>\n{float ph=instanceMatrix[3].x*.21+instanceMatrix[3].z*.17,k=position.y*" + a + ";transformed.x+=(sin(uT*2.2+ph)+.5*sin(uT*4.1+ph*2.))*k;transformed.z+=cos(uT*1.9+ph*1.3)*k*.7;}") } };
    {
      const bl = [0, 1.047, 2.094].map(r => { const p = new THREE.PlaneGeometry(1.5, 1.1); p.translate(0, .55, 0); p.rotateY(r); return p }); tuft.geometry = mergeUV(bl, [0, -2, 0]); Object.assign(tuft.material, { map: bladeT, alphaTest: .45, side: THREE.DoubleSide, flatShading: false }); windM(tuft.material, ".18");
      const g = new THREE.IcosahedronGeometry(1, 1), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + .22 * Math.sin(x * 5.1 + y * 3.7) * Math.cos(z * 4.3 + x * 2.1) + .12 * Math.sin(y * 9.3 + z * 7.7); p.setXYZ(i, x * k * 1.3, y * k * .7 + .35, z * k) } g.computeVertexNormals(); rock.geometry = g
    }
    const dirtT = mkTex(128, 64, (g, w, h) => { const id = g.createImageData(w, h); for (let y = 0; y < h; y++)for (let x = 0; x < w; x++) { const u = Math.abs(x / w - .5) * 2, p = u < .55 ? 1 : Math.max(0, 1 - (u - .55) / .45), i = (y * w + x) * 4, v = (190 + rnd() * 65) * (Math.abs(u - .38) < .07 ? .78 : 1); id.data[i] = v; id.data[i + 1] = v * .97; id.data[i + 2] = v * .92; id.data[i + 3] = rnd() < p * 1.15 - .08 ? 255 : 0 } g.putImageData(id, 0, 0) });
    Object.assign(trl.material, { map: dirtT, alphaTest: .5 });
    /* terrain */
    const TRG = "float thn(vec2 p){return sin(p.x*.0113+1.3)*cos(p.y*.0127)+.55*sin(p.x*.0271+p.y*.0213+2.)+.3*sin(p.y*.0473-p.x*.0311+.5);}uniform vec3 uPo[12];float thH(vec2 p){float h=9.*thn(p)+3.*thn(p*2.3+17.);float tz=70.*sin(p.y/260.)+35.*(sin(p.y/97.+1.)-sin(1.));h*=smoothstep(14.,48.,abs(p.x-tz))*smoothstep(25.,90.,length(p));for(int i=0;i<12;i++){if(uPo[i].z>0.)h*=smoothstep(uPo[i].z*1.3,uPo[i].z*2.2,length(p-uPo[i].xy));}return h;}";
    const tm2 = gmat.clone(), ogm = gmat.onBeforeCompile; tm2.color.setHex(0xb8e6a2);
    tm2.onBeforeCompile = sh => { ogm(sh); sh.uniforms.uPo = { value: TrPO }; sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\n" + TRG).replace("#include <beginnormal_vertex>", "#include <beginnormal_vertex>\n{vec2 q=(modelMatrix*vec4(position,1.)).xz;vec2 g=vec2(thH(q+vec2(2.,0.))-thH(q-vec2(2.,0.)),thH(q+vec2(0.,2.))-thH(q-vec2(0.,2.)))/4.;objectNormal=normalize(vec3(-g.x,1.,-g.y));}").replace("#include <begin_vertex>", "#include <begin_vertex>\n{vec2 q=(modelMatrix*vec4(transformed,1.)).xz;transformed.y+=thH(q);vUv=q/16.;}") };
    const terr = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400, 100, 100).rotateX(-Math.PI / 2), tm2); terr.frustumCulled = false; terr.receiveShadow = true; terr.visible = false; natG.add(terr);
    /* water: animated normals (sky reflection comes from the env map) */
    Object.assign(pW, { color: new THREE.Color(0x1d6f86), metalness: .08, roughness: .03, opacity: .9 });
    pW.onBeforeCompile = sh => {
      sh.uniforms.uT = uT; sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vWp;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvWp=(modelMatrix*vec4(transformed,1.)).xyz;");
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vWp;uniform float uT;").replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\n{vec2 q=vWp.xz;vec2 g=vec2(cos(q.x*.9+uT*1.3)+.6*cos(q.x*2.1+q.y*1.7-uT*2.1),cos(q.y*.8-uT*1.1)+.6*cos(q.y*2.3-q.x*1.3+uT*1.9))*.05;normal=normalize(normal+(viewMatrix*vec4(g.x,0.,g.y,0.)).xyz);}")
    };
    /* city: building variants, night windows, streetlights, traffic */
    const bV = (a) => mergeG(a), bldB = new THREE.InstancedMesh(bV([new THREE.BoxGeometry(1, .68, 1).translate(0, .34, 0), new THREE.BoxGeometry(.62, .32, .62).translate(0, .84, 0)]), bmat, MAXI), bldC = new THREE.InstancedMesh(bV([new THREE.BoxGeometry(1, .94, 1).translate(0, .47, 0), new THREE.BoxGeometry(.5, .05, .5).translate(0, .965, 0), new THREE.BoxGeometry(.02, .1, .02).translate(0, 1.04, 0)]), bmat, MAXI);
    [bldB, bldC].forEach(m => { m.frustumCulled = false; m.castShadow = m.receiveShadow = true; world.add(m) });
    /* FIX r128: bldB/bldC share bmat with bldInst (which has instanceColor). Without their own instanceColor the shared shader program reads a null attribute -> "isInterleavedBufferAttribute of null" every frame. */
    col.setRGB(1, 1, 1); bldB.setColorAt(0, col); bldC.setColorAt(0, col);
    lp.material.onBeforeCompile = sh => { sh.uniforms.uNB = NBv; sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vLp;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvLp=position;"); sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vLp;uniform float uNB;").replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance+=vec3(1.,.8,.5)*step(8.8,vLp.y)*step(2.4,vLp.x)*uNB*3.5;") };
    const TfN = 40, TfM = new THREE.InstancedMesh(mergeG([new THREE.BoxGeometry(1.9, .65, 4.2).translate(0, .62, 0), new THREE.BoxGeometry(1.6, .5, 2.2).translate(0, 1.17, -.2)]), new THREE.MeshStandardMaterial({ roughness: .35, metalness: .3 }), TfN), TfD = [];
    TfM.frustumCulled = false; TfM.castShadow = true; world.add(TfM); for (let i = 0; i < TfN; i++) { TfD.push({ ax: i & 1, sd: (i & 2) ? 1 : -1, off: rnd() * 600, v: 9 + rnd() * 9 }); col.setHSL(rnd(), .55, .45); TfM.setColorAt(i, col) }
    const TfBy = {}; let TfB = 0, TfR = 260;
    function TfBuild() {
      TfB = 1; const ids = Object.keys(CARS), cnt = {}; for (let i = 0; i < TfN; i++) { const id = ids[i % ids.length]; cnt[id] = (cnt[id] || 0) + 1; TfD[i].id = id; TfD[i].slot = cnt[id] - 1 }
      ids.forEach(id => {
        if (!cnt[id]) return; const c = CARS[id].c; c.updateMatrixWorld(true); const inv = new THREE.Matrix4().copy(c.matrixWorld).invert(), gm = new Map(), mt = new THREE.Matrix4(), nm = new THREE.Matrix3(), v = new THREE.Vector3();
        c.traverse(me => {
          if (!me.isMesh || !me.geometry.attributes.normal) return; const m = me.material; if (Array.isArray(m) || m.isShaderMaterial || (m.isMeshBasicMaterial && m.depthWrite === false)) return; if (/^(FERWH|LEDSL|Shaft)/.test(me.userData.k || "")) return; for (let a = me; a && a !== c; a = a.parent)if (!a.visible) return;
          mt.multiplyMatrices(inv, me.matrixWorld); nm.getNormalMatrix(mt); const g = me.geometry, pa = g.attributes.position, na = g.attributes.normal, ua = g.attributes.uv, ca = m.vertexColors && g.attributes.color, e = gm.get(m) || { p: [], n: [], u: [], c: [], i: [], o: 0 }; gm.set(m, e);
          for (let k = 0; k < pa.count; k++) { v.fromBufferAttribute(pa, k).applyMatrix4(mt); e.p.push(v.x, v.y, v.z); v.fromBufferAttribute(na, k).applyMatrix3(nm).normalize(); e.n.push(v.x, v.y, v.z); e.u.push(ua ? ua.getX(k) : 0, ua ? ua.getY(k) : 0); if (ca) e.c.push(ca.getX(k), ca.getY(k), ca.getZ(k)) }
          const ix = g.index; if (ix) for (let k = 0; k < ix.count; k++)e.i.push(ix.getX(k) + e.o); else for (let k = 0; k < pa.count; k++)e.i.push(k + e.o); e.o += pa.count
        });
        (TfBy[id] = []); gm.forEach((e, m) => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(e.p, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(e.n, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(e.u, 2)); if (e.c.length == e.p.length) g.setAttribute("color", new THREE.Float32BufferAttribute(e.c, 3)); g.setIndex(e.i); const im = new THREE.InstancedMesh(g, m, cnt[id]); im.frustumCulled = false; im.castShadow = false; im.visible = false; world.add(im); TfBy[id].push(im) })
      })
    }
    function TRAF(dt) {
      const on = false; TfM.visible = false; if (on && !TfB) TfBuild(); if (!on) { for (const id in TfBy) TfBy[id].forEach(im => im.visible = false); return }
      const kk = {}, r2 = TfR * TfR;
      for (let i = 0; i < TfN; i++) {
        const q = TfD[i], c = q.ax ? Math.round(P.z / 800) * 800 : Math.round(P.x / 800) * 800, al = q.ax ? P.x : P.z; q.v0 = q.v0 || q.v; q.v += (q.v0 - q.v) * Math.min(1, dt * .3); q.sh = (q.sh || 0) * Math.exp(-1.2 * dt); q.off += q.v * q.sd * dt; const u = al + (((q.off - al + 300) % 600) + 600) % 600 - 300, lat = c + (q.ax ? q.sd : -q.sd) * 3.6 + (q.sh || 0), x = q.ax ? u : lat, z = q.ax ? lat : u, dx = P.x - x, dz = P.z - z, d2 = dx * dx + dz * dz;
        if (d2 > r2) continue; const j = kk[q.id] = (kk[q.id] || 0) + 1; dm.position.set(x, .02, z); dm.rotation.set(0, q.ax ? q.sd * 1.5708 : (q.sd > 0 ? 0 : 3.1416), 0); dm.scale.set(1, 1, 1); dm.updateMatrix(); TfBy[q.id].forEach(im => im.setMatrixAt(j - 1, dm.matrix));
        if (d2 < 36) { const tx = q.ax ? q.sd : 0, tz = q.ax ? 0 : q.sd, Jt = obbHit(x, z, tx, tz, 2.4, 1, 1.2, tx * q.v, tz * q.v, .2); if (Jt > 0) { q.v = Math.max(0, q.v - Jt * (HN[0] * tx + HN[1] * tz) * .8); q.sh = (q.sh || 0) - Jt * (q.ax ? HN[1] : HN[0]) * .8 } }
      }
      for (const id in TfBy) { const k = kk[id] || 0; TfBy[id].forEach(im => { im.count = k; im.visible = k > 0; im.instanceMatrix.needsUpdate = true }) }
    }
    function ENVFX(dt) {
      uT.value = T; const u = sky.material.uniforms.uCT; if (u) u.value = T; clouds.visible = false;
      terr.visible = false; ground.visible = mode != "open"; if (mode == "open") { try { window.__wUpd && window.__wUpd(dt) } catch (e) { __showErr(e) } }
      NBv.value = Math.max(0, Math.min(1, 1 - sun.intensity / .9)); const bc = Math.min(1, .2 + .34 * sun.intensity); BBM.forEach(m => m.color.setScalar(bc)); pW.envMapIntensity = 1.8; try { TRAF(dt) } catch (e) { __showErr(e) }
    }
    /* ===== QUALITY GOVERNOR ===== */
    requestAnimationFrame(loop);
  
  (function () { var t = document.getElementById("top"); function f() { document.documentElement.style.setProperty("--tx", Math.max(0, t.offsetHeight - 44) + "px") } addEventListener("resize", f); try { new ResizeObserver(f).observe(t) } catch (e) { } f(); setTimeout(f, 600) })();

