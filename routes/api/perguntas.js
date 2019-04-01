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
    attributes: ["projeto_lei", "id_votacao", "titulo", "descricao", "tema_id"],
    where: { status_proposicao: "Ativa" },
    order: [
      ['tema_id', 'ASC'],
      ['id_votacao', 'ASC']
    ],
    include: [
      {
        model: Temas,
        as: "tema_prop"
      }
    ]
  })
    .then(proposicoes => res.json(proposicoes))
    .catch(err => res.status(400).json({ err }));
});

module.exports = router;
