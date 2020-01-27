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
    .then(numeroVotacoes => res.status(SUCCESS).json(
      { numeroVotacoes: numeroVotacoes }
    ))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Recupera quantidade de votações selecionadas por tema para o cálculo da aderência
 * 
 * @name get/api/votacoes/temas
 * @apiparam casa Casa de origem da proposição. Pode ser "camara" (default) ou "senado".
 * @function
 * @memberof module:routes/votacoes
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
