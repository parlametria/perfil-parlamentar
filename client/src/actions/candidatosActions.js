import {
  SET_SCORE_CANDIDATOS,
  CANDIDATOS_CARREGANDO,
  CANDIDATOS_CARREGADOS,
  SET_DADOS_CANDIDATOS
} from "./types";

import {
  firebaseDatabase,
  firebaseFirestore
} from "../services/firebaseService";

import axios from 'axios';

// Recebe um dicionário das respostas dos candidatos no formato {id_cand: [array_resp]} e retorna um dicionário no formato {id_cand: score}
export const calculaScore = () => (dispatch, getState) => {
  const { arrayRespostasUsuario } = getState().usuarioReducer;
  const respostasCandidatos = getState().candidatosReducer.dadosCandidatos;

  //console.log(respostasCandidatos);

  const quantZeros = arrayRespostasUsuario.filter(value => value !== 0).length;
  const numRespostasUsuario = quantZeros === 0 ? 1 : quantZeros;

  function comparaRespostas(arrayRespostasCandidato) {
    let respostasIguais = 0;
    Object.keys(arrayRespostasCandidato).map((elem, i) => {
      respostasIguais +=
        arrayRespostasCandidato[elem] === arrayRespostasUsuario[i] &&
          arrayRespostasUsuario[i] !== 0
          ? 1
          : 0;
    });
    return respostasIguais / numRespostasUsuario;
  }

  let scoreCandidatos = {};
  Object.keys(respostasCandidatos).map(elem => {
    let score = comparaRespostas(respostasCandidatos[elem].respostas);
    scoreCandidatos[elem] = score;
  });

  dispatch({
    type: SET_SCORE_CANDIDATOS,
    scoreCandidatos
  });
};

// Pega o top n candidatos baseado na compatibilidade entre as respostas ordenado pelo score. Recebe um dicionário das respostas dos candidatos e retorna um array de arrays (tuplas) com os ids dos candidatos e seu score.
export const getTopNCandidatos = n => (dispatch, getState) => {
  const { scoreCandidatos } = getState().candidatosReducer;
  let candidatos = Object.keys(scoreCandidatos).map(key => [
    key,
    scoreCandidatos[key]
  ]);

  candidatos.sort((a, b) => {
    if (a[1] > b[1]) return -1;
    else if (a[1] === b[1]) return 0;
    else return 1;
  });

  return candidatos.slice(0, n);
};

export const getDadosCandidatos = () => dispatch => {
  dispatch(setCandidatosCarregando());

  let dadosCandidatos = {};

  axios.get("/api/resultados").then(candidatos => {
    console.log(candidatos);

    dispatch({ type: SET_DADOS_CANDIDATOS, dadosCandidatos });
  });

};

export const setCandidatosCarregando = () => {
  return {
    type: CANDIDATOS_CARREGANDO
  };
};

export const setCandidatosCarregados = () => {
  return {
    type: CANDIDATOS_CARREGADOS
  };
};
