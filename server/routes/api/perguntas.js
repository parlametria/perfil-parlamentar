const express = require("express");

const router = express.Router();

const models = require("../../models/index");

const Pergunta = models.pergunta;
const Temas = models.tema;
const Proposicao = models.proposicao;
const Votacao = models.votacao;
const ProposicaoTemas = models.proposicaoTemas;

/**
* @swagger
* tags:
*   name: Perguntas
*   description: Recupera perguntas do questionário aplicado pelo Voz Ativa (antigo nome para o Perfil Parlamentar).
*/


/**
* @swagger
* path:
*  /api/perguntas/vozativa:
*    get:
*      summary: Recupera as perguntas realizadas no questionário Voz Ativa.
*      tags: [Perguntas]
*      responses:
*        "200":
*          description: Lista das perguntas do questionário Voz Ativa.
*/
router.get("/vozativa", (req, res) => {
  Pergunta.findAll({
    attributes: ["id", "texto"],
    include: [
      {
        model: Temas,
        as: "tema_perg"
      }
    ]
  })
    .then(perguntas => res.json(perguntas))
    .catch(err => res.status(400).json({ err }));
});

/**
* @swagger
* path:
*  /api/perguntas/proposicoes:
*    get:
*      summary: Recupera as proposições relacionadas ao questionário Voz Ativa.
*      tags: [Perguntas]
*      responses:
*        "200":
*          description: Lista de proposições relacionadas ao questionário Voz Ativa.
*/
router.get("/proposicoes", (req, res) => {
  Proposicao.findAll({
    attributes: [["projeto_lei", "projetoLei"], ["id_proposicao", "idProposicao"], "titulo", "descricao"],
    where: { status_proposicao: "Ativa" },
    include: [
      {
        model: Temas,
        as: "temas",
        attributes: [["id_tema", "idTema"], "tema", "slug"]
      },
      {
        model: Votacao,
        attributes: [["id_votacao", "idVotacao"]],
        as: "proposicaoVotacoes",
        require: true
      }
    ],
    order: [
      ['temas', 'id_tema', 'ASC'],
      ['id_proposicao', 'ASC']
    ]
  })
    .then(proposicoes => res.json(proposicoes))
    .catch(err => res.status(400).json({ err }));
});

/**
* @swagger
* path:
*  /api/perguntas/proposicoes/{id}:
*    get:
*      summary: Recupera uma proposição específica relacionada ao questionário Voz Ativa.
*      tags: [Perguntas]
*      parameters:
*        - in: path
*          name: id
*          schema:
*            type: integer
*          required: true
*          description: Id da proposição
*      responses:
*        "200":
*          description: Informações da proposição no questionário Voz Ativa.
*/
router.get("/proposicoes/:id", (req, res) => {
  Proposicao.findOne({
    attributes: [["projeto_lei", "projetoLei"], ["id_proposicao", "idProposicao"], "titulo", "descricao"],
    where: { 
      status_proposicao: "Ativa",
      id_proposicao: req.params.id 
    },
    order: [
      ['id_proposicao', 'ASC']
    ],
    include: [
      {
        model: Temas,
        attributes: [["id_tema", "idTema"], "tema", "slug"]
      },
      {
        model: Votacao,
        attributes: [["id_votacao", "idVotacao"]],
        as: "proposicaoVotacoes",
        require: true
      }
    ]
  })
    .then(proposicoes => res.json(proposicoes))
    .catch(err => res.status(400).json({ err }));
});

module.exports = router;
