const { createNewFile } = require('./fileManager')
const { saveContentInTextarea, insertSongsIntoSidePanel } = require('./mutateView')
const { setupGetFolderIpc, setupPromptNameIpc, setupSelectFolderIpc, getFolderIpc } = require('./ipc')

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
}
function setupModeButton() {
	const modeButton = document.getElementById("mode-button")
	modeButton.addEventListener('click', () => machine.dispatch('switch'));
}
function setupSaveButton() {
	const saveButton = document.getElementById("save-button")
	saveButton.addEventListener('click', () => saveContentInTextarea());
}

function setupFolderButton() {
	const folderButton = document.getElementById("folder-button")
	folderButton.addEventListener('click', () => {
		getFolderIpc();
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



module.exports = { setupButtons, setupConnectionMain }