const express = require("express");
const Sequelize = require("sequelize");
const router = express.Router();

const models = require("../../models/index");

const Liderancas = models.liderancas;

const BAD_REQUEST = 400;
const SUCCESS = 200;

/**
 * Recupera todos os tipos de lideranças partidárias.
 * 
 * @name get/api/liderancas
 * @function
 * @memberof module:routes/liderancas
 */
router.get("/", (req, res) => {

  Liderancas.findAll({
    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('cargo')) ,'cargo']]
  })
  .then(liderancas => res.status(SUCCESS).json(liderancas))
  .catch(err => res.status(BAD_REQUEST).json({ err }));
});

module.exports = router;
