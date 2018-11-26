import React, { Component } from "react";
import PropTypes from "prop-types";
import Pergunta from "../perguntas/Pergunta";

class Votacao extends Component {

  render() {
    return (
      <div>
        <Pergunta
          key={this.props.id}
          id={this.props.id}
          index={this.props.id}
          pergunta={this.props.texto}
          ajuda={this.props.ajuda}
          voto={this.props.voto}
          onVota={this.props.onVota}
        />
      </div>


    );
  }
}

Votacao.propTypes = {
  key: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  projLei: PropTypes.string.isRequired,
  idVotacao: PropTypes.number.isRequired,
  titulo: PropTypes.string.isRequired,
  descricao: PropTypes.string,
  tema: PropTypes.string.isRequired,
  voto: PropTypes.number.isRequired,
  onVota: PropTypes.func.isRequired
};

export default Votacao;
