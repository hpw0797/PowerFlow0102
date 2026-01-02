
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 900,
    minHeight: 700,
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, 'public/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('system-shutdown', (event, force) => {
  // /s 关机, /f 强制关闭, /t 0 立即执行
  const command = force ? 'shutdown /s /f /t 0' : 'shutdown /s /t 60';
  exec(command, (error) => {
    if (error) console.error(`关机执行错误: ${error}`);
  });
});

ipcMain.on('launch-app', (event, appPath) => {
  // 使用 start 命令启动应用
  exec(`start "" "${appPath}"`, (error) => {
    if (error) console.error(`应用启动失败: ${error}`);
  });
});
