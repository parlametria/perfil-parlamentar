const express = require("express");
const router = express.Router();

const models = require("../../models/index");

const InvestimentoPartidario = models.investimentoPartidario;
const Parlamentar = models.parlamentar;
const Partido = models.partido;

const BAD_REQUEST = 400;
const SUCCESS = 200;

/**
 * Captura dados de investimento partidário
 * @name get/api/investimento
 * @function
 * @memberof module:routes/temas
 */
router.get("/", (req, res) => {
  InvestimentoPartidario.findAll({
    attributes: [["id_parlamentar_voz", "idParlamentarVoz"], ["total_receita_partido", "totalReceitaPartido"], ["total_receita_candidato", "totalReceitaCandidato"], ["indice_investimento_partido", "indiceInvestimentoPartido"]],
    include: [
      {
        attributes: [["nome_eleitoral", "nomeEleitoral"], "uf"],
        model: Parlamentar,
        as: "parlamentarInvestimento",
        required: true
      },      
      {        
        attributes: ["sigla"],
        model: Partido,
        as: "partidoAtual",
        required: true
      },
      {
        attributes: ["sigla"],
        model: Partido,
        as: "partidoEleicao",
        required: true
      }
    ]
  })
    .then(parlamentares => res.status(SUCCESS).json(parlamentares))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Captura dados de investimento partidário a partir do id do parlamentar no Voz Ativa
 * @name get/api/investimento
 * @function
 * @memberof module:routes/temas
 */
router.get("/:id", (req, res) => {
  InvestimentoPartidario.findOne({
    attributes: [["id_parlamentar_voz", "idParlamentarVoz"], ["total_receita_partido", "totalReceitaPartido"], ["total_receita_candidato", "totalReceitaCandidato"], ["indice_investimento_partido", "indiceInvestimentoPartido"]],
    include: [
      {
        attributes: [["nome_eleitoral", "nomeEleitoral"], "uf"],
        model: Parlamentar,
        as: "parlamentarInvestimento",
        required: true
      },      
      {        
        attributes: ["sigla"],
        model: Partido,
        as: "partidoAtual",
        required: true
      },
      {
        attributes: ["sigla"],
        model: Partido,
        as: "partidoEleicao",
        required: true
      }
    ],
    where: {
      id_parlamentar_voz: req.params.id
    }
  })
    .then(parlamentares => res.status(SUCCESS).json(parlamentares))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

module.exports = router;
