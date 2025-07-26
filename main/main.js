// Importing necessary modules from Electron and Node.js
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import { readdir } from 'fs/promises';
import {
	checkSettings,
	retrieveExtensions,
	downloadExtension,
	removeExtension,
} from '../backend/extensions/extensions.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

// Extension function registries
const browseFunctions = {};
const searchFunctions = {};

// Dynamically import all extensions
const extensionsDir = join(__dirname, '../backend/extensions');
const updateModules = async () => {
	try {
		const folders = await readdir(extensionsDir, { withFileTypes: true });

		for (const dirent of folders) {
			if (dirent.isDirectory()) {
				const extensionName = dirent.name;
				const modulePath = join(extensionsDir, extensionName, `${extensionName.toLowerCase()}.js`);
				const moduleURL = pathToFileURL(modulePath).href;

				console.log(`Attempting to load extension: ${extensionName}`);
				console.log(`Resolved module path: ${moduleURL}`);

				try {
					const module = await import(moduleURL);

					if (module.browseManga) {
						browseFunctions[extensionName] = module.browseManga;
					}
					if (module.searchManga) {
						searchFunctions[extensionName] = module.searchManga;
					}
					console.log(`✅ Loaded extension: ${extensionName}`);
				} catch (err) {
					console.warn(`⚠️ Extension ${extensionName} could not be loaded. Skipping...`);
					console.error(err.message);
				}
			}
		}
	} catch (err) {
		console.error('Error loading modules:', err);
	}
};

// Load extensions at startup
(async () => {
	await updateModules();
})();

// Function to create the main application window
const createWindow = () => {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;
	mainWindow = new BrowserWindow({
		width: Math.floor(width * 0.7),
		height: Math.floor(height * 0.7),
		resizable: false,
		titleBarStyle: 'hidden',
		titleBarOverlay: {
			color: '#212121',
			symbolColor: '#ffffff',
		},
		webPreferences: {
			contextIsolation: true,
			devTools: true,
			nodeIntegration: false,
			webSecurity: false,
			preload: join(__dirname, 'preload.js'),
		},
	});

	const startURL =
		process.env.NODE_ENV === 'development'
			? 'http://localhost:3000'
			: url.format({
					pathname: join(__dirname, process.env.PATH_TO_RENDERER),
					protocol: 'file',
			  });

	mainWindow.webContents.openDevTools();
	mainWindow.loadURL(startURL);
	mainWindow.on('closed', () => (mainWindow = null));
};

// Event listener for when the app is ready
app.on('ready', () => {
	createWindow();
	checkSettings();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

// Placeholder manga details (for mock/testing)
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
		description: 'Dragon Ball is a Japanese media franchise created by Akira Toriyama in 1984',
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

const searchManga = async (event, source, target) => {
	try {
		const searchFunction = searchFunctions[source];
		if (!searchFunction) {
			throw new Error(`Invalid source: ${source}`);
		}
		const result = await searchFunction(target)
		return result
	} catch (error) {
		console.error(error);
		return error;
	}
};

// Send browse results to renderer
const browseManga = async (event, source, offset) => {
	try {
		const browseFunction = browseFunctions[source];
		if (!browseFunction) {
			throw new Error(`Invalid source: ${source}`);
		}
		const result = await browseFunction(offset);
		return result;
	} catch (error) {
		console.error(error);
		return error;
	}
};

// Dummy manga details (optional, for testing or fallback)
const getMangaDetails = async () => {
	return new Promise((resolve) => {
		resolve(mangaDetails);
	});
};

// IPC Handlers
ipcMain.handle('search-manga', async (event, source, target) => {
	return await searchManga(event, source, target);
});

ipcMain.handle('browse-manga', async (event, source, offset) => {
	return await browseManga(event, source, offset);
});

ipcMain.handle('get-manga-details', getMangaDetails);

ipcMain.handle('retrieve-extensions', async () => {
	try {
		const res = await retrieveExtensions();
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
});

ipcMain.handle('download-extension', async (event, extensionName) => {
	try {
		const res = await downloadExtension(extensionName);
		await updateModules();
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
