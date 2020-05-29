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
    votacaou.belongsTo(models.votacao, {
      foreignKey: "id_votacao",
      as: "usuarioVotacoes"
    })
  };

  votacaou.upsertResp = function(id_votacao, user_id, resposta, cb) {
    const that = this;
    return this.findOne({
      where: {
        id_votacao: id_votacao,
        user_id: user_id
      }
    }).then((resp, err) => {
      if (!resp) {
        const newResp = new that({
          id_votacao: id_votacao,
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
