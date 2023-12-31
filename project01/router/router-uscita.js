const express = require('express')
const router = express.Router();
const uscite = require('./../db/dml')



router.get('/', (req, res) => {
    uscite.getUscite().then((uscite) => { 
        res.send(uscite)
    }).catch((error) => { 
        res.send(error)
    })
    
})

router.get('/stato', (req, res) => {
    let stato = req.body['stato']
    let idClasseFK = req.body['idClasseFK'];
    uscite
      .getUsciteStato(idClasseFK,stato)
      .then((uscite) => {
        res.send(uscite);
      })
      .catch((error) => {
        res.send(error);
      });
    
})
router.post('/classe', (req, res) => {
  let timestamp = req.body.params['timestamp']
  timestamp = timestamp.split(' ')[0]+'%'
    let idClasseFK = req.body.params["idClasseFK"];
    uscite
      .getUsciteTimeStamp(idClasseFK, timestamp)
      .then((uscite) => {
        res.send(uscite);
      })
      .catch((error) => {
        res.send(error);
      });
    
})

router.get('/last-exit-class/:idClasseFK', (req, res) => { 
  let idClasseFK = req.params["idClasseFK"];
  uscite.getUltimaUscitaClasse(idClasseFK).then(timestamp => { 
    if (timestamp) { 
      res.status(200).header({"content":"success"}).json(timestamp)
    }
  }).catch(err => { 

  })
})

router.get("/end-exit-class/:idClasseFK", (req, res) => {
  let idClasseFK = req.params["idClasseFK"];
  uscite
    .getEndUscitaClasseAndata(idClasseFK)
    .then((timestamp) => {
      if (timestamp) {
        res.status(200).header({ content: "success" }).json(timestamp);
      }
    })
    .catch((err) => {});
});



module.exports = router;