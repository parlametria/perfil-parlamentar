module.exports = (sequelize, type) => {    
    aderencia = sequelize.define(      
      "aderencias",
      {
        id_parlamentar_voz: {
          type: type.STRING,
          primaryKey: true
        },
        id_partido: {
          type: type.INTEGER,
          primaryKey: true
        },
        id_tema: {
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
        timestamps: false
      }
    );
    aderencia.associate = function (models) {        
      aderencia.belongsTo(models.parlamentar, {
        foreignKey: "id_parlamentar_voz",
        sourceKey: "id_parlamentar_voz",
        as: "parlamentarAderencia"
      }),
      aderencia.belongsTo(models.partido, {
        foreignKey: "id_partido",
        sourceKey: "id_partido",
        as: "partido"
      }),
      aderencia.belongsTo(models.tema, {
        foreignKey: "id_tema",
        sourceKey: "id_tema",
        as: "aderenciaTema"
      })  
    };
    return aderencia;
  };  
