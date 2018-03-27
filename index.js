// NodeJs backend for flux project
// CC Mars 2018

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const utils = require('./scripts/utils');
const algo  = require('./scripts/algo');
const fs  = require('fs');


var taux = 20;
var lastClient = 0;
var clients = {};
var profile = JSON.parse(fs.readFileSync('./ressources/profiles', {encoding: 'utf-8'}));
var histogram = [4, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 9, 9, 10, 5, 6, 6, 7, 2, 1, 3];

function get_prob_array(path_to_file) {
	file = fs.readFileSync(path_to_file, {encoding: 'utf-8'});
	ret = JSON.parse(file);
	return (ret);
};

prob_array = get_prob_array('./ressources/prob_file.json');

//Root listener
app.use('/assets-visu', express.static('views/visu'));
app.use('/mobile/libs', express.static('views/mobile/libs'));
app.use('/mobile/assets', express.static('views/mobile/assets'));

app.get('/', function(req, res) {
    res.send("Hello World!");
});

//Mobile view listener
app.get('/mobile/', function(req, res) {
    res.sendfile('views/mobile/index.html');
});

//Visu view listener
app.get('/visu/', function(req, res) {
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
    utils.updateVisu(visu, profile);
});

//Declaring mobile socket
var mobile = io.of('/mobile');

//Mobile socket listener
mobile.on('connection', function(socket) {
    var clientId;
    socket.on('client', function (id) {
        clientId = id;
    	socket.emit('profile', profile[id]);
    });

    //On start message stock the value in client[id]
    socket.on('start', function(v) {
        console.log('client[',clientId,'].start=',v);
        profile[clientId]['start'] = v;
        utils.updateVisu(visu, profile);
    });

    //On end message stock the value in client[id]
    socket.on('end', function(v) {
        console.log('client[',clientId,'].end=',v);
        profile[clientId]['end'] = v;
        utils.updateVisu(visu, profile);
    });

    //On connect delete the user that disconnect
    socket.on('disconnect', function() {
        utils.updateVisu(visu, profile);
    });
});
