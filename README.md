# FLUX

## Description globale

### Aperçu
Programme utilisé par le prototype **flux** exposé à l'Urban Lab de la métropole de Lyon. Le scénario simulé est le suivant:
* Un certain nombre de personnes (de l'ordre du millier) doivent se rendre au travail dans une entreprise.
* Elles ont tendance à arriver au même moment, vers 8h30. Cela propose une congestion de la voie d'accès au lieu de travail.
* Grâce à une application mobile, le personnel peut décaler ses horaires d'arrivée en fonction de ses impératifs pour réduire la congestion du trafic optimiser le temps de trajet de chacun.

### Architecture physique
Pour la démonstration, on divise le personnel en trois catégories au comportement homogène. Chaque catégorie est représentée par une personne-type, incarnée par un visiteur interagissant avec la maquette. Cette dernière consiste en 2 éléments:
* **3 tablettes**, qui représentent l'application finale pour trois groupes d'utilisateurs. L'utilisateur dispose d'un emploi du temps qu'il doit respecter, et y entre les horaires min et max entre lesquels il peut arriver au travail. L'application lui suggère alors un horaire auquel arriver et lui indique la durée de son trajet via une interface de type chatbot.
* **1 écran**, qui représente les conditions de circulation au fil du temps. Les temps de trajet des utilisateurs ainsi que l'histogramme de la circulation en fonction du temps et une visualisation 15min par 15min de l'état de la circulation s'y affichent.

### Implémentation et structure
Il s'agit d'une application Web réalisée avec un serveur NodeJS et deux pages Web (1 visuel pour les tablettes et 1 pour l'écran). Les dispositifs communiquent entre eux via le port 3000 de leur réseau Wifi, en utilisant la technologie des sockets.

* Le serveur est codé sur le fichier root/index.js du répertoire racine. Les calculs regroupés dans les fonctions de *root/scripts/fonctions_backend.js*, et les données des utilisateurs sont chargées depuis le JSON *root/ressources/profils*
* La page de l'affichage global se situe en *root/views/visu/index.html*, l'affichage étant généré grâce à la technologie p5.js à partir du fichier *root/views/visu/sketch.js*
* La page d'affichage par les dispositifs mobiles est réalisé en *root/views/mobile/index.html*

## Guide d'utilisation

**/!\\Attention:** Cette démo a été réalisée sous Linux (Ubuntu 16.04) et avec Google Chrome, son support n'est pas garanti sous d'autres OS et elle ne fonctionne pas sous d'autres navigateurs !


### Utilisation sous docker

`docker-compose up`

### Téléchargement et préparation
1) Ouvrir une console et entrer:
```
git clone https://github.com/urbanlab/flux.git
npm install --save probability-distributions
cd flux
chmod +x launch/start.sh
```
2) Relever l'adresse IP de l'ordinateur utilisé avec la commande ifconfig

### Lancement de la démo
1) Fermer toute fenêtre Google Chrome et ouvrir une console dans le répertoire root (flux).
2) Entrer `./launch/start.sh`
3) Ouvrir les trois tablettes et entrer les URL suivantes dans la barre d'adresses (1 par tablette):
	* (adresse_IP_relevée):3000/mobile/?profile=lyon7
	* (adresse_IP_relevée):3000/mobile/?profile=tassin
	* (adresse_IP_relevée):3000/mobile/?profile=villeurbanne
4) Si ces URLs sont déjà chargées, recharger les pages des tablettes.
5) Pour terminer la démo, fermet la page Google de l'ordinateur avec Ctrl+F4

### En cas de problème
* *La page affichée par l'ordinateur est une image statique*:
  * Recharger la page Web de l'ordinateur (touche F5) puis celles des tablettes.
* *Les tablettes ne chargent pas leur page Web et affichent une erreur*:
  * Vérifier que les tablettes et l'ordinateur-serveur sont bien connectés sur le même réseau Wifi

### Modification des paramètres de la démo
Pour modifier les paramètres de la démo:
* Données des utilisateurs: *root/ressources/profils*
* Paramètres généraux (horaires, pas de temps, ...): *root/scripts/fonctions_backend.js*
* Paramètres d'affichage (écran): *root/views/visu/sketch.js*
* Paramètres d'affichage (tablettes): *root/views/mobile/index.html*

## Encore à faire:
* Faire en sorte que le trafic simulé sur la route par des ellipses mobiles corresponde au trafic "réel".
* Ajouter un système de crédits, qu'on gagne en bénéficiant au système et qu'on consomme lorsqu'on est une charge pour lui.
