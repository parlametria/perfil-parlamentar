module.exports = (sequelize, type) => {
  lideranca = sequelize.define(
    "lideranca",
    {
      id_parlamentar_voz: {
        type: type.STRING,
        primaryKey: true
      },
      cargo: type.STRING,
      bloco_partido: {
        type: type.STRING,
        primaryKey: true
      }
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
    })  
  };
  return lideranca;
};
