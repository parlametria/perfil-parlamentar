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
        id_partido: type.STRING,
        situacao: type.STRING,
        condicao_eleitoral: type.STRING,
        ultima_legislatura: type.STRING,
        em_exercicio: type.BOOLEAN,
        id_perfil_politico: type.STRING
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
      parlamentar.hasMany(models.voto, {
        foreignKey: "id_parlamentar_voz",
        targetKey: "id_parlamentar_voz",
        as: "votos"
      }),
      parlamentar.hasMany(models.composicaoComissoes, {
        foreignKey: "id_parlamentar_voz",
        targetKey: "id_parlamentar_voz",      
        as: "parlamentarComissoes"
      }),
      parlamentar.hasMany(models.aderencia, {
        foreignKey: "id_parlamentar_voz",
        targetKey: "id_parlamentar_voz",      
        as: "parlamentarAderencia"
      }),
      parlamentar.hasMany(models.liderancas, {
        foreignKey: "id_parlamentar_voz",
        targetKey: "id_parlamentar_voz",      
        as: "parlamentarLiderancas"
      }),      
      parlamentar.hasOne(models.perfilMais, {
        foreignKey: "id_parlamentar_voz",
        targetKey: "id_parlamentar_voz",      
        as: "parlamentarPerfilMais"
      }),
      parlamentar.belongsTo(models.partido, {
        foreignKey: "id_partido",
        targetKey: "id_partido",      
        as: "parlamentarPartido"
      }),
      parlamentar.hasMany(models.investimentoPartidarioParlamentar, {
        foreignKey: "id_parlamentar_voz",
        targetKey: "id_parlamentar_voz",      
        as: "parlamentarInvestimento"
      }),
      parlamentar.hasMany(models.ligacoesEconomicas, {
        foreignKey: "id_parlamentar_voz",
        targetKey: "id_parlamentar_voz",      
        as: "parlamentarLigacoes"
      }),
      parlamentar.hasMany(models.empresasParlamentares, {
        foreignKey: "id_parlamentar_voz",
        targetKey: "id_parlamentar_voz",      
        as: "parlamentarEmpresas"
      })
    };
    return parlamentar;
  };
  