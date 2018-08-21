import {
  SET_SCORE_CANDIDATOS,
  CANDIDATOS_CARREGANDO,
  CANDIDATOS_CARREGADOS,
  SET_DADOS_CANDIDATOS
} from "./types";
import {
  firebaseDatabase,
  firebaseFirestore
} from "../services/firebaseService";

// Recebe um dicionário das respostas dos candidatos no formato {id_cand: [array_resp]} e retorna um dicionário no formato {id_cand: score}
export const calculaScore = () => (dispatch, getState) => {
  const { arrayRespostasUsuario } = getState().usuarioReducer;
  const respostasCandidatos = getState().candidatosReducer.dadosCandidatos;

  //console.log(respostasCandidatos);

  const quantZeros = arrayRespostasUsuario.filter(value => value !== 0).length;
  const numRespostasUsuario = quantZeros === 0 ? 1 : quantZeros;

  function comparaRespostas(arrayRespostasCandidato) {
    let respostasIguais = 0;
    Object.keys(arrayRespostasCandidato).map((elem, i) => {
      respostasIguais += arrayRespostasCandidato[elem] === arrayRespostasUsuario[i] && arrayRespostasUsuario[i] !== 0 ? 1 : 0;
    });
    return respostasIguais / numRespostasUsuario;
    }


  let scoreCandidatos = {};
  Object.keys(respostasCandidatos).map(elem => {
    let score = comparaRespostas(respostasCandidatos[elem].respostas);
    scoreCandidatos[elem] = score;
  });

  dispatch({
    type: SET_SCORE_CANDIDATOS,
    scoreCandidatos
  });
};

// Pega o top n candidatos baseado na compatibilidade entre as respostas ordenado pelo score. Recebe um dicionário das respostas dos candidatos e retorna um array de arrays (tuplas) com os ids dos candidatos e seu score.
export const getTopNCandidatos = n => (dispatch, getState) => {
  const { scoreCandidatos } = getState().candidatosReducer;
  let candidatos = Object.keys(scoreCandidatos).map(key => [
    key,
    scoreCandidatos[key]
  ]);

  candidatos.sort((a, b) => {
    if (a[1] > b[1]) return -1;
    else if (a[1] === b[1]) return 0;
    else return 1;
  });

  return candidatos.slice(0, n);
};

export const getDadosCandidatos = () => dispatch => {
  dispatch(setCandidatosCarregando());

  let dadosCandidatos = {};

console.time('order');  
firebaseDatabase
.ref("/resultados").orderByKey().limitToFirst(4000).on("value", function(snapshot) {
    const candidatos = snapshot.toJSON();
    const keys = Object.keys(candidatos);
    keys.map(key => {
      dadosCandidatos[candidatos[key].id] = candidatos[key];
    });
    dispatch({ type: SET_DADOS_CANDIDATOS, dadosCandidatos });
    console.timeEnd('order');
  });

console.time('order1');  
firebaseDatabase
.ref("/resultados").orderByKey().limitToLast(4000).on("value", function(snapshot) {
    const candidatos = snapshot.toJSON();
    const keys = Object.keys(candidatos);
    keys.map(key => {
      dadosCandidatos[candidatos[key].id] = candidatos[key];
    });
    dispatch({ type: SET_DADOS_CANDIDATOS, dadosCandidatos });
    console.timeEnd('order1');
  });

  Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

  setTimeout(function(){
    console.log(Object.size(dadosCandidatos));
}, 7000);

  // console.time('snap');  
  // firebaseDatabase
  //   .ref("/resultados")
  //   .once("value")
  //   .then(snapshot => {
  //     const candidatos = snapshot.val();
  //     const keys = Object.keys(candidatos);
  //     keys.map(key => {
  //       dadosCandidatos[candidatos[key].id] = candidatos[key];
  //     });
  //     dispatch({ type: SET_DADOS_CANDIDATOS, dadosCandidatos });
  //     console.timeEnd('snap');
  //     console.log(dadosCandidatos)
  //   })
  //   .catch(err => console.log(err));
};

export const setCandidatosCarregando = () => {
  return {
    type: CANDIDATOS_CARREGANDO
  };
};

export const setCandidatosCarregados = () => {
  return {
    type: CANDIDATOS_CARREGADOS
  };
};

