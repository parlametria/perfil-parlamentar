module.exports = (sequelize, type) => {
  lideranca = sequelize.define(
    "lideranca",
    {
      id_parlamentar_voz: {
        type: type.STRING,
        primaryKey: true
      },
      id_partido: {
        type: type.STRING,
        primaryKey: true
      },
      cargo: type.STRING,
      casa: type.STRING
    },
    {
      timestamps: false
    }
  );
  lideranca.associate = function (models) {
    lideranca.belongsTo(models.parlamentar, {
      foreignKey: "id_parlamentar_voz",
      sourceKey: "id_parlamentar_voz",
      as: "liderancaParlamentar"
    }),
    lideranca.belongsTo(models.partido, {
      foreignKey: "id_partido",
      sourceKey: "id_partido",
      as: "liderancaPartido"
    })  
  };
  return lideranca;
};
