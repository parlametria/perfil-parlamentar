const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Resposta = require("../../models/Resposta");

const BAD_REQUEST = 400;
const SUCCESS = 200;

// @route   GET api/respostas
// @desc    Pega todos as respostas de uma vez
// @access  Public
router.get("/", (req, res) => {
  const pageNo = Number(req.query.pageNo);
  const size = Number(req.query.size);
  const uf = req.params.uf;
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

  Resposta.countDocuments({}, (err, totalCount) => {
    let response;
    if (err) response = { error: true, message: "Error fetching data" };

    Resposta.find({}, {}, query, (err, data) => {
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

// @route   GET api/respostas/candidatos/<cpf>
// @desc    Pega as respostas de um candidato dado o seu cpf
// @access  Public
router.get("/candidatos/:cpf", (req, res) => {
  Resposta.find({ cpf: req.params.cpf })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas/candidatos/responderam
// @desc    Pega todos as respostas de todos que responderam
// @access  Public
router.get("/candidatos/responderam", (req, res) => {
  Resposta.find({ respondeu: true })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas
// @desc    Pega todas as respostas de quem NÃO respondeu
// @access  Public
router.get("/candidatos/naoresponderam", (req, res) => {
  Resposta.find({ respondeu: false })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas/estados/<uf>/<partido>/<nome>
// @desc    Pega as respostas por estado
// @access  Public
router.get("/estados/:uf", (req, res) => {
  query = {}
  const partido = String(req.query.partido);
  const nome = String(req.query.nome);

  if( nome !== "undefined" && partido !== "undefined"){
    query = { uf: req.params.uf, sg_partido: partido, $text: { $search: nome } }
  } else if (nome !== "undefined" ){
    query = { uf: req.params.uf, $text: { $search: nome } }
  } else if(partido !== "undefined"){
    query = { uf: req.params.uf, sg_partido: partido}
  }else{
    query =  {uf: req.params.uf}
  }
  console.log(query)
  Resposta.find(query)
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas/estados/<uf>/responderam
// @desc    Pega as respostas por estado de quem respondeu
// @access  Public
router.get("/estados/:uf/responderam", (req, res) => {
  Resposta.find({ uf: req.params.uf, respondeu: true })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas/estados/<uf>/responderam/numeroRespostas/totalcandidatos
// @desc    Pega o número de candidatos que responderam por estado
// @access  Public
router.get("/estados/:uf/responderam/totalcandidatos", (req, res) => {
  Resposta.countDocuments(
    { uf: req.params.uf, respondeu: true },
    (err, totalCount) => {
      if (!err) res.json(totalCount);
      else res.status(BAD_REQUEST).json(err);
    }
  );
});

// @route   GET api/respostas/estados/<id>/totalcandidatos
// @desc    Pega o total de candidatos por estado
// @access  Public
router.get("/estados/:uf/totalcandidatos", (req, res) => {
  Resposta.countDocuments({ uf: req.params.uf }, (err, totalCount) => {
    if (!err) res.json(totalCount);
    else res.status(BAD_REQUEST).json(err);
  });
});

// @route   GET api/respostas/estados/<uf>/partidos/<sigla>/totalcandidatos
// @desc    Pega o total de respostas por estado e partido
// @access  Public
router.get("/estados/:uf/partidos/:sigla/totalcandidatos", (req, res) => {
  Resposta.countDocuments(
    { uf: req.params.uf, sg_partido: req.params.sigla },
    (err, totalCount) => {
      if (!err) res.json(totalCount);
      else res.status(BAD_REQUEST).json(err);
    }
  );
});

// @route   GET api/respostas/estados/<uf>/partidos/<sigla>/responderam/totalcandidatos
// @desc    Pega o total de respostas por partido e estado de quem respondeu
// @access  Public
router.get(
  "/estados/:uf/partidos/:sigla/responderam/totalcandidatos",
  (req, res) => {
    Resposta.countDocuments(
      { uf: req.params.uf, sg_partido: req.params.sigla, respondeu: true },
      (err, totalCount) => {
        if (!err) res.json(totalCount);
        else res.status(BAD_REQUEST).json(err);
      }
    );
  }
);

// @route   GET api/respostas/estados/<uf>/partidos/<sigla>/responderam
// @desc    Pega as respostas por partido e estado de quem respondeu
// @access  Public
router.get("/estados/:uf/partidos/:sigla/responderam", (req, res) => {
  Resposta.find({
    uf: req.params.uf,
    sg_partido: req.params.sigla,
    respondeu: true
  })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas/estados/<uf>/partidos/<sigla>/naoresponderam
// @desc    Pega as respostas por partido e estado de quem NÃO respondeu
// @access  Public
router.get("/estados/:uf/partidos/:sigla/naoresponderam", (req, res) => {
  Resposta.find({
    uf: req.params.uf,
    sg_partido: req.params.sigla,
    respondeu: false
  })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

// @route   GET api/respostas/estados/<uf>/naoresponderam
// @desc    Pega as respostas por estado de quem NÃO respondeu
// @access  Public
router.get("/estados/:uf/naoresponderam", (req, res) => {
  const pageNo = Number(req.query.pageNo);
  const size = Number(req.query.size);
  const uf = req.params.uf;
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
