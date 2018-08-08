import React, { Component } from "react";
import Candidato from "./Candidato";

import { connect } from "react-redux";

import { withRouter } from "react-router-dom";

import { calculateScore } from "../../actions/candidatesActions";

import PropTypes from "prop-types";

import dadosCandidatos from "../../data/data.json";

class CandidatosContainer extends Component {
  constructor(props) {
    super(props);
    this.candidateVotings = {};

    this.state = {
      candidatesVotings: {},
      candidatesScore: {},
      candidatos: {}
    };
  }

  render() {
    const candidatos = Object.keys(this.state.candidatos).map(elem => {
      const candidato = this.state.candidatos[elem];

      return (
        <Candidato
          key={candidato.id}
          nome={"candidato.nome"}
          siglaPartido={"candidato.siglaPartido"}
          estado={"candidato.estado"}
          score={this.state.candidatesScore[candidato.id]}
          votacoes={this.candidatesVotings[candidato.id]}
        />
      );
    });

    return <div className="container candidatos-container">{candidatos}</div>;
  }

  componentDidMount() {
    // Recuperar do BD as votações uma única vez.
    // firebase.database.get...
    const votacoesCandidatos = {};

    dadosCandidatos.map(elem => {
      votacoesCandidatos[elem.idCandidato] = elem.respostas;
    });

    this.setState({ candidatesVotings: votacoesCandidatos });

    this.props.calculateScore(votacoesCandidatos);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.candidates.candidatesScore) {
      console.log(nextProps.candidates.candidatesScore);
      this.setState({ candidatesScore: nextProps.candidates.candidatesScore });
    }
  }
}

CandidatosContainer.propTypes = {
  calculateScore: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  candidates: state.candidatesReducer
});

export default connect(
  mapStateToProps,
  { calculateScore }
)(CandidatosContainer);
