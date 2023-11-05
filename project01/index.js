const express = require('express');
const http = require('http');
const Gpio = require('onoff').Gpio;
const relayPin = new Gpio(14, 'out'); // Usa il pin GPIO 14 per il relè
const relay2Pin = new Gpio(27, 'out'); // Usa il pin GPIO 14 per il relè
var cors = require('cors')
const { promise, setRele } = require('./util')
const { db } = require('./db/connector')
const { createTableDB } = require('./db/ddl')
const router = require('./db/router')
const router_classe = require('./router/router-classe')
const router_bagno = require('./router/router-bagno')
const router_locali = require('./router/router-locale-bagno')
const router_uscite = require('./router/router-uscita')
const bodyParser = require('body-parser')

const app = express();
let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
const server = http.createServer(app);
const port = 3000;
createTableDB(db())
// Middleware per estrarre i parametri comuni da ogni richiesta POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/handler',router);
app.use('/classe', router_classe);
app.use("/bagno", router_bagno);
app.use("/locali", router_locali);
app.use("/uscite", router_uscite);

app.get('/receive-rfid', (req, res) => {
    // Ricevi i dati JSON dalla richiesta
    const dataReceived = req.query;

    // Fai qualcosa con i dati ricevuti (esempio: stampali sulla console)
    console.log('Codice RFID ricevuto:', dataReceived.idClasseFK.length);
    //dataReceived.rfid_code = dataReceived.rfid_code.trim();
    let listClass = ['2DT','3ET']

    promise(relayPin,listClass,dataReceived.idClasseFK)
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

app.get('/receive-rfid-a',(req,res)=>{
  console.log(req.query["rfid_code"]);
  let temp = {
    idClasseFK : req.query["rfid_code"],
    timerEnd : false,
    stato : "pending_gone_corridoio"
  }
  
  res.status(200).send('Dati RFID ricevuti con successo capo A');
});


app.get('/set', (req, res) => {
  res.send(setRele(relayPin));
});

app.get('/set2', (req, res) => {
  res.send(setRele(relay2Pin));
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
