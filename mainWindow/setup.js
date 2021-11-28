const { createNewFile } = require('./fileManager')
const { saveContentInTextarea, insertSongsIntoSidePanel } = require('./mutateView')
const { setupGetFolderIpc, setupPromptNameIpc, setupSelectFolderIpc, exportPdf } = require('./ipc')
const { machine } = require('./mutateView')

function start() {
	insertSongsIntoSidePanel();
	setupConnectionMain();
	setupButtons();
}
function setupButtons() {
	setupModeButton();
	setupFolderButton();
	setupSaveButton();
	setupNewButton();
	setupExportButton();
}
function setupModeButton() {
	const modeButton = document.getElementById("mode-button")
	console.log({ modeButton })
	modeButton.addEventListener('click', () => machine.dispatch('switch'));
}
function setupSaveButton() {
	const saveButton = document.getElementById("save-button")
	saveButton.addEventListener('click', () => saveContentInTextarea());
}
function setupExportButton() {
	const exportButton = document.getElementById("export-button")
	exportButton.addEventListener('click', () => exportPdf())
}

function setupFolderButton() {
	const folderButton = document.getElementById("folder-button")
	folderButton.addEventListener('click', () => {
		ipcRenderer.send('select-dirs')
	})
}

function setupNewButton() {
	const newButton = document.getElementById("new-button")
	newButton.addEventListener('click', () => createNewFile());
}

function setupConnectionMain() {
	setupGetFolderIpc();
	setupPromptNameIpc();
	setupSelectFolderIpc();

}



module.exports = { start }