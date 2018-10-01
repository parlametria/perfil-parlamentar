const express = require("express");
const router = express.Router();

const Candidato = require("../../models/Candidato");
const Votacao = require("../../models/Votacao");

// @route   GET api/candidatos/test
// @desc    Testa a rota de candidatos
// @access  Public
router.get("/test", (req, res) =>
  res.json({ msg: "Testando a rota de candidatos." })
);

// @route   GET api/candidatos
// @desc    Pega todos os candidatos de uma vez
// @access  Public
router.get("/", (req, res) => {
  Candidato.find()
    .then(candidatos => res.json(candidatos))
    .catch(err => res.status(400).json({ err }));
});

// @route   GET api/candidatos/:cpf/
// @desc    Pega as informações pessoais de um candidato
// @access  Public
router.get("/:cpf", (req, res) => {
  Candidato.find({ cpf: req.params.cpf })
    .then(candidatos => res.json(candidatos))
    .catch(err => res.status(400).json({ err }));
});

// @route   GET api/candidatos/:cpf/votacoes
// @desc    Pega as votações de um deputado dado seu cpf
// @access  Public
router.get("/:cpf/votacoes", (req, res) => {
  Votacao.find({ cpf: req.params.cpf })
    .then(votacoes => res.json(votacoes))
    .catch(err => res.status(400).json({ err }));
});

module.exports = router;
