import axios from "axios";
import {
  VOTACOES_CARREGANDO,
  SET_DADOS_VOTACOES,
  SET_VOTACOES_CANDIDATOS
} from "./types";

import { calculaScore } from "./candidatosActions";

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

    dispatch(calculaScore());
  });
};
