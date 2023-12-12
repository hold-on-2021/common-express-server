// routes.js
module.exports = function(app) {
    app.get('/', function(req, res) {
        res.send('Welcome!');
    });

    app.post('/ask', async (req, res) => {
        // ...您的 /ask 路由处理逻辑...
    });

    app.post('/chat', (req, res) => {
        // ...您的 /chat 路由处理逻辑...
    });

    // ...其他路由...
};
