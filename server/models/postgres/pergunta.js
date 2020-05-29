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

  pergunta.associate = function (models) {
    pergunta.belongsTo(models.tema, {
      foreignKey: "tema_id",
      as: "tema_perg",
      targetKey: "id_tema"
    }),
    pergunta.hasMany(models.resposta, {
      foreignKey: "pergunta_id",
      as: "perg_resp"
    }),
    pergunta.hasMany(models.respostau, {
      foreignKey: "pergunta_id",
      as: "uperg_resp"
    }),
    pergunta.hasMany(models.votacao, {
      foreignKey: "id_proposicao",
      as: "votProp"
    })
  };
  return pergunta;
};
