import {
  PERGUNTAS_CARREGANDO,
  SET_DADOS_PERGUNTAS,
  SET_INDEX_PERGUNTA,
  SET_TEMA
} from "./types";
import { firebaseDatabase } from "../services/firebaseService";

var TAM_PERGUNTAS;

export const getDadosPerguntas = () => dispatch => {
  dispatch(setPerguntasCarregando());

  let dadosPerguntas = Array(60).fill(0);

  firebaseDatabase
    .ref("/perguntas")
    .once("value")
    .then(snapshot => {
      const perguntas = snapshot.toJSON();
      TAM_PERGUNTAS = Object.keys(perguntas).length;
      Object.keys(perguntas).map(key => {
        dadosPerguntas[perguntas[key].id] = perguntas[key];
      });
      dispatch({ type: SET_DADOS_PERGUNTAS, dadosPerguntas });
    })
    .catch(err => console.log(err));
};

export const setPerguntasCarregando = () => {
  return { type: PERGUNTAS_CARREGANDO };
};

export const passaPergunta = () => (dispatch, getState) => {
  const { indexPergunta } = getState().perguntasReducer;

  let newIndex =
    indexPergunta < TAM_PERGUNTAS - 1 ? indexPergunta + 1 : indexPergunta;

  dispatch({ type: SET_INDEX_PERGUNTA, indexPergunta: newIndex });
};

export const voltaPergunta = () => (dispatch, getState) => {
  const { indexPergunta } = getState().perguntasReducer;

  let newIndex = indexPergunta > 0 ? indexPergunta - 1 : indexPergunta;

  dispatch({ type: SET_INDEX_PERGUNTA, indexPergunta: newIndex });
};

export const escolhePergunta = indexPergunta => dispatch => {
  dispatch({ type: SET_INDEX_PERGUNTA, indexPergunta });
};

export const escolheTema = tema => dispatch => {
  dispatch({ type: SET_TEMA, tema });
};
