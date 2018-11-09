import { SET_SCORE_USUARIO } from "./types";
import axios from "axios";

export const salvaScoreUsuario = (respostasUsuario, arrayRespostasUsuario) => {
  return {
    type: SET_SCORE_USUARIO,
    respostasUsuario,
    arrayRespostasUsuario
  };
};
export const salvaRespostasUsuario = () => (getState) => {
  const { respostasUsuario } = getState().usuarioReducer;
  axios
    .post("/api/usuarios/respostas", respostasUsuario)
    .then(res => console.log(res));
}