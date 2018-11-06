module.exports = (sequelize, type) => {
  return sequelize.define("Pergunta", {
    titulo: type.STRING,
    descricao: type.STRING,
    tema_id: type.INTEGER,
    id: {
      type: type.INTEGER,
      primaryKey: true
    }
  });
};
