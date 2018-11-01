const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');

const Usuario = require("../models/Usuario");

const keys = require("./keys");

module.exports = () => {
  passport.use(new FacebookTokenStrategy({
    clientID: keys.facebookAppID,
    clientSecret: keys.facebookAppSecret
  },
    (accessToken, refreshToken, profile, done) => {
      Usuario.upsertFbUser(accessToken, refreshToken, profile, (err, user) => {
        return done(err, user);
      });
    }));
}
