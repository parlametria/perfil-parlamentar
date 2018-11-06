module.exports = (sequelize, type) => {
  return sequelize.define("Usuario", {
    email: type.STRING,
    nome: type.STRING,
    id: {
      type: type.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  });
};
