const Sequelize = require("sequelize");
const logger = require("heroku-logger");

// Models
const ProposicaoModel = "./Prop.js";
const PerguntaModel = "./Perg.js";
const CandidatoModel = "./Cand.js";
const UsuarioModel = "./Usuario.js";
const TemaModel = "./tema.js";
const VotacaoModel = "./votacao.js";
const RespostaModel = "./resposta.js";

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
    Proposicao: sequelize.import(ProposicaoModel),
    Tema: sequelize.import(TemaModel),
    Votacao: sequelize.import(VotacaoModel),
    Resposta: sequelize.import(RespostaModel),
    RespostaU: sequelize.import(RespostaModel),
    VotacaoU: sequelize.import(VotacaoModel)
    // add your other models here
  };
  global.models.Resposta.hasOne(global.models.Candidato, {
    foreignKey: "cand_cpf"
  });
  global.models.Resposta.hasOne(global.models.Pergunta, {
    foreignKey: "pergunta_id"
  });

  global.models.Votacao.hasOne(global.models.Candidato, {
    foreignKey: "cand_cpf"
  });
  global.models.Votacao.hasOne(global.models.Proposicao, {
    foreignKey: "proposicao_id"
  });
  global.models.Pergunta.hasOne(global.models.Tema, { foreignKey: "tema_id" });
  global.models.Proposicao.hasOne(global.models.Tema, {
    foreignKey: "tema_id"
  });

  global.models.VotacaoU.hasOne(global.models.Usuario, {
    foreignKey: "usr_id"
  });
  global.models.VotacaoU.hasOne(global.models.Proposicao, {
    foreignKey: "proposicao_id"
  });

  global.models.RespostaU.hasOne(global.models.Usuario, {
    foreignKey: "usr_id"
  });
  global.models.RespostaU.hasOne(global.models.Pergunta, {
    foreignKey: "pergunta_id"
  });
}
module.exports = global.models;
