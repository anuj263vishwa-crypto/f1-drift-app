# F1 Drift – project handoff (for a new Claude chat)

Owner talks Hinglish, wants terse answers and autonomous execution. Target phone: **vivo T4 Lite 5G, 4 GB RAM** (weak GPU: ~21 FPS at Low with 195k tris was the starting point).
Repo: `github.com/anuj263vishwa-crypto/f1-drift-app` (public – required for in-app update check).

## ▶ Current status (update this block after every milestone)
- **Latest release: v33** (commit `235615a`) – APK 76 MB, OTA bundle 53 MB, desktop installers (Windows setup+portable, Linux AppImage, macOS arm64+x64) all attached to release tag `latest`.
- Working: 21 selectable cars (14 original + AMG One + Lambo V12 + 6 external), lazy loading, nitro/drift score, 5 AI cars, QR/share/update menu, desktop app, new artwork (Mercedes F1 drift picture) as icon/splash/banner.
- Owner's phone feedback after v33 is **not in yet** (FPS, wheel wobble on Jesko/Apollo after the camber fix, loading-screen W17, new icon).
- Open ideas: perfect start + coins/rewards, "Lite world" (fewer trees/buildings), auto-update for the desktop app (today it only opens the release page), more CC BY/CC0 cars, a second game in its own repo.

## Changelog (newest first)
- v33: removed duplicate `assets/splash-dark.png` (APK 92→76 MB).
- v32: new artwork everywhere (square `icon-only` 1024, adaptive `icon-foreground/background`, 2732 `splash`, `desktop/build/icon.png`, README header). Originals kept in `assets/source/`.
- v31: loading screen W17 fixed – the W17 preloader reads globals `D14`/`T14`, which lazy loading had moved away (fallback = plain wheel). `index.html` now loads `js/lz/D14.js` + `T14.js` before `__plGo()`, frees them after the loader closes; `lzLoad` reloads freed data. Loader stays visible ~2.3 s after the W17 appears (`window.__plShownAt`).
- v20+: **Desktop app** (Electron) – see below.
- v19: lazy loading of all car data. v18: wheel camber removed. v17: full PBR materials + Full/Lite LODs. v16: Jesko/FXX-K/Furai/Apollo. v14–15: 5 AI cars, QR/share. v12: diagnostics line. v7: nitro. v6: OTA updater.

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
- `index.html` – HUD/menu markup, script order. `js/s01,s04,s05.js` are empty (data moved to `js/lz/`); `js/lz/D14.js` + `T14.js` are loaded eagerly in `index.html` because the W17 loading screen needs them.
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

## Desktop app (Electron, `desktop/`)
- `desktop/main.js` (window 1280×720, F11 fullscreen, menu hidden, `win.loadFile(www/index.html)`), `preload.js` exposes `window.F1Desktop = {platform, open(url)}` (only github.com/anuj263vishwa-crypto/f1-drift-app links are opened). `F1_SELFTEST=1 F1_SOFTWARE_GL=1` prints whether the game reaches `ready`.
- `.github/workflows/desktop.yml` runs on `workflow_run` of "Build APK" (so versions match: `github.event.workflow_run.run_number`), matrix windows/ubuntu/macos, copies `www/` into `desktop/www`, `electron-builder --publish never`, then `gh release upload latest … --clobber`. Names: `F1-Drift-Setup.exe`, `F1-Drift-Portable.exe`, `F1-Drift.AppImage`, `F1-Drift-mac-arm64.dmg`, `F1-Drift-mac-x64.dmg`. Unsigned (SmartScreen / Gatekeeper warnings, documented in README).
- `updater.js` on desktop (`window.F1Desktop`) only shows "new version available → Download" (opens the release page); there is no in-app auto update for desktop yet.
- Only the Linux build was run locally (Electron + Xvfb); Windows/macOS were built by CI but never launched.

## Artwork
`assets/icon-only.png` (1024², fed to `@capacitor/assets`), `icon-foreground.png` (RGBA, picture at 85 %), `icon-background.png` (solid), `splash.png` (2732², light+dark share it – no `splash-dark.png`), `desktop/build/icon.png` (1024²), `www/img/car.jpg` (menu banner). The owner swaps pictures by uploading files on github.com ("Add files via upload") – **always `git pull --rebase` before pushing** and keep sizes square/2732. Icon/splash changes need a new APK (not OTA).

## Working with GitHub from the sandbox
- Sandbox files vanish between sessions: `git clone --depth 1 https://github.com/anuj263vishwa-crypto/f1-drift-app.git` first (public), then push with `https://x-access-token:<TOKEN>@github.com/…` (never write the token into the repo, memory or logs; never leave it in `git remote`).
- Token = fine-grained PAT, only this repo, *Contents* + *Workflows* read/write, **90 days** (a 7-day token expired once). It cannot read Actions logs; poll `GET /repos/…/releases/tags/latest` (name `vN`, notes contain the commit sha) to know when a build finished. Builds take ≈ 6 min (APK) + ≈ 6 min (desktop).
- Release `latest` is deleted and recreated by every APK build; desktop files are added afterwards by the second workflow.
- `[skip ci]` / `.md` / `tools/**` changes do not build.

## Testing without a phone
`tools/test/`: Electron + Xvfb (software GL) runs the real game: `npm i electron@28`, `xvfb-run -a electron --no-sandbox .` with `main.js` = `electron_full_test.js` (loads game, selects every car, switches modes, counts errors) or `electron_showroom_shots.js` (showroom screenshots). Startup is slow under SwiftShader (1–8 min). Baseline: 9 console errors exist before any car loads (toNonIndexed warnings, Electron security) – compare against that. FPS cannot be measured this way.

## Known issues / ideas
- Jesko/Apollo screenshots showed dark speckles on white paint (possible BLEND-material depth issues) – check.
- Real shine/colour never verified on the phone; owner feedback pending.
- Planned next: perfect start, coins/rewards, lite mode for the world (fewer trees/buildings), more cars (CC BY/CC0 only), a second game in its own repo (owner must create the repo and extend the token).
- Public repo exposes all game files; licences of the original cars (AMG One, Lambo, F60, W17…) are unknown.
