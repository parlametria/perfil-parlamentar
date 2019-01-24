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
  SET_CANDIDATOS_RANQUEADOS,
  SET_CANDIDATOS_FILTRADOS,
  SET_PARTIDOS,
  SET_PAGINACAO,
  SET_CANDIDATOS_FILTRANDO,
  SET_TOTAL_RESPONDERAM_ESTADO,
  SET_TOTAL_RESPOSTAS_ESTADO,
  SET_TOTAL_RESPONDERAM_PARTIDO,
  SET_TOTAL_RESPOSTAS_PARTIDO,
  SET_ACTIVE_TAB,
  SET_TOTAL_ELEITOS_ESTADO,
  SET_VER_TODOS_ELEITOS,
  SET_VOTOS_IGUAIS_USUARIO_CANDIDATOS
} from "./types";

import { getVotacoesDeputados } from "./votacoesActions";

import { TAM_PAGINA, ITENS_POR_REQ } from "../constantes/constantesCandidatos";

import { filtra } from "../services/FiltroService";

import { buscaCPF } from "../services/BuscaService";

import axios from "axios";
import isEmpty from "../validation/is-empty";

import votacoes from "../data/votacoes.json";
import perguntas from "../data/perguntas.json";

export const comparaRespostas = (
  idCandidato,
  respostasCandidatos,
  respostasUsuarioVozAtiva,
  respostasUsuarioVotacoes,
  votacoesCandidatos,
  numRespostasUsuario
) => {
  let respostasIguais = 0;
  const idsVozAtiva = Object.keys(respostasUsuarioVozAtiva);
  idsVozAtiva.forEach(idPergunta => {
    respostasIguais +=
      respostasCandidatos[idPergunta] !== undefined &&
      respostasCandidatos[idPergunta] !== null &&
      respostasUsuarioVozAtiva[idPergunta] !== 0 &&
      respostasUsuarioVozAtiva[idPergunta] !== -2 &&
      respostasCandidatos[idPergunta] === respostasUsuarioVozAtiva[idPergunta]
        ? 1
        : 0;
  });

  const idsVotacoes = Object.keys(respostasUsuarioVotacoes);
  idsVotacoes.forEach(idPergunta => {
    respostasIguais +=
      votacoesCandidatos[idPergunta] !== undefined &&
      votacoesCandidatos[idPergunta] !== null &&
      respostasUsuarioVotacoes[idPergunta] !== 0 &&
      respostasUsuarioVotacoes[idPergunta] !== -2 &&
      votacoesCandidatos[idPergunta] === respostasUsuarioVotacoes[idPergunta]
        ? 1
        : 0;
  });

  return respostasIguais;
};

const filtraIdsPorTema = (tema, dadosVotacoes, dadosPerguntas) => {
  let idsVozAtiva, idsVotacoes;

  if (tema !== "Temas") {
    idsVozAtiva = dadosPerguntas
      .filter(pergunta => pergunta.tema === tema)
      .map(pergunta => pergunta.id);

    idsVotacoes = dadosVotacoes
      .filter(votacao => votacao.tema === tema)
      .map(votacao => votacao.id_votacao);
  } else {
    idsVozAtiva = dadosPerguntas.map(pergunta => pergunta.id);

    idsVotacoes = dadosVotacoes.map(votacao => votacao.id_votacao);
  }

  return { idsVozAtiva, idsVotacoes };
};

const filtraRespostasEVotacoesPorID = (
  respostas,
  votacoes,
  idsVozAtiva,
  idsVotacoes
) => {
  let respostasFiltradas = {};
  let votacoesFiltradas = {};

  idsVozAtiva.forEach(id => {
    respostasFiltradas[id] = respostas[id];
  });

  idsVotacoes.forEach(id => {
    votacoesFiltradas[id] = isEmpty(votacoes[id]) ? 0 : votacoes[id];
  });

  return { respostasFiltradas, votacoesFiltradas };
};

