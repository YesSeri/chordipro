const path = require('path');
const fs = require('fs')


'use strict';

module.exports = class File {
	constructor(p) {
		this.path = p;
		this.filename = path.basename(p);
		this.name = path.basename(p, ".chopro");
	}
	getContent() {
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, 'utf8', (err, data) => {
				if (err) {
					reject(err)
				}
				resolve(data);
			})

		})
	}
	async toHTML() {
		const content = await f.getContent();
		const array = content.match(/[^\r\n]+/g);
		const rows = array.map(row => {
			const squareBracketsRe = /(\[.*?])/;
			const curlyBracketsRe = /(\{.*?})/;
			if (squareBracketsRe.test(row)) {
				const rowInfo = this.getRowInfo(row);
				const chordRow = this.createChordRow(rowInfo.chords)
				const twoRows = chordRow + "\n" + rowInfo.text + "\n";
				return twoRows
			} if (curlyBracketsRe.test(row)) {
				const inside = row.slice(1, -1);
				const [metaCommand, text] = inside.split(":");
				if (metaCommand.toLowerCase() === "title") {
					const newH1 = document.createElement("h1");
					newH1.text = text
					return newH1
				}
				if (metaCommand.toLowerCase() === "subtitle") {
					const newH2 = document.createElement("h2");
					newH1.text = text
					return newH2
				}
			}
		}).join("")
		console.log(rows)
	}
	getRowInfo(row) {
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
	createChordRow(chords) {
		const arr = chords.map(info => {
			// \xa0 is non-breaking space. used to put several spaces after one another in html
			return "\xa0".repeat(info.spaces) + info.chord.slice(1, -1)
		}).join("")
		return arr;
	}
}

const p = path.join(__dirname, "songs", "Hallelujah.chopro")
const f = new File(p)
f.toHTML();