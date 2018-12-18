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

if (!global.hasOwnProperty("models")) {
  const db = require("../config/keys").postgresURI;

  // Connect to Postgres
  const sequelize = new Sequelize("vozativa", "postgres", "v0z4tiva18#", {
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
    tema: sequelize.import(TemaModel),
    usuario: sequelize.import(UsuarioModel),
    candidato: sequelize.import(CandidatoModel),
    pergunta: sequelize.import(PerguntaModel),
    proposicao: sequelize.import(ProposicaoModel),
    resposta: sequelize.import(RespostaModel),
    votacao: sequelize.import(VotacaoModel),
    respostau: sequelize.import(RespostaUModel),
    votacaou: sequelize.import(VotacaoUModel)
    // add your other models here
  };

  Object.keys(global.models).forEach(modelName => {
    console.log(modelName);
    if (global.models[modelName].associate) {
      global.models[modelName].associate(global.models);
    }
  });

  // isso vai embora depois, só está aqui para popular o banco local sempre
  sequelize.sync({ force: true }).then(() => {
    sequelize
      .query(
        "copy temas FROM '/home/luizacs/Documentos/temas.csv' DELIMITER ',' CSV HEADER;"
      )
      .spread((results, metadata) => {
        console.log("Inserted temas");
      })
      .then(() => {
        sequelize
          .query(
            "copy perguntas FROM '/home/luizacs/Documentos/perguntas.csv' DELIMITER ',' CSV HEADER;"
          )
          .spread((results, metadata) => {
            console.log("Inserted perguntas");
          })
          .then(() => {
            sequelize
              .query(
                "copy candidatos FROM '/home/luizacs/Documentos/candidatos.csv' DELIMITER ',' CSV HEADER;"
              )
              .spread((results, metadata) => {
                console.log("Inserted candidatos");
              })
              .then(() => {
                sequelize
                  .query(
                    "copy votacoes FROM '/home/luizacs/Documentos/votacoes.csv' DELIMITER ',' CSV HEADER;"
                  )
                  .spread((results, metadata) => {
                    console.log("Inserted votacoes");
                  });

                sequelize
                  .query(
                    "copy respostas FROM '/home/luizacs/Documentos/respostas.csv' DELIMITER ',' CSV HEADER;"
                  )
                  .spread((results, metadata) => {
                    // Results will be an empty array and metadata will contain the number of affected rows.
                    console.log("Inserted respostas");
                  });
              });
          });
        sequelize
          .query(
            "copy proposicoes FROM '/home/luizacs/Documentos/proposicoes.csv' DELIMITER ',' CSV HEADER;"
          )
          .spread((results, metadata) => {
            console.log("Inserted proposicoes");
          });
      });
  });
}
module.exports = global.models;
