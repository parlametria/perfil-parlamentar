const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Resposta = require("../../models/Resposta");

const BAD_REQUEST = 400;

// @route   GET api/respostas/test
// @desc    Testa a rota de respostas
// @access  Public
router.get("/test", (req, res) =>
  res.json({ msg: "Testando a rota de respostas." })
);

// @route   GET api/respostas
// @desc    Pega todos os respostas de uma vez
// @access  Public
router.get("/", (req, res) => {
  console.log("pedido para todos");
  Resposta.find()
    .then(respostas => {console.log("recebi do bd"); res.json(respostas); console.log("acabei o encode");})
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas/estados/<id>
// @desc    Pega as respostas por estado
// @access  Public
router.get("/estados/:id", (req, res) => {
  console.log("pedido para um estado");
  var paraRetornar = Resposta.find({ uf: req.params.id })
    .then(respostas => {console.log("Obtive do BD"); res.json(respostas); console.log("acabei o encode");})
    .catch(err => res.status(BAD_REQUEST).json({ err }));
  paraRetornar
});

// @route   GET api/respostas/candidatos/<cpf>
// @desc    Pega as respostas de um candidato dado o seu cpf
// @access  Public
router.get("/candidatos/:cpf", (req, res) => {
  Resposta.find({ id: req.params.cpf })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

module.exports = router;
