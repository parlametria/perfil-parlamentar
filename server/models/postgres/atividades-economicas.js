module.exports = (sequelize, type) => {
  atividadesEconomicas = sequelize.define(
    "atividades_economicas",
    {
      id_atividade_economica: {
        type: type.INTEGER,
        primaryKey: true
      },
      nome: type.STRING
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );
  atividadesEconomicas.associate = function (models) {
    atividadesEconomicas.hasMany(models.ligacoesEconomicas, {
      foreignKey: "id_atividade_economica",
      targetKey: "id_atividade_economica",
      as: "parlamentarLigacoes"
    }),
    atividadesEconomicas.hasMany(models.atividadesEconomicasEmpresas, {
      foreignKey: "id_atividade_economica",
      targetKey: "id_atividade_economica",
      as: "atividadesEconomicasEmpresas"
    })
  };
  return atividadesEconomicas;
};
