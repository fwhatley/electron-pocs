const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

const func = async () => {
    const res = await window.versions.ping()
    console.log(res)
}

func()


// load user settings
const dataTextareaEl = document.getElementById('data')
const saveBtnEl = document.getElementById('save-btn')

const loadSettings = async () => {
    const userSettingsJson = await window.electronStore.get('userSetttings')
    dataTextareaEl.innerHTML = JSON.stringify(userSettingsJson)
}
loadSettings()

// save user settings
saveBtnEl.addEventListener('click', () => {
    const jsonData = JSON.parse(dataTextareaEl.value)
    window.electronStore.set('userSetttings', jsonData)
})