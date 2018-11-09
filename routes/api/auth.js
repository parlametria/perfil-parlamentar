const express = require("express");
const router = express.Router();
const { generateToken, sendToken } = require("../../utils/token.utils");

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

router.get(
  "/test",
  passport.authenticate(["facebook-token", "google-token"], {
    session: false
  }),
  (req, res) => {
    res.json({ msg: "Tudo certo" });
  }
);

module.exports = router;
