const express = require('express');
const http = require('http');
const Gpio = require('onoff').Gpio;
const relayPin = new Gpio(14, 'out'); // Usa il pin GPIO 14 per il relè
var cors = require('cors')
const { promise } = require('./util')
const { db } = require('./db/connector')
const { createTableDB } = require('./db/ddl')

const app = express();
let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
const server = http.createServer(app);
const port = 3000;
createTableDB(db())

app.get('/receive-rfid', (req, res) => {
    // Ricevi i dati JSON dalla richiesta
    const dataReceived = req.query;

    // Fai qualcosa con i dati ricevuti (esempio: stampali sulla console)
    console.log('Codice RFID ricevuto:', dataReceived.rfid_code.length);
    dataReceived.rfid_code = dataReceived.rfid_code.trim();
    let listClass = ['2DT','3ET']

    promise(relayPin,listClass,dataReceived.rfid_code)
      .then((res)=>{
        setTimeout(()=>{
          (!res)? relayPin.writeSync(1) : null;
        },1000)
      })
      .catch((rej)=>{console.log(rej)})
    

    // console.log(listClass.includes(dataReceived.rfid_code));
    // if(listClass.includes(dataReceived.rfid_code)){
    //     relayPin.writeSync(0);
    // }else{
    //     relayPin.writeSync(1);
    // }


    // Invia una risposta al client (Python)
    res.status(200).send('Dati RFID ricevuti con successo');
});


app.get('/set', (req, res) => {
  let currentState = relayPin.readSync();
  let state;
  if (currentState) {
    relayPin.writeSync(0);
    state = 'ON';
  } else {
    relayPin.writeSync(1);
    state = 'OFF';
  }
  res.send(state);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
