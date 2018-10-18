export const filtra = (filtro, dadosCandidatos) => {
  return Object.keys(dadosCandidatos).filter(cpf => {
    const isFiltrandoPorNome = filtro.nome !== "";
    const isFiltrandoPorPartido = filtro.partido !== "Partidos";
    const isFiltrandoPorReeleicao = filtro.reeleicao !== "-1";

    return (
      (dadosCandidatos[cpf].sg_partido === filtro.partido ||
        !isFiltrandoPorPartido) &&
      (dadosCandidatos[cpf].reeleicao === filtro.reeleicao ||
        !isFiltrandoPorReeleicao) &&
      (dadosCandidatos[cpf].nome_urna.indexOf(filtro.nome.toUpperCase()) >= 0 ||
        !isFiltrandoPorNome)
    );
  });
};
