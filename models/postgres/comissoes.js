module.exports = (sequelize, type) => {
  comissao = sequelize.define(
    "comissoe",
    {      
      id: {
        type: type.STRING,
        primaryKey: true
      },      
      sigla: type.STRING,
      nome: type.STRING      
    },
    {
      timestamps: false
    }
  );
  comissao.associate = function(models) {
    comissao.hasMany(models.composicaoComissoes, {
      foreignKey: "comissao_id",
      targetKey: "id",      
      as: "comissao_comp"
    })
  };
  return comissao;
};
