const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResultadoSchema = new Schema({
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
  nome: {
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
  respostas: {
    type: [Number],
    required: true
  },
});

module.exports = Resultado = mongoose.model("resultado", ResultadoSchema);
