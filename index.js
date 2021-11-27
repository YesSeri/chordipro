const { app, BrowserWindow } = require('electron')
const path = require('path')
const Store = require('electron-store');
const store = new Store();
const prompt = require('electron-prompt');
console.log(prompt)

const { dialog, ipcMain } = require('electron')

function createWindow() {
	return new BrowserWindow({
		show: false,
		width: 1400,
		height: 1400,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true
		}
	})
}

app.whenReady().then(() => {
	const win = createWindow()

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

	ipcMain.on('prompt-name', async (event, arg) => {
		const result = await promptName();
		event.reply('prompt-name-reply', result);
	})

	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})


})
async function promptName() {
	return new Promise((res, rej) => {
		prompt({
			title: 'Create New File in Current Folder',
			label: 'Filename:',
			value: '',
			inputAttrs: {
				type: 'text',
				required: true,
			},
			type: 'input'
		})
			.then((r) => {
				if (r === null) {
					rej(r)
				} else {
					res(r)
				}
			})
			.catch(console.error);
	})
}

ipcMain.on('set-folder', (event, arg) => {
	store.set('folder', arg);
})
ipcMain.on('get-folder', (event) => {
	const folder = store.get('folder')
	event.reply('get-folder-reply', folder);
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

