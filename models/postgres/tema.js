module.exports = (sequelize, type) => {
  const tema = sequelize.define(
    "tema",
    {
      tema: type.STRING,
      id: {
        type: type.INTEGER,
        primaryKey: true
      },
      slug: type.STRING
    },    
    {
      timestamps: false
    }
  );

  tema.associate = function(models) {
    tema.hasMany(models.pergunta, {
      foreignKey: "tema_id",
      as: "tema_perg"
    }),
    tema.hasMany(models.proposicaoTemas, {
      foreignKey: "id_tema",
      as: "temas_tema"
    });
  };
  return tema;
};
