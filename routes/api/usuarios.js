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
  formataRespostasUser
} = require("../../utils/functions");

const attRes = ["resposta", "pergunta_id"];
const attVot = ["resposta", "proposicao_id"];
const attSecret = ["id"];
const attNone = [];

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
    attributes: attSecret,
    include: [
      {
        model: Resposta,
        as: "user_resp",
        attributes: attRes
      },
      {
        model: Votacao,
        as: "user_vot",
        attributes: attVot
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
    attributes: attNone,
    include: [
      {
        model: Resposta,
        as: "user_resp",
        attributes: attRes
      },
      {
        model: Votacao,
        as: "user_vot",
        attributes: attVot
      }
    ],
    where: { provider_id: req.auth.id }
  })
    .then(resultado => {
      resultadoNovo = formataRespostasUser(resultado);
      return res.status(SUCCESS).json({
        vozAtiva: resultadoNovo[0]["respostas"]["vozAtiva"],
        votacoes: resultadoNovo[0]["respostas"]["votacoes"]
      });
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
