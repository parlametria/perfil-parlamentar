const express = require("express");
const Sequelize = require("sequelize");

const router = express.Router();

const Op = Sequelize.Op;

const models = require("../../models/index");
const Candidato = models.candidato;

const BAD_REQUEST = 400;
const SUCCESS = 200;

/**
 * Recupera informações do mapeamento ID do parlamentar e CPF
 * @name get/api/parlamentares
 * @function
 * @memberof module:routes/parlamentares
 */
router.get("/mapeamento-cpf", (req, res) => {
  Candidato
    .findAll({
      attributes: ["cpf", "id_parlamentar"],
      where: {
        id_parlamentar: {
          [Op.ne]: null
        }
      }
    })
    .then(candidatos => res.status(SUCCESS).json(candidatos))
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

module.exports = router;