import {
  SET_CURRENT_USER,
  SET_SCORE_USUARIO_LIMPO,
  ESCONDE_PERGUNTAS,
  IS_LOGGING,
  SET_SCORE_USUARIO
} from "./types";
import axios from "axios";

import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { getRespostasUsuario } from "./usuarioActions";

// Login user - Get token
export const facebookLogin = response => (dispatch, getState) => {
  const { respostasUsuario } = getState().usuarioReducer;

  const tokenBlob = new Blob(
    [
      JSON.stringify(
        { access_token: response.accessToken, respostas: respostasUsuario },
        null,
        2
      )
    ],
    { type: "application/json" }
  );

  const options = {
    method: "POST",
    url: "api/auth/facebook",
    body: tokenBlob,
    mode: "cors",
    cache: "default"
  };

  dispatch({ type: IS_LOGGING });

  fetch("api/auth/facebook", options).then(r => {
    const token = r.headers.get("authorization");

    r.json().then(user => {
      if (token) {
        // Set token to localStorage
        localStorage.setItem("accessToken", token);
        setAuthToken(token);

        dispatch(setCurrentUser(user));
        dispatch(getRespostasUsuario());
      }
    });
  });
};

export const googleLogin = response => (dispatch, getState) => {
  const { respostasUsuario } = getState().usuarioReducer;

  const tokenBlob = new Blob(
    [
      JSON.stringify(
        { access_token: response.accessToken, respostas: respostasUsuario },
        null,
        2
      )
    ],
    { type: "application/json" }
  );

  const options = {
    method: "POST",
    url: "api/auth/google",
    body: tokenBlob,
    mode: "cors",
    cache: "default"
  };

  dispatch({ type: IS_LOGGING });

  fetch("api/auth/google", options).then(r => {
    const token = r.headers.get("authorization");
    r.json().then(user => {
      if (token) {
        // Set token to localStorage
        localStorage.setItem("accessToken", token);
        setAuthToken(token);

        dispatch(setCurrentUser(user));

        dispatch(getRespostasUsuario());
      }
    });
  });
};

export const twitterLogin = jwtToken => dispatch => {
  const decoded = jwt_decode(jwtToken);

  localStorage.setItem("accessToken", jwtToken);

  setAuthToken(jwtToken);

  dispatch(setCurrentUser(decoded));
};

export const testaAutorizacao = () => dispatch => {
  axios.get("api/auth/test").then(resp => {
    console.log(resp);
  });
};

export const facebookLoginComCodigo = codigo => dispatch => {
  dispatch({
    type: SET_SCORE_USUARIO,
    respostasUsuario: JSON.parse(localStorage.getItem("respostasUsuario")),
    arrayRespostasUsuario: localStorage
      .getItem("arrayRespostasUsuario")
      .split(",")
      .map(Number)
  });

  localStorage.removeItem("respostasUsuario");
  localStorage.removeItem("arrayRespostasUsuario");

  axios.get("api/auth/usingFacebookCode/?code=" + codigo).then(response => {
    let r = response.data;
    r.accessToken = response.data.access_token;
    dispatch(facebookLogin(r));
  });
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Logout
export const logoutUser = () => dispatch => {
  localStorage.removeItem("accessToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
  dispatch({ type: SET_SCORE_USUARIO_LIMPO });
};
