var pas_temporel = '00:15';
var PD = require("probability-distributions");

var distribution_probas = {
	'-00:30':0.01,
	'-00:15':0.35,
	'+00:00':0.45,
	'+00:15':0.15,
	'+00:30':0.04
};

function horaire_en_minutes(horaire) {
	var heures_et_minutes = horaire.split(':');
	return eval(heures_et_minutes[0]) * 60 + eval(heures_et_minutes[1]);
};

function minutes_en_horaire(minutes) {
	var horaire = [Math.floor(minutes / 60), minutes % 60];
	var string_heures = (horaire[0] >= 10) ? String(horaire[0]) : '0' + String(horaire[0]);
	var string_minutes = (horaire[1] >= 10) ? String(horaire[1]) : '0' + String(horaire[1]);
	return string_heures + ':' + string_minutes;
};

function ajouter_horaires(h1, h2, signe) {
	var h1_minutes = horaire_en_minutes(h1);
	var h2_minutes = horaire_en_minutes(h2);
	var resultat_minutes = (signe == '-') ? (h1_minutes - h2_minutes) : (h1_minutes + h2_minutes);
	return minutes_en_horaire(resultat_minutes);
};


// A utiliser 1 fois au début de l'algorithme
function generer_horaires(heure_min, heure_max, pas_temps=pas_temporel) {
	var minutes_min = horaire_en_minutes(heure_min);
	var minutes_max = horaire_en_minutes(heure_max);
	var pas_temporel = horaire_en_minutes(pas_temps);
	var nombre_pas = Math.floor((minutes_max - minutes_min) / pas_temporel) + 1;

	var temps = 0;
	var vecteur_horaires = new Array(nombre_pas);
	for (var i = 0; i < nombre_pas; i++) {
		temps = minutes_min + i * pas_temporel;
		vecteur_horaires[i] = minutes_en_horaire(temps);
	};
	return vecteur_horaires;
};

function calculer_plage_groupe(date_reference, liste_deltaT) {
	var taille_plage = liste_deltaT.length;
	var plage = new Array(taille_plage);
	for(var i = 0; i < taille_plage; i++) {
		var signe = liste_deltaT[i].charAt(0);
		var heure = liste_deltaT[i].slice(1);
		plage[i] = ajouter_horaires(date_reference, heure, signe);
	};
	return plage;
};

// Attention il faudra éviter les effets de bord: les horaires proposés sont à +/-30min des
// bords de l'histogramme
function repartir_utilisateurs(date_reference, taille_groupe, distribution_probabilites=distribution_probas) {
	var repartition = {};
	var liste_deltaT = Object.keys(distribution_probabilites);
	var plage = calculer_plage_groupe(date_reference, liste_deltaT);
	var taille_plage = plage.length;
	for(var i = 0; i < taille_plage; i++) {
		repartition[plage[i]] = Math.floor(taille_groupe * distribution_probabilites[liste_deltaT[i]]);
	};
	return repartition;
};

/*---------------------------------------------------------------------------------------*/

function generer_histogramme(horaires, dates_groupes, tailles_groupes, distribution_probabilites=distribution_probas) {
	var nb_pas_temps = horaires.length;
	var dictionnaire_histogramme = {};
	for(var i = 0; i < nb_pas_temps; i++) {
		dictionnaire_histogramme[horaires[i]] = 0;
	};
	var nb_groupes = dates_groupes.length;
	for(var i = 0; i < nb_groupes; i++) {
		var repartition_groupe = repartir_utilisateurs(dates_groupes[i], tailles_groupes[i], distribution_probabilites);
		for (var date in repartition_groupe) {
			dictionnaire_histogramme[date] += repartition_groupe[date];
		};
	};
	var valeurs_histogramme = new Array(nb_pas_temps);
	for(var i = 0; i < nb_pas_temps; i++) {
		valeurs_histogramme[i] = dictionnaire_histogramme[horaires[i]];
	};
	return valeurs_histogramme;
};

function ajouter_bruit_histogramme(histogramme, lambda) {
	var taille_histogramme = histogramme.length;
	var bruit = PD.rpois(taille_histogramme, lambda);
	var histogramme_bruite = histogramme.map((valeur, index) => valeur + bruit[index]);
	return histogramme_bruite;
};

