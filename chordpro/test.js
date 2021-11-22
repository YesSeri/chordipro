const { chordproComment, chordproData, chordproMinimalSong, chordproChorus, chordproDeclaration } = require("./data");

const parser = require('./parser').exportedForTesting

test('a parsed dev comment should be null', () => {
	expect(parser.parseDevComment(chordproComment)).toBe(null);
});
test('returns text without chords', () => {
	expect(parser.getLyrics(chordproData)).toBe(`Let it be, let it be`);
});
test('returns all chord and space info of row in an arr', () => {
	expect(parser.getChordAndSpaces(chordproData)).toStrictEqual(
		[
			{ chord: "Em", position: 8 },
			{ chord: "D", position: 19 },
		]
	);
});
test('returns lyrics and chord info', () => {
	expect(parser.getMusicLine(chordproData)).toStrictEqual({
		acc: [
			{ chord: "Em", position: 8 },
			{ chord: "D", position: 19 },
		],
		lyrics: `Let it be, let it be`
	});
});
test('extracts first chord after index, along with number of chars passed.', () => {
	expect(parser.getNthChordAndSpaces(chordproData, 1)).toStrictEqual({ chord: "Em", position: 8 });
	expect(parser.getNthChordAndSpaces(chordproData, 2)).toStrictEqual({ chord: "D", position: 19 });
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
	expect(parser.splitByNewline(chordproMinimalSong)).toStrictEqual(
		[`{title:Let it Be}`,
			``,
			`# This is a comment`,
			`L[Cm]et [G]it be. [Gm]`,
			`Hallelujah`]
	);
})
test('analyzes line to see if it declaration, comment, empty line, lyrics with chords or lyrics without chords.', () => {
	const split = parser.splitByNewline(chordproMinimalSong);
	expect(parser.analyzeLine(split[0])).toBe('declaration');
	expect(parser.analyzeLine(split[1])).toBe('empty');
	expect(parser.analyzeLine(split[2])).toBe('empty');
	expect(parser.analyzeLine(split[3])).toBe('music');
	expect(parser.analyzeLine(split[4])).toBe('acapella');
})
test('test if you can get declaration command and declaration argument, and if you can parse a declaration and return object', () => {
	expect(parser.getDeclarationCommand('{title: Let It Be')).toBe('title');
	expect(parser.getDeclarationCommand('{soc}')).toBe('start_of_chorus');
	expect(parser.getDeclarationArguments('{soc: final}')).toBe('final');
	expect(parser.parseDeclarationSubtype('{title: Let It Be}')).toStrictEqual({
		command: 'title', argument: 'Let It Be'
	});
});
test('test if song can be parsed and return valid arr', () => {
	expect(parser.parseSong(`{title:Let it Be}`)).toStrictEqual(
		[{
			type: 'declaration', subtype: { command: 'title', argument: 'Let it Be' }
		}]
	);
	expect(parser.parseSong(chordproData)).toStrictEqual([{
		toDisplay: {
			acc: [
				{ chord: "Em", position: 8 },
				{ chord: "D", position: 19 },
			],
			lyrics: `Let it be, let it be`
		},
		type: 'music',
		modifiers: []
	}]);
	const song = parser.parseSong(chordproMinimalSong);
	expect(song[0]).toStrictEqual(
		{
			type: 'declaration', subtype: { command: 'title', argument: 'Let it Be' }
		},

	);

	expect(song[1]).toStrictEqual(
		{
			type: 'empty',
			modifiers: []
		},
	);
	expect(song[2]).toStrictEqual(
		{
			toDisplay: {
				acc: [
					{ chord: "Cm", position: 1 },
					{ chord: "G", position: 4 },
					{ chord: "Gm", position: 11 },
				],
				lyrics: `Let it be. `
			},
			type: 'music',
			modifiers: []
		}
	);
	expect(song[3]).toStrictEqual(
		{
			toDisplay: {
				lyrics: `Hallelujah`
			},
			type: 'acapella',
			modifiers: []
		}
	);
})