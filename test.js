// test.js
const listScenarios = require('./scenarios.js');
const getApplicationFiles = require('./getapplication.js');
const getAllAppsFiles = require('./getapplication.js');



// const url = 'https://eu1.make.com';
// const organizationId = 11;
// const limit = true;
// const token = 'xxxx';

//Retrieve scenarios
(async () => {
    const result = await listScenarios('https://us1.make.com', 58, 1000, '71022599-f619-4757-bf10-79993d74cb90');
    console.log(result);
})();



// (async () => {
//     const result = await getApplicationFiles('https://us1.make.com', 'demotestdemo-rxghgf', 1, '1e6ee7f2-e2f9-47f5-8bd7-d48c5509c0f5');
//     //console.log(result);
// })();




// (async () => {
//     const result = await getAllAppsFiles('https://us1.make.com', '71022599-f619-4757-bf10-79993d74cb90');
//     //console.log(result);
// })();
