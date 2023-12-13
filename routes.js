// routes.js
module.exports = function(app) {
    app.get('/', function(req, res) {
        res.json({ code: 200, message: 'Welcome to the homepage!' });
    });

    app.post('/getAnswer', async (req, res) => {
        const question = req.body.question;
        console.log('DEBUG_LOG:API getAnswer', question);
        console.log("🚀 ~ file: routes.js:11 ~ app.post ~ question:", question)
        try {
            res.json({ code: 200, data: result });
        } catch (error) {
            res.status(500).json({ code: 500, message: 'Internal Server Error' });
        }
    });
    app.post('/uploadHTML', async (req, res) => {
        const fullHTML = req.body.fullHTML;
        console.log("DEBUG_LOG:API fullHTML", fullHTML.length)
        try {
            const result = await saveFullHTML(fullHTML);
            res.json({ code: 200, data: result });
        } catch (error) {
            res.status(500).json({ code: 500, message: 'Internal Server Error' });
        }
    });

    app.use((req, res) => {
        res.status(404).json({ code: 404, message: 'Not Found' });
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    });
};

async function saveFullHTML(fullHTML) {
    global.fullHTML = fullHTML
    console.log('DEBUG_LOG:saveFullHTML', fullHTML.length);
    return
}
