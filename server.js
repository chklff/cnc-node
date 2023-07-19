const express = require('express');
const winston = require('winston');
require('dotenv').config();
const processWebhook = require('./githubWebhookHandler').processWebhook;
const app = express();
const port = process.env.PORT
const server = process.env.SERVER
const githubUsername = "chklff";
const baseURL = process.env.INSTANCE_URL; 
const token = process.env.MAKE_API_KEY; //'71022599-f619-4757-bf10-79993d74cb90';
const makeFolder = '/root/make-account'



app.use(express.json()); // This middleware is for parsing JSON in the body of the request

// Setup winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// If we're not in production then log to the console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

app.post('/update', (req, res) => {
    logger.info('Received request:', req.body);

    if (!req.body.data) {
        logger.info('Sending response:', {error: 'Missing data in request'});
        return res.status(400).send({error: 'Missing data in request'});
    }

    if (req.body.data === 'test') {
        logger.info('Sending response:', {test: 'ok'});
        return res.send({test: 'ok'});
    }

    logger.info('Sending response:', {error: 'Invalid data in request'});
    return res.status(400).send({error: 'Invalid data in request'});
});

//app.get('/scenarios', listScenarios.getScenarios);
app.get('/scenarios');

// app.post('/webhook', (req, res) => {
//   // GitHub sends the event type in the header
//   const githubEvent = req.get('X-GitHub-Event');

//   // Log the event type and payload
//   logger.info(`Received GitHub event: ${githubEvent}`);
//   logger.info('Payload:', req.body);

//   // You might want to do some validation to check that the request
//   // actually came from GitHub, perhaps checking a secret in the headers.

//   // Send a simple response
//   res.send({ message: 'Webhook received' });
// });

app.post('/webhook', (req, res) => {
  console.log(githubUsername + '\n' + makeFolder + '\n' +  baseURL + '\n' + token)
  processWebhook(req, githubUsername, makeFolder, baseURL, token);

  // Send a simple response
  res.send({ message: 'Webhook received' });
});


app.listen(port, () => {
    logger.info(`Server running at ${server}:${port}`);
});
