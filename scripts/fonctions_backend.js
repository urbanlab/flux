/*---------------------------------------------------------------------------------------*/
//Paramètres de la démo
/*---------------------------------------------------------------------------------------*/

const heure_min = '06:00';      // heure d'arrivée minimum pour la démo 
const heure_max = '12:00';      // heure d'arrivée maximum pour la démo
const pas_temporel = '00:15';   // pas de temps discret utilisé par la démo.
const pas_temps_visu = '00:15'; // pas de temps de l'histogramme affiché à l'écran

const PD = require("probability-distributions"); // librairie pour calculer des distributions de probabilités.

const distribution_probas = {                    // distribution des arrivées d'un groupe de personnes sur une plage de temps.
	'-00:30':0.01,								 // les deltaT doivent être multiples du pas temporel
	'-00:15':0.35,
	'+00:00':0.45,
	'+00:15':0.15,
	'+00:30':0.04
};

const horaires = generer_horaires(heure_min, heure_max, pas_temporel);                  // temps discrétisé pour les calculs
const horaires_visu = generer_horaires(heure_min, heure_max, pas_temps_visu);           // temps discrétisé pour l'affichage.
const horaires_eligibles = generer_choix_horaires(horaires_visu, distribution_probas);  // horaires sélectionnables sur l'IHM

const mini = 2;                            // paramètres d'affichage (taille de l'histogramme verticalement)
const maxi = 35;
const niveau_bruit_affichage = 0.5;        // paramètres d'affichage (ajout d'un "bruit" car tout
                                           // le monde ne se sert pas de l'application)

/*---------------------------------------------------------------------------------------*/
// Fonctions de gestion des horaires
/*---------------------------------------------------------------------------------------*/

function horaire_en_minutes(horaire) {
	// Traduit un horaire (format'hh:mm') en une valeur en minutes (int). Gère les horaires signés.
	if(horaire.length == 6) {  // si l'horaire a un signe
		var signe = (horaire.charAt(0) == '-') ? -1 : 1;
		var heures_et_minutes = horaire.slice(1).split(':');
	} else {
		var signe = 1;
		var heures_et_minutes = horaire.split(':');
	};
	return signe * (eval(heures_et_minutes[0]) * 60 + eval(heures_et_minutes[1]));
};

function minutes_en_horaire(minutes) {
	// Traduit une valeur en minutes(int) en un horaire (format 'hh:mm').
	var signe = minutes >= 0 ? '' : '-';
	var tps = Math.abs(minutes);
	var horaire = [Math.floor(tps / 60), tps % 60];
	var string_heures = (horaire[0] >= 10) ? String(horaire[0]) : '0' + String(horaire[0]);
	var string_minutes = (horaire[1] >= 10) ? String(horaire[1]) : '0' + String(horaire[1]);
	return signe + string_heures + ':' + string_minutes;
};

function ajouter_horaires(h1, h2, signe) {
	// Calcule h1 + h2, ou h1 - h2 si signe = '-'. Les entrées et la sortie sont au format 'hh:mm'. Les horaires sont non-signés, h2<h1
	var h1_minutes = horaire_en_minutes(h1);
	var h2_minutes = horaire_en_minutes(h2);
	var resultat_minutes = (signe == '-') ? (h1_minutes - h2_minutes) : (h1_minutes + h2_minutes);
	return minutes_en_horaire(resultat_minutes);
};


