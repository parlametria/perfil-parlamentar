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

    const messageError = "Não foi possível atualizar os temas";

    return this.findOne({
      where: {
        usuario_id: usuario_id
      }
    }).then((temas) => {
      if (!temas) {
        const novosTemas = new that({
          usuario_id: usuario_id,
          temas_preferidos: temas_usuario
        });

        novosTemas.save().then((savedTemas, error) => {
          return cb(savedTemas, error);
        }).catch(error => {
          let customError = {
            message: messageError,
            error: error.message
          }
          return cb(false, customError)
        });

      } else {
        temas.update({ temas_preferidos: temas_usuario }).then((updatedTemas, error) => {
          return cb(updatedTemas, error);
        }).catch(error => {
          let customError = {
            message: messageError,
            error: error.message
          }
          return cb(false, customError)
        });
      }

    }).catch(error => {
      let customError = {
        message: messageError,
        error: error.message
      }
      return cb(false, customError)
    });
  };

  return temasu;
};
