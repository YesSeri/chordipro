const { parseSong } = require('./chordpro/parser')

module.exports = function (content) {
	const songArr = parseSong(content);

	const htmlArr = songArr.filter(el => el.type !== 'devComment' && el?.subtype?.command !== 'start_of_chorus' && el?.subtype?.command !== 'end_of_chorus')
		.map(el => {
			switch (el.type) {
				case 'declaration':
					return handleDeclaration(el)
				case 'music':
					return handleMusic(el)
				case 'empty':
					return handleEmpty(el)
				case 'acapella':
					return handleAcapella(el)
			}
		});

	console.log(htmlArr)
	let HTML = document.createElement('div');
	htmlArr.forEach(el => {
		HTML.appendChild(el);
	});

	return HTML
}
function handleDeclaration(el) {
	switch (el.subtype.command) {
		case 'title':
			{
				const h1 = document.createElement('h1');
				h1.innerText = el.subtype.argument
				return h1;
			}
		case 'subtitle':
			{
				const h2 = document.createElement('h2');
				h2.innerText = el.subtype.argument
				return h2;
			}
		case 'comment':
			{
				const span = document.createElement('span');
				span.classList.add('comment')
				span.innerText = el.subtype.argument
				return span;
			}
	}
}
function handleMusic(el) {
	// const music = {
	// 	content: {
	// 		acc: [
	// 			{ chord: "Em", position: 3 },
	// 			{ chord: "D", position: 19 },
	// 		],
	// 		lyrics: `Time to say goodbye`
	// 	}
	const chordHTML = createChordHTML(el.content.acc)
	const lyricHTML = createLyricHTML(el.content.lyrics)
	const div = document.createElement('div');
	div.appendChild(chordHTML)
	div.appendChild(lyricHTML)
	if (el.modifiers.includes('chorus')) {
		div.classList.add('chorus')
	}
	return div;
}
function createChordHTML(acc) {
	let row = ""
	const pos = acc[0].position;
	row += '&nbsp;'.repeat(pos);
	row += acc[0].chord;
	for (let i = 1; i < acc.length; i++) {
		// Number of spaces to repeat. Current position minus prev position and previous positions chord length;
		const x = acc[i].position - acc[i - 1].position - acc[i - 1].chord.length;
		row += '&nbsp;'.repeat(x);
		row += acc[i].chord;
	}
	const p = document.createElement('p');
	p.classList.add('chord-line')
	p.innerHTML = row;
	return p;
}
function createLyricHTML(lyrics) {
	const p = document.createElement('p');
	p.classList.add('chord-line')
	p.innerText = lyrics;
	return p;
}
function handleEmpty(el) {
	return document.createElement('p');
}
function handleAcapella(el) {
	const p = document.createElement('p');
	p.innerText = el.content.lyrics;
	return p;
}
// const song = {
// 	acc: [
// 		{ chord: "Em", position: 8 },
// 		{ chord: "D", position: 19 },
// 	],
// 	lyrics: `Let it be, let it be`
// };

// createChordHTML(song.acc);
// console.log(song.lyrics);