#!/bin/bash
node index.js &

#new-tab http://localhost:8000/visu 

# launch google chrome in kiosk mode --disable-fre --no-default-browser-check --no-first-run
chromium --no-sandbox --disable-fre  --kiosk --no-first-run \
 --no-default-browser-check --disable-translate --disable-infobars \
 --disable-session-crashed-bubble --disable-tab-switcher --disable-background-mode \
 -url http://localhost:8000/visu