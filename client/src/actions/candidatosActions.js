import {
  SET_SCORE_CANDIDATOS,
  CANDIDATOS_CARREGANDO,
  CANDIDATOS_CARREGADOS,
  SET_DADOS_CANDIDATOS,
  SET_DADOS_CANDIDATO,
  SET_FILTRO_CANDIDATOS,
} from "./types";

// import {
//   firebaseDatabase,
//   firebaseFirestore
// } from "../services/firebaseService";

import axios from "axios";

const comparaRespostas = (
  respostasCandidatos,
  respostasUsuario,
  numRespostasUsuario
) => {
  let respostasIguais = 0;
  const chaves = Object.keys(respostasUsuario);
  chaves.pop();
  chaves.map(idPergunta => {
    respostasIguais +=
      respostasCandidatos[idPergunta] !== undefined &&
        respostasCandidatos[idPergunta] !== null &&
        respostasCandidatos[idPergunta] === respostasUsuario[idPergunta] &&
        respostasUsuario[idPergunta] !== 0
        ? 1
        : 0;
  });
  return respostasIguais / numRespostasUsuario;
};

// Recebe um dicionário das respostas dos candidatos no formato {id_cand: [array_resp]} e retorna um dicionário no formato {id_cand: score}
export const calculaScore = () => (dispatch, getState) => {
  const { respostasUsuario } = getState().usuarioReducer;
  const { arrayRespostasUsuario } = getState().usuarioReducer;
  const respostasCandidatos = getState().candidatosReducer.dadosCandidatos;

  const quantZeros = arrayRespostasUsuario.filter(value => value !== 0).length;
  const numRespostasUsuario = quantZeros === 0 ? 1 : quantZeros;

  let scoreCandidatos = {};
  Object.keys(respostasCandidatos).map(elem => {
    let score = comparaRespostas(
      respostasCandidatos[elem].respostas,
      respostasUsuario,
      numRespostasUsuario
    );
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

export const getDadosCandidatos = () => (dispatch, getState) => {
  dispatch(setCandidatosCarregando());

  const { filtro } = getState().candidatosReducer;

  let dadosCandidatos = {};

  console.time("getBD");

  axios.get("/api/respostas/estados/" + filtro.estado + "/responderam").then(respostas => {
    console.timeEnd("getBD");

    respostas.data.map(resp => {
      dadosCandidatos[resp.cpf] = resp;
    });

    dispatch({ type: SET_DADOS_CANDIDATOS, dadosCandidatos });
    dispatch(calculaScore());
  });
};

export const getDadosCandidato = idCandidato => dispatch => {
  dispatch(setCandidatosCarregando());

  console.time("pega1Candidato");

  axios.get("/api/respostas/candidatos" + "/" + idCandidato).then(respostas => {
    console.timeEnd("pega1Candidato");

    const dadosCandidato = respostas.data[0];

    console.log(dadosCandidato);

    dispatch({ type: SET_DADOS_CANDIDATO, dadosCandidato });
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

export const setFiltroCandidatos = filtro => dispatch => {
  dispatch({ type: SET_FILTRO_CANDIDATOS, filtro });
};
