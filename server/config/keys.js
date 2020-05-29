module.exports = {
  mongoURI: process.env.MONGODB_URI,
  secretOrKey: process.env.SECRET_OR_KEY,
  postgresURI: process.env.POSTGRESURI,

  facebookAppID: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  facebookCallbackURL: "https://localhost:5000/api/auth/facebook/callback",
  facebookProfileURL:
    "https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email",
  facebookRedirectURI: process.env.FACEBOOK_REDIRECT_URI,

  googleAppID: process.env.GOOGLE_APP_ID,
  googleAppSecret: process.env.GOOGLE_APP_SECRET,
  googleCallbackURL: "https://localhost:5000/api//auth/google/callback",

  twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY,
  twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  twitterCallbackURL: "https://localhost:5000/api/auth/twitter/callback"
};
