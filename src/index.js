// Declare variables
// Menu will be used to define a custom menu
// dialog will be used to generate the open file dialog
const { app, BrowserWindow, Menu, dialog } = require('electron')
const fs = require('fs');

let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
}

// Define menu template with functions
const template = [
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      { label: 'Open',
// OnClick open showOpenDialog attached to mainWindow
        click: (menuItem, BrowserWindow, event) => {
          dialog.showOpenDialog(mainWindow, {
            title: 'Open a text file',
            properties: ['openFile']
          }).then(result => {
// If not canceled, read file content and send data to event handler opening-file of renderer
            if (result.canceled) {
              console.log('Operation canceled.');
            } else {
              fs.readFile(result.filePaths[0], 'utf8', function read(err, data) {
                mainWindow.webContents.send('opening-file', data);
              })
            }
          }).catch(err => {
            console.log('Error occured.')
          });
        }
      },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' },
      { type: 'separator' },
      { role: 'selectAll' }
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
];
const appMenu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(appMenu);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
