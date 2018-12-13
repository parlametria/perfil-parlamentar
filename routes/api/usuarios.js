const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const models = require("../../models/index");
const Usuario = models.usuario;
const Resposta = models.respostau;
const UsuarioM = require("../../models/Usuario");
const expressJwt = require("express-jwt");
const keys = require("../../config/keys");

const {
  formataRespostas,
  formataVotacoes,
  formataRespostasUser
} = require("../../utils/functions");

const att_res = ["resposta", "pergunta_id"];
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
      }
    ]
  })
    .then(resultado => {
      resultadoNovo = formataRespostasUser(resultado);

      return res.json(resultadoNovo);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

router.get("/respostas/eu", authenticate, (req, res) => {
  Usuario.findOne({
    attributes: att,
    include: [
      {
        model: Resposta,
        as: "user_resp",
        attributes: att_res
      }
    ],
    where: { provider_id: req.auth.id }
  })
    .then(resultado => {
      resultadoNovo = formataRespostasUser(resultado);

      return res.json(resultadoNovo);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});

router.post("/respostas/eu", authenticate, (req, res) => {
  const perfil = {};

  perfil.usuario = req.auth.id;
  respostas = req.body.respostas;

  Usuario.findOneAndUpdate(
    { _id: req.auth.id },
    { $set: { respostas: respostas } },
    { upsert: true }
  )
    .then(usuario => {
      res.status(SUCCESS).json(usuario.respostas);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err }));
});
module.exports = router;

//https://stackoverflow.com/questions/40403825/update-only-one-row-in-sequelize
