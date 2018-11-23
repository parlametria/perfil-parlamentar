import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Votacao from "./Votacao";

import {
  getDadosVotacoes,
  setVotacoesCarregando
} from "../../actions/votacoesActions";

class VotacoesContainer extends Component {
  render() {
    const { dadosVotacoes } = this.props.votacoes;
    const { respostasUsuario, arrayRespostasUsuario } = this.props.usuario;
    return (
      <div className="votacao-container">
        <Votacao
          key={dadosVotacoes.key}
          id={dadosVotacoes.id}
          tema={dadosVotacoes.tema}
          idVotacao={dadosVotacoes.id_votacao}
          nomeVotacao={dadosVotacoes.nome_votacao}
          pergunta={dadosVotacoes.pergunta}
          descricao={dadosVotacoes.descricao}
          voto={}
          onVota={}
        // voto={arrayRespostasUsuario[dadosVotacoes.id]}
        // onVota={novaResposta => this.registraResposta(novaResposta)}
        />
      </div>
    );
  }
}

VotacoesContainer.propTypes = {
  getDadosVotacoes: PropTypes.func.isRequired,
  setVotacoesCarregando: PropTypes.func.isRequired,
  salvaScoreUsuario: PropTypes.func.isRequired
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
    salvaScoreUsuario
  })
  (VotacoesContainer);

