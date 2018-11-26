const Sequelize = require("sequelize");
const logger = require("heroku-logger");

// Models
const ProposicaoModel = "./postgres/proposicao.js";
const PerguntaModel = "./postgres/pergunta.js";
const CandidatoModel = "./postgres/candidato.js";
const TemaModel = "./postgres/tema.js";
const VotacaoModel = "./postgres/votacao.js";
const RespostaModel = "./postgres/resposta.js";

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
    sequelize
      .query(
        "copy respostas FROM '/home/luizacs/Documentos/respostas.csv' DELIMITER ',' CSV HEADER;"
      )
      .spread((results, metadata) => {
        // Results will be an empty array and metadata will contain the number of affected rows.
        console.log("Inserted respostas");
      })
      .then(res => {
        sequelize.query(
          "ALTER TABLE perguntas ADD CONSTRAINT tema_pergunta FOREIGN KEY (tema_id) REFERENCES temas (id); ALTER TABLE proposicoes ADD CONSTRAINT tema_proposicoes FOREIGN KEY (tema_id) REFERENCES temas (id); ALTER TABLE votacoes ADD CONSTRAINT votacoes_proposicoes FOREIGN KEY (proposicao_id) REFERENCES proposicoes (id_votacao); ALTER TABLE respostas ADD CONSTRAINT cpf_respostas FOREIGN KEY (cpf) REFERENCES candidatos (cpf);ALTER TABLE respostas ADD CONSTRAINT perguntas_respostas FOREIGN KEY (pergunta_id) REFERENCES perguntas (id); ALTER TABLE votacoes ADD CONSTRAINT cpf_votacoes FOREIGN KEY (cpf) REFERENCES candidatos (cpf);"
        );
      });

    sequelize
      .query(
        "copy candidatos FROM '/home/luizacs/Documentos/candidatos.csv' DELIMITER ',' CSV HEADER;"
      )
      .spread((results, metadata) => {
        console.log("Inserted candidatos");
      });
    sequelize
      .query(
        "copy votacoes FROM '/home/luizacs/Documentos/votacoes.csv' DELIMITER ',' CSV HEADER;"
      )
      .spread((results, metadata) => {
        console.log("Inserted votacoes");
      });

    sequelize
      .query(
        "copy temas FROM '/home/luizacs/Documentos/temas.csv' DELIMITER ',' CSV HEADER;"
      )
      .spread((results, metadata) => {
        console.log("Inserted temas");
      });
    sequelize
      .query(
        "copy perguntas FROM '/home/luizacs/Documentos/perguntas.csv' DELIMITER ',' CSV HEADER;"
      )
      .spread((results, metadata) => {
        console.log("Inserted perguntas");
      });
    sequelize
      .query(
        "copy proposicoes FROM '/home/luizacs/Documentos/proposicoes.csv' DELIMITER ',' CSV HEADER;"
      )
      .spread((results, metadata) => {
        console.log("Inserted proposicoes");
      });
  });
}
module.exports = global.models;
