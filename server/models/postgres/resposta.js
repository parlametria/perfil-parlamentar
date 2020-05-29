module.exports = (sequelize, type) => {
  resposta = sequelize.define(
    "respostas",
    {
      resposta: type.INTEGER
    },
    {
      timestamps: false
    }
  );
  resposta.associate = function(models) {
    resposta.belongsTo(models.pergunta, {
      foreignKey: "pergunta_id",
      as: "perg_resp"
    }),
      resposta.belongsTo(models.candidato, {
        foreignKey: "cpf",
        as: "cpf_resp"
      });
  };
  return resposta;
};
