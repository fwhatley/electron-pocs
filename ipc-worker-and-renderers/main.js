const { BrowserWindow, app, ipcMain, MessageChannelMain } = require('electron')
const path = require('node:path')

app.whenReady().then(async () => {
    // the worker process is a hidden BrowserWindow, so that it will have acess
    // to a full Blink context (including <canvas>, audio, etc)

    const worker = new BrowserWindow({
        show: true,
        webPreferences: {
            nodeIntegration: true, 
            preload: path.join(__dirname, 'preload.js')
        }
    })
    await worker.loadFile('worker.html')
    worker.webContents.openDevTools()

    // the main window will send work to the worker process and receive results
    // over a MessagePort.
    const mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    mainWindow.loadFile('app.html')
    mainWindow.webContents.openDevTools()


    // we can't use ipcMain.handle() here, because they reply needs to transfer
    // a MessagePort.
    // Listen for a message sent from the top-level frame
    mainWindow.webContents.mainFrame.ipc.on('request-worker-channel', (event) =>{
        // create a new channel ...
        const {port1, port2} = new MessageChannelMain()
        // ... send one end ot the worker
        worker.webContents.postMessage('new-client', null, [port1])
        // ... and the other end to the main window.
        event.senderFrame.postMessage('provide-worker-channel', null, [port2])
        // now the main window and the worker can communicate with eacth other
        // without going through the main process!    
    })
})