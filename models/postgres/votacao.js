module.exports = (sequelize, type) => {
  return sequelize.define("votacoe", {
    cpf: type.STRING,
    resposta: type.INTEGER,
    proposicao_id: type.STRING
  });
};
