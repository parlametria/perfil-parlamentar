import isEmpty from '../validation/is-empty';

export const filtraPorNome = (nome, dadosCandidatos) => {
  return (Object.keys(dadosCandidatos)
    .filter(cpf =>
      (dadosCandidatos[cpf].nome_urna
        .indexOf(nome.toUpperCase()) >= 0
      )
    )
  )
};

export const filtraPorPartido = (partido, dadosCandidatos, scoreCandidatos) => {
  return (Object.keys(dadosCandidatos).filter(cpf =>
    (dadosCandidatos[cpf].sg_partido === partido)
  ))
    .sort((a, b) => {
      if (scoreCandidatos[a] > scoreCandidatos[b]) return -1;
      else if (scoreCandidatos[a] < scoreCandidatos[b]) return 1;
      else {
        if (
          !isEmpty(dadosCandidatos[a[0]]) &&
          !isEmpty(dadosCandidatos[b[0]])
        ) {
          if (
            (dadosCandidatos[a[0]].respondeu &&
              dadosCandidatos[b[0]].respondeu) ||
            (!dadosCandidatos[a[0]].respondeu &&
              !dadosCandidatos[b[0]].respondeu)
          )
            return dadosCandidatos[a[0]].nome_urna.localeCompare(
              dadosCandidatos[b[0]].nome_urna
            );
          else if (dadosCandidatos[b[0]].respondeu) return 1;
          else return -1;
        }
        return 0;
      };
    })
};

export const filtraPorNomeEPartido = (nome, partido, dadosCandidatos) => {
  return Object.keys(dadosCandidatos)
    .filter(cpf => (
      dadosCandidatos[cpf].sg_partido === partido &&
      dadosCandidatos[cpf].nome_urna
        .indexOf(nome.toUpperCase()) >= 0
    ))
};