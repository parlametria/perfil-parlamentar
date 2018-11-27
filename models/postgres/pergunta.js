module.exports = (sequelize, type) => {
  const pergunta = sequelize.define(
    "perguntas",
    {
      texto: type.STRING(500),
      id: {
        type: type.INTEGER,
        primaryKey: true
      }
    },
    {
      timestamps: false
    }
  );

  pergunta.associate = function(models) {
    pergunta.belongsTo(models.tema, {
      foreignKey: "tema_id",
      as: "id_tema_perg"
    }),
      pergunta.hasMany(models.resposta, {
        foreignKey: "pergunta_id",
        as: "id_perg_resp"
      });
  };
  return pergunta;
};
