const { contextBridge, ipcRenderer } = require('electron');

// Expose api to main world (mainly renderer)
contextBridge.exposeInMainWorld('api', {
	getFavourites: () => ipcRenderer.invoke('get-manga-details'),
	retrieveExtensions: (installed) =>
		ipcRenderer.invoke('retrieve-extensions', installed),
	downloadExtension: (repoOwner, repoName, extensionName) =>
		ipcRenderer.invoke(
			'download-extension',
			repoOwner,
			repoName,
			extensionName
		),
	removeExtension: (extensionName) =>
		ipcRenderer.invoke('remove-extension', extensionName),
});
