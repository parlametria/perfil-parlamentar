const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Usuario = require("../../models/Usuario");

const BAD_REQUEST = 400;
const SUCCESS = 200;

router.get("/respostas", (req, res) => {
  Usuario.findById(req.user.id)
    .then(usuario => res.status(SUCCESS).json(usuario.respostas)
    )
    .catch(err => res.status(BAD_REQUEST).json({ err }));
})

router.post("/respostas", (req, res) => {
  const perfil = {};

  perfil.usuario = req.user.id;
  respostas = req.body.respostas;
  console.log(respostas)

  Usuario.findOneAndUpdate(
    { _id: req.user.id },
    { $set: respostas },
    { upsert: true }
  )
    .then(usuario => res.status(SUCCESS).json(usuario.respostas))
    .catch(err => res.status(BAD_REQUEST).json({ err }));

})