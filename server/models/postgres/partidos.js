module.exports = (sequelize, type) => {
  partido = sequelize.define(
    "partido",
    {
      id_partido: {
        type: type.INTEGER,
        primaryKey: true
      },
      sigla: type.STRING,
      tipo: type.STRING,
      situacao: type.STRING
    },
    {
      timestamps: false
    }
  );
  partido.associate = function (models) {
    partido.hasMany(models.parlamentar, {
      foreignKey: "id_partido",
      targetKey: "id_partido",
      as: "parlamentarPartido"
    }),
    partido.hasMany(models.liderancas, {
      foreignKey: "id_partido",
      targetKey: "id_partido",
      as: "liderancaPartido"
    }),
    partido.hasMany(models.aderencia, {
      foreignKey: "id_partido",
      sourceKey: "id_partido",
      as: "partido"
    }),
    partido.hasMany(models.orientacao, {
      foreignKey: "id_partido",
      targetKey: "id_partido",
      as: "orientacoes"
    }),
    partido.hasMany(models.investimentoPartidario, {
      foreignKey: "id_partido",
      targetKey: "id_partido_atual",
      as: "investimentoPartido"
    }),
    partido.hasMany(models.investimentoPartidarioParlamentar, {
      foreignKey: "id_partido",
      targetKey: "id_partido_atual",
      as: "investimentoPartidoAtual"
    }),
    partido.hasMany(models.investimentoPartidarioParlamentar, {
      foreignKey: "id_partido",
      targetKey: "id_partido_eleicao",
      as: "investimentoPartidoEleicao"
    })
  };
  return partido;
};
