import { combineReducers } from "redux";
import authReducer from "./authReducer";
import usuarioReducer from "./usuarioReducer";
import candidatosReducer from "./candidatosReducer";

export default combineReducers({
  auth: authReducer,
  usuarioReducer: usuarioReducer,
  candidatosReducer: candidatosReducer
});
