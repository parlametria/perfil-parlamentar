import { SET_SCORE_USUARIO } from "./types";

export const salvaScoreUsuario = (respostasUsuario, arrayRespostasUsuario) => {
  return {
    type: SET_SCORE_USUARIO,
    respostasUsuario,
    arrayRespostasUsuario
  };
};
