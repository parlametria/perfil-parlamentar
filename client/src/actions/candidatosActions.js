import {
  SET_SCORE_CANDIDATOS,
  SET_SCORE_CANDIDATO_POR_TEMA,
  CANDIDATOS_CARREGANDO,
  CANDIDATOS_CARREGADOS,
  SET_DADOS_CANDIDATOS,
  SET_FILTRO_CANDIDATOS,
  SET_DADOS_CANDIDATO,
  SET_DADOS_CANDIDATO_POR_CPF,
  SET_MOSTRAR_TODOS_CANDIDATOS,
  SET_MOSTRA_PERGUNTAS,
  SET_CANDIDATOS_RANQUEADOS,
  SET_CANDIDATOS_FILTRADOS,
  SET_PARTIDOS,
  SET_PAGINACAO,
  SET_CANDIDATOS_FILTRANDO,
  SET_TOTAL_RESPONDERAM_ESTADO,
  SET_TOTAL_RESPOSTAS_ESTADO,
  SET_TOTAL_RESPONDERAM_PARTIDO,
  SET_TOTAL_RESPOSTAS_PARTIDO,
  SET_ACTIVE_TAB
} from "./types";

import { TAM_PAGINA, ITENS_POR_REQ } from "../constantes/constantesCandidatos";

import {
  filtraPorNome,
  filtraPorPartido,
  filtraPorNomeEPartido
} from "../services/FiltroService";

import { buscaCPF } from "../services/BuscaService";

import axios from "axios";
import isEmpty from "../validation/is-empty";

const comparaRespostas = (
  respostasCandidatos,
  respostasUsuario,
  numRespostasUsuario
) => {
  let respostasIguais = 0;
  const chaves = Object.keys(respostasUsuario);
  chaves.forEach(idPergunta => {
    respostasIguais +=
      respostasCandidatos[idPergunta] !== undefined &&
      respostasCandidatos[idPergunta] !== null &&
      respostasUsuario[idPergunta] !== 0 &&
      respostasUsuario[idPergunta] !== -2 &&
      respostasCandidatos[idPergunta] === respostasUsuario[idPergunta]
        ? 1
        : 0;
  });

  return respostasIguais / numRespostasUsuario;
};

// Recebe um dicionário das respostas dos candidatos no formato {id_cand: [array_resp]} e retorna um dicionário no formato {id_cand: score}
export const calculaScore = () => (dispatch, getState) => {
  const { respostasUsuario } = getState().usuarioReducer;
  const { arrayRespostasUsuario } = getState().usuarioReducer;
  const respostasCandidatos = getState().candidatosReducer.dadosCandidatos;
  const quantValidos = arrayRespostasUsuario.filter(
    value => value !== 0 && value !== -2
  ).length;
  const numRespostasUsuario = quantValidos === 0 ? 1 : quantValidos;

  let scoreCandidatos = {};
  Object.keys(respostasCandidatos).forEach(elem => {
    let score = comparaRespostas(
      respostasCandidatos[elem].respostas,
      respostasUsuario,
      numRespostasUsuario
    );
    scoreCandidatos[elem] = score;
  });

  dispatch({
    type: SET_SCORE_CANDIDATOS,
    scoreCandidatos
  });
  dispatch(getTopNCandidatos(Object.keys(scoreCandidatos).length));
};

export const calculaScorePorTema = (
  respostasUsuario,
  arrayRespostasUsuario
) => (dispatch, getState) => {
  const { dadosCandidato } = getState().candidatosReducer;
  const perguntas = getState().perguntasReducer.dadosPerguntas;

  let nomeTemas = new Set();
  perguntas.forEach(elem => {
    nomeTemas.add(elem.tema);
  });

  let temas = {};
  perguntas.forEach(pergunta => {
    if (isEmpty(temas[pergunta.tema])) {
      temas[pergunta.tema] = [];
      temas[pergunta.tema].push(pergunta);
    } else {
      temas[pergunta.tema].push(pergunta);
    }
  });

  let scoreTema = {};
  nomeTemas.forEach(nomeTema => {
    scoreTema[nomeTema] = 0;
  });

  Object.keys(temas).forEach(tema => {
    let score = 0;
    let respostasCandidatosTema = {};
    perguntas.forEach(pergunta => {
      if (pergunta.tema === tema) {
        respostasCandidatosTema[pergunta.id] =
          dadosCandidato.respostas[pergunta.id];
      }
    });
    const primeiroID = temas[tema][0].id;
    const ultimoID = temas[tema][temas[tema].length - 1].id;

    temas[tema].forEach(pergunta => {
      const quantValidos = arrayRespostasUsuario
        .slice(primeiroID, ultimoID + 1)
        .filter(value => value !== 0 && value !== -2).length;
      const numRespostasUsuario = quantValidos === 0 ? 1 : quantValidos;
      score = comparaRespostas(
        respostasCandidatosTema,
        respostasUsuario,
        numRespostasUsuario
      );
    });
    scoreTema[tema] = score;
  });

  dispatch({
    type: SET_SCORE_CANDIDATO_POR_TEMA,
    scoreTema
  });
};

