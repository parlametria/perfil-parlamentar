const express = require("express");
const router = express.Router();

const models = require("../../models/index");
const { formataVotacoes } = require("../../utils/functions");

const Parlamentar = models.parlamentar;
const Votacao = models.votacao;
const Proposicao = models.proposicao;

const att_votacao = ["voto", "id_votacao"];
const att = [
  "id_parlamentar_voz",
  "id_parlamentar",
  "casa",
  "nome_eleitoral",
  "uf",
  "partido",
  "genero",
  "em_exercicio"  
];

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
        as: "parlamentar_vot",
        attributes: att_votacao,
        required: false,
        include: {
          model: Proposicao,
          attributes: [],
          as: "vot_prop",
          required: false,
          where: { status_proposicao: "Ativa" }
        }
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
    .catch(err => res.status(400).json({ err: err.message }));
});

/**
 * Recupera informações sobre os parlamentares
 * @name get/api/parlamentares
 * @function
 * @memberof module:routes/parlamentares
 */
router.get("/", (req, res) => {
  Parlamentar.findAll()
    .then(parlamentares => res.json(parlamentares))
    .catch(err => res.status(400).json({ err }));
});

/**
 * Pega os partidos distintos de um estado
 * @name get/api/parlamentares/partidos
 * @memberof module:routes/parlamentares 
 */
router.get("/partidos", (req, res) => {
  Parlamentar.findAll({
    attributes: att,
    where: {
      em_exercicio: true
    }
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
          partidosSet.add(cand.partido);
        });
        
        partidosPorEstado.push({ estado: estado, partidos: [...partidosSet].sort((a, b) => a.localeCompare(b)) });
      });      

      res.json(partidosPorEstado);
    })
    .catch(err => res.status(BAD_REQUEST).json({ error: err.message }));
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
    .catch(err => res.status(400).json({ err }));
});

/**
 * Recupera informações de um parlamentar a partir de seu id (no Voz Ativa)
 * @name get/api/:id/votacoes
 * @function
 * @memberof module:routes/candidatos
 * @param {string} id - id do parlamentar na plataforma Voz Ativa
 */
router.get("/:id/votacoes", (req, res) => {
  Parlamentar.findAll({
    attributes: att,
    include: [
      {
        model: Votacao,
        as: "parlamentar_vot",
        attributes: att_votacao,
        required: false
      }
    ],
    where: { id_parlamentar_voz: req.params.id }
  })
    .then(votacoes => {
      novaVotacao = formataVotacoes(votacoes);
      return res.json(novaVotacao[0]);
    })
    .catch(err => res.status(400).json({ err: err.message }));
});

module.exports = router;
