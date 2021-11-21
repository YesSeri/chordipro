const path = require('path');
const fs = require('fs')

function File(myPath) {
	this.path = myPath;
	this.filename = path.basename(myPath);
	this.name = path.basename(myPath, ".chopro");

	this.rawContent = function () {
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, 'utf8', (err, data) => {
				if (err) {
					reject(err)
				}
				resolve(data);
			})

		})
	}
	this.getContent = async function () {
		const c = await this.rawContent();
		result = c.split(/\r?\n/);
		console.log({ c })
		const arr = result.filter(row => {
			// Lines that starts with # are comments, and should be ignored. 
			if (row.charAt(0) === "#") {
				return false;
			}
			return true;
		}).map(row => {
			const squareBracketsRe = /(\[.*?])/;
			const curlyBracketsRe = /(\{.*?})/;
			// If the line contains squarebrackets then it is music, and contains chords. It needs to be processed, and the chords seperated from the lyrics.
			if (squareBracketsRe.test(row)) {
				return getMusic(row);
			}
			// squarebrackets contains directives that needs to be processed. Directives can be for example start of chorus or end of verse. 
			if (squareBracketsRe.test(row)) {
			}
		})
		console.log({ arr }, arr[2])
	}
	function getMusic(row) {
		const splits = row.split(/(\[.*?])/);
		let text = [];
		let chords = [];
		let spaces;
		let prevChord = "[]";
		for (const el of splits) {
			if (el.charAt(0) !== "[") {
				spaces = el.length;
				text.push(el);
			} else {
				let chordInfo = {};
				const prevLen = prevChord.length - 2;
				chordInfo.chord = el;
				chordInfo.spaces = spaces - prevLen;
				chords.push(chordInfo);
				prevChord = el;
			}
		}
		return { text: text.join(""), chords }
	}
	function chordInfoToLine() {

	}
}
const p = path.join(__dirname, "songs", "Let it be.chopro")
const f = new File(p)
const c = f.getContent();

c.then(el => console.log(el))