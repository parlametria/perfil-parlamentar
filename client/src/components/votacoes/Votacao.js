import React, { Component } from "react";
import PropTypes from "prop-types";
import Pergunta from "../perguntas/Pergunta";

class Votacao extends Component {

  render() {
    let texto = this.props.projLei + " - " + this.props.titulo;
    return (
      <div>
        <Pergunta
          key={this.props.id}
          id={this.props.id}
          index={this.props.id}
          pergunta={texto}
          ajuda={this.props.descricao}
          voto={this.props.voto}
          onVota={this.props.onVota}
        />
      </div>


    );
  }
}

Votacao.propTypes = {
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
