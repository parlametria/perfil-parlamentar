import { SET_SCORE_USUARIO } from "./types";
import { calculaScore } from "./candidatosActions";

import axios from "axios";

export const salvaScoreUsuario = respostasUsuario => {
  return {
    type: SET_SCORE_USUARIO,
    respostasUsuario
  };
};
export const salvaRespostasUsuario = (respostasUsuario, idResp) => (
  dispatch,
  getState
) => {
  const { isAuthenticated } = getState().auth;

  dispatch(salvaScoreUsuario(respostasUsuario));

  if (isAuthenticated) {
    axios
      .post("/api/usuarios/respostas/eu?idResp=" + idResp, {
        respostas: respostasUsuario
      })
      .then(res => {});
  }
};
export const getRespostasUsuario = () => dispatch => {
  axios.get("/api/usuarios/respostas/eu").then(res => {
    const respostasUsuario = res.data;
    dispatch(salvaScoreUsuario(respostasUsuario));
    dispatch(calculaScore());
  });
};
