const { app, BrowserWindow } = require('electron'); const fs = require('fs');
app.commandLine.appendSwitch('use-gl', 'angle'); app.commandLine.appendSwitch('use-angle', 'swiftshader'); app.commandLine.appendSwitch('enable-unsafe-swiftshader'); app.commandLine.appendSwitch('ignore-gpu-blocklist'); app.commandLine.appendSwitch('no-sandbox');
const sleep = ms => new Promise(r => setTimeout(r, ms));
app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 960, height: 480, show: false, webPreferences: { contextIsolation: false, webSecurity: false } });
  const errs = []; win.webContents.on('console-message', (e, lv, m, l, s) => { if (lv >= 2) errs.push(m.slice(0, 200) + ' @' + (s || '').split('/').pop() + ':' + l) });
  const ev = c => win.webContents.executeJavaScript(c, true);
  win.loadURL('file://' + (process.env.GAME || '/home/claude/app/www/index.html'));
  let ok = false; for (let i = 0; i < 600 && !ok; i++) { await sleep(500); try { ok = await ev("typeof ready!=='undefined' && ready===true") } catch (e) { } }
  const e0 = errs.length; await ev("document.getElementById('menu').style.display='none'; menuOn=false; go('race')"); await sleep(3000);
  console.log('SIM RESULT\n' + await ev(fs.readFileSync('/tmp/el/app/sim_page.js', 'utf8')).catch(e => 'ERR ' + e.message));
  await sleep(2000); const img = await win.webContents.capturePage(); fs.writeFileSync('/tmp/el/race.png', img.toPNG());
  console.log('new errors', errs.length - e0); errs.slice(e0).slice(0, 4).forEach(x => console.log('  ERR', x)); app.quit();
});
