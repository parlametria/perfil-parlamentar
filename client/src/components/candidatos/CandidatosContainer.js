import React, { Component } from "react";
import Candidato from "./Candidato";

import { connect } from "react-redux";

import { withRouter } from "react-router-dom";

import {
  calculaScore,
  getTopNCandidatos
} from "../../actions/candidatosActions";

import PropTypes from "prop-types";

import dadosCandidatos from "../../data/data.json";

class CandidatosContainer extends Component {
  constructor(props) {
    super(props);
    //this.respostasCandidatos = {};

    this.state = {
      scoreCandidatos: {},
      candidatosAExibir: {}
    };
  }

  render() {
    const candidatos = Object.keys(this.state.candidatosAExibir).map(elem => {
      const candidato = this.state.candidatosAExibir[elem];

      return (
        <Candidato
          key={candidato.id_cand}
          nome={"candidato.nome"}
          siglaPartido={"candidato.siglaPartido"}
          estado={"candidato.estado"}
          score={this.state.scoreCandidatos[candidato.id_cand]}
          respostas={this.respostasCandidatos[candidato.id_cand]}
        />
      );
    });

    return <div className="container candidatos-container">{candidatos}</div>;
  }

  componentDidMount() {
    // Recuperar do BD as votações uma única vez.
    // firebase.database.get...
    const respostas = {};

    dadosCandidatos.map(elem => {
      respostas[elem.idCandidato] = elem.respostas;
    });

    this.props.calculaScore(respostas);
    this.props.getTopNCandidatos(respostas);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.candidatos.scoreCandidatos) {
      this.setState({ scoreCandidatos: nextProps.candidatos.scoreCandidatos });
    }
  }
}

CandidatosContainer.propTypes = {
  calculaScore: PropTypes.func.isRequired,
  getTopNCandidatos: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  candidatos: state.candidatosReducer
});

export default connect(
  mapStateToProps,
  { calculaScore, getTopNCandidatos }
)(CandidatosContainer);
