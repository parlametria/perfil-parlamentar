module.exports = (sequelize, type) => {
    parlamentar = sequelize.define(
      "parlamentare",
      {
        id_parlamentar_voz: {
            type: type.STRING,
            primaryKey: true
        },
        id_parlamentar: type.STRING,
        casa: type.STRING,
        cpf: type.STRING,
        nome_civil: type.STRING,
        nome_eleitoral: type.STRING,
        genero: type.STRING,
        uf: type.STRING,
        partido: type.STRING,
        situacao: type.STRING,
        condicao_eleitoral: type.STRING,
        ultima_legislatura: type.STRING,
        em_exercicio: type.BOOLEAN,
      },
      {
        timestamps: false
      }
    );
    parlamentar.associate = function (models) {
      parlamentar.hasMany(models.resposta, {
        foreignKey: "id_parlamentar_voz",
        targetKey: "id_parlamentar_voz",
        as: "cpf_resp"
      }),
        parlamentar.hasMany(models.votacao, {
          foreignKey: "id_parlamentar_voz",
          targetKey: "id_parlamentar_voz",
          as: "votacoes"
        }),
        parlamentar.hasMany(models.composicaoComissoes, {
          foreignKey: "id_parlamentar_voz",
          targetKey: "id_parlamentar_voz",      
          as: "parlamentarComissoes"
        }),
        parlamentar.hasMany(models.liderancas, {
          foreignKey: "id_parlamentar_voz",
          targetKey: "id_parlamentar_voz",      
          as: "parlamentarLiderancas"
        })
    };
    return parlamentar;
  };
  