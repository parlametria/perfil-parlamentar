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
 * @name get/api/alinhamento
 * @function
 * @memberof module:routes/alinhamento
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