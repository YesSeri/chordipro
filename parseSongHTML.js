const { parseSong } = require('./chordpro/parser')

module.exports = function (content) {
	const songArr = parseSong(content);

	const htmlArr = songArr.filter(el => el.type != 'devComment').map(el => {
		switch (el.type) {
			case 'declaration':
				return handleDeclaration(el)
			case 'music':

				break;
			case 'empty':

				break;
			case 'acapella':
				break;
		}
	});

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
				const p = document.createElement('h1');
				p.innerText = el.subtype.argument
				return p;
			}
		case 'subtitle':
			{
				const p = document.createElement('h2');
				p.innerText = el.subtype.argument
				return p;
			}
		default:
			break;
	}
}
function handleMusic(el) {

}
function handleEmpty(el) {
	return document.createElement('p');
}
function handleAcapella(el) {

}