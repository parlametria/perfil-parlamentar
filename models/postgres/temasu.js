module.exports = (sequelize, type) => {
  const temasu = sequelize.define(
    "temasu",
    {
      temas_preferidos: type.ARRAY(type.TEXT)
    },
    {
      timestamps: false
    }
  );
  temasu.associate = function (models) {
    temasu.belongsTo(models.usuario, {
      foreignKey: "usuario_id",
      targetKey: "id",      
      as: "temas_user"
    });
  };

  temasu.upsertTemas = function (usuario_id, temas_usuario, cb) {
    const that = this;

    return this.findOne({
      where: {
        usuario_id: usuario_id
      }
    }).then((temas, err) => {
      if (!temas) {
        const novosTemas = new that({
          usuario_id: usuario_id,
          temas_preferidos: temas_usuario
        });

        novosTemas.save().then((savedTemas, error) => {
          if (error) {
            console.log(error);
          }
          return cb(savedTemas, error);
        });

      } else {
        temas.update({ temas_preferidos: temas_usuario });
        return cb(temas, err);
      }
    });
  };

  return temasu;
};
