module.exports = (sequelize, type) => {
  const votacao = sequelize.define(
    "votacoe",
    {
      resposta: type.INTEGER
    },
    {
      timestamps: false
    }
  );
  votacao.associate = function(models) {
    votacao.belongsTo(models.proposicao, {
      foreignKey: "proposicao_id",
      as: "vot_prop"
    }),
      votacao.belongsTo(models.candidato, {
        foreignKey: "cpf",
        as: "cpf_vot"
      });
  };
  return votacao;
};
