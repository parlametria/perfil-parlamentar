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
* @swagger
* tags:
*   name: Votações
*   description: Lista de endpoints relacionados às votações capturadas pelo Perfil Parlamentar.
*/


/**
* @swagger
* path:
*  /api/votacoes/:
*    get:
*      summary: Recupera quantidade de votações selecionadas para o cálculo da aderência.
*               A casa é passada como parâmetro e pode ser 'camara' ou 'senado'.
*      tags: [Votações]
*      parameters:
*        - in: query
*          name: casa
*          schema:
*            type: string
*          required: true
*          description: Casa para filtro (pode ser camara ou senado).
*      responses:
*        "200":
*          description: Retorna objeto com o número de votações usadas no cálculo da aderência.
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
    .then(numeroVotacoes => res.status(SUCCESS).json(
      { numeroVotacoes: numeroVotacoes }
    ))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
* @swagger
* path:
*  /api/votacoes/temas:
*    get:
*      summary: Recupera quantidade de votações selecionadas por tema para o cálculo da aderência.
*               A casa é passada como parâmetro e pode ser 'camara' ou 'senado'.
*      tags: [Votações]
*      parameters:
*        - in: query
*          name: casa
*          schema:
*            type: string
*          required: true
*          description: Casa para filtro (pode ser camara ou senado).
*      responses:
*        "200":
*          description: Retorna objeto com o número de votações usadas no cálculo da aderência por tema.
*/
router.get("/temas", casaValidator.validate, (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const casa = req.param("casa") || "camara"

  Temas.findAll({
    attributes: ["id_tema", "tema", "slug"],
    include: [
      {
        model: Proposicao,
        as: "proposicoes",
        attributes: [],
        include: [
          {
            model: Votacao,
            as: "proposicaoVotacoes",
            attributes: ["id_votacao"],
            required: true
          }
        ],
        through: { attributes: [] },
        required: false,
        where: {
          status_importante: "Ativa",
          casa: casa
        }
      }
    ],
    raw: true
  })
    .then(numeroVotacoes => {

      const groupBy = (array, key) => {
        return array.reduce((rv, x) => {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };

      let temaGrupo = groupBy(numeroVotacoes, "id_tema")

      const colunaIdVotacao = "proposicoes.proposicaoVotacoes.id_votacao";

      const countGeral = [...new Set(
        numeroVotacoes
          .map(votacao => votacao[colunaIdVotacao])
          .filter(votacao => votacao !== null)
      )].length;

      Object.keys(temaGrupo).forEach((key) => {
        if (temaGrupo[key] !== undefined && temaGrupo[key].length === 1 && temaGrupo[key][0][colunaIdVotacao] === null) {
          if (temaGrupo[key][0].tema === "Geral") {
            temaGrupo[key] = countGeral;
          } else {
            temaGrupo[key] = 0;
          }
        } else {          
          temaGrupo[key] = [...new Set(temaGrupo[key].map(votacao => votacao[colunaIdVotacao]))].length;
        }
      });

      return res.status(SUCCESS).json(temaGrupo)
    })
    .catch(err => res.status(BAD_REQUEST).json(err));
});

module.exports = router;
