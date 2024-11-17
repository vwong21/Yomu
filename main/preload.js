const { contextBridge, ipcRenderer } = require('electron');

// Expose api to main world (mainly renderer)
contextBridge.exposeInMainWorld('api', {
	getFavourites: () => ipcRenderer.invoke('get-manga-details'),
	retrieveExtensions: () => ipcRenderer.invoke('retrieve-extensions'),
	downloadExtension: (extensionName) =>
		ipcRenderer.invoke('download-extension', extensionName),
	removeExtension: (extensionName) =>
		ipcRenderer.invoke('remove-extension', extensionName),
});
