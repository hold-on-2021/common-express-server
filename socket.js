const WebSocket = require('ws');
const utils = require('./utils');
const context = require('./context')

class WebSocketServer {
    constructor(server) {
        this.$wss = new WebSocket.Server({ server });
        this.$clientID = 0;
        this.$gptClients = new Set();
        this.$userClients = new Set();

        this.$wss.on('connection', (ws) => {
            this.handleConnection(ws)
        });
        this.$wss.on('error', (err) => {
            this.handleError(err)
        });
        context.socket = this
    }

    broadcastMessage(message) {
        let msgStr = JSON.stringify(message)
        this.$userClients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msgStr);
            }
        });
    }

    handleConnection(ws) {
        const cid = ++this.$clientID;
        ws.clientId = cid;
        this.$userClients.add(ws);
        console.log(`新的客户端已连接，ID: ${cid}`);

        let __pass_back_msg = (msg) => {
            ws.send(JSON.stringify(msg))
        }
        let __send_to_gpt = (msg) => {
            let message = JSON.stringify(msg)
            console.log('DEBUG_LOG:__send_to_gpt', message);
            this.$gptClients.forEach(client => {
                console.log('DEBUG_LOG:client.readyState', client.readyState);
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message)
                }
            });
        }

        ws.on('message', (msgBuffer) => {
            let msgStr = msgBuffer.toString();
            let message = JSON.parse(msgStr)

            console.log(`收到消息：${msgStr} ID: ${cid}`);
            if (message.from = 'GPT') {
                // Messages from GPT
                if (message.type == 'BOOT') {
                    this.$gptClients.add(ws);
                    if (this.$userClients.has(ws)) {
                        this.$userClients.delete(ws);
                    }

                    context.appliedChangeID = 0
                    context.historyCells = []
                    context.latestCellCore = ''
                } else if (message.type == 'CHANGE') {
                    context.latestCellCore = utils.applyDiff(context.latestCellCore, message.change)
                    context.appliedChangeID = message.changeID

                    __pass_back_msg({
                        from: 'SERVER',
                        type: 'SYNC_CHANGE_ID',
                        to: 'GPT',
                        changeID: message.changeID
                    })
                    this.broadcastMessage(message)
                }
            } else {
                // Messages from USER
                console.log('DEBUG_LOG:Messages from USER', message.to);
                if (message.to == 'GPT' || !message.to) {
                    console.log('DEBUG_LOG:this.$gptClients', this.$gptClients.size);
                    if (this.$gptClients.size > 0) {
                        __send_to_gpt(message)
                    } else {
                        __pass_back_msg({
                            from: 'SERVER',
                            to: 'USER',
                            type: "TIP",
                            info: "当前没有GPT服务器在线"
                        })
                    }
                }
            }

        });

        ws.on('close', () => {
            console.log(`客户端ID: ${cid} 已断开连接`);
            this.$gptClients.delete(ws);
            this.$userClients.delete(ws);
        });
    }

    handleError(err) {
        console.error('WebSocket 服务器发生错误:', err);
    }
}

module.exports = WebSocketServer;
