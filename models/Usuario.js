const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  photo: {
    type: String
  },
  facebookProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  },
  googleProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  },
  twitterProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  }
});

UsuarioSchema.set("toJSON", { getters: true, virtuals: true });

UsuarioSchema.statics.upsertFbUser = function(
  accessToken,
  refreshToken,
  profile,
  cb
) {
  console.log(profile);
  const that = this;
  return this.findOne(
    {
      "facebookProvider.id": profile.id
    },
    function(err, user) {
      // no user was found, lets create a new one
      if (!user) {
        const newUser = new that({
          firstName: profile.displayName.split(" ")[0],
          fullName: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value,
          facebookProvider: {
            id: profile.id,
            token: accessToken
          }
        });

        newUser.save(function(error, savedUser) {
          if (error) {
            console.log(error);
          }
          return cb(error, savedUser);
        });
      } else {
        return cb(err, user);
      }
    }
  );
};

UsuarioSchema.statics.upsertGoogleUser = function(
  accessToken,
  refreshToken,
  profile,
  cb
) {
  const that = this;
  return this.findOne(
    {
      "googleProvider.id": profile.id
    },
    function(err, user) {
      // no user was found, lets create a new one
      if (!user) {
        const newUser = new that({
          firstName: profile.displayName.split(" ")[0],
          fullName: profile.displayName,
          email: profile.emails[0].value,
          googleProvider: {
            id: profile.id,
            token: accessToken
          }
        });

        newUser.save(function(error, savedUser) {
          if (error) {
            console.log(error);
          }
          return cb(error, savedUser);
        });
      } else {
        return cb(err, user);
      }
    }
  );
};

UsuarioSchema.statics.upsertTwitterUser = function(
  token,
  tokenSecret,
  profile,
  cb
) {
  var that = this;
  return this.findOne(
    {
      "twitterProvider.id": profile.id
    },
    function(err, user) {
      // no user was found, lets create a new one
      if (!user) {
        var newUser = new that({
          firstName: profile.displayName.split(" ")[0],
          fullName: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value,
          twitterProvider: {
            id: profile.id,
            token: token,
            tokenSecret: tokenSecret
          }
        });

        newUser.save(function(error, savedUser) {
          if (error) {
            console.log(error);
          }
          return cb(error, savedUser);
        });
      } else {
        return cb(err, user);
      }
    }
  );
};

module.exports = Usuario = mongoose.model("usuarios", UsuarioSchema);
