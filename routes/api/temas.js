const express = require("express");
const router = express.Router();

const models = require("../../models/index");

const Tema = models.tema;

const BAD_REQUEST = 400;
const SUCCESS = 200;

/**
 * Pega todas os temas.
 * @name get/api/temas
 * @function
 * @memberof module:routes/temas
 */
router.get("/", (req, res) => {
  Tema.findAll({
    attributes: [["id_tema", "idTema"], "tema", "slug"],
    where: { ativo: true }
  })
  .then(temas => res.status(SUCCESS).json(temas))
  .catch(err => res.status(BAD_REQUEST).json({ err }));
});

module.exports = router;
