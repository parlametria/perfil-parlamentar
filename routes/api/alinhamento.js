/** Express router
 * 
 * @module routes/candidatos
 * @requires express
 */
const express = require("express");

const router = express.Router();

const models = require("../../models/index");
const { calcularAlinhamentos } = require("../../utils/alinhamento");

const Candidato = models.candidato;
const Votacao = models.votacao;

/**
 * @name get/api/alinhamento
 * @function
 * @memberof module:routes/alinhamento
 */
router.post("/", (req, res) => {
  Candidato.findAll({
    include: [
      {
        model: Votacao,
        as: "cpf_vot",
        required: false
      }
    ],
    where: {
      eleito: true
    }
  }).then(parlamentares => {
    const alinhamentos = calcularAlinhamentos(parlamentares, req.body.respostas);
    return res.json(alinhamentos);
  }).catch(err => res.status(400).json({ err }));
});

module.exports = router;