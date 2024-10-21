const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1440,
        height: 1024,
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
            webSecurity: false,
            preload: path.join(__dirname, 'preload.js')
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

// IPC logic start here

// Placeholder manga details
const mangaDetails = [
    {
        name: "Naruto",
        description: "Naruto is an orphan who has a dangerous fox-like entity",
        image: "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781421582849/naruto-vol-72-9781421582849_hr.jpg"
    },
    {
        name: "Dragon Ball",
        description: "Dragon Ball is a Japanese media franchise created by Akira Toriyama in 1984",
        image: "https://mangadex.org/covers/40bc649f-7b49-4645-859e-6cd94136e722/51c0756f-a053-46d0-a405-246a78541df2.jpg.512.jpg"
    },
    {
        name: "One Piece",
        description: "Luffy is a young adventurer who has longed for a life of freedom ever since he can remember.",
        image: "https://m.media-amazon.com/images/I/81KuBRfJwxL._AC_UF1000,1000_QL80_.jpg"
    }
]

// Function to get the details of the list of manga and return a promise
const getMangaDetails = async () => {
    return new Promise((resolve) => {
        resolve(mangaDetails)
    })
}

// Sends manga details to renderer
ipcMain.handle('get-manga-details', getMangaDetails)