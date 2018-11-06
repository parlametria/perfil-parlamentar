module.exports = (sequelize, type) => {
  return sequelize.define("Usuario", {
    email: type.STRING,
    nome: type.STRING,
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  });
};
