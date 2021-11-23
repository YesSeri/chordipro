const path = require('path');
const { getContent, getCurrentFile, getFiles, saveFile, setCurrentFile } = require('./fileManager')

async function openFile(textarea, file) {
	// We save current content when we switch to a new file in textarea.
	saveContentInTextarea(textarea)
	setCurrentFile(file)
	const content = await getContent(file);
	textarea.value = content;
}

function saveContentInTextarea(textarea) {
	if (!getCurrentFile()) {
		return
	}
	const content = textarea.value;
	saveFile(content, getCurrentFile());
}

async function insertSongsIntoSidePanel(sidePanel, folder) {
	if (!folder) {
		console.log("Please choose folder.")
		return;
	}
	const files = await getFiles(folder);
	files.forEach(file => {
		const split = file.split('.')
		const suffix = split[split.length - 1];
		if (suffix === 'chopro') {
			const div = document.createElement('div');
			div.innerText = split.slice(0, -1);
			const textarea = document.getElementById("editor")
			div.addEventListener('click', () => openFile(textarea, path.join(folder, file)))
			sidePanel.append(div);
		}
	});
}

function toViewMode() {
	setButtonText("To Editor")
}
function toEditorMode() {
	setButtonText("To View")
}
function setButtonText(text) {
	const modeButton = document.getElementById("mode-button")
	modeButton.innerText = text;
}

module.exports = { insertSongsIntoSidePanel, toViewMode, toEditorMode }