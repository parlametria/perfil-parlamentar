module.exports = (sequelize, type) => {
  return sequelize.define("Candidato", {
    email: type.STRING,
    nome_exibicao: type.STRING,
    nome_urna: type.STRING,
    cpf: {
      type: type.STRING,
      primaryKey: true
    },
    sg_partido: type.STRING,
    uf: type.STRING,
    tem_foto: type.INTEGER,
    num_partido: type.STRING,
    tipo_agremiacao: type.STRING,
    grau_instrucao: type.STRING,
    composicao_coligacao: type.STRING,
    tipo_agremiacao: type.STRING,
    genero: type.STRING,
    tipo_agremiacao: type.STRING,
    estado: type.STRING,
    idade_posse: type.STRING,
    raca: type.STRING,
    recebeu: type.BOOLEAN,
    partido: type.STRING,
    ocupacao: type.STRING,
    reeleicao: type.STRING,
    n_candidatura: type.INTEGER,
    respondeu: type.BOOLEAN,
    eleito: type.BOOLEAN
  });
};
