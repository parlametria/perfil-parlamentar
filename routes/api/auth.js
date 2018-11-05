const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const request = require("request");
const { generateToken, sendToken } = require("../../utils/token.utils");

const keys = require("../../config/keys");

const passport = require("passport");
require("../../config/passport")();

// @route   POST api/auth/facebook
// @desc    Login com facebook
// @access  Public
router.post(
  "/facebook",
  passport.authenticate("facebook-token", { session: false }),
  (req, res, next) => {
    if (!req.user) {
      return res.send(401, "User Not Authenticated");
    }
    req.auth = {
      id: req.user.id
    };

    next();
  },
  generateToken,
  sendToken
);

// @route   POST api/auth/google
// @desc    Login com google
// @access  Public
router.post(
  "/google",
  passport.authenticate("google-token", { session: false }),
  (req, res, next) => {
    if (!req.user) {
      return res.send(401, "User Not Authenticated");
    }
    req.auth = {
      id: req.user.id
    };

    next();
  },
  generateToken,
  sendToken
);

// @route   POST api/auth/google
// @desc    Login com google
// @access  Public
router.post("/twitter/callback", (req, res, next) => {
  res.status(200).json({ message: "A" });
});

router.route("/twitter/reverse").post(function(req, res) {
  request.post(
    {
      url: "https://api.twitter.com/oauth/request_token",
      oauth: {
        oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
        consumer_key: keys.twitterConsumerKey,
        consumer_secret: keys.twitterConsumerSecret
      }
    },
    function(err, r, body) {
      if (err) {
        return res.send(500, { message: e.message });
      }
      var jsonStr =
        '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      res.send(JSON.parse(jsonStr));
    }
  );
});

router.route("/twitter").post(
  (req, res, next) => {
    request.post(
      {
        url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
        oauth: {
          consumer_key: keys.twitterConsumerKey,
          consumer_secret: keys.twitterConsumerSecret,
          token: req.query.oauth_token
        },
        form: { oauth_verifier: req.query.oauth_verifier }
      },
      function(err, r, body) {
        if (err) {
          return res.send(500, { message: err.message });
        }

        const bodyString =
          '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        const parsedBody = JSON.parse(bodyString);

        req.body["oauth_token"] = parsedBody.oauth_token;
        req.body["oauth_token_secret"] = parsedBody.oauth_token_secret;
        req.body["user_id"] = parsedBody.user_id;

        next();
      }
    );
  },
  passport.authenticate("twitter-token", { session: false }),
  function(req, res, next) {
    if (!req.user) {
      return res.send(401, "User Not Authenticated");
    }
    req.auth = {
      id: req.user.id
    };

    return next();
  },
  generateToken,
  sendToken
);

module.exports = router;
