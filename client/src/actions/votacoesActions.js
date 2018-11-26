import axios from "axios";
import {
  VOTACOES_CARREGANDO,
  SET_DADOS_VOTACOES,
  SET_VOTACOES_CANDIDATOS
} from "./types";

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

export const getVotacoesDeputados = () => (dispatch, getState) => {
  dispatch({ type: VOTACOES_CARREGANDO });

  axios.get("/api/candidatos/votacoes").then(votacoes => {
    let mapaVotacoes = {};

    votacoes.data.forEach(
      votacao => (mapaVotacoes[votacao.cpf] = votacao.votacoes)
    );

    dispatch({
      type: SET_VOTACOES_CANDIDATOS,
      votacoesCandidatos: mapaVotacoes
    });
  });
};
