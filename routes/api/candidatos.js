/** Express router
 * @module routes/candidatos
 * @requires express
 */
const express = require("express");

/**
 * Rotas para funções relacionadas aos candidatos.
 * @namespace module:routes/candidatos
 */
const router = express.Router();
const models = require("../../models/index");
const { formataRespostas, formataVotacoes } = require("../../utils/functions");

const Candidato = models.candidato;
const Votacao = models.votacao;
const Proposicao = models.proposicao;

const att_res = ["resposta", "proposicao_id"];
const att = [
  "cpf",
  "estado",
  "uf",
  "nome_urna",
  "recebeu",
  "respondeu",
  "eleito",
  "reeleicao",
  "email",
  "sg_partido",
  "partido",
  "n_candidatura",
  "id_parlamentar",
  "genero"
];

/**
 * Testa a rota de candidatos.
 * @name get/api/candidatos/test
 * @function
 * @memberof module:routes/candidatos
 */
router.get("/test", (req, res) =>
  res.json({ msg: "Testando a rota de candidatos." })
);

/**
 * Pega as votações de um deputado dado seu cpf.
 * @name get/api/candidatos/votacoes
 * @function
 * @memberof module:routes/candidatos
 */
router.get("/votacoes", (req, res) => {
  Candidato.findAll({
    attributes: att,
    include: [
      {
        model: Votacao,
        as: "cpf_vot",
        attributes: att_res,
        required: false,
        include: {
          model: Proposicao,
          attributes: [],
          as: "vot_prop",
          required: true,
          where: { status_proposicao: "Ativa" }
        }
      }
    ],
    where: {
      eleito: true
    },
    limit: 513
  })
    .then(votacoes => {
      novaVotacao = formataVotacoes(votacoes);
      return res.json(novaVotacao);
    })
    .catch(err => res.status(400).json({ err }));
});

/**
 * Pega todos os candidatos de uma vez.
 * @name get/api/candidatos
 * @function
 * @memberof module:routes/candidatos
 */
router.get("/", (req, res) => {
  Candidato.findAll()
    .then(candidatos => res.json(candidatos))
    .catch(err => res.status(400).json({ err }));
});

/**
 * Pega os partidos distintos de um estado
 * @name get/api/candidatos/partidos
 * @memberof module:routes/candidatos 
 */
router.get("/partidos", (req, res) => {
  Candidato.findAll({
    attributes: att,
    where: {
      eleito: true
    }
  })
    .then(candidatos => {
      let partidosPorEstado = []

      const estados = [...new Set(candidatos.map(item => item.uf))];

      estados.push("Estados");

      estados.forEach(estado => {
        let candidatosFiltered;
        if (estado !== "Estados")
          candidatosFiltered = candidatos.filter(value => value.uf === estado);
        else
          candidatosFiltered = candidatos;        
        
        const partidosSet = new Set();

        candidatosFiltered.forEach(cand => {
          partidosSet.add(cand.sg_partido);
        });
        
        partidosPorEstado.push({ estado: estado, partidos: [...partidosSet].sort((a, b) => a.localeCompare(b)) });
      });      

      res.json(partidosPorEstado);
    })
    .catch(err => res.status(BAD_REQUEST).json({ error: err.message }));
});


/**
 * Pega um candidato de acordo com o cpf.
 * @name get/api/candidatos/:cpf
 * @function
 * @memberof module:routes/candidatos
 * @param {string} cpf - CPF do candidato
 */
router.get("/:cpf", (req, res) => {
  Candidato.findAll({
    where: {
      cpf: req.params.cpf
    }
  })
    .then(candidatos => res.json(candidatos))
    .catch(err => res.status(400).json({ err }));
});

/**
 * Pega as votações de um deputado dado seu cpf.
 * @name get/api/:cpf/votacoes
 * @function
 * @memberof module:routes/candidatos
 * @param {string} cpf - CPF do candidato
 */
router.get("/:cpf/votacoes", (req, res) => {
  Candidato.findAll({
    attributes: att,
    include: [
      {
        model: Votacao,
        as: "cpf_vot",
        attributes: att_res,
        required: true
      }
    ],
    where: { cpf: req.params.cpf }
  })
    .then(votacoes => {
      novaVotacao = formataVotacoes(votacoes);
      return res.json(novaVotacao[0]);
    })
    .catch(err => res.status(400).json({ err: err.message }));
});

module.exports = router;
