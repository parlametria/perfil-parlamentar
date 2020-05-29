module.exports = (sequelize, type) => {
    perfilMais = sequelize.define(
      "perfil_mais",
      {
        id_parlamentar_voz: {
          type: type.STRING,
          primaryKey: true
        },
        indice_vinculo_economico_agro: type.REAL,
        indice_ativismo_ambiental: type.REAL,
        peso_politico: type.REAL
      },
      {
        timestamps: false,
        freezeTableName: true
      }
    );
    perfilMais.associate = function (models) {
      perfilMais.belongsTo(models.parlamentar, {
        foreignKey: "id_parlamentar_voz",
        sourceKey: "id_parlamentar_voz",
        as: "perfilMaisParlamentar"
      })
    };
    return perfilMais;
  };
  