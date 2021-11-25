const fs = require('fs');
const path = require('path');

function getFiles(folder) {
	return new Promise((resolve, reject) => {
		fs.readdir(folder, (err, files) => {
			if (err) {
				reject(err)
			}
			resolve(files)
		});
	})
}
function getContent(filePath) {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf-8', (err, data) => {
			if (err) {
				reject(err)
			}
			resolve(data)
		})
	})
}
function saveFile(content, filePath) {
	fs.writeFile(filePath, content, function (err) {
		if (err) return console.log(err);
		console.log(`Saved ${filePath}`);
	});
}

let file;
function setCurrentFile(newFile) {
	file = newFile
}
function getCurrentFile() {
	return file
}

let folder;
function setCurrentFolder(newFolder) {
	folder = newFolder
}
function getCurrentFolder() {
	return folder
}
// async function test() {
// const testFolder = path.join(__dirname, 'songs');
// let files = await getFiles(testFolder);
// const file = path.join(testFolder, files[0])
// let content = await getContent(file);
// console.log(content)
// saveFile('bbb', path.join(testFolder, 'test'))
// }
// test();

module.exports = { getFiles, getContent, saveFile, setCurrentFile, getCurrentFile, setCurrentFolder, getCurrentFolder }