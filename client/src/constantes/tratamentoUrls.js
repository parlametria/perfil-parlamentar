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
  let dictUrl = {};
  let indice = 0;
  for (let index = 0; index < arrayUrl.length; index++) {
    if(arrayUrl[index] === "-"){
      dictUrl[indice] = arrayUrl[index] + arrayUrl[index + 1];
      index++;
    }else{
      dictUrl[indice] = arrayUrl[index];
    };
    indice++;  
  };
  return dictUrl;
};

export const criaURL = arrayVotos => {
  let urlVotos = "";
  arrayVotos.forEach(voto => {
    urlVotos = urlVotos + voto;
  });
  return urlVotos;
};

export const votosValidos = votos => {
  let valido = true;
  let dictVotos = getDict(votos)
  Object.keys(dictVotos).forEach((chave, index) => {
    if (dictVotos[chave] === "1" || dictVotos[chave] === "-1" || dictVotos[chave] === "0" || dictVotos[chave] === "-2"){
      valido = valido;
    }else{
      valido = false;
    }
  });
  return valido;
};

export const estadoValido = estado => {
};