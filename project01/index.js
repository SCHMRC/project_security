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
const { Server } = require("socket.io");

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
const io = new Server(server, {
  cors: corsOptions,
}); //creo un'istanza di io contente un server di tipo http generato da node.

// Passa l'istanza io al middleware
app.use((req, res, next) => {
  req.io = io; // Aggiunge l'istanza io all'oggetto request
  app.locals.io = io; // Aggiunge l'istanza io all'oggetto app.locals
  next();
});

app.use('/handler',router);
app.use('/classe', router_classe);
app.use("/bagno", router_bagno);
app.use("/locali", router_locali);
app.use("/uscite", router_uscite);

app.get('/receive-rfid', (req, res) => {
    // Ricevi i dati JSON dalla richiesta
    const dataReceived = req.query;

    // Fai qualcosa con i dati ricevuti (esempio: stampali sulla console)
    console.log('Codice RFID ricevuto:', dataReceived.idClasseFK);
    //dataReceived.rfid_code = dataReceived.rfid_code.trim();
    let listClass = ['2DT','3ET']

    promise(relayPin,listClass,'3ET')
      .then((res)=>{
        console.log('*******')
        console.log(res)
        console.log('*******')
        setTimeout(()=>{
          if(!res){
            console.log('entrato')
             relayPin.writeSync(1)
          }
        },1000)
      })
      .then(()=>{
        res.status(200).send('Dati RFID ricevuti con successo');
      })
      .catch((rej)=>{console.log(rej)})
    

    // console.log(listClass.includes(dataReceived.rfid_code));
    // if(listClass.includes(dataReceived.rfid_code)){
    //     relayPin.writeSync(0);
    // }else{
    //     relayPin.writeSync(1);
    // }


    // Invia una risposta al client (Python)

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