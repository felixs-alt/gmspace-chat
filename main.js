const express = require('express')
const ws = require('ws')
const app = express()
const wss = new ws.WebSocketServer({ port: 2929 });
const port = 3000
app.use("/", express.static(__dirname+'/public'));
wss.on('connection', function connection(ws) {
  ws.rawData
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === ws.OPEN) {
        console.log(data.toString())
        client.send(data.toString());
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})