const { app, BrowserWindow } = require('electron')
const path = require('path')

const { dialog, ipcMain } = require('electron')

ipcMain.on('asynchronous-message', (event, arg) => {
	console.log(arg) // prints "ping"
	event.reply('asynchronous-reply', 'pong')
})

function createWindow() {
	const win = new BrowserWindow({
		show: false,
		width: 1400,
		height: 1400,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true
		}
	})

	win.loadFile('index.html')
	win.once('ready-to-show', () => {
		win.maximize()
	})
	ipcMain.on('select-dirs', async (event, arg) => {
		const result = await dialog.showOpenDialog(win, {
			properties: ['openDirectory']
		})
		event.reply('selected-dirs-reply', result.filePaths[0]);
	})
}

app.whenReady().then(() => {

	createWindow()
	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
	function getFolder() {
		const pathArray = dialog.showOpenDialog({ properties: ['openDirectory'] })
		return pathArray
	}
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

