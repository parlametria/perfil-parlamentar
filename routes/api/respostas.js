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
// @desc    Pega todos as respostas de uma vez
// @access  Public
router.get("/", (req, res) => {
  Resposta.find()
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas
// @desc    Pega todos as respostas de uma vez de quem respondeu
// @access  Public
router.get("/candidatos/responderam", (req, res) => {
  Resposta.find({ "respostas.1" : { $in: [-2, -1, 1] } })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas
// @desc    Pega todos os respostas de uma vez de quem NÃO respondeu
// @access  Public
router.get("/candidatos/naoresponderam", (req, res) => {
  Resposta.find({ "respostas.1" : { $nin: [-2, -1, 1] } })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas/estados/<id>
// @desc    Pega as respostas por estado
// @access  Public
router.get("/estados/:id", (req, res) => {
  Resposta.find({ uf: req.params.id)
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas/estados/<id>
// @desc    Pega as respostas por estado de quem respondeu
// @access  Public
router.get("/estados/:id/responderam", (req, res) => {
  Resposta.find({ uf: req.params.id, "respostas.1" : { $in: [-2, -1, 1] }  })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas/estados/<id>
// @desc    Pega as respostas por estado de quem NÃO respondeu
// @access  Public
router.get("/estados/:id/naoresponderam", (req, res) => {
  Resposta.find({ uf: req.params.id, "respostas.1" : { $nin: [-2, -1, 1] }  })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
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
