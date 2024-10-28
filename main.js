const express = require('express')
const ws = require('ws')
const socketio = require('socket.io');
var cors = require('cors')
const app = express()
const wss = new ws.WebSocketServer({ port: 2929,clientTracking: true });
const port = 3000
let userCount = 1;
var tmrw;

app.use(cors())
app.use("/", express.static(__dirname+'/public'));

app.get('/api/users', function(req,res) {
  res.send(String(userCount))
});

app.get('/api/tmrw', function(req,res) {
  res.send(String(tmrw))
})

async function weather(){
  const res = await fetch('https://api.tomorrow.io/v4/weather/realtime?location=Lomma&apikey=FY9b7HbawyBktGnvUyvX63l3cZW4NmqW', options)
  tmrw = await res.json();
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
const server = app.listen(port, () => console.log(`Server started on port ${port}.`));
const io = socketio(server, {
  pingInterval: 2000,
  pingTimeout: 1000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', socket => {
  userCount = socket.adapter.sids.size
  io.emit('user-count-change', userCount);

  socket.on('disconnect', () => {
    userCount = socket.adapter.sids.size
    io.emit('user-count-change', userCount);
  });
});