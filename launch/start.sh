#!/bin/bash

demo_path="${PWD}"
cd $demo_path

node index.js &
sleep 2
google-chrome --kiosk http://localhost:8000/visu
killall "node" 
echo "Démo terminée avec succès"
