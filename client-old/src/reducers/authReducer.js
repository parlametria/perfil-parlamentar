import { SET_CURRENT_USER, IS_LOGGING } from "../actions/types";
import isEmpty from "../validation/is-empty";

const initialState = {
  isAuthenticated: false,
  isLogging: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        isLogging: false
      };
    case IS_LOGGING:
      return {
        ...state,
        isLogging: true
      };
    default:
      return state;
  }
}
