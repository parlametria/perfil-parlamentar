module.exports = (sequelize, type) => {
  return sequelize.define("tema", {
    tema: type.STRING,
    id: {
      type: type.INTEGER,
      primaryKey: true
    }
  });
};
