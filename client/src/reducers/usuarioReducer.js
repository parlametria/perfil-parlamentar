import { SET_SCORE_USUARIO, SET_SCORE_USUARIO_LIMPO } from "../actions/types";
import perguntas from "../data/perguntas.json";


const TAM_PERGUNTAS = Object.keys(perguntas).length;

const inicializaRespostasUsuario = () => {
  let respostasUsuario = [].fill.call({ length: TAM_PERGUNTAS }, 0);
  delete respostasUsuario.length;

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
  const arrayRespostasUsuario = Array(TAM_PERGUNTAS).fill(0);

  for (var id in respostasUsuario) {
    arrayRespostasUsuario[id] = respostasUsuario[id];
  }

  return arrayRespostasUsuario.filter(res => res !== 0).length;
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SCORE_USUARIO:
      return {
        ...state,
        respostasUsuario: action.respostasUsuario,
        quantidadeVotos: contaVotos(action.respostasUsuario),
        respondeuTodos:
          contaVotos(action.respostasUsuario) === TAM_PERGUNTAS
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
