const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 360,
    height: 620,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  app.quit()
})


ipcMain.on('close-app', () => {
  app.quit();
})

ipcMain.on('minimize-app', (event) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  if (win) {
    win.minimize();
  }
})