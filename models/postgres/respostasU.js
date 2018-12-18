module.exports = (sequelize, type) => {
  respostau = sequelize.define(
    "respostasu",
    {
      resposta: type.INTEGER
    },
    {
      timestamps: false
    }
  );
  resposta.associate = function(models) {
    respostau.belongsTo(models.pergunta, {
      foreignKey: "pergunta_id",
      as: "uperg_resp"
    }),
      respostau.belongsTo(models.usuario, {
        foreignKey: "user_id",
        as: "user_resp"
      });
  };

  respostau.upsertResp = function(pergunta_id, user_id, resposta, cb) {
    const that = this;
    return this.findOne({
      where: {
        pergunta_id: pergunta_id,
        user_id: user_id
      }
    }).then((resp, err) => {
      if (!resp) {
        const newResp = new that({
          pergunta_id: pergunta_id,
          user_id: user_id,
          resposta: resposta
        });

        newResp.save().then((savedResp, error) => {
          if (error) {
            console.log(error);
          }
          return cb(savedResp, error);
        });
      } else {
        resp.update({ resposta: resposta });
        return cb(resp, err);
      }
    });
  };

  return respostau;
};
