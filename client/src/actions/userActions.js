import { SET_USER_SCORE } from "./types";

export const saveUserScore = (userVotings, arrayVotings) => {
  return {
    type: SET_USER_SCORE,
    userVotings,
    arrayVotings
  };
};
