const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const GoogleTokenStrategy = require("passport-google-token").Strategy;
const models = require("../models/index");
const Usuario = models.usuario;

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
          (user, err) => {
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
        clientSecret: keys.googleAppSecret,
        passReqToCallback: true
      },
      (req, accessToken, refreshToken, profile, done) => {
        Usuario.upsertGoogleUser(
          accessToken,
          refreshToken,
          profile,
          req.body.respostas,
          (user, err) => {
            return done(err, user);
          }
        );
      }
    )
  );
};
