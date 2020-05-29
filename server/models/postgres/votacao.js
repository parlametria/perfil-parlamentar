module.exports = (sequelize, type) => {
  const votacao = sequelize.define(
    "votacoe",    
    {
      id_votacao: {
        type: type.STRING,
        primaryKey: true
      },
      id_proposicao: type.STRING,
      objeto_votacao: type.STRING,
      horario: type.DATE,
      codigo_sessao: type.INTEGER
    },
    {
      timestamps: false
    }
  );
  votacao.associate = function(models) {
    votacao.belongsTo(models.proposicao, {
      foreignKey: "id_proposicao",
      sourceKey: "id_proposicao",
      as: "proposicaoVotacoes"
    }),
    votacao.hasMany(models.voto, {
      foreignKey: "id_votacao",
      sourceKey: "id_votacao",
      as: "votacoesVoto"
    })
  };
  return votacao;
};
