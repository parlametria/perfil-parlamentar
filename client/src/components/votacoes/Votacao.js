import React, { Component } from "react";
import PropTypes from "prop-types";
import Pergunta from "../perguntas/Pergunta";

class Votacao extends Component {

  render() {
    return (
      <Pergunta
        key={this.props.id}
        id={this.props.id}
        index={this.props.id}
        pergunta={this.props.texto}
        ajuda={this.props.ajuda}
        voto={this.props.voto}
        onVota={this.props.onVota}
      />
    );
  }
}

Votacao.propTypes = {
  key: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  tema: PropTypes.string.isRequired,
  idVotacao: PropTypes.number.isRequired,
  nomeVotacao: PropTypes.string.isRequired,
  pergunta: PropTypes.string,
  descricao: PropTypes.string,
  onVota: PropTypes.func.isRequired,
  voto: PropTypes.number.isRequired
};

export default Votacao;
