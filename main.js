const express = require('express')
const ws = require('ws')
var request = require('request');
var cors = require('cors')
const app = express()
const wss = new ws.WebSocketServer({ port: 2929,clientTracking: true });
const port = 3000
let userCount = 0;

app.use(cors())
app.use("/", express.static(__dirname+'/public'));

app.get('/api/users', function(req,res) {
  res.send(String(userCount))
});

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  ws.on('message', function message(data) {
    if(data.toString() != "ping"){
      wss.clients.forEach(function each(client) {
        if (client.readyState === ws.OPEN) {
          console.log(data.toString())
          client.send(data.toString());
        }
      });
    };
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
setInterval(update,2000)
function update(){
  if (wss.clients.size > 0){
    let tempcount = 0
    wss.clients.forEach(function(client){
      tempcount++
    })
    userCount = tempcount
  }
}