const { contextBridge, ipcRenderer } = require("electron");

// Expose api to main world (mainly renderer)
contextBridge.exposeInMainWorld("api", {
    getFavourites: () => ipcRenderer.invoke("get-manga-details"),
    DownloadExtension: (repoOwner, repoName, extensionName) =>
        ipcRenderer.invoke("download-extension", repoOwner, repoName, extensionName),
});
