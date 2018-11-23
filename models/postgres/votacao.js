module.exports = (sequelize, type) => {
  return sequelize.define("votacoe", {
    user_id: type.INTEGER,
    resposta: type.INTEGER,
    proposicao_id: type.STRING
  });
};
