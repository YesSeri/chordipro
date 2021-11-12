const fs = require('fs');
const path = require('path');
const folder = "./songs"
const FileChordPro = require('./file.js');

let files = [];
fs.readdir(folder.toString(), (err, arr) => {
	arr.forEach(file => {
		files.push(file);
	});
});

window.addEventListener('DOMContentLoaded', () => {
	const songList = document.getElementById("song-list")
	// function addSongs(filename) {
	// 	const p = path.parse(filename);
	// 	if (p.ext === ".chopro") {
	// 		const div = document.createElement("div");
	// 		div.classList.add("song");
	// 		div.innerText = p.name
	// 		songList.append(div);
	// 	}
	// }
	files.forEach(file => {
		addSongs(file)
	})
})