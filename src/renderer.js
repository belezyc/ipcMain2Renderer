const { ipcRenderer } = require('electron');

// Define event opening-file. When called, write data to DIV named 'content'
ipcRenderer.on('opening-file', (evt, data) => {
  document.getElementById('content').innerHTML = data;
})
