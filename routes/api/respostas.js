const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Resposta = require("../../models/Resposta");

const BAD_REQUEST = 400;
const SUCCESS = 200;

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

// @route   GET api/respostas/candidatos/<cpf>
// @desc    Pega as respostas de um candidato dado o seu cpf
// @access  Public
router.get("/candidatos/:cpf", (req, res) => {
  Resposta.find({ cpf: req.params.cpf })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas
// @desc    Pega todos as respostas de uma vez de quem respondeu
// @access  Public
router.get("/candidatos/responderam", (req, res) => {
  Resposta.find({ respondeu: true })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas
// @desc    Pega todos os respostas de uma vez de quem NÃO respondeu
// @access  Public
router.get("/candidatos/naoresponderam", (req, res) => {
  Resposta.find({ respondeu: false })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas/estados/<id>
// @desc    Pega as respostas por estado
// @access  Public
router.get("/estados/:id", (req, res) => {
  Resposta.find({ uf: req.params.id })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas/estados/<id>
// @desc    Pega as respostas por estado de quem respondeu
// @access  Public
router.get("/estados/:id/responderam", (req, res) => {
  Resposta.find({ uf: req.params.id, respondeu: true })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas/estados/<id>
// @desc    Pega as respostas por estado de quem NÃO respondeu
// @access  Public
router.get("/estados/:id/naoresponderam", (req, res) => {
  const pageNo = Number(req.query.pageNo);
  const size = Number(req.query.size);
  const uf = req.params.id;
  let query = {};

  if (pageNo < 0 || pageNo === 0) {
    response = {
      error: true,
      message: "invalid page number, should start with 1"
    };
    return res.json(response);
  }

  query.skip = size * (pageNo - 1);
  query.limit = size;

  Resposta.countDocuments({ uf, respondeu: false }, (err, totalCount) => {
    let response;
    if (err) response = { error: true, message: "Error fetching data" };

    Resposta.find({ uf, respondeu: false }, {}, query, (err, data) => {
      response = err
        ? { status: BAD_REQUEST, message: "Error fetching data" }
        : {
            data,
            total: totalCount,
            itensPorPagina: size,
            pagina: pageNo,
            paginas: Math.ceil(totalCount / size),
            status: SUCCESS
          };

      res.status(response.status).json(response);
    });
  });
});

module.exports = router;
