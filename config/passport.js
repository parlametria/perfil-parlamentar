const facebookStrategy = require("passport-facebook");

const Usuario = require("../models/Usuario");

const keys = require("./keys");

module.exports = passport => {
  passport.use(
    new facebookStrategy(
      {
        clientID: keys.facebookAppID,
        clientSecret: keys.facebookAppSecret,
        callbackURL: "http://localhost:3000/auth/facebook/callback"
      },
      (accessToken, refreshToken, profile, cb) => {
        Usuario.findOneOrCreate(
          {
            email: profile.email,
            facebookProvider: { id: profile.id, token: accessToken }
          },
          (err, user) => {
            return cb(err, user);
          }
        );
      }
    )
  );
};
