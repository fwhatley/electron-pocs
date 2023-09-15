const { ipcRenderer, contextBridge } = require('electron')

const windowLoaded = new Promise((resolve) => {
    window.onload = resolve
})

ipcRenderer.on('new-client', async (event) => {
    await windowLoaded
    window.postMessage('new-client', '*', event.ports)
})

ipcRenderer.on('provide-worker-channel',  async (event) => {
    await windowLoaded
    window.postMessage('provide-worker-channel', '*', event.ports)
})


contextBridge.exposeInMainWorld('channel', {
    requestChannel: () => ipcRenderer.send('request-worker-channel')
}) 
