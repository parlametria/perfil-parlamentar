import isEmpty from "../validation/is-empty";

export const filtra = (filtro, dadosCandidatos, scoreCandidatos) => {
  return Object.keys(dadosCandidatos)
    .filter(cpf => {
      const isFiltrandoPorNome = filtro.nome !== "";
      const isFiltrandoPorPartido = filtro.partido !== "Partidos";
      const isFiltrandoPorReeleicao = filtro.reeleicao !== "-1";

      return (
        (dadosCandidatos[cpf].sg_partido === filtro.partido ||
          !isFiltrandoPorPartido) &&
        (dadosCandidatos[cpf].reeleicao === filtro.reeleicao ||
          !isFiltrandoPorReeleicao) &&
        (dadosCandidatos[cpf].nome_urna.indexOf(filtro.nome.toUpperCase()) >=
          0 ||
          !isFiltrandoPorNome)
      );
    })
    .sort((a, b) => {
      if (scoreCandidatos[a] > scoreCandidatos[b]) return -1;
      else if (scoreCandidatos[a] < scoreCandidatos[b]) return 1;
      else if (scoreCandidatos[a] === scoreCandidatos[b]) {
        if (!isEmpty(dadosCandidatos[a]) && !isEmpty(dadosCandidatos[b])) {
          if (
            (dadosCandidatos[a].respondeu && dadosCandidatos[b].respondeu) ||
            (!dadosCandidatos[a].respondeu && !dadosCandidatos[b].respondeu)
          )
            return dadosCandidatos[a].nome_urna.localeCompare(
              dadosCandidatos[b].nome_urna
            );
          else if (dadosCandidatos[b].respondeu) return 1;
          else return -1;
        }
        return 0;
      }
    });
};
