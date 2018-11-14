import { SET_SCORE_USUARIO } from "./types";
import axios from "axios";

const TAM_PERGUNTAS = 46;

export const salvaScoreUsuario = (respostasUsuario, arrayRespostasUsuario) => {
  return {
    type: SET_SCORE_USUARIO,
    respostasUsuario,
    arrayRespostasUsuario
  };
};
export const salvaRespostasUsuario = (respostasUsuario, arrayRespostasUsuario) => (dispatch, getState) => {
  const { isAuthenticated } = getState().auth;

  dispatch(salvaScoreUsuario(respostasUsuario, arrayRespostasUsuario));

  if (isAuthenticated) {
    axios
      .post("/api/usuarios/respostas/eu", { respostas: respostasUsuario })
      .then(res => {
        console.log(res.data)
      });
  }

}
export const getRespostasUsuario = () => (dispatch) => {
  axios.
    get("/api/usuarios/respostas/eu")
    .then(res => {
      const respostasUsuario = res.data;
      const arrayRespostasUsuario = Array(TAM_PERGUNTAS).fill(0);

      for (var id in respostasUsuario) {
        arrayRespostasUsuario[id] = respostasUsuario[id];
      }

      dispatch(salvaScoreUsuario(respostasUsuario, arrayRespostasUsuario));
    })
}