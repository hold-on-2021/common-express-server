const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const staticPath = '/www/h5-cocos-club/dist';
const port = 80;
const httpsPort = 443; // HTTPS 端口

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 读取 SSL 证书和私钥文件
const privateKey = fs.readFileSync(path.resolve('Nginx', 'cocos.club.key'), 'utf8');
const certificate = fs.readFileSync(path.resolve('Nginx', 'cocos.club.crt'), 'utf8');
const ca = fs.readFileSync(path.resolve('Nginx', 'cocos.club.pem'), 'utf8'); // 可选，如果你有 CA 中间证书链的话
console.log('DEBUG_LOG:certificate', certificate);

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca // 可选
};

// 创建 HTTPS 服务器
const httpsServer = https.createServer(credentials, app);

// 静态文件服务
app.use(express.static(staticPath));
app.get('*', function (req, res) {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// 设置跨域头
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", '3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 欢迎页面
app.get('/', function (req, res) {
  res.send('Welcome!');
});

// 处理 /ask 路由
app.post('/ask', async (req, res) => {
  // ... 你的 /ask 路由处理逻辑
});

// 处理 /chat 路由
app.post('/chat', (req, res) => {
  // ... 你的 /chat 路由处理逻辑
});

// 启动 HTTPS 服务器
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS Server is running on port ${httpsPort}`);
});

// 启动 HTTP 服务器（如果需要）
app.listen(port, () => {
  console.log(`HTTP Server is running on port ${port}`);
});
