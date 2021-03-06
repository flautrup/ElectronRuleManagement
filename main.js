const electron = require('electron');
const {ipcMain} = require('electron');
const {session} = require('electron');

// Module to control application life.
const app = electron.app
//Add to allow for self-signed certificates
//app.commandLine.appendSwitch('ignore-certificate-errors');

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let loginWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1000, height: 720})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  //Todo: fix a proper content security policy
  //session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //  callback({responseHeaders: `default-src 'rd-flp-86.rdlund.qliktech.com'`})
  //})

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  ipcMain.on('loadPage', (event, arg) => {
    loginWindow = new BrowserWindow({width: 1000, height: 720})

    // and load the index.html of the app.
    loginWindow.loadURL(arg);

    //loginWindow.webContents.openDevTools()

  });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})




// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
