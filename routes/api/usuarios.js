const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);

const Usuario = require("../../models/Usuario");
const expressJwt = require("express-jwt");
const keys = require("../../config/keys");


const BAD_REQUEST = 400;
const SUCCESS = 200;

const authenticate = expressJwt({
  secret: keys.secretOrKey,
  requestProperty: "auth",
  getToken: function (req) {
    if (req.headers["authorization"]) {
      return req.headers["authorization"];
    }
    return null;
  }
});

router.get("/respostas", (req, res) => {
  Usuario.find()
    .then(usuarios => {
      let mapaDeUsuarios = {};
      usuarios.forEach(usuario => {
        mapaDeUsuarios[usuario._id] = usuario.respostas;
      });
      res.status(SUCCESS).json(mapaDeUsuarios);
    })
})

router.get("/respostas/eu", authenticate, (req, res) => {
  Usuario.findById(req.auth.id)
    .then(usuario => res.status(SUCCESS).json(usuario.respostas)
    )
    .catch(err => res.status(BAD_REQUEST).json({ err }));
})

router.post("/respostas/eu", authenticate, (req, res) => {
  const perfil = {};

  perfil.usuario = req.auth.id;
  respostas = req.body.respostas;
  console.log(respostas)

  Usuario.findOneAndUpdate(
    { _id: req.auth.id },
    { $set: respostas },
    { upsert: true }
  )
    .then(usuario => res.status(SUCCESS).json(usuario.respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));

})
module.exports = router;
