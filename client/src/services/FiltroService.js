import isEmpty from "../validation/is-empty";
import axios from "axios";

export const filtra = (filtro) => {
  return axios
    .get(
      "api/respostas/estados/" + filtro.estado + "?partido=" + filtro.partido + "&nome=" + filtro.nome + "&respondeu=" + filtro.respondeu + "&reeleicao=" + filtro.reeleicao
    );

};
