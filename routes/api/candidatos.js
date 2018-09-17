const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Candidato = require("../../models/Candidato");

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
    .catch(err =>
      res.status(400).json({ err })
    );
});

router.get("/:cpf", (req, res) => {
  Candidato.find({ cpf: req.params.cpf })
    .then(candidatos => res.json(candidatos))
    .catch(err =>
      res.status(400).json({ err })
    );
});

module.exports = router;