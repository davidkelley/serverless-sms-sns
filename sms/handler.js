'use strict';

const AWS = require('aws-sdk');
const SNS = AWS.SNS;

const KEY = process.env.SERVERLESS_KEY;

const SNSConfig = {
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: process.env.SERVERLESS_REGION
}

module.exports.handler = function(event, context, cb) {
  const client = new SNS(SNSConfig);

  const message = event.payload.message;
  const number = event.payload.number;

  var response = { result: 'success' };

  var log = (msg) => {
    console.log(`[${number}] ${msg}`);
  }

  if(event.payload.key != KEY) {
    log("[2] Invalid Key");
    response.result = 'error';
    response.error = 'Invalid Key';
    cb(false, response);
    return;
  }

  client.publish({
    Message: message,
    PhoneNumber: number
  }, (err, data) => {
    if(err) {
      response.result = 'error';
      response.error = err.message;
      log(`[1] "${message}"`);
    } else {
      log(`[0] "${message}"`);
    }
    cb(null, response);
  })
};
