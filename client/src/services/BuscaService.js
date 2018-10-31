import axios from "axios";

export const buscaCPF = cpf => {
  return axios.get("/api/candidatos/" + cpf);
};
