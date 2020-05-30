module.exports = (sequelize, type) => {
  candidato = sequelize.define(
    "candidato",
    {
      estado: type.STRING,
      uf: type.STRING,
      idade_posse: type.INTEGER,
      nome_coligacao: type.STRING,
      nome_candidato: type.STRING,
      cpf: {
        type: type.STRING,
        primaryKey: true
      },
      recebeu: type.BOOLEAN,
      num_partido: type.STRING,
      email: type.STRING,
      nome_social: type.STRING,
      nome_urna: type.STRING,
      reeleicao: type.STRING,
      ocupacao: type.STRING,
      nome_exibicao: type.STRING,
      raca: type.STRING,
      tipo_agremiacao: type.STRING,
      n_candidatura: type.INTEGER,
      composicao_coligacao: type.STRING,
      tem_foto: type.INTEGER,
      partido: type.STRING,
      sg_partido: type.STRING,
      grau_instrucao: type.STRING,
      genero: type.STRING,
      eleito: type.BOOLEAN,
      respondeu: type.BOOLEAN,
      id_parlamentar: type.STRING
    },
    {
      timestamps: false
    }
  );
  candidato.associate = function (models) {
  };
  return candidato;
};
