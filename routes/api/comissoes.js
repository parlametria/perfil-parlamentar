const express = require("express");
const Sequelize = require("sequelize");
const { validationResult } = require('express-validator');

const router = express.Router();

const casaValidator = require("../../utils/middlewares/casa.validator");

const models = require("../../models/index");
const Comissoes = models.comissoes;
const ComposicaoComissoes = models.composicaoComissoes;


/**
 * Recupera lista de Comissões
 * @name get/api/comissoes/
 * @function
 * @apiparam Casa Casa de origem do parlamentar. Pode ser "camara" (default) ou "senado".
 * @memberof module:routes/comissoes
 */
router.get("/", casaValidator.validate, (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const casa = req.param("casa") || "camara"

  Comissoes.findAll({
    attributes: [["id_comissao_voz", "idComissaoVoz"], "sigla", "nome"],
    order: ['nome'],
    where: {
      casa: casa
    }
  })
    .then(comissoes => res.status(200).json(comissoes))
    .catch(err => res.status(400).json(err.message));
});

/**
 * Recupera lista com parlamentares e Comissões
 * @name get/api/comissoes/composicao
 * @apiparam Casa Casa de origem do parlamentar. Pode ser "camara" (default) ou "senado".
 * @function
 * @memberof module:routes/comissoes
 */
router.get("/composicao", casaValidator.validate, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const casa = req.param("casa") || "camara"

  ComposicaoComissoes.findAll({
    include: [
      {
        attributes: [],
        model: Comissoes,        
        as: "infoComissao",
        required: true,
        where: {
          casa: casa
        }
      }
    ]
  })
    .then(composicao => res.status(200).json(composicao))
    .catch(err => res.status(400).json(err.message));
});

/**
 * Recupera lista de membros das comissões permamentes da Câmara e do Senado
 * @name get/api/comissoes/membros
 * @function
 * @memberof module:routes/comissoes
 */
router.get("/membros", (req, res) => {
  Comissoes.findAll({
    include: [
      {
        model: ComposicaoComissoes,
        as: "comissaoComp",
        required: true
      }
    ]
  })
    .then(comissoes => res.status(200).json(comissoes))
    .catch(err => {
      res.status(400).json(err.message);
    });
});

/**
 * Recupera todos os tipos de cargos em comissões.
 * 
 * @name get/api/comissoes/cargos
 * @apiparam Casa Casa de origem do parlamentar. Pode ser "camara" (default) ou "senado".
 * @function
 * @memberof module:routes/comissoes
 */
router.get("/cargos", casaValidator.validate, (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const casa = req.param("casa") || "camara"

  ComposicaoComissoes.findAll({
    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('cargo')), 'cargo']],    
    include: [
      {
        attributes: [],
        model: Comissoes,        
        as: "infoComissao",
        required: true,
        where: {
          casa: casa
        }
      }
    ],    
    raw: true
  })  
    .then(composicao => res.status(200).json(composicao))
    .catch(err => res.status(400).json(err.message));
});

module.exports = router;