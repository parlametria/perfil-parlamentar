import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import "./candidato.css";

class Candidato extends Component {
  criaURL(arrayVotos) {
    let urlVotos = "";
    arrayVotos.forEach(voto => {
      urlVotos = urlVotos + voto;
    });
    return urlVotos;
  }

  render() {
    const naoRespondeu = (<div><h6>Não Respondeu</h6></div>)
    const barraScore = (<div><div className="score-progress">
    <div className="progress" style={{ height: "15px" }}>
      <div
        className="progress-bar"
        role="progressbar"
        style={{
          width: Math.round(this.props.score * 100) + "%"
        }}
        aria-valuenow={this.props.score * 100}
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
    <div className="score-number">
      <span className="score">
        {Math.round(this.props.score * 100)}%
      </span>
    </div>
  </div>
  <Link
    className="person-link"
    to={
      "compare/" +
      this.props.id +
      "/" +
      this.criaURL(this.props.arrayRespostasUsuario)
    }
  >
    Compare
  </Link>
</div>);
    return (
      <div>
        <div className="person mb-4">
          <div className="row no-gutters">
            <div className="col-2">
              <Link
                className="person-link"
                to={
                  "compare/" +
                  this.props.id +
                  "/" +
                  this.criaURL(this.props.arrayRespostasUsuario)
                }
              >
                <img
                  src={this.props.foto}
                  alt="Candidata da Silva"
                  width="100%"
                  className="person-img"
                />
              </Link>
            </div>
            <div className="col-10">
              <div className="person-data">
                <h5 className="person-name">{this.props.nome} </h5>
                <div>
                  {this.props.siglaPartido}/{this.props.estado}
                </div>
                {this.props.respondeu ? barraScore : naoRespondeu}
                              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Candidato.propTypes = {
  respondeu: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  nome: PropTypes.string.isRequired,
  siglaPartido: PropTypes.string.isRequired,
  estado: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  respostas: PropTypes.any.isRequired,
  foto: PropTypes.string.isRequired,
  arrayRespostasUsuario: PropTypes.array.isRequired
};

export default Candidato;
