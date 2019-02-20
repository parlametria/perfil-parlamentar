/**
 * 
 */
function calcularAlinhamento(parlamentares, respostas) {
  const alinhamentos = parlamentares.map(parlamentar => parlamentar.get({ plain: true }));

  alinhamentos.forEach(parlamentar => {
    if (typeof respostas === 'undefined') {
      parlamentar.alinhamento = {
        respostasIguais: 0
      };
      console.log('sem respostas');
      
      return;
    }

    let respostasIguais = 0;
    parlamentar.cpf_vot.forEach(votacao => {
      console.log(respostas);
      respostasIguais += 1;
      // respostasIguais += 
      //   (respostas[votacao.proposicao_id] !== undefined &&
      //    respostas[votacao.proposicao_id] !== null &&
      //    respostas[votacao.proposicao_id] === votacao.resposta)
      //   ? 1
      //   : 0;
    });
    parlamentar.alinhamento = {
      respostasIguais: respostasIguais
    };
  });

  return alinhamentos;
}

module.exports = {
  calcularAlinhamento
}