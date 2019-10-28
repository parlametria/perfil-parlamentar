const express = require("express");
const Sequelize = require("sequelize");
const { validationResult } = require('express-validator');

const router = express.Router();

const casaValidator = require("../../utils/middlewares/casa.validator");

const models = require("../../models/index");
const Liderancas = models.liderancas;

const BAD_REQUEST = 400;
const SUCCESS = 200;

/**
 * Recupera todos os tipos de lideranças partidárias.
 * 
 * @name get/api/liderancas
 * @param casa Casa de origem do parlamentar. Pode ser "camara" (default) ou "senado".
 * @function
 * @memberof module:routes/liderancas
 */
router.get("/", casaValidator.validate, (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const casa = req.param("casa") || "camara"

  Liderancas.findAll({
    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('cargo')) ,'cargo']],
    where: {
      casa: casa
    }
  })
  .then(liderancas => res.status(SUCCESS).json(liderancas))
  .catch(err => res.status(BAD_REQUEST).json({ err }));
});

module.exports = router;
