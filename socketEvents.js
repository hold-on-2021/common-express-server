// socketEvents.js
const WebSocket = require('ws');

module.exports = function (io, server) {
    console.log('DEBUG_LOG:setup wsserver', '');

    // const wss = new WebSocket.Server({ port: 3000 });
    const wss = new WebSocket.Server({ server });
    
    wss.on('connection', function connection(ws) {
        console.log("新的客户端已连接");
    
        ws.on('message', function incoming(message) {
            console.log('收到消息：', message.toString());
            ws.send("收到：" + message); // 将消息回发给客户端
        });
    
        ws.on('close', function close() {
            console.log('客户端已断开连接');
        });
    });
    
    // 监听服务器实例的错误事件
    wss.on('error', function error(err) {
        console.error('WebSocket 服务器发生错误:', err);
    });
    

    // io.on('connection', (socket) => {
    //     console.log('A user connected');

    //     socket.on('message', (msg) => {
    //         io.emit('message', msg);
    //     });

    //     socket.on('disconnect', () => {
    //         console.log('A user disconnected');
    //     });

    //     // ...其他事件...
    // });
};
