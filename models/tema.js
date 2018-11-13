module.exports = (sequelize, type) => {
  return sequelize.define("Tema", {
    tema: type.STRING,
    id: {
      type: type.INTEGER,
      primaryKey: true
    }
  });
};
