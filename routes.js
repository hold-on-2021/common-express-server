// routes.js
module.exports = function(app) {
    // 正常的 GET 请求
    app.get('/', function(req, res) {
        res.json({ code: 200, message: 'Welcome to the homepage!' });
    });

    // 正常的 POST 请求
    app.post('/ask', async (req, res) => {
        const question = req.body.question; // 从请求体中获取参数
        console.log("🚀 ~ file: routes.js:11 ~ app.post ~ question:", question)
        try {
            // 假设这里是一些异步操作
            const result = await someAsyncOperation(req.body.question);

            // 成功响应
            res.json({ code: 200, data: result });
        } catch (error) {
            // 处理错误
            res.status(500).json({ code: 500, message: 'Internal Server Error' });
        }
    });

    // 未找到的路由
    app.use((req, res) => {
        res.status(404).json({ code: 404, message: 'Not Found' });
    });

    // 错误处理中间件
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    });
};

// 假设的异步操作函数
async function someAsyncOperation(question) {
    // 这里是异步处理逻辑
    return '处理结果';
}
