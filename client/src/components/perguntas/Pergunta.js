import React, { Component } from "react";
import PropTypes from "prop-types";

class Votacao extends Component {
  render() {
    return (
      <div className="card pergunta">
        <div className="card-body">
          <h6 className="card-subtitle mb-2 text-muted">{this.props.autor}</h6>
          <p className="card-text">{this.props.pergunta}</p>
          <a href="#" className="card-link">
            Concordo
          </a>
          <a href="#" className="card-link">
            Discordo
          </a>
        </div>
      </div>
    );
  }
}

Votacao.propTypes = {
  autor: PropTypes.string.isRequired,
  pergunta: PropTypes.string.isRequired,
  tema: PropTypes.string
};

export default Votacao;
