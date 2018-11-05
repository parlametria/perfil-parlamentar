module.exports = {
  mongoURI: process.env.MONGODB_URI,
  secretOrKey: process.env.SECRET_OR_KEY,

  facebookAppID: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  facebookCallbackURL: "http://localhost:5000/api/auth/facebook/callback",
  facebookProfileURL:
    "https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email",

  googleAppID: process.env.GOOGLE_APP_ID,
  googleAppSecret: process.env.GOOGLE_APP_SECRET
};
