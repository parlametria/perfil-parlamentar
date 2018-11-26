const Sequelize = require("sequelize");
const logger = require("heroku-logger");

// Models
const ProposicaoModel = "./postgres/proposicao.js";
const PerguntaModel = "./postgres/pergunta.js";
const CandidatoModel = "./postgres/candidato.js";
const UsuarioModel = "./postgres/usuario.js";
const TemaModel = "./postgres/tema.js";
const VotacaoModel = "./postgres/votacao.js";
const RespostaModel = "./postgres/resposta.js";

if (!global.hasOwnProperty("models")) {
  const db = require("../config/keys").postgresURI;

  // Connect to Postgres
  const sequelize = new Sequelize("vozativa", "postgres", "senha", {
    host: "localhost",
    dialect: "postgres",
    operatorsAliases: false,
    dialectOptions: {
      ssl: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
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
    usuario: sequelize.import(UsuarioModel),
    candidato: sequelize.import(CandidatoModel),
    pergunta: sequelize.import(PerguntaModel),
    proposicao: sequelize.import(ProposicaoModel),
    tema: sequelize.import(TemaModel),
    votacao: sequelize.import(VotacaoModel),
    resposta: sequelize.import(RespostaModel)
    // RespostaU: sequelize.import(RespostaModel),
    // VotacaoU: sequelize.import(VotacaoModel)
    // add your other models here
  };

  sequelize.sync({ force: true }).then(() => {
    logger.info(`Database & tables created!`);
    sequelize
      .query(
        "copy respostas FROM '/home/luizacs/Documentos/respostas.csv' DELIMITER ',' CSV HEADER;"
      )
      .spread((results, metadata) => {
        // Results will be an empty array and metadata will contain the number of affected rows.
        console.log("Inserted rows");
      });
  });

  // global.models.Resposta.hasOne(global.models.Candidato, {
  //   foreignKey: "cand_cpf"
  // });

  // global.models.Resposta.hasOne(global.models.Pergunta, {
  //   foreignKey: "pergunta_id"
  // });

  // global.models.Votacao.hasOne(global.models.Candidato, {
  //   foreignKey: "cand_cpf"
  // });

  // global.models.Votacao.hasOne(global.models.Proposicao, {
  //   foreignKey: "proposicao_id"
  // });

  // global.models.Pergunta.hasOne(global.models.Tema, { foreignKey: "tema_id" });
  // global.models.Proposicao.hasOne(global.models.Tema, {
  //   foreignKey: "tema_id"
  // });

  // global.models.VotacaoU.hasOne(global.models.Usuario, {
  //   foreignKey: "usr_id"
  // });

  // global.models.VotacaoU.hasOne(global.models.Proposicao, {
  //   foreignKey: "proposicao_id"
  // });

  // global.models.RespostaU.hasOne(global.models.Usuario, {
  //   foreignKey: "usr_id"
  // });

  // global.models.RespostaU.hasOne(global.models.Pergunta, {
  //   foreignKey: "pergunta_id"
  // });
}
module.exports = global.models;
