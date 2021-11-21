const squareBracketsRe = /\[.*?]/;

function parseComment() {
	return "";
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
	const spaces = matches.index
	return { chord: chord, spaces }
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
	console.log(line)
	if (line.trim() === '' || line.trim().charAt(0) === '#') {
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
function analyzeDeclaration(line) {

}
function analyzeChord() {

}
// All info needed for electron to then turn this info into html. Each line will be a new el in array. So final product delievered from parseSong() will be an array of htmlInfo.
// Needs metaInfo and what to display. The metainfo will affect which class gets assigned. The displayText is the defactor innerText.

// Examples
const music = {
	displayText: `
 	 Em				  Dm
 	Time to say goodbye`,
	info: {
		type: 'music',
		modifiers: ['chorus']
	},
}
const chorusInit = {
	displayText: null,
	info: {
		type: 'declaration',
	},
}
const functionalComment = {
	displayText: 'Chorus',
	info: {
		type: 'functionalComment',
	},
}

function htmlInfo() {

}
// parseSong needs to contain modifiers for if it currently is a chorus and other things that will later affect how the text should be displayed. 
function parseSong(song) {
	const arr = splitByNewline(song);
}
module.exports = { parseComment, replaceFirstOccurence, removeChordNTimes, getNthChordAndSpaces, splitByNewline, analyzeLine }