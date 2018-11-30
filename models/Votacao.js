const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VotacaoSchema = new Schema({
  cpf: {
    type: String,
    required: true
  },
  votacoexs: {
    type: Map,
    required: true
  }
});

module.exports = Votacao = mongoose.model("votacoes", VotacaoSchema);
