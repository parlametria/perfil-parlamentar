import { SET_SCORE_USUARIO, SET_SCORE_USUARIO_LIMPO } from "../actions/types";
import perguntas from "../data/perguntas.json";
import votacoes from "../data/votacoes.json";

const TAM_PERGUNTAS = Object.keys(perguntas).length;
const TAM_VOTACOES = Object.keys(votacoes).length;

const inicializaRespostasUsuario = () => {
  let respostasUsuario = {};

  let respostasVAVazio = [].fill.call({ length: TAM_PERGUNTAS }, 0);
  delete respostasVAVazio.length;

  let respostasVotacoesVazio = {};
  Object.keys(votacoes).forEach(id => (respostasVotacoesVazio[id] = 0));

  respostasUsuario["vozAtiva"] = respostasVAVazio;
  respostasUsuario["votacoes"] = respostasVotacoesVazio;

  return respostasUsuario;
};

// userVotings: {id_votacao: voto}
// arrayVotings: [0/1/-1]
const initialState = {
  respostasUsuario: inicializaRespostasUsuario(),
  quantidadeVotos: 0,
  respondeuTodos: false,
  respondeuVozAtiva: false,
  respondeuVotacoes: false,
  tamPerguntas: TAM_PERGUNTAS,
  tamVotacoes: TAM_VOTACOES
};

const contaTodosVotos = respostasUsuario => {
  return (
    contaVotos(respostasUsuario.vozAtiva) +
    contaVotos(respostasUsuario.votacoes)
  );
};

const contaVotos = respostasUsuario => {
  return Object.keys(respostasUsuario).filter(
    res => respostasUsuario[res] !== 0
  ).length;
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SCORE_USUARIO:
      return {
        ...state,
        respostasUsuario: action.respostasUsuario,
        quantidadeVotos: contaTodosVotos(action.respostasUsuario),
        respondeuTodos:
          contaTodosVotos(action.respostasUsuario) ===
          TAM_PERGUNTAS + TAM_VOTACOES,
        respondeuVozAtiva:
          contaVotos(action.respostasUsuario.vozAtiva) === TAM_PERGUNTAS,
        respondeuVotacoes:
          contaVotos(action.respostasUsuario.votacoes) === TAM_VOTACOES
      };
    case SET_SCORE_USUARIO_LIMPO:
      return {
        ...state,
        respostasUsuario: inicializaRespostasUsuario(),
        quantidadeVotos: 0,
        respondeuTodos: false,
        respondeuVozAtiva: false,
        respondeuVotacoes: false
      };
    default:
      return state;
  }
}
