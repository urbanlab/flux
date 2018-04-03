//Javascript file for sorting functions
/* Ce fichier contient toute les fonction de l'algorithme
 * qui calcule les nouvelles repartitions de l'histogramme*/



const fs   = require('fs');
const path = require('path');
var time_array = ['45', '38', '42'];


/* La fonction softmax transforme un histogramme dont la somme vaut N en un histogramme dont la somme vaut 1 
 * (autrement dit il transforme les proportions de l'histogramme en probabilités)*/
function my_softmax (list) {
	var n = 0;
	var e = 0;
	var x = 0;
	var count = 0;
	var soft = [];

	for (e in list) {
		n = Number(n) + Number(list[e]);
	}
	if (n == 0) {
		for (x in list) {
			soft[count] = 0;
			count++;
		}
		return (soft);
	}
	for (x in list) {
		soft[count] = list[x] / n;
		count++;
	}
	return (soft);
}

/* cette fontion permet de calculer un vecteur de probabilités inverse par rapport aux probabilité se l'histogramme entré
 * La somme du vecteur entré doit etre 1 */
function reverse_vector (vector) {
	var n = 0;
	var rev = [];

	for (n in vector)
		rev[n] = 1 - vector[n];
	rev = my_softmax(rev);
	return (rev);
}

/* cette fonction permet d'inverser les probababilité d'un vecteur dont la somme des elements vaut N */
function reverse_proba (vector) {
	var vec = my_softmax(vector);
	vec = reverse_vector(vec);
	return vec;
}


/* cette fonction inverse les probabilités d'un vecteur entre 's' (qui est l'index de depart) et 'e' (qui est l'index de fin) 
 * (la fonction retourne les probabilité inverse sur la tranche 's - e' et 0 sur les autres element du vecteur )*/
function reverse_proba_special(vector, s, e) {
	var vec = my_softmax(vector);
	var n = 0;
	var rev = [];

	for (n in vec) {
		if (n >= s && n <= e)
			rev[n] = 1 - vec[n];
		else
			rev[n] = 0;
	}
	rev = my_softmax(rev);
	return (rev);
}


/* Cette fonction modifie le coef Num en le divisant par la somme des elements entre 's' et 'e' sur le vecteur Rinitial 
 * fonction utilisé dans extract */
function get_coef(Rinitial, s, e, Num) {
	var i = 0;
	var sum = 0;

	for (i in Rinitial) {
		if (i >= s && i <= e) {
			sum += Number(Rinitial[i]);
		}
	}
	if (sum != 0)
		return (Number(Num) / Number(sum));
	else
		return (0);
}


/* La fonction extract renvoie un vecteur de la meme taille que l'histogramme, contenant un nombre 'Num'
 * de personne, repartie selon les proportions de l'histogramme entre 's' et 'e' (sur le vecteur de sortie)
 * (Les autres membres du vecteur de sortie sont a 0) */
function extract(Rinitial, s, e, Num)
{
	var i = 0;
	var normalized = my_softmax(Rinitial);
	var extract_vect = [];
	var coef = get_coef(normalized, s, e, Num);
	console.log('coef = ', coef);

	for (i in normalized) {
		if (i >= s && i <= e) {
			extract_vect[i] = Math.round(Number(normalized[i]) * Number(coef));
		} else
			extract_vect[i] = 0;
	}
	return extract_vect;
}

/* cette fonction soustrait extract à Rinitial */
function sub_extract(Rinitial, extract) {
	var i = 0;
	var sub_vect = [];

	for (i in Rinitial)
		sub_vect[i] = Number(Rinitial[i]) - Number(extract[i]);
	return sub_vect;
}

/* cette fonction ajoute un vecteur new_extract a sub_vect */
function push_extract(sub_vect, new_extract) {
	var i = 0;
	var add_vect = [];

	for (i in sub_vect)
		add_vect[i] = Number(sub_vect[i]) + Number(new_extract[i]);
	return add_vect;
}

/* Cette fonction repartie selon les proportion de sub_vect, un nombre de personne 'Num' entre les indexs 's' et 'e' 
 * assemblement de (reverse_proba_special, extract, push_extract)*/
function repart_proba(sub_vect, s, e, Num) {
    reverse = reverse_proba_special(sub_vect, s, e);
	console.log('reverse = ', reverse);

	new_extract = extract(reverse, s, e, Num)
	console.log('new_extract = ', new_extract);

	reparted = push_extract(sub_vect, new_extract);
	console.log('reparted = ', reparted);

	return reparted;
}

