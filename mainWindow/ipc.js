const { saveFile, getCurrentFolder, setCurrentFolder } = require('./fileManager')
const { insertSongsIntoSidePanel, getViewHtml } = require('./mutateView')
const { ipcRenderer } = require('electron')

function setupGetFolderIpc() {
	ipcRenderer.send('get-folder')
	ipcRenderer.on('get-folder-reply', (event, arg) => {
		setCurrentFolder(arg)
		insertSongsIntoSidePanel();
	})
}

function exportPdf() {
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
module.exports = { setupGetFolderIpc, setupPromptNameIpc, setupSelectFolderIpc, exportPdf }