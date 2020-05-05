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
* @swagger
* tags:
*   name: Investimento Partidário
*   description: Recupera informações do investimento realizado por partidos nos parlamentares durante a eleição.
*/


/**
* @swagger
* path:
*  /api/investimento/:
*    get:
*      summary: Recupera o investimento realizado pelo partido nos Parlamentares durante as eleições de 2018.
*      tags: [Investimento Partidário]
*      responses:
*        "200":
*          description: Informações do investimento partidário (incluindo partido na eleição e partido atual).
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
* @swagger
* path:
*  /api/investimento/parlamentar/{id}:
*    get:
*      summary: Recupera o investimento realizado pelo partido em um parlamentar específico.
*      tags: [Investimento Partidário]
*      parameters:
*        - in: path
*          name: id
*          schema:
*            type: integer
*          required: true
*          description: Id do parlamentar
*      responses:
*        "200":
*          description: Informações do investimento partidário (incluindo partido na eleição e partido atual).
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
* @swagger
* path:
*  /api/investimento/partido/{id}/{uf}/{esfera}:
*    get:
*      summary: Recupera total investido pelo partido nas eleições de 2018 em uma UF e para uma determinada esfera (camara ou senado).
*      tags: [Investimento Partidário]
*      parameters:
*        - in: path
*          name: id
*          schema:
*            type: integer
*          required: true
*          description: Id do partido no voz ativa (exemplo 36769 (DEM))
*        - in: path
*          name: uf
*          schema:
*            type: string
*          required: true
*          description: UF de investimento (exemplo PE, PB, etc)
*        - in: path
*          name: esfera
*          schema:
*            type: string
*          required: true
*          description: camara (para total investido em candidatos a deputados) ou senado (para total investido em  candidatos a deputados e senadores).
*      responses:
*        "200":
*          description: Informações do gasto pelo partido nas eleições de 2018 por UF e esfera.
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
