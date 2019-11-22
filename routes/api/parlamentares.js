const express = require("express");
const router = express.Router();
const { validationResult } = require('express-validator');

const models = require("../../models/index");
const { formataVotacoes } = require("../../utils/functions");
const casaValidator = require("../../utils/middlewares/casa.validator");

const Parlamentar = models.parlamentar;
const Votacao = models.votacao;
const Voto = models.voto;
const Proposicao = models.proposicao;
const Comissoes = models.comissoes;
const ComposicaoComissoes = models.composicaoComissoes;
const Liderancas = models.liderancas;
const Partido = models.partido;

const BAD_REQUEST = 400;
const SUCCESS = 200;

const attVotacao = ["voto", ["id_votacao", "idVotacao"]];
const att = [
  ["id_parlamentar_voz", "idParlamentarVoz"],
  ["id_parlamentar", "idParlamentar"],
  "casa",
  ["nome_eleitoral", "nomeEleitoral"],
  "uf",
  "genero",
  ["em_exercicio", "emExercicio"],
  "casa"
];
const attComissoes = ["sigla", "nome"];
const attComposicaoComissoes = [["id_comissao_voz", "idComissaoVoz"], "cargo"];
const attPartido = [["id_partido", "idPartido"], "sigla", "tipo"]

/**
 * Testa a rota de parlamentares.
 * @name get/api/parlamentares/test
 * @function
 * @memberof module:routes/parlamentares
 */
router.get("/test", (req, res) =>
  res.json({ msg: "Testando a rota de parlamentares." })
);

/**
 * Recupera infomações dos parlamentares incluindo suas votações (quando existem)
 * @name get/api/parlamentares/votacoes
 * @function
 * @memberof module:routes/parlamentares
 */
