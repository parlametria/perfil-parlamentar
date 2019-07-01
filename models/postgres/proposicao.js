module.exports = (sequelize, type) => {
  proposicao = sequelize.define(
    "proposicoe",
    {
      id_proposicao: {
        type: type.INTEGER,
        primaryKey: true
      },
      casa: type.STRING,
      projeto_lei: type.STRING,
      titulo: type.STRING,
      descricao: type.STRING(800),
      status_proposicao: type.STRING,
      status_importante: type.STRING,
    },
    {
      timestamps: false
    },    
  );
  proposicao.associate = function(models) {
    proposicao.hasMany(models.votacao, {
      foreignKey: "id_proposicao",
      targetKey: "id_proposicao",
      as: "vot_prop"
    }),
    proposicao.hasMany(models.proposicaoTemas, {
      foreignKey: "id_proposicao",
      as: "tema_prop"
    });
  };

  return proposicao;
};
