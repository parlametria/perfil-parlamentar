import { SET_SCORE_USUARIO, SET_SCORE_USUARIO_LIMPO } from "../actions/types";

import votacoes from "../data/votacoes.json";

const TAM_PERGUNTAS = 46; // Esse tamanho é calculado em perguntasActions, mas não sei como inicializá-lo aqui e em que momento isso seria viável porque esse reducer é chamado antes da chamada ao banco. Então, acho melhor inicializar o array com um tamanho máximo.
const TAM_VOTACOES = 32;

const inicializaRespostasUsuario = () => {
  let respostasUsuario = {};

  let respostasVAVazio = [].fill.call({ length: TAM_PERGUNTAS }, 0);
  delete respostasVAVazio.length;

  let respostasQMRVazio = {};
  Object.keys(votacoes).forEach(id => (respostasQMRVazio[id] = 0));

  respostasUsuario["vozAtiva"] = respostasVAVazio;
  respostasUsuario["qmr"] = respostasQMRVazio;

  return respostasUsuario;
};

// userVotings: {id_votacao: voto}
// arrayVotings: [0/1/-1]
const initialState = {
  respostasUsuario: inicializaRespostasUsuario(),
  arrayRespostasUsuario: Array(TAM_PERGUNTAS).fill(0),
  quantidadeVotos: 0,
  respondeuTodos: false
};

const contaVotos = respostasUsuario => {
  return (
    Object.keys(respostasUsuario.vozAtiva).filter(
      res => respostasUsuario.vozAtiva[res] !== 0
    ).length +
    Object.keys(respostasUsuario.qmr).filter(
      res => respostasUsuario.qmr[res] !== 0
    ).length
  );
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SCORE_USUARIO:
      return {
        ...state,
        respostasUsuario: action.respostasUsuario,
        arrayRespostasUsuario: action.arrayRespostasUsuario,
        quantidadeVotos: contaVotos(action.respostasUsuario),
        respondeuTodos: contaVotos(action.respostasUsuario) === TAM_PERGUNTAS
      };
    case SET_SCORE_USUARIO_LIMPO:
      return {
        ...state,
        respostasUsuario: inicializaRespostasUsuario(),
        arrayRespostasUsuario: Array(TAM_PERGUNTAS).fill(0),
        quantidadeVotos: 0,
        respondeuTodos: false
      };
    default:
      return state;
  }
}
