module.exports = (sequelize, type) => {
  return sequelize.define("Votacao", {
    resposta: type.INTEGER
  });
};
