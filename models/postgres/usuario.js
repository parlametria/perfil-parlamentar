module.exports = (sequelize, type) => {
  usuario = sequelize.define(
    "usuario",
    {
      first_name: type.STRING,
      full_name: type.STRING,
      email: type.STRING,
      photo: type.STRING,
      id: {
        type: type.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      provider: type.STRING,
      provider_id: type.STRING,
      token: type.STRING
    },
    {
      timestamps: false
    }
  );

  usuario.associate = function(models) {
    usuario.hasMany(models.respostau, {
      foreignKey: "user_id",
      as: "user_resp"
    }),
      usuario.hasMany(models.votacaou, {
        foreignKey: "user_id",
        as: "user_vot"
      });
  };

  return usuario;
};
