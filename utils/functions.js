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

module.exports = { formataRespostas };
