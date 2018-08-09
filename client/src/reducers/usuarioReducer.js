import { SET_SCORE_USUARIO } from "../actions/types";

const TAM_PERGUNTAS = 50; // Deve ser substituído por um perguntas.size() depois, quando tivermos acesso às perguntas.

// userVotings: {id_votacao: voto}
// arrayVotings: [0/1/-1]
const initialState = {
  respostasUsuario: [].fill.call({ length: TAM_PERGUNTAS }, 0),
  arrayRespostasUsuario: Array(TAM_PERGUNTAS).fill(1)
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SCORE_USUARIO:
      return {
        ...state,
        respostasUsuario: action.respostasUsuario,
        arrayRespostasUsuario: action.arrayRespostasUsuario
      };
    default:
      return state;
  }
}
