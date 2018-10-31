const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//const passport = require("../../config/passport");
const passport = require("passport");

// @route   GET api/auth/facebook
// @desc    Login com facebook
// @access  Public
router.get("/facebook", (req, res) => {
  return passport.authenticate("facebook");
});

router.get("/callback/facebook", (req, res) => {
  return passport.authenticate("facebook", {
    failureRedirect: "/auth/failed"
  });
});

module.exports = router;
