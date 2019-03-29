module.exports = (sequelize, type) => {
  proposicao = sequelize.define(
    "proposicoe",
    {
      projeto_lei: type.STRING,
      id_votacao: {
        type: type.INTEGER,
        primaryKey: true
      },
      titulo: type.STRING,
      descricao: type.STRING(800),
      status_proposicao: type.STRING
    },
    {
      timestamps: false
    },    
  );
  proposicao.associate = function(models) {
    proposicao.belongsTo(models.tema, {
      foreignKey: "tema_id",
      sourceKey: "id",
      as: "tema_prop"
    }),
      proposicao.hasMany(models.votacao, {
        foreignKey: "proposicao_id",
        as: "vot_prop"
      }),
      proposicao.hasMany(models.votacaou, {
        foreignKey: "proposicao_id",
        as: "uvot_prop"
      });
  };

  return proposicao;
};
