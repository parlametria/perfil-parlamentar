function formataRespostas(resultado) {
  const resultadoNovo = resultado.map(cand => cand.get({ plain: true }));

  resultadoNovo.forEach(cand => {
    const respostas = {};
    cand.cpf_resp.forEach(resposta => {
      respostas[resposta.pergunta_id] = resposta.resposta;
    });
    cand.respostas = respostas;
    delete cand.cpf_resp;
  });
  return resultadoNovo;
}

function formataVotacoes(resultado) {
  const resultadoNovo = resultado.map(cand => cand.get({ plain: true }));

  resultadoNovo.forEach(cand => {
    const votacoes = {};
    cand.cpf_vot.forEach(vot => {
      votacoes[vot.proposicao_id] = vot.resposta;
    });
    cand.votacoes = votacoes;
    delete cand.cpf_vot;
  });
  return resultadoNovo;
}
module.exports = { formataRespostas, formataVotacoes };