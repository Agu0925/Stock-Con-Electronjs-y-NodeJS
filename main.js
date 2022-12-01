const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
require('./app.js');
const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
    const template = [
      //Sin Barra De Menu
    ]
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu); 
    win.loadFile('index.html')
  };
  app.whenReady().then(() => {
    createWindow()
  });
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  });