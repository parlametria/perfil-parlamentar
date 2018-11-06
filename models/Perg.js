module.exports = (sequelize, type) => {
  return sequelize.define("Pergunta", {
    titulo: type.STRING,
    descricao: type.STRING,
    id: {
      type: type.INTEGER,
      primaryKey: true
    }
  });
};