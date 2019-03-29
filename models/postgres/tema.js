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
      tema.hasMany(models.proposicao, {
        foreignKey: "tema_id",
        targetKey: "id",
        as: "prop_tema",        
      });
  };
  return tema;
};
