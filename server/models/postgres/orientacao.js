module.exports = (sequelize, type) => {
  const orientacao = sequelize.define(
    "orientacoe",
    {
      id_votacao: {
        type: type.STRING,
        primaryKey: true
      },
      id_partido: {
        type: type.STRING,
        primaryKey: true
      },
      voto: type.INTEGER
    },
    {
      timestamps: false
    }
  );
  orientacao.associate = function (models) {
    orientacao.belongsTo(models.votacao, {
      foreignKey: "id_votacao",
      sourceKey: "id_votacao",
      as: "votacoesVoto"
    }),
    orientacao.belongsTo(models.partido, {
        foreignKey: "id_partido",
        sourceKey: "id_partido",
        as: "orientacoes"
      });
  };
  return orientacao;
};
