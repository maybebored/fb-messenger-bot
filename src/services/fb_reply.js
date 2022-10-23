'use strict';

const HttpClient = require('./http_client');

const baseUrl = process.env.FB_URL

const httpClient = new HttpClient({ baseUrl });

function sendMessage(senderPsid, message) {
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
    let requestBody = {
        'recipient': {
            'id': senderPsid
        },
        message,
    };
    return httpClient.doPost('me/messages', { 'access_token': PAGE_ACCESS_TOKEN }, requestBody);
}

module.exports = {
    sendMessage
};