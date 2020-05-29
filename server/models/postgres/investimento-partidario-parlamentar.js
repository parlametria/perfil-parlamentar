module.exports = (sequelize, type) => {
    investimentoPartidarioParlamentar = sequelize.define(
      "investimento_partidario_parlamentar",
      {
        id_parlamentar_voz: {
          type: type.STRING,
          primaryKey: true
        },
        id_partido_atual: type.INTEGER,
        id_partido_eleicao: type.INTEGER,
        total_receita_partido: type.DECIMAL(15, 2),
        total_receita_candidato: type.DECIMAL(15, 2),
        indice_investimento_partido: type.REAL
      },
      {
        timestamps: false,
        freezeTableName: true
      }
    );
    investimentoPartidarioParlamentar.associate = function (models) {
        investimentoPartidarioParlamentar.belongsTo(models.parlamentar, {
        foreignKey: "id_parlamentar_voz",
        sourceKey: "id_parlamentar_voz",
        as: "parlamentarInvestimento"
      }),
      investimentoPartidarioParlamentar.belongsTo(models.partido, {
          foreignKey: "id_partido_atual",
          targetKey: "id_partido",
          as: "partidoAtual"
        }),
        investimentoPartidarioParlamentar.belongsTo(models.partido, {
          foreignKey: "id_partido_eleicao",
          targetKey: "id_partido",
          as: "partidoEleicao"
        })
    };
    return investimentoPartidarioParlamentar;
  };  
  