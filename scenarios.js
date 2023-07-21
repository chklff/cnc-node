// scenarios.js
const axios = require('axios');
const fs = require('fs').promises;

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
                await fs.mkdir(`../make-account/scenarios`, { recursive: true });

                // Write the blueprint to a JSON file
                await fs.writeFile(`../make-account/scenarios/${scenarioName}-${scenario.id}.json`, JSON.stringify(blueprintResponse.data.response.blueprint, null, 2));

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