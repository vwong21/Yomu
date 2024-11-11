import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";
import AdmZip from "adm-zip";
import dotenv from 'dotenv';

dotenv.config();

export const downloadAndExtractFolder = async (
    repoOwner,
    repoName,
    folderPath,
    branch = "main"
) => {
    // Define url of repo and filepath of specific folder
    const zipUrl = `https://github.com/${repoOwner}/${repoName}/archive/refs/heads/${branch}.zip`;
    const zipFilePath = path.resolve(`./${repoName}-${branch}.zip`);

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

    // Create the zip file in the current dir
    const zip = new AdmZip(zipFilePath);
    const extractedPath = path.resolve(`${process.env.PATH_TO_EXTENSIONS}`);

    // Extract folder
    for (const entry of zip.getEntries()) {
        // Extract only the appropriate files
        if (
            entry.entryName.startsWith(`${repoName}-${branch}/${folderPath}`) &&
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
    console.log(`Folder "${folderPath}" extracted successfully.`);
    addInJson(folderPath)

    // Clean up
    await fs.unlink(zipFilePath);
    return "success";
};

// Function to change json contents to installed
const addInJson = async (extension) => {
    const filePath = `${process.env.PATH_TO_EXTENSIONS}/extensions.json`
    const file = await fs.readFile(filePath, 'utf-8')
    const jsonFile = JSON.parse(file)
    for (const obj of jsonFile) {
        if (obj.hasOwnProperty("name") && obj.name == extension) {
            obj.installed = true
        }
    }
    console.log(jsonFile)
    const stringFile = JSON.stringify(jsonFile)
    await fs.writeFile(filePath, stringFile)
}


// downloadAndExtractFolder("vwong21", "Yomu_Extensions", "MangaDex").catch(
//     console.error
// );
