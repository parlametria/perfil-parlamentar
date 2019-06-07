module.exports = (sequelize, type) => {    
    aderencia = sequelize.define(      
      "aderencia",
      {
        id_parlamentar_voz: {
          type: type.STRING,
          primaryKey: true
        },
        partido: {
          type: type.STRING,
          primaryKey: true
        },
        faltou: type.INTEGER,
        partido_liberou: type.INTEGER,
        nao_seguiu: type.INTEGER,
        seguiu: type.INTEGER,
        aderencia: type.REAL
      },
      {
        timestamps: false,
        freezeTableName: true
      }
    );
    aderencia.associate = function (models) {        
      aderencia.belongsTo(models.parlamentar, {
        foreignKey: "id_parlamentar_voz",
        sourceKey: "id_parlamentar_voz",
        as: "aderencia_parlamentar"
      })  
    };
    return aderencia;
  };  
