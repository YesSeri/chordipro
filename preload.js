const { parseSong } = require("./chordpro/parser")
const path = require('path');
let folder = path.join(__dirname, 'songs')
const { insertSongsIntoSidePanel, setupModeButton } = require('./mutateView')
const modeStateMachine = require('./stateMachine')


window.addEventListener('DOMContentLoaded', () => {
	const sidePanel = document.getElementById("song-list");
	insertSongsIntoSidePanel(sidePanel, folder);
	setupModeButton();
})