const WebSocket = require('ws');

let clientIdCounter = 0;
let bossClients = new Set(); // 用于存储所有boss客户端的集合
let allClients = new Set();

// 广播消息给所有已连接的客户端,除了boss
function broadcast(message, excludeClient) {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && excludeClient != client) {
            client.send(message);
        }
    });
}


module.exports = function (io, server) {
    console.log('DEBUG_LOG: setup wsserver', '');

    const wss = new WebSocket.Server({ server });

    wss.on('connection', function connection(ws) {
        const clientId = ++clientIdCounter;
        ws.clientId = clientId;
        allClients.add(ws)
        console.log(`新的客户端已连接，ID: ${clientId}`);

        ws.on('message', function (msg) {
            let json_message = msg.toString()
            console.log(`收到消息：${json_message} 从客户端ID: ${clientId}`);

            if (json_message.startsWith('identify:boss')) {
                // 标记为boss客户端
                bossClients.add(ws);
                console.log(`客户端ID: ${clientId} 被标记为boss`);
                return;
            }
            //来自boss的消息
            let message = json_message
            try {
                message = JSON.parse(json_message)
            } catch (error) {
                console.error('JSON.parse error', json_message)
                return
            }

            if (message.type == 'change') {
                broadcast(JSON.stringify(message), ws)
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
            bossClients.delete(ws);
            allClients.delete(ws);
        });
    });

    wss.on('error', function error(err) {
        console.error('WebSocket 服务器发生错误:', err);
    });
};
