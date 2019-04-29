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
const Parlamentar = models.parlamentar;
const Votacao = models.votacao;
const Proposicao = models.proposicao;
const Tema = models.tema;

const att = [
  "id_parlamentar_voz",
  "id_parlamentar",
  "casa",
  "nome_eleitoral",
  "uf",
  "partido",
  "em_exercicio"  
];

/**
 * @name get/api/alinhamento
 * @function
 * @memberof module:routes/alinhamento
 */
router.post("/", (req, res) => {
  Parlamentar.findAll({
    attributes: att,
    include: [
      {
        attributes: ["id_parlamentar_voz", "id_votacao", "voto"],
        model: Votacao,
        as: "parlamentar_vot",
        required: false
      }
    ],
    where: {
      em_exercicio: true
    }
  }).then(parlamentares => {    
    Proposicao.findAll({
      attributes: ["id_votacao", "tema_id"],
      include: [{
        attributes: ["tema"],
        model: Tema,
        as: "tema_prop",
        required: false
      }],
      where: {
        status_proposicao: "Ativa"
      }
    }).then(proposicoes => {      
      const alinhamentos = calcularAlinhamentos(parlamentares, req.body.respostas, proposicoes);
      
      return res.status(200).json(alinhamentos);
      
    }).catch(err => res.status(400).json({ err: err.message }));

  }).catch(err => res.status(400).json({ err: err.message }));
});

module.exports = router;