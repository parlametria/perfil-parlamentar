const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VotacaoSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  cpf: {
    type: String,
    required: true
  },
  votacoes: {
    type: Map,
    required: true
  }
});

module.exports = Votacao = mongoose.model("votacoes", VotacaoSchema);
