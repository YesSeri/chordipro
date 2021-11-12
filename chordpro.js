const path = require('path');
const fs = require('fs')


class File {
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
		var array = content.match(/[^\r\n]+/g);
		array.forEach(row => {
			const re = /\[.*\]/;
			if (re.test(row)) {
				console.log(row)
				const text = this.getText(row);
				console.log(text)
			}

		})

	}
	getText(row) {
		const arr = row.split("");
		let isOutsideBracket = true;
		const textArr = arr.filter(char => {
			if (char === "[") {
				isOutsideBracket = false;
			}
			if (char === "]") {
				isOutsideBracket = true;
				return false;
			}
			return isOutsideBracket;
		})
		return textArr.join("")

	}
}

const p = path.join(__dirname, "songs", "Hallelujah.chopro")
const f = new File(p)
f.toHTML();