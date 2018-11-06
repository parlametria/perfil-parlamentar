// Imports
const Sequelize = require("sequelize");
const logger = require("heroku-logger");

// Models
const ProposicaoModel = require("./models/Prop");
const PerguntaModel = require("./models/Perg");
const CandidatoModel = require("./models/Cand");
const UsuarioModel = require("./models/Usuario");

// DB Config
const db = require("./config/keys").postgresURI;

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

const Usuario = UsuarioModel(sequelize, Sequelize);
const Candidato = CandidatoModel(sequelize, Sequelize);
const Pergunta = PerguntaModel(sequelize, Sequelize);
const Proposicao = ProposicaoModel(sequelize, Sequelize);

//Usuario.belongsTo(Aluno);
//Aluno.hasMany(Disciplina, { as: "disciplinas" });
//Aluno.hasMany(AtividadeComplementar, { as: "atividadesComplementares" });

// sequelize.sync({ force: true }).then(() => {
//   logger.info(`Database & tables created!`);
// });

module.exports = {
  Usuario,
  Candidato,
  Pergunta,
  Proposicao
};
