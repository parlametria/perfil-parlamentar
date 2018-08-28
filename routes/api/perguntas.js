const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Pergunta = require("../../models/Pergunta");

// @route   GET api/perguntas/test
// @desc    Testa a rota de perguntas
// @access  Public
router.get("/test", (req, res) =>
  res.json({ msg: "Testando a rota de perguntas." })
);

// @route   GET api/perguntas
// @desc    Pega as perguntas
// @access  Public
router.get("/", (req, res) => {
  Pergunta.find()
    .then(perguntas => res.json(perguntas))
    .catch(err =>
      res.status(400).json({ err })
    );
});

module.exports = router;