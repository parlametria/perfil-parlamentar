import { PERGUNTAS_CARREGANDO, SET_DADOS_PERGUNTAS } from "./types";
import { firebaseDatabase } from "../services/firebaseService";

export const getDadosPerguntas = () => dispatch => {
  dispatch(setPerguntasCarregando());

  let dadosPerguntas = {};

  firebaseDatabase
    .ref("/perguntas")
    .once("value")
    .then(snapshot => {
      const perguntas = snapshot.val();
      console.log(perguntas);
      perguntas.map(elem => {
        let arrPerguntas = dadosPerguntas[elem.tema];

        if (arrPerguntas) {
          arrPerguntas.push({ key: elem.id, pergunta: elem.texto });
          dadosPerguntas[elem.tema] = arrPerguntas;
        } else {
          let arrayInicial = [];
          arrayInicial.push({ key: elem.key, pergunta: elem.pergunta });
          dadosPerguntas[elem.tema] = arrayInicial;
        }
      });

      dispatch({ type: SET_DADOS_PERGUNTAS, dadosPerguntas });
    })
    .catch(err => console.log(err));
};

export const setPerguntasCarregando = () => {
  return { type: PERGUNTAS_CARREGANDO };
};
