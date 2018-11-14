import { SET_SCORE_USUARIO } from "./types";
import axios from "axios";

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
      const arrayRespostasUsuario = Array.from(res.data);
      console.log(arrayRespostasUsuario);

      dispatch(salvaScoreUsuario(respostasUsuario, arrayRespostasUsuario));
    })
}