module.exports = (sequelize, type) => {
  cargosMesa = sequelize.define(
    "cargos_mesa",
    {
      id_parlamentar_voz: {
        type: type.STRING,
        primaryKey: true
      },
      casa: type.STRING,
      cargo: type.STRING
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );
  cargosMesa.associate = function (models) {
    cargosMesa.belongsTo(models.parlamentar, {
      foreignKey: "id_parlamentar_voz",
      sourceKey: "id_parlamentar_voz",
      as: "cargosMesaParlamentar"
    })
  };
  return cargosMesa;
};