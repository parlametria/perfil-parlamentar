/**
 * Retorna o alinhamento para uma lista de parlamentares
 */
function calcularAlinhamentos(parlamentares, respostas, proposicoes, temasAtivos) {
  
  const alinhamentos = parlamentares.map(parlamentar =>
    parlamentar.get({ plain: true })
  );

  const proposicoesTemas = proposicoes.map(props =>
    props.get({ plain: true })
  );

  const temas = temasAtivos.map(props =>
    props.get({ plain: true })
  );
  // const temas = proposicoesTemas.map(item => item.proposicaoVotacoes.temas[0].idTema)
  //   .filter((value, index, self) => self.indexOf(value) === index);

  // const temas = proposicoesTemas.map(item => {
  //   return (
  //     {
  //       idTema: item.proposicaoVotacoes.temas[0].idTema,
  //       tema: item.proposicaoVotacoes.temas[0].tema
  //     }
  //   )
  // });

  let temasAlinhamento = [];

  temas.forEach((tema) => {
    totalPerguntas = proposicoesTemas.filter(value => value.proposicaoVotacoes.temas[0].idTema === tema.idTema).length;
    
    obj = {
      idTema: tema.idTema,
      tema: tema.tema,
      respostasIguais: 0,
      perguntasIguais: 0,
      totalPerguntas: totalPerguntas,
      alinhamento: 0
    };

    temasAlinhamento.push(obj);
  });

  alinhamentos.forEach(parlamentar => {
    parlamentar.alinhamento = calcular(parlamentar, respostas, proposicoesTemas, temasAlinhamento);
    delete parlamentar.votos;
  });

  return alinhamentos;
}

/**
 * Calcula alinhamento entre um parlamentar e as respostas de uma pessoa
 */
function calcular(parlamentar, respostas, proposicoesTemas, temasAlinhamento) {

  if (typeof respostas === "undefined" || respostas === null) {
    return {
      respostasIguais: 0,
      perguntasIguais: 0,
      totalperguntas: proposicoesTemas.length,
      alinhamento: 0,
      temas: temasAlinhamento
    };
  }

  // Cria cópia do objeto de alinhamento dos temas
  let temas = JSON.parse(JSON.stringify(temasAlinhamento));

  let respostasIguais = 0;
  let perguntasIguais = 0;
  
  parlamentar.votos.forEach(voto => {
    
    if (
      (respostas[voto.idVotacao] === 1 || respostas[voto.idVotacao] === -1) &&
      (voto.voto === 1 || voto.voto === -1)
    ) {
      perguntasIguais++;
      respostasIguais += respostas[voto.idVotacao] === voto.voto ? 1 : 0;
           
      let temaVotacao = proposicoesTemas.filter(prop => { return prop.idVotacao === voto.idVotacao })[0].proposicaoVotacoes.temas[0];

      if (temaVotacao) {
        let temaIndex = temas.findIndex(tema => tema.idTema === temaVotacao.idTema);

        // Atualiza variáveis (perguntasIguais e respostasIguais) para o tema da votação atualmente no loop
        temas[temaIndex].perguntasIguais += 1;
        temas[temaIndex].respostasIguais += respostas[voto.idVotacao] === voto.voto ? 1 : 0;
      }
    }
  });

  // Calcula alinhamento
  temas.forEach((tema) => {
    tema.alinhamento = tema.perguntasIguais >= 3 ? tema.respostasIguais / tema.perguntasIguais : 0;
  });

  let alinhamento = perguntasIguais >= 3 ? respostasIguais / perguntasIguais : 0;

  return {
    respostasIguais: respostasIguais,
    perguntasIguais: perguntasIguais,
    totalPerguntas: proposicoesTemas.length,
    alinhamento: alinhamento,
    temas: temas
  }
}

module.exports = {
  calcularAlinhamentos,
  calcular
};
