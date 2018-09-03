import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import DetalhesCandidato from "./DetalhesCandidato";

import "./candidato.css";

class Candidato extends Component {
  
  criaURL(arrayVotos){
    let urlVotos = "";
    arrayVotos.forEach(voto =>{
      urlVotos = urlVotos + voto;
    });
    return(urlVotos);
  }

  render() {
    const dados = {
      nome: this.props.nome,
      siglaPartido: this.props.siglaPartido,
      estado: this.props.estado,
      respostas: this.props.respostas,
      foto: this.props.foto
    };

    return (
      <div>
        <div className="person mb-4">
          <div className="row no-gutters">
            <div className="col-2">
              <a href="#">
                <img
                  src= {this.props.foto}
                  alt="Candidata da Silva"
                  width="100%"
                  className="person-img"
                />
              </a>
            </div>
            <div className="col-10">
              <div className="person-data">
                <h5 className="person-name">
                  {this.props.nome}{" "}
                  <small>
                    {this.props.siglaPartido}/{this.props.estado}
                  </small>
                </h5>
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
                    <span className="score">
                      {Math.round(this.props.score * 100)}%
                    </span>
                  </div>
                </div>
                <Link
                  className="person-link"
                  to={"compare/" + this.props.id + "/" + this.criaURL(this.props.arrayRespostasUsuario)}
                >
                  Compare
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Candidato.propTypes = {
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
