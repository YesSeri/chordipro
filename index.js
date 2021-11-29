const { app, BrowserWindow } = require('electron')
const path = require('path')
const Store = require('electron-store');
const store = new Store();
const prompt = require('electron-prompt');
const { dialog, ipcMain } = require('electron');
const fs = require('fs')

function createWindow(settings) {
	return new BrowserWindow(settings)
}

app.whenReady().then(() => {
	const mainWindow = createWindow({
		show: false,
		width: 1400,
		height: 1400,
		webPreferences: {
			preload: path.join(__dirname, 'mainWindow', 'preload.js'),
			nodeIntegration: true
		}
	})
	// Create a new worker window, to use for pdf printing. Should be invisible. 
	mainWindow.loadFile(path.join(__dirname, 'mainWindow', 'index.html'))
	mainWindow.once('ready-to-show', () => {
		mainWindow.maximize()
	})

	mainWindow.on('close', (e) => {
		e.preventDefault();
		const options = {
			type: 'question',
			buttons: ['Yes, please', 'No, thanks'],
			defaultId: 0,
			title: 'Question',
			detail: 'You are about to exit the program. Remember to save.',
			message: 'Do you want to save before exiting',
		};
		dialog.showMessageBox(mainWindow, options).then(data => {
			if (data.response === 0) {
				mainWindow.webContents.send('save-before-quit')
			} else {
				workerWindow.destroy();
				mainWindow.destroy();
			}
		})
	})

	ipcMain.on('save-before-quit-reply', async (event, arg) => {
		workerWindow.destroy();
		mainWindow.destroy();
	})

	const workerWindow = new createWindow(
		{
			show: false,
			webPreferences: {
				preload: path.join(__dirname, 'workerWindow', 'preload.js'),
			}
		}
	);
	workerWindow.loadFile(path.join('workerWindow', 'index.html'))

	ipcMain.on('export-pdf', async (event, arg) => {
		console.log('export-pdf')
		workerWindow.webContents.send('pdf-export-worker', arg)
	})

	ipcMain.on('pdf-ready', async (event, arg) => {
		const pdfPath = path.join(__dirname, 'pdf', 'temp.pdf')
		workerWindow.webContents.printToPDF({}).then(data => {
			fs.writeFile(pdfPath, data, (error) => {
				if (error) throw error
				console.log(`Wrote PDF successfully to ${pdfPath}`)
			})
		}).catch(error => {
			console.log(`Failed to write PDF to ${pdfPath}: `, error)
		})
	})

	ipcMain.on('select-dirs', async (event, arg) => {
		const result = await dialog.showOpenDialog(mainWindow, {
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
async function askSave() {

}
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