/* obtient l'index du nombre minimum entre les indexs 's' et 'e' sur un vecteur */
function get_min(sub_vect, s, e)
{
	var min = s;

	for (i = s; i <= e; i++) {
		if (sub_vect[i] < sub_vect[min])
			min = i;
	}
	return (min);
}

/* Fonction concurente et bien plus performante que repart_proba qui repartie chaque personne
 * en fonction du minimum sur la tranche 's - e' a chaque tour 
 * (il pose 300 personne en obtimisant au maximum la route sur la tranche horaire ciblée) */
function my_repart(sub_vect, s, e , num)
{
	var i = 0;
	var index = 0;

	for (var y = 0; y < num; y++) {
		index = get_min(sub_vect, s, e);
		sub_vect[index]++;
	}
	return (sub_vect);
}

const nbr_people = 1500;

/* cette fonction construit un histogramme (assmblage de extract(), sub_extract() et my_repart())*/
function make_histo (histogram, start, end, num) {
    console.log("Updating histogram start=",start," end=",end, "num=",num);
	extract_vect = extract(histogram, start, end, num);
	console.log('extract = ', extract_vect);

	sub_vect = sub_extract(histogram, extract_vect);
	console.log('sub_vect = ', sub_vect);

	repart = my_repart(sub_vect, start, end, num);
	console.log('repart = ', repart);

	return (repart);
}

/* La fonction scale_histogram transforme un vecteur dont la somme des elements vaut N
 * en un vecteur dont la somme des elements vaut n */
function scale_histogram(hist, n) {
    var pHist = my_softmax(hist);
    console.log(n);
    var rHist = [];
    for(var i=0; i<pHist.length; i++) {
        rHist[i] = Math.round(pHist[i] * n);
    }
    return rHist;
}

/* fonction inverse a time2index */
function index2hour(index) {
	hour = Math.floor((index / 4) + 6);
	minutes = Math.floor(index % 4) * 15;
	if (minutes < 10)
		minutes = '0' + minutes;
	return (hour + ':' + minutes);
}


/* commentée dans index.js */
function time2index(time) {
    var res = /([0-9]{1,2}):([0-9]{2})/.exec(time);
    if(res) {
        var hours = res[1];
        var minutes = res[2];
        var timeIndex = (hours - 6) * 4 + Math.ceil(minutes / 15);
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

/* cette fonction renvoie une heure aleatoire sous la forme 'xx:xx' entre les index 'start' et 'end' */
function getSuggestedTime(client, histo, start, end)
{
	console.log(start);
	console.log(end);
	if (end != start)
		rando = Math.floor((Math.random() * 10000000)) % (end - start) + start;
	else
		rando = end;
	console.log('Rando = ', rando);
	return (index2hour(rando));
}

/* cette fonction calcule le temps de trajets de chaque personne en fonction de sont heure de depart */
function getTimeMove(client, histo, index)
{
	console.log('client time = ', client.time);
	console.log('histo time = ', histo[index]);
	var value = Math.ceil(Number(client.time) + Number(histo[index]) * 0.8);
	return (value);
}

/* La fonction updateVisu permet de mettre a jour la visualisation,
 * elle envoie a la visu des info l'histogramme et les heures de depart des trois personnages
 * et envois a chacun des personnages ses heures de trajets et de depart */
module.exports = {
    updateVisu: function (visu, clients, sockets) {
        console.log("Updating repartition: ", clients);
		HT = prob_array;
		for (var clientId in clients) {
			console.log("Reaffectation profile",clientId, ":", clients[clientId]);
			if (!(clients[clientId]['start'] === undefined) && !(clients[clientId]['end'] === undefined)) {
				HT = make_histo(HT, clients[clientId]['start'], clients[clientId]['end'], Number(clients[clientId]['count']));
				if(sockets[clientId]) {
					var time = getSuggestedTime(clients[clientId], HT, clients[clientId]['start'], clients[clientId]['end']);
                    			sockets[clientId].emit('suggestion', time); //envois au client son heure de depart suggeré
					var minutes = getTimeMove(clients[clientId], probabilite, time2index(time));
					console.log('client id', clientId);
					if (clientId == 'villeurbanne')
						time_array[1] = minutes;
					else if (clientId == 'lyon7')
						time_array[0] = minutes;
					else
						time_array[2] = minutes;
					sockets[clientId].emit('time-move', minutes); //envois au client son temps de trajets
				}
			}
		}
		visu.emit('histogram', scale_histogram(HT,150)); //envois le nouvel histogramme a la visu
		console.log('test === === = == =', time_array);
		visu.emit('times', time_array); //envois time_array a la visu (time_array est un tableau de trois valeurs)
    },
    scale_histogram: scale_histogram
}
