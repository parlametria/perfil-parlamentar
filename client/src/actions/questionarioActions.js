import {
  SET_INDEX_PERGUNTA,
  SET_INDEX_VOTACAO,
  SET_TEMA,
  SET_VAMOS_COMECAR,
  ESCONDE_PERGUNTAS,
  EXIBE_PERGUNTAS,
  SET_CONTINUAR_RESPONDENDO,
  SET_BANDEJA_ATIVA
} from "./types";

export const mudaBandeja = bandejaAtiva => dispatch => {
  console.log(bandejaAtiva);
  dispatch({ type: SET_BANDEJA_ATIVA, bandejaAtiva: bandejaAtiva })
}
export const passaPergunta = () => (dispatch, getState) => {
  const { bandejaAtiva } = getState().questionarioReducer;
  let indexPergunta;
  let TAM_PERGUNTAS;
  let type;
  if (bandejaAtiva === "Voz Ativa") {
    indexPergunta = getState().perguntasReducer.indexPergunta;
    TAM_PERGUNTAS = getState().perguntasReducer.TAM_PERGUNTAS;
    type = SET_INDEX_PERGUNTA;
  } else if (bandejaAtiva === "Votacoes") {
    indexPergunta = getState().votacoesReducer.indexPergunta;
    TAM_PERGUNTAS = getState().votacoesReducer.TAM_PERGUNTAS;
    type = SET_INDEX_VOTACAO;

  }

  let newIndex =
    indexPergunta < TAM_PERGUNTAS - 1 ? indexPergunta + 1 : indexPergunta;

  dispatch({ type: type, indexPergunta: newIndex });
};

export const voltaPergunta = () => (dispatch, getState) => {
  const { bandejaAtiva } = getState().questionarioReducer;
  let indexPergunta;
  let type;
  if (bandejaAtiva === "Voz Ativa") {
    indexPergunta = getState().perguntasReducer.indexPergunta;
    type = SET_INDEX_PERGUNTA;
  } else if (bandejaAtiva === "Votacoes") {
    indexPergunta = getState().votacoesReducer.indexPergunta;
    type = SET_INDEX_VOTACAO;
  }

  let newIndex = indexPergunta > 0 ? indexPergunta - 1 : indexPergunta;

  dispatch({ type: type, indexPergunta: newIndex });
};

export const escolhePergunta = indexPergunta => (dispatch, getState) => {
  const { bandejaAtiva } = getState().questionarioReducer;
  let type;
  if (bandejaAtiva === "Voz Ativa") {
    type = SET_INDEX_PERGUNTA;
  } else if (bandejaAtiva === "Votacoes") {
    type = SET_INDEX_VOTACAO;

  }
  dispatch({ type: type, indexPergunta });
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