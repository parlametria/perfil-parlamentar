import { SET_CURRENT_USER } from "./types";
import axios from "axios";

// Login user - Get token
export const loginUser = userData => dispatch => {
  axios.post("/api/auth/facebook", userData).then(res => {
    const { token } = res.data;

    // Verificar se o token é valido e etc e depois setar o usuário ativo.
    //dispatch(setCurrentUser(decoded));
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
  dispatch(setCurrentUser({}));
};
