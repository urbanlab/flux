// NodeJs backend for flux project
// CC Mars 2018

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const utils = require('./scripts/utils');
const algo  = require('./scripts/algo');

var taux = 20;
var lastClient = 0;
var clients = {};



//Root listener

app.use('/assets-visu', express.static('views/visu'));



app.get('/', function(req, res) {
    res.send("Hello World!");
});

//Mobile view listener
app.get('/mobile', function(req, res) {
    res.sendfile('views/mobile/index.html');
});

//Visu view listener
app.get('/visu', function(req, res) {
    res.sendfile('views/visu/index.html');
});

//Server instantiation
server.listen(3000, function() {
    console.log('FLUX Server started on port 3000');
});

//Declaring visu socket
var visu = io.of('/visu');

//Visu socket listener
visu.on('connection', function(socket) {
    console.log('someone connected on visu');
    socket.emit('taux', taux);
});

//Declaring mobile socket
var mobile = io.of('/mobile');

//Mobile socket listener
mobile.on('connection', function(socket) {

    var clientId = lastClient++;
    clients[clientId] = {};

    //On start message stock the value in client[id]
    socket.on('start', function(v) {
        console.log('client[',clientId,'].start=',v);
        clients[clientId]['start'] = v;
        utils.updateVisu(clients, visu);
    });

    //On end message stock the value in client[id]
    socket.on('end', function(v) {
        console.log('client[',clientId,'].end=',v);
        clients[clientId]['end'] = v;
        updateVisu(clients, visu);
    });

    //On connect delete the user that disconnect
    socket.on('disconnect', function() {
        delete clients[clientId];
        utils.updateVisu(clients, visu);
    });
});
