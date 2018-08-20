import React, { Component } from "react";
import PropTypes from "prop-types";

class Candidato extends Component {
  render() {
    return (
      <div className="candidato">
        <div className="row">
          <div className="col-4">
            <img
              src="http://www.luizaerundina.com.br/images/site/luiza.png"
              alt="..."
              width="100px"
              height="100px"
              className="img-thumbnail avatar rounded-circle"
            />
          </div>
          <div className="col-8">
            <h5>{this.props.nome}</h5>
            <h6>
              {this.props.siglaPartido}/{this.props.estado}
            </h6>
            <div className="progress" style={{ height: "15px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: Math.round(this.props.score * 100) + "%" }}
                aria-valuenow={this.props.score * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {Math.round(this.props.score * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Candidato.propTypes = {
  nome: PropTypes.string.isRequired,
  siglaPartido: PropTypes.string.isRequired,
  estado: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  respostas: PropTypes.any.isRequired
};

export default Candidato;
