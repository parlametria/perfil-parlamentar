module.exports = (sequelize, type) => {
  const votacao = sequelize.define(
    "votacoe",    
    {
      id_votacao: {
        type: type.STRING,
        primaryKey: true
      },
      id_parlamentar_voz: {
        type: type.STRING,
        primaryKey: true
      },
      voto: type.INTEGER
    },
    {
      timestamps: false
    }
  );
  votacao.associate = function(models) {
    votacao.belongsTo(models.proposicao, {
      foreignKey: "id_proposicao",
      sourceKey: "id_proposicao",
      as: "vot_prop"
    }),
      votacao.belongsTo(models.parlamentar, {
        foreignKey: "id_parlamentar_voz",
        sourceKey: "id_parlamentar_voz",
        as: "votacoes"
      });
  };
  return votacao;
};
