const { saveFile, getCurrentFolder, setCurrentFolder, createNewFile } = require('./fileManager')

function getFolderIpc() {
	ipcRenderer.send('select-dirs')
}
function setupGetFolderIpc() {
	ipcRenderer.send('get-folder')
	ipcRenderer.on('get-folder-reply', (event, arg) => {
		setCurrentFolder(arg)
		insertSongsIntoSidePanel();
	})
}
function setupSelectFolderIpc() {
	ipcRenderer.on('selected-dirs-reply', (event, dir) => {
		if (!dir) {
			return
		}
		saveContentInTextarea();
		setCurrentFolder(dir)
		insertSongsIntoSidePanel();
	})
}

function setupPromptNameIpc() {
	ipcRenderer.on('prompt-name-reply', (event, arg) => {
		const name = arg + '.chopro'
		const filepath = path.join(getCurrentFolder(), name)
		saveFile("", filepath)
		insertSongsIntoSidePanel()
		const textarea = document.getElementById("editor");
		openFile(textarea, filepath)
	})
}
module.exports = { setupGetFolderIpc, setupPromptNameIpc, setupSelectFolderIpc, getFolderIpc }