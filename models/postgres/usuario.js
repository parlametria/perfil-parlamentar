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

  usuario.upsertGoogleUser = function(
    accessToken,
    refreshToken,
    profile,
    respostas,
    cb
  ) {
    const that = this;
    return this.findOne({
      procider: "google",
      provider_id: profile.id
    }).then((user, err) => {
      // no user was found, lets create a new one
      if (!user) {
        const newUser = new that({
          first_name: profile.displayName.split(" ")[0],
          full_name: profile.displayName,
          email: profile.emails[0].value,
          photo: profile._json.picture,
          provider: "google",
          provider_id: profile.id,
          token: accessToken
        });
        newUser.save().then((savedUser, error) => {
          if (error) {
            console.log(error);
          }
          return cb(savedUser, error);
        });
      } else {
        return cb(user, err);
      }
    });
  };

  usuario.upsertFbUser = function(
    accessToken,
    refreshToken,
    profile,
    respostas,
    cb
  ) {
    const that = this;
    return this.findOne({
      provider: "facebook",
      provider_id: profile.id
    }).then((user, err) => {
      // no user was found, lets create a new one
      if (!user) {
        const newUser = new that({
          firstName: profile.displayName.split(" ")[0],
          fullName: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value,
          provider: "facebook",
          provider_id: profile.id,
          token: accessToken
        });

        newUser.save().then((savedUser, error) => {
          if (error) {
            console.log(error);
          }
          return cb(savedUser, error);
        });
      } else {
        return cb(user, err);
      }
    });
  };

  return usuario;
};
