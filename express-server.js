let staticPath = '/www/h5-cocos-club/dist'
let port = 8080
let path = require('path')
const request = require('request');

var express = require('express')
var app = express()

const axios = require('axios');
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))



app.use(express.static(staticPath));
app.get('*', function (req, res) {
  res.sendFile(path.join(staticPath, 'index.html'))
})
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/', function (req, res) {
  res.send('Welcome!')
})

app.post('/ask', async (req, res) => {
  let question = req.body.question + ''
  // 定义 POST 数据
  const postData = {
      model: 'gpt-4',
      // model: 'gpt-4-0613',
      messages: [{
          role: 'user',
          content: question
      }],
      temperature: 0.9
  };

  const apiUrl = 'https://dyxc-aoai-1.openai.azure.com/openai/deployments/qxai/chat/completions?api-version=2023-03-15-preview';  // 替换为实际的 API 地址
  const headers = {
      'api-key': '2b5580a845634124b9b4c8c57d74f7a5',
      'Content-Type': 'application/json' // 设置内容类型为 JSON
  };


  // res.status(200).json({
  //   data: {
  //       replay: 'ok111'
  //   },
  //   code: 200
  // });
  axios.post(apiUrl, postData, {headers}).then(response => {
      let result = response.data
      console.log('DEBUG_LOG:gpt result', result);

      if (result && result.choices && result.choices[0]) {
        let replay = result.choices[0].message.content
        console.log('DEBUG_LOG:res call', replay);
        res.status(200).json({
          data: {
              replay
          },
          code: 200
        });
      }
  }).catch(error => {
      console.error('Error:', error);
      res.status(500).json({
        error: {
            message: 'An error occurred during your request.',
        }
    });
  });
});

app.post('/chat', (req, res) => {
  console.log('chat', req.body.messages)
  const messages = req.body.messages;
  const options = {
    url: 'https://api.openai.com/v1/chat/completions',
    method: 'POST',
    strictSSL: false, // 关闭证书验证
    headers: {
      "Authorization": "Bearer sk-2b5580a845634124b9b4c8c57d74f7a5",
      "Content-Type": "application/json",
    },
    json: {
      "model": "gpt-3.5-turbo",
      "stream": true,
      "messages": messages
    }
  };
  const proxyReq = request(options);
  proxyReq.on('response', function(response) {
    response.pipe(res);
  });
});

console.log('DEBUG_LOG:listening port', port);
app.listen(port)