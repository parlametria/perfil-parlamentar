import isEmpty from "../validation/is-empty";
import axios from "axios";

export const filtraPorNome = (nome, dadosCandidatos) => {
  return Object.keys(dadosCandidatos).filter(
    cpf => dadosCandidatos[cpf].nome_urna.indexOf(nome.toUpperCase()) >= 0
  );
};

export const filtraPorPartido = (filtro, dadosCandidatos, scoreCandidatos) => {
  // return (Object.keys(dadosCandidatos).filter(cpf =>
  //   (dadosCandidatos[cpf].sg_partido === partido)
  // ))
  //   .sort((a, b) => {
  //     if (scoreCandidatos[a] > scoreCandidatos[b]) return -1;
  //     else if (scoreCandidatos[a] < scoreCandidatos[b]) return 1;
  //     else if (scoreCandidatos[a] === scoreCandidatos[b]) {
  //       if (
  //         !isEmpty(dadosCandidatos[a]) &&
  //         !isEmpty(dadosCandidatos[b])
  //       ) {
  //         if (
  //           (dadosCandidatos[a].respondeu &&
  //             dadosCandidatos[b].respondeu) ||
  //           (!dadosCandidatos[a].respondeu &&
  //             !dadosCandidatos[b].respondeu)
  //         )
  //           return dadosCandidatos[a].nome_urna.localeCompare(
  //             dadosCandidatos[b].nome_urna
  //           );
  //         else if (dadosCandidatos[b].respondeu) return 1;
  //         else return -1;
  //       }
  //       return 0;
  //     };
  //   })

  return axios.get(
    "api/respostas/estados/" + filtro.estado + "?partido=" + filtro.partido
  );
};

export const filtraPorNomeEPartido = (nome, partido, dadosCandidatos) => {
  return Object.keys(dadosCandidatos).filter(
    cpf =>
      dadosCandidatos[cpf].sg_partido === partido &&
      dadosCandidatos[cpf].nome_urna.indexOf(nome.toUpperCase()) >= 0
  );
};
