import { combineReducers } from "redux";
import authReducer from "./authReducer";
import usuarioReducer from "./usuarioReducer";
import candidatosReducer from "./candidatosReducer";
import perguntasReducer from "./perguntasReducer";
import votacoesReducer from "./votacoesReducer";
import questionarioReducer from "./questionarioReducer";
import homeReducer from "./homeReducer";

export default combineReducers({
  auth: authReducer,
  usuarioReducer,
  candidatosReducer,
  perguntasReducer,
  votacoesReducer,
  questionarioReducer,
  homeReducer
});
