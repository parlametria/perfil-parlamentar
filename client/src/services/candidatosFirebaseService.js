import { firebaseDatabase } from "./firebaseService";
import { CANDIDATOS_CARREGANDO, CANDIDATOS_CARREGADOS } from "../actions/types";

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
