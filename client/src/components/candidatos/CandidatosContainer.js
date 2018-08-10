import React, { Component } from "react";
import Candidato from "./Candidato";

import { connect } from "react-redux";

import {
  calculaScore,
  getTopNCandidatos
} from "../../actions/candidatosActions";

import PropTypes from "prop-types";

import dadosCandidatos from "../../data/data.json";

const NUM_CANDIDATOS = 10;

class CandidatosContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scoreCandidatos: {},
      candidatosAExibir: []
    };
  }

  render() {
    const candidatos = this.state.candidatosAExibir.map(elem => {
      const candidato = dadosCandidatos[elem[0]];

      return (
        <Candidato
          key={candidato.idCandidato}
          nome={"Candidata " + candidato.idCandidato}
          siglaPartido={"candidato.siglaPartido"}
          estado={"candidato.estado"}
          score={this.state.scoreCandidatos[candidato.idCandidato]}
          respostas={candidato.respostas}
        />
      );
    });

    return <div className="container candidatos-container">{candidatos}</div>;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.candidatos.scoreCandidatos) {
      this.setState({
        scoreCandidatos: nextProps.candidatos.scoreCandidatos,
        candidatosAExibir: nextProps.getTopNCandidatos(NUM_CANDIDATOS)
      });
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
