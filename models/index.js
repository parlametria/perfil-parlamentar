const Sequelize = require("sequelize");
const logger = require("heroku-logger");

// Models
const ProposicaoModel = "./Prop.js";
const PerguntaModel = "./Perg.js";
const CandidatoModel = "./Cand.js";
const UsuarioModel = "./Usuario.js";

if (!global.hasOwnProperty("models")) {
  const db = require("../config/keys").postgresURI;

  // Connect to Postgres
  const sequelize = new Sequelize(db, {
    dialect: "postgres",
    dialectOptions: {
      ssl: true
    }
  });

  sequelize
    .authenticate()
    .then(() => {
      logger.info("Connection has been established successfully.");
    })
    .catch(err => {
      logger.error("Unable to connect to the database:", err);
    });

  global.models = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    Usuario: sequelize.import(UsuarioModel),
    Candidato: sequelize.import(CandidatoModel),
    Pergunta: sequelize.import(PerguntaModel),
    Proposicao: sequelize.import(ProposicaoModel)
    // add your other models here
  };
}
module.exports = global.models;
