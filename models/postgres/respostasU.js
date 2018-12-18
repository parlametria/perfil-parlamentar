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
    respostau.belongsTo(models.pergunta, {
      foreignKey: "pergunta_id",
      as: "uperg_resp"
    }),
      respostau.belongsTo(models.usuario, {
        foreignKey: "user_id",
        as: "user_resp"
      });
  };
  return respostau;
};
