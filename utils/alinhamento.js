/**
 * Retorna o alinhamento para uma lista de parlamentares
 */
function calcularAlinhamentos(parlamentares, respostas) {
  const alinhamentos = parlamentares.map(parlamentar =>
    parlamentar.get({ plain: true })
  );

  alinhamentos.forEach(parlamentar => {
    parlamentar.alinhamento = calcular(parlamentar, respostas);
  });

  return alinhamentos;
}

/**
 * Calcula alinhamento entre um parlamentar e as respostas de uma pessoa
 */
function calcular(parlamentar, respostas) {
  if (typeof respostas === "undefined" || respostas === null) {
    return {
      respostasIguais: 0,
      perguntasIguais: 0,
      alinhamento: 0
    };
  }

  let respostasIguais = 0;
  let perguntasIguais = 0;
  parlamentar.cpf_vot.forEach(votacao => {
    if (
      (respostas[votacao.proposicao_id] === 1 || respostas[votacao.proposicao_id] === -1) &&
      (votacao.resposta === 1 || votacao.resposta === -1)
    ) {
      perguntasIguais++;
      respostasIguais += respostas[votacao.proposicao_id] === votacao.resposta ? 1 : 0;
    }
  });
  
  let alinhamento = perguntasIguais > 3 ? respostasIguais / perguntasIguais : 0;
  
  return {
    respostasIguais: respostasIguais,
    perguntasIguais: perguntasIguais,
    alinhamento: alinhamento
  }
}

module.exports = {
  calcularAlinhamentos,
  calcular
};
