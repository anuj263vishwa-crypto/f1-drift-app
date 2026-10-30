const { app, BrowserWindow } = require('electron');
const fs = require('fs');
app.commandLine.appendSwitch('use-gl', 'angle'); app.commandLine.appendSwitch('use-angle', 'swiftshader');
app.commandLine.appendSwitch('enable-unsafe-swiftshader'); app.commandLine.appendSwitch('ignore-gpu-blocklist'); app.commandLine.appendSwitch('no-sandbox');
app.disableHardwareAcceleration && 0;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = []; const L = (...a) => { const s = a.join(' '); log.push(s); console.log(s) };
app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 800, height: 360, show: false, webPreferences: { offscreen: false, contextIsolation: false, nodeIntegration: false, webSecurity: false } });
  const errs = [];
  win.webContents.on('console-message', (e, level, msg, line, src) => { if (level >= 2) { errs.push(msg + ' @' + (src || '').split('/').pop() + ':' + line); } });
  win.webContents.on('render-process-gone', (e, d) => L('RENDERER GONE', JSON.stringify(d)));
  const ev = c => win.webContents.executeJavaScript(c, true);
  const t0 = Date.now();
  await win.loadURL('file:///home/claude/app/www/index.html');
  let ok = false;
  for (let i = 0; i < 240; i++) { try { ok = await ev("typeof ready!=='undefined' && ready===true") } catch (e) { } if (ok) break; await sleep(500) }
  L('READY', ok, 'after', ((Date.now() - t0) / 1000).toFixed(1) + 's', '| load toast:', await ev("(document.getElementById('load')||{}).textContent||'(gone)'").catch(e => 'n/a'));
  L('CARS built at start:', await ev("Object.keys(CARS).join(',')"), '| cur =', await ev('cur'));
  L('heap MB (js):', await ev("Math.round((performance.memory||{}).usedJSHeapSize/1048576)"));
  L('errors so far:', errs.length); errs.slice(0, 8).forEach(x => L('  ERR', x.slice(0, 220)));
  await ev("document.getElementById('menu').style.display='none'; go('show')").catch(e => L('go err', e.message));
  const ids = (process.env.IDS || 'rb22').split(',');
  for (const id of ids) {
    await ev(`setCar("${id}")`).catch(e => L('err', e.message));
    let c = ''; for (let i = 0; i < 80; i++) { c = await ev('cur').catch(() => ''); if (c === id) break; await sleep(250) }
    await ev("document.getElementById('menu').style.display='none'");
    await sleep(Number(process.env.WAIT || 9000));
    const img = await win.webContents.capturePage(); fs.writeFileSync('/tmp/el/show_' + id + '.png', img.toPNG()); L('shot', id, c === id ? 'OK' : 'FAIL');
  }
  L('TOTAL errors', errs.length); errs.slice(9, 14).forEach(x => L('  ERR', x.slice(0, 200)));
  app.quit();
});
