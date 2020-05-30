const express = require("express");

const router = express.Router();

const models = require("../../models/index");
const { calcularAlinhamentos } = require("../../utils/alinhamento");

const Parlamentar = models.parlamentar;
const Votacao = models.votacao;
const Proposicao = models.proposicao;
const Tema = models.tema;
const ComposicaoComissoes = models.composicaoComissoes;
const Comissoes = models.comissoes;
const Voto = models.voto;
const Partido = models.partido;

const att = [
  "id_parlamentar_voz",
  "id_parlamentar",
  "nome_eleitoral",
  "uf",
  "em_exercicio"
];

/**
* @swagger
* tags:
*   name: Alinhamento
*   description: Módulo com endpoints para cálculo do alinhamento com parlamentares 
*                através da comparação de respostas do questionário Voz Ativa.
*/


/**
* @swagger
* path:
*  /api/alinhamento/:
*    post:
*      summary: Calcula o alinhamento entre um conjunto de respostas passado como parâmetro e
*               as respostas dos parlamentares ao questionário Voz Ativa.
*      tags: [Alinhamento]
*      requestBody:
*        description: Objeto com as respostas para cálculo do alinhamento
*        required: true
*        content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               respostas:
*                 type: object
*             example:
*               respostas: {"5632": 0, "6043": 0}
*      responses:
*        "200":
*          description: Retorna informações do alinhamento com parlamentares (em geral e por tema).
*/
router.post("/", (req, res) => {
  Parlamentar.findAll({
    attributes: att,
    include: [
      {
        attributes: [["id_votacao", "idVotacao"], "voto"],
        model: Voto,
        as: "votos",
        required: false
      },
      {
        attributes: [["id_partido", "idPartido"], "sigla"],
        model: Partido,
        as: "parlamentarPartido",
        required: false
      },
      {
        model: ComposicaoComissoes,
        attributes: [["id_comissao_voz", "idComissaoVoz"], "cargo"],
        include: [
          {
            model: Comissoes,
            attributes: ["sigla"],
            as: "infoComissao",
            required: false
          }
        ],
        as: "parlamentarComissoes",
        required: false
      },
    ],
    where: {
      em_exercicio: true
    }
  }).then(parlamentares => {
    Votacao.findAll({
      attributes: [["id_votacao", "idVotacao"]],
      include: [
        {
          model: Proposicao,
          as: "proposicaoVotacoes",          
          require: true,
          attributes: [['id_proposicao', 'idProposicao']],
          include: [
            {
              attributes: [["id_tema", "idTema"], "tema"],
              model: Tema,
              as: "temas",
              through: { attributes: [] },
              required: true
            }
          ],
          where: {
            status_proposicao: "Ativa"
          }
        }
      ]
    }).then(proposicoes => {
      Tema.findAll({
        attributes: [["id_tema", "idTema"], "tema"],
        where: { ativo: true }

      }).then(temas => {
        const alinhamentos = calcularAlinhamentos(parlamentares, req.body.respostas, proposicoes, temas);
        return res.status(200).json(alinhamentos);
        // return res.status(200).json(proposicoes);
      }).catch(err => res.status(400).json({ err: err.message }));

    }).catch(err => res.status(400).json({ err: err.message }));

  }).catch(err => res.status(400).json({ err: err.message }));
});

module.exports = router;