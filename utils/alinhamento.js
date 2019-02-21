/**
 *
 */
function calcularAlinhamento(parlamentares, respostas) {
  const alinhamentos = parlamentares.map(parlamentar =>
    parlamentar.get({ plain: true })
  );

  alinhamentos.forEach(parlamentar => {
    if (typeof respostas === "undefined") {
      parlamentar.alinhamento = {
        respostasIguais: 0,
        perguntasIguais: 0,
        alinhamento: 0
      };

      return;
    }

    // Calcula numerador e denominador do alinhamento
    let respostasIguais = 0;
    let perguntasIguais = 0;
    parlamentar.cpf_vot.forEach(votacao => {
      // console.log(respostas[votacao.proposicao_id] + " == " + votacao.resposta);
      if (
        (respostas[votacao.proposicao_id] == 1 ||
          respostas[votacao.proposicao_id] == 0) &&
        (votacao.resposta == 1 || votacao.resposta == 0)
      ) {
        perguntasIguais++;
        respostasIguais +=
          respostas[votacao.proposicao_id] === votacao.resposta ? 1 : 0;
      }
    });
    // Calcula alinhamento de fato, caso haja mais de 3 perguntas iguais
    let alinhamento =
      perguntasIguais > 3 ? respostasIguais / perguntasIguais : 0;

    parlamentar.alinhamento = {
      respostasIguais: respostasIguais,
      perguntasIguais: perguntasIguais,
      alinhamento: alinhamento
    };
  });

  return alinhamentos;
}

module.exports = {
  calcularAlinhamento
};
