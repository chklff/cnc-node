// scenarios.js
const axios = require('axios');
const fs = require('fs').promises;
require('dotenv').config({ path: '../.env' });
const makeFolder = process.env.MAKE_FOLDER_PATH;

const listScenarios = async (url, organizationId, limit, token) => {
    try {
        const response = await axios.get(`${url}/api/v2/scenarios`, {
            params: {
                organizationId: organizationId,
                'pg[offset]':0,
                'pg[limit]': limit
            },
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        const scenarios = response.data.scenarios;
        console.log(`Number of scenarios: ${scenarios.length}`);

        let fileCount = 0;

        const blueprints = await Promise.all(scenarios.map(async scenario => {
            try {
                const blueprintResponse = await axios.get(`${url}/api/v2/scenarios/${scenario.id}/blueprint`, {
                    headers: {
                        "Authorization": `Token ${token}`
                    }
                });

                let scenarioName = blueprintResponse.data.response.blueprint.name;

                scenarioName = scenarioName.replace(/[/\\?%*:|"<>]/g, '_');

                // Create the scenarios directory if it does not exist
                const scenariosDir = `${makeFolder}/scenarios`;
                await fs.mkdir(scenariosDir, { recursive: true });

                // Check if a file with this scenario ID already exists (handles renames)
                let existingFile = null;
                try {
                    const files = await fs.readdir(scenariosDir);
                    console.log(`Checking scenario ID ${scenario.id} in files:`, files.filter(f => f.endsWith('.json')));
                    existingFile = files.find(file => file.endsWith(`-${scenario.id}.json`));
                    console.log(`Found existing file for scenario ${scenario.id}:`, existingFile);
                } catch (error) {
                    console.log(`Directory ${scenariosDir} doesn't exist yet`);
                }
                
                const newFileName = `${scenarioName}-${scenario.id}.json`;
                const newFilePath = `${scenariosDir}/${newFileName}`;

                console.log(`Processing scenario ${scenario.id}: old="${existingFile}" new="${newFileName}"`);

                if (existingFile && existingFile !== newFileName) {
                    // Scenario was renamed - delete old file
                    console.log(`Deleting old file: ${scenariosDir}/${existingFile}`);
                    await fs.unlink(`${scenariosDir}/${existingFile}`);
                    console.log(`Renamed scenario: ${existingFile} -> ${newFileName}`);
                } else if (existingFile === newFileName) {
                    console.log(`File name unchanged for scenario ${scenario.id}: ${newFileName}`);
                } else {
                    console.log(`New scenario file for ${scenario.id}: ${newFileName}`);
                }

                // Write the blueprint to a JSON file
                await fs.writeFile(newFilePath, JSON.stringify(blueprintResponse.data.response.blueprint, null, 2));

                // Increment the file count
                fileCount++;
                
                return blueprintResponse.data.response.blueprint;
            } catch (error) {
                console.error(`Error making blueprint request: ${error}`);
            }
        }));

        console.log(`Number of files written: ${fileCount}`);

        return blueprints;
    } catch (error) {
        console.error(`Error making request: ${error}`);
        // ... rest of your error handling code ...
    }
}

// const listOrginizations = async (url,  limit, token) => {
//     try {
//     }
// }

module.exports = listScenarios; // Use this instead of `export default`

// module.exports = listOrginizations;