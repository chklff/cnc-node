const updateMake = require('../githubWebhookHandler.js').updateMake;
require('dotenv').config();

updateMake('scenarios/CLONE ME V4-922835.json', '/root/make-account',process.env.INSTANCE_URL, process.env.MAKE_API_KEY);