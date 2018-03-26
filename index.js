const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


var taux = 20;

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

var mobile = io.of('/mobile');
mobile.on('connection', function(socket) {
    socket.on('start', function(v) {
        console.log('new start ',v);
        visu.emit('taux', v);
    });
});

app.get('/update', function(req, res) {
 taux = 30;
 visu.emit('taux', taux);
 res.send('{}');
});
