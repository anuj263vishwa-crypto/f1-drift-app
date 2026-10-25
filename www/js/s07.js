
/* ===== WORLD v3: unified island (open world + nature) ===== */
(function(){
"use strict";
try{
/* ===================== WORLD v3 : generator part 1 (noise, landmarks, spline) ===================== */
const WCELL = 6.25, WN = 1024, WORG = -3200, SEA = -9, CITYH = 900;
const wSS = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) };
const wHh = (i, j) => { let h = Math.imul(i, 374761393) + Math.imul(j, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295 };
const wVn = (x, z) => { const i = Math.floor(x), j = Math.floor(z), u = x - i, v = z - j, su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v); return (wHh(i, j) * (1 - su) + wHh(i + 1, j) * su) * (1 - sv) + (wHh(i, j + 1) * (1 - su) + wHh(i + 1, j + 1) * su) * sv };
const wFb = (x, z, o) => { let s = 0, a = .5, f = 1; for (let k = 0; k < o; k++) { s += a * (wVn(x * f + k * 31.7, z * f - k * 17.3) - .5); a *= .5; f *= 2.03 } return s * 2 };
const wNz = (x, z) => Math.sin(x * .0113 + 1.3) * Math.cos(z * .0127) + .55 * Math.sin(x * .0271 + z * .0213 + 2) + .3 * Math.sin(z * .0473 - x * .0311 + .5);
const wRc = th => 2480 + 250 * Math.sin(2 * th + .8) + 130 * Math.sin(5 * th + 2.1) + 60 * Math.sin(11 * th + 1);
const HM = new Float32Array(WN * WN), VG = new Uint8Array(WN * WN);
const HL = { x: 1840, z: -1260, h: 210, r: 92 };
const hlSea = (() => { const l = Math.hypot(HL.x, HL.z); return [HL.x / l, HL.z / l] })();
const FALL = { x: -316, z: -1704, dx: .6, dz: .8, up: 46 };
const MB = [[-1350, -1650, 520, 300], [-1900, -300, 520, 250], [950, -1950, 480, 250], [-1500, 1400, 500, 140]];
const UND = { x: 0, z0: -560, z1: -280, zf0: -470, zf1: -370, depth: 7 };
const TUN = { x: 0, z0: -1860, z1: -1600, zc: -1730, A: 72, R: 74, W: 17 };
const LAKES = [{ x: -520, z: 1750, r: 100 }];
const BRIDGE_SITES = [[0, -1345], [1585, -800]];
const RIVER_PTS = [[-560, -1950], [-480, -1870], [-380, -1775], [-322, -1710], [-310, -1699], [-230, -1600], [-120, -1470], [-30, -1380], [60, -1320], [220, -1250], [450, -1180], [800, -1090], [1200, -960], [1520, -850], [1650, -790], [1950, -650], [2250, -600], [2560, -610]];
function mtn(x, z) {
  let s = 0; for (const [cx, cz, r, A] of MB) {
    const dx = x - cx, dz = z - cz, g = Math.exp(-(dx * dx + dz * dz) / (r * r)); if (g < .003) continue;
    const rg = 1 - Math.abs(wFb(x * .004 + cx, z * .004 + cz, 3)) * 1.1, det = wFb(x * .012, z * .012, 4);
    s += A * Math.pow(g, 1.15) * (.55 + .55 * rg) + 40 * g * det
  } return s
}
function tunRidge(x, z) { const dz = Math.abs(z - TUN.zc); const a = 1 - wSS(40, 330, dz); return TUN.A * a * Math.exp(-Math.pow((x - TUN.x) / TUN.R, 2)) }
function spline(pts, step, flags) {
  const n = pts.length, dense = []; const P = i => pts[Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < n - 1; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2), st = (flags && flags[i]) ? 1 : 24;
    for (let q = 0; q < st; q++) {
      const t = q / st; let x, z;
      if (st == 1) { x = p1[0]; z = p1[1] } else { const t2 = t * t, t3 = t2 * t; x = .5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3); z = .5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3) }
      dense.push({ x, z, k: !!(flags && flags[i]), i })
    }
  } dense.push({ x: pts[n - 1][0], z: pts[n - 1][1], k: false, i: n - 1 });
  const out = []; let acc = 0, prev = dense[0]; out.push({ x: prev.x, z: prev.z, k: dense[0].k, i: 0 }); let nextAt = step;
  for (let a = 1; a < dense.length; a++) {
    const cu = dense[a]; const seg = Math.hypot(cu.x - prev.x, cu.z - prev.z);
    while (acc + seg >= nextAt) { const f = (nextAt - acc) / seg; out.push({ x: prev.x + (cu.x - prev.x) * f, z: prev.z + (cu.z - prev.z) * f, k: prev.k, i: prev.i }); nextAt += step }
    acc += seg; prev = cu
  } return out
}
const RIV = spline(RIVER_PTS, 6, { 3: true });
function riverDist(x, z) { let b = 1e9; for (let i = 0; i < RIV.length; i++) { const p = RIV[i], d = (p.x - x) * (p.x - x) + (p.z - z) * (p.z - z); if (d < b) b = d } return Math.sqrt(b) }
function mesaBump(x, z) { let s = 0; for (const [cx, cz] of BRIDGE_SITES) { const d = Math.hypot(x - cx, z - cz); if (d > 260) continue; const g = Math.exp(-Math.pow(d / 130, 2)); if (g < .01) continue; s += 17 * g * wSS(10, 40, riverDist(x, z)) } return s }
function terraceFn(x, z) { const ux = x - FALL.x, uz = z - FALL.z, u = ux * FALL.dx + uz * FALL.dz, v = -ux * FALL.dz + uz * FALL.dx; return FALL.up * (1 - wSS(-14, 14, u)) * (1 - wSS(170, 320, Math.abs(v))) * wSS(-1500, -1000, u) }
function natH(x, z) {
  const R = Math.hypot(x, z), th = Math.atan2(z, x), d = wRc(th) - R;
  let h = 15 + 9 * wFb(x * .0022, z * .0022, 5) + 3 * wFb(x * .02, z * .02, 3);
  h += mtn(x, z) + terraceFn(x, z) + tunRidge(x, z) + mesaBump(x, z);
  const dc = Math.max(Math.abs(x), Math.abs(z)); h *= wSS(CITYH - 20, CITYH + 250, dc);
  if (d >= 0) h = SEA + (h - SEA) * wSS(0, 260, d); else h = SEA - 40 * wSS(0, 320, -d);
  const rh = Math.hypot(x - HL.x, z - HL.z); h += (HL.h + 10) * Math.exp(-Math.pow(rh / 300, 2)); h += (HL.h - h) * (1 - wSS(HL.r, HL.r + 55, rh));
  return h
}
function hmAt(x, z) { const fx = (x - WORG) / WCELL, fz = (z - WORG) / WCELL; let i = Math.floor(fx), j = Math.floor(fz); i = Math.max(0, Math.min(WN - 2, i)); j = Math.max(0, Math.min(WN - 2, j)); const u = fx - i, v = fz - j, a = HM[j * WN + i], b = HM[j * WN + i + 1], c = HM[(j + 1) * WN + i], d = HM[(j + 1) * WN + i + 1]; return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v }
function nodesNearSeg(ax, az, bx, bz, r, cb) {
  const i0 = Math.max(0, Math.floor((Math.min(ax, bx) - r - WORG) / WCELL)), i1 = Math.min(WN - 1, Math.ceil((Math.max(ax, bx) + r - WORG) / WCELL)), j0 = Math.max(0, Math.floor((Math.min(az, bz) - r - WORG) / WCELL)), j1 = Math.min(WN - 1, Math.ceil((Math.max(az, bz) + r - WORG) / WCELL));
  const dx = bx - ax, dz = bz - az, L2 = dx * dx + dz * dz || 1;
  for (let j = j0; j <= j1; j++)for (let i = i0; i <= i1; i++) { const x = WORG + i * WCELL, z = WORG + j * WCELL; let t = ((x - ax) * dx + (z - az) * dz) / L2; t = t < 0 ? 0 : t > 1 ? 1 : t; const px = ax + dx * t, pz = az + dz * t, d = Math.hypot(x - px, z - pz); if (d < r) cb(j * WN + i, d, t) }
}
const ROADS = [], FEATS = { falls: [], lakes: [] };

