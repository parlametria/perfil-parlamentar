module.exports = (sequelize, type) => {
  return sequelize.define("Tema", {
    id: {
      type: type.INTEGER,
      primaryKey: true
    },
    nome: type.STRING
  });
};
