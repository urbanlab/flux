## Fonctionnement de la visualisation
* La page Web et les communications par socket sont contenues dans le fichier *index.html*, mais l'affichage est géré par *sketch.js*
* *p5.js* gère l'affichage en faisant tourner en boucle la fonction *draw*. C'est donc cette dernière qu'il faudra modifier pour changer l'affichage.

## A faire:
* Faire en sorte que les constantes numériques de *sketch.js* ne soient plus hard-codées
* Supprimer les nombres hard-codés dans le corps de la fonction *draw*, afin que l'utilisateur puisse modifier la visualisation en touchant uniquement les constantes en tête du programme.
* Standardiser l'emplacement des fichiers en reprenant la structure de */root/visu/views/mobile*, actuellement c'est un peu le bazar dans les fichiers.
