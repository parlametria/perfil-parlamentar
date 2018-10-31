const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Usuario = new Schema({
  email: {
    type: String,
    required: true
  },
  facebookProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  }
});

Usuario.statics.findOneOrCreate = function findOneOrCreate(
  condition,
  callback
) {
  const self = this;
  self.findOne(condition, (err, result) => {
    return result
      ? callback(err, result)
      : self.create(condition, (err, result) => {
          return callback(err, result);
        });
  });
};

module.exports = Usuario = mongoose.model("usuarios", CandidatoSchema);
