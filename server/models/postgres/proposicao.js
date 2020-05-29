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
      as: "proposicaoVotacoes"
    }),
    proposicao.belongsToMany(models.tema,  {
      through: {
        model: models.proposicaoTemas,
        unique: false
      },
      foreignKey: 'id_proposicao'
    });
  };

  return proposicao;
};
