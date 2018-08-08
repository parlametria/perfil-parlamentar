import { SET_CANDIDATE_SCORE } from "./types";

export const calculateScore = candidatesVotings => (dispatch, getState) => {
  const userVotings = getState().userReducer.arrayVotings;
  const nVotingsUser = userVotings.filter(value => value !== 0).length;

  function comparaRespostas(arrayCandidate) {
    let equalVotings = 0;
    for (let i = 0; i < arrayCandidate.length; i++) {
      equalVotings +=
        arrayCandidate[i] === userVotings[i] && userVotings[i] !== 0 ? 1 : 0;
    }
    return equalVotings / nVotingsUser;
  }

  const candidatesScore = Object.keys(candidatesVotings).map(elem => {
    let score = comparaRespostas(candidatesVotings[elem]);

    return { id_dep: elem, score };
  });

  console.log(candidatesScore);

  dispatch({
    type: SET_CANDIDATE_SCORE,
    candidatesScore
  });
};
