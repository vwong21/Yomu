// Importing necessary modules from Electron and Node.js
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
	checkSettings,
	retrieveExtensions,
	downloadExtension,
	removeExtension,
} from '../backend/extensions/extensions.js';
import dotenv from 'dotenv';

// temporary imports for extensions

let browseMangaDex;
const browseFunctions = {};

const updateModules = async () => {
	try {
		const module = await import(
			'../backend/extensions/MangaDex/mangadex.js'
		);
		browseMangaDex = module.browseMangaDex;
		browseFunctions.MangaDex = browseMangaDex;
		console.log('browseMangaDex loaded:', browseMangaDex);
	} catch (err) {
		console.warn('MangaDex extension not found, skipping...');
		console.error(err); // Optional for debugging
	}
};

// Example usage after loading
(async () => {
	await updateModules();
})();

// temporary imports for extensions

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

// Function to create the main application window
const createWindow = () => {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;
	mainWindow = new BrowserWindow({
		width: Math.floor(width * 0.7),
		height: Math.floor(height * 0.7),
		resizable: false,
		// Title bar styles to replace ugly default
		titleBarStyle: 'hidden',
		titleBarOverlay: {
			color: '#212121',
			symbolColor: '#ffffff',
		},
		webPreferences: {
			contextIsolation: true, // Enable context isolation for security
			devTools: true, // Allow opening dev tools
			nodeIntegration: false, // Set to false for security
			webSecurity: false, // Disable web security (consider enabling in production)
			preload: join(__dirname, 'preload.js'), // Path to the preload script
		},
	});

	// For development purposes to reload automatically
	const startURL =
		process.env.NODE_ENV === 'development'
			? 'http://localhost:3000'
			: url.format({
					pathname: join(__dirname, process.env.PATH_TO_RENDERER),
					protocol: 'file',
			  });

	// For development purposes to open dev tools
	mainWindow.webContents.openDevTools();

	// Start URL will be localhost in dev or React build in prod
	mainWindow.loadURL(startURL);
	mainWindow.on('closed', () => (mainWindow = null));
};

// Event listener for when the app is ready
app.on('ready', () => {
	createWindow();
	checkSettings();
});

// For Mac since MacOS apps keep running while all windows closed
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// For MacOS if app is running but no windows and user clicks on app, create a new window
app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

// IPC logic starts here

// Placeholder manga details
const mangaDetails = [
	{
		name: 'Naruto',
		author: 'Masashi Kishimoto',
		description: 'Naruto is an orphan who has a dangerous fox-like entity',
		image: 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781421582849/naruto-vol-72-9781421582849_hr.jpg',
	},
	{
		name: 'Dragon Ball',
		author: 'Akira Toriyama',
		description:
			'Dragon Ball is a Japanese media franchise created by Akira Toriyama in 1984',
		image: 'https://mangadex.org/covers/40bc649f-7b49-4645-859e-6cd94136e722/51c0756f-a053-46d0-a405-246a78541df2.jpg.512.jpg',
	},
	{
		name: 'One Piece',
		author: 'Eiichiro Oda',
		description:
			'Luffy is a young adventurer who has longed for a life of freedom ever since he can remember.',
		image: 'https://m.media-amazon.com/images/I/81KuBRfJwxL._AC_UF1000,1000_QL80_.jpg',
	},
];

// Function to get browse results from manga source
const browseManga = async (event, source, offset) => {
	console.log(source);
	try {
		const browseFunction = browseFunctions[source];
		if (!browseFunction) {
			throw new Error('Invalid source');
		}
		const res = await browseFunction(offset);
		console.log(res);
		return res;
	} catch (error) {
		console.error(error);
		return error;
	}
};

// Function to get the details of the list of manga and return a promise
const getMangaDetails = async () => {
	return new Promise((resolve) => {
		resolve(mangaDetails);
	});
};

// Sends browse results to renderer
ipcMain.handle('browse-manga', async (event, source, offset) => {
	return await browseManga(event, source, offset);
});

// Sends manga details to renderer
ipcMain.handle('get-manga-details', getMangaDetails);

// To call function
// downloadExtension("vwong21", "Yomu_Extensions", "MangaDex")
//     .catch((error) => {
//     console.error(error);
//     });

// removeExtension('MangaDex')

ipcMain.handle('retrieve-extensions', async () => {
	try {
		const res = await retrieveExtensions();
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
});

// Receives extension name within the folderPath variable and calls downloadAndExtractFolder
ipcMain.handle('download-extension', async (event, extensionName) => {
	try {
		const res = await downloadExtension(extensionName);
		updateModules();
		return res;
	} catch (error) {
		console.error(error);
		return error;
	}
});

ipcMain.handle('remove-extension', async (event, extensionName) => {
	try {
		const res = await removeExtension(extensionName);
		return res;
	} catch (error) {
		console.error(error);
		return error;
	}
});
