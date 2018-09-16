import {
  SET_SCORE_CANDIDATOS,
  SET_SCORE_CANDIDATO_POR_TEMA,
  SET_DADOS_CANDIDATOS,
  SET_FILTRO_CANDIDATOS,
  CANDIDATOS_CARREGANDO,
  CANDIDATOS_CARREGADOS,
  SET_NUM_RESPOSTAS,
  SET_DADOS_CANDIDATO,
  SET_DADOS_CANDIDATO_POR_CPF,
  SET_MOSTRAR_TODOS_CANDIDATOS,
  SET_CANDIDATOS_FILTRADOS,
  SET_CANDIDATOS_RANQUEADOS,
  SET_MOSTRA_PERGUNTAS,
  SET_PARTIDOS,
  SET_PAGINACAO,
  SET_CANDIDATOS_FILTRANDO
} from "../actions/types";

// candidatesVotings: {id_votacao: voto}
// arrayVotings: [0/1/-1]
// O estado inicial será definido a partir do banco de dados, uma chamada para preencher esses arrays e objetos.
const initialState = {
  numResponderam: 0,
  numSemResposta: 0,
  dadosCandidatos: {},
  isCarregando: false,
  isFiltrandoPorNome: false,
  scoreCandidatos: {},
  filtro: { nome: "", partido: "TODOS", estado: "" },
  candidatosFiltrados: [],
  candidatosRanqueados: [],
  partidos: [],
  dadosCandidato: {},
  scoreTema: {},
  mostrarTodos: false,
  mostraPerguntas: false,
  paginacao: { inicio: 0, final: 0, totalCandidatos: 0 },
  dadosCandidatoBusca: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_DADOS_CANDIDATOS:
      return {
        ...state,
        dadosCandidatos: action.dadosCandidatos,
        isCarregando: false
      };
    case SET_DADOS_CANDIDATO:
      return {
        ...state,
        dadosCandidato: action.dadosCandidato,
        isCarregando: false
      };
    case SET_DADOS_CANDIDATO_POR_CPF:
      return {
        ...state,
        dadosCandidatoBusca: action.candidato,
        isCarregando: false
      };
    case SET_SCORE_CANDIDATOS:
      return {
        ...state,
        scoreCandidatos: action.scoreCandidatos
      };
    case SET_SCORE_CANDIDATO_POR_TEMA:
      return {
        ...state,
        scoreTema: action.scoreTema
      };
    case CANDIDATOS_CARREGANDO:
      return {
        ...state,
        isCarregando: true
      };
    case CANDIDATOS_CARREGADOS:
      return {
        ...state,
        isCarregando: false
      };
    case SET_FILTRO_CANDIDATOS:
      return {
        ...state,
        filtro: action.filtro
      };
    case SET_NUM_RESPOSTAS:
      return {
        ...state,
        numResponderam: action.numResponderam,
        numSemResposta: action.numSemResposta
      };
    case SET_MOSTRAR_TODOS_CANDIDATOS:
      return {
        ...state,
        mostrarTodos: true
      };
    case SET_MOSTRA_PERGUNTAS:
      return {
        ...state,
        mostraPerguntas: true
      };
    case SET_CANDIDATOS_FILTRADOS:
      return {
        ...state,
        candidatosFiltrados: action.candidatosFiltrados,
        isFiltrandoPorNome: false
      };
    case SET_CANDIDATOS_RANQUEADOS:
      return {
        ...state,
        candidatosRanqueados: action.candidatosRanqueados
      };
    case SET_PARTIDOS:
      return {
        ...state,
        partidos: action.partidos
      };
    case SET_PAGINACAO:
      return {
        ...state,
        paginacao: action.paginacao
      };
    case SET_CANDIDATOS_FILTRANDO:
      return {
        ...state,
        isFiltrandoPorNome: true
      };
    default:
      return state;
  }
}
