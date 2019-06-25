module.exports = (sequelize, type) => {
  composicaoComissoes = sequelize.define(
    "composicao_comissoe",
    {
      id_comissao_voz: {
        type: type.STRING,
        primaryKey: true
      },
      id_parlamentar_voz: {
        type: type.STRING,
        primaryKey: true
      },
      cargo: type.STRING,
      situacao: type.STRING
    },
    {
      timestamps: false
    }
  );
  composicaoComissoes.associate = function (models) {
    composicaoComissoes.belongsTo(models.comissoes, {
      foreignKey: "id_comissao_voz",
      sourceKey: "id_comissao_voz",
      as: "infoComissao"
    }),
    composicaoComissoes.belongsTo(models.parlamentar, {
      foreignKey: "id_parlamentar_voz",
      sourceKey: "id_parlamentar_voz",
      as: "comissaoParlamentar"
    })  
  };
  return composicaoComissoes;
};
