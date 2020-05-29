module.exports = (sequelize, type) => {
  const voto = sequelize.define(
    "voto",    
    {
      id_votacao: {
        type: type.STRING,
        primaryKey: true
      },
      id_parlamentar_voz: {
        type: type.STRING,
        primaryKey: true
      },
      voto: type.INTEGER
    },
    {
      timestamps: false
    }
  );
  voto.associate = function(models) {
    voto.belongsTo(models.votacao, {
      foreignKey: "id_votacao",
      sourceKey: "id_votacao",
      as: "votacoesVoto"
    }),
    voto.belongsTo(models.parlamentar, {
        foreignKey: "id_parlamentar_voz",
        sourceKey: "id_parlamentar_voz",
        as: "votos"
      });
  };
  return voto;
};
