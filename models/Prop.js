module.exports = (sequelize, type) => {
  return sequelize.define("Proposicao", {
    proj_lei: type.STRING,
    titulo: type.STRING,
    descricao: type.STRING,
    id: {
      type: type.INTEGER,
      primaryKey: true
    }
  });
};
