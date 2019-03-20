/** Express router
 * @module routes/comissoes
 * @requires express
 */
const express = require("express");

const router = express.Router();

const models = require("../../models/index");
const Comissoes = models.comissoes;
const ComposicaoComissoes = models.composicaoComissoes;

/**
 * Recupera lista de Comissões
 * @name get/api/comissoes/
 * @function
 * @memberof module:routes/comissoes
 */
router.get("/", (req, res) => {
  Comissoes.findAll({})
    .then(comissoes => res.status(200).json(comissoes))
    .catch(err => res.status(400).json(err.message));
});

/**
 * Recupera lista com parlamentares e Comissões
 * @name get/api/comissoes/composicao
 * @function
 * @memberof module:routes/comissoes
 */
router.get("/composicao", (req, res) => {
  ComposicaoComissoes.findAll({
  })
    .then(composicao => res.status(200).json(composicao))
    .catch(err => res.status(400).json(err.message));
});

/**
 * Recupera lista de membros das comissões
 * @name get/api/comissoes/membros
 * @function
 * @memberof module:routes/comissoes
 */
router.get("/membros", (req, res) => {
  Comissoes.findAll({
    include: [
      {
        model: ComposicaoComissoes,
        as: "comissao_comp",
        required: true
      }
    ]
  })
    .then(comissoes => res.status(200).json(comissoes))
    .catch(err => {
      res.status(400).json(err.message);
    });
});

module.exports = router;