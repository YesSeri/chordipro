const path = require('path');
const { getContent, getCurrentFile, getFiles, saveFile, setCurrentFile } = require('./fileManager')

async function openFile(textarea, file) {
	// We save current content when we switch to a new file in textarea.
	saveContentInTextarea(textarea)
	machine.dispatch('toEditor')
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
		const ext = path.extname(file)
		console.log(ext)
		if (ext === '.chopro') {
			const div = document.createElement('div');
			div.innerText = path.basename(file, ext)
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
function setupModeButton() {
	const modeButton = document.getElementById("mode-button")
	modeButton.addEventListener('click', () => machine.dispatch('switch'));
}
function setButtonText(text) {
	console.log({ text, mode: machine.state })
	const modeButton = document.getElementById("mode-button")
	modeButton.innerText = text;
}

// A finite state machine to help with transitions between editor and view. Switch is used by button and toEditor when opening new file.
const machine = {
	state: 'EDITOR',
	transitions: {
		EDITOR: {
			switch() {
				this.state = 'VIEW'
				toViewMode();
			}
		},
		VIEW: {
			switch() {
				this.state = 'EDITOR';
				toEditorMode();
			},
			toEditor() {
				this.state = 'EDITOR';
				toEditorMode();
			}
		},
	},
	dispatch(actionName) {
		const action = this.transitions[this.state][actionName];

		if (action) {
			action.call(this);
		} else {
			console.log('invalid action');
		}
	},
};

module.exports = { insertSongsIntoSidePanel, toViewMode, toEditorMode, setupModeButton }