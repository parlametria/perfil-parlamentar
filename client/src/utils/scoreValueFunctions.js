export const getScoreWidth = (score) => {
  if(score === -1) 
    return 0;
  else 
    return score;    
}

export const getScoreLabel = (score) => {
  if(score === -1) 
    return "--";
  else 
    return Math.round(score * 100).toString() + "%";   
}