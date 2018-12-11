module.exports = (sequelize, type) => {
  respostau = sequelize.define(
    "respostasu",
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
      as: "uperg_resp"
    }),
      resposta.belongsTo(models.usuario, {
        foreignKey: "user_id",
        as: "user_resp"
      });
  };
  return respostau;
};
