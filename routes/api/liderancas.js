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
* @swagger
* tags:
*   name: Lideranças
*   description: Módulo de recuperação das lideranças em partidos e blocos partidários.
*/

/**
* @swagger
* path:
*  /api/liderancas/:
*    get:
*      summary: Recupera cargos distintos das lideranças partidárias da Câmara ou do Senado.
*      tags: [Lideranças]
*      parameters:
*        - in: query
*          name: casa
*          schema:
*            type: string
*          required: true
*          description: Casa para recuperação dos cargos. Pode ser "camara" (default) ou "senado".
*      responses:
*        "200":
*          description: Informações dos cargos das lideranças da casa passada como parâmetro.
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
