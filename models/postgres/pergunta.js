module.exports = (sequelize, type) => {
  return sequelize.define("perguntas", {
    texto: type.STRING,
    id: {
      type: type.INTEGER,
      primaryKey: true
    },
    tema_id: type.INTEGER
  });
};
