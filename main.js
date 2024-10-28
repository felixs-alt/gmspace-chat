const express = require('express')
const ws = require('ws')
var request = require('request');
const crypto = require('crypto');
const socketio = require('socket.io');
var cors = require('cors')
const app = express()
const wss = new ws.WebSocketServer({ port: 2929,clientTracking: true });
const port = 3000
let userCount = 1;
const secret = '175bfc31f2df4eddbe58df28bcae676b';

// signing the secret with the timestamp from the request
function sign(secret, timestamp) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(timestamp);
  return hmac.digest('hex');
}

app.use(cors())
app.use("/", express.static(__dirname+'/public'));

app.get('/api/users', function(req,res) {
  res.send(String(userCount))
});

app.post("/tmrw", (req, res) => {
  console.log(req.body) // Call your action on the request here
  // tomorrow.io signature header is "t={timestamp},sig={signature}"
  const signatureHeader = req.headers['X-Signature'].split(',');
  // extract timestamp
  const timestamp = signatureHeader[0].split('=')[1];
  // extract signature
  const signature = signatureHeader[1].split('=')[1];
  // getting the expected signature
  const expectedSignature = sign(secret, timestamp);
  res.status(200).end() // Responding is important
})

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