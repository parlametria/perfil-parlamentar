const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const createToken = function(auth) {
  return jwt.sign(
    {
      id: auth.id,
      firstName: auth.firstName,
      photo: auth.photo
    },
    keys.secretOrKey,
    {
      expiresIn: 60 * 43200 // 30 dias
    }
  );
};

module.exports = {
  generateToken: function(req, res, next) {
    req.token = createToken(req.user);
    return next();
  },
  sendToken: function(req, res) {  
    return res.status(200).json({
      token: req.token,
      user: req.user
    });
  },
  createToken
};
