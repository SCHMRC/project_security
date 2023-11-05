const express = require('express');
const router = express.Router();
const classe = require('./../db/dml');




router.get('/', (req, res) => { 
    classe.getListClasse().then((result) => { 
        res.send(result)
    })
    
})


router.get('/:idClasse', (req, res) => { 
    console.log(req.params['idClasse'])
    classe.getClasse(req.params['idClasse']).then((result) => {
      res.send(result);
    });
})

router.post('/:idClasse', (req, res) => { 
    
}
)
router.put('/:idClasse', (req, res) => { 
    
})

router.delete('/:idClasse', (req, res) => { 
    
})




module.exports = router;