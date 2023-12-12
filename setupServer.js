// setupServer.js
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

module.exports = function (app) {

    app.use(cors());

    const privateKey = fs.readFileSync(path.resolve('Nginx', 'cocos.club.key'), 'utf8');
    const certificate = fs.readFileSync(path.resolve('Nginx', 'cocos.club.crt'), 'utf8');
    const ca = fs.readFileSync(path.resolve('Nginx', 'cocos.club.pem'), 'utf8');

    const credentials = { key: privateKey, cert: certificate, ca: ca };

    return https.createServer(credentials, app);
};
