module.exports = (sequelize, type) => {
  investimentoPartidario = sequelize.define(
    "investimento_partidario",
    {
      id_partido: {
        type: type.STRING,
        primaryKey: true
      },
      uf: {
        type: type.STRING,
        primaryKey: true
      },
      esfera: {
        type: type.STRING,
        primaryKey: true
      },
      valor: type.DECIMAL(15, 2),
      numero_candidatos: type.INTEGER
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );
  investimentoPartidario.associate = function (models) {
    investimentoPartidario.belongsTo(models.partido, {
      foreignKey: "id_partido",
      targetKey: "id_partido",
      as: "partidoInvestimento"
    })
  };
  return investimentoPartidario;
};  
