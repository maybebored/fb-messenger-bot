/**
 * Copyright 2021-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger Platform Quick Start Tutorial
 *
 * This is the completed code for the Messenger Platform quick start tutorial
 *
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
 * To run this code, you must do the following:
 *
 * 1. Deploy this code to a server running Node.js
 * 2. Run `yarn install`
 * 3. Add your VERIFY_TOKEN and PAGE_ACCESS_TOKEN to your environment vars
 */

'use strict';

// Use dotenv to read .env vars into Node
require('dotenv').config();
let { sendMessage } = require('./src/services/fb_reply');
const MessageHandler = require('./src/services/message_handler');

// Imports dependencies and set up http server
const
    express = require('express'),
    { urlencoded, json } = require('body-parser'),
    app = express();

// Parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

// Parse application/json
app.use(json());

// Respond with 'Hello World' when a GET request is made to the homepage
app.get('/', function (_req, res) {
    res.send('Hello World');
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

// Creates the endpoint for your webhook
app.post('/webhook', (req, res) => {
    let body = req.body;

    // Checks if this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            let webhookEvent = entry.messaging[0];
            console.log('---RECEIVED WEBHOOK EVENT---');
            console.log(webhookEvent);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhookEvent.message) {
                handleMessage(webhookEvent);
            } else if (webhookEvent.postback) {
                handlePostback(webhookEvent);
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {

        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
});

// proxy to send requests to fb, for now only echos
// later could do rate limiting & extra logging
app.post('/fb_echo/*', (req, res) => {
    console.log("---Request body sent to FB---");
    console.log(req.body)

    res.sendStatus(200);
})

// Handles messages events
// TODO: to be fixed
async function handleMessage(messageEvent) {
    let response;

    const senderPsid = messageEvent.sender.id;
    const receivedMessage = messageEvent.message;

    if (receivedMessage.text) {
        const msgHandler = new MessageHandler({ message: receivedMessage.text });
        response = await msgHandler.getResponse();
    }

    if (response.text) {
        sendMessage(senderPsid, response);
    }
}

// Handles messaging_postbacks events
function handlePostback(postBackEvent) {
    let response;

    const senderPsid = postBackEvent.sender.user_ref;
    const title = postBackEvent.postback.title;

    // Improvement: move switch case to a helper method
    // that returns a fully formed response or throws error
    switch (title) {
        case 'Get Started':
            response = { 'text': getRandomGreetingMessage() };
        // handle other cases in future
    }

    if (response.text) {
        sendMessage(senderPsid, response);
    }
}

function getRandomGreetingMessage() {
    const greetingMessageList = ["Hello", "Hi There", "Welcome to ACME"];
    let idx = Math.floor(Math.random() * greetingMessageList.length);
    return greetingMessageList[idx];
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});