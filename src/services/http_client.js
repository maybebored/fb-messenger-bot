var httpClient = require('http-client');

module.exports = class HttpClient {
    constructor({ baseUrl }) {
        this.baseUrl = baseUrl;
    }

    doGet(path, params) {
        let client = httpClient.createFetch(
            httpClient.base(this.baseUrl),
            httpClient.accept('application/json'),
            httpClient.parse('json'),
            httpClient.method('GET'),
            httpClient.params(params),
        );
        client(path).then(response => {
            console.log(response.jsonData);
        })
    }

    doPost(path, params, body) {
        let client = httpClient.createFetch(
            httpClient.base(this.baseUrl),
            httpClient.accept('application/json'),
            httpClient.parse('json'),
            httpClient.method('POST'),
            httpClient.params(params),
            httpClient.body(JSON.stringify(body)),
        );
        client(path).then(response => {
            console.log(response.body);
        })
    }
};