router.get("/votacoes", (req, res) => {
  Parlamentar.findAll({
    attributes: att,
    include: [
      {
        model: Votacao,
        as: "votacoes",
        attributes: attVotacao,
        required: false,
        include: {
          model: Proposicao,
          attributes: [],
          as: "vot_prop",
          required: false,
          where: { status_proposicao: "Ativa" }
        }
      },
      {
        model: Partido,
        as: "parlamentarPartido",
        attributes: attPartido
      }
    ],
    where: {
      em_exercicio: true
    },
    limit: 513
  })
    .then(votacoes => {
      novaVotacao = formataVotacoes(votacoes);
      return res.json(novaVotacao);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
 * Recupera informações sobre os parlamentares
 * @name get/api/parlamentares
 * @function
 * @memberof module:routes/parlamentares
 */
router.get("/", (req, res) => {
  Parlamentar.findAll({
    include: [{
      model: Partido,
      as: "parlamentarPartido",
      attributes: attPartido,
    }],
    where: {
      casa: 'camara'
    }
  })
    .then(parlamentares => res.json(parlamentares))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Pega os partidos distintos de um estado
 * @name get/api/parlamentares/partidos
 * @apiparam Casa Casa de origem do parlamentar. Pode ser "camara" (default) ou "senado".
 * @memberof module:routes/parlamentares 
 */
router.get("/partidos", casaValidator.validate, (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({ errors: errors.array() });
    }

    const casa = req.param("casa") || "camara"

    Parlamentar.findAll({
      attributes: att,
      where: {
        em_exercicio: true,
        casa: casa
      },
      include: [{
        model: Partido,
        as: "parlamentarPartido"
      }]
    })
      .then(parlamentares => {
        let partidosPorEstado = []

        const estados = [...new Set(parlamentares.map(item => item.uf))];

        estados.push("Estados");

        estados.forEach(estado => {
          let parlamentaresFiltered;
          if (estado !== "Estados")
            parlamentaresFiltered = parlamentares.filter(value => value.uf === estado);
          else
            parlamentaresFiltered = parlamentares;

          const partidosSet = new Set();

          parlamentaresFiltered.forEach(cand => {
            partidosSet.add(cand.parlamentarPartido.sigla);
          });

          partidosPorEstado.push({ estado: estado, partidos: [...partidosSet].sort((a, b) => a.localeCompare(b)) });
        });

        res.json(partidosPorEstado);
      })
      .catch(err => res.status(BAD_REQUEST).json({ error: err.message }));
  });


/**
 * Recupera informações do mapeamento ID do parlamentar e o id na plataforma Voz Ativa
 * @name get/api/parlamentares
 * @function
 * @memberof module:routes/parlamentares
 */
router.get("/mapeamento-id", (req, res) => {
  Parlamentar
    .findAll({
      attributes: ["id_parlamentar", "id_parlamentar_voz"]
    })
    .then(parlamentares => res.status(SUCCESS).json(parlamentares))
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
 * Recupera informações do parlamentar de acordo com o id (no Voz Ativa).
 * @name get/api/parlamentares/:id
 * @function
 * @memberof module:routes/parlamentares
 * @param {string} id - id do parlamentar na plataforma Voz Ativa
 */
router.get("/:id", (req, res) => {
  Parlamentar.findAll({
    where: {
      id_parlamentar_voz: req.params.id
    }
  })
    .then(parlamentar => res.json(parlamentar))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});


/**
* Recupera informações básicas do parlamentar de acordo com o id (no Voz Ativa).
* @name get/api/parlamentares/:id/info
* @function
* @memberof module:routes/parlamentares
* @param {string} id - id do parlamentar na plataforma Voz Ativa
*/
router.get("/:id/info", (req, res) => {
  Parlamentar.findOne({
    attributes: ["id_parlamentar_voz", "id_parlamentar", "casa", "nome_eleitoral", "uf", "em_exercicio", "id_perfil_politico"],
    where: {
      id_parlamentar_voz: req.params.id
    },
    include: [{
      model: Partido,
      as: "parlamentarPartido",
      attributes: attPartido
    }]
  })
    .then(parlamentar => res.json(parlamentar))
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

/**
 * Recupera informações de posições do parlamentar a partir de seu id (no Voz Ativa)
 * @name get/api/parlamentares/:id/posicoes
 * @function
 * @memberof module:routes/parlamentares
 * @param {string} id - id do parlamentar na plataforma Voz Ativa
 */
router.get("/:id/posicoes", (req, res) => {
  Parlamentar.findAll({
    attributes: [["id_parlamentar_voz", "idParlamentarVoz"], "genero"],
    include: [
      {
        model: Voto,
        as: "votos",
        attributes: attVotacao,
        required: false,
        include: [{
          model: Votacao,
          as: "votacoesVoto",
          attributes: [],
          required: true,
          include: [{
            model: Proposicao,
            as: "proposicaoVotacoes",
            attributes: [],
            required: true,
            where: { status_proposicao: "Ativa" }
          }]
        }]
      }
    ],
    where: { id_parlamentar_voz: req.params.id }
  })
    .then(votacoes => {
      novaVotacao = formataVotacoes(votacoes);
      return res.json(novaVotacao[0]);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
 * Recupera informações de votos (usados para o cálculo da aderência) do parlamentar a partir de seu id (no Voz Ativa)
 * @name get/api/parlamentares/:id/votos
 * @function
 * @memberof module:routes/parlamentares
 * @param {string} id - id do parlamentar na plataforma Voz Ativa
 */
router.get("/:id/votos", (req, res) => {
  Parlamentar.findAll({
    attributes: [["id_parlamentar_voz", "idParlamentarVoz"], "genero"],
    include: [
      {
        model: Voto,
        as: "votos",
        attributes: attVotacao,
        required: false,
        include: [{
          model: Votacao,
          as: "votacoesVoto",
          attributes: [],
          required: true,
          include: [{
            model: Proposicao,
            as: "proposicaoVotacoes",
            attributes: [],
            required: true,
            where: { status_importante: "Ativa" }
          }]
        }]
      }
    ],
    where: { id_parlamentar_voz: req.params.id }
  })
    .then(votacoes => {
      novaVotacao = formataVotacoes(votacoes);
      return res.json(novaVotacao[0]);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
 * Recupera informações de comissões do parlamentar a partir de seu id (no Voz Ativa)
 * @name get/api/parlamentares/:id/comissoes
 * @function
 * @memberof module:routes/parlamentares
 * @param {string} id - id do parlamentar na plataforma Voz Ativa
 */
router.get("/:id/comissoes", (req, res) => {
  Parlamentar.findOne({
    attributes: [["id_parlamentar_voz", "idParlamentarVoz"]],
    include: [
      {
        model: ComposicaoComissoes,
        attributes: attComposicaoComissoes,
        as: "parlamentarComissoes",
        required: false,
        include: [
          {
            model: Comissoes,
            attributes: attComissoes,
            as: "infoComissao",
            required: false
          }
        ]
      }
    ],
    where: { id_parlamentar_voz: req.params.id }
  })
    .then(parlamentar => {
      return res.json(parlamentar);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

/**
 * Recupera informações de lideranças para um parlamentar a partir de seu id (no Voz Ativa)
 * @name get/api/parlamentares/:id/liderancas
 * @function
 * @memberof module:routes/parlamentares
 * @param {string} id - id do parlamentar na plataforma Voz Ativa
 */
router.get("/:id/liderancas", (req, res) => {
  Parlamentar.findOne({
    attributes: [["id_parlamentar_voz", "idParlamentarVoz"]],
    include: [
      {
        model: Liderancas,
        attributes: ["cargo"],
        as: "parlamentarLiderancas",
        required: false,
        include: [{
          model: Partido,
          attributes: attPartido,
          as: "liderancaPartido",
          where: {
            situacao: "Ativo"
          }
        }]
      }
    ],
    where: { id_parlamentar_voz: req.params.id }
  })
    .then(parlamentar => {
      return res.json(parlamentar);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

module.exports = router;
