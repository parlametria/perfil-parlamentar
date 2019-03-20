const Sequelize = require("sequelize");
const logger = require("heroku-logger");

// Models
const ProposicaoModel = "./postgres/proposicao.js";
const PerguntaModel = "./postgres/pergunta.js";
const CandidatoModel = "./postgres/candidato.js";
const TemaModel = "./postgres/tema.js";
const VotacaoModel = "./postgres/votacao.js";
const VotacaoUModel = "./postgres/votacaou.js";
const RespostaModel = "./postgres/resposta.js";
const RespostaUModel = "./postgres/respostasU.js";
const UsuarioModel = "./postgres/usuario.js";
const TemasUModel = "./postgres/temasu.js";
const ComissoesModel = "./postgres/comissoes.js";
const ComposicaoComissoesModel = "./postgres/composicao-comissoes.js";

if (!global.hasOwnProperty("models")) {
  const db = require("../config/keys").postgresURI;

  // Connect to Postgres
  const sequelize = new Sequelize(db, {
    host: "localhost",
    dialect: "postgres",
    operatorsAliases: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production'
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

  global.models = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    tema: sequelize.import(TemaModel),
    usuario: sequelize.import(UsuarioModel),
    candidato: sequelize.import(CandidatoModel),
    pergunta: sequelize.import(PerguntaModel),
    proposicao: sequelize.import(ProposicaoModel),
    resposta: sequelize.import(RespostaModel),
    votacao: sequelize.import(VotacaoModel),
    respostau: sequelize.import(RespostaUModel),
    votacaou: sequelize.import(VotacaoUModel),
    temasu: sequelize.import(TemasUModel),
    comissoes: sequelize.import(ComissoesModel),
    composicaoComissoes: sequelize.import(ComposicaoComissoesModel),
    // add your other models here
  };

  Object.keys(global.models).forEach(modelName => {
    console.log(modelName);
    if (global.models[modelName].associate) {
      global.models[modelName].associate(global.models);
    }
  });
  
  sequelize.sync({ force: false }).then(() => {
    console.log("BD sincronizado");
  });
}
module.exports = global.models;
