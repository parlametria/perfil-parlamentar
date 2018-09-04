import {
  SET_SCORE_CANDIDATOS,
  SET_SCORE_CANDIDATO_POR_TEMA,
  CANDIDATOS_CARREGANDO,
  CANDIDATOS_CARREGADOS,
  SET_DADOS_CANDIDATOS,
  SET_FILTRO_CANDIDATOS,
  SET_NUM_RESPOSTAS,
  SET_DADOS_CANDIDATO,
  SET_MOSTRAR_TODOS_CANDIDATOS
} from "./types";

// import {
//   firebaseDatabase,
//   firebaseFirestore
// } from "../services/firebaseService";

import axios from "axios";
import isEmpty from "../validation/is-empty";

const comparaRespostas = (
  respostasCandidatos,
  respostasUsuario,
  numRespostasUsuario
) => {
  let respostasIguais = 0;
  const chaves = Object.keys(respostasUsuario);
  chaves.forEach(idPergunta => {
    respostasIguais +=
      respostasCandidatos[idPergunta] !== undefined &&
      respostasCandidatos[idPergunta] !== null &&
      respostasUsuario[idPergunta] !== 0 &&
      respostasUsuario[idPergunta] !== -2 &&
      respostasCandidatos[idPergunta] === respostasUsuario[idPergunta]
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
  const quantValidos = arrayRespostasUsuario.filter(
    value => value !== 0 && value !== -2
  ).length;
  const numRespostasUsuario = quantValidos === 0 ? 1 : quantValidos;

  let scoreCandidatos = {};
  Object.keys(respostasCandidatos).forEach(elem => {
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

export const calculaScorePorTema = (
  respostasUsuario,
  arrayRespostasUsuario
) => (dispatch, getState) => {
  const { dadosCandidato } = getState().candidatosReducer;
  const perguntas = getState().perguntasReducer.dadosPerguntas;

  let nomeTemas = new Set();
  perguntas.forEach(elem => {
    nomeTemas.add(elem.tema);
  });

  let temas = {};
  perguntas.forEach(pergunta => {
    if (isEmpty(temas[pergunta.tema])) {
      temas[pergunta.tema] = [];
      temas[pergunta.tema].push(pergunta);
    } else {
      temas[pergunta.tema].push(pergunta);
    }
  });

  let scoreTema = {};
  nomeTemas.forEach(nomeTema => {
    scoreTema[nomeTema] = 0;
  });

  Object.keys(temas).forEach(tema => {
    let score = 0;
    let respostasCandidatosTema = {};
    perguntas.forEach(pergunta => {
      if (pergunta.tema === tema) {
        respostasCandidatosTema[pergunta.id] =
          dadosCandidato.respostas[pergunta.id];
      }
    });
    const primeiroID = temas[tema][0].id;
    const ultimoID = temas[tema][temas[tema].length - 1].id;
    temas[tema].forEach(pergunta => {
      const quantValidos = arrayRespostasUsuario
        .slice(primeiroID, ultimoID)
        .filter(value => value !== 0 && value !== -2).length;
      const numRespostasUsuario = quantValidos === 0 ? 1 : quantValidos;
      score = comparaRespostas(
        respostasCandidatosTema,
        respostasUsuario,
        numRespostasUsuario
      );
    });
    scoreTema[tema] = score;
  });

  dispatch({
    type: SET_SCORE_CANDIDATO_POR_TEMA,
    scoreTema
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
  let numResponderam = 0;
  let numSemResposta = 0;

  console.time("getResponderam");
  console.time("getNaoResponderam");

  axios
    .get("/api/respostas/estados/" + filtro.estado + "/responderam")
    .then(respostas => {
      console.timeEnd("getResponderam");

      respostas.data.forEach(resp => {
        dadosCandidatos[resp.cpf] = resp;
        numResponderam++;
      });

      dispatch({ type: SET_DADOS_CANDIDATOS, dadosCandidatos });
      dispatch(calculaScore());
    })
    .then(res => {
      axios
        .get("/api/respostas/estados/" + filtro.estado + "/naoresponderam")
        .then(respostas => {
          console.timeEnd("getNaoResponderam");

          respostas.data.forEach(resp => {
            dadosCandidatos[resp.cpf] = resp;
            numSemResposta++;
          });

          dispatch({ type: SET_DADOS_CANDIDATOS, dadosCandidatos });
          dispatch({ type: SET_NUM_RESPOSTAS, numResponderam, numSemResposta });
          dispatch(calculaScore());
        });
    });
};

export const getDadosCandidato = (
  idCandidato,
  respostasUsuario,
  arrayRespostasUsuario
) => (dispatch, getState) => {
  dispatch(setCandidatosCarregando());

  const quantValidos = arrayRespostasUsuario.filter(
    value => value !== 0 && value !== -2
  ).length;
  const numRespostasUsuario = quantValidos === 0 ? 1 : quantValidos;

  console.time("pega1Candidato");

  axios.get("/api/respostas/candidatos/" + idCandidato).then(respostas => {
    console.timeEnd("pega1Candidato");

    const dadosCandidato = respostas.data[0];

    const score = comparaRespostas(
      dadosCandidato.respostas,
      respostasUsuario,
      numRespostasUsuario
    );

    dadosCandidato.score = score;

    dispatch({ type: SET_DADOS_CANDIDATO, dadosCandidato });
    dispatch(calculaScorePorTema(respostasUsuario, arrayRespostasUsuario));
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

export const mostrarTodosCandidatos = () => dispatch => {
  dispatch({ type: SET_MOSTRAR_TODOS_CANDIDATOS });
};