const verificaQuantidadeVotos = (
  idsVozAtiva,
  idsVotacoes,
  respostasUsuario
) => {
  let perguntasRespondidas, votacoesRespondidas;

  perguntasRespondidas = idsVozAtiva.filter(
    id =>
      respostasUsuario.vozAtiva[id] !== 0 &&
      respostasUsuario.vozAtiva[id] !== -2
  );

  votacoesRespondidas = idsVotacoes.filter(
    id =>
      respostasUsuario.votacoes[id] !== 0 &&
      respostasUsuario.votacoes[id] !== -2
  );

  return {
    perguntasRespondidas,
    votacoesRespondidas
  };
};

export const calculaScore = dadosPergunta => dispatch => {
  if (dadosPergunta) dispatch(atualizaScore(dadosPergunta));
  else dispatch(calculaTodoScore());
};

export const atualizaScore = ({ idPergunta, respostaAnterior }) => (
  dispatch,
  getState
) => {
  const { respostasUsuario } = getState().usuarioReducer;
  const { dadosCandidatos } = getState().candidatosReducer;
  const { votacoesCandidatos } = getState().votacoesReducer;

  const { perguntasRespondidas, votacoesRespondidas } = verificaQuantidadeVotos(
    Object.keys(perguntas).map(e => perguntas[e].id),
    Object.keys(votacoes),
    respostasUsuario
  );

  let { votosIguaisUsuarioCandidatos } = getState().candidatosReducer;

  const respostasConsideradas = () => {
    let tipoPergunta;
    if (respostasUsuario.vozAtiva[idPergunta]) {
      tipoPergunta = "vozAtiva";
      return { tipoPergunta, respostasUsuario: respostasUsuario.vozAtiva };
    } else {
      tipoPergunta = "votacoes";
      return { tipoPergunta, respostasUsuario: respostasUsuario.votacoes };
    }
  };

  const respostasConsideradasUsuario = respostasConsideradas();

  let scoreCandidatos = {};
  Object.keys(dadosCandidatos).forEach(elem => {
    const naoRespondeuVozAtiva = !dadosCandidatos[elem].respondeu;
    const naoRespondeuCamara = isEmpty(votacoesCandidatos[elem]);

    if (
      respostasConsideradasUsuario.tipoPergunta === "votacoes" &&
      naoRespondeuCamara
    ) {
      scoreCandidatos[elem] = 0;
      return;
    }
    if (
      respostasConsideradasUsuario.tipoPergunta === "vozAtiva" &&
      naoRespondeuVozAtiva
    ) {
      scoreCandidatos[elem] = 0;
      return;
    }

    const respostasCandidatosConsideradas =
      respostasConsideradasUsuario.tipoPergunta === "votacoes"
        ? votacoesCandidatos[elem]
        : dadosCandidatos[elem].respostas;

    let numRespostasConsideradas;
    if (!naoRespondeuCamara && !naoRespondeuVozAtiva)
      numRespostasConsideradas =
        perguntasRespondidas.length + votacoesRespondidas.length;
    else if (naoRespondeuCamara)
      numRespostasConsideradas =
        perguntasRespondidas.length === 0 ? 1 : perguntasRespondidas.length;
    else
      numRespostasConsideradas =
        votacoesRespondidas.length === 0 ? 1 : votacoesRespondidas.length;

    if (respostaAnterior === 0 || respostaAnterior === -2) {
      if (
        respostasConsideradasUsuario.respostasUsuario[idPergunta] ===
        respostasCandidatosConsideradas[idPergunta]
      )
        votosIguaisUsuarioCandidatos[elem] =
          votosIguaisUsuarioCandidatos[elem] + 1;
    } else {
      if (
        respostasConsideradasUsuario.respostasUsuario[idPergunta] ===
        respostasCandidatosConsideradas[idPergunta]
      )
        votosIguaisUsuarioCandidatos[elem] =
          votosIguaisUsuarioCandidatos[elem] + 1;
      else
        votosIguaisUsuarioCandidatos[elem] =
          votosIguaisUsuarioCandidatos[elem] - 1;
    }

    scoreCandidatos[elem] =
      votosIguaisUsuarioCandidatos[elem] / numRespostasConsideradas;
  });

  dispatch({
    type: SET_SCORE_CANDIDATOS,
    scoreCandidatos
  });
  dispatch({
    type: SET_VOTOS_IGUAIS_USUARIO_CANDIDATOS,
    votosIguaisUsuarioCandidatos
  });
  dispatch(getTopNCandidatos(Object.keys(scoreCandidatos).length));
};

