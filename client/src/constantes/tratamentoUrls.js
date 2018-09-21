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
  arrayUrl.forEach((voto, i) => {
    dictUrl[i] = voto;
  });
  return dictUrl;
};

export const criaURL = arrayVotos => {
  let urlVotos = "";
  arrayVotos.forEach(voto => {
    urlVotos = urlVotos + voto;
  });
  return urlVotos;
};
