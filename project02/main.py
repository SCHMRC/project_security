import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import requests
import time

reader = SimpleMFRC522()

# URL del server Node.js
node_server_url = "http://192.168.1.168:3000/handler/exit-wc"  # Sostituisci con l'URL effettivo del tuo server Node.js
#node_server_url = "http://172.20.10.4:3000/receive-rfid"
already_sent = False
try:
    while True:
        # Leggi il tag RFID
        id, text = reader.read()
        print("ID:", id)
        print("Testo:", text)
        if not already_sent:
            # Invia il codice RFID al server Node.js
            data_to_send = {
                "idClasseFK": text.strip(),
                "timerEndClass": 1,
                "timerEndBath": 0,
                "statoClass":"end_gone_corridoio",
                "statoBath":"pending_bagno",
                "idLocaleFK":"7"
            }
            print(data_to_send)

            response = requests.post(node_server_url, data_to_send)

            # Verifica la risposta del server Node.js
            if response.status_code == 200:
                print("Codice RFID inviato con successo a Node.js")
            else:
                print("Errore durante l'invio del codice RFID a Node.js:", response.status_code)
            
            time.sleep(2)
            already_sent = False

finally:
    GPIO.cleanup()
