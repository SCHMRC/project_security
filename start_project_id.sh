#!/bin/bash

# Funzione per terminare tutti i processi figli
function terminate_children {
  pkill -P $$
}

# Aggiungi un gestore di segnali per SIGINT (Ctrl+C)
trap 'terminate_children; exit 2' SIGINT

# Avvia il server Node.js in /home/pi/project01
cd /home/pi/project_security/project01
nodemon index.js &

# Avvia lo script Python in /home/pi/project02
cd /home/pi/project_security/project02
python main.py &

# Aspetta che uno qualsiasi dei processi figli termini
wait
