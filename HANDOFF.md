# F1 Drift – project handoff (for a new Claude chat)

Owner talks Hinglish, wants terse answers and autonomous execution. Target phone: **vivo T4 Lite 5G, 4 GB RAM** (weak GPU: ~21 FPS at Low with 195k tris was the starting point).
Repo: `github.com/anuj263vishwa-crypto/f1-drift-app` (public – required for in-app update check).

## How to continue in a new chat
1. Tell Claude: "F1 Drift game, read HANDOFF.md in my repo" (public, readable without a token).
2. Pushing needs a **fine-grained GitHub token** (Settings → Developer settings → Fine-grained tokens): only repo `f1-drift-app`, *Contents* + *Workflows* = Read and write, 30 days. It is never stored in memory – the owner must paste it again. Delete it when done.
3. Uploaded GLB cars are not kept – re-upload when adding cars. Converter scripts are in `tools/`.

## What it is
Single-page three.js (r128) racing game wrapped as an Android app with **Capacitor 7**. Built on GitHub Actions (no PC needed), distributed as APK + OTA web bundles.

## Build / release / OTA
- `.github/workflows/build.yml`: stamps `__VERSION__` (= run number) into `www/js/updater.js`, `npm i`, `cap add android`, icon/splash via `@capacitor/assets` (from `assets/`), `scripts/patch-android.sh` (landscape, immersive, versionCode), `gradlew assembleDebug`, zips `www/` → `bundle.zip`, recreates release tag **`latest`** with `F1-Drift.apk` + `bundle.zip`; notes = `vN · sha · sha256=<zip hash>`.
- Pushes touching only `tools/**` or `*.md` do not build (`paths-ignore`); add `[skip ci]` to be safe.
- **OTA**: `@capgo/capacitor-updater` 7.53.0, manual mode. `js/updater.js` polls `api.github.com/repos/.../releases/tags/latest`, needs the sha256 (plugin refuses downloads without checksum), calls `download` then `set`. `notifyAppReady()` is called repeatedly. Safety net: if `ready` is not true after 75 s the app rolls back to the previous bundle and remembers the bad version (`localStorage f1bad`).
- Debug keystore is regenerated every CI run ⇒ installing a *newer APK over an older one* fails ("App not installed") – uninstall first. OTA is unaffected. Native changes (manifest, icon, plugins) need a fresh APK; everything in `www/` ships via OTA.
- Share link: `.../releases/latest/download/F1-Drift.apk` (QR in menu, `www/img/share-qr.webp`).

## Game code map (`www/`)
- `index.html` – HUD/menu markup, script order. `js/s01,s04,s05.js` are now empty (their data was moved to `js/lz/`).
- `js/s06.js` – main game (world, physics, cars, UI). `s07.js` world gen helpers, `s10.js` graphics governor (tiers Low…Max; phones capped at Mid via `s03.js`, `window.PQP`).
- Post-processing (`POST.on`) is permanently off. Lag is draw-calls/tris + CPU, not fill-rate.
- Added by us: `js/nitro.js` (nitro N/button, drift score, drift→nitro charge, patched hooks in `s06.js`: `NITRO.step`, speed cap, gear max, FOV), `js/updater.js` (update banner, menu: update/share/QR, diagnostics line at bottom: version · bundle · fps · gpu geo/tex · cars · errors), `js/cars_ext.js` (external cars + Full/Lite switch).
- Race has **5 AI cars** (`for (let n = 0; n < 5; n++)` in `s06.js`). Speedometer is top-right (CSS in `index.html`).
- Removed cars: F2008, MP4/5, P1 GTR, Royal X. Default car F60; AI/ghost body is built from `f26`.
- Original cars: 14 built-in (`LZC.<id>` lazy builders in `s06.js`). AMG One (`s08.js`) and Lambo V12 (`s09.js`) also lazy.

## Lazy loading (v19)
- All big data constants live in `js/lz/*.js` (`var D#/T#` for original cars, `window.__B64_amg1/lv12`, `window.__CD[id]` for external cars). Only `f26` + the saved/default car are built at startup.
- `setCar(id)` → if not built, `LZC[id]()` loads `lz` files, decodes, builds, then `LZPOST(id)` (shadow blob, `dvBuild(id)`, sticker patch, `applyCfg`). `cars_ext.js` wraps `setCar` for external ids and frees GPU buffers/textures of the car you leave (`releaseCar`).
- Maps are procedural (instanced, hash-scattered around the player) – nothing to lazy-load there.

## External cars (`cars_ext.js`, data `js/lz/car_<id>.js`)
Ids: `rb22 gt3 jesko fxxk furai apollo` (CC BY 4.0, credited in menu + README: RB22 Dave Love, GT3 Evo vecarz, Jesko/FXX-K/Furai/Apollo kevin(sohyalebret)).
- Data = gzip+base64 JSON: `tex` (WebP), `mats` (PBR: sRGB-encoded colour, metal/rough maps, normal, clearcoat, emissive), `g.hi` / `g.lo` (Full / Lite LOD: body, 4 wheels `{c, sp[], st[]}`, steering `sw`), `ex` exhaust ports, `eye`.
- Wheel rig: `st` (steer + suspension height) → `sp` (spin). Tyre+rim+disc+cover spin; calipers only steer. **Wheel axle is taken from the brake-disc normal** and camber/toe is removed (models with baked camber wobbled). Concentric to ~0.1 mm.
- Steering wheel = the model's own, rotated about its column (face-normal estimate), `X.dv.sp.rotation.z` driven by the game's `dvSteer`.
- Booster flames only from `ex` ports (exhaust positions were located visually). **Furai exhaust is a guess.**
- glTF defaults matter: `metallicFactor`/`roughnessFactor` default to **1.0** when absent; colours are linear → converted with gamma 1/2.2 because the game renders without sRGB output.
- Convert a new car: see `tools/convert/` (`run_all.py` has one config per car: tyre/rim/disc/caliper material names or node paths, steering material list + box, exhaust ports). Simplify first with gltfpack (`-si 0.4 -se 0.004 -sv -kn -km -noq` body-hi, `-si 0.5 -se 0.0004` wheels-hi, lo versions `-si 0.12 -se 0.03 -sa` / `-si 0.15 -se 0.0009`). Output goes to `www/js/lz/car_<id>.js`; register in `DEFS` + credits in `cars_ext.js`.

## Testing without a phone
`tools/test/`: Electron + Xvfb (software GL) runs the real game: `npm i electron@28`, `xvfb-run -a electron --no-sandbox .` with `main.js` = `electron_full_test.js` (loads game, selects every car, switches modes, counts errors) or `electron_showroom_shots.js` (showroom screenshots). Startup is slow under SwiftShader (1–8 min). Baseline: 9 console errors exist before any car loads (toNonIndexed warnings, Electron security) – compare against that. FPS cannot be measured this way.

## Known issues / ideas
- Jesko/Apollo screenshots showed dark speckles on white paint (possible BLEND-material depth issues) – check.
- Real shine/colour never verified on the phone; owner feedback pending.
- Planned next: perfect start, coins/rewards, lite mode for the world (fewer trees/buildings), more cars (CC BY/CC0 only), a second game in its own repo (owner must create the repo and extend the token).
- Public repo exposes all game files; licences of the original cars (AMG One, Lambo, F60, W17…) are unknown.
