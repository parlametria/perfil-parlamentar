const express = require("express");
const router = express.Router();
const { validationResult } = require('express-validator');

const models = require("../../models/index");
const { formataOrientacoes } = require("../../utils/functions");
const casaValidator = require("../../utils/middlewares/casa.validator");

const Partido = models.partido;
const Orientacao = models.orientacao;
const Proposicao = models.proposicao;
const Temas = models.tema;
const Votacao = models.votacao;

const BAD_REQUEST = 400;
const SUCCESS = 200;

const attVotacao = ["voto", ["id_votacao", "idVotacao"]];

/**
* @swagger
* tags:
*   name: Orientações
*   description: Módulo de recuperação das orientações dadas por partidos e pelo Governo em votações.
*/


/**
* @swagger
* path:
*  /api/orientacoes/governo:
*    get:
*      summary: Recupera informações das orientações dadas pelo governo em votações de plenário.
*      tags: [Orientações]
*      responses:
*        "200":
*          description: Lista com as orientações dadas pelo Governo em votações nominais realizadas em plenário.
*/
router.get("/governo", (req, res) => {
  const ID_GOVERNO = 0;

  Partido.findAll({
    attributes: [["id_partido", "idPartido"], "sigla"],
    include: [
      {
        model: Orientacao,
        as: "orientacoes",
        attributes: attVotacao,
        required: false
      }
    ],
    where: {
      id_partido: ID_GOVERNO
    }
  })
    .then(orientacoes => {
      orientacoesFormatadas = formataOrientacoes(orientacoes);

      return res.status(SUCCESS).json(orientacoesFormatadas[0]);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
* @swagger
* path:
*  /api/orientacoes/proposicoes:
*    get:
*      summary: Lista proposições consideradas para o cálculo da aderência entre 
*               a orientação do governo e dos partidos e o voto dos parlamentares.
*      tags: [Orientações]
*      parameters:
*        - in: query
*          name: casa
*          schema:
*            type: string
*          required: true
*          description: Casa de tramitação da proposição. Pode ser "camara" (default) ou "senado".
*      responses:
*        "200":
*          description: Informações das proposições consideradas para o cálculo da aderência (incluindo temas e votações).
*/
router.get("/proposicoes", casaValidator.validate, (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const casa = req.param("casa") || "camara"

  Proposicao.findAll({
    attributes: [["projeto_lei", "projetoLei"], ["id_proposicao", "idProposicao"], "casa"],
    include: [
      {
        model: Temas,
        as: "temas",
        attributes: [["id_tema", "idTema"], "tema", "slug"],
        through: { attributes: [] },
      },
      {
        model: Votacao,
        attributes: [["id_votacao", "idVotacao"], ["objeto_votacao", "objetoVotacao"], "horario"],
        as: "proposicaoVotacoes",
        required: true
      }
    ],
    order: [
      ["temas", "id_tema", "ASC"],
      ["proposicaoVotacoes", "id_votacao", "ASC"],
      ["id_proposicao", "ASC"]
    ],
    where: {
      status_importante: "Ativa",
      casa: casa
    }
  })
    .then(proposicoes => {
      return res.status(SUCCESS).json(proposicoes);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

module.exports = router;
