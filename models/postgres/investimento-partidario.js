module.exports = (sequelize, type) => {    
    investimentoPartidario = sequelize.define(      
      "investimento_partidario",
      {
        id_parlamentar_voz: {
          type: type.STRING,
          primaryKey: true
        },
        total_recebido: type.REAL,
        indice_investimento: type.REAL        
      },
      {
        timestamps: false,
        freezeTableName: true
      }
    );
    investimentoPartidario.associate = function (models) {        
        investimentoPartidario.belongsTo(models.parlamentar, {
        foreignKey: "id_parlamentar_voz",
        sourceKey: "id_parlamentar_voz",
        as: "parlamentarInvestimento"
      })
    };
    return investimentoPartidario;
  };  
