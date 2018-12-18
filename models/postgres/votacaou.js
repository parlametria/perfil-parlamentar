module.exports = (sequelize, type) => {
  const votacaou = sequelize.define(
    "votacoesu",
    {
      resposta: type.INTEGER
    },
    {
      timestamps: false
    }
  );
  votacaou.associate = function(models) {
    votacaou.belongsTo(models.proposicao, {
      foreignKey: "proposicao_id",
      as: "uvot_prop"
    }),
      votacaou.belongsTo(models.candidato, {
        foreignKey: "user_id",
        as: "user_vot"
      });
  };

  votacaou.upsertResp = function(proposicao_id, user_id, resposta, cb) {
    const that = this;
    return this.findOne({
      where: {
        proposicao_id: proposicao_id,
        user_id: user_id
      }
    }).then((resp, err) => {
      if (!resp) {
        const newResp = new that({
          proposicao_id: proposicao_id,
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

  return votacaou;
};
