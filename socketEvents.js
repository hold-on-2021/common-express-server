const WebSocket = require('ws');

let clientIdCounter = 0; // 用于为客户端分配唯一ID

module.exports = function (io, server) {
    console.log('DEBUG_LOG: setup wsserver', '');

    const wss = new WebSocket.Server({ server });
    
    wss.on('connection', function connection(ws) {
        const clientId = ++clientIdCounter; // 分配客户端ID
        ws.clientId = clientId; // 将ID附加到WebSocket实例
        console.log(`新的客户端已连接，ID: ${clientId}`);
    
        ws.on('message', function incoming(message) {
            console.log(`收到消息：${message.toString()} 从客户端ID: ${clientId}`);
            
            // 检查消息是否为广播消息
            if (message.toString().startsWith('broadcast:')) {
                // 发送广播消息
                let broadcastMsg = message.toString().slice('broadcast:'.length);
                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(`广播：${broadcastMsg}`);
                    }
                });
            } else {
                // 点对点消息回应
                ws.send(`收到：${message} (来自您的ID: ${clientId})`);
            }
        });
    
        ws.on('close', function close() {
            console.log(`客户端ID: ${clientId} 已断开连接`);
        });
    });
    
    wss.on('error', function error(err) {
        console.error('WebSocket 服务器发生错误:', err);
    });
};
