module.exports = (sequelize, type) => {
  ligacoesEconomicas = sequelize.define(
    "ligacoes_economicas",
    {
      id_parlamentar_voz: {
        type: type.STRING,
        primaryKey: true
      },
      id_atividade_economica: {
        type: type.INTEGER,
        primaryKey: true
      },
      total_por_atividade: type.DECIMAL(15, 2),
      proporcao_doacao: type.REAL,
      indice_ligacao_atividade_economica: type.REAL
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );
  ligacoesEconomicas.associate = function (models) {
    ligacoesEconomicas.belongsTo(models.atividadesEconomicas, {
      foreignKey: "id_atividade_economica",
      sourceKey: "id_atividade_economica",
      as: "ligacaoAtividade"
    }),
    ligacoesEconomicas.belongsTo(models.parlamentar, {
        foreignKey: "id_parlamentar_voz",
        sourceKey: "id_parlamentar_voz",
        as: "ligacaoParlamentar"
      })
  };
  return ligacoesEconomicas;
};
