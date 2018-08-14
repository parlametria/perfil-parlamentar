import { combineReducers } from "redux";
import authReducer from "./authReducer";
import usuarioReducer from "./usuarioReducer";
import candidatosReducer from "./candidatosReducer";
import perguntasReducer from "./perguntasReducer";

export default combineReducers({
  auth: authReducer,
  usuarioReducer,
  candidatosReducer,
  perguntasReducer
});
