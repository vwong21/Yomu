import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";
import AdmZip from "adm-zip";
import dotenv from 'dotenv';

dotenv.config();

// Error logger function
const logError = (context, error) => {
    const message = `Error in ${context}: ${error.message || error}`
    throw {status: "error", message: message}
}

// Function to change json installed status
const changeInstallJson = async (extensionName, setTo) => {
    try {
        // Define the filepath for json file
        const filePath = path.resolve(process.env.PATH_TO_EXTENSIONS, 'extensions.json')
        // Read the file and parse it
        const file = await fs.readFile(filePath, 'utf-8')
        const jsonFile = JSON.parse(file)

        // Check each object in the list and if the extension name is the same, mark it true
        for (const obj of jsonFile) {
            if (obj.hasOwnProperty("name") && obj.name == extensionName) {
                if (setTo) {
                    obj.installed = true
                } else {
                    obj.installed = false
                }
            }
        }

        // Convert new data to string and write it to json file
        const stringFile = JSON.stringify(jsonFile)
        await fs.writeFile(filePath, stringFile)    
        } catch(error) {
            return logError('writing to json file', error)
        }
}

// Function to check if installed extensions match json
export const checkSettings = async () => {
    // Absolute path to extensions folder and json file
    const extensionsFolderPath = path.resolve(process.env.PATH_TO_EXTENSIONS)
    const extensionsJsonPath = path.resolve(process.env.PATH_TO_EXTENSIONS, 'extensions.json')

    let folders;
    try {
        // Get directory entries
        const dirents = await fs.readdir(extensionsFolderPath, {withFileTypes: true})

        // Map out only directories to folders variable
        folders = dirents.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)
    } catch(error) {
        return logError('locating extensions folder', error)
    }


    // Get contents of json file
    let jsonFile;

    try {
        const file = await fs.readFile(extensionsJsonPath, 'utf-8')
        jsonFile = JSON.parse(file)
    } catch(error) {
        return logError('getting json file contents', error)
    }
    
    // Compare lists
    folders.forEach(extensionName => {
        const extensionObj = jsonFile.find(ext => ext.name === extensionName)
        if (extensionObj && !extensionObj.installed) {
            extensionObj.installed = true
        }
    })

    // Write to file
    try {
        const newJson = JSON.stringify(jsonFile)
        await fs.writeFile(extensionsJsonPath, newJson) 
    } catch(error) {
        return logError('writing to new file', error)
    }
    
    return {status: "success", message: "Extensions synced."}
}


// Function to download extension
export const downloadExtension = async (
    repoOwner,
    repoName,
    extensionName,
    branch = "main"
) => {
    // Define url of repo and filepath of specific folder
    const zipUrl = `https://github.com/${repoOwner}/${repoName}/archive/refs/heads/${branch}.zip`;
    const zipFilePath = path.resolve(`./${repoName}-${branch}.zip`);

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

    } catch(error) {
        return logError('fetching data from zip url', error)
    }

    try {
        // Create the zip file in the current dir
        const zip = new AdmZip(zipFilePath);
        const extractedPath = path.resolve(process.env.PATH_TO_EXTENSIONS);

        // Extract folder
        for (const entry of zip.getEntries()) {
            // Extract only the appropriate files
            if (
                entry.entryName.startsWith(`${repoName}-${branch}/${extensionName}`) &&
                !entry.isDirectory
            ) {
                const outputPath = path.join(
                    extractedPath,
                    entry.entryName.replace(`${repoName}-${branch}/`, "")
                );

                // Ensure the directory exists before writing the file
                await fs.mkdir(path.dirname(outputPath), { recursive: true });
                await fs.writeFile(outputPath, entry.getData());
            }
        }
        console.log(`Folder "${extensionName}" extracted successfully.`);

        // Call function to change installed status to true
        await changeInstallJson(extensionName, true)
    } catch(error) {
        return logError('extracting and writing files', error)
    }

    try {
        // Clean up
        await fs.unlink(zipFilePath); 
    } catch(error) {
        return logError('cleaning up', error)
    }
    
    return {status: "success", message: `${extensionName} has been installed.`};
};

// Function to delete function
export const removeExtension = async (extensionName) => {
    // Set folderpath using resolve to get absolute path
    const folderPath = path.resolve(process.env.PATH_TO_EXTENSIONS, extensionName)
    try {
        // Delete extension setting recursive to true to delete all contents. Force is turned on to prevent crashes if any error
        await fs.rm(folderPath, {recursive: true, force: true})

        // Change installation status in json file
        await changeInstallJson(extensionName, false)
        console.log(`${extensionName} has been successfully deleted`)
        return {status: "success", message: `${extensionName} has been removed.`}
    } catch(error) {
        return logError('deleting extension', error)
    }
}