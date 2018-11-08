module.exports = (sequelize, type) => {
  return sequelize.define("Pergunta", {
    texto: type.STRING,
    id: {
      type: type.INTEGER,
      primaryKey: true
    },
    tema_id: type.INTEGER
  });
};
