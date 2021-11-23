const squareBracketsRe = /\[.*?]/;

function parseDevComment() {
	return null;
}
function replaceFirstOccurence(text, searchPhrase) {
	return text.replace(searchPhrase, "")
}
function removeChordNTimes(text, times) {
	for (let i = 0; i < times; i++) {
		text = replaceFirstOccurence(text, squareBracketsRe);
	}
	return text;
}
// First chord is 1. Returns null if match not found.
function getNthChordAndSpaces(text, n) {
	if (n < 1) {
		throw new Error("To low value. No chord can be found before position 1.")
	}
	text = removeChordNTimes(text, n - 1)
	const matches = text.match(squareBracketsRe);
	if (matches === null) {
		return null
	}
	// The match value looks like this [G]. We remove the square brackets with the slice. 
	const chord = matches[0].slice(1, -1)
	const position = matches.index
	return { chord, position }
}
function getChordAndSpaces(text) {
	let i = 1;
	let chordSpaceArr = [];
	while (true) {
		const chordInfo = getNthChordAndSpaces(text, i);
		i++;
		if (!chordInfo) {
			break;
		}
		chordSpaceArr.push(chordInfo);
	}
	return chordSpaceArr
}
function getLyrics(text) {
	// Removes all chords from lyrics
	return text.replace(/\[.*?]/g, '');
}
function getMusicLine(line) {
	return {
		acc: getChordAndSpaces(line), lyrics: getLyrics(line)
	}


}


function splitByNewline(text) {
	return text.replace(/\r/g, "").split(/\n/);
}

// Looks at line and figures out if it is 
// - declaration {} 
// - comment #
// - song text and chords | let it b[D]e
// - song text no chords, a capella for example | let it be
function analyzeLine(line) {
	if (line.trim().charAt(0) === '#') {
		return "devComment"
	}
	if (line.trim() === '') {
		return "empty"
	}
	if (line.trim().charAt(0) === '{') {
		return "declaration"
	}
	if (line.includes('[')) {
		return "music"
	}
	return 'acapella'
}

function getDeclarationCommand(line) {
	const [command] = line.slice(1, -1).split(':');
	if (command === 'soc' || command === 'start_of_chorus') {
		return 'start_of_chorus';
	}
	if (command === 'eoc' || command === 'end_of_chorus') {
		return 'end_of_chorus';
	}
	if (command === 'title') {
		return command
	}
	if (command === 'subtitle') {
		return command
	}
	if (command === 'c' || command === 'comment') {
		return 'comment'
	}
}
function getDeclarationArguments(line) {
	// slice removes the square brackets.
	const [, argument] = line.slice(1, -1).split(':');
	return argument.trim();
}
function parseDeclarationSubtype(line) {
	return {
		command: getDeclarationCommand(line),
		argument: getDeclarationArguments(line)
	}
}
function analyzeChord() {

}


function htmlInfo(line, modifiers) {

	let modArr = [];
	if (modifiers.chorus) {
		modArr.push('chorus')
	}

	const type = analyzeLine(line);
	if (type === 'music') {
		return {
			content: getMusicLine(line),
			type,
			modifiers: [...modArr]
		}
	}
	if (type === 'declaration') {
		const subtype = parseDeclarationSubtype(line)
		return {
			type, subtype
		}
	}
	if (type === "acapella") {
		return {
			content: {
				lyrics: line
			},
			type,
			modifiers: [...modArr]
		}
	}
	if (type === "devComment") {
		return {
			type,
			content: line.slice(1).trim()
		}
	}
	if (type === "empty") {
		return {
			type,
			modifiers: [...modArr]
		}
	}

}
// parseSong needs to contain modifiers for if it currently is a chorus and other things that will later affect how the text should be displayed. 
function parseSong(song) {
	let modifiers = { chorus: false }
	const arr = splitByNewline(song);
	const infoArr = arr.map(el => {
		const info = htmlInfo(el, modifiers);
		if (info?.subtype?.command === "start_of_chorus") {
			modifiers.chorus = true;
		}
		if (info?.subtype?.command === "end_of_chorus") {
			modifiers.chorus = false;
		}
		return info
	})
	return infoArr
}
// All info needed for electron to then turn this info into html. Each line will be a new el in array. So final product delievered from parseSong() will be an array of htmlInfo.
// Needs metaInfo and what to display. The metainfo will affect which class gets assigned. The displayText is the defactor innerText.

// Examples
// const music = {
// 	content: {
// 		acc: [
// 			{ chord: "Em", position: 3 },
// 			{ chord: "D", position: 19 },
// 		],
// 		lyrics: `Time to say goodbye`
// 	},
// 	type: 'music',
// 	modifiers: ['chorus']
// }
// const title = {
// 	type: 'declaration', subtype: { command: 'title', argument: 'Bohemian Rhapsody' }
// }
// const chorusInit = {
// 	type: 'declaration', subtype: { command: 'start_of_chorus', argument: "" },
// }
// const chorusInit = {
// 	type: 'declaration', subtype: { command: 'start_of_chorus', argument: "" },
// }
//
const exportedForTesting = {
	parseDevComment,
	replaceFirstOccurence,
	removeChordNTimes,
	getNthChordAndSpaces,
	splitByNewline,
	analyzeLine,
	getLyrics,
	getChordAndSpaces,
	parseSong,
	getDeclarationCommand,
	getDeclarationArguments,
	parseDeclarationSubtype,
	getMusicLine,
}
module.exports = { exportedForTesting, parseSong }