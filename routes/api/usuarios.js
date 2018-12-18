const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const models = require("../../models/index");
const Usuario = models.usuario;
const Resposta = models.respostau;
const Votacao = models.votacaou;
const expressJwt = require("express-jwt");
const keys = require("../../config/keys");

const {
  formataRespostas,
  formataVotacoes,
  formataRespostasUser,
  formataVotacoesUser
} = require("../../utils/functions");

const att_res = ["resposta", "pergunta_id"];
const att_vot = ["resposta", "proposicao_id"];
const att_secret = ["id"];
const att = [
  "first_name",
  "full_name",
  "email",
  "photo",
  "id",
  "provider",
  "provider_id",
  "token"
];

const BAD_REQUEST = 400;
const SUCCESS = 200;

const authenticate = expressJwt({
  secret: keys.secretOrKey,
  requestProperty: "auth",
  getToken: function(req) {
    if (req.headers["authorization"]) {
      return req.headers["authorization"];
    }
    return null;
  }
});

router.get("/respostas", (req, res) => {
  Usuario.findAll({
    attributes: att_secret,
    include: [
      {
        model: Resposta,
        as: "user_resp",
        attributes: att_res
      },
      {
        model: Votacao,
        as: "user_vot",
        attributes: att_vot
      }
    ]
  })
    .then(resultado => {
      resultadoNovo = formataRespostasUser(resultado);
      return res.status(SUCCESS).json(resultadoNovo);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

router.get("/respostas/eu", authenticate, (req, res) => {
  Usuario.findAll({
    attributes: att,
    include: [
      {
        model: Resposta,
        as: "user_resp",
        attributes: att_res
      },
      {
        model: Votacao,
        as: "user_vot",
        attributes: att_vot
      }
    ],
    where: { provider_id: req.auth.id }
  })
    .then(resultado => {
      resultadoNovo = formataRespostasUser(resultado);
      console.log(resultadoNovo[0]);
      return res.status(SUCCESS).json(resultadoNovo[0]);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

router.post("/respostas/eu", authenticate, (req, res) => {
  const perfil = {};
  perfil.usuario = req.auth.id;

  const idResp = req.query.idResp;
  console.log(idResp);
  const vozAtiva = req.body.respostas.vozAtiva;
  const votacoes = req.body.respostas.votacoes;

  Usuario.findOne({ where: { provider_id: req.auth.id } })
    .then(usuario => {
      if (idResp in vozAtiva) {
        Resposta.upsertResp(
          idResp,
          usuario.id,
          vozAtiva[idResp],
          (user, err) => {
            return err, user;
          }
        );
      } else {
        Votacao.upsertResp(
          idResp,
          usuario.id,
          votacoes[idResp],
          (user, err) => {
            return err, user;
          }
        );
      }
    })
    .catch(err => res.status(BAD_REQUEST).json({ err }));
  res.status(SUCCESS).json({ vozAtiva, votacoes });
});
module.exports = router;

//https://stackoverflow.com/questions/40403825/update-only-one-row-in-sequelize
