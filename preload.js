const { parseSong } = require("./chordpro/parser")
const path = require('path');
let folder = path.join(__dirname, 'songs')
const { insertSongsIntoSidePanel } = require('./mutateView')
const modeStateMachine = require('./stateMachine')


window.addEventListener('DOMContentLoaded', () => {
	const sidePanel = document.getElementById("song-list");
	const modeButton = document.getElementById("mode-button")
	modeButton.addEventListener('click', () => modeStateMachine.dispatch('switch'));
	insertSongsIntoSidePanel(sidePanel, folder);
})