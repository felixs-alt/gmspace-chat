const express = require('express')
const ws = require('ws')
var cors = require('cors')
const app = express()
const wss = new ws.WebSocketServer({ port: 2929,clientTracking: true });
const clickwss = new ws.WebSocketServer({ port: 2939,clientTracking: true });
const port = 3000
const options = {method: 'GET', headers: {accept: 'application/json'}};

var tmrw;

app.use(cors())
app.use("/", express.static(__dirname+'/public'));

app.get('/api/tmrw', function(req,res) {
  res.send(tmrw)
})

async function weather(){
  const res = await fetch('https://api.tomorrow.io/v4/weather/realtime?location=Lomma&apikey=FY9b7HbawyBktGnvUyvX63l3cZW4NmqW', options)
  tmrw = await res.json()
  setTimeout(weather,60000)
}
weather()


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
clickwss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  ws.on('message', function message(data) {
    if(data.toString() != "ping"){
      clickwss.clients.forEach(function each(client) {
        if (client.readyState === ws.OPEN) {
          console.log(data.toString())
          client.send(data.toString());
        }
      });
    };
  });
});
app.listen(port, () => console.log(`Server started on port ${port}.`));