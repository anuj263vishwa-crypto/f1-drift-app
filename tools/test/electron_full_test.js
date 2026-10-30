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
  const ids = (process.env.IDS || 'rb,w17,pt2,fp,cf,c44,amg1,lv12,rb22,gt3,jesko,fxxk,furai,apollo,f60').split(',');
  for (const id of ids) {
    const e0 = errs.length, t1 = Date.now();
    await ev(`(function(){ const b=document.querySelector('#cs button[data-c="${id}"]'); if(b) b.click(); else setCar("${id}") })()`).catch(e => L('click err', e.message));
    let c = ''; for (let i = 0; i < 80; i++) { c = await ev('cur').catch(() => ''); if (c === id) break; await sleep(250) }
    await sleep(700);
    const info = await ev(`(function(){const X=CARS["${id}"]; if(!X) return "NO CAR OBJECT"; let n=0,v=0; X.c.traverse(o=>{if(o.isMesh){n++; if(o.visible) v++}}); return "meshes "+n+" visible "+v+" wheels "+Object.keys(X.wh).join('')+" carVisible "+X.c.visible})()`).catch(e => 'info err ' + e.message);
    L(id.padEnd(7), c === id ? 'OK ' : 'FAIL', ((Date.now() - t1) / 1000).toFixed(1) + 's', '|', info, '| new errors:', errs.length - e0);
    errs.slice(e0, e0 + 3).forEach(x => L('    ERR', x.slice(0, 240)));
    if (process.env.SHOT && process.env.SHOT.split(',').includes(id)) { const img = await win.webContents.capturePage(); fs.writeFileSync('/tmp/el/shot_' + id + '.png', img.toPNG()) }
  }
  // maps/modes
  for (const m of ['open', 'race', 'nature', 'ghost', 'show']) {
    const e0 = errs.length; await ev(`go("${m}")`).catch(e => L('go err', e.message)); await sleep(1500);
    L('mode', m.padEnd(7), 'mode now =', await ev('mode'), '| new errors:', errs.length - e0); errs.slice(e0, e0 + 3).forEach(x => L('    ERR', x.slice(0, 240)));
  }
  L('TOTAL errors', errs.length, '| heap MB', await ev("Math.round((performance.memory||{}).usedJSHeapSize/1048576)"));
  app.quit();
});
