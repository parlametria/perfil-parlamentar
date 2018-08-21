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
      Object.keys(perguntas).map((elem, i) => {
        let arrPerguntas = dadosPerguntas[perguntas[elem].tema];
        if (arrPerguntas) {
          arrPerguntas.push({ key: perguntas[elem].id, pergunta: perguntas[elem].texto });
          dadosPerguntas[perguntas[elem].tema] = arrPerguntas;
        } else {
          let arrayInicial = [];
          arrayInicial.push({ key: perguntas[elem].id, pergunta: perguntas[elem].texto });
          dadosPerguntas[perguntas[elem].tema] = arrayInicial;
        }
      });
      dispatch({ type: SET_DADOS_PERGUNTAS, dadosPerguntas });
    })
    .catch(err => console.log(err));
};



export const setPerguntasCarregando = () => {
  return { type: PERGUNTAS_CARREGANDO };
};