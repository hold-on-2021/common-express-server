const context = require('./context')
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.json({ code: 200, message: 'Welcome to the homepage!' });
    });

    app.post('/uploadCells', async (req, res) => {
        const historyCells = JSON.parse(req.body.historyCells);
        const latestCellCore = req.body.latestCellCore;
        context.historyCells = historyCells
        context.latestCellCore = latestCellCore
        context.appliedChangeID = 0

        if (context.socket) {
            context.socket.broadcastMessage({
                type: 'UPDATE_CELLS'
            })
        }
        res.json({ code: 200, data: null });
    });
    app.get('/getCells', async (req, res) => {
        res.json({
            code: 200,
            cell: {
                historyCells: context.historyCells,
                latestCellCore: context.latestCellCore,
                appliedChangeID: context.appliedChangeID
            }
        });
    });

    app.use((req, res) => {
        res.status(404).json({ code: 404, message: 'Not Found' });
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    });
};