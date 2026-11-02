const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('F1Desktop', { platform: process.platform, open: url => ipcRenderer.send('f1-open', url) });
