import {
  SET_INDEX_PERGUNTA,
  SET_INDEX_VOTACAO,
  SET_TEMA,
  SET_VAMOS_COMECAR,
  ESCONDE_PERGUNTAS,
  EXIBE_PERGUNTAS,
  SET_CONTINUAR_RESPONDENDO
} from "./types";


export const passaPergunta = () => (dispatch, getState) => {
  const { indexPergunta, TAM_PERGUNTAS } = getState().perguntasReducer;

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

export const vamosComecar = () => dispatch => {
  dispatch({ type: SET_VAMOS_COMECAR });
};

export const escondePerguntas = () => dispatch => {
  dispatch({ type: ESCONDE_PERGUNTAS });
};

export const exibePerguntas = () => dispatch => {
  dispatch({ type: EXIBE_PERGUNTAS });
};

export const continuarRespondendo = () => dispatch => {
  dispatch({ type: SET_CONTINUAR_RESPONDENDO });
};