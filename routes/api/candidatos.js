/** Express router
 * @module routes/candidatos
 * @requires express
 */
const express = require("express");

/**
 * Rotas para funções relacionadas aos candidatos.
 * @namespace module:routes/candidatos
 */
const router = express.Router();

const Candidato = require("../../models/Candidato");
const Votacao = require("../../models/Votacao");

/**
 * Testa a rota de candidatos.
 * @name get/api/candidatos/test
 * @function
 * @memberof module:routes/candidatos
 */
router.get("/test", (req, res) =>
  res.json({ msg: "Testando a rota de candidatos." })
);

/**
 * Pega todos os candidatos de uma vez.
 * @name get/api/candidatos
 * @function
 * @memberof module:routes/candidatos
 */
router.get("/", (req, res) => {
  Candidato.find()
    .then(candidatos => res.json(candidatos))
    .catch(err => res.status(400).json({ err }));
});

/**
 * Pega um candidato de acordo com o cpf.
 * @name get/api/candidatos/:cpf
 * @function
 * @memberof module:routes/candidatos
 * @param {string} cpf - CPF do candidato
 */
router.get("/:cpf", (req, res) => {
  Candidato.find({ cpf: req.params.cpf })
    .then(candidatos => res.json(candidatos))
    .catch(err => res.status(400).json({ err }));
});


/**
 * Pega as votações de um deputado dado seu cpf.
 * @name get/api/:cpf/votacoes
 * @function
 * @memberof module:routes/candidatos
 * @param {string} cpf - CPF do candidato
 */
router.get("/:cpf/votacoes", (req, res) => {
  Votacao.find({ cpf: req.params.cpf })
    .then(votacoes => res.json(votacoes))
    .catch(err => res.status(400).json({ err }));
});

module.exports = router;
