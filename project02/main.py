import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import requests

reader = SimpleMFRC522()

# URL del server Node.js
node_server_url = "http://192.168.1.169:3000/receive-rfid"  # Sostituisci con l'URL effettivo del tuo server Node.js
#node_server_url = "http://172.20.10.4:3000/receive-rfid"
try:
    while True:
        # Leggi il tag RFID
        id, text = reader.read()
        print("ID:", id)
        print("Testo:", text)

        # Invia il codice RFID al server Node.js
        data_to_send = {
            "rfid_code": text
        }
        print(data_to_send)

        response = requests.get(node_server_url, data_to_send)

        # Verifica la risposta del server Node.js
        if response.status_code == 200:
            print("Codice RFID inviato con successo a Node.js")
        else:
            print("Errore durante l'invio del codice RFID a Node.js:", response.status_code)

finally:
    GPIO.cleanup()
