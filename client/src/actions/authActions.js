import { SET_CURRENT_USER } from "./types";
import axios from "axios";

import setAuthToken from "../utils/setAuthToken";

// Login user - Get token
export const facebookLogin = response => dispatch => {
  const tokenBlob = new Blob([JSON.stringify({ access_token: response.accessToken }, null, 2)], { type: 'application/json' });

  const options = {
    method: 'POST',
    url: "api/auth/facebook",
    body: tokenBlob,
    mode: 'cors',
    cache: 'default'
  };

  // axios(options).then(res => {
  //   console.log(res);
  // })

  fetch('api/auth/facebook', options).then(r => {
    const token = r.headers.get('x-auth-token');
    r.json().then(user => {
      if (token) {

        // Set token to localStorage
        localStorage.setItem("accessToken ", token);
        setAuthToken(token);

        dispatch(setCurrentUser(user));
      }
    });
  })
};

export const googleLogin = response => dispatch => {
  const tokenBlob = new Blob([JSON.stringify({ access_token: response.accessToken }, null, 2)], { type: 'application/json' });

  const options = {
    method: 'POST',
    url: "api/auth/google",
    body: tokenBlob,
    mode: 'cors',
    cache: 'default'
  };

  console.log(response);
  console.log(options);

  // axios(options).then(res => {
  //   console.log(res);
  // })

  fetch('api/auth/google', options).then(r => {
    const token = r.headers.get('x-auth-token');
    r.json().then(user => {
      if (token) {

        // Set token to localStorage
        localStorage.setItem("accessToken ", token);
        setAuthToken(token);

        dispatch(setCurrentUser(user));
      }
    });
  })
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
};