export const buscaPorCPF = cpf => (dispatch, getState) => {
  let candidato;
  dispatch(setCandidatosCarregando());

  buscaCPF(cpf).then(dados => {
    candidato = isEmpty(dados.data[0]) ? null : dados.data[0];
    dispatch({ type: SET_DADOS_CANDIDATO_POR_CPF, candidato: candidato });
  });
};

// Pega o top n candidatos baseado na compatibilidade entre as respostas ordenado pelo score. Recebe um dicionário das respostas dos candidatos e retorna um array de arrays (tuplas) com os ids dos candidatos e seu score.

// A função de ordenação prioriza os candidatos que responderam ao questionário. Caso os dois tenham respondido ou ambos não tenham respondido, a ordenação será dada alfabeticamente.
export const getTopNCandidatos = n => (dispatch, getState) => {
  const {
    scoreCandidatos,
    dadosCandidatos,
    totalRespostasEstado
  } = getState().candidatosReducer;
  let matrizScores = Object.keys(scoreCandidatos).map(key => [
    key,
    scoreCandidatos[key]
  ]);

  const candidatos = matrizScores
    .sort((a, b) => {
      if (a[1] > b[1]) return -1;
      else if (a[1] === b[1]) {
        if (
          !isEmpty(dadosCandidatos[a[0]]) &&
          !isEmpty(dadosCandidatos[b[0]])
        ) {
          if (
            (dadosCandidatos[a[0]].respondeu &&
              dadosCandidatos[b[0]].respondeu) ||
            (!dadosCandidatos[a[0]].respondeu &&
              !dadosCandidatos[b[0]].respondeu)
          )
            return dadosCandidatos[a[0]].nome_urna.localeCompare(
              dadosCandidatos[b[0]].nome_urna
            );
          else if (dadosCandidatos[b[0]].respondeu) return 1;
          else return -1;
        }
        return 0;
      } else return 1;
    })
    .map(candidato => candidato[0]);

  dispatch({
    type: SET_CANDIDATOS_RANQUEADOS,
    candidatosRanqueados: candidatos.slice(0, n)
  });
  dispatch(
    setPaginacao({
      inicio: 0,
      final: TAM_PAGINA,
      totalCandidatos: totalRespostasEstado,
      paginaAtual: 1
    })
  );
};

export const getDadosCandidatos = () => (dispatch, getState) => {
  dispatch(setCandidatosCarregando());
  console.log("carregando");

  const { filtro } = getState().candidatosReducer;

  let dadosCandidatos = {};

  axios
    .get(
      "/api/respostas/estados/" + filtro.estado + "/responderam/totalcandidatos"
    )
    .then(totalCandidatos => {
      dispatch({
        type: SET_TOTAL_RESPONDERAM_ESTADO,
        totalResponderam: totalCandidatos.data
      });
    });

  axios
    .get("/api/respostas/estados/" + filtro.estado + "/totalcandidatos")
    .then(totalCandidatos => {
      dispatch({
        type: SET_TOTAL_RESPOSTAS_ESTADO,
        totalRespostas: totalCandidatos.data
      });
    });

  console.time("getResponderam");
  console.time("getNaoResponderam");

  axios
    .get("/api/respostas/estados/" + filtro.estado + "/responderam")
    .then(respostas => {
      console.timeEnd("getResponderam");

      respostas.data.forEach(resp => {
        dadosCandidatos[resp.cpf] = resp;
      });

      dispatch({ type: SET_DADOS_CANDIDATOS, dadosCandidatos });
      dispatch(setPartidos());
      dispatch(calculaScore());
    });

  axios
    .get("/api/respostas/estados/" + filtro.estado + "/naoresponderam")
    .then(respostas => {
      console.timeEnd("getNaoResponderam");

      respostas.data.data.forEach(resp => {
        dadosCandidatos[resp.cpf] = resp;
      });

      dispatch({ type: SET_DADOS_CANDIDATOS, dadosCandidatos });
      dispatch(setPartidos());
      dispatch(calculaScore());
    });
};

