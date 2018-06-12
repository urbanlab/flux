#!/bin/bash

node index.js &
sleep 2
google-chrome --kiosk http://localhost:3000/visu
killall "node" 
echo "Démo terminée avec succès"
