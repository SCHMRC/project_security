const express = require('express');
const router = express.Router()
const crud = require('./dml')
const fetch = require('node-fetch')


const middleware = (req,res,next) => {
    req.idClasse = req.body['idClasse'];
    req.livello = req.body['livello'];
    req.aula = req.body['aula'];
    req.idLocaleFK = req.body['idLocaleFK'];
    req.idClasseFK = req.body['idClasseFK'];
    req.timerEndClass = req.body['timerEndClass'];
    req.timerEndBath = req.body['timerEndBath'];
    req.statoClass = req.body['statoClass'];
    req.statoBath = req.body['statoBath'];
    req.timeStamp = req.body['timeStamp'];
    req.idBagno = req.body['idBagno'];
    next();
}


router.post('/class',middleware,(req,res)=>{
    crud.createClass(req.idClasse,req.livello,req.aula)
        .then((res)=>{
            res.status(200).header(res).json(res);
        })
        .catch((err)=>res.status(500).send(err)) 
})

router.post('/wc',middleware,(req,res)=>{
    crud.createBagno(req.idLocaleFK)
        .then((res)=>{
            res.status(200).header(res).json(res);
        })
        .catch((err)=>res.status(500).send(err))    
})

router.post('/wc-local',middleware,(req,res)=>{
    crud.createLocaleBagno(req.livello)
        .then((res)=>{
            res.status(200).header(res).json(res);
        })
        .catch((err)=>res.status(500).send(err)) 
    
})

router.post('/exit',middleware,(req,res)=>{
    crud.createUscita(req.idClasseFK,req.timerEndClass,req.statoClass)
        .then((res)=>{
            res.status(200).header(res).json(res);
        })
        .catch((err)=>res.status(500).send(err))   
})

router.post('/exit-wc', middleware, (req, res) => {
    if(req.idClasseFK){
        crud.createUscita(req.idClasseFK, req.timerEndClass, req.statoClass)
            .then(() => {
                console.log("createUscita completato");
                return crud.createUscitaBagno(req.idClasseFK, req.timerEndBath, req.statoBath, req.idLocaleFK);
            })
            .then(() => {
                console.log("createUscitaBagno completato");
                let init = {
                    method: 'GET'
                };
                return fetch(`http://192.168.1.168:3000/receive-rfid?idClasseFK=${req.idClasseFK}`, init);
            })
            .then(response => {
                console.log("fetch completato");
                //if (res.status === 200) {
                    res.status(200).json({"Content":"Success"}); // Estrai il corpo della risposta in formato JSON
                //} else {
//throw new Error(`Errore durante la richiesta: ${res.status}`);
               // }
            })
            .then(data => {
                console.log("Successo: ", "ok");
                res.status(200).json(data); // Invia la risposta al client
            })
            .catch(err => {
                res.status(500).send("Errore!!!!!"); // Gestisci gli errori
                //res.status(500).send(err); // Gestisci gli errori
            });
        }
    });





module.exports = router