const express = require("express");
const router = express.Router();

const models = require("../../models/index");

const InvestimentoPartidarioParlamentar = models.investimentoPartidarioParlamentar;
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
  InvestimentoPartidarioParlamentar.findAll({
    attributes: [["id_parlamentar_voz", "idParlamentarVoz"], ["total_receita_partido", "totalReceitaPartido"], ["total_receita_candidato", "totalReceitaCandidato"], ["indice_investimento_partido", "indiceInvestimentoPartido"]],
    include: [
      {
        attributes: [["nome_eleitoral", "nomeEleitoral"], "uf", "casa"],
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
 * @name get/api/investimento/parlamentar/:id
 * @function
 * @memberof module:routes/temas
 */
router.get("/parlamentar/:id", (req, res) => {
  InvestimentoPartidarioParlamentar.findOne({
    attributes: [["id_parlamentar_voz", "idParlamentarVoz"], ["total_receita_partido", "totalReceitaPartido"], ["total_receita_candidato", "totalReceitaCandidato"], ["indice_investimento_partido", "indiceInvestimentoPartido"]],
    include: [
      {
        attributes: [["nome_eleitoral", "nomeEleitoral"], "uf", "casa"],
        model: Parlamentar,
        as: "parlamentarInvestimento",
        required: true
      },      
      {        
        attributes: [["id_partido", "idPartido"], "sigla"],
        model: Partido,
        as: "partidoAtual",
        required: true
      },
      {
        attributes: [["id_partido", "idPartido"], "sigla"],
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


/**
 * Recupera total investido pelo partido nas eleições de 2018 em uma UF para um determinada esfera (camara ou senado)
 * id: id do partido no voz ativa (ex: 36769 (DEM))
 * uf: uf de investimento (ex: PE, PB, etc)
 * esfera: camara (para total investido em candidatos a deputados) ou senado (para total investido em  candidatos a deputados e senadores)
 * @name get/api/investimento/partido/:id/:uf/:esfera
 * @function
 * @memberof module:routes/temas
 */
router.get("/partido/:id/:uf/:esfera", (req, res) => {  
  InvestimentoPartidario.findOne({
    where: {
      id_partido: req.params.id,
      uf: req.params.uf,
      esfera: req.params.esfera
    }
  })
    .then(investimento => {
      if (investimento) {
        res.status(SUCCESS).json(investimento);
      } else {
        res.status(SUCCESS).json({
          "id_partido": req.params.id,
          "uf": req.params.uf,
          "esfera": req.params.esfera,
          "valor": 0
        });
      }
    })
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

module.exports = router;
