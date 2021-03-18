const express = require("express");
const Sequelize = require("sequelize");
const { validationResult } = require('express-validator');

const router = express.Router();

const casaValidator = require("../../utils/middlewares/casa.validator");

const models = require("../../models/index");
const Comissoes = models.comissoes;
const ComposicaoComissoes = models.composicaoComissoes;
const Parlamentar = models.parlamentar;

const BAD_REQUEST = 400;
const SUCCESS = 200;

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
*        - in: query
*          name: somente_ativos
*          schema:
*            type: boolean
*          required: true
*          description: Flag indicando se devem ser retornados os membros ativos (default) ou todos.
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

  let somente_ativos = req.param("somente_ativos")

  if (somente_ativos) {
    somente_ativos = somente_ativos === 'true'
  } else {
    somente_ativos = true
  }

  let whereCondition = {}

  if (somente_ativos === true) {
    whereCondition.is_membro_atual = somente_ativos
  }

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
    ],
    where: whereCondition
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
*      parameters:
*        - in: query
*          name: somente_ativos
*          schema:
*            type: boolean
*          required: true
*          description: Flag indicando se devem ser retornados os membros ativos (default) ou todos.
*      responses:
*        "200":
*          description: Informações da composição das comissões permanentes da casa passada como parâmetro.
*/
router.get("/membros", (req, res) => {
  let somente_ativos = req.param("somente_ativos")

  if (somente_ativos) {
    somente_ativos = somente_ativos === 'true'
  } else {
    somente_ativos = true
  }

  let whereCondition = {}

  if (somente_ativos === true) {
    whereCondition.is_membro_atual = somente_ativos
  }

  Comissoes.findAll({
    include: [
      {
        model: ComposicaoComissoes,
        as: "comissaoComp",
        required: true,
        where: whereCondition
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
    raw: true,
    where: {
      is_membro_atual: true
    }
  })
    .then(composicao => res.status(200).json(composicao))
    .catch(err => res.status(400).json(err.message));
});

/**
* @swagger
* path:
*  /api/presidentes/:
*    get:
*      summary: Recupera parlamentares presidentes em comissões da Câmara e do Senado.
*      tags: [Comissões)]
*      parameters:
*        - in: query
*          name: somente_ativos
*          schema:
*            type: boolean
*          required: true
*          description: Flag indicando se devem ser retornados os membros ativos (default) ou todos.
*      responses:
*        "200":
*          description: Recupera informações da lista de parlamentares presidentes de comissões.
*/
router.get("/presidentes", (req, res) => {
  let somente_ativos = req.param("somente_ativos")

  if (somente_ativos) {
    somente_ativos = somente_ativos === 'true'
  } else {
    somente_ativos = true
  }

  let whereCondition = {
    cargo: "Presidente"
  }

  if (somente_ativos === true) {
    whereCondition.is_membro_atual = somente_ativos
  }

  Parlamentar.findAll({
    attributes: ["id_parlamentar_voz", "casa"],
    include: [
      {
        model: ComposicaoComissoes,
        attributes: ["cargo", "data_inicio", "data_fim", "is_membro_atual"],
        include: [
          {
            model: Comissoes,
            attributes: ["sigla"],
            as: "infoComissao",
            required: false
          }
        ],
        where: whereCondition,
        as: "parlamentarComissoes",
        required: true
      }
    ]
  })
    .then(parlamentares => {
      res.status(SUCCESS).json(parlamentares);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
* @swagger
* path:
*  /api/presidentes/{id}:
*    get:
*      summary: Recupera presidências em comissões de um parlamentar específico
*      tags: [Comissões]
*      parameters:
*        - in: path
*          name: id
*          schema:
*            type: integer
*          required: true
*          description: Id do parlamentar
*      responses:
*        "200":
*          description: Recupera informações da lista de parlamentares presidentes de comissões.
*/
router.get("/presidentes/:id", (req, res) => { 
  Parlamentar.findAll({
    attributes: ["id_parlamentar_voz", "casa"],
    include: [
      {
        model: ComposicaoComissoes,
        attributes: ["cargo", "data_inicio", "data_fim", "is_membro_atual"],
        include: [
          {
            model: Comissoes,
            attributes: ["sigla"],
            as: "infoComissao",
            required: false
          }
        ],
        where: {
          cargo: "Presidente",
          is_membro_atual: true
        },
        as: "parlamentarComissoes",
        required: true
      }
    ],
    where: {
      id_parlamentar_voz: req.params.id
    }
  })
    .then(parlamentares => {
      res.status(SUCCESS).json(parlamentares);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

module.exports = router;