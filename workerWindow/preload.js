const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
	const view = document.getElementById('view')
	ipcRenderer.on('pdf-export-worker', (event, arg) => {
		view.innerHTML = arg;
		ipcRenderer.send('pdf-ready');
	})
})
