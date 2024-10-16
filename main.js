const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
            webSecurity: false
        };
    });
    const startURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : url.format({
        pathname: path.join(__dirname, './frontend/build/index.html'),
        protocol: 'file'
    });

    mainWindow.webContents.openDevTools();

    console.log(startURL);
    mainWindow.loadURL(startURL);
    mainWindow.on('closed', () => (mainWindow == null));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    };
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    };
});