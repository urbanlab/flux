// NodeJs backend for flux project
// CC Mars 2018

/*---------------------------------------------------------------------------------------*/
// Modules importés
/*---------------------------------------------------------------------------------------*/
const backend = require('./scripts/fonctions_backend'); // Partie algorithmique de la démo
const express = require('express');                     // Serveur simplifié
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);                // Communication par sockets
const fs  = require('fs');                              // Chargement de fichiers JSON

/*---------------------------------------------------------------------------------------*/
// Définition du serveur et des communications
/*---------------------------------------------------------------------------------------*/

var clients = {};                                       // liste de clients
var profils = JSON.parse(fs.readFileSync('./ressources/profils', {encoding: 'utf-8'})); // on va chercher le profil complet des utilisateurs. Il sera actualisé au cours de la démo.
var sockets_mobile = {};                                // liste de sockets associés à chaque client
var socket_visu;                                        // socket de l'interface visuelle (défini plus bas)
var algo;                                               // 

// On rend le serveur capable de charger des ressources statiques (images, ...) selon les
// différentes pages de l'application à afficher
app.use('/assets-visu', express.static('views/visu'));                // ressources pour la visualisation
app.use('/mobile/libs', express.static('views/mobile/libs'));         // modules (jquery, ...) pour les tablettes
app.use('/mobile/assets', express.static('views/mobile/assets'));     // ressources pour les tablettes


// app.get(chemin, callback) exécute la fonction callback lorsque la page de chemin
// 192.168.71.134:3000/chemin est chargée. Ici, sans extension de chemin on lève une erreur. 
app.get('/', function(req, res) {
    res.send("Page incorrecte, aller à /visu ou à /mobile");
});

// Lorsqu'on charge la page de l'application mobile, génère son affichage.
// Attention il faut spécifier un profil dans le chemin, par exemple
// '/mobile/?profils=tassin' 
app.get('/mobile/', function(req, res) {
    res.sendFile(__dirname + '/views/mobile/index.html');
});

//Idem sur la visualisation de l'ordinateur (pas de chemin supplémmentaire)
app.get('/visu/', function(req, res) {
    res.sendFile(__dirname + '/views/visu/index.html');
});

// On instancie le serveur et on écoute le port 3000.
server.listen(3000, function() {
    console.log('FLUX Server started on port 3000');
});

/*---------------------------------------------------------------------------------------*/
// Ouverture des sockets et définition du comportement de la démo
/*---------------------------------------------------------------------------------------*/
//Socket de la visualisation

// On déclare un socket reliant le serveur index.js et la page de visualisation
var visu = io.of('/visu');

// Lorsque la page d'affichage est chargée, on initialise l'algorithme d'optimisation
// et on génère la première visualisation du trafic.
visu.on('connection', function(socket) {
    socket_visu = socket;
    algo = new backend.Algorithme(profils);
    algo.initVisu(socket_visu); 
});

/*---------------------------------------------------------------------------------------*/
// Socket des tablettes (IHM)

// On déclare des sockets reliant chaque tablette au serveur
var mobile = io.of('/mobile');


mobile.on('connection', function(socket) {
    // Lorsqu'une tablette se connecte (son ID étant dans l'URL de connexion), on lui attribue un socket
    // et on la met en  communication avec le serveur 
    var clientId;

    socket.on('client', function (id) {
    // L'information fait un aller-retour dans le socket lors de la connection. Considérer ceci comme une action à la connexion.
        clientId = id;
        sockets_mobile[clientId] = socket; // référencement du socket créé lors de l'initialisation dans le dictionnaire des sockets.
    	socket.emit('profils', profils[id]); // initialisation de l'affichage des informations par la tablette: à partir de leur ID on transmet aux clients leur profil complet
    });

    socket.on('start', function(heure_min) {
    // Fonction à exécuter lorsqu'une personne modifie son heure d'arrivée au plus tôt. On actualise les durées de trajet de chacun
    // ainsi que la répartition des horaires d'arrivées.
        if(clientId) {
            profils[clientId]['start'] = heure_min;
            if(profils[clientId]['start'] <= profils[clientId]['end']) { // si les horaires entrés par l'utilisateur sont invalides, on n'actualise pas la démo.
                socket.emit('chatbot_affichable', true);
                algo.updateVisu(sockets_mobile, socket_visu, clientId, [heure_min, profils[clientId]['end']]);
            };
        };
    });

    // Fonction à exécuter lorsqu'une personne modifie son heure d'arrivée au plus tard. On actualise les durées de trajet de chacun
    // ainsi que la répartition des horaires d'arrivées.
    socket.on('end', function(heure_max) {
        if(clientId) {
            profils[clientId]['end'] = heure_max;
            if(profils[clientId]['start'] <= profils[clientId]['end']) { // si les horaires entrés par l'utilisateur sont invalides, on n'actualise pas la démo.
                socket.emit('chatbot_affichable', true);
                algo.updateVisu(sockets_mobile, socket_visu, clientId, [profils[clientId]['start'], heure_max]);
            };
        };
    });

    socket.on('disconnect', function() { // supprime un utilisateur lorsqu'il se déconnecte.
        delete sockets_mobile[clientId];
    });
});
