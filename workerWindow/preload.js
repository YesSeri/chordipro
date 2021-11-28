const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
	const view = document.getElementById('view')
	ipcRenderer.on('pdf-export-worker', (event, arg) => {
		console.log('pdfexportworker', arg)
		ipcRenderer.send('pdf-ready');
		view.innerHTML = arg;
	})
})
