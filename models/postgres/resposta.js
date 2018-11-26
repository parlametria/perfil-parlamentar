module.exports = (sequelize, type) => {
  return sequelize.define("respostas", {
    cpf: type.STRING,
    resposta: type.INTEGER,
    pergunta_id: type.INTEGER
  });
};
