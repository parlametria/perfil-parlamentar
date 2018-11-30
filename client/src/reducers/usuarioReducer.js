import { SET_SCORE_USUARIO, SET_SCORE_USUARIO_LIMPO } from "../actions/types";
import perguntas from "../data/perguntas.json";
import votacoes from "../data/votacoes.json";

const TAM_PERGUNTAS = Object.keys(perguntas).length;

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
  quantidadeVotos: 0,
  respondeuTodos: false,
  tamPerguntas: TAM_PERGUNTAS
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
        quantidadeVotos: contaVotos(action.respostasUsuario),
        respondeuTodos: contaVotos(action.respostasUsuario) === TAM_PERGUNTAS
      };
    case SET_SCORE_USUARIO_LIMPO:
      return {
        ...state,
        respostasUsuario: inicializaRespostasUsuario(),
        quantidadeVotos: 0,
        respondeuTodos: false
      };
    default:
      return state;
  }
}
