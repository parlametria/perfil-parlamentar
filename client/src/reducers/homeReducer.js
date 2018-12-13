import { SET_RESPONDER_QUIZ, SET_VER_RESULTADOS } from "../actions/types";

const initialState = {
  activeTab: "quiz"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_RESPONDER_QUIZ:
      return {
        ...state,
        activeTab: "quiz"
      };
    case SET_VER_RESULTADOS:
      return {
        ...state,
        activeTab: "resultados"
      };
    default:
      return state;
  }
}
