const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
if (process.env.F1_SOFTWARE_GL) { app.commandLine.appendSwitch('use-gl', 'angle'); app.commandLine.appendSwitch('use-angle', 'swiftshader'); app.commandLine.appendSwitch('enable-unsafe-swiftshader'); app.commandLine.appendSwitch('no-sandbox') }

const ALLOWED = /^https:\/\/github\.com\/anuj263vishwa-crypto\/f1-drift-app(\/|$)/;
ipcMain.on('f1-open', (e, url) => { if (typeof url === 'string' && ALLOWED.test(url)) shell.openExternal(url) });

function createWindow() {
  Menu.setApplicationMenu(null);
  const win = new BrowserWindow({
    width: 1280, height: 720, minWidth: 800, minHeight: 450, backgroundColor: '#0b0d12', title: 'F1 Drift', autoHideMenuBar: true, show: false,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, backgroundThrottling: false }
  });
  win.once('ready-to-show', () => win.show());
  win.webContents.on('before-input-event', (e, i) => { if (i.type === 'keyDown' && i.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault() } });
  win.webContents.setWindowOpenHandler(({ url }) => { if (ALLOWED.test(url)) shell.openExternal(url); return { action: 'deny' } });
  win.loadFile(path.join(__dirname, 'www', 'index.html'));
  if (process.env.F1_SELFTEST) {   /* used by CI/dev: print whether the game reached "ready", then quit */
    const sleep = ms => new Promise(r => setTimeout(r, ms)); const t0 = Date.now();
    win.webContents.on('console-message', (e, lv, msg) => { if (lv >= 3) console.log('PAGE ERROR:', msg.slice(0, 200)) });
    (async () => { let ok = false; for (let i = 0; i < 900 && !ok; i++) { await sleep(500); try { ok = await win.webContents.executeJavaScript("typeof ready!=='undefined' && ready===true") } catch (e) { } }
      console.log('SELFTEST ready=' + ok + ' after ' + ((Date.now() - t0) / 1000).toFixed(1) + 's desktopApi=' + await win.webContents.executeJavaScript('typeof window.F1Desktop').catch(() => '?')); app.quit() })()
  }
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
