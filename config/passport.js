const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const GoogleTokenStrategy = require("passport-google-token").Strategy;
const Usuario = require("../models/Usuario");

const keys = require("./keys");

module.exports = () => {
  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: keys.facebookAppID,
        clientSecret: keys.facebookAppSecret,
        passReqToCallback: true
      },
      (req, accessToken, refreshToken, profile, done) => {
        Usuario.upsertFbUser(
          accessToken,
          refreshToken,
          profile,
          req.body.respostas,
          (err, user) => {
            return done(err, user);
          }
        );
      }
    )
  );

  passport.use(
    new GoogleTokenStrategy(
      {
        clientID: keys.googleAppID,
        clientSecret: keys.googleAppSecret
      },
      (accessToken, refreshToken, profile, done) => {
        Usuario.upsertGoogleUser(
          accessToken,
          refreshToken,
          profile,
          (err, user) => {
            return done(err, user);
          }
        );
      }
    )
  );
};
