import { listaEstados } from "./filtrosSeletoresCandidatos";
import votacoes from "../data/votacoes.json";
import perguntas from "../data/perguntas.json";

export const getArrayUrl = url => {
  let arrayUrl = [];
  for (var i = 0; i < url.length; i++) {
    if (url[i] === "-") {
      arrayUrl.push(Number(url[i] + url[i + 1]));
      i++;
    } else {
      arrayUrl.push(Number(url[i]));
    }
  }
  return arrayUrl;
};

export const getDict = arrayUrl => {
  const TAM_PERGUNTAS = Object.keys(perguntas).length;

  let respostasUsuario = {};
  respostasUsuario.vozAtiva = {};
  respostasUsuario.votacoes = {};

  let indice = 0;
  for (let index = 0; index < TAM_PERGUNTAS; index++) {
    if (arrayUrl[index] === "-") {
      respostasUsuario.vozAtiva[indice] = arrayUrl[index] + arrayUrl[index + 1];
      index++;
    } else {
      respostasUsuario.vozAtiva[indice] = arrayUrl[index];
    }
    indice++;
  }

  Object.keys(votacoes).forEach(idVotacao => {
    const id = votacoes[idVotacao].id;

    respostasUsuario.votacoes[idVotacao] = arrayUrl[id + TAM_PERGUNTAS];
  });

  return respostasUsuario;
};

export const criaURL = respostasUsuario => {
  let urlVotos = "";

  const { vozAtiva, votacoes } = respostasUsuario;
  const idsVozAtiva = Object.keys(vozAtiva);
  const idsQMR = Object.keys(votacoes);

  let arrayVotos = Array(idsVozAtiva.length + idsQMR.length).fill(0);

  idsVozAtiva.forEach(id => {
    arrayVotos[Number(id)] = vozAtiva[id];
  });

  idsQMR.forEach(idVotacao => {
    arrayVotos[Number(votacoes[idVotacao].id) + idsVozAtiva.length] =
      votacoes[idVotacao];
  });

  arrayVotos.forEach(voto => {
    urlVotos = urlVotos + voto;
  });

  return urlVotos;
};

export const votosValidos = votos => {
  let valido = true;
  let dictVotos = getDict(votos);
  Object.keys(dictVotos).forEach((chave, index) => {
    if (
      dictVotos[chave] === "1" ||
      dictVotos[chave] === "-1" ||
      dictVotos[chave] === "0" ||
      dictVotos[chave] === "-2"
    ) {
    } else {
      valido = false;
    }
  });
  return valido;
};

export const estadoValido = estado => {
  let valido = true;
  let listaEstadosValidos = listaEstados();
  if (listaEstadosValidos.includes(estado)) {
  } else {
    valido = false;
  }
  return valido;
};
