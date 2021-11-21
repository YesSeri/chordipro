const { chordproComment, chordproData, chordproSong, chordproMinmalSong } = require("./data");

const parser = require('./parser')

test('a parsed comment should be an empty string', () => {
	expect(parser.parseComment(chordproComment)).toBe("");
});
test('extracts first chord after index, along with number of chars passed.', () => {
	expect(parser.getNthChordAndSpaces(chordproData, 1)).toStrictEqual({ chord: "Em", spaces: 8 });
	expect(parser.getNthChordAndSpaces(chordproData, 2)).toStrictEqual({ chord: "D", spaces: 19 });
	expect(parser.getNthChordAndSpaces(chordproData, 3)).toBe(null);
});

test('remove chord n times', () => {
	expect(parser.removeChordNTimes(chordproData, 1)).toBe('Let it be, let it b[D]e');
	expect(parser.removeChordNTimes(chordproData, 2)).toBe('Let it be, let it be');
});
test('replace first occurence of the regex phrase.', () => {
	const squareBracketsRe = /(\[.*?])/;
	expect(parser.replaceFirstOccurence(chordproData, squareBracketsRe)).toBe('Let it be, let it b[D]e');
});
test('split song into array by newline', () => {
	expect(parser.splitByNewline(chordproMinmalSong)).toStrictEqual(
		[`{title:Let it Be}`,
			``,
			`# This is a comment`,
			`L[Cm]et [G]it be. [Gm]`,
			`Hallelujah`]
	);
})
test('analyzes line to see if it declaration, comment, empty line, lyrics with chords or lyrics without chords.', () => {
	const split = parser.splitByNewline(chordproMinmalSong);
	expect(parser.analyzeLine(split[0])).toBe('declaration');
	expect(parser.analyzeLine(split[1])).toBe('empty');
	expect(parser.analyzeLine(split[2])).toBe('empty');
	expect(parser.analyzeLine(split[3])).toBe('music');
	expect(parser.analyzeLine(split[4])).toBe('acapella');
})