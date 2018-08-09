import React, { Component } from "react";
import PropTypes from "prop-types";

class Candidato extends Component {
  render() {
    return (
      <div className="candidato">
        <div className="row">
          <div className="col-4">
            <img
              src="https://ep01.epimg.net/brasil/imagenes/2016/09/08/politica/1473343642_824880_1473343777_noticia_normal_recorte1.jpg"
              alt="..."
              className="img-thumbnail avatar"
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
                style={{ width: "100%" }}
                aria-valuenow="100"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                100%
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
  respostas: PropTypes.array.isRequired
};

export default Candidato;
