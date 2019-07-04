module.exports = (sequelize, type) => {
  const tema = sequelize.define(
    "tema",
    {
      tema: type.STRING,
      id_tema: {
        type: type.INTEGER,
        primaryKey: true
      },
      slug: type.STRING,
      ativo: type.BOOLEAN
    },    
    {
      timestamps: false
    },
  );

  tema.associate = function(models) {
    tema.hasMany(models.pergunta, {
      foreignKey: "tema_id",
      as: "tema_perg"
    }),
    tema.belongsToMany(models.proposicao, {
      through: {
        model: models.proposicaoTemas,
        unique: false
      },
      foreignKey: 'id_tema'
    }),
    tema.belongsTo(models.aderencia, {
      foreignKey: "id_tema",
      sourceKey: "id_tema",
      as: "aderenciaTema"
    });
  };
  return tema;
};
