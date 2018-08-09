import { SET_SCORE_CANDIDATO } from "./types";

export const calculaScore = respostasCandidatos => (dispatch, getState) => {
  const { arrayRespostasUsuario } = getState().usuarioReducer;
  const numRespostasUsuario = arrayRespostasUsuario.filter(value => value !== 0)
    .length;

  function comparaRespostas(arrayRespostasCandidato) {
    let respostasIguais = 0;
    for (let i = 0; i < arrayRespostasCandidato.length; i++) {
      respostasIguais +=
        arrayRespostasCandidato[i] === arrayRespostasUsuario[i] &&
        arrayRespostasUsuario[i] !== 0
          ? 1
          : 0;
    }
    return respostasIguais / numRespostasUsuario;
  }

  const scoreCandidatos = Object.keys(respostasCandidatos).map(elem => {
    let score = comparaRespostas(respostasCandidatos[elem]);

    return { id_cand: elem, score };
  });

  console.log(scoreCandidatos);

  dispatch({
    type: SET_SCORE_CANDIDATO,
    scoreCandidatos
  });
};
