const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PerguntaSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  tema: {
    type: String,
    required: true
  },
  texto: {
    type: String,
    required: true
  }
});

module.exports = Pergunta = mongoose.model("pergunta", PerguntaSchema);