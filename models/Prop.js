module.exports = (sequelize, type) => {
  return sequelize.define("Proposicao", {
    id: type.INTEGER,
    projeto_lei: type.STRING,
    id_votacao: {
      type: type.INTEGER,
      primaryKey: true
    },
    titulo: type.STRING,
    descricao: type.STRING,
    tema_id: type.INTEGER
  });
};
