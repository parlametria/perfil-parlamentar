module.exports = (sequelize, type) => {
    mandato = sequelize.define(
      "mandato",
      {
        id_mandato_voz: {
          type: type.STRING,
          primaryKey: true
        },
        id_parlamentar_voz: type.STRING,
        ano_eleicao: type.INTEGER,
        num_turno: type.INTEGER,
        cargo: type.STRING,
        unidade_eleitoral: type.STRING,
        uf_eleitoral: type.STRING,
        situacao_candidatura: type.STRING,
        situacao_totalizacao_turno: type.STRING,
        id_partido: type.INTEGER,
        votos: type.INTEGER
      },
      {
        timestamps: false
      }
    );
    mandato.associate = function (models) {
      mandato.belongsTo(models.parlamentar, {
        foreignKey: "id_parlamentar_voz",
        sourceKey: "id_parlamentar_voz",
        as: "mandatoParlamentar"
      }),
      mandato.belongsTo(models.partido, {
        foreignKey: "id_partido",
        sourceKey: "id_partido",
        as: "mandatoPartido"
      })  
    };
    return mandato;
  };
