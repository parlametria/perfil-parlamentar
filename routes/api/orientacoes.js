const express = require("express");
const router = express.Router();

const models = require("../../models/index");
const { formataOrientacoes } = require("../../utils/functions");

const Partido = models.partido;
const Orientacao = models.orientacao;
const Proposicao = models.proposicao;
const Temas = models.tema;
const Votacao = models.votacao;

const BAD_REQUEST = 400;
const SUCCESS = 200;

const attVotacao = ["voto", ["id_votacao", "idVotacao"]];

/**
 * Recupera informações das orientações dadas pelo governo em votações de plenário
 * @name get/api/orientacoes/governo
 * @function
 * @memberof module:routes/orientacoes 
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
        required: false,        
      }
    ],
    where: { id_partido: ID_GOVERNO }
  })
    .then(orientacoes => {
      orientacoesFormatadas = formataOrientacoes(orientacoes);
      
      return res.status(SUCCESS).json(orientacoesFormatadas[0]);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
 * Lista proposições consideradas para o cálculo da aderência entre 
 * a orientação do governo e dos partidos e o voto dos parlamentares
 * @name get/api/orientacoes/proposicoes
 * @function
 * @memberof module:routes/orientacoes 
 */
router.get("/proposicoes", (req, res) => {
  Proposicao.findAll({
    attributes: [["projeto_lei", "projetoLei"], ["id_proposicao", "idProposicao"]],
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
        require: true
      }
    ],
    order: [
      ["temas", "id_tema", "ASC"],
      ["proposicaoVotacoes", "id_votacao", "ASC"],
      ["id_proposicao", "ASC"]
    ],
    where: { status_importante: "Ativa" }
  })
    .then(proposicoes => {      
      return res.status(SUCCESS).json(proposicoes);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

module.exports = router;
