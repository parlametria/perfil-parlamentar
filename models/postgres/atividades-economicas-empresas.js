module.exports = (sequelize, type) => {
  atividadesEconomicasEmpresas = sequelize.define(
    "atividades_economicas_empresas",
    {
      id_atividade_economica: {
        type: type.INTEGER,
        primaryKey: true
      },
      cnpj: {
        type: type.STRING,
        primaryKey: true
      },
      cnae_tipo: type.DATE
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );
  atividadesEconomicasEmpresas.associate = function (models) {
    atividadesEconomicasEmpresas.belongsTo(models.empresas, {
      foreignKey: "cnpj",
      sourceKey: "cnpj",
      as: "empresaAtividadeEconomica"
    }),
    atividadesEconomicasEmpresas.belongsTo(models.atividadesEconomicas, {
        foreignKey: "id_atividade_economica",
        sourceKey: "id_atividade_economica",
        as: "atividadeEconomicaEmpresa"
      })
  };
  return atividadesEconomicasEmpresas;
};
