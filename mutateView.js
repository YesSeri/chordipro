const path = require('path');
const { getContent, getCurrentFile, getFiles, saveFile, setCurrentFile } = require('./fileManager')
const chordproToHTML = require('./parseSongHTML')

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
	const textarea = document.getElementById("editor")
	setButtonText("To Editor")
	saveContentInTextarea(textarea);
	addHTMLToViewDiv()
	showViewDiv()
}
function showViewDiv() {
	const editor = document.getElementById("editor")
	const view = document.getElementById("view")
	editor.classList.add('hide')
	view.classList.remove('hide')
}
function addHTMLToViewDiv() {
	const textarea = document.getElementById("editor")
	const content = textarea.value;
	const view = document.getElementById("view")
	view.innerHTML = ""
	const HTML = chordproToHTML(content)
	view.appendChild(HTML)
}
function toEditorMode() {
	setButtonText("To View")
	showEditor()
}
function showEditor() {
	const editor = document.getElementById("editor")
	const view = document.getElementById("view")
	editor.classList.remove('hide')
	view.classList.add('hide')
}
function setupModeButton() {
	const modeButton = document.getElementById("mode-button")
	modeButton.addEventListener('click', () => machine.dispatch('switch'));
}
function setButtonText(text) {
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