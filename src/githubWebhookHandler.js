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

function processWebhook(req, user, makeFolder, baseURL, token) {
    const githubEvent = req.get('X-GitHub-Event');

    const commits = req.body.commits;

    commits.forEach(commit => {
        const username = commit.author.username;
        const message = commit.message;

        // Run gitPull regardless of the commit message
        gitPull(makeFolder, () => {
            if (!message.includes("Sync From Make")) {
                if (username === user) {
                    if (commit.added && commit.added.length > 0) {
                        commit.modified.forEach(file => {
                            addToMake(file, makeFolder, baseURL, token);
                        });
                    }

                    if (commit.modified && commit.modified.length > 0) {
                        commit.modified.forEach(file => {
                            updateMake(file, makeFolder, baseURL, token);
                        });
                    }

                    if (commit.removed && commit.removed.length > 0) {
                        commit.modified.forEach(file => {
                            removeFromMake(file, makeFolder, baseURL, token);
                        });
                    }
                }
            } else {
                console.log("Commit message contains 'Sync From Make'. Skipping update/add/remove actions for this commit.");
            }
        });
    });
}


//module.exports = processWebhook;
module.exports = {
    processWebhook: processWebhook,
    updateMake: updateMake
};