// Recebe um dicionário das respostas dos candidatos no formato {id_cand: [array_resp]} e retorna um dicionário no formato {id_cand: score}
export const calculaTodoScore = () => (dispatch, getState) => {
  const { respostasUsuario } = getState().usuarioReducer;
  const { dadosCandidatos } = getState().candidatosReducer;
  const { filtro } = getState().candidatosReducer;
  const { votacoesCandidatos, dadosVotacoes } = getState().votacoesReducer;  
  const { dadosPerguntas } = getState().perguntasReducer;   
    
  const { idsVozAtiva, idsVotacoes } = filtraIdsPorTema(
    filtro.tema,
    dadosVotacoes,
    dadosPerguntas
  );

  const { perguntasRespondidas, votacoesRespondidas } = verificaQuantidadeVotos(
    idsVozAtiva,
    idsVotacoes,
    respostasUsuario
  );

  let scoreCandidatos = {};
  let votosIguaisUsuarioCandidatos = {};
  Object.keys(dadosCandidatos).forEach(elem => {
    const naoRespondeuVozAtiva = !dadosCandidatos[elem].respondeu;

    const naoRespondeuCamara = isEmpty(votacoesCandidatos[elem]);

    const {
      respostasFiltradas,
      votacoesFiltradas
    } = filtraRespostasEVotacoesPorID(
      dadosCandidatos[elem].respostas,
      naoRespondeuCamara ? {} : votacoesCandidatos[elem],
      perguntasRespondidas,
      votacoesRespondidas
    );

    let numRespostasConsideradas;
    if (!naoRespondeuCamara && !naoRespondeuVozAtiva)
      numRespostasConsideradas =
        perguntasRespondidas.length + votacoesRespondidas.length;
    else if (naoRespondeuCamara)
      numRespostasConsideradas =
        perguntasRespondidas.length === 0 ? 1 : perguntasRespondidas.length;
    else
      numRespostasConsideradas =
        votacoesRespondidas.length === 0 ? 1 : votacoesRespondidas.length;

    let respostasIguais = comparaRespostas(
      elem,
      respostasFiltradas,
      respostasUsuario.vozAtiva,
      respostasUsuario.votacoes,
      votacoesFiltradas,
      numRespostasConsideradas
    );

    scoreCandidatos[elem] = respostasIguais / numRespostasConsideradas;
    votosIguaisUsuarioCandidatos[elem] = respostasIguais;
  });

  dispatch({
    type: SET_SCORE_CANDIDATOS,
    scoreCandidatos
  });
  dispatch({
    type: SET_VOTOS_IGUAIS_USUARIO_CANDIDATOS,
    votosIguaisUsuarioCandidatos
  });
  dispatch(getTopNCandidatos(Object.keys(scoreCandidatos).length));
};

