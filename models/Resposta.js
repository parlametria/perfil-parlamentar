const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RespostaSchema = new Schema({
  cpf: {
    type: String,
    required: true
  },
  date_modified: {
    type: Date
  },
  date_created: {
    type: Date
  },
  email: {
    type: String,
    required: true
  },
  foto: {
    type: String,
    required: true
  },
  nome_urna: {
    type: String,
    required: true
  },
  nome_exibicao: {
    type: String,
    required: true
  },
  sg_partido: {
    type: String,
    required: true
  },
  uf: {
    type: String,
    required: true
  },
  respostas: {
    type: Map,
    required: true
  }
});
console.log("acessando Resposta.js");
module.exports = Resposta = mongoose.model("resposta", RespostaSchema);
console.log("fim do acesso a Resposta.js");
