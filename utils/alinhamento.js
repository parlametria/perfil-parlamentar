/**
 * 
 */
function calcularAlinhamento(parlamentares, respostas) {
  const alinhamentos = parlamentares.map(parlamentar => parlamentar.get({ plain: true }));

  alinhamentos.forEach(parlamentar => {
    if (typeof respostas === 'undefined') {
      parlamentar.alinhamento = {
        respostasIguais: 0,
        perguntasIguais: 0,
        alinhamento: 0,
        totalPerguntas: respostas.lenght
      };
      
      return;
    }

    let respostasIguais = 0;
    let perguntasIguais = 0;
    parlamentar.cpf_vot.forEach(votacao => {
      // console.log(respostas[votacao.proposicao_id] + " == " + votacao.resposta);
      if (respostas[votacao.proposicao_id] !== undefined && respostas[votacao.proposicao_id] !== null) {
        perguntasIguais++;
        respostasIguais += (respostas[votacao.proposicao_id] === votacao.resposta) ? 1 : 0;
      }
    });
    parlamentar.alinhamento = {
      respostasIguais: respostasIguais,
      perguntasIguais: perguntasIguais,
      alinhamento: respostasIguais / perguntasIguais,
      totalPerguntas: respostas.lenght
    };
  });

  return alinhamentos;
}

module.exports = {
  calcularAlinhamento
}