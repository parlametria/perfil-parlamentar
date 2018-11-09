const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Usuario = require("../../models/usuario");

const BAD_REQUEST = 400;
const SUCCESS = 200;

const passport = require("passport");
require("../../config/passport")();


//autenticacao

router.get("/respostas", passport.authenticate(["facebook-token", "google-token"], { session: false }), (req, res) => {
  Usuario.findById(req.user.id)
    .then(usuario => res.status(SUCCESS).json(usuario.respostas)
    )
    .catch(err => res.status(BAD_REQUEST).json({ err }));
})

router.post("/respostas", passport.authenticate(["facebook-token", "google-token"], { session: false }), (req, res) => {
  const perfil = {};

  perfil.usuario = req.user.id;
  respostas = req.body.respostas;

  Usuario.findOneAndUpdate(
    { _id: req.user.id },
    { $set: respostas },
    { upsert: true }
  )
    .then(usuario => res.status(SUCCESS).json(usuario.respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));

})