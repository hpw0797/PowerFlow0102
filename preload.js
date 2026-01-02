
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  shutdown: (force) => ipcRenderer.send('system-shutdown', force),
  launchApp: (appPath) => ipcRenderer.send('launch-app', appPath),
  isElectron: true
});