function generer_horaires(heure_min, heure_max, pas_temps) {
	// Génère, le tableau [heure_min, heure_min + pas_temps, heure_min + 2*pas_temps, ..., heure_max].
	// Les horaires en entrée et en sortie sont au format 'hh:mm'
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

function generer_choix_horaires(vecteur_horaires, distribution_probabilites) {
	// Génère les horaires auxquels on peut choisir d'arriver (évite les effets de bords lorsqu'un
	// groupe de personne décide d'arriver aux horaires min ou max mais présente un étalement temporel)
	var heure_min = vecteur_horaires[0],
		heure_max = vecteur_horaires[vecteur_horaires.length - 1],
		liste_deltaT = Object.keys(distribution_probabilites);

	var heure_min_minutes = horaire_en_minutes(heure_min),
		heure_max_minutes = horaire_en_minutes(heure_max),
		liste_deltaT_minutes = liste_deltaT.map(horaire_en_minutes),
		pas_temps_visu_minutes = horaire_en_minutes(pas_temps_visu);

	var deltaT_min = Math.min.apply(null, liste_deltaT_minutes),
		deltaT_max = Math.max.apply(null, liste_deltaT_minutes);

	var heure_min_eligible_minutes = Math.max(heure_min_minutes, heure_min_minutes - deltaT_min),
		heure_max_eligible_minutes = Math.min(heure_max_minutes, heure_max_minutes - deltaT_max);

	heure_min_eligible_minutes = Math.ceil(heure_min_eligible_minutes / pas_temps_visu_minutes) * pas_temps_visu_minutes;
	heure_max_eligible_minutes = Math.floor(heure_max_eligible_minutes / pas_temps_visu_minutes) * pas_temps_visu_minutes;

	var heure_min_eligible = minutes_en_horaire(heure_min_eligible_minutes),
		heure_max_eligible = minutes_en_horaire(heure_max_eligible_minutes);

	return generer_horaires(heure_min_eligible, heure_max_eligible, pas_temps_visu);
};

function calculer_plage_groupe(date_reference, liste_deltaT) {
	// Pour un groupe de personnes, les individus peuvent arriver à plusieurs horaires
	// autours de la date de référence: date_reference - k*deltaT, ..., date_reference + k*deltaT.
	// A partir de la date de référence et de la liste des deltaT, calcule la plage d'arrivées
	// possibles pour un individu. 
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
function repartir_utilisateurs(date_reference, taille_groupe, distribution_probabilites) {
	// Pour un groupe de personnes, chaque individu a une certaine probabilité d'arriver avant
	// ou après l'heure prévue. A partir de la date de référence, du nombre d'individus au sein
	// du groupe et de la distribution de probabilités {deltaT:chance d'arriver avec un décalage deltaT},
	// calcule la répartition moyenne des dates d'arrivée du groupe d'individus.
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
// Fonctions de génération d'un histogramme quelconque
/*---------------------------------------------------------------------------------------*/

function generer_histogramme(liste_dates, dates_groupes, tailles_groupes, distribution_probabilites) {
	// Génère l'histogramme de la répartition des dates d'arrivées des groupes d'individus de
	// tailles tailles_groupes, ayant décidé d'arriver aux dates dates_groupes, et se répartissant
	// selon distribution_probabilites. Les horaires sont les dates à associer aux valeurs de l'histogramme.
	var nb_pas_temps = liste_dates.length;
	var dictionnaire_histogramme = {};
	for(var i = 0; i < nb_pas_temps; i++) {
		dictionnaire_histogramme[liste_dates[i]] = 0;
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
		valeurs_histogramme[i] = dictionnaire_histogramme[liste_dates[i]];
	};
	return valeurs_histogramme;
};

function ajouter_bruit_histogramme(histogramme, lambda) {
	// Ajoute un bruit >0 (distribution de Poisson, espérance et variance lambda)
	// à la répartition des individus au sein d'un histogramme.
	var taille_histogramme = histogramme.length;
	var bruit = PD.rpois(taille_histogramme, lambda);
	var histogramme_bruite = histogramme.map((valeur, index) => valeur + bruit[index]);
	return histogramme_bruite;
};

function redimensionner_histogramme(histogramme, mini, maxi) {
	// Redimensionne l'histogramme pour que sa somme vale total_voulu. Nécessaire pour l'affichage.
	var total_histogramme = histogramme.reduce((accu, val) => accu + val);
	// var max_histogramme = Math.max.apply(null, histogramme);
	var histogramme_redim = histogramme.map((x) => Math.floor(mini + (x * (maxi - mini) / total_histogramme)));
	return histogramme_redim;
};

/*---------------------------------------------------------------------------------------*/
// Fonctions d'optimisation (simulation IA) pour générer la réponse de l'application
/*---------------------------------------------------------------------------------------*/

function calculer_fonction_cout(liste_dates, dates_groupes, tailles_groupes, distribution_probabilites) {
	// Calcule la fonction de coût à optimiser. Il s'agit de la somme des fonctions de coût pour chaque groupe de personnes.
	// Pour chaque groupe, on définit la fonction de coût comme le carré (pour une éventuelle optimisation convexe)
	// de la fréquentation de la route au moment de son arrivée (comme toujours dans ce programme, on étale et pondère
	// la fréquentation du groupe de personnes sur une plage de temps).
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
				   liste_dates, distribution_probabilites) {
	// Sachant la date de départ des autres groupes d'individus, cette fonction détermine la meilleure date d'arrivée
	// d'un groupe donné du point de vue du collectif, dans un intervalle de temps fourni par l'utilisateur. On procède
	// pour cela à une recherche systématique du minimum de la fonction de coût sur cet intervalle.
	var fonction_cout_partielle = function(date_groupe) {
		var decalage_groupe = ajouter_horaires(date_groupe, dates_groupes[groupe_a_optimiser], '-');
		var cout_decalage_groupe = 0.01 * Math.abs(horaire_en_minutes(decalage_groupe));
		var dates_groupes_modif = dates_groupes.slice();
		dates_groupes_modif[groupe_a_optimiser] = date_groupe;
		var cout_tps_trajet = calculer_fonction_cout(liste_dates, dates_groupes_modif, tailles_groupes, distribution_probabilites);
		return cout_tps_trajet + cout_decalage_groupe;
	};

	var dates_possibles = liste_dates.filter((date) =>
		(date >= intervalle_disponibilite[0]) && (date <= intervalle_disponibilite[1]));

	var couts_possibles = dates_possibles.map((date) => fonction_cout_partielle(date));
	var cout_possible_min = Math.min.apply(null, couts_possibles);
	var index_cout_min = couts_possibles.indexOf(cout_possible_min);
	var meilleure_date_arrivee = dates_possibles[index_cout_min];
	return meilleure_date_arrivee
};

/*---------------------------------------------------------------------------------------*/
// Fonctions de calcul des éléments affichés par l'application
/*---------------------------------------------------------------------------------------*/

function calculer_histogramme_affichage(histogramme_origine, horaires_affichage ,pas_temps_visualisation,
										mini, maxi, niveau_bruit_affichage) {
	// Cette fonction génère l'histogramme à afficher à partir des résultats de l'optimisation. Pour cela 
	// on rééchantillonne l'histogramme-résultat pour respecter le pas de temps à afficher, puis
	// on le redimensionne et on lui ajoute du bruit.
	var horaires_minutes = horaires.map(horaire_en_minutes);
	var pas_temps_visu_minutes = horaire_en_minutes(pas_temps_visualisation);
	var nouvel_histogramme = horaires_affichage.map((x) => 0);
	var nb_pas_temps = horaires.length;
	for(var i = 0; i < nb_pas_temps; i++) {
		var indice_horaire = Math.round((horaires_minutes[i] - horaires_minutes[0]) / pas_temps_visu_minutes);
		nouvel_histogramme[indice_horaire] += histogramme_origine[i];
	};
	nouvel_histogramme = redimensionner_histogramme(nouvel_histogramme, mini, maxi);
	nouvel_histogramme = ajouter_bruit_histogramme(nouvel_histogramme, niveau_bruit_affichage);
	return nouvel_histogramme;
};

function calculer_durees_trajets(horaires, histogramme, dates_groupes, tailles_groupes,
								 durees_base_trajets, distribution_probabilites) {
	// A partir de l'histogramme résultat de l'optimisation, cette fonction détermine le temps de trajet estimé
	// pour chaque groupe d'individus.
	var dictionnaire_histogramme = {};
	histogramme.forEach((valeur, indice) => dictionnaire_histogramme[horaires[indice]] = valeur);

	var nb_groupes = dates_groupes.length;
	var durees_trajets = new Array(nb_groupes);
	var liste_deltaT = Object.keys(distribution_probabilites);
	var liste_probas = Object.values(distribution_probabilites);
	var plages_groupes = dates_groupes.map((date_ref) => calculer_plage_groupe(date_ref, liste_deltaT));
	plages_groupes.forEach(function(plage, indice) {
		var frequentation = plage.reduce((accu, date, indice_date) => 
			accu + liste_probas[indice_date] * dictionnaire_histogramme[date], initialValue=0);
		durees_trajets[indice] = Math.round(durees_base_trajets[indice] + 0.08 * frequentation);
	});
	return durees_trajets;
};


/*---------------------------------------------------------------------------------------*/
//Données à exporter
/*---------------------------------------------------------------------------------------*/
function Algorithme(profils) {
	// Cette classe est une interface entre la partie algorithmique de la démo et l'affichage
	// des résultats. On l'initialise en lui entrant les paramètres des utilisateurs (issus du
	// fichier root/ressources/profils).
	this.UserIDs= Object.keys(profils);
	this.durees_base_trajets = this.UserIDs.map((id) => parseInt(profils[id]['time']));
	this.dates_trajets = this.UserIDs.map((id) => '08:30');
	this.tailles_groupes = this.UserIDs.map((id) => parseInt(profils[id]['count']));

	this.initVisu = function(socket_visu) {
		// Cette fonction sert à initialiser l'affichage sur l'ordinateur de la démo. Elle commence par générer les
		// paramètres fixes de la démo (plage de temps utilisée, durées de trajets de référence pour l'échelle de couleur
		// utilisée). Puis elle génère l'histogramme de départ et calcule les durées initiales de trajet pour chaque
		// utilisateur, en considérant que tout le monde cherche à se rendre à 8h30 au travail. Enfin elle transmet ces
		// résultats à la visualisation via le socket socket_visu.
		var histogramme = generer_histogramme(horaires, this.dates_trajets, this.tailles_groupes, distribution_probas);
		var histogramme_affichage = calculer_histogramme_affichage(histogramme, horaires_visu, pas_temps_visu,
																   mini, maxi, niveau_bruit_affichage);
		var durees_trajets = calculer_durees_trajets(horaires, histogramme, this.dates_trajets, this.tailles_groupes,
								 					 this.durees_base_trajets, distribution_probas);

		var client_utilise = this.UserIDs[0];
		socket_visu.emit('durees_base', this.durees_base_trajets);
		socket_visu.emit('durees_max', durees_trajets);			    // On initialise tous les trajets comme débutant à la même heure => durée initiale maximale
		socket_visu.emit('durees', durees_trajets);
		socket_visu.emit('histogramme', histogramme_affichage);
		socket_visu.emit('horaires', horaires);
	};

	this.updateVisu = function(sockets_mobile, socket_visu, client_actif, nouveaux_horaires) {
		// Cette fonction est appelée lorsqu'un utilisateur client_actif change sa plage d'horaires d'arrivée. Elle calcule
		// la date d'arrivée optimale pour cet utilisateur, puis actualise les temps de trajets pour chaque individu. Enfin elle
		// communique ces résultats aux tablettes via le socket de client_actif et actualise l'affichage sur l'ordinateur via
		// socket_visu.
		console.log("Début de l'actualisation");
		var indice_actif = this.UserIDs.indexOf(client_actif);
		var date_optimale = optimiser(indice_actif, nouveaux_horaires, this.dates_trajets, this.tailles_groupes,
									  horaires, distribution_probas);
		this.dates_trajets[indice_actif] = date_optimale;

		var histogramme = generer_histogramme(horaires, this.dates_trajets, this.tailles_groupes, distribution_probas);

		var histogramme_affichage = calculer_histogramme_affichage(histogramme, horaires_visu, pas_temps_visu,
																   mini, maxi, niveau_bruit_affichage);

		var durees_trajets = calculer_durees_trajets(horaires, histogramme, this.dates_trajets, this.tailles_groupes,
								 					 this.durees_base_trajets, distribution_probas);

		var dictionnaire_trajets = {};
		this.UserIDs.forEach((val, indice) => dictionnaire_trajets[val] = durees_trajets[indice]);

		sockets_mobile[client_actif].emit('date_depart', {'actif':client_actif, 'nv_date':this.dates_trajets[indice_actif]});
		sockets_mobile[client_actif].broadcast.emit('date_depart', {'actif':client_actif, 'nv_date':this.dates_trajets[indice_actif]});
		sockets_mobile[client_actif].emit('durees', {'actif':client_actif, 'nv_durees':dictionnaire_trajets});
		sockets_mobile[client_actif].broadcast.emit('durees', {'actif':client_actif, 'nv_durees':dictionnaire_trajets});

		socket_visu.emit('histogramme', histogramme_affichage);
		socket_visu.emit('durees', durees_trajets);
		console.log("Fin de l'actualisation");
	};
};

module.exports = { 			// Objets à appeler depuis index.js
	Algorithme: Algorithme,
	horaires: horaires,
	horaires_eligibles: horaires_eligibles
};