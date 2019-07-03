module.exports = (sequelize, type) => {
  const votacao = sequelize.define(
    "votacoe",    
    {
      id_votacao: {
        type: type.STRING,
        primaryKey: true
      },
      id_id_proposicao: type.STRING
    },
    {
      timestamps: false
    }
  );
  votacao.associate = function(models) {
    votacao.belongsTo(models.proposicao, {
      foreignKey: "id_proposicao",
      sourceKey: "id_proposicao",
      as: "votProp"
    })
  };
  return votacao;
};
