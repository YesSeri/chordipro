const path = require('path');
const { insertSongsIntoSidePanel, setupButtons } = require('./mutateView')

window.addEventListener('DOMContentLoaded', () => {
	insertSongsIntoSidePanel();
	setupButtons();
})
