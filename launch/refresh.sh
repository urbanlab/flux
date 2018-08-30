#!/bin/bash

demo_path="/home/erasme/Flux/flux"
cd $demo_path

echo "Arrêt de la démo..."
killall node
killall chrome
echo "Démo arrêtée"

sleep 3

echo "Démarrage de la démo..."
node index.js > logs/server_log.log &
sleep 2
google-chrome --kiosk http://localhost:3000/visu > logs/browser_log.log &
echo "Démo redémarrée"