export const getDadosCandidato = (
  idCandidato,
  respostasUsuario,
  arrayRespostasUsuario
) => (dispatch, getState) => {
  dispatch(setCandidatosCarregando());

  const quantValidos = arrayRespostasUsuario.filter(
    value => value !== 0 && value !== -2
  ).length;
  const numRespostasUsuario = quantValidos === 0 ? 1 : quantValidos;

  console.time("pega1Candidato");

  axios
    .get("/api/respostas/candidatos/" + idCandidato)
    .then(respostas => {
      console.timeEnd("pega1Candidato");

      const dadosCandidato = respostas.data[0];

      const score = comparaRespostas(
        dadosCandidato.respostas,
        respostasUsuario,
        numRespostasUsuario
      );

      dadosCandidato.score = score;

      dispatch({ type: SET_DADOS_CANDIDATO, dadosCandidato });
      dispatch(calculaScorePorTema(respostasUsuario, arrayRespostasUsuario));
    })
    .then(() => {
      axios.get("/api/candidatos/" + idCandidato + "/votacoes").then(res => {
        const { dadosCandidato } = getState().candidatosReducer;

        const votacoes = !isEmpty(res.data[0]) ? res.data[0].votacoes : {};

        dadosCandidato.votacoes = votacoes;

        dispatch({
          type: SET_DADOS_CANDIDATO,
          dadosCandidato: dadosCandidato
        });
      });
    });
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

export const setCandidatosFiltrados = () => (dispatch, getState) => {
  const {
    dadosCandidatos,
    filtro,
    scoreCandidatos,
    candidatosRanqueados
  } = getState().candidatosReducer;

  dispatch(setCandidatosFiltrando());

  axios
    .get(
      "api/respostas/estados/" +
        filtro.estado +
        "/partidos/" +
        filtro.partido +
        "/totalcandidatos"
    )
    .then(totalCandidatos =>
      dispatch({
        type: SET_TOTAL_RESPOSTAS_PARTIDO,
        totalRespostas: totalCandidatos.data
      })
    );

  axios
    .get(
      "api/respostas/estados/" +
        filtro.estado +
        "/partidos/" +
        filtro.partido +
        "/responderam/totalcandidatos"
    )
    .then(totalCandidatos =>
      dispatch({
        type: SET_TOTAL_RESPONDERAM_PARTIDO,
        totalResponderam: totalCandidatos.data
      })
    );

  let candidatos;
  if (filtro.nome === "" && filtro.partido === "TODOS") candidatos = [];
  else if (filtro.partido !== "TODOS" && filtro.nome !== "") {
    candidatos = filtraPorNomeEPartido(
      filtro.nome,
      filtro.partido,
      dadosCandidatos
    );
  } else if (filtro.partido !== "TODOS") {
    candidatos = filtraPorPartido(
      filtro.partido,
      dadosCandidatos,
      scoreCandidatos
    );
  } else if (filtro.nome !== "") {
    candidatos = filtraPorNome(filtro.nome, dadosCandidatos);
  } else candidatos = [];

  dispatch({
    type: SET_CANDIDATOS_FILTRADOS,
    candidatosFiltrados: candidatos
  });
  dispatch(
    setPaginacao({
      inicio: 0,
      final: TAM_PAGINA,
      totalCandidatos:
        filtro.partido !== "TODOS" || filtro.nome !== ""
          ? candidatos.length
          : candidatosRanqueados.length
    })
  );
};

export const setFiltroCandidatos = filtro => dispatch => {
  dispatch({ type: SET_FILTRO_CANDIDATOS, filtro });
};

export const mostrarTodosCandidatos = () => dispatch => {
  dispatch({ type: SET_MOSTRAR_TODOS_CANDIDATOS });
};

export const setPartidos = () => (dispatch, getState) => {
  const { dadosCandidatos } = getState().candidatosReducer;
  let partidosSet = new Set();

  Object.keys(dadosCandidatos).forEach(candidato =>
    partidosSet.add(dadosCandidatos[candidato].sg_partido)
  );

  let partidos = Array.from(partidosSet).sort((a, b) => a.localeCompare(b));

  partidos.splice(0, 0, "TODOS");

  dispatch({ type: SET_PARTIDOS, partidos: partidos });
};

export const setPaginacao = paginacao => dispatch => {
  dispatch({ type: SET_PAGINACAO, paginacao: paginacao });
};

export const setCandidatosFiltrando = () => {
  return {
    type: SET_CANDIDATOS_FILTRANDO
  };
};

export const getProximaPaginaCandidatos = () => (dispatch, getState) => {
  const {
    paginacao,
    filtro,
    candidatosRanqueados
  } = getState().candidatosReducer;

  axios
    .get(
      "/api/respostas/estados/" +
        filtro.estado +
        "/naoresponderam?pageNo=" +
        paginacao.paginaAtual +
        "&size=" +
        ITENS_POR_REQ
    )
    .then(respostas => {
      console.log(paginacao.paginaAtual);

      respostas.data.data.forEach(resposta =>
        candidatosRanqueados.push(resposta.cpf)
      );

      console.log(candidatosRanqueados);
      dispatch({
        type: SET_CANDIDATOS_RANQUEADOS,
        candidatosRanqueados: candidatosRanqueados
      });
    });
};

export const setActiveTab = activeTab => (dispatch, getState) => {
  dispatch({
    type: SET_ACTIVE_TAB,
    activeTab: activeTab
  });

  dispatch({
    type: SET_ACTIVE_TAB,
    activeTab: activeTab
  });
};
