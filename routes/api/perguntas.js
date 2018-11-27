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
 * Pega as perguntas.
 * @name get/api/perguntas
 * @function
 * @memberof module:routes/perguntas
 */
router.get("/", (req, res) => {
  Pergunta.find({
    include: [
      {
        model: Temas
      }
    ]
  })
    .then(perguntas => res.json(perguntas))
    .catch(err => res.status(400).json({ err }));
});

module.exports = router;
