const express = require("express");
const router = express.Router();
const { generateToken, sendToken } = require("../../utils/token.utils");

const passport = require("passport");
const expressJwt = require("express-jwt");

const keys = require("../../config/keys");

const graph = require("fbgraph");

require("../../config/passport")();

const authenticate = expressJwt({
  secret: keys.secretOrKey,
  requestProperty: "auth",
  getToken: function(req) {
    if (req.headers["authorization"]) {
      return req.headers["authorization"];
    }
    return null;
  }
});

// @route   POST api/auth/facebook
// @desc    Login com facebook
// @access  Public
router.post(
  "/facebook",
  (req, res, next) => {
    passport.authenticate("facebook-token", { session: false })(req, res, next);
  },
  (req, res, next) => {
    if (!req.user) {
      return res.send(401, "User Not Authenticated");
    }
    req.auth = {
      id: req.user.provider_id,
      firstName: req.user.first_name,
      photo: req.user.photo,
      respostas: req.user.respostas
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
  (req, res, next) => {
    passport.authenticate("google-token", { session: false })(req, res, next);
  },
  (req, res, next) => {
    if (!req.user) {
      return res.send(401, "User Not Authenticated");
    }
    req.auth = {
      id: req.user.provider_id,
      firstName: req.user.first_name,
      photo: req.user.photo,
      respostas: req.user.respostas
    };

    next();
  },
  generateToken,
  sendToken
);

router.get("/test", authenticate, (req, res) => {
  res.json({ msg: "Tudo certo" });
});

router.get("/usingFacebookCode", (req, res) => {
  graph.authorize(
    {
      client_id: keys.facebookAppID,      
      redirect_uri: keys.facebookRedirectURI,
      client_secret: keys.facebookAppSecret,
      code: req.query.code
    },
    function(err, facebookRes) {
      if (err) res.status(400).json(err);
      res.status(200).json(facebookRes);
    }
  );
});

module.exports = router;
