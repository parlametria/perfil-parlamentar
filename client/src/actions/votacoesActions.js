import { VOTACOES_CARREGANDO, SET_DADOS_VOTACOES } from "./types";

import votacoes from "../data/votacoes.json";

export const getDadosVotacoes = () => dispatch => {
  dispatch(setVotacoesCarregando());

  let dadosVotacoes = {};
  Object.keys(votacoes).forEach(id => {
    dadosVotacoes[votacoes[id].id_votacao] = votacoes[id];
  });
  dispatch({ type: SET_DADOS_VOTACOES, dadosVotacoes });
};

export const setVotacoesCarregando = () => {
  return { type: VOTACOES_CARREGANDO };
};
