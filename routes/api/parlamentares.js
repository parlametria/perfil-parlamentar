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
* @swagger
* tags:
*   name: Parlamentares
*   description: Lista de endpoints relacionados aos parlamentares analisados pelo Perfil Parlamentar.
*/


/**
* @swagger
* path:
*  /api/parlamentares/votacoes:
*    get:
*      deprecated: true
*      summary: Recupera informações dos parlamentares incluindo suas votações (quando existem)
*      tags: [Parlamentares]
*      responses:
*        "200":
*          description: Lista de parlamentares com informações de votações.
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
* @swagger
* path:
*  /api/parlamentares/:
*    get:
*      summary: Recupera informações dos Deputados Federais analisados pelo Perfil Parlamentar.
*      tags: [Parlamentares]
*      responses:
*        "200":
*          description: Lista de todos os Deputados Federais analisados pelo Perfil.
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
* @swagger
* path:
*  /api/parlamentares/partidos:
*    get:
*      summary: Recupera, para cada UF, a lista de partidos distintos com parlamentares em exercício.
*      tags: [Parlamentares]
*      parameters:
*        - in: query
*          name: casa
*          schema:
*            type: string
*          required: true
*          description: Casa de origem do parlamentar. Pode ser "camara" (default) ou "senado".
*      responses:
*        "200":
*          description: Lista de partidos distintos (por UF) presentes na casa passada como parâmetro.
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
* @swagger
* path:
*  /api/parlamentares/mapeamento-id:
*    get:
*      summary: Recupera informações do mapeamento do ID do parlamentar na sua casa de origem e o id na plataforma Perfil Parlamentar.
*      tags: [Parlamentares]
*      responses:
*        "200":
*          description: Lista com mapeamento entre id_parlamentar e id_parlamentar_voz 
*                       (id próprio do Perfil Parlamentar).
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
* @swagger
* path:
*  /api/parlamentares/{id}:
*    get:
*      summary: Recupera todas as informações de um parlamentar específico.
*      tags: [Parlamentares]
*      parameters:
*        - in: path
*          name: id
*          schema:
*            type: integer
*          required: true
*          description: Id do parlamentar
*      responses:
*        "200":
*          description: Lista com informações do parlamentar filtrado.
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
* @swagger
* path:
*  /api/parlamentares/{id}/info:
*    get:
*      summary: Recupera informações básicas de um parlamentar específico.
*      tags: [Parlamentares]
*      parameters:
*        - in: path
*          name: id
*          schema:
*            type: integer
*          required: true
*          description: Id do parlamentar
*      responses:
*        "200":
*          description: Lista com informações básicas do parlamentar filtrado.
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
* @swagger
* path:
*  /api/parlamentares/{id}/posicoes:
*    get:
*      summary: Recupera informações de posições do parlamentar em votações.
*      tags: [Parlamentares]
*      parameters:
*        - in: path
*          name: id
*          schema:
*            type: integer
*          required: true
*          description: Id do parlamentar
*      responses:
*        "200":
*          description: Lista com as posições do parlamentar em votações.
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
* @swagger
* path:
*  /api/parlamentares/{id}/votos:
*    get:
*      summary: Recupera informações de votos (usados para o cálculo da aderência) do parlamentar.
*      tags: [Parlamentares]
*      parameters:
*        - in: path
*          name: id
*          schema:
*            type: integer
*          required: true
*          description: Id do parlamentar
*      responses:
*        "200":
*          description: Objeto com os votos do Parlamentar nas votações capturadas pelo Perfil Parlamentar.
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
* @swagger
* path:
*  /api/parlamentares/{id}/comissoes:
*    get:
*      summary:  Recupera informações de cargos em comissões para um parlamentar.
*      tags: [Parlamentares]
*      parameters:
*        - in: path
*          name: id
*          schema:
*            type: integer
*          required: true
*          description: Id do parlamentar
*      responses:
*        "200":
*          description: Objeto com os cargos em comissões que o parlamentar filtrado participa.
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
* @swagger
* path:
*  /api/parlamentares/{id}/liderancas:
*    get:
*      summary:  Recupera informações de cargos em lideranças de um parlamentar.
*      tags: [Parlamentares]
*      parameters:
*        - in: path
*          name: id
*          schema:
*            type: integer
*          required: true
*          description: Id do parlamentar
*      responses:
*        "200":
*          description: Objeto com os cargos em lideranças em partidos e bloco partidários que o parlamentar possui.
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
