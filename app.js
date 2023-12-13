const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const path = require('path');

const createServer = require('./setupServer'); // HTTPS 服务器设置
const setupRoutes = require('./routes');       // 路由处理
const setupSocketEvents = require('./socketEvents'); // Socket.io 事件

const staticPath = '/www/h5-cocos-club/dist';
const port = 80;
const httpsPort = 443;

const app = express();

// 中间件配置
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(staticPath));

// 创建 HTTPS 服务器
const httpsServer = createServer(app);

// 应用路由配置
setupRoutes(app);

// 配置 Socket.io
const io = socketIO(httpsServer);
setupSocketEvents(io, httpsServer);

// 重定向所有请求到 index.html
app.get('*', function (req, res) {
    res.sendFile(path.join(staticPath, 'index.html'));
});

// 启动 HTTPS 服务器
httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS Server is running on port ${httpsPort}`);
});

// 启动 HTTP 服务器（如果需要）
app.listen(port, () => {
    console.log(`HTTP Server is running on port ${port}`);
});
