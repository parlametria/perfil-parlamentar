module.exports = (sequelize, type) => {
  return sequelize.define("Resposta", {
    resposta: type.INTEGER
  });
};
