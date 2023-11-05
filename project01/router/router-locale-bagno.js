const express = require('express')
const router = express.Router();
const locale_bagno = require('./../db/dml')



router.get('/', (req, res) => { 
    locale_bagno.getLocaliBagni().then((locali) => { 
        res.send(locali)
    }).catch((error) => { 
        res.send(error)
    })
})

router.get("/summary", (req, res) => {
  locale_bagno
    .getUsciteSummary()
    .then((locali) => {
      res.send(locali);
    })
    .catch((error) => {
      res.send(error);
    });
});

router.get('/:idLocale', (req, res) => { 
    let idLocale = req.params['idLocale']
    locale_bagno.getLocale(idLocale).then((locale) => { 
        res.send(locale)
    }).catch((error) => { 
        res.send(error)
    })
})





module.exports = router