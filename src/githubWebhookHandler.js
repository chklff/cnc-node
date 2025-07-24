//githubWebhookHandler.js
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config({ path: '../.env' });



// Pulls data from your repo, make sure you've configured branch as main OR change the coomand

function gitPull(repoPath, callback) {
    exec('git reset --hard && git pull origin main', { cwd: repoPath }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        // Call the callback function when git pull completes
        callback();
    });
}



async function updateMake(file, makeFolder, baseURL, token) {
    // Extract scenarioID from the file name
    //const scenarioID = path.basename(file, '.json');
    //const fileName = "scenarios/dvesdvfsvd-asdcasdcadc-vadadvcasdvc-avdadvadsva-12345.json";
    const idMatch = file.match(/(\d+)\.json$/);
    const scenarioID = idMatch ? idMatch[1] : null; // this will be '12345'

    // Load blueprint from the JSON file
    let blueprint;
    try {
        const filePath =  makeFolder + '/' + file 
        const data = await fs.readFile(filePath, 'utf8');
        // console.log(scenarioID)
        // console.log(filePath)
        // console.log(data)
        //blueprint = JSON.parse(data);
        blueprint = data;
    } catch (err) {
        console.error(`Failed to read file: ${err}`);
        return;
    }

    // Make the PATCH request to the API
    try {
        //const response = await axios.patch(`https://hook.us1.make.com/43g5v4w3r8br1elqzdxamuehisqu9bh3`, { blueprint: JSON.stringify(blueprint) }, {
        const response = await axios.patch(`${baseURL}/api/v2/scenarios/${scenarioID}`, { blueprint }, {
            
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        console.log(`Updated scenario: ${scenarioID}`);
        console.log('Response:', response.data);
    } catch (error) {
        console.error("An error occurred:", error.message);
    
        // If the request was made and server responded with a status code
        // that falls out of the range of 2xx, error.response will be available.
        if (error.response) {
            console.log('Data:', error.response.data);
            console.log('Status:', error.response.status);
            console.log('Headers:', error.response.headers);


            console.log('URL:', error.config.url);
        

        } else if (error.request) {
            // If the request was made but no response was received, error.request will be available.
            console.log('Request:', error.request);
        } else {
            // Something else happened in setting up the request that triggered an Error
            console.log('Error message:', error.message);
        }
    
        console.log('Config:', error.config);
    }
}


function addToMake() {
    console.log("addToMake()");
}

// function updateMake() {
//     console.log("updateMake()");
// }

function removeFromMake() {
    console.log("removedFromMake()");
}

// function processWebhook(req, user, makeFolder, baseURL, token) {
//     const githubEvent = req.get('X-GitHub-Event');

//     // if (githubEvent !== 'push') {
//     //     return;
//     // }

//     const commits = req.body.commits;

//     commits.forEach(commit => {
//         const username = commit.author.username;

//         if (username === user) {
//             if (commit.added && commit.added.length > 0) {
//                 gitPull(makeFolder,() => {
//                     commit.modified.forEach(file => {
//                         addToMake(file, makeFolder, baseURL, token);
//                     });
//                 });
//             }

//             if (commit.modified && commit.modified.length > 0) {
//                 gitPull(makeFolder, () => {
//                     commit.modified.forEach(file => {
//                         updateMake(file, makeFolder, baseURL, token);
//                     });
//                 });
//             }

//             if (commit.removed && commit.removed.length > 0) {
//                 gitPull(makeFolder, () => {
//                     commit.modified.forEach(file => {
//                         removeFromMake(file, makeFolder, baseURL, token);
//                     });
//                 });
//             }
//         }
//     });
// }

async function processWebhook(req, user, makeFolder, baseURL, token) {
    const githubEvent = req.get('X-GitHub-Event');

    const commits = req.body.commits;

    for (const commit of commits) {
        const username = commit.author.username;
        const message = commit.message;

        // Run gitPull regardless of the commit message
        await new Promise((resolve) => {
            gitPull(makeFolder, resolve);
        });

        if (!message.includes("Sync From Make") && username === user) {
            // Handle scenario file renames by checking for duplicate scenario IDs
            await handleScenarioDuplicates(makeFolder);

            if (commit.added && commit.added.length > 0) {
                for (const file of commit.added) {
                    if (file.endsWith('.json') && file.includes('scenarios/')) {
                        await addToMake(file, makeFolder, baseURL, token);
                    }
                }
            }

            if (commit.modified && commit.modified.length > 0) {
                for (const file of commit.modified) {
                    if (file.endsWith('.json') && file.includes('scenarios/')) {
                        await updateMake(file, makeFolder, baseURL, token);
                    }
                }
            }

            if (commit.removed && commit.removed.length > 0) {
                for (const file of commit.removed) {
                    if (file.endsWith('.json') && file.includes('scenarios/')) {
                        await removeFromMake(file, makeFolder, baseURL, token);
                    }
                }
            }
        } else {
            console.log("Commit message contains 'Sync From Make'. Skipping update/add/remove actions for this commit.");
        }
    }
}

async function handleScenarioDuplicates(makeFolder) {
    const scenariosDir = `${makeFolder}/scenarios`;
    try {
        const files = await fs.readdir(scenariosDir);
        const scenarioFiles = files.filter(file => file.endsWith('.json'));
        
        // Group files by scenario ID
        const scenarioGroups = {};
        scenarioFiles.forEach(file => {
            const idMatch = file.match(/(\d+)\.json$/);
            if (idMatch) {
                const scenarioId = idMatch[1];
                if (!scenarioGroups[scenarioId]) {
                    scenarioGroups[scenarioId] = [];
                }
                scenarioGroups[scenarioId].push(file);
            }
        });
        
        // Remove duplicates - keep the most recently modified file
        for (const [scenarioId, duplicateFiles] of Object.entries(scenarioGroups)) {
            if (duplicateFiles.length > 1) {
                console.log(`Found ${duplicateFiles.length} files for scenario ID ${scenarioId}: ${duplicateFiles.join(', ')}`);
                
                // Get file stats to find most recent
                const fileStats = await Promise.all(
                    duplicateFiles.map(async file => {
                        const stats = await fs.stat(`${scenariosDir}/${file}`);
                        return { file, mtime: stats.mtime };
                    })
                );
                
                // Sort by modification time, keep the newest
                fileStats.sort((a, b) => b.mtime - a.mtime);
                const keepFile = fileStats[0].file;
                const filesToDelete = fileStats.slice(1).map(f => f.file);
                
                // Delete old duplicates
                for (const fileToDelete of filesToDelete) {
                    await fs.unlink(`${scenariosDir}/${fileToDelete}`);
                    console.log(`Removed duplicate scenario file: ${fileToDelete} (kept ${keepFile})`);
                }
            }
        }
    } catch (error) {
        console.log("No scenarios directory found or error reading it:", error.message);
    }
}


//module.exports = processWebhook;
module.exports = {
    processWebhook: processWebhook,
    updateMake: updateMake
};