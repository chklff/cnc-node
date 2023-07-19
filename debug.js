const axios = require('axios');

// const fetchModuleNames = async (url, appName, version, token) => {
//     try {
//         const response = await axios.get(`${url}/v2/sdk/apps/${appName}/${version}/modules`, {
//             headers: {
//                 "Authorization": `Token ${token}`
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error(`Error making request: ${error.message}`);
//         console.error(error);
//     }
// }




// const fetchAndStoreRpcData = async (url, appName, version, moduleName, value, token) => {
//     try {
//         const response = await axios.get(`${url}/api/v2/sdk/apps/${appName}/${version}/rpcs/${moduleName}/${value}`, {
//             headers: {
//                 "Authorization": `Token ${token}`
//             }
//         });

//         // Create the apps/moduleName directory if it does not exist
//         await fs.mkdir(`apps/rpcs/${moduleName}`, { recursive: true });

//         // Write the data to a JSON file
//         await fs.writeFile(`apps/rpcs/${moduleName}/${value}.json`, JSON.stringify(response.data, null, 2));

//         return response.data;
//     } catch (error) {
//         console.error(`Error making request: ${error}`);
//     }
// }



const fetchAndConnectionsRpcData = async (url,connectionName, value, token, appName) => {
    try {
        const response = await axios.get(`${url}/api/v2/sdk/apps/${appName}/connections`, {
            headers: {
                "Authorization": `Token ${token}`
            }
        })

    
        return response.data;
    } catch (error) {
        console.error(`Error making request: ${error}`);
    }
}


// Replace with actual values
const url = 'https://us1.make.com/';
const appName = 'demotestdemo-rxghgf';
const version = '1';
const token = '1e6ee7f2-e2f9-47f5-8bd7-d48c5509c0f5';
const value = 'api';
const moduleName = 'jsontest';
const connectionName =  'demotestdemo-rxghgf'

fetchAndConnectionsRpcData(url, connectionName,  value, token, appName)
    .then(data => console.log(data))
    .catch(error => console.error(error));
