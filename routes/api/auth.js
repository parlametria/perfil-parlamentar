const express = require("express");
const router = express.Router();
const { generateToken, sendToken } = require("../../utils/token.utils");

const passport = require("passport");
const expressJwt = require("express-jwt");

const keys = require("../../config/keys");

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
  passport.authenticate("facebook-token", { session: false }),
  (req, res, next) => {
    if (!req.user) {
      return res.send(401, "User Not Authenticated");
    }
    req.auth = {
      id: req.user.id,
      firstName: req.user.firstName,
      photo: req.user.photo
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
      id: req.user.id,
      firstName: req.user.firstName,
      photo: req.user.photo
    };

    next();
  },
  generateToken,
  sendToken
);

router.get("/test", authenticate, (req, res) => {
  res.json({ msg: "Tudo certo" });
});

module.exports = router;
