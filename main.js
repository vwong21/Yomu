const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 800,
        resizable: false,
        // Title bar styles to replace ugly default
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: "#212121",
            symbolColor: "#ffffff"
        },
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
            webSecurity: false
        }
    });

    // For development purposes to reload automatically
    const startURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : url.format({
        pathname: path.join(__dirname, './frontend/build/index.html'),
        protocol: 'file'
    });

    // For development purposes to open dev tools
    mainWindow.webContents.openDevTools();

    // Start url will be localhost in dev or react build in prod
    mainWindow.loadURL(startURL);
    mainWindow.on('closed', () => (mainWindow == null));
};

app.on('ready', createWindow);

//For Mac since MacOS apps keep running while all windows closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    };
});

//For MacOS if app is running but no windows and user clicks on app, create a new window
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    };
});