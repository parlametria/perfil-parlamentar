import {
  PERGUNTAS_CARREGANDO,
  SET_DADOS_PERGUNTAS
} from "./types";

//import { firebaseDatabase } from "../services/firebaseService";

import perguntas from "../data/perguntas.json";


export const getDadosPerguntas = () => dispatch => {
  dispatch(setPerguntasCarregando());
  var TAM_PERGUNTAS = Object.keys(perguntas).length;
  let dadosPerguntas = [];

  Object.keys(perguntas).forEach(key => {
    dadosPerguntas[perguntas[key].id] = perguntas[key];
  });

  dispatch({ type: SET_DADOS_PERGUNTAS, dadosPerguntas, TAM_PERGUNTAS });
};

export const setPerguntasCarregando = () => {
  return { type: PERGUNTAS_CARREGANDO };
};
