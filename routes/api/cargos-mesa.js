const express = require("express");
const Sequelize = require("sequelize");
const { validationResult } = require('express-validator');

const router = express.Router();

const casaValidator = require("../../utils/middlewares/casa.validator");

const models = require("../../models/index");
const CargosMesa = models.cargosMesa;

const BAD_REQUEST = 400;
const SUCCESS = 200;


/**
 * Recupera cargos na Mesa Diretora
 * @name get/api/cargos-mesa
 * @function
 * @apiparam Casa Casa de origem do parlamentar. Pode ser "camara" (default) ou "senado".
 * @memberof module:routes/cargos-mesa
 */
router.get("/", casaValidator.validate, (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const casa = req.param("casa") || "camara"

  CargosMesa.findAll({
    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('cargo')) ,'cargo']],
    where: {
      casa: casa
    }
  })
  .then(cargosMesa => res.status(SUCCESS).json(cargosMesa))
  .catch(err => res.status(BAD_REQUEST).json({ err }));
});

module.exports = router;