import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

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
    fs.writeFileSync(zipFilePath, buffer);

    // Create the zip file in the current dir
    const zip = new AdmZip(zipFilePath);
    const extractedPath = path.resolve(`./backend/extensions`);

    // Extract folder
    zip.getEntries().forEach((entry) => {
        // Extracts only the appropriate files
        if (
            entry.entryName.startsWith(`${repoName}-${branch}/${folderPath}`) &&
            !entry.isDirectory
        ) {
            const outputPath = path.join(
                extractedPath,
                entry.entryName.replace(`${repoName}-${branch}/`, "")
            );
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, entry.getData());
        }
    });

    console.log(`Folder "${folderPath}" extracted successfully.`);

    // Clean up
    fs.unlinkSync(zipFilePath);
    return "success";
};

const addInJson = async (extension) => {
    file = fs.readFile('extensions.json', 'utf-8')
}

// downloadAndExtractFolder("vwong21", "Yomu_Extensions", "MangaDex").catch(
//     console.error
// );