/* ===================== WORLD v3 : generator part 2 (build) ===================== */
function buildWorld() {
  for (let j = 0; j < WN; j++)for (let i = 0; i < WN; i++)HM[j * WN + i] = natH(WORG + i * WCELL, WORG + j * WCELL);
  /* forest lake basin */
  { const L = LAKES[0]; L.y = Math.max(SEA + 6, hmAt(L.x, L.z) - 1); const R = L.r;
    for (let j = 0; j < WN; j++)for (let i = 0; i < WN; i++) { const x = WORG + i * WCELL, z = WORG + j * WCELL, r = Math.hypot(x - L.x, z - L.z); if (r > R + 70) continue; const tg = r < R ? L.y - 4.5 * (1 - (r / R) * (r / R)) : L.y + .7 + .05 * (r - R), w = 1 - wSS(R + 8, R + 70, r), id = j * WN + i; HM[id] += (tg - HM[id]) * w } }
  /* river water profile + valley */
  { const fi = RIV.findIndex(p => p.k); let fe = RIV.findIndex((p, i) => i > fi && !p.k); if (fe < 0) fe = fi + 1;
    const th = RIV.map(p => hmAt(p.x, p.z)), sm = th.slice();
    for (let pass = 0; pass < 4; pass++) { const t = sm.slice(); for (let i = 0; i < RIV.length; i++) { if (i >= fi - 3 && i <= fe + 3) continue; let q = 0, c = 0; for (let k = -8; k <= 8; k++) { const m = i + k; if (m < 0 || m >= RIV.length || (m >= fi - 3 && m <= fe + 3)) continue; q += sm[m]; c++ } t[i] = q / c } for (let i = 0; i < RIV.length; i++)sm[i] = t[i] }
    let run = 1e9; for (let i = 0; i < RIV.length; i++) { const tgt = (i >= fi && i <= fe) ? th[i] - 1.6 : sm[i] - 2.0; run = Math.min(run - .004, tgt); RIV[i].y = Math.max(run, SEA + .15) }
    RIV.fi = fi; RIV.fe = fe; const hw = 9;
    for (let i = 0; i < RIV.length - 1; i++) { const a = RIV[i], b = RIV[i + 1]; nodesNearSeg(a.x, a.z, b.x, b.z, 110, (id, d, t) => { const y = a.y + (b.y - a.y) * t, tg = d <= hw ? y - 2.2 + .7 * (d / hw) * (d / hw) : y - 1.5 + .45 * (d - hw); if (tg < HM[id]) HM[id] = tg }) }
    FEATS.falls.push({ a: RIV[fi], b: RIV[fe], x: FALL.x, z: FALL.z });
    { const b = RIV[fe], R = 42, y = b.y, cx = b.x + 28, cz = b.z + 30; for (let j = 0; j < WN; j++)for (let i = 0; i < WN; i++) { const x = WORG + i * WCELL, z = WORG + j * WCELL, r = Math.hypot(x - cx, z - cz); if (r > R + 40) continue; const id = j * WN + i, tg = r < R ? y - 4 * (1 - (r / R) * (r / R)) - .5 : y + .6 + .5 * (r - R) / 6, w = 1 - wSS(R, R + 40, r); if (tg < HM[id] || r < R) HM[id] += (tg - HM[id]) * w } FEATS.lakes.push({ x: cx, z: cz, r: R + 2, y: y }) }
    FEATS.lakes.push({ x: LAKES[0].x, z: LAKES[0].z, r: LAKES[0].r + 2, y: LAKES[0].y });
  }
  /* underpass trench */
  for (let j = 0; j < WN; j++)for (let i = 0; i < WN; i++) { const x = WORG + i * WCELL, z = WORG + j * WCELL; if (Math.abs(x) > 13 || z < UND.z0 - 1 || z > UND.z1 + 1) continue; const dp = z < UND.zf0 ? UND.depth * wSS(UND.z0, UND.zf0, z) : z > UND.zf1 ? UND.depth * (1 - wSS(UND.zf1, UND.z1, z)) : UND.depth, id = j * WN + i; if (Math.abs(x) < 6.5) HM[id] = -dp; else if (dp > .01) HM[id] = -dp * Math.max(0, 1 - (Math.abs(x) - 6.25) / 6.25) }
  /* summit switchbacks */
  const psi = Math.atan2(-hlSea[1], -hlSea[0]), pol = (phi, r) => [HL.x + Math.cos(psi + phi) * r, HL.z + Math.sin(psi + phi) * r], SWB = [];
  { const leg = (p0, p1, r0, r1, n) => { for (let i = 0; i <= n; i++) { const t = i / n; SWB.push(pol(p0 + (p1 - p0) * t, r0 + (r1 - r0) * t)) } }, hp = (pe, ra, rb) => { const s = Math.sign(pe), rm = (ra + rb) / 2; SWB.push(pol(pe + s * .06, ra - 4)); SWB.push(pol(pe + s * .16, rm)); SWB.push(pol(pe + s * .06, rb + 4)) };
    leg(-.2, 1.3, 450, 385, 5); hp(1.3, 385, 322); leg(1.3, -1.3, 322, 268, 6); hp(-1.3, 268, 214); leg(-1.3, 1.25, 214, 168, 6); hp(1.25, 168, 118); leg(1.25, 0, 118, 96, 3); SWB.push(pol(0, 55)) }
  const defs = [
    { id: "hwN", t: "a", hw: 10, pts: [[0, -800], [0, -1000], [0, -1200], [0, -1300], [0, -1420], [0, -1520], [0, -1600], [0, -1860], [0, -1990], [-90, -2100], [-230, -2170], [-380, -2090], [-300, -1990], [-200, -1950]], fl: { 3: 'B', 6: 'T' } },
    { id: "hwE", t: "a", hw: 10, pts: [[800, 0], [1000, -60], [1200, -190], [1380, -380], [1480, -560], [1560, -700], [1585, -740], [1600, -870], ...SWB], fl: { 6: 'B' }, endY: HL.h, gr: .085 },
    { id: "trail", t: "d", hw: 3.6, pts: [[0, 800], [0, 1000], [40, 1180], [-30, 1380], [-210, 1560], [-420, 1620], [-640, 1700], [-640, 1980], [-420, 2160], [-130, 2160], [150, 2200], [300, 2235]], fl: {} },
    { id: "coast", t: "a", hw: 9, pts: [[800, 800], [1000, 900], [1230, 980], [1450, 1130], [1660, 1260], [1900, 1350], [2110, 1440]], fl: {} }
  ];
  for (const d of defs) {
    const flags = {}; for (const k in d.fl) flags[k] = true;
    const S = spline(d.pts, 6, flags), n = S.length, th = S.map(p => hmAt(p.x, p.z)); let hs = th.slice();
    const kind = S.map(p => p.k ? d.fl[p.i] : 0);
    for (let pass = 0; pass < 16; pass++) { const t = hs.slice(); for (let i = 0; i < n; i++) { if (kind[i]) continue; let q = 0, c = 0; for (let k = -9; k <= 9; k++) { const m = i + k; if (m < 0 || m >= n) continue; q += hs[m]; c++ } t[i] = q / c } hs = t }
    let i = 0; while (i < n) { if (kind[i]) { let j = i; while (j < n && kind[j]) j++; const ya = hs[Math.max(0, i - 1)], yb = hs[Math.min(n - 1, j)]; for (let k = i; k < j; k++)hs[k] = ya + (yb - ya) * (k - i + 1) / (j - i + 1); i = j } else i++ }
    const mg = (d.gr || (d.t == "a" ? .075 : .09)) * 6;
    for (let pass = 0; pass < 8; pass++) { if (d.endY !== undefined) hs[n - 1] = d.endY; for (let i = 1; i < n; i++)if (hs[i] - hs[i - 1] > mg) hs[i] = hs[i - 1] + mg; else if (hs[i - 1] - hs[i] > mg) hs[i] = hs[i - 1] - mg; if (d.endY !== undefined) hs[n - 1] = d.endY; for (let i = n - 2; i >= 0; i--)if (hs[i] - hs[i + 1] > mg) hs[i] = hs[i + 1] + mg; else if (hs[i + 1] - hs[i] > mg) hs[i] = hs[i + 1] - mg }
    const R = { id: d.id, t: d.t, hw: d.hw, pts: S.map((p, i) => ({ x: p.x, z: p.z, y: hs[i], k: kind[i] })) }; ROADS.push(R);
    const blend = d.t == "a" ? 26 : 14, best = new Map();
    for (let i = 0; i < n - 1; i++) { const a = R.pts[i], b = R.pts[i + 1]; if (a.k == 'B' || a.k == 'T') continue; const hwid = d.hw + 2;
      nodesNearSeg(a.x, a.z, b.x, b.z, hwid + blend, (id, dd, t) => { const cu = best.get(id); if (!cu || dd < cu[0]) best.set(id, [dd, a.y + (b.y - a.y) * t, hwid]) }) }
    best.forEach((v, id) => { const w = 1 - wSS(v[2], v[2] + blend, v[0]); HM[id] += (v[1] - HM[id]) * w });
  }
  /* vegetation mask */
  for (let j = 0; j < WN; j++)for (let i = 0; i < WN; i++) {
    const x = WORG + i * WCELL, z = WORG + j * WCELL, id = j * WN + i, h = HM[id], R = Math.hypot(x, z), d = wRc(Math.atan2(z, x)) - R;
    const gx = (HM[j * WN + Math.min(WN - 1, i + 1)] - HM[j * WN + Math.max(0, i - 1)]) / (2 * WCELL), gz = (HM[Math.min(WN - 1, j + 1) * WN + i] - HM[Math.max(0, j - 1) * WN + i]) / (2 * WCELL), sl = Math.hypot(gx, gz);
    let v = 0; const dc = Math.max(Math.abs(x), Math.abs(z));
    if (dc > CITYH + 150 && d > 330 && h > SEA + 5) { const bias = wSS(700, 1500, z) + .33 * (1 - wSS(-1700, -900, z)) + (x < -700 ? .5 : 0) + .25; v = Math.min(1, bias * (.55 + .45 * (.5 + .5 * wNz(x * .8 + 3, z * .8 - 4)))) * (1 - wSS(.5, .85, sl)) * (1 - wSS(120, 200, h)) }
    VG[id] = Math.round(Math.max(0, Math.min(1, v)) * 255)
  }
  for (const R of ROADS) for (let i = 0; i < R.pts.length - 1; i++) { const a = R.pts[i], b = R.pts[i + 1]; nodesNearSeg(a.x, a.z, b.x, b.z, 22, id => { VG[id] = 0 }) }
  for (let i = 0; i < RIV.length - 1; i++) { const a = RIV[i], b = RIV[i + 1]; nodesNearSeg(a.x, a.z, b.x, b.z, 30, id => { VG[id] = 0 }) }
  return { psi };
}
if (typeof module !== 'undefined') module.exports = { buildWorld, HM, VG, ROADS, RIV, FEATS, WN, WORG, WCELL, SEA, natH, HL, FALL, TUN, UND, LAKES };

