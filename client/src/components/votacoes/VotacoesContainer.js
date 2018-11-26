import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Votacao from "./Votacao";

import {
  getDadosVotacoes,
  setVotacoesCarregando
} from "../../actions/votacoesActions";

import {
  salvaRespostasUsuario
} from "../../actions/usuarioActions";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class VotacoesContainer extends Component {
  constructor(props) {
    super(props);

    this.state = { copied: false };

    this.passaPergunta = this.passaPergunta.bind(this);
  }

  registraResposta(novaResposta) {
    const { respostasUsuario } = this.props.usuario;


    respostasUsuario[novaResposta.id] = novaResposta.resposta;
    this.props.salvaRespostasUsuario(respostasUsuario);


    this.props.calculaScore();
    this.passaPergunta();
  }

  async passaPergunta() {
    await delay(400);
    this.props.passaPergunta();
    const { indexPergunta, dadosPerguntas } = this.props.perguntas;

    if (indexPergunta <= 45) {
      this.props.escolheTema(dadosPerguntas[indexPergunta].tema);
    }
  }

  render() {
    const { dadosVotacoes } = this.props.votacoes;
    const { respostasUsuario } = this.props.usuario;

    let votacao = (
      <Votacao
        key={dadosVotacoes.id}
        id={dadosVotacoes.id}
        projLei={dadosVotacoes.num_proj_lei}
        idVotacao={dadosVotacoes.id_votacao}
        titulo={dadosVotacoes.titulo}
        descricao={dadosVotacoes.descricao}
        tema={dadosVotacoes.tema}
        voto={respostasUsuario[dadosVotacoes.id]}
        onVota={novaResposta => this.registraResposta(novaResposta)}
      />
    );
    return (
      <div className="votacao-container">
        {votacao}</div>
    );
  }
}

VotacoesContainer.propTypes = {
  getDadosVotacoes: PropTypes.func.isRequired,
  setVotacoesCarregando: PropTypes.func.isRequired,
  salvaRespostasUsuario: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
  votacoes: state.votacoesReducer,
  usuario: state.usuarioReducer
})

export default connect(
  mapStateToProps,
  {
    getDadosVotacoes,
    setVotacoesCarregando,
    salvaRespostasUsuario
  })
  (VotacoesContainer);

