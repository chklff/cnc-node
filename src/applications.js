// applications.js

const axios = require('axios');
const fs = require('fs').promises;
require('dotenv').config({ path: '../.env' });
const makeFolder = process.env.MAKE_FOLDER_PATH;



const fetchAndStoreAppData = async (url, appName, version, value, token) => {
    try {
        const response = await axios.get(`${url}/api/v2/sdk/apps/${appName}/${version}/${value}`, {
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        // Create the apps directory if it does not exist
        await fs.mkdir(`${makeFolder}/apps/${appName}`, { recursive: true });

        const filePath = `${makeFolder}/apps/${appName}/${value}.json`;
        const newContent = JSON.stringify(response.data, null, 2);
        
        // Check if file exists and content is different
        let shouldWrite = true;
        try {
            const existingContent = await fs.readFile(filePath, 'utf8');
            shouldWrite = existingContent !== newContent;
            if (shouldWrite) {
                // Debug: show what changed
                console.log(`Content changed for ${appName}/${value}.json`);
                console.log(`Old length: ${existingContent.length}, New length: ${newContent.length}`);
                if (existingContent.length === newContent.length) {
                    // Same length but different content - find the difference
                    for (let i = 0; i < existingContent.length; i++) {
                        if (existingContent[i] !== newContent[i]) {
                            console.log(`First difference at position ${i}:`);
                            console.log(`Old: "${existingContent.substring(i-10, i+10)}"`);
                            console.log(`New: "${newContent.substring(i-10, i+10)}"`);
                            break;
                        }
                    }
                }
            }
        } catch (error) {
            // File doesn't exist, write it
            console.log(`New file: ${appName}/${value}.json`);
        }

        if (shouldWrite) {
            await fs.writeFile(filePath, newContent);
            console.log(`Updated: ${appName}/${value}.json`);
        }

        return response.data;
    }  catch (error) {
        if (error.config) {
            console.log(error.config.url);
            console.log(error.config.params);
            console.log(error.config.headers);
        } else {
            console.error(`Error: ${error.message}`);
        }
    }

}



const fetchAndStoreModuleData = async (url, appName, version, moduleName, value, token) => {
    try {
        const response = await axios.get(`${url}/api/v2/sdk/apps/${appName}/${version}/modules/${moduleName}/${value}`, {
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        // Create the apps/moduleName directory if it does not exist
        await fs.mkdir(`${makeFolder}/apps/${appName}/modules/${moduleName}`, { recursive: true });

        const filePath = `${makeFolder}/apps/${appName}/modules/${moduleName}/${value}.json`;
        const newContent = JSON.stringify(response.data, null, 2);
        
        // Check if file exists and content is different
        let shouldWrite = true;
        try {
            const existingContent = await fs.readFile(filePath, 'utf8');
            shouldWrite = existingContent !== newContent;
        } catch (error) {
            // File doesn't exist, write it
        }

        if (shouldWrite) {
            await fs.writeFile(filePath, newContent);
            console.log(`Updated: ${appName}/modules/${moduleName}/${value}.json`);
        }

        return response.data;
    } catch (error) {
        console.error(`Error making request: ${error}`);
    }
}


const fetchAndStoreRpcData = async (url, appName, version, rpcName, value, token) => {
    try {
        const response = await axios.get(`${url}/api/v2/sdk/apps/${appName}/${version}/rpcs/${rpcName}/${value}`, {
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        // Create the apps/moduleName directory if it does not exist
        await fs.mkdir(`${makeFolder}/apps/${appName}/rpcs/${rpcName}`, { recursive: true });

        const filePath = `${makeFolder}/apps/${appName}/rpcs/${rpcName}/${value}.json`;
        const newContent = JSON.stringify(response.data, null, 2);
        
        // Check if file exists and content is different
        let shouldWrite = true;
        try {
            const existingContent = await fs.readFile(filePath, 'utf8');
            shouldWrite = existingContent !== newContent;
        } catch (error) {
            // File doesn't exist, write it
        }

        if (shouldWrite) {
            await fs.writeFile(filePath, newContent);
            console.log(`Updated: ${appName}/rpcs/${rpcName}/${value}.json`);
        }

        return response.data;
    } catch (error) {
        console.error(`Error making request: ${error}`);
    }
}



const fetchAndStoreFunctionsData = async (url, appName, version, functionName, token) => {
    try {
        const response = await axios.get(`${url}/api/v2/sdk/apps/${appName}/${version}/functions/${functionName}/code`, {
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        // Create the apps/moduleName directory if it does not exist
        await fs.mkdir(`${makeFolder}/apps/${appName}/functions/`, { recursive: true });

        const filePath = `${makeFolder}/apps/${appName}/functions/${functionName}.json`;
        const newContent = JSON.stringify(response.data, null, 2);
        
        // Check if file exists and content is different
        let shouldWrite = true;
        try {
            const existingContent = await fs.readFile(filePath, 'utf8');
            shouldWrite = existingContent !== newContent;
        } catch (error) {
            // File doesn't exist, write it
        }

        if (shouldWrite) {
            await fs.writeFile(filePath, newContent);
            console.log(`Updated: ${appName}/functions/${functionName}.json`);
        }

        return response.data;
    } catch (error) {
        console.error(`Error making request: ${error}`);
    }
}



const fetchAndStoreConnectionsData = async (url,appName, connectionName, value, token) => {
    try {
        const response = await axios.get(`${url}/api/v2/sdk/apps/connections/${connectionName}/${value}`, {
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        // Create the apps/moduleName directory if it does not exist
        await fs.mkdir(`${makeFolder}/apps/${appName}/connections/`, { recursive: true });

        const filePath = `${makeFolder}/apps/${appName}/connections/${value}.json`;
        const newContent = JSON.stringify(response.data, null, 2);
        
        // Check if file exists and content is different
        let shouldWrite = true;
        try {
            const existingContent = await fs.readFile(filePath, 'utf8');
            shouldWrite = existingContent !== newContent;
        } catch (error) {
            // File doesn't exist, write it
        }

        if (shouldWrite) {
            await fs.writeFile(filePath, newContent);
            console.log(`Updated: ${appName}/connections/${value}.json`);
        }

        return response.data;
    } catch (error) {
        console.error(`Error making request: ${error}`);
    }
}




const fetchAndStoreWebhooksData = async (url, appName, webhookName, value, token) => {
    try {
        const response = await axios.get(`${url}/api/v2/sdk/apps/webhooks/${webhookName}/${value}`, {
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        // Create the apps/moduleName directory if it does not exist
        await fs.mkdir(`${makeFolder}/apps/${appName}/webhooks/`, { recursive: true });

        const filePath = `${makeFolder}/apps/${appName}/webhooks/${value}.json`;
        const newContent = JSON.stringify(response.data, null, 2);
        
        // Check if file exists and content is different
        let shouldWrite = true;
        try {
            const existingContent = await fs.readFile(filePath, 'utf8');
            shouldWrite = existingContent !== newContent;
        } catch (error) {
            // File doesn't exist, write it
        }

        if (shouldWrite) {
            await fs.writeFile(filePath, newContent);
            console.log(`Updated: ${appName}/webhooks/${value}.json`);
        }

        return response.data;
    } catch (error) {
        console.error(`Error making request: ${error}`);
    }
}





const getApplicationFiles = async (url, appName, version, token) => {
    const values = ['base', 'groups', 'install', 'installSpec'];

    const appResults = await Promise.all(values.map(value => fetchAndStoreAppData(url, appName, version, value, token)));

    // Get the module names

    // Run both requests in parallel
    const [moduleResponse, rpcsResponse, functionResponse, connectionsResponse, webhooksResponse] = await Promise.all([
        axios.get(`${url}/api/v2/sdk/apps/${appName}/${version}/modules`, {
            headers: {
                "Authorization": `Token ${token}`
            }
        }),
        axios.get(`${url}/api/v2/sdk/apps/${appName}/${version}/rpcs`, {
            headers: {
                "Authorization": `Token ${token}`
            }
        }),
        axios.get(`${url}/api/v2/sdk/apps/${appName}/${version}/functions`, {
            headers: {
                "Authorization": `Token ${token}`
            }
        }),
        axios.get(`${url}/api/v2/sdk/apps/${appName}/connections`, {
            headers: {
                "Authorization": `Token ${token}`
            }
        }),
        axios.get(`${url}/api/v2/sdk/apps/${appName}/webhooks`, {
            headers: {
                "Authorization": `Token ${token}`
            }
        })
    ]);

    const modules = moduleResponse.data.appModules;
    const rpcs = rpcsResponse.data.appRpcs;
    const functions = functionResponse.data.appFunctions;
    const connections = connectionsResponse.data.appConnections
    const webhooks = webhooksResponse.data.appWebhooks

    console.log(webhooks)

    // For each module and rpcs, get and store the module and rpc data
    const moduleValues = ['api', 'epoch', 'parameters', 'expect', 'interface', 'samples', 'scope'];
    const rpcsValues = ['api', 'parameters'];
    const connectionsValues = ['api', 'parameters', 'install', 'installSpec', 'scope', 'scopes'];
    const webhooksValues = ['api', 'parameters', 'attach', 'detach', 'update', 'scope'];


    const moduleResults = await Promise.all(modules.map(async module => {
        return Promise.all(moduleValues.map(value =>  fetchAndStoreModuleData(url, appName, version, module.name, value, token)));
    }));

    const rpcsResults = await Promise.all(rpcs.map(async rpc => {
        return Promise.all(rpcsValues.map(value =>  fetchAndStoreRpcData(url, appName, version, rpc.name, value, token)));
    }));

    // Test with working custom  IMLs in account
    const functionResults = await Promise.all(functions.map(async afunction => {
        //return Promise.all(fetchAndStoreFunctionsData(url, appName, version, afunction.name, token));
        return fetchAndStoreFunctionsData(url, appName, version, afunction.name, token);
    }));
  
    const connectionResults = await Promise.all(connections.map(async connection => {
        return Promise.all(connectionsValues.map(value =>  fetchAndStoreConnectionsData(url, appName, connection.name, value, token)));
    }));


    const webhookResults = await Promise.all(webhooks.map(async webhook => {
        return Promise.all(webhooksValues.map(value =>  fetchAndStoreWebhooksData(url, appName, webhook.name, value, token)));
    }));



}


// const getApplicationFiles = async (url, appName, version, token) => {
//     const values = ['base', 'groups', 'install', 'installSpec'];

//     const results = await Promise.all(values.map(value => fetchAndStoreAppData(url, appName, version, value, token)));

//     return results;
// }

module.exports =  getApplicationFiles




const getAllAppsFiles = async (url, token) => {
    try {
        // Get list of all apps
        const response = await axios.get(`${url}/api/v2/sdk/apps`, {
            headers: {
                "Authorization": `Token ${token}`
            }
        });

        // Destructure apps from the response
        const { apps } = response.data;

        // Calculate delay to avoid hitting rate limit
        const delay = Math.ceil(60 / (240 / apps.length)) * 1000;

        // Iterate over all apps and fetch their files
        for (let app of apps) {
            console.log(`Fetching files for app: ${app.name}`);
            await getApplicationFiles(url, app.name, app.version, token);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    } catch (error) {
        console.error(`Error making request: ${error}`);
        
    }
}

module.exports = getAllAppsFiles;

