module.exports = (sequelize, type) => {
  return sequelize.define("Proposicao", {
    id: {
      type: type.INTEGER,
      primaryKey: true
    },
    projeto_lei: type.STRING,
    id_votacao: type.INTEGER,
    titulo: type.STRING,
    descricao: type.STRING,
    tema_id: type.INTEGER
  });
};