buildWorld();
/* ===================== WORLD v3 : terrain mesh + water ===================== */
const wTerr = new THREE.Group(), wWater = new THREE.Group(), wRoad = new THREE.Group(), wMisc = new THREE.Group();
wTerr.visible = wWater.visible = wRoad.visible = wMisc.visible = false;
world.add(wTerr, wWater, wRoad, wMisc);
const CKC = 64, NCK = WN / CKC;          /* chunk = 64 cells (400 m), 16 x 16 chunks */
const inCity = (x, z) => Math.max(Math.abs(x), Math.abs(z)) < 860;
const hsAt = (i, j) => HM[Math.max(0, Math.min(WN - 1, j)) * WN + Math.max(0, Math.min(WN - 1, i))];
function vgAt(x, z) { const i = Math.round((x - WORG) / WCELL), j = Math.round((z - WORG) / WCELL); if (i < 0 || j < 0 || i >= WN || j >= WN) return 0; return VG[j * WN + i] }
/* exact height of the rendered terrain triangles (diagonal b-c) */
function WH(x, z) {
  const fx = (x - WORG) / WCELL, fz = (z - WORG) / WCELL; let i = Math.floor(fx), j = Math.floor(fz);
  if (i < 0) i = 0; else if (i > WN - 2) i = WN - 2; if (j < 0) j = 0; else if (j > WN - 2) j = WN - 2;
  const u = fx - i, v = fz - j, a = HM[j * WN + i], b = HM[j * WN + i + 1], c = HM[(j + 1) * WN + i], d = HM[(j + 1) * WN + i + 1];
  return u + v <= 1 ? a + (b - a) * u + (c - a) * v : d + (c - d) * (1 - u) + (b - d) * (1 - v)
}
const detT = mkTex(128, 128, (g, w, h) => { const id = g.createImageData(w, h); for (let i = 0; i < w * h; i++) { const v = 196 + rnd() * 59; id.data[i * 4] = id.data[i * 4 + 1] = id.data[i * 4 + 2] = v; id.data[i * 4 + 3] = 255 } g.putImageData(id, 0, 0) });
const terrM = new THREE.MeshStandardMaterial({ map: detT, vertexColors: true, roughness: 1, metalness: 0 });
const _c = new THREE.Color();
function biome(x, z, h, sl, vg, out) {
  const nz = wFb(x * .05, z * .05, 3), nz2 = wFb(x * .4, z * .4, 2);
  let r, g, b; const dc = Math.max(Math.abs(x), Math.abs(z));
  if (h < SEA && dc >= 880) { const d = Math.min(1, (SEA - h) / 30); r = .55 - .3 * d; g = .5 - .2 * d; b = .38 - .05 * d }
  else if (dc < 880) { r = .30 + .05 * nz; g = .46 + .07 * nz + .02 * nz2; b = .21 + .03 * nz }
  else if (h < SEA + 5.5 + 1.5 * nz2) { r = .86 + .04 * nz2; g = .79 + .04 * nz2; b = .56 + .05 * nz2 }
  else {
    const gr = [.33 + .06 * nz, .5 + .07 * nz, .2 + .04 * nz], fo = [.16 + .03 * nz, .3 + .05 * nz, .12 + .02 * nz], f = Math.min(1, vg / 140);
    r = gr[0] + (fo[0] - gr[0]) * f; g = gr[1] + (fo[1] - gr[1]) * f; b = gr[2] + (fo[2] - gr[2]) * f;
    const rk = Math.max(wSS(.42, .7, sl), wSS(95, 150, h + 25 * nz)); r += (.46 + .06 * nz2 - r) * rk; g += (.42 + .05 * nz2 - g) * rk; b += (.39 + .05 * nz2 - b) * rk;
    const sn = wSS(215, 245, h + 12 * nz); r += (.95 - r) * sn; g += (.96 - g) * sn; b += (.98 - b) * sn;
  }
  if (Math.abs(x) < 12.8 && z > UND.z0 - 3 && z < UND.z1 + 3) { const k = 1 - wSS(7, 12.8, Math.abs(x)); r += (.2 - r) * k; g += (.2 - g) * k; b += (.22 - b) * k }
  out[0] = r; out[1] = g; out[2] = b
}
const _col = [0, 0, 0], tChunks = [], LODN = [1, 2, 4];
function buildChunkGeo(ci, cj, step) {
  const n = CKC / step + 1, nv = n * n, ns = 4 * n, P_ = new Float32Array((nv + ns) * 3), N_ = new Float32Array((nv + ns) * 3), C_ = new Float32Array((nv + ns) * 3), U_ = new Float32Array((nv + ns) * 2), ix = [];
  let p = 0;
  for (let j = 0; j < n; j++)for (let i = 0; i < n; i++) {
    const gi = ci * CKC + i * step, gj = cj * CKC + j * step, x = WORG + gi * WCELL, z = WORG + gj * WCELL, h = hsAt(gi, gj);
    const dx = (hsAt(gi + step, gj) - hsAt(gi - step, gj)) / (2 * step * WCELL), dz = (hsAt(gi, gj + step) - hsAt(gi, gj - step)) / (2 * step * WCELL), l = Math.hypot(dx, 1, dz);
    biome(x, z, h, Math.hypot(dx, dz), VG[Math.min(WN - 1, gj) * WN + Math.min(WN - 1, gi)], _col);
    P_[p * 3] = x; P_[p * 3 + 1] = h; P_[p * 3 + 2] = z; N_[p * 3] = -dx / l; N_[p * 3 + 1] = 1 / l; N_[p * 3 + 2] = -dz / l; C_[p * 3] = _col[0]; C_[p * 3 + 1] = _col[1]; C_[p * 3 + 2] = _col[2]; U_[p * 2] = x / 7; U_[p * 2 + 1] = z / 7; p++
  }
  for (let j = 0; j < n - 1; j++)for (let i = 0; i < n - 1; i++) { const a = j * n + i, b = a + 1, c = a + n, d = c + 1; ix.push(a, c, b, b, c, d) }
  /* skirts hide LOD cracks */
  const sk = (list) => { const base = p; for (const v of list) { P_.set([P_[v * 3], P_[v * 3 + 1] - 9, P_[v * 3 + 2]], p * 3); N_.set([N_[v * 3], N_[v * 3 + 1], N_[v * 3 + 2]], p * 3); C_.set([C_[v * 3], C_[v * 3 + 1], C_[v * 3 + 2]], p * 3); U_.set([U_[v * 2], U_[v * 2 + 1]], p * 2); p++ }
    for (let k = 0; k < list.length - 1; k++) { const a = list[k], b = list[k + 1], a2 = base + k, b2 = base + k + 1; ix.push(a, b, a2, b, b2, a2, a, a2, b, b, a2, b2) } };
  const e0 = [], e1 = [], e2 = [], e3 = []; for (let i = 0; i < n; i++) { e0.push(i); e1.push((n - 1) * n + i); e2.push(i * n); e3.push(i * n + n - 1) } sk(e0); sk(e1); sk(e2); sk(e3);
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(P_.subarray(0, p * 3), 3)); g.setAttribute("normal", new THREE.BufferAttribute(N_.subarray(0, p * 3), 3)); g.setAttribute("color", new THREE.BufferAttribute(C_.subarray(0, p * 3), 3)); g.setAttribute("uv", new THREE.BufferAttribute(U_.subarray(0, p * 2), 2)); g.setIndex(ix);
  g.computeBoundingSphere(); return g
}
for (let cj = 0; cj < NCK; cj++)for (let ci = 0; ci < NCK; ci++) {
  const m = new THREE.Mesh(new THREE.BufferGeometry(), terrM); m.receiveShadow = true; m.visible = false;
  m.userData = { ci, cj, cx: WORG + (ci + .5) * CKC * WCELL, cz: WORG + (cj + .5) * CKC * WCELL, lod: -1, g: [null, null, null] }; wTerr.add(m); tChunks.push(m)
}
function terrUpdate(force) {
  const cx = C.position.x, cz = C.position.z;
  for (const m of tChunks) {
    const u = m.userData, d = Math.hypot(u.cx - cx, u.cz - cz) - 280;
    if (d > __Q.tf) { m.visible = false; continue }
    const lod = d < __Q.tl1 ? 0 : d < __Q.tl2 ? 1 : 2;
    if (lod !== u.lod || force) { if (!u.g[lod]) u.g[lod] = buildChunkGeo(u.ci, u.cj, LODN[lod]); m.geometry = u.g[lod]; u.lod = lod }
    m.visible = true
  }
}
/* ---------------- water ---------------- */
const seaM = pW.clone(); seaM.onBeforeCompile = pW.onBeforeCompile; seaM.polygonOffset = false; seaM.opacity = .92; seaM.needsUpdate = true;
const sea = new THREE.Mesh(new THREE.PlaneGeometry(16000, 16000).rotateX(-Math.PI / 2), seaM); sea.position.y = SEA + .04; sea.renderOrder = 1; sea.frustumCulled = false; wWater.add(sea);
for (const L of FEATS.lakes) { const m = new THREE.Mesh(new THREE.CircleGeometry(L.r, 56).rotateX(-Math.PI / 2), seaM); m.position.set(L.x, L.y + .05, L.z); m.renderOrder = 1; wWater.add(m) }
{ /* river ribbon */
  const p = [], uv = [], ix = []; let q = 0, s = 0;
  const seg = (i0, i1) => { if (i1 - i0 < 1) return; const base = q; for (let i = i0; i <= i1; i++) { const a = RIV[Math.max(i0, i - 1)], b = RIV[Math.min(i1, i + 1)], dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1, nx = -dz / l, nz = dx / l, c = RIV[i], hwR = 14; p.push(c.x + nx * hwR, c.y + .06, c.z + nz * hwR, c.x - nx * hwR, c.y + .06, c.z - nz * hwR); s += 6; uv.push(0, s / 12, 1, s / 12); q += 2 } for (let k = 0; k < i1 - i0; k++) { const a = base + k * 2; ix.push(a, a + 1, a + 2, a + 1, a + 3, a + 2) } };
  seg(0, RIV.fi - 1); seg(RIV.fe + 1, RIV.length - 1);
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(ix); g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0x1d6f86, roughness: .05, metalness: .08, transparent: true, opacity: .9, side: THREE.DoubleSide })); m.material.onBeforeCompile = pW.onBeforeCompile; m.renderOrder = 1; wWater.add(m)
}
{ /* waterfall */
  const f = FEATS.falls[0], a = f.a, b = f.b, W2 = 9, rows = 10, p = [], uv = [], ix = [];
  const dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1, nx = -dz / l, nz = dx / l;
  for (let r = 0; r <= rows; r++) { const t = r / rows, x = a.x + dx * t + dx / l * 1.8 * Math.sin(t * 3.14) * .5, z = a.z + dz * t + dz / l * 1.8 * Math.sin(t * 3.14) * .5, y = a.y + .1 + (b.y - .6 - a.y - .1) * Math.pow(t, 1.12); p.push(x + nx * W2, y, z + nz * W2, x - nx * W2, y, z - nz * W2); uv.push(0, t, 1, t) }
  for (let r = 0; r < rows; r++) { const k = r * 2; ix.push(k, k + 1, k + 2, k + 1, k + 3, k + 2) }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(ix);
  const fm = new THREE.ShaderMaterial({ uniforms: { uT: uT }, transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false,
    vertexShader: "varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
    fragmentShader: "varying vec2 vU;uniform float uT;float h(float x){return fract(sin(x*12.9898)*43758.5453);}void main(){float c=floor(vU.x*26.);float sp=.7+h(c)*.9;float v=fract(vU.y*2.2*sp-uT*(1.1+h(c+3.)*.9)+h(c+7.));float st=smoothstep(.0,.5,v)*(1.-smoothstep(.5,1.,v));float ed=smoothstep(0.,.12,vU.x)*smoothstep(1.,.88,vU.x);vec3 col=mix(vec3(.62,.82,.95),vec3(1.),st);float a=(.52+.4*st)*ed*(1.-.35*smoothstep(.7,1.,vU.y));gl_FragColor=vec4(col,a);}" });
  const m = new THREE.Mesh(g, fm); m.renderOrder = 3; wWater.add(m);
  /* mist + foam at the base */
  const mistT = mkTex(64, 64, g2 => { const q = g2.createRadialGradient(32, 32, 0, 32, 32, 32); q.addColorStop(0, "rgba(255,255,255,.9)"); q.addColorStop(.5, "rgba(235,245,255,.35)"); q.addColorStop(1, "rgba(235,245,255,0)"); g2.fillStyle = q; g2.fillRect(0, 0, 64, 64) });
  const MN = 90, mp = new Float32Array(MN * 3), ms = []; for (let i = 0; i < MN; i++)ms.push([rnd(), rnd() * 6.28, 3 + rnd() * 9, .25 + rnd() * .5]);
  const mg2 = new THREE.BufferGeometry(); mg2.setAttribute("position", new THREE.BufferAttribute(mp, 3).setUsage(THREE.DynamicDrawUsage));
  const mist = new THREE.Points(mg2, new THREE.PointsMaterial({ map: mistT, size: 15, transparent: true, opacity: .5, depthWrite: false, sizeAttenuation: true })); mist.frustumCulled = false; mist.renderOrder = 4; wWater.add(mist);
  const bx = b.x + dx / l * 4, bz = b.z + dz / l * 4;
  const foam = new THREE.Mesh(new THREE.CircleGeometry(15, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: mistT, transparent: true, opacity: .8, depthWrite: false })); foam.position.set(bx, b.y + .12, bz); foam.renderOrder = 2; wWater.add(foam);
  FEATS.fallsUpd = () => { for (let i = 0; i < MN; i++) { const s = ms[i], t = (s[0] + T * s[3] * .12) % 1; mp[i * 3] = bx + Math.cos(s[1] + T * .1) * s[2] * (.4 + t); mp[i * 3 + 1] = b.y + .3 + t * 14; mp[i * 3 + 2] = bz + Math.sin(s[1] + T * .1) * s[2] * (.4 + t) } mg2.attributes.position.needsUpdate = true; mist.material.opacity = .42 * (1 - .6 * NBv.value) }
}

