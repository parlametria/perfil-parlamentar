const Sequelize = require("sequelize");
const logger = require("heroku-logger");

// Models
const ProposicaoModel = "./postgres/proposicao.js";
const PerguntaModel = "./postgres/pergunta.js";
const CandidatoModel = "./postgres/candidato.js";
const ParlamentarModel = "./postgres/parlamentar.js";
const TemaModel = "./postgres/tema.js";
const VotacaoModel = "./postgres/votacao.js";
const VotacaoUModel = "./postgres/votacaou.js";
const RespostaModel = "./postgres/resposta.js";
const RespostaUModel = "./postgres/respostasU.js";
const UsuarioModel = "./postgres/usuario.js";
const TemasUModel = "./postgres/temasu.js";
const ComissoesModel = "./postgres/comissoes.js";
const ComposicaoComissoesModel = "./postgres/composicao-comissoes.js";
const AderenciaModel = "./postgres/aderencia.js"
const LiderancasModel = "./postgres/liderancas.js";
const ProposicaoTemasModel = "./postgres/proposicao_temas.js";
const PartidoModel = "./postgres/partidos.js";
const VotoModel = './postgres/voto.js';
const OrientacaoModel = './postgres/orientacao.js';
const PerfilMaisModel = './postgres/perfil-mais.js';
const investimentoPartidarioParlamentarModel = './postgres/investimento-partidario-parlamentar.js';
const investimentoPartidarioModel = './postgres/investimento-partidario.js';
const atividadesEconomicasModel = './postgres/atividades-economicas.js';
const ligacoesEconomicasModel = './postgres/ligacoes-economicas.js';
const empresasModel = './postgres/empresas.js';
const empresasParlamentaresModel = './postgres/empresas-parlamentares.js';
const atividadesEconomicasEmpresasModel = './postgres/atividades-economicas-empresas.js';

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
    parlamentar: sequelize.import(ParlamentarModel),
    pergunta: sequelize.import(PerguntaModel),
    proposicao: sequelize.import(ProposicaoModel),
    resposta: sequelize.import(RespostaModel),
    votacao: sequelize.import(VotacaoModel),
    respostau: sequelize.import(RespostaUModel),
    votacaou: sequelize.import(VotacaoUModel),
    temasu: sequelize.import(TemasUModel),
    comissoes: sequelize.import(ComissoesModel),
    composicaoComissoes: sequelize.import(ComposicaoComissoesModel),
    aderencia: sequelize.import(AderenciaModel),
    liderancas: sequelize.import(LiderancasModel),
    proposicaoTemas: sequelize.import(ProposicaoTemasModel),
    partido: sequelize.import(PartidoModel),
    voto: sequelize.import(VotoModel),
    orientacao: sequelize.import(OrientacaoModel),
    perfilMais: sequelize.import(PerfilMaisModel),
    investimentoPartidarioParlamentar: sequelize.import(investimentoPartidarioParlamentarModel),
    investimentoPartidario: sequelize.import(investimentoPartidarioModel),
    atividadesEconomicas: sequelize.import(atividadesEconomicasModel),
    ligacoesEconomicas: sequelize.import(ligacoesEconomicasModel),
    empresas: sequelize.import(empresasModel),
    empresasParlamentares: sequelize.import(empresasParlamentaresModel),
    atividadesEconomicasEmpresas: sequelize.import(atividadesEconomicasEmpresasModel)
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
  // Retorna campos do tipo decimal como float e não como string
  Sequelize.postgres.DECIMAL.parse = function (value) { return parseFloat(value); };
}
module.exports = global.models;
