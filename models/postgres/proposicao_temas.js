module.exports = (sequelize, type) => {
  proposicao_tema = sequelize.define(
    "proposicoes_tema",
    {
      id_proposicao: {
        type: type.INTEGER,
        primaryKey: true
      },
      id_tema: {
        type: type.INTEGER,
        primaryKey: true
      },
    },
    {
      timestamps: false
    },    
  );
  proposicao_tema.associate = function(models) {
    proposicao_tema.belongsTo(models.proposicao, {
      foreignKey: "id_proposicao",
      sourceKey: "id_proposicao",
      as: "tema_prop"
    }),
    proposicao_tema.belongsTo(models.tema, {
      foreignKey: "id_tema",
      sourceKey: "id_tema",
      as: "temas_tema"
    })
  };

  return proposicao_tema;
};
