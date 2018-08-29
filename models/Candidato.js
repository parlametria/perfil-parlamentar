const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CandidatoSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  foto: {
    type: String,
    required: true
  },
  genero: {
    type: String,
    required: true
  },
  idade: {
    type: Number,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  nomeUrna: {
    type: String,
    required: true
  },
  partido: {
    type: String,
    required: true
  },
  uf: {
    type: String,
    required: true
  },
});

module.exports = Candidato = mongoose.model("candidato", CandidatoSchema);
