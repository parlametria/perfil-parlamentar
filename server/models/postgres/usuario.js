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

  usuario.associate = function (models) {
    usuario.hasMany(models.respostau, {
      foreignKey: "user_id",
      as: "user_resp"
    }),
      usuario.hasMany(models.votacaou, {
        foreignKey: "user_id",
        as: "user_vot"
      }),
      usuario.hasMany(models.temasu, {        
        foreignKey : "usuario_id",        
        as : "user_temas"
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
      where: {
        provider: "google",
        provider_id: profile.id
      }
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
        const vozAtiva = respostas.vozAtiva;
        const votacoes = respostas.votacoes;

        newUser.save().then((savedUser, error) => {
          if (error) {
            console.log(error);
          }
          Object.keys(votacoes).forEach(function(key) {
            const newVot = new models.votacaou({
              proposicao_id: key,
              user_id: savedUser.id,
              resposta: votacoes[key]
            });
            newVot.save();
          });

          Object.keys(vozAtiva).forEach(function(key) {
            const newPerg = new models.respostau({
              pergunta_id: key,
              user_id: savedUser.id,
              resposta: vozAtiva[key]
            });
            newPerg.save();
          });

          savedUser = savedUser.get({ plain: true });
          return cb(savedUser, error);
        });
      } else {
        user = user.get({ plain: true });
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
      where: {
        provider: "facebook",
        provider_id: profile.id
      }
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
        const vozAtiva = respostas.vozAtiva;
        const votacoes = respostas.votacoes;

        newUser.save().then((savedUser, error) => {
          if (error) {
            console.log(error);
          }
          Object.keys(votacoes).forEach(function(key) {
            const newVot = new models.votacaou({
              proposicao_id: key,
              user_id: savedUser.id,
              resposta: votacoes[key]
            });
            newVot.save();
          });

          Object.keys(vozAtiva).forEach(function(key) {
            const newPerg = new models.respostau({
              pergunta_id: key,
              user_id: savedUser.id,
              resposta: vozAtiva[key]
            });
            newPerg.save();
          });

          savedUser = savedUser.get({ plain: true });
          return cb(savedUser, error);
        });
      } else {
        user = user.get({ plain: true });
        return cb(user, err);
      }
    });
  };

  return usuario;
};
