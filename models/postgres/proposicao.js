module.exports = (sequelize, type) => {
  return sequelize.define("proposicoe", {
    id: type.INTEGER,
    projeto_lei: type.STRING,
    id_votacao: {
      type: type.INTEGER,
      primaryKey: true
    },
    titulo: type.STRING,
    descricao: type.STRING(500),
    tema_id: type.INTEGER
  });
};
