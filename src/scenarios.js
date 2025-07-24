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
                await fs.mkdir(`${makeFolder}/scenarios`, { recursive: true });

                // Check if a file with this scenario ID already exists (handles renames)
                const scenariosDir = `${makeFolder}/scenarios`;
                const files = await fs.readdir(scenariosDir);
                const existingFile = files.find(file => file.endsWith(`-${scenario.id}.json`));
                
                const newFileName = `${scenarioName}-${scenario.id}.json`;
                const newFilePath = `${scenariosDir}/${newFileName}`;

                if (existingFile && existingFile !== newFileName) {
                    // Scenario was renamed - delete old file
                    await fs.unlink(`${scenariosDir}/${existingFile}`);
                    console.log(`Renamed scenario: ${existingFile} -> ${newFileName}`);
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