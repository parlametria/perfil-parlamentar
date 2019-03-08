import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { criaURL } from "../../constantes/tratamentoUrls";

import "./candidato.css";

class Candidato extends Component {
  render() {
    const badgeNaoRespondeu = (
      <span className="badge badge-secondary">não respondeu</span>
    );

    const badgeNaoTemVotacoes = (
      <span className="badge badge-secondary">não atuou</span>
    );

    const verAtuacao = (      
      <Link
        className="btn btn-outline-primary btn-sm"
        to={
          "compare/" +
          this.props.id +
          "/" +
          criaURL(this.props.respostasUsuario) +
          "/true"
        }
      >
        ver atuação       
      </Link>
    );

    const naoRespondeu = (
      <div>
        <div>
          {this.props.eleito && this.props.temHistorico && verAtuacao}
        </div>
      </div>
    );
    
    const barraScore = (
      <div>
        <div className="score-progress">
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
            <span className="score">{Math.round(this.props.score * 100)}%</span>
          </div>
        </div>
        {this.props.eleito && this.props.temHistorico && verAtuacao}
      </div>
    );
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
                  criaURL(this.props.respostasUsuario)
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
                <h5 className="person-name">{this.props.nome}</h5>
                <div>
                  {this.props.siglaPartido}/{this.props.estado}
                </div>
                <div className="pb-1">
                  {this.props.reeleicao && !this.props.reeleito && (
                    <span
                      style={{ marginRight: "5px" }}
                      className="badge badge-success"
                    >
                      reeleição
                    </span>
                  )}
                  {this.props.reeleito && (
                    <span
                      style={{ marginRight: "5px" }}
                      className="badge badge-success"
                    >
                      reeleito/a
                    </span>
                  )}
                  {!this.props.temHistorico && badgeNaoTemVotacoes}
                </div>
                {this.props.temHistorico
                  ? barraScore
                  : naoRespondeu}
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
  respostasUsuario: PropTypes.instanceOf(Object),
  email: PropTypes.string.isRequired,
  eleito: PropTypes.bool.isRequired
};

export default Candidato;
