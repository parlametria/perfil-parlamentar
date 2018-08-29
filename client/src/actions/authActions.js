// import { SET_CURRENT_USER } from "./types";

// import firebase from "firebase";
// import { provider } from "../services/firebaseService";

// // Login user - Get token
// export const loginUser = () => dispatch => {
//   firebase
//     .auth()
//     .signInWithPopup(provider)
//     .then(result => {
//       // Save to local storage
//       const { accessToken } = result.credential;

//       // Get info from Google data
//       const { user } = result;

//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("user", JSON.stringify(user));

//       // Set current user
//       dispatch(setCurrentUser(user));
//     });
// };

// // Set logged in user
// export const setCurrentUser = decoded => {
//   return {
//     type: SET_CURRENT_USER,
//     payload: decoded
//   };
// };

// // Logout
// export const logoutUser = () => dispatch => {
//   localStorage.removeItem("accessToken");
//   dispatch(setCurrentUser({}));
// };