/* ===================== WORLD v3 : roads, bridges, tunnel, underpass, summit lot ===================== */
const hwT = mkTex(256, 512, (g, w, h) => { asphalt(g, w, h, "#3a3c40"); g.fillStyle = "#e9e7df"; g.fillRect(12, 0, 5, h); g.fillRect(w - 17, 0, 5, h); g.fillStyle = "#f2c500"; for (let y = 0; y < h; y += 128) g.fillRect(w / 2 - 3, y, 6, 72) });
const roadM = new THREE.MeshStandardMaterial({ map: hwT, roughness: .85, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, side: THREE.DoubleSide });
const dirtM = new THREE.MeshStandardMaterial({ map: grT, color: 0xc7a273, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, side: THREE.DoubleSide });
const concM = new THREE.MeshStandardMaterial({ color: 0x9a9ea4, roughness: .85, side: THREE.DoubleSide });
const railT = mkTex(8, 32, (g, w, h) => { g.fillStyle = "#aeb3b9"; g.fillRect(0, 0, w, h); g.fillStyle = "#6c7178"; g.fillRect(0, 4, w, 5); g.fillRect(0, 18, w, 5); g.fillStyle = "#e8e8e8"; g.fillRect(0, 10, w, 3) });
const railM = new THREE.MeshStandardMaterial({ map: railT, roughness: .5, metalness: .5, side: THREE.DoubleSide });
function mkMesh(p, uv, ix, mat, cast, recv) { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3)); if (uv) g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(ix); g.computeVertexNormals(); const m = new THREE.Mesh(g, mat); m.castShadow = !!cast; m.receiveShadow = recv !== false; wRoad.add(m); return m }
function ribbon(pts, i0, i1, o0, o1, dy, mat, vs) {
  const p = [], uv = [], ix = []; let s = 0;
  for (let i = i0; i <= i1; i++) { const a = pts[Math.max(i0, i - 1)], b = pts[Math.min(i1, i + 1)], dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1, nx = -dz / l, nz = dx / l, c = pts[i]; p.push(c.x + nx * o0, c.y + dy, c.z + nz * o0, c.x + nx * o1, c.y + dy, c.z + nz * o1); uv.push(0, s / vs, 1, s / vs); s += 6 }
  for (let k = 0; k < i1 - i0; k++) { const a = k * 2; ix.push(a, a + 1, a + 2, a + 1, a + 3, a + 2) } return mkMesh(p, uv, ix, mat, false, true)
}
function vstrip(pts, i0, i1, off, y0, y1, mat, vs, cast) {
  const p = [], uv = [], ix = []; let s = 0;
  for (let i = i0; i <= i1; i++) { const a = pts[Math.max(i0, i - 1)], b = pts[Math.min(i1, i + 1)], dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1, nx = -dz / l, nz = dx / l, c = pts[i]; p.push(c.x + nx * off, c.y + y0, c.z + nz * off, c.x + nx * off, c.y + y1, c.z + nz * off); uv.push(s / vs, 0, s / vs, 1); s += 6 }
  for (let k = 0; k < i1 - i0; k++) { const a = k * 2; ix.push(a, a + 1, a + 2, a + 1, a + 3, a + 2) } return mkMesh(p, uv, ix, mat, cast, true)
}
function gridMesh(rows, mat, cast) { const Rn = rows.length, Cn = rows[0].length, p = [], ix = []; for (const row of rows) for (const v of row) p.push(v[0], v[1], v[2]); for (let r = 0; r < Rn - 1; r++)for (let c = 0; c < Cn - 1; c++) { const a = r * Cn + c, b = a + 1, d = a + Cn, e = d + 1; ix.push(a, b, d, b, e, d) } return mkMesh(p, null, ix, mat, cast, true) }
const runs = (pts, kind) => { const out = []; let i = 0; while (i < pts.length) { if (pts[i].k === kind) { let j = i; while (j < pts.length && pts[j].k === kind) j++; out.push([i, j - 1]); i = j } else i++ } return out };
const LAMPS = [];
/* guard flags (used by physics) */
{ const E = ROADS[1]; let st = -1; E.pts.forEach((p, i) => { if (st < 0 && Math.hypot(p.x - HL.x, p.z - HL.z) < 480) st = i }); E.pts.forEach((p, i) => { if (st >= 0 && i >= st - 2) p.g = 1 }); }
for (const R of ROADS) {
  const pts = R.pts, n = pts.length, hw = R.hw, mat = R.t == "d" ? dirtM : roadM, vs = R.t == "d" ? 8 : 32;
  ribbon(pts, 0, n - 1, -hw, hw, .07, mat, vs);
  if (R.t != "d") { ribbon(pts, 0, n - 1, hw, hw + 1.6, .02, dirtM, 8); ribbon(pts, 0, n - 1, -hw - 1.6, -hw, .02, dirtM, 8) }
  for (const [a, b] of runs(pts, "B")) {
    const i0 = Math.max(0, a - 1), i1 = Math.min(n - 1, b + 1);
    for (const s of [-1, 1]) { vstrip(pts, i0, i1, s * (hw + .4), -1.5, .05, concM, 6, true); vstrip(pts, i0, i1, s * (hw + .3), .05, 1.15, railM, 3, true) }
    ribbon(pts, i0, i1, -hw - .4, hw + .4, -1.5, concM, 6); for (let i = i0; i <= i1; i++)pts[i].g = 1;
    for (let i = i0 + 1; i < i1; i += 5) for (const s of [-1, 1]) { const c = pts[i], q = pts[Math.min(n - 1, i + 1)], dx = q.x - c.x, dz = q.z - c.z, l = Math.hypot(dx, dz) || 1, x = c.x - dz / l * s * 5.5, z = c.z + dx / l * s * 5.5, gy = WH(x, z), top = c.y - 1.5, h = top - gy; if (h > 1.5) { const pr = new THREE.Mesh(new THREE.BoxGeometry(3.2, h, 3.2), concM); pr.position.set(x, gy + h / 2, z); pr.rotation.y = Math.atan2(dx, dz); pr.castShadow = pr.receiveShadow = true; wRoad.add(pr) } }
  }
  for (const [a, b] of runs(pts, "T")) {
    const rows = [], Wi = 13.2, He = 9, NS = 16; for (let i = a; i <= b; i++) { const c = pts[i], q = pts[Math.min(n - 1, i + 1)], r0 = pts[Math.max(0, i - 1)], dx = q.x - r0.x, dz = q.z - r0.z, l = Math.hypot(dx, dz) || 1, nx = -dz / l, nz = dx / l, row = []; for (let t = 0; t <= NS; t++) { const th = Math.PI * t / NS, ox = Wi * Math.cos(th); row.push([c.x + nx * ox, c.y + .1 + He * Math.sin(th), c.z + nz * ox]) } rows.push(row); c.g = 1 }
    gridMesh(rows, new THREE.MeshStandardMaterial({ color: 0x70757c, roughness: .9, side: THREE.DoubleSide }), false);
    ribbon(pts, a, b, -Wi - .3, Wi + .3, .0, concM, 8);
    const lm = new THREE.InstancedMesh(new THREE.BoxGeometry(.5, .14, 2.6), new THREE.MeshBasicMaterial({ color: 0xfff1c4 }), 400), d = new THREE.Object3D(); let cn = 0;
    for (let i = a + 1; i < b && cn < 396; i += 2) for (const o of [-4.2, 4.2]) { const c = pts[i], q = pts[i + 1], dx = q.x - c.x, dz = q.z - c.z, l = Math.hypot(dx, dz) || 1, nx = -dz / l, nz = dx / l, ox = o, th = Math.acos(Math.max(-1, Math.min(1, ox / Wi))); d.position.set(c.x + nx * ox, c.y + .1 + He * Math.sin(th) - .12, c.z + nz * ox); d.rotation.set(0, Math.atan2(dx, dz), 0); d.updateMatrix(); lm.setMatrixAt(cn++, d.matrix) } lm.count = cn; wRoad.add(lm);
    for (const e of [a, b]) { const c = pts[e], q = pts[Math.min(n - 1, e + 1)], r0 = pts[Math.max(0, e - 1)], dx = q.x - r0.x, dz = q.z - r0.z, l = Math.hypot(dx, dz) || 1, nx = -dz / l, nz = dx / l, rr = [];
      for (let k = 0; k < 2; k++) { const row = [], w2 = Wi + (k ? 2.2 : 0), h2 = He + (k ? 2.2 : 0), f = (e == a ? -1 : 1) * (k ? 0 : 0); for (let t = 0; t <= NS; t++) { const th = Math.PI * t / NS; row.push([c.x + nx * w2 * Math.cos(th) + dx / l * f, c.y + .1 + h2 * Math.sin(th), c.z + nz * w2 * Math.cos(th) + dz / l * f]) } rr.push(row) } gridMesh(rr, concM, true) }
  }
  /* street lamps */
  if (R.t != "d") for (let i = 4; i < n - 4; i += 10) { const c = pts[i]; if (c.k === "T") continue; const q = pts[i + 1], dx = q.x - c.x, dz = q.z - c.z, l = Math.hypot(dx, dz) || 1, nx = -dz / l, nz = dx / l, s = (i / 10 | 0) % 2 ? 1 : -1, off = s * (hw + 1.6); LAMPS.push([c.x + nx * off, c.y, c.z + nz * off, Math.atan2(nz * s, -nx * s)]) }
}
/* ---- underpass: road surface in the trench + deck underside + lights ---- */
{
  const up = []; for (let z = UND.z0 - 6; z <= UND.z1 + 6; z += 6)up.push({ x: 0, z, y: WH(0, z) });
  ribbon(up, 0, up.length - 1, -6.1, 6.1, .06, roadM, 32);
  const zc = (UND.zf0 + UND.zf1) / 2, slab = new THREE.Mesh(new THREE.BoxGeometry(25, 1.4, UND.zf1 - UND.zf0), concM); slab.position.set(0, -.76, zc); slab.castShadow = slab.receiveShadow = true; wRoad.add(slab);
  for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(.6, UND.depth, UND.zf1 - UND.zf0 + 2), concM); w.position.set(s * 6.6, -UND.depth / 2 - .1, zc); wRoad.add(w) }
  const lm = new THREE.InstancedMesh(new THREE.BoxGeometry(.6, .12, 3), new THREE.MeshBasicMaterial({ color: 0xfff1c4 }), 60), d = new THREE.Object3D(); let cn = 0;
  for (let z = UND.zf0 + 5; z < UND.zf1; z += 10) for (const x of [-3.4, 3.4]) { d.position.set(x, -1.58, z); d.updateMatrix(); lm.setMatrixAt(cn++, d.matrix) } lm.count = cn; wRoad.add(lm);
}
/* ---- summit lot: paving, lighthouse pad, parapet, bays, lamps ---- */
const SEAANG = Math.atan2(hlSea[1], hlSea[0]), LOT_SPOTS = [], LH = { x: HL.x, z: HL.z, y: HL.h };
for (let k = 0; k < 18; k++) { const a = SEAANG + (k - 8.5) * .165, r = 40, dx = Math.cos(a), dz = Math.sin(a); LOT_SPOTS.push({ x: HL.x + dx * r, z: HL.z + dz * r, h: Math.atan2(dx, dz), a }) }
{
  const lotT = mkTex(256, 256, (g, w, h) => asphalt(g, w, h, "#43464b")); lotT.repeat.set(12, 12);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(68, 72).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: lotT, roughness: .85, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })); disc.position.set(HL.x, HL.h + .05, HL.z); disc.receiveShadow = true; wMisc.add(disc);
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(10.5, 11.5, .9, 48), new THREE.MeshStandardMaterial({ color: 0x9d9a90, roughness: .9 })); pad.position.set(HL.x, HL.h + .45, HL.z); pad.castShadow = pad.receiveShadow = true; wMisc.add(pad);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(10.8, .22, 8, 64).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: .8, roughness: .3, emissive: 0x3a2c05 })); ring.position.set(HL.x, HL.h + .95, HL.z); wMisc.add(ring);
  const lhSlot = new THREE.Group(); lhSlot.position.set(HL.x, HL.h + .9, HL.z); wMisc.add(lhSlot);
  window.setLighthouse = (obj, scale) => { lhSlot.clear(); if (obj) { if (scale) obj.scale.multiplyScalar(scale); lhSlot.add(obj) } return lhSlot };
  window.LIGHTHOUSE_SLOT = lhSlot;
  /* parapet around the viewpoint (gap where the road arrives) */
  const psi = Math.atan2(HL.z - ROADS[1].pts[ROADS[1].pts.length - 1].z, HL.x - ROADS[1].pts[ROADS[1].pts.length - 1].x) + Math.PI, wp = [], g0 = .5;
  for (let k = 0; k <= 90; k++) { const a = psi + g0 + (Math.PI * 2 - 2 * g0) * k / 90; wp.push({ x: HL.x + Math.cos(a) * 86, z: HL.z + Math.sin(a) * 86, y: HL.h }) }
  vstrip(wp, 0, wp.length - 1, 0, 0, 1.1, new THREE.MeshStandardMaterial({ color: 0x8f8d86, roughness: .95, side: THREE.DoubleSide }), 4, true); vstrip(wp, 0, wp.length - 1, 0, 1.1, 1.1, railM, 3);
  LH.psi = psi;
  /* bay lines */
  const bl = new THREE.InstancedMesh(new THREE.BoxGeometry(.14, .02, 7), new THREE.MeshBasicMaterial({ color: 0xf0f0e8 }), 19), d = new THREE.Object3D();
  for (let k = 0; k < 19; k++) { const a = SEAANG + (k - 9) * .165; d.position.set(HL.x + Math.cos(a) * 40, HL.h + .09, HL.z + Math.sin(a) * 40); d.rotation.set(0, Math.atan2(Math.cos(a), Math.sin(a)), 0); d.updateMatrix(); bl.setMatrixAt(k, d.matrix) } wMisc.add(bl);
  for (let k = 0; k < 16; k++) { const a = psi + k / 16 * Math.PI * 2; if (Math.abs(((a - psi + Math.PI) % (Math.PI * 2)) - Math.PI) < .3 && k == 0) continue; LAMPS.push([HL.x + Math.cos(a) * 60, HL.h, HL.z + Math.sin(a) * 60, Math.PI - a]) }
  for (let k = 0; k < 8; k++) { const a = SEAANG + (k + .5) / 8 * Math.PI * 2; LAMPS.push([HL.x + Math.cos(a) * 24, HL.h, HL.z + Math.sin(a) * 24, Math.PI - a]) }
}
/* ---- lamp instances (heads share the game's night-emissive LAMPM) ---- */
{
  const n = LAMPS.length, poleG = mergeG([new THREE.CylinderGeometry(.1, .15, 9, 6).translate(0, 4.5, 0), new THREE.BoxGeometry(3, .15, .15).translate(1.5, 9, 0)]), headG = new THREE.BoxGeometry(.9, .18, .4).translate(3, 8.9, 0);
  const pm = new THREE.InstancedMesh(poleG, new THREE.MeshStandardMaterial({ color: 0x7a8087, roughness: .6, metalness: .5 }), n), hm = new THREE.InstancedMesh(headG, LAMPM, n), d = new THREE.Object3D(), gp = new Float32Array(n * 3);
  LAMPS.forEach((L, i) => { d.position.set(L[0], L[1], L[2]); d.rotation.set(0, L[3], 0); d.updateMatrix(); pm.setMatrixAt(i, d.matrix); hm.setMatrixAt(i, d.matrix); gp[i * 3] = L[0] + Math.cos(L[3]) * 3; gp[i * 3 + 1] = L[1] + 8.8; gp[i * 3 + 2] = L[2] - Math.sin(L[3]) * 3 });
  pm.castShadow = true; pm.frustumCulled = hm.frustumCulled = false; wMisc.add(pm, hm);
  const gg = new THREE.BufferGeometry(); gg.setAttribute("position", new THREE.BufferAttribute(gp, 3)); const gl = new THREE.Points(gg, new THREE.PointsMaterial({ map: mkTex(64, 64, g => { const q = g.createRadialGradient(32, 32, 0, 32, 32, 32); q.addColorStop(0, "rgba(255,225,160,1)"); q.addColorStop(.3, "rgba(255,200,120,.45)"); q.addColorStop(1, "rgba(255,200,120,0)"); g.fillStyle = q; g.fillRect(0, 0, 64, 64) }), size: 11, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, fog: false })); gl.frustumCulled = false; gl.renderOrder = 5; wMisc.add(gl); window.__lampGlow = gl
}
/* ---- city road planes: clip to the city and open the underpass trench ---- */
[rmA, rmB].forEach(m => {
  m.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vWr;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvWr=(modelMatrix*vec4(transformed,1.)).xyz;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vWr;").replace("#include <map_fragment>", "if(max(abs(vWr.x),abs(vWr.z))>830.)discard;if(abs(vWr.x)<14.&&((vWr.z>-560.&&vWr.z<-470.)||(vWr.z>-370.&&vWr.z<-280.)))discard;\n#include <map_fragment>")
  }; m.needsUpdate = true
});

