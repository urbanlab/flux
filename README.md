# FLUX
Gestion de 3 appareils **representant X personnes (~20% des personnes sur la zone)** qui veulent se rendre au **même endroit**.

## Install
	git clone https://github.com/urbanlab/flux.git && cd flux ; npm install ; node index.js

## Déploiement
### En local (test avant déploiement sur serveur)
```
//pousser la branche dev
$ git push
//récupérer la branche master
$ git checkout master
$ git pull
$ git merge dev
$ git checkout dev //pour éviter de travailler sur la branche master
```
### Sur le serveur
```
//se connecter sur le serveur
$ ssh flux@192.168.61.5
//entrer dans le serveur screen où le node tourne
$ screen -r
//arreter le serveur actuelr
ctrl^c
//récupérer master
$ git pull
//relancer node
$ node index.js
//sortir de screen
ctrl^a ctrl^d
//quitter ssh
$ exit
```
Connect to *:3000/Mobile/?profile=[villeurbanne/lyon7/tassin] for user interface. (choisir entre les différents noms de profils)</br>
Connect to *:3000/Visu for visual response to the user modification.

## Dependencies
	nodejs
		modules: http express jquery socket.io
	p5.js
		https://p5js.org/download/


