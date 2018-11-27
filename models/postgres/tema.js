module.exports = (sequelize, type) => {
  const tema = sequelize.define(
    "tema",
    {
      tema: type.STRING,
      id: {
        type: type.INTEGER,
        primaryKey: true
      }
    },
    {
      timestamps: false
    }
  );

  tema.associate = function(models) {
    tema.hasMany(models.pergunta, {
      foreignKey: "tema_id",
      as: "id_tema_perg"
    }),
      tema.hasMany(models.proposicao, {
        foreignKey: "tema_id",
        as: "id_tema_prop"
      });
  };
  return tema;
};
