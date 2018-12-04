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
const models = require("../../models/index");

const Candidato = models.candidato;
const Votacao = models.votacao;

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
 * Pega as votações de um deputado dado seu cpf.
 * @name get/api/candidatos/votacoes
 * @function
 * @memberof module:routes/candidatos
 */
router.get("/votacoes", (req, res) => {
  Votacao.findAll()
    .then(votacoes => res.json(votacoes))
    .catch(err => res.status(400).json({ err }));
});

/**
 * Pega todos os candidatos de uma vez.
 * @name get/api/candidatos
 * @function
 * @memberof module:routes/candidatos
 */
router.get("/", (req, res) => {
  Candidato.findAll()
    .then(candidatos => res.json(candidatos))
    .catch(err => res.status(400).json({ err }));
});

router.get("/votacoes", (req, res) => {
  Votacao.find()
    .then(votacoes => res.json(votacoes))
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
  Candidato.findAll({
    where: {
      cpf: req.params.cpf
    }
  })
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
  Votacao.findAll({
    where: {
      cpf: req.params.cpf
    }
  })
    .then(votacoes => res.json(votacoes))
    .catch(err => res.status(400).json({ err }));
});

module.exports = router;
