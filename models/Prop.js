module.exports = (sequelize, type) => {
  return sequelize.define("Proposicao", {
    proj_lei: type.STRING,
    titulo: type.STRING,
    descricao: type.STRING,
    tema_id: type.INTEGER,
    id_votacao: {
      type: type.INTEGER,
      primaryKey: true
    }
  });
};
