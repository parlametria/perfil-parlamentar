import { VOTACOES_CARREGANDO, SET_DADOS_VOTACOES } from "./types";

import votacoes from "../data/votacoes.json";

export const getDadosVotacoes = () => dispatch => {
  dispatch(setVotacoesCarregando());
  var TAM_PERGUNTAS = Object.keys(votacoes).length;

  let dadosVotacoes = [];
  Object.keys(votacoes).forEach(key => {
    dadosVotacoes[votacoes[key].id] = votacoes[key];
  });
  dispatch({ type: SET_DADOS_VOTACOES, dadosVotacoes, TAM_PERGUNTAS });
};

export const setVotacoesCarregando = () => {
  return { type: VOTACOES_CARREGANDO };
};
