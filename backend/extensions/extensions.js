import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import AdmZip from 'adm-zip';
import dotenv from 'dotenv';
import { error } from 'console';

dotenv.config();

/*
Contents
-------------------------------------
logError(context, error) => throws json {status:'error', message: `Error in ${context}: ${error.message}}

changeInstallJson(extensionName, setTo) => writes to obj in extensions.json: ? obj.name === extensionName: obj.installed = setTo

checkSettings() => writes to obj in extensions.json: for extension in jsonFile: extension.installed = folders.include(extensionName)

retrieveExtensions() => return extensionsList = returnObj = {name: obj.name, url: obj.url, description: obj.description, installed: obj.installed, image: obj.image,};

downloadExtension(extensionName, branch='main') => fetches zip file from Github url, ? entry.entryname == extensionName : extract folder

removeExtension(extensionName) => rm extensionName

*/

// Error logger function
const logError = (context, error) => {
	const message = `Error in ${context}: ${error.message || error}`;
	throw { status: 'error', message: message };
};

// Function to change json installed status
const changeInstallJson = async (extensionName, setTo) => {
	try {
		// Define the filepath for json file
		const filePath = path.resolve(
			process.env.PATH_TO_EXTENSIONS,
			'extensions.json'
		);

		// Read the file and parse it
		const file = await fs.readFile(filePath, 'utf-8');
		const jsonFile = JSON.parse(file);

		if (!setTo) {
			for (let i = 0; i < jsonFile.installed.length; i++) {
				if (jsonFile.installed[i].name === extensionName) {
					const [popped] = jsonFile.installed.splice(i, 1);

					jsonFile.downloadable.push({ ...popped });
					break;
				}
			}
		} else {
			for (let i = 0; i < jsonFile.downloadable.length; i++) {
				if (jsonFile.downloadable[i].name === extensionName) {
					const [popped] = jsonFile.downloadable.splice(i, 1);
					jsonFile.installed.push({ ...popped });
					break;
				}
			}
		}

		// Convert new data to string and write it to json file
		const stringFile = JSON.stringify(jsonFile, null, 2);
		await fs.writeFile(filePath, stringFile);
	} catch (error) {
		return logError('writing to json file', error);
	}
};

// Function to check if installed extensions match json
export const checkSettings = async () => {
	// Absolute path to extensions folder and json file
	const extensionsFolderPath = path.resolve(process.env.PATH_TO_EXTENSIONS);
	const extensionsJsonPath = path.resolve(
		process.env.PATH_TO_EXTENSIONS,
		'extensions.json'
	);

	let folders;
	try {
		// Get directory entries
		const dirents = await fs.readdir(extensionsFolderPath, {
			withFileTypes: true,
		});

		// Map out only directories to folders variable
		folders = dirents
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => dirent.name);
	} catch (error) {
		return logError('locating extensions folder', error);
	}

	// Get contents of json file
	let jsonFile;

	try {
		const file = await fs.readFile(extensionsJsonPath, 'utf-8');
		jsonFile = JSON.parse(file);
	} catch (error) {
		return logError('getting json file contents', error);
	}

	// Loop through installed and get the name. If the name is not in folders, move it to downloadable
	for (let i = 0; i < jsonFile.installed.length; i++) {
		const name = jsonFile.installed[i].name;
		if (!folders.includes(name)) {
			const [popped] = jsonFile.installed.splice(i, 1);
			jsonFile.downloadable.push({ ...popped });
		}
	}

	// Loop through downloadable and get the name. If the name is in folders, move it to installed
	for (let i = 0; i < jsonFile.downloadable.length; i++) {
		const name = jsonFile.downloadable[i].name;
		if (folders.includes(name)) {
			const [popped] = jsonFile.downloadable.splice(i, 1);
			jsonFile.installed.push({ ...popped });
		}
	}

	// Write to file
	try {
		const newJson = JSON.stringify(jsonFile);
		await fs.writeFile(extensionsJsonPath, newJson);
	} catch (error) {
		return logError('writing to new file', error);
	}

	return { status: 'success', message: 'Extensions synced.' };
};

// Function to return details on all available extensions to the renderer
export const retrieveExtensions = async () => {
	// Get filepath of json file
	const extensionsJsonPath = path.resolve(
		process.env.PATH_TO_EXTENSIONS,
		'extensions.json'
	);
	let jsonFile;
	try {
		// Read json file and convert it to json format
		const file = await fs.readFile(extensionsJsonPath, 'utf-8');
		jsonFile = JSON.parse(file);
	} catch (error) {
		return logError('reading json file', error);
	}

	return jsonFile;
};

// Function to download extension
export const downloadExtension = async (extensionName, branch = 'main') => {
	// Define url of repo and filepath of specific folder
	const zipUrl = `https://github.com/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/archive/refs/heads/main.zip`;
	const zipFilePath = path.resolve(`./${process.env.REPO_NAME}-main.zip`);

	try {
		// Use node-fetch to fetch data from the zip url in a stream
		const response = await fetch(zipUrl);
		if (!response.ok) {
			throw new Error(`Failed to download: ${response.statusText}`);
		}
		// Stream is saved into an arrayBuffer in raw binary then converted into a javascript buffer object for easier manipulation
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		// Write binaries to file
		await fs.writeFile(zipFilePath, buffer);
	} catch (error) {
		return logError('fetching data from zip url', error);
	}

	try {
		// Create the zip file in the current dir
		const zip = new AdmZip(zipFilePath);
		const extractedPath = path.resolve(process.env.PATH_TO_EXTENSIONS);

		let foundMatch = false;
		// Extract folder
		for (const entry of zip.getEntries()) {
			// Extract only the appropriate files
			if (
				entry.entryName.startsWith(
					`${process.env.REPO_NAME}-main/${extensionName}`
				) &&
				!entry.isDirectory
			) {
				const outputPath = path.join(
					extractedPath,
					entry.entryName.replace(
						`${process.env.REPO_NAME}-main/`,
						''
					)
				);

				// Ensure the directory exists before writing the file
				await fs.mkdir(path.dirname(outputPath), { recursive: true });
				await fs.writeFile(outputPath, entry.getData());
				foundMatch = true;
			}
		}
		console.log(`Folder "${extensionName}" extracted successfully.`);

		// If the folder doesn't exist, then throw an error
		if (!foundMatch) {
			return logError(
				`extracting extension. Extension doesn't exist`,
				error
			);
		}
		// Call function to change installed status to true
		await changeInstallJson(extensionName, true);
	} catch (error) {
		return logError('extracting and writing files', error);
	} finally {
		// No matter the result, delete the zip file
		await fs.unlink(zipFilePath);
	}
	return {
		status: 'success',
		message: `${extensionName} has been installed.`,
	};
};

// Function to delete function
export const removeExtension = async (extensionName) => {
	// Set folderpath using resolve to get absolute path
	const folderPath = path.resolve(
		process.env.PATH_TO_EXTENSIONS,
		extensionName
	);
	try {
		// Delete extension setting recursive to true to delete all contents. Force is turned on to prevent crashes if any error
		await fs.rm(folderPath, { recursive: true, force: true });

		// Change installation status in json file
		await changeInstallJson(extensionName, false);
		console.log(`${extensionName} has been successfully deleted`);
		return {
			status: 'success',
			message: `${extensionName} has been removed.`,
		};
	} catch (error) {
		return logError('deleting extension', error);
	}
};
