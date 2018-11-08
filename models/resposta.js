module.exports = (sequelize, type) => {
  return sequelize.define("Resposta", {
    cpf: type.STRING,
    resposta: type.INTEGER,
    pergunta_id: type.INTEGER
  });
};
