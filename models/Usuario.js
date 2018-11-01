const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  facebookProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  }
});

UsuarioSchema.set('toJSON', { getters: true, virtuals: true });

UsuarioSchema.statics.upsertFbUser = function (accessToken, refreshToken, profile, cb) {
  var that = this;
  return this.findOne({
    'facebookProvider.id': profile.id
  }, function (err, user) {
    // no user was found, lets create a new one
    if (!user) {
      var newUser = new that({
        fullName: profile.displayName,
        email: profile.emails[0].value,
        facebookProvider: {
          id: profile.id,
          token: accessToken
        }
      });

      newUser.save(function (error, savedUser) {
        if (error) {
          console.log(error);
        }
        return cb(error, savedUser);
      });
    } else {
      return cb(err, user);
    }
  });
};

module.exports = Usuario = mongoose.model("usuarios", UsuarioSchema);
