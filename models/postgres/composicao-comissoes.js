module.exports = (sequelize, type) => {
  composicaoComissoes = sequelize.define(
    "composicao_comissoe",
    {
      comissao_id: {
        type: type.STRING,
        primaryKey: true
      },
      parlamentar_cpf: {
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
      foreignKey: "comissao_id",
      sourceKey: "id",
      as: "info_comissao"
    }),
    composicaoComissoes.belongsTo(models.candidato, {
      foreignKey: "parlamentar_cpf",
      sourceKey: "cpf",
      as: "comissao_cpf"
    })  
  };
  return composicaoComissoes;
};
