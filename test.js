// test.js
const listScenarios = require('./scenarios.js');
const getApplicationFiles = require('./getapplication.js');
const getAllAppsFiles = require('./getapplication.js');
require('dotenv').config();

// const url = 'https://eu1.make.com';
// const organizationId = 11;
// const limit = true;
// const token = 'xxxx';

//Retrieve scenarios
(async () => {
    const result = await listScenarios(process.env.INSTANCE_URL, process.env.MAKE_ORG_ID, 1000, process.env.MAKE_API_KEY);
    console.log(result);
})();



// (async () => {
//     const result = await getApplicationFiles(process.env.INSTANCE_URL, 'demotestdemo-rxghgf', 1, '1e6ee7f2-e2f9-47f5-8bd7-d48c5509c0f5');
//     //console.log(result);
// })();




(async () => {
    const result = await getAllAppsFiles(process.env.INSTANCE_URL, process.env.MAKE_API_KEY);
    //console.log(result);
})();
