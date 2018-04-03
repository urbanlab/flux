/* La fonction get_prob_array permet d'ouvrir un histogramme
 * des temps de trajets au cours du temps sur la portion de route étudiée */

function get_prob_array(path_to_file);


/* La fonction scale_histogram transforme un vecteur dont la somme des elements vaut N
 * en un vecteur dont la somme des elements vaut n */

function scale_histogram(hist, n);


/* la fonction time2index transforme une heure
 * de type xx:xx en sont index dans un histogram compris entre 0-24
 * (12 heures par tranches de 15 minutes)
 * (Une heure qui n'est pas ecrit par tranches de 15 min
 * sera reduit a la tranche inférieure : exemple : 9h34 -> 9h30 -> index=14) */

function time2index(time);


/* fonction inverse a time2index */

function index2hour(index);


/* La fonction softmax transforme un histogramme dont la somme vaut N en un histogramme dont la somme vaut 1 
 * (autrement dit il transforme les proportions de l'histogramme en probabilités)*/

function my_softmax(list);


/* cette fontion permet de calculer un vecteur de probabilités inverse 
 * par rapport aux probabilité se l'histogramme entré
 * La somme du vecteur entré doit etre 1 */

function reverse_vector (vector);


/* cette fonction permet d'inverser les probababilité d'un vecteur dont la somme des elements vaut N */

function reverse_proba (vector);


/* cette fonction inverse les probabilités d'un vecteur entre 's' (qui est l'index de depart) et 'e' (qui est l'index de fin) 
 * (la fonction retourne les probabilité inverse sur la tranche 's - e' et 0 sur les autres element du vecteur )*/

function reverse_proba_special(vector, s, e);


/* Cette fonction modifie le coef Num en le divisant par la somme des elements entre 's' et 'e' sur le vecteur Rinitial 
 * fonction utilisé dans extract */

function get_coef(Rinitial, s, e, Num);


/* La fonction extract renvoie un vecteur de la meme taille que l'histogramme, contenant un nombre 'Num'
 * de personne, repartie selon les proportions de l'histogramme entre 's' et 'e' (sur le vecteur de sortie)
 * (Les autres membres du vecteur de sortie sont a 0) */

function extract(Rinitial, s, e, Num);


/* cette fonction soustrait extract à Rinitial */

function sub_extract(Rinitial, extract);


/* cette fonction ajoute un vecteur new_extract a sub_vect */

function push_extract(sub_vect, new_extract);


/* Cette fonction repartie selon les proportion de sub_vect, un nombre de personne 'Num' entre les indexs 's' et 'e' assemblement de (reverse_proba_special, extract, push_extract) */

function repart_proba(sub_vect, s, e, Num);


/* obtient l'index du nombre minimum entre les indexs 's' et 'e' sur un vecteur */

function get_min(sub_vect, s, e);


/* Fonction concurente et bien plus performante que repart_proba qui repartie chaque personne
 * en fonction du minimum sur la tranche 's - e' a chaque tour 
 * (il pose 300 personne en obtimisant au maximum la route sur la tranche horaire ciblée) */

function my_repart(sub_vect, s, e , num);


/* cette fonction construit un histogramme (assmblage de extract(), sub_extract() et my_repart())*/

function make_histo (histogram, start, end, num);


/* La fonction scale_histogram transforme un vecteur dont la somme des elements vaut N
 * en un vecteur dont la somme des elements vaut n */

function scale_histogram(hist, n);


/* fonction inverse a time2index */

function index2hour(index);


/* cette fonction renvoie une heure aleatoire sous la forme 'xx:xx' entre les index 'start' et 'end' */

function getSuggestedTime(client, histo, start, end);


/* cette fonction calcule le temps de trajets de chaque personne en fonction de sont heure de depart */

function getTimeMove(client, histo, index);


/* La fonction updateVisu permet de mettre a jour la visualisation,
 * elle envoie a la visu des info l'histogramme et les heures de depart des trois personnages
 * et envois a chacun des personnages ses heures de trajets et de depart */

module.exports = {
    updateVisu: function (visu, clients, sockets)

/*******************************************************************************************************/
