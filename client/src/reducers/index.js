import { combineReducers } from "redux";
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import candidatesReducer from "./candidatesReducer";

export default combineReducers({
  auth: authReducer,
  userReducer: userReducer,
  candidatesReducer: candidatesReducer
});