export const calculaScorePorTema = (
  respostasUsuario,
  arrayRespostasUsuario
) => (dispatch, getState) => {
  const { dadosCandidato } = getState().candidatosReducer;
  const perguntas = getState().perguntasReducer.dadosPerguntas;
  const { votacoesCandidatos } = getState().votacoesReducer;

  let nomeTemas = new Set();

  perguntas.forEach(elem => {
    nomeTemas.add(elem.tema);
  });

  Object.keys(votacoes).forEach(keyVotacao => {
    const votacao = votacoes[keyVotacao];
    nomeTemas.add(votacao.tema);
  });

  let scoreTema = {};
  nomeTemas.forEach(nomeTema => {
    scoreTema[nomeTema] = 0;
  });

  let perguntasPorTema = {};
  perguntas.forEach(pergunta => {
    if (isEmpty(perguntasPorTema[pergunta.tema])) {
      perguntasPorTema[pergunta.tema] = [];
      perguntasPorTema[pergunta.tema].push(pergunta.id);
    } else {
      perguntasPorTema[pergunta.tema].push(pergunta.id);
    }
  });

  let votacoesPorTema = {};
  Object.keys(votacoes).forEach(keyVotacao => {
    const votacao = votacoes[keyVotacao];

    if (isEmpty(votacoesPorTema[votacao.tema])) {
      votacoesPorTema[votacao.tema] = [];
      votacoesPorTema[votacao.tema].push(votacao.id_votacao);
    } else {
      votacoesPorTema[votacao.tema].push(votacao.id_votacao);
    }
  });

  nomeTemas.forEach(tema => {
    const respostasValidasVA = perguntasPorTema[tema]
      ? perguntasPorTema[tema].filter(
          id =>
            respostasUsuario.vozAtiva[id] !== 0 &&
            respostasUsuario.vozAtiva[id] !== -2
        ).length
      : 0;

    const respostasValidasVotacoes =
      votacoesPorTema[tema] && !isEmpty(dadosCandidato.votacoes)
        ? votacoesPorTema[tema].filter(
            id =>
              respostasUsuario.votacoes[id] !== 0 &&
              respostasUsuario.votacoes[id] !== -2
          ).length
        : 0;

    const numRespostasUsuario =
      respostasValidasVA + respostasValidasVotacoes === 0
        ? 1
        : respostasValidasVA + respostasValidasVotacoes;

    let respostasCandidatosTema = {};
    let votacoesCandidatosTema = {};

    if (perguntasPorTema[tema]) {
      perguntasPorTema[tema].forEach(idPergunta => {
        respostasCandidatosTema[idPergunta] =
          dadosCandidato.respostas[idPergunta];
      });
    }

    if (votacoesCandidatos[dadosCandidato.cpf]) {
      votacoesPorTema[tema].forEach(idVotacao => {
        votacoesCandidatosTema[idVotacao] =
          votacoesCandidatos[dadosCandidato.cpf][idVotacao];
      });
    }

    if (!isEmpty(dadosCandidato.votacoes)) {
      votacoesPorTema[tema].forEach(idVotacao => {
        votacoesCandidatosTema[idVotacao] = dadosCandidato.votacoes[idVotacao];
      });
    }

    const naoRespondeuVozAtiva =
      Object.keys(dadosCandidato.respostas).filter(
        id => dadosCandidato.respostas[id] !== 0
      ).length === 0;

    const naoRespondeuCamara = isEmpty(dadosCandidato.votacoes);

    let numRespostasConsideradas;
    if (!naoRespondeuCamara && !naoRespondeuVozAtiva)
      numRespostasConsideradas = numRespostasUsuario;
    else if (naoRespondeuCamara)
      numRespostasConsideradas =
        respostasValidasVA === 0 ? 1 : respostasValidasVA;
    else
      numRespostasConsideradas =
        respostasValidasVotacoes === 0 ? 1 : respostasValidasVotacoes;

    let score = comparaRespostas(
      dadosCandidato.cpf,
      respostasCandidatosTema,
      respostasUsuario.vozAtiva,
      respostasUsuario.votacoes,
      votacoesCandidatosTema,
      numRespostasConsideradas
    );

    scoreTema[tema] = score / numRespostasConsideradas;

    dispatch({
      type: SET_SCORE_CANDIDATO_POR_TEMA,
      scoreTema
    });
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
    totalRespostasEstado,
    totalEleitosEstado,
    activeTab
  } = getState().candidatosReducer;

  const { votacoesCandidatos } = getState().votacoesReducer;

  let matrizScores = Object.keys(scoreCandidatos).map(key => [
    key,
    scoreCandidatos[key]
  ]);

  const candidatos = matrizScores
    .sort((a, b) => {
      if (a[1] > b[1]) return -1;
      else if (a[1] === b[1]) {
        if (
          dadosCandidatos[b[0]].respondeu ||
          dadosCandidatos[b[0]].reeleicao === "1" ||
          !isEmpty(votacoesCandidatos[b[0]])
        )
          return 1;
        else if (
          !isEmpty(dadosCandidatos[a[0]]) &&
          !isEmpty(dadosCandidatos[b[0]]) &&
          !isEmpty(votacoesCandidatos)
        )
          // por nome de urna:
          //{
          //   if (
          //     (((dadosCandidatos[a[0]].respondeu &&
          //       dadosCandidatos[b[0]].respondeu) ||
          //       (!dadosCandidatos[a[0]].respondeu &&
          //         !dadosCandidatos[b[0]].respondeu)) &&
          //       (dadosCandidatos[a[0]].reeleicao === "0" &&
          //         dadosCandidatos[b[0]].reeleicao === "0")) ||
          //     (isEmpty(votacoesCandidatos[a[0]]) &&
          //       isEmpty(votacoesCandidatos[b[0]]))
          //   )
          //     return dadosCandidatos[a[0]].nome_urna.localeCompare(
          //       dadosCandidatos[b[0]].nome_urna
          //     );
          //   else return -1;
          // }
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
      totalCandidatos:
        activeTab === "eleitos" ? totalEleitosEstado : totalRespostasEstado,
      paginaAtual: 1,
      paginaAtualAPI: 1
    })
  );
};

export const getDadosCandidatos = () => (dispatch, getState) => {
  dispatch(setCandidatosCarregando());
  dispatch(getVotacoesDeputados());

  const { filtro, activeTab } = getState().candidatosReducer;

  let dadosCandidatos = {};

  if (activeTab === "eleitos" && filtro.estado !== "TODOS") {
    axios
      .get("/api/respostas/estados/" + filtro.estado + "/eleitos")
      .then(respostas => {
        respostas.data.candidatos.forEach(resp => {
          dadosCandidatos[resp.cpf] = resp;
        });

        dispatch({ type: SET_DADOS_CANDIDATOS, dadosCandidatos });
        dispatch({
          type: SET_TOTAL_ELEITOS_ESTADO,
          totalEleitosEstado: respostas.data.total
        });
        dispatch(setPartidos());
        dispatch(calculaScore());
      });
  } else if (activeTab === "eleitos" && filtro.estado === "TODOS") {
    axios.get("/api/respostas/eleitos").then(respostas => {
      respostas.data.forEach(resp => {
        dadosCandidatos[resp.cpf] = resp;
      });

      dispatch({ type: SET_DADOS_CANDIDATOS, dadosCandidatos });
      dispatch({
        type: SET_TOTAL_ELEITOS_ESTADO,
        totalEleitosEstado: 513
      });
      dispatch(setPartidos());
      dispatch(calculaScore());
    });
  } else {
    axios

      .get("/api/respostas/estados/" + filtro.estado)
      .then(totalCandidatos => {
        dispatch({
          type: SET_TOTAL_RESPOSTAS_ESTADO,
          totalRespostas: totalCandidatos.data.total
        });
      })
      .then(() => {
        axios
          .get(
            "/api/respostas/estados/" +
              filtro.estado +
              "/naoresponderam?pageNo=1&size=" +
              ITENS_POR_REQ
          )
          .then(respostas => {
            respostas.data.data.forEach(resp => {
              dadosCandidatos[resp.cpf] = resp;
            });

            dispatch({ type: SET_DADOS_CANDIDATOS, dadosCandidatos });
            dispatch(setPartidos());
            dispatch(calculaScore());
          });
      });

    axios
      .get("/api/respostas/estados/" + filtro.estado + "/responderam")
      .then(respostas => {
        respostas.data.candidatos.forEach(resp => {
          dadosCandidatos[resp.cpf] = resp;
        });

        dispatch({ type: SET_DADOS_CANDIDATOS, dadosCandidatos });
        dispatch({
          type: SET_TOTAL_RESPONDERAM_ESTADO,
          totalResponderam: respostas.data.total
        });
        dispatch(setPartidos());
        dispatch(calculaScore());
      });
  }
};

export const getDadosCandidato = (
  idCandidato,
  respostasUsuario,
  arrayRespostasUsuario
) => (dispatch, getState) => {
  dispatch(setCandidatosCarregando());

  const quantVotosVozAtiva = Object.keys(respostasUsuario.vozAtiva).filter(
    id =>
      respostasUsuario.vozAtiva[id] !== 0 &&
      respostasUsuario.vozAtiva[id] !== -2
  ).length;

  const quantVotacoesRespondidas = Object.keys(
    respostasUsuario.votacoes
  ).filter(
    id =>
      respostasUsuario.votacoes[id] !== 0 &&
      respostasUsuario.votacoes[id] !== -2
  ).length;

  const numRespostasUsuario =
    quantVotosVozAtiva + quantVotacoesRespondidas === 0
      ? 1
      : quantVotosVozAtiva + quantVotacoesRespondidas;

  axios
    .get("/api/respostas/candidatos/" + idCandidato)
    .then(respostas => {
      const dadosCandidato = respostas.data[0];

      dispatch({ type: SET_DADOS_CANDIDATO, dadosCandidato });
    })
    .then(() => {
      axios.get("/api/candidatos/" + idCandidato + "/votacoes").then(res => {
        const { dadosCandidato } = getState().candidatosReducer;

        const votacoes = !isEmpty(res.data[0]) ? res.data[0].votacoes : {};

        dadosCandidato.votacoes = votacoes;

        const naoRespondeuVozAtiva =
          Object.keys(dadosCandidato.respostas).filter(
            id => dadosCandidato.respostas[id] !== 0
          ).length === 0;

        const naoRespondeuCamara = isEmpty(votacoes);

        let numRespostasConsideradas;
        if (!naoRespondeuCamara && !naoRespondeuVozAtiva)
          numRespostasConsideradas = numRespostasUsuario;
        else if (naoRespondeuCamara)
          numRespostasConsideradas =
            quantVotosVozAtiva === 0 ? 1 : quantVotosVozAtiva;
        else
          numRespostasConsideradas =
            quantVotacoesRespondidas === 0 ? 1 : quantVotacoesRespondidas;

        const score = comparaRespostas(
          idCandidato,
          dadosCandidato.respostas,
          respostasUsuario.vozAtiva,
          respostasUsuario.votacoes,
          votacoes,
          numRespostasConsideradas
        );

        dadosCandidato.score = score / numRespostasConsideradas;

        dispatch({
          type: SET_DADOS_CANDIDATO,
          dadosCandidato: dadosCandidato
        });
        dispatch(calculaScorePorTema(respostasUsuario, arrayRespostasUsuario));
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
    candidatosRanqueados,
    activeTab
  } = getState().candidatosReducer;

  const { votacoesCandidatos } = getState().votacoesReducer;

  dispatch(setCandidatosFiltrando());

  axios
    .get(
      "api/respostas/estados/" + filtro.estado + "/partidos/" + filtro.partido
    )
    .then(totalCandidatos => {
      dispatch({
        type: SET_TOTAL_RESPOSTAS_PARTIDO,
        totalRespostas: totalCandidatos.data.total
      });
    });

  axios
    .get(
      "api/respostas/estados/" +
        filtro.estado +
        "/partidos/" +
        filtro.partido +
        "/responderam"
    )
    .then(totalCandidatos =>
      dispatch({
        type: SET_TOTAL_RESPONDERAM_PARTIDO,
        totalResponderam: totalCandidatos.data.total
      })
    );

  const eleito = activeTab === "eleitos" ? true : "";

  filtra(filtro, eleito).then(todosCandidatos => {
    const cpfCandidatos = {};
    const candidatos = todosCandidatos.data.candidatos;

    candidatos.forEach(candidato => {
      dadosCandidatos[candidato.cpf] = candidato;
      cpfCandidatos[candidato.cpf] = candidato;
    });

    dispatch({
      type: SET_DADOS_CANDIDATOS,
      dadosCandidatos: dadosCandidatos
    });

    dispatch(calculaScore());

    let candidatosOrdenados = Object.keys(cpfCandidatos).sort((a, b) => {
      if (scoreCandidatos[a] > scoreCandidatos[b]) return -1;
      else if (scoreCandidatos[a] < scoreCandidatos[b]) return 1;
      else if (scoreCandidatos[a] === scoreCandidatos[b]) {
        if (!isEmpty(dadosCandidatos[a]) && !isEmpty(dadosCandidatos[b])) {
          if (
            dadosCandidatos[b].respondeu ||
            dadosCandidatos[b].reeleicao === "1" ||
            !isEmpty(votacoesCandidatos[b])
          )
            return 1;
          if (
            (dadosCandidatos[a].respondeu && dadosCandidatos[b].respondeu) ||
            (!dadosCandidatos[a].respondeu &&
              !dadosCandidatos[b].respondeu &&
              ((dadosCandidatos[a].reeleicao === "0" &&
                dadosCandidatos[b].reeleicao === "0") ||
                (isEmpty(votacoesCandidatos[a[0]]) &&
                  isEmpty(votacoesCandidatos[b[0]]))))
          )
            return dadosCandidatos[a].nome_urna.localeCompare(
              dadosCandidatos[b].nome_urna
            );
          else return -1;
        }
        return 0;
      } else return 0;
    });

    dispatch({
      type: SET_CANDIDATOS_FILTRADOS,
      candidatosFiltrados: candidatosOrdenados
    });

    dispatch(
      setPaginacao({
        inicio: 0,
        final: TAM_PAGINA,
        totalCandidatos:
          filtro.partido !== "Partidos" ||
          filtro.nome !== "" ||
          filtro.reeleicao !== "-1" ||
          filtro.responderam !== "-1"
            ? candidatos.length
            : candidatosRanqueados.length
      })
    );
  });
};

export const setFiltroCandidatos = filtro => dispatch => {
  dispatch({ type: SET_FILTRO_CANDIDATOS, filtro });
};

export const mostrarTodosCandidatos = () => dispatch => {
  dispatch({ type: SET_MOSTRAR_TODOS_CANDIDATOS });
};

export const setPartidos = () => (dispatch, getState) => {
  const { filtro, activeTab } = getState().candidatosReducer;
  const eleito = activeTab === "eleitos" ? true : "";
  axios
    .get(
      "api/respostas/estados/" +
        filtro.estado +
        "/partidos" +
        "?eleito=" +
        eleito
    )
    .then(partidos => {
      dispatch({ type: SET_PARTIDOS, partidos: partidos.data.data });
    });
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

  let { dadosCandidatos } = getState().candidatosReducer;

  dispatch(setCandidatosCarregando());

  axios
    .get(
      "/api/respostas/estados/" +
        filtro.estado +
        "/naoresponderam?pageNo=" +
        paginacao.paginaAtualAPI +
        "&size=" +
        ITENS_POR_REQ
    )
    .then(respostas => {
      respostas.data.data.forEach(resposta => {
        candidatosRanqueados.push(resposta.cpf);
        dadosCandidatos[resposta.cpf] = resposta;
      });

      dispatch({
        type: SET_CANDIDATOS_RANQUEADOS,
        candidatosRanqueados: candidatosRanqueados
      });
      dispatch(setCandidatosCarregados());
    });
};

export const setActiveTab = activeTab => (dispatch, getState) => {
  const { filtro } = getState().candidatosReducer;

  dispatch({
    type: SET_ACTIVE_TAB,
    activeTab: activeTab
  });

  const filtroLimpo = {
    nome: "",
    partido: "Partidos",
    estado: filtro.estado,
    reeleicao: "-1",
    respondeu: "-1",
    tema: "Temas"
  };

  dispatch(setFiltroCandidatos(filtroLimpo));
  dispatch(getDadosCandidatos());
};

export const verTodosEleitos = () => dispatch => {
  dispatch({ type: SET_VER_TODOS_ELEITOS });
};
