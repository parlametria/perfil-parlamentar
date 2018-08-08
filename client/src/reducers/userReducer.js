import { SET_USER_SCORE } from "../actions/types";

const QUESTIONS_SIZE = 50; // Deve ser substituído por um perguntas.size() depois, quando tivermos acesso às perguntas.

// userVotings: {id_votacao: voto}
// arrayVotings: [0/1/-1]
const initialState = {
  userVotings: [].fill.call({ length: QUESTIONS_SIZE }, 0),
  arrayVotings: Array(QUESTIONS_SIZE).fill(1)
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_SCORE:
      return {
        ...state,
        userVotings: action.userVotings,
        arrayVotings: action.arrayVotings
      };
    default:
      return state;
  }
}
