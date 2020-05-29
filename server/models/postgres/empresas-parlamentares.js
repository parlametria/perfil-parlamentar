module.exports = (sequelize, type) => {
  empresasParlamentares = sequelize.define(
    "empresas_parlamentares",
    {
      id_parlamentar_voz: {
        type: type.STRING,
        primaryKey: true
      },
      cnpj: {
        type: type.STRING,
        primaryKey: true
      },
      data_entrada_sociedade: type.DATE
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );
  empresasParlamentares.associate = function (models) {
    empresasParlamentares.belongsTo(models.empresas, {
      foreignKey: "cnpj",
      sourceKey: "cnpj",
      as: "empresasParlamentares"
    }),
    empresasParlamentares.belongsTo(models.parlamentar, {
        foreignKey: "id_parlamentar_voz",
        sourceKey: "id_parlamentar_voz",
        as: "parlamentaresEmpresas"
      })
  };
  return empresasParlamentares;
};
