import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";
import AdmZip from "adm-zip";
import dotenv from 'dotenv';

dotenv.config();

// Error logger function
const logError = (context, error) => {
    console.error(`Error in ${context}: `, error.message || error)
}

// Function to change json installed status
const changeInstallJson = async (extensionName, setTo) => {
    try {
        // Define the filepath for json file
        const filePath = `${process.env.PATH_TO_EXTENSIONS}/extensions.json`

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
            logError('writing to json file', error)
        }
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
        logError('fetching data from zip url', error)
        return;
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
        logError('extracting and writing files', error)
        return;
    }

    try {
        // Clean up
        await fs.unlink(zipFilePath); 
    } catch(error) {
        logError('cleaning up', error)
        return;
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
        logError('deleting extension', error)
        return
    }
}