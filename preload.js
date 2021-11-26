const { insertSongsIntoSidePanel, setupButtons, setupConnectionMain } = require('./mutateView')

window.addEventListener('DOMContentLoaded', () => {
	setupConnectionMain();
	insertSongsIntoSidePanel();
	setupButtons();
})
