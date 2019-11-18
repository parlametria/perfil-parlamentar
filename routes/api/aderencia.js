const express = require("express");

const router = express.Router();

const models = require("../../models/index");

const Parlamentar = models.parlamentar;
const Aderencia = models.aderencia;
const Partido = models.partido;
const Tema = models.tema;
const ComposicaoComissoes = models.composicaoComissoes;
const Comissoes = models.comissoes;
const Liderancas = models.liderancas;

const BAD_REQUEST = 400;
const SUCCESS = 200;

const attParlamentar = [
  ["id_parlamentar_voz", "idParlamentarVoz"], 
  ["id_parlamentar", "idParlamentar"], 
  ["nome_eleitoral", "nomeEleitoral"], 
  "uf",
  ["em_exercicio", "emExercicio"],
  "casa"
];

const attAderencia = ["faltou", ["partido_liberou", "partidoLiberou"], ["nao_seguiu", "naoSeguiu"], "seguiu", "aderencia"];
const attPartido = [["id_partido", "idPartido"], "sigla"]
const attTema = [["id_tema", "idTema"], "tema", "slug"]
const attComposicaoComissoes = [["id_comissao_voz", "idComissaoVoz"], "cargo"];
const attComissoes = ["sigla"];
const attLideranca = ["cargo"];

/**
 * Recupera informações de aderência dos parlamentares
 * @name get/api/aderencia
 * @function
 * @memberof module:routes/aderencia
 */
router.get("/", (req, res) => {
  Aderencia.findAll({
    attributes: attAderencia
  })
    .then(aderencia => res.status(SUCCESS).json(aderencia))
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
 * Recupera informações de aderência da lista de parlamentares (atualmente em exercício) (com informações do parlamentar inclusas)
 * @name get/api/aderencia/parlamentar
 * @function
 * @memberof module:routes/aderencia/parlamentar
 */
router.get("/parlamentar", (req, res) => {
  Parlamentar.findAll({
    attributes: attParlamentar,
    include: [
      {
        model: Aderencia,
        attributes: attAderencia,
        as: "parlamentarAderencia",
        required: false,
        include: [
          {
            model: Partido,
            attributes: attPartido,
            as: "partido",
            required: false
          },
          {
            model: Tema,
            attributes: attTema,
            as: "aderenciaTema",
            required: false
          }
        ]
      },
      {
        model: ComposicaoComissoes,
        attributes: attComposicaoComissoes,
        include: [
          {
            model: Comissoes,
            attributes: attComissoes,
            as: "infoComissao",
            required: false
          }
        ],
        as: "parlamentarComissoes",
        required: false
      },
      {
        model: Partido,
        attributes: attPartido,
        as: "parlamentarPartido",
        required: false
      },
      {
        model: Liderancas,
        attributes: attLideranca,
        as: "parlamentarLiderancas",
        required: false,
        include: [
          {
            model: Partido,
            attributes: attPartido,
            as: "liderancaPartido",
            required: false
          }
        ]
      },
    ],
    where: {
      em_exercicio: true
    }
  })
  .then(parlamentares => {
    const result = parlamentares.map(parlamentar => {
      let data = parlamentar.toJSON();
      data['nomeProcessado'] = data['nomeEleitoral'].normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      return data;
    });
    res.status(SUCCESS).json(result);
  })
  .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
 * Recupera informações de aderência para um parlamentar específico (via id voz ativa)
 * @name get/api/aderencia/parlamentar/:id
 * @function
 * @memberof module:routes/parlamentar/:id
 */
router.get("/parlamentar/:id", (req, res) => {
  Parlamentar.findOne({
    attributes: attParlamentar,
    include: [
      {
        model: Aderencia,
        attributes: attAderencia,
        as: "parlamentarAderencia",
        required: false,
        include: [
          {
            model: Partido,
            as: "partido",
            required: false,
            attributes: attPartido
          },
          {
            model: Tema,
            as: "aderenciaTema",
            required: false,
            attributes: attTema
          }
        ]
      },
      {
        model: Partido,
        as: "parlamentarPartido",
        required: false,
        attributes: attPartido
      }
    ],
    where: {
      id_parlamentar_voz: req.params.id
    }
  })
    .then(parlamentares => res.status(SUCCESS).json(parlamentares))
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

module.exports = router;