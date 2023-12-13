const WebSocket = require('ws');

let clientIdCounter = 0;
let bossClients = new Set(); // 用于存储所有boss客户端的集合

module.exports = function (io, server) {
    console.log('DEBUG_LOG: setup wsserver', '');

    const wss = new WebSocket.Server({ server });

    wss.on('connection', function connection(ws) {
        const clientId = ++clientIdCounter;
        ws.clientId = clientId;
        console.log(`新的客户端已连接，ID: ${clientId}`);

        ws.on('message', function (msg) {
            let message = msg.toString()
            console.log(`收到消息：${message} 从客户端ID: ${clientId}`);

            if (message.startsWith('identify:boss')) {
                // 标记为boss客户端
                bossClients.add(ws);
                console.log(`客户端ID: ${clientId} 被标记为boss`);
                return;
            }

            // 发送消息给boss
            if (bossClients.size > 0) {
                bossClients.forEach(boss => {
                    if (boss.readyState === WebSocket.OPEN) {
                        console.log(`来自客户端ID ${clientId} 的消息: ${message}`);
                        boss.send(message)
                    }
                });
            } else {
                let message = {
                    type: "tip",
                    msg: "当前没有boss在线"
                }
                ws.send(JSON.stringify(message));
            }
        });

        ws.on('close', function close() {
            console.log(`客户端ID: ${clientId} 已断开连接`);
            // 从boss客户端集合中移除
            bossClients.delete(ws);
        });
    });

    wss.on('error', function error(err) {
        console.error('WebSocket 服务器发生错误:', err);
    });
};
