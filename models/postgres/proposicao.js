module.exports = (sequelize, type) => {
  proposicao = sequelize.define(
    "proposicoe",
    {
      id: type.INTEGER,
      projeto_lei: type.STRING,
      id_votacao: {
        type: type.INTEGER,
        primaryKey: true
      },
      titulo: type.STRING,
      descricao: type.STRING(500)
    },
    {
      timestamps: false
    }
  );
  proposicao.associate = function(models) {
    proposicao.belongsTo(models.tema, {
      foreignKey: "tema_id",
      as: "id_tema_prop"
    }),
      proposicao.hasMany(models.votacao, {
        foreignKey: "proposicao_id",
        as: "id_vot_prop"
      });
  };

  return proposicao;
};