/* ===================== WORLD v3 : physics hooks ===================== */
const HC = 24, hkey = (i, j) => (i + 300) * 700 + (j + 300), RH = new Map(), WHASH = new Map();
function hput(M, x, z, v) { const k = hkey(Math.floor(x / HC), Math.floor(z / HC)); let a = M.get(k); if (!a) M.set(k, a = []); a.push(v) }
ROADS.forEach((R, ri) => R.pts.forEach((p, i) => { if (i < R.pts.length - 1) hput(RH, p.x, p.z, [ri, i]) }));
RIV.forEach((p, i) => { if (i < RIV.length - 1) hput(WHASH, p.x, p.z, i) });
const NR = { d: 1e9, ri: -1, i: 0, t: 0, y: 0, off: 0, nx: 0, nz: 0, tx: 0, tz: 0, hw: 0, k: 0, g: 0 };
function nearRoad(x, z, maxd) {
  const ci = Math.floor(x / HC), cj = Math.floor(z / HC); let best = maxd * maxd, f = false;
  for (let a = -1; a <= 1; a++)for (let b = -1; b <= 1; b++) { const L = RH.get(hkey(ci + a, cj + b)); if (!L) continue; for (const [ri, i] of L) {
    const R = ROADS[ri], p0 = R.pts[i], p1 = R.pts[i + 1], dx = p1.x - p0.x, dz = p1.z - p0.z, l2 = dx * dx + dz * dz || 1; let t = ((x - p0.x) * dx + (z - p0.z) * dz) / l2; t = t < 0 ? 0 : t > 1 ? 1 : t;
    const px = p0.x + dx * t, pz = p0.z + dz * t, d2 = (x - px) * (x - px) + (z - pz) * (z - pz); if (d2 < best) { best = d2; f = true; const l = Math.sqrt(l2); NR.ri = ri; NR.i = i; NR.t = t; NR.y = p0.y + (p1.y - p0.y) * t; NR.tx = dx / l; NR.tz = dz / l; NR.nx = -dz / l; NR.nz = dx / l; NR.off = (x - px) * NR.nx + (z - pz) * NR.nz; NR.hw = R.hw; NR.k = p0.k; NR.g = p0.g | p1.g; NR.d = Math.sqrt(d2) } } }
  return f ? NR : null
}
function inWater(x, z) {
  const h = WH(x, z); if (h < SEA + .1 && !inCity(x, z)) return 1;
  for (const L of FEATS.lakes) if (Math.hypot(x - L.x, z - L.z) < L.r && h < L.y + .1) return 1;
  const ci = Math.floor(x / HC), cj = Math.floor(z / HC); for (let a = -1; a <= 1; a++)for (let b = -1; b <= 1; b++) { const L = WHASH.get(hkey(ci + a, cj + b)); if (!L) continue; for (const i of L) { const p = RIV[i]; if (i >= RIV.fi && i <= RIV.fe) continue; if (Math.hypot(x - p.x, z - p.z) < 12 && h < p.y + .12) return 1 } }
  return 0
}
/* ground height incl. decks / tunnel floors; hint = height the car is currently at */
function GH(x, z, hint) {
  const base = WH(x, z);
  if (Math.abs(x) < 11.8 && z > UND.zf0 && z < UND.zf1 && hint > -3.5) return 0;
  const r = nearRoad(x, z, 15); if (r) {
    if (r.k === "B" && Math.abs(r.off) < r.hw + .4 && hint > r.y - 3.2) return r.y + .02;
    if (r.k === "T" && Math.abs(r.off) < 12.5 && Math.abs(hint - r.y) < 6) return r.y + .02;
  }
  return base
}
window.WH = WH; window.TrY = function (x, z) { return mode == "open" ? WH(x, z) : 0 }; window.TrM = WH;
/* ---- surface type ---- */
window.surfF = function () {
  const o = { g: 1, r: 0, w: 0 }; if (mode != "open") return o;
  if (inWater(P.x, P.z) && !(P.hz !== undefined && P.hz - WH(P.x, P.z) > 1.6)) { o.g = .45; o.w = 1; return o }
  if (inCity(P.x, P.z)) { if (rd(P.x) > 14 && rd(P.z) > 14 && !inFil(P.x, P.z)) { o.g = .8; o.r = .7 } return o }
  const r = nearRoad(P.x, P.z, 14); if (r && Math.abs(r.off) < r.hw + 1.2) { if (ROADS[r.ri].t == "d") { o.g = .88; o.r = .25 } return o }
  const h = WH(P.x, P.z); if (h < SEA + 6) { o.g = .72; o.r = 1.4; return o }
  if (h > 130) { o.g = .85; o.r = .9; return o }
  o.g = .8; o.r = .6 + .5 * Math.min(1, vgAt(P.x, P.z) / 160); return o
};
/* ---- elevation / slope / air (generalised 'nature' branch) ---- */
const _ELUP = window.ELUP;
window.ELUP = function (dt) {
  if (mode != "open") return _ELUP(dt);
  const x = P.x, z = P.z, hint = P.hz === undefined ? (() => { const r = nearRoad(P.x, P.z, 14); return r && Math.abs(r.off) < r.hw + 2 ? r.y : WH(P.x, P.z) })() : P.hz, gx = (GH(x + 1.5, z, hint) - GH(x - 1.5, z, hint)) / 3, gz = (GH(x, z + 1.5, hint) - GH(x, z - 1.5, hint)) / 3, sh = Math.sin(P.h), ch = Math.cos(P.h), q = Math.min(1, dt * 22); P.gx = gx; P.gz = gz;
  const hw = (a, b) => GH(x + sh * a + ch * b, z + ch * a - sh * b, hint), hFL = hw(1.7, -.85), hFR = hw(1.7, .85), hRL = hw(-1.7, -.85), hRR = hw(-1.7, .85), gnd = (hFL + hFR + hRL + hRR) / 4, tp = -Math.atan(((hFL + hFR) - (hRL + hRR)) / 6.8), tr = Math.atan(((hFR + hRR) - (hFL + hRL)) / 3.4);
  if (P.hz === undefined) { P.hz = gnd; P.bh = gnd; P.bv = 0; P.gpv = gnd; P.air = 0 }
  const vg = Math.max(-20, Math.min(20, (gnd - P.gpv) / Math.max(dt, 1e-3))); P.gpv = gnd;
  { const vv = Math.hypot(P.vx, P.vz); P.bv -= (9.81 + .0045 * vv * vv) * dt } P.bh += P.bv * dt;
  if (P.air) { if (P.bh <= gnd) { P.air = 0; P.pv = (P.pv || 0) + P.bv * .02; P.bh = gnd; P.bv = vg } }
  else if (P.bh <= gnd) { P.bh = gnd; P.bv = vg }
  else if (P.bh > gnd + .1 && Math.hypot(P.vx, P.vz) > 6) P.air = 1;
  P.hz = P.air ? P.bh : gnd;
  P.ey = P.hz + (P.air ? 0 : Math.abs(tp - P.sp) * 2.2 + Math.abs(tr - P.sr) + .02); const qa = P.air ? q * .3 : q; P.sp += (tp - P.sp) * qa; P.sr += (tr - P.sr) * qa
};
/* ---- guard rails (bridges, tunnel, summit road), summit parapet, lighthouse pad, sea edge ---- */
function bump(nx, nz, cx, cz, e) { hitP(nx, nz, cx, cz, 1e9, 0, 0, e || .2) }
function guardStep(dt) {
  if (mode != "open") return;
  const ch = Math.sin(P.h), cs = Math.cos(P.h), r = nearRoad(P.x, P.z, 26);
  if (r && r.g && Math.abs(P.hz - r.y) < 4.5) {
    const LIM = r.k === "T" ? 12.4 : r.hw + .45; let mx = 0, wx = P.x, wz = P.z;
    for (const sl of [-1, 1]) for (const sw of [-1, 1]) { const px = P.x + ch * sl * CHL + cs * sw * CHW, pz = P.z + cs * sl * CHL - ch * sw * CHW, q = Math.abs((px - (P.x - r.nx * r.off)) * r.nx + (pz - (P.z - r.nz * r.off)) * r.nz); if (q > mx) { mx = q; wx = px; wz = pz } }
    if (mx > LIM) { const sg = r.off >= 0 ? 1 : -1, nx = -sg * r.nx, nz = -sg * r.nz, pen = mx - LIM; P.x += nx * pen; P.z += nz * pen; bump(nx, nz, wx + nx * pen, wz + nz * pen, .2) }
  }
  const dx = P.x - HL.x, dz = P.z - HL.z, rr = Math.hypot(dx, dz);
  if (rr < 300 && Math.abs(P.hz - HL.h) < 6) {
    if (rr < 13.2) { const nx = dx / (rr || 1), nz = dz / (rr || 1); if (rr < 13.2) { P.x += nx * (13.2 - rr); P.z += nz * (13.2 - rr); bump(nx, nz, P.x - nx * 1.4, P.z - nz * 1.4, .15) } }
    else if (rr > 84.6 && rr < 90) { let da = Math.atan2(dz, dx) - LH.psi; da = Math.atan2(Math.sin(da), Math.cos(da)); if (Math.abs(da) > .5) { const nx = -dx / rr, nz = -dz / rr, pen = rr - 84.6; P.x += nx * pen; P.z += nz * pen; bump(nx, nz, P.x - nx * 1.2, P.z - nz * 1.2, .2) } }
  }
  const h = inCity(P.x, P.z) ? 0 : WH(P.x, P.z); if (h < SEA - 2.5) { const rr2 = Math.hypot(P.x, P.z) || 1, k = Math.exp(-3 * dt); P.vx = P.vx * k - P.x / rr2 * 9 * dt; P.vz = P.vz * k - P.z / rr2 * 9 * dt }
  if (h < SEA - 14) { const rr2 = Math.hypot(P.x, P.z) || 1; P.x -= P.x / rr2 * 40 * dt; P.z -= P.z / rr2 * 40 * dt }
}
const _statics = window.statics; window.statics = function (dt) { guardStep(dt); return _statics(dt) };

