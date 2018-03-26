const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


var taux = 20;
var lastClient = 0;
var clients = {};

app.get('/', function(req, res) {
    res.send("Hello World!");
});

app.get('/mobile', function(req, res) {
    res.sendfile('views/mobile/index.html');
});

app.get('/visu', function(req, res) {
   res.sendfile('views/visu/index.html');
});

server.listen(3000, function() {
    console.log('FLUX Server started on port 3000');
});

var visu = io.of('/visu');
visu.on('connection', function(socket){
  console.log('someone connected on visu');
  socket.emit('taux', taux);
});

function updateVisu() {
   console.log(clients);
   var count = 0;
   var sum = 0;
   for(c in clients) {
     if(clients[c]['start']) {
       sum += Number(clients[c]['start']);
       count++;
     }
   }
   console.log('Sum:',sum);
   taux = sum / count;
   console.log('New taux:',taux);
   visu.emit('taux',taux);
}

var mobile = io.of('/mobile');
mobile.on('connection', function(socket) {
    var clientId = lastClient++;
    clients[clientId] = {};
    socket.on('start', function(v) {
        console.log('client[',clientId,'].start=',v);
        clients[clientId]['start'] = v;
        updateVisu();
    });

    socket.on('end', function(v) {
        console.log('client[',clientId,'].end=',v);
        clients[clientId]['end'] = v;
        updateVisu();
    });

    socket.on('disconnect', function() {
        delete clients[clientId];
        updateVisu();
    });
});

app.get('/update', function(req, res) {
 taux = 30;
 visu.emit('taux', taux);
 res.send('{}');
});
