const { saveFile, getCurrentFolder, setCurrentFolder, getCurrentFile } = require('./fileManager')
const { insertSongsIntoSidePanel, getViewHtml, saveContentInTextarea } = require('./mutateView')
const { ipcRenderer } = require('electron')
console.log(saveContentInTextarea);

function setupGetFolderIpc() {
	ipcRenderer.send('get-folder')
	ipcRenderer.on('get-folder-reply', (event, arg) => {
		setCurrentFolder(arg)
		insertSongsIntoSidePanel();
	})
}

function setupExportPdf() {
	if (!getCurrentFile()) {
		return
	}
	const html = getViewHtml()
	ipcRenderer.send('export-pdf', html.outerHTML);
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
function setupSaveOnQuitIpc() {
	ipcRenderer.on('save-before-quit', (event, arg) => {
		if (getCurrentFile()) {
			saveContentInTextarea();
		}
		ipcRenderer.send('save-before-quit-reply')
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
module.exports = { setupGetFolderIpc, setupPromptNameIpc, setupSelectFolderIpc, setupExportPdf, setupSaveOnQuitIpc }