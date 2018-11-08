module.exports = (sequelize, type) => {
  return sequelize.define("Votacao", {
    user_id: type.INTEGER,
    resposta: type.INTEGER,
    proposicao_id: type.STRING
  });
};
