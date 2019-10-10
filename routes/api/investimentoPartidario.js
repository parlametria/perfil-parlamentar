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
    attributes: [["id_parlamentar_voz", "idParlamentarVoz"], ["total_recebido", "totalRecebido"], ["indice_investimento", "indiceInvestimento"]],
    include: [
      {
        attributes: [["nome_eleitoral", "nomeEleitoral"], "uf"],
        model: Parlamentar,
        as: "parlamentarInvestimento",
        include: [
          {
            attributes: ["sigla"],
            model: Partido,
            as: "parlamentarPartido",
            required: true
          }
        ],
        required: true
      }
    ]
  })
    .then(parlamentares => res.status(SUCCESS).json(parlamentares))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

module.exports = router;
