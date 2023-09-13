const { app, BrowserWindow, ipcMain} = require('electron')
const path = require('node:path')
const Store = require('electron-store')

Store.initRenderer()
console.log('fw - config: ', app.getPath('userData'));


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('index.html')
    win.webContents.openDevTools()

}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')

    const store = new Store();
    ipcMain.handle('electron-store-get', (event, key) => {
       const result = store.get(key)
       console.log('fw1: - get', result)
       return result
    })

    ipcMain.handle('electron-store-set', (event, key, value) => {
        console.log('fw - set: ', key, value)
        store.set(key, value)
    })

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('windows-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
