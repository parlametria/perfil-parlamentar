const express = require("express");
const router = express.Router();
const { validationResult } = require('express-validator');

const models = require("../../models/index");
const casaValidator = require("../../utils/middlewares/casa.validator");

const Proposicao = models.proposicao;
const Temas = models.tema;
const Votacao = models.votacao;

const BAD_REQUEST = 400;
const SUCCESS = 200;

/**
 * Recupera quantidade de votações selecionadas para o cálculo da aderência
 * 
 * @name get/api/votacoes
 * @apiparam casa Casa de origem da proposição. Pode ser "camara" (default) ou "senado".
 * @function
 * @memberof module:routes/votacoes
 */
router.get("/", casaValidator.validate, (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const casa = req.param("casa") || "camara"

  Votacao.count({
    include: [
      {
        model: Proposicao,
        as: "proposicaoVotacoes",
        required: true,
        where: {
          status_importante: "Ativa",
          casa: casa
        },
      }
    ],
    distinct: true,
    col: 'id_votacao'
  })
    .then(numero_votacoes => res.status(SUCCESS).json(
      { numero_votacoes: numero_votacoes }
    ))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

module.exports = router;
