module.exports = (sequelize, type) => {
  comissao = sequelize.define(
    "comissoe",
    {      
      id_comissao_voz: {
        type: type.STRING,
        primaryKey: true
      }, 
      id: type.INTEGER,
      casa: type.STRING,
      sigla: type.STRING,
      nome: type.STRING      
    },
    {
      timestamps: false
    }
  );
  comissao.associate = function(models) {
    comissao.hasMany(models.composicaoComissoes, {
      foreignKey: "id_comissao_voz",
      targetKey: "id_comissao_voz",      
      as: "comissaoComp"
    })
  };
  return comissao;
};
