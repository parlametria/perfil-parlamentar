const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { generateToken, sendToken } = require("../../utils/token.utils");

const passport = require("passport");
require('../../config/passport')();

// @route   POST api/auth/facebook
// @desc    Login com facebook
// @access  Public
router.post("/facebook", passport.authenticate("facebook-token", { session: false }), (req, res, next) => {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated');
  }
  req.auth = {
    id: req.user.id
  };

  next();
}, generateToken, sendToken);

router.get("/callback/facebook", (req, res) => {
  return passport.authenticate("facebook", {
    failureRedirect: "/auth/failed"
  });
});

module.exports = router;
