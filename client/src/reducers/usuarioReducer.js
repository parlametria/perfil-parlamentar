import { SET_SCORE_USUARIO } from "../actions/types";

const TAM_PERGUNTAS = 46; // Esse tamanho é calculado em perguntasActions, mas não sei como inicializá-lo aqui e em que momento isso seria viável porque esse reducer é chamado antes da chamada ao banco. Então, acho melhor inicializar o array com um tamanho máximo.

const inicializaRespostasUsuario = () => {
  let respostasUsuario = [].fill.call({ length: TAM_PERGUNTAS }, 0);
  delete respostasUsuario.length;

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

const contaVotos = arrayRespostasUsuario => {
  return arrayRespostasUsuario.filter(res => res !== 0).length;
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SCORE_USUARIO:
      return {
        ...state,
        respostasUsuario: action.respostasUsuario,
        arrayRespostasUsuario: action.arrayRespostasUsuario,
        quantidadeVotos: contaVotos(action.arrayRespostasUsuario),
        respondeuTodos:
          contaVotos(action.arrayRespostasUsuario) === TAM_PERGUNTAS
      };
    default:
      return state;
  }
}
