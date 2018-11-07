const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const request = require("request");
const { generateToken, sendToken } = require("../../utils/token.utils");

const io = require("../../server");

const keys = require("../../config/keys");

const passport = require("passport");

const twitterAuth = passport.authenticate("twitter");

const addSocketIdToSession = (req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
};

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

router.get("/twitter", addSocketIdToSession, twitterAuth);

router.get("/twitter/callback", twitterAuth, (req, res) => {
  io.io.in(req.session.socketId).emit("user", req.user);
  res.end();
});

module.exports = router;
