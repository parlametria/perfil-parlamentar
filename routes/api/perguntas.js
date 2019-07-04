/** Express router
 * @module routes/perguntas
 * @requires express
 */
const express = require("express");

/**
 * Rotas para funções relacionadas às perguntas.
 * @namespace module:routes/perguntas
 */
const router = express.Router();

const models = require("../../models/index");

const Pergunta = models.pergunta;
const Temas = models.tema;
const Proposicao = models.proposicao;
const Votacao = models.votacao;
const ProposicaoTemas = models.proposicaoTemas;

/**
 * Testa a rota de perguntas.
 * @name get/api/perguntas/test
 * @function
 * @memberof module:routes/perguntas
 */
router.get("/test", (req, res) =>
  res.json({ msg: "Testando a rota de perguntas." })
);

/**
 * Pega as perguntas do voz Ativa.
 * @name get/api/perguntas/vozativa
 * @function
 * @memberof module:routes/perguntas
 */
router.get("/vozativa", (req, res) => {
  Pergunta.findAll({
    attributes: ["id", "texto"],
    include: [
      {
        model: Temas,
        as: "tema_perg"
      }
    ]
  })
    .then(perguntas => res.json(perguntas))
    .catch(err => res.status(400).json({ err }));
});

/**
 * Pega as proposições.
 * @name get/api/perguntas/proposicoes
 * @function
 * @memberof module:routes/perguntas
 */
router.get("/proposicoes", (req, res) => {
  Proposicao.findAll({
    attributes: [["projeto_lei", "projetoLei"], ["id_proposicao", "idProposicao"], "titulo", "descricao"],
    where: { status_proposicao: "Ativa" },
    include: [
      {
        model: Temas,
        as: "temas",
        attributes: [["id_tema", "idTema"], "tema", "slug"]
      },
      {
        model: Votacao,
        attributes: [["id_votacao", "idVotacao"]],
        as: "proposicaoVotacoes",
        require: true
      }
    ],
    order: [
      ['temas', 'id_tema', 'ASC'],
      ['id_proposicao', 'ASC']
    ]
  })
    .then(proposicoes => res.json(proposicoes))
    .catch(err => res.status(400).json({ err }));
});

/**
 * Pega uma proposição específica a partir do id da votação.
 * @name get/api/perguntas/proposicoes/:id
 * @function
 * @memberof module:routes/perguntas/:id
 */
router.get("/proposicoes/:id", (req, res) => {
  Proposicao.findOne({
    attributes: [["projeto_lei", "projetoLei"], ["id_proposicao", "idProposicao"], "titulo", "descricao"],
    where: { 
      status_proposicao: "Ativa",
      id_proposicao: req.params.id 
    },
    order: [
      ['id_proposicao', 'ASC']
    ],
    include: [
      {
        model: Temas,
        attributes: [["id_tema", "idTema"], "tema", "slug"]
      },
      {
        model: Votacao,
        attributes: [["id_votacao", "idVotacao"]],
        as: "proposicaoVotacoes",
        require: true
      }
    ]
  })
    .then(proposicoes => res.json(proposicoes))
    .catch(err => res.status(400).json({ err }));
});

module.exports = router;
