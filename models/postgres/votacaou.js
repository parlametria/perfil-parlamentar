module.exports = (sequelize, type) => {
  const votacaou = sequelize.define(
    "votacoesu",
    {
      resposta: type.INTEGER
    },
    {
      timestamps: false
    }
  );
  votacaou.associate = function(models) {
    votacaou.belongsTo(models.proposicao, {
      foreignKey: "proposicao_id",
      as: "uvot_prop"
    }),
      votacaou.belongsTo(models.candidato, {
        foreignKey: "user_id",
        as: "user_vot"
      });
  };
  return votacaou;
};
