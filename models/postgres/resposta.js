module.exports = (sequelize, type) => {
  return sequelize.define("resposta", {
    cpf: type.STRING,
    resposta: type.INTEGER,
    pergunta_id: type.INTEGER
  });
};
