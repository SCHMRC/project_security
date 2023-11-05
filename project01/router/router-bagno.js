const express = require('express');
const router = express.Router();
const bagno = require('./../db/dml');


router.get("/:idLocaleFK", (req, res) => {
    let idLocaleFK = req.params["idLocaleFK"];
  bagno
    .getBagni(idLocaleFK)
    .then((bagni) => {
      res.send(bagni);
    })
    .catch((error) => res.send(error));
});







module.exports = router
