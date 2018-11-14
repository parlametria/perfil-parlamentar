import { SET_SCORE_USUARIO } from "./types";
import axios from "axios";

export const salvaScoreUsuario = (respostasUsuario, arrayRespostasUsuario) => {
  return {
    type: SET_SCORE_USUARIO,
    respostasUsuario,
    arrayRespostasUsuario
  };
};
export const salvaRespostasUsuario = () => (dispatch, getState) => {
  const { respostasUsuario } = getState().usuarioReducer;
  return axios
    .post("/api/usuarios/respostas/eu", { respostas: respostasUsuario })
    .then(res => {
      console.log(res.data)
    });

}