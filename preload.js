const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, "songs")
const FileChordPro = require('./file.js');

let files = [];
let currentFile;
let mode = "editor"
fs.readdir(folder.toString(), (err, arr) => {
	if (err) {
		console.log(err)
		return
	}
	arr.forEach(file => {
		const p = path.join(folder, file);
		const fileChordProEl = new FileChordPro(p)
		files.push(fileChordProEl);
	});
});

window.addEventListener('DOMContentLoaded', () => {
	const songList = document.getElementById("song-list")
	function addSongs(file) {
		const p = path.parse(file.filename);
		if (p.ext === ".chopro") {
			const div = document.createElement("div");
			div.classList.add("song");
			div.innerText = p.name
			songList.append(div);
			div.addEventListener('click', () => openFile(file));
		}
	}
	files.forEach(file => {
		addSongs(file)
	})

	const saveButton = document.getElementById("save-button");
	saveButton.addEventListener("click", saveFile)
	function saveFile() {
		const editor = document.getElementById("editor");
		const content = editor.value;
		fs.writeFile(currentFile.path, content, function (err) {
			if (err) {
				return console.log(err);
			}
			console.log("The file was saved!");
		});
	}
	const modeButton = document.getElementById("mode-button");
	modeButton.addEventListener("click", switchMode);
	function switchMode() {
		if (!currentFile) return;
		modeButton.innerText = "to " + mode;
		if (mode === "editor") {
			openView(currentFile);
			mode = "view"
		} else {
			openEditor(currentFile);
			mode = "editor"
		}
	}

})
function openEditor(currentFile) {
	openFile(currentFile)
	const editor = document.getElementById("editor");
	const view = document.getElementById("view");
	editor.style.display = "block"
	view.style.display = "none"
}

function openFile(file) {
	currentFile = file;
	const editor = document.getElementById("editor");
	file.getContent().then(content => {
		editor.value = content;
	});
}

function openView() {
	const view = document.getElementById("view");
	const editor = document.getElementById("editor");
	view.style.display = "block"
	editor.style.display = "none"

	contentArrToHTML().then(div => {
		view.innerHTML = "";
		view.appendChild(div);
	});
}


async function contentArrToHTML() {
	const div = document.createElement('div')
	const arr = await currentFile.getContentArr();

	console.log(arr)
	arr.forEach(el => {
		console.log(el.text)
		const p = document.createElement('p');
		p.innerText = el.text;
		div.appendChild(p)
	});
	return div;
}