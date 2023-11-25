start php -S 0.0.0.0:8080

cd server/services/hue
start python config_hue.py
start python get-AND-set-hue.py
cd ..
cd sonos
start python config-sonos.py
start python get-sonos.py
start python set-sonos.py