/* ===================== WORLD v3 : objects, spawn/teleport, minimap, parked cars, hooks ===================== */
/* ---- trees / buildings (city inside the square, forest from the vegetation mask outside) ---- */
window.cellObj = function (ix, iz) {
  const key = ix + "," + iz; if (memo.has(key)) return memo.get(key); let o = null;
  if (mode == "open") {
    const x = ix * CS + hs(ix, iz, 2) * CS * .9, z = iz * CS + hs(ix, iz, 3) * CS * .9, dc = Math.max(Math.abs(x), Math.abs(z));
    if (dc < 860) {
      const zn = hs(Math.floor(ix / 12), Math.floor(iz / 12), 11), h = hs(ix, iz, 1), pT = zn < .4 ? .8 : zn > .82 ? .22 : .3, pB = zn > .82 ? .4 : zn < .4 ? 0 : .03;
      if (h < pT + pB) {
        const t = h < pT ? 0 : 1, s = .7 + hs(ix, iz, 4) * .8;
        if (rd(x) > (t ? 32 : 14) && rd(z) > (t ? 32 : 14) && !(rd(x) < 40 && rd(z) < 40) && (!t || dc < 800)) {
          o = { x, z, t, s, r: t ? 0 : .9 * s, k: hs(ix, iz, 12) > .5 ? 1 : 0, c: hs(ix, iz, 13), ry: hs(ix, iz, 8) * 6.28 };
          if (t) { o.sx = 10 + hs(ix, iz, 5) * 14; o.sz = 10 + hs(ix, iz, 6) * 14; o.sy = 9 + hs(ix, iz, 7) * (zn > .82 ? 60 : 25); o.r = Math.hypot(o.sx, o.sz) * .4 }
        }
      }
    } else {
      const vg = vgAt(x, z) / 255;
      if (vg > .05 && hs(ix, iz, 1) < vg * .92) { const s = 1 + hs(ix, iz, 4) * 1.1; o = { x, z, t: 0, s, r: .9 * s, k: hs(ix, iz, 12) > .5 ? 1 : 0, c: hs(ix, iz, 13), ry: hs(ix, iz, 8) * 6.28 } }
    }
  }
  memo.set(key, o); return o
};
/* ---- tufts, flowers, fireflies around the car (reuses the nature meshes) ---- */
const HU = [0, .08, .13, .78, .92, .58]; let vfx = 1e9, vfz = 1e9;
function vegUpdate(dt, force) {
  const fx = Math.round(P.x / 6), fz = Math.round(P.z / 6);
  if (force || fx != vfx || fz != vfz) {
    vfx = fx; vfz = fz; let a = 0, b = 0;
    for (let i = -__Q.vr; i <= __Q.vr; i++)for (let j = -__Q.vr; j <= __Q.vr; j++) {
      const ci = fx + i, cj = fz + j, h = hs(ci, cj, 41); if (h > __Q.vd) continue; const x = ci * 6 + hs(ci, cj, 42) * 6, z = cj * 6 + hs(ci, cj, 43) * 6, gh = WH(x, z);
      if (gh < SEA + 3 || gh > 150) continue; const cit = inCity(x, z); if (cit && (rd(x) < 17 || rd(z) < 17)) continue;
      if (!cit) { const r = nearRoad(x, z, 12); if (r && Math.abs(r.off) < r.hw + 2.5) continue; if (inWater(x, z)) continue }
      dm.position.set(x, gh, z); dm.rotation.set(0, hs(ci, cj, 44) * 6.28, 0);
      if (h < .2 && a < FLN) { dm.scale.setScalar(.6 + hs(ci, cj, 45) * .7); dm.updateMatrix(); flw.setMatrixAt(a, dm.matrix); col.setHSL(HU[Math.floor(hs(ci, cj, 46) * 6)], .8, .6); flw.setColorAt(a++, col) }
      else if (h >= .2 && b < FLN) { dm.scale.set(.8 + hs(ci, cj, 47), .7 + hs(ci, cj, 45) * .9, .8 + hs(ci, cj, 47)); dm.updateMatrix(); tuft.setMatrixAt(b, dm.matrix); col.setHSL(.2 + hs(ci, cj, 48) * .1, .5, .26 + hs(ci, cj, 49) * .1); tuft.setColorAt(b++, col) }
    }
    flw.count = a; tuft.count = b; [flw, tuft].forEach(m => { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true })
  }
  const night = NBv.value > .25; ffPts.visible = night;
  if (night && dt > 0) { for (let i = 0; i < FF; i++) { const b = ffB[i], x = P.x + ((b[0] - P.x) % 90 + 90) % 90 - 45 + Math.sin(T * .6 + b[2]) * 1.5, z = P.z + ((b[1] - P.z) % 90 + 90) % 90 - 45 + Math.cos(T * .5 + b[2]) * 1.5; ffP[i * 3] = x; ffP[i * 3 + 1] = WH(x, z) + 1 + 1.6 * (.5 + .5 * Math.sin(T * b[3] + b[2])); ffP[i * 3 + 2] = z } ffG.attributes.position.needsUpdate = true }
}
/* ---- spawn / teleport ---- */
function roadPt(ri, f) { const R = ROADS[ri], i = Math.max(1, Math.min(R.pts.length - 2, Math.round(R.pts.length * f))), a = R.pts[i], b = R.pts[i + 1]; return [a.x, a.z, Math.atan2(b.x - a.x, b.z - a.z)] }
function dryNear(x, z) { for (let r = 0; r < 160; r += 8)for (let k = 0; k < 12; k++) { const a = k * .5236, px = x + Math.cos(a) * r, pz = z + Math.sin(a) * r; if (!inWater(px, pz) && WH(px, pz) > SEA + 2) return [px, pz] } return [x, z] }
const TPS = [
  ["City", () => [0, 0, Math.PI]],
  ["Forest", () => roadPt(2, .42)],
  ["Beach", () => roadPt(3, .9)],
  ["Summit", () => [HL.x + Math.cos(LH.psi) * 56, HL.z + Math.sin(LH.psi) * 56, Math.atan2(-Math.cos(LH.psi), -Math.sin(LH.psi))]],
  ["Waterfall", () => { const b = FEATS.falls[0].b, [x, z] = dryNear(b.x + 70, b.z + 55); return [x, z, Math.atan2(b.x - x, b.z - z)] }],
  ["Tunnel", () => roadPt(0, .6)]
];
let tpI = 0;
function teleport(i) {
  if (mode != "open" || !ready) return; tpI = ((i % TPS.length) + TPS.length) % TPS.length; const [x, z, h] = TPS[tpI][1]();
  P.x = x; P.z = z; P.h = h; P.vx = P.vz = P.sm = P.pit = P.roll = P.yv = P.dr = P.dd = P.hold = 0; P.hz = undefined; P.air = 0; P.gn = 1;
  C.position.set(x, WH(x, z) + 5, z); memo.clear(); lcx = 1e9; scatter(true); vegUpdate(0, true); terrUpdate(true); camReset();
  const m = $("msg"); m.textContent = "📍 " + TPS[tpI][0]; setTimeout(() => { if (m.textContent.indexOf("📍") == 0) m.textContent = "" }, 1600)
}
window.teleportTo = teleport;
const _go = window.go;
window.go = function (m) {
  const nat = m == "nature", mm = nat ? "open" : m; _go(mm); const op_ = mm == "open";
  wTerr.visible = wWater.visible = wRoad.visible = wMisc.visible = op_; natG.visible = op_; mount.visible = !op_; trl.visible = false; terr.visible = false;
  if (op_) {
    $("map").style.display = ""; $("hint").textContent = "W/↑ gas · S/↓ brake · A/D steer · E/Q gear · Space handbrake · F driver view · 1-6 or 📍 teleport (City/Forest/Beach/Summit/Waterfall/Tunnel) · T day/night · Esc menu";
    vfx = vfz = 1e9; teleport(nat ? 1 : 0)
  }
};
/* ---- UI: menu text + teleport button ---- */
{
  const mo = document.querySelector('.m[data-m="open"]'), mn = document.querySelector('.m[data-m="nature"]');
  if (mo) mo.innerHTML = '🌍 Open world<small>One island: city, forest, mountains, beach, river &amp; waterfall, bridges, tunnel, underpass &amp; a summit viewpoint with all your cars</small>';
  if (mn) mn.innerHTML = '🌿 Nature spawn<small>Same world — start in the forest, drive on to the city</small>';
  const b = document.createElement("button"); b.id = "btp"; b.innerHTML = '📍<span class="tx"> Teleport</span>'; b.onclick = () => teleport(tpI + 1); b.style.display = "none"; $("top").append(b); window.__btp = b;
  addEventListener("keydown", e => { if (mode == "open" && !menuOn && /^Digit[1-6]$/.test(e.code)) teleport(+e.code.slice(5) - 1) })
}
/* ---- minimap ---- */
const MAPW = 6400, mapW = document.createElement("canvas"); mapW.width = mapW.height = 150;
{
  const g = mapW.getContext("2d"), im = g.createImageData(150, 150);
  for (let j = 0; j < 150; j++)for (let i = 0; i < 150; i++) { const x = WORG + (i + .5) * MAPW / 150, z = WORG + (j + .5) * MAPW / 150, h = WH(x, z), o = (j * 150 + i) * 4; let r, gg, b; if (h < SEA) { r = 30; gg = 80; b = 130 } else if (h < SEA + 6) { r = 215; gg = 200; b = 140 } else if (h < 120) { const v = Math.min(1, vgAt(x, z) / 160); r = 120 - 70 * v; gg = 165 - 50 * v; b = 90 - 40 * v; if (inCity(x, z)) { r = 150; gg = 150; b = 150 } } else if (h < 230) { r = 140; gg = 130; b = 120 } else { r = 240; gg = 240; b = 245 } im.data[o] = r; im.data[o + 1] = gg; im.data[o + 2] = b; im.data[o + 3] = 255 }
  g.putImageData(im, 0, 0); const mp = (x, z) => [(x - WORG) / MAPW * 150, (z - WORG) / MAPW * 150];
  g.lineWidth = 1.3; for (const R of ROADS) { g.strokeStyle = R.t == "d" ? "#b98a52" : "#ffffff"; g.beginPath(); R.pts.forEach((p, i) => { if (i % 3 && i < R.pts.length - 1) return; const [x, y] = mp(p.x, p.z); i ? g.lineTo(x, y) : g.moveTo(x, y) }); g.stroke() }
  g.strokeStyle = "#3ba0ff"; g.beginPath(); RIV.forEach((p, i) => { const [x, y] = mp(p.x, p.z); i ? g.lineTo(x, y) : g.moveTo(x, y) }); g.stroke();
  const [hx, hy] = mp(HL.x, HL.z); g.fillStyle = "#ffcc00"; g.beginPath(); g.arc(hx, hy, 3, 0, 6.3); g.fill()
}
function mapDraw() {
  mg.clearRect(0, 0, 150, 150); mg.drawImage(mapW, 0, 0); const x = (P.x - WORG) / MAPW * 150, y = (P.z - WORG) / MAPW * 150;
  mg.fillStyle = "#ff2a1f"; mg.beginPath(); mg.arc(x, y, 4, 0, 6.3); mg.fill(); mg.strokeStyle = "#fff"; mg.lineWidth = 1.5; mg.beginPath(); mg.moveTo(x, y); mg.lineTo(x + Math.sin(P.h) * 9, y + Math.cos(P.h) * 9); mg.stroke()
}
/* ---- parked cars on the summit ---- */
let parked = null;
function buildParked() {
  parked = new THREE.Group(); const ids = Object.keys(CARS);
  ids.forEach((id, k) => { const s = LOT_SPOTS[k % LOT_SPOTS.length], c = CARS[id].c.clone(true); c.visible = true; c.traverse(o => { o.visible = o.visible !== false ? true : false; if (o.isMesh) { o.castShadow = true } }); c.position.set(s.x, HL.h + .06, s.z); c.rotation.order = "YXZ"; c.rotation.set(0, s.h, 0); parked.add(c) });
  /* parts hidden in the originals (flames, unused variants) stay hidden: re-apply from the source tree */
  ids.forEach((id, k) => { const src = [], dst = []; CARS[id].c.traverse(o => src.push(o)); parked.children[k].traverse(o => dst.push(o)); for (let i = 0; i < src.length && i < dst.length; i++)dst[i].visible = src[i].visible; parked.children[k].visible = true });
  parked.visible = false; wMisc.add(parked)
}
/* ---- per-frame hook (called from ENVFX while in the open world) ---- */
window.__wUpd = function (dt) {
  terrUpdate(false); sea.position.set(Math.round(C.position.x / 400) * 400, SEA + .04, Math.round(C.position.z / 400) * 400);
  if (FEATS.fallsUpd) FEATS.fallsUpd(); if (window.__lampGlow) window.__lampGlow.material.opacity = NBv.value * .95;
  vegUpdate(dt, false); if (window.__btp) window.__btp.style.display = "";
  if (!parked && ready && CARS && Object.keys(CARS).length) { try { buildParked() } catch (e) { __showErr(e) } }
  if (parked) parked.visible = Math.hypot(P.x - HL.x, P.z - HL.z) < 700;
  mapDraw()
};
window.__camMin = function (x, z) {
  if (mode != "open") return .4;
  if (P.hz !== undefined) { const r = nearRoad(x, z, 16); if (r && r.k === "T" && Math.abs(r.off) < 13 && Math.abs(P.hz - r.y) < 6) return r.y + .5; if (Math.abs(x) < 13 && z > UND.z0 && z < UND.z1 && P.hz < -2) return -6.4 }
  return Math.max(.4, WH(x, z) + .7)
};
/* ---- keep street furniture / junction boards inside the city ---- */
function compactInst(M, keep) { const a = M.instanceMatrix.array; let n = 0; for (let i = 0; i < M.count; i++) { if (keep(a[i * 16 + 12], a[i * 16 + 14])) { if (n != i) for (let k = 0; k < 16; k++)a[n * 16 + k] = a[i * 16 + k]; n++ } } M.count = n; M.instanceMatrix.needsUpdate = true }
const keepC = (x, z) => Math.max(Math.abs(x), Math.abs(z)) <= 816 && !(Math.abs(x) < 20 && z > -575 && z < -265);
const _opPosts = window.opPosts;
window.opPosts = function () { const k0 = opk; _opPosts(); if (opk !== k0) { compactInst(op, keepC); compactInst(lp, keepC); compactInst(flI, keepC); compactInst(sgB, keepC); compactInst(sgP, keepC) } };
/* ---- public API for the lighthouse model: setLighthouse(object3D, scale) ; LIGHTHOUSE_SLOT is the mount group ---- */
window.LIGHTHOUSE_POS = { x: HL.x, y: HL.h + .9, z: HL.z };
window.WORLD3 = { ROADS, RIV, FEATS, HL, LH, LOT_SPOTS, TPS, WH, GH, nearRoad, inWater, teleport, terrUpdate, vegUpdate };

}catch(e){ console.error("world v3 failed", e); try{ __showErr(e) }catch(_){} }
})();
