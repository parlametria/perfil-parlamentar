const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const GoogleTokenStrategy = require("passport-google-token").Strategy;
const { Strategy: TwitterStrategy } = require("passport-twitter");
const Usuario = require("../models/Usuario");

const keys = require("./keys");

module.exports = () => {
  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: keys.facebookAppID,
        clientSecret: keys.facebookAppSecret
      },
      (accessToken, refreshToken, profile, done) => {
        Usuario.upsertFbUser(
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

  // allows us to save the user into the session
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: keys.twitterConsumerKey,
        consumerSecret: keys.twitterConsumerSecret,
        callbackURL: keys.twitterCallbackURL,
        includeEmail: true
      },
      function(token, tokenSecret, profile, done) {
        Usuario.upsertTwitterUser(token, tokenSecret, profile, function(
          err,
          user
        ) {
          return done(err, user);
        });
      }
    )
  );
};
