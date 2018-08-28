const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Resultado = require("../../models/Resultado");

// @route   GET api/resultados/test
// @desc    Testa a rota de resultados
// @access  Public
router.get("/test", (req, res) =>
  res.json({ msg: "Testando a rota de resultados." })
);

// @route   GET api/resultados
// @desc    Pega todos os resultados de uma vez
// @access  Public
router.get("/", (req, res) => {
  Resultado.find()
    .then(resultados => res.json(resultados))
    .catch(err =>
      res.status(400).json({ err })
    );
});

module.exports = router;