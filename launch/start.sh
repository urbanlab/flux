#!/bin/bash

demo_path="/home/erasme/Flux/flux"
cd $demo_path

node index.js &
sleep 2
google-chrome --kiosk http://localhost:3000/visu
killall "node" 
echo "Démo terminée avec succès"