function redimensionner_histogramme(histogramme, total_voulu) {
	var total_histogramme = histogramme.reduce((accu, val) => accu + val);
	var histogramme_redim = histogramme.map((x) => Math.floor(x * total_voulu / total_histogramme));
	return histogramme_redim;
};

/*---------------------------------------------------------------------------------------*/
function calculer_fonction_cout(liste_dates, dates_groupes, tailles_groupes, distribution_probabilites=distribution_probas) {
	var histogramme = generer_histogramme(liste_dates, dates_groupes, tailles_groupes, distribution_probabilites);
	var nb_groupes = dates_groupes.length;
	var couts_groupes = new Array(nb_groupes);
	var liste_deltaT = Object.keys(distribution_probabilites);
	for(var i = 0; i < nb_groupes; i++) {
		var cout_groupe = 0;
		var plage_dates_groupe = calculer_plage_groupe(dates_groupes[i], liste_deltaT);
		var taille_plage_groupe = plage_dates_groupe.length;
		for(var j=0; j < taille_plage_groupe; j++) {
			var indice_date = liste_dates.indexOf(plage_dates_groupe[j]);
			var probabilite_date = distribution_probabilites[liste_deltaT[j]];
			var cout_date = probabilite_date * Math.pow(histogramme[indice_date], 2);
			cout_groupe += cout_date;
		};
	couts_groupes[i] = cout_groupe;
	};
return couts_groupes.reduce((accu, val) => accu + val);
};


function optimiser(groupe_a_optimiser, intervalle_disponibilite, dates_groupes, tailles_groupes,
				   liste_dates, distribution_probabilites=distribution_probas) {

	var fonction_cout_partielle = function(date_groupe) {
		var dates_groupes_modif = dates_groupes.slice();
		dates_groupes_modif[groupe_a_optimiser] = date_groupe;
		return calculer_fonction_cout(liste_dates, dates_groupes_modif, tailles_groupes, distribution_probabilites);
	};

	var dates_possibles = liste_dates.filter((date) =>
		horaire_en_minutes(date) >= horaire_en_minutes(intervalle_disponibilite[0]) &&
		horaire_en_minutes(date) <= horaire_en_minutes(intervalle_disponibilite[1]));

	var couts_possibles = dates_possibles.map((date) => fonction_cout_partielle(date));
	var cout_possible_min = Math.min.apply(null, couts_possibles);
	var index_cout_min = couts_possibles.indexOf(cout_possible_min);
	var meilleure_date_arrivee = dates_possibles[index_cout_min];
	return meilleure_date_arrivee
};

/*---------------------------------------------------------------------------------------*/
function calculer_histogramme_affichage() {};
//discrétisation 15min

function calculer_durees_trajets() {};
//duree du trajet = durée à vide + (somme pondérée des valeurs de l'histogramme - somme pondérée des valeurs du groupe de personnes) * facteur_multi (0.8)

function initialiser_departs() {};
// à voir avec le reste du projet; initialiser à tt le monde à 8h30. Envoyer l'histogramme et les temps, régler les tablettes.

/*---------------------------------------------------------------------------------------*/
module.exports = {
	updateVisu: function(visu, clients, sockets) {};
	// reprendre les entrées et sorties du code d'origine. déplacer le corps de la fonction hors des exports.
};

/*---------------------------------------------------------------------------------------*/
//tests des différentes fonctions utilisées
var temps = generer_horaires('06:00', '12:00', '00:15');
var dates_groupes = ['08:00', '08:30', '09:00'];
var tailles_groupes = [100, 100, 100];

console.log(optimiser(2, ['08:00','08:30'], dates_groupes, tailles_groupes, temps));

/*
var x =generer_histogramme(temps, dates_groupes, tailles_groupes);
console.log(x);
var cout = calculer_fonction_cout(temps, dates_groupes, tailles_groupes);
console.log(cout);
//console.log(redimensionner_histogramme(x, 100));
//console.log(ajouter_bruit_histogramme(x, 2));
*/