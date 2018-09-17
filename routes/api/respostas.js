const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Resposta = require("../../models/Resposta");

const BAD_REQUEST = 400;

/**
 * Pega todas as respostas de uma vez.
 * @name get/api/respostas
 * @function
 * @memberof module:routes/respostas
 */
router.get("/", (req, res) => {
  Resposta.find()
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Pega as respostas de um candidato dado o seu cpf.
 * @name get/api/respostas/candidatos/<cpf>
 * @function
 * @memberof module:routes/respostas
 * @param {string} cpf - CPF do candidato
 */
router.get("/candidatos/:cpf", (req, res) => {
  Resposta.find({ cpf: req.params.cpf })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Pega todos as respostas de todos que responderam.
 * @name get/api/respostas/candidatos/responderam
 * @function
 * @memberof module:routes/respostas
 * @param {boolean} respondeu - Flag respondeu true
 */
router.get("/candidatos/responderam", (req, res) => {
  Resposta.find({ respondeu: true })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Pega todos as respostas de todos que não responderam.
 * @name get/api/respostas/candidatos/responderam
 * @function
 * @memberof module:routes/respostas
 * @param {boolean} respondeu - Flag respondeu false
 */
router.get("/candidatos/naoresponderam", (req, res) => {
  Resposta.find({ respondeu: false })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Pega as respostas por estado.
 * @name get/api/respostas/estados/<uf>
 * @function
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 */
router.get("/estados/:uf", (req, res) => {
  Resposta.find({ uf: req.params.uf })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Pega as respostas por estado de quem respondeu.
 * @name get/api/respostas/estados/<uf>/responderam
 * @function
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 * @param {boolean} respondeu - Flag respondeu true
 */
router.get("/estados/:uf/responderam", (req, res) => {
  Resposta.find({ uf: req.params.uf, respondeu: true })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Pega o número de candidatos que responderam por estado.
 * @name get/api/respostas/estados/<uf>/responderam/numeroRespostas/totalcandidatos
 * @function
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 * @param {boolean} respondeu - Flag respondeu true
 */
router.get("/estados/:uf/responderam/totalcandidatos", (req, res) => {
  Resposta.countDocuments(
    { uf: req.params.uf, respondeu: true },
    (err, totalCount) => {
      if (!err) res.json(totalCount);
      else res.status(400).json(err);
    }
  );
});

/**
 * Pega o número de candidatos que responderam por estado.
 * @name get/api/respostas/estados/<uf>/totalcandidatos
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 */
router.get("/estados/:uf/totalcandidatos", (req, res) => {
  Resposta.countDocuments({ uf: req.params.uf }, (err, totalCount) => {
    if (!err) res.json(totalCount);
    else res.status(400).json(err);
  });
});

/**
 * Pega o total de respostas por estado e partido.
 * @name get/api/respostas/estados/<uf>/partidos/<sigla>/totalcandidatos
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 * @param {string} sigla - Sigla do partido
 */
router.get("/estados/:uf/partidos/:sigla/totalcandidatos", (req, res) => {
  Resposta.countDocuments(
    { uf: req.params.uf, sg_partido: req.params.sigla },
    (err, totalCount) => {
      if (!err) res.json(totalCount);
      else res.status(400).json(err);
    }
  );
});

/**
 * Pega o total de respostas por partido e estado de quem respondeu.
 * @name get/api/respostas/estados/<uf>/partidos/<sigla>/responderam/totalcandidatos
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 * @param {string} sigla - Sigla do partido
 * @param {boolean} respondeu - Flag respondeu true
 */
router.get(
  "/estados/:uf/partidos/:sigla/responderam/totalcandidatos",
  (req, res) => {
    Resposta.countDocuments(
      { uf: req.params.uf, sg_partido: req.params.sigla, respondeu: true },
      (err, totalCount) => {
        if (!err) res.json(totalCount);
        else res.status(400).json(err);
      }
    );
  }
);

/**
 * Pega as respostas por partido e estado de quem respondeu.
 * @name get/api/respostas/estados/<uf>/partidos/<sigla>/responderam
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 * @param {string} sigla - Sigla do partido
 * @param {boolean} respondeu - Flag respondeu true
 */
router.get("/estados/:uf/partidos/:sigla/responderam", (req, res) => {
  Resposta.find({
    uf: req.params.uf,
    sg_partido: req.params.sigla,
    respondeu: true
  })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Pega as respostas por partido e estado de quem NÃO respondeu.
 * @name get/api/respostas/estados/<uf>/partidos/<sigla>/naoresponderam
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 * @param {string} sigla - Sigla do partido
 * @param {boolean} respondeu - Flag respondeu false
 */
router.get("/estados/:uf/partidos/:sigla/naoresponderam", (req, res) => {
  Resposta.find({
    uf: req.params.uf,
    sg_partido: req.params.sigla,
    respondeu: false
  })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 *  Pega as respostas por estado de quem NÃO respondeu.
 * @name get/api/respostas/estados/<uf>
 * @memberof module:routes/respostas
 * @param {string} UF - Estado
 * @param {boolean} respondeu - Flag respondeu false
 */
router.get("/estados/:uf/naoresponderam", (req, res) => {
  Resposta.find({ uf: req.params.uf, respondeu: false })
    .then(respostas => res.json(respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

module.exports = router;
