const express = require("express");
const Sequelize = require("sequelize");
const { validationResult } = require('express-validator');

const router = express.Router();

const casaValidator = require("../../utils/middlewares/casa.validator");

const models = require("../../models/index");
const Comissoes = models.comissoes;
const ComposicaoComissoes = models.composicaoComissoes;


/**
* @swagger
* tags:
*   name: Comissões
*   description: Recupera comissões permanentes da Câmara e do Senado.
*/

/**
* @swagger
* path:
*  /api/comissoes/:
*    get:
*      summary: Recupera comissões permanentes da Câmara ou do Senado. 
*               A casa é passada como parâmetro e pode ser 'camara' ou 'senado'.
*      tags: [Comissões]
*      parameters:
*        - in: query
*          name: casa
*          schema:
*            type: string
*          required: true
*          description: Casa de origem do parlamentar. Pode ser "camara" (default) ou "senado".
*      responses:
*        "200":
*          description: Informações das comissões permanentes da casa passada como parâmetro.
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
* @swagger
* path:
*  /api/comissoes/composicao/:
*    get:
*      summary: Recupera comoposição das comissões permanentes da Câmara ou do Senado.
*               A casa é passada como parâmetro e pode ser 'camara' ou 'senado'.
*      tags: [Comissões]
*      parameters:
*        - in: query
*          name: casa
*          schema:
*            type: string
*          required: true
*          description: Casa de origem do parlamentar. Pode ser "camara" (default) ou "senado".
*      responses:
*        "200":
*          description: Informações da composição das comissões permanentes da casa passada como parâmetro.
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
* @swagger
* path:
*  /api/comissoes/membros/:
*    get:
*      summary: Recupera lista de membros das comissões permamentes da Câmara e do Senado.
*      tags: [Comissões]
*      responses:
*        "200":
*          description: Informações da composição das comissões permanentes da casa passada como parâmetro.
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
* @swagger
* path:
*  /api/comissoes/cargos/:
*    get:
*      summary: Recupera todos os tipos de cargos em comissões.
*               A casa é passada como parâmetro e pode ser 'camara' ou 'senado'.
*      tags: [Comissões]
*      parameters:
*        - in: query
*          name: casa
*          schema:
*            type: string
*          required: true
*          description: Casa de origem do parlamentar. Pode ser "camara" (default) ou "senado".
*      responses:
*        "200":
*          description: Informações dos cargos distintos possíveis nas Comissões.
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