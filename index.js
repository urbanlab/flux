// NodeJs backend for flux project
// CC Mars 2018

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const algo  = require('./scripts/algo');
const fs  = require('fs');


var taux = 20;
var clients = {}; //liste de clients
var profile = JSON.parse(fs.readFileSync('./ressources/profiles', {encoding: 'utf-8'})); //Le fichier ./ressources/profiles contient un fichier JSON, qui initialise profile
var sockets = {}; //liste de sockets
var histogram = [4, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 9, 9, 10, 5, 6, 6, 7, 2, 1, 3]; //cet histogramme n'est plus utilisé mais servait de test, il peut etre supprimé


var totalPeople = 5000; //Cette variable contient le nombre total de personne


/* La fonction get_prob_array permet d'ouvrir un histogramme
 * des temps de trajets au cours du temps sur la portion de route étudiée */
function get_prob_array(path_to_file) {
	file = fs.readFileSync(path_to_file, {encoding: 'utf-8'}); //lecture du fichier
	ret = JSON.parse(file); //parsing JSON
	return (ret);
};


/* la fonction time2index transforme une heure
 * de type xx:xx en sont index dans un histogram compris entre 0-24
 * (12 heures par tranches de 15 minutes)
 * (Une heure qui n'est pas ecrit par tranches de 15 min
 * sera reduit a la tranche inférieure : exemple : 9h34 -> 9h30 -> index=14) */
function time2index(time) {
    var res = /([0-9]{1,2}):([0-9]{2})/.exec(time);
    if(res) {
        var hours = res[1];
        var minutes = res[2];
        var timeIndex = (hours - 6)*4 + Math.floor(minutes / 15);
        if(timeIndex < 0) {
            timeIndex = 0;
        } else if(timeIndex > 24) {
            timeIndex = 24;
        }
        return timeIndex;
    } else {
        return undefined;
    }
}

/* La fonction scale_histogram transforme un histogram dont la somme vaut N en un histogram dont la somme vaut TotalPeople,
 * on repartie donc notre population de 5000 personnes selon les proportions definie par prob_array (histogramme des durées) */
prob_array = algo.scale_histogram(get_prob_array('./ressources/prob_file.json'), totalPeople);
probabilite = get_prob_array('./ressources/prob_file.json'); //ouverture de l'histogramme des temps de trajets avec get_prob_array
console.log("Scaled traffic: ", prob_array);

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
    algo.updateVisu(visu, profile, sockets);
});

//Declaring mobile socket
var mobile = io.of('/mobile');

//Mobile socket listener
mobile.on('connection', function(socket) {
    var clientId;
    socket.on('client', function (id) {
        clientId = id;
        console.log("sending profile for",id," : ",profile[id]);
        sockets[clientId] = socket;
    	socket.emit('profile', profile[id]);
    });

    //On start message stock the value in client[id]
    socket.on('start', function(v) {
        if(clientId) {
            profile[clientId] = profile[clientId] || {};
            var startTimeIndex = time2index(v);
            console.log('client[',clientId,'].start=',v," (",startTimeIndex,")");
            profile[clientId]['start'] = startTimeIndex;
            algo.updateVisu(visu, profile, sockets);
        }
    });

    //On end message stock the value in client[id]
    socket.on('end', function(v) {
        if(clientId) {
            profile[clientId] = profile[clientId] || {};
            var endTimeIndex = time2index(v);
            console.log('client[',clientId,'].end=',v," (",endTimeIndex,")");
            profile[clientId]['end'] = endTimeIndex;
            algo.updateVisu(visu, profile, sockets);
        }
    });

    socket.on('disconnect', function() {
        delete sockets[clientId];
    });
});
