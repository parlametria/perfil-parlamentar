import React, { Component } from "react";
import Candidato from "./Candidato";

import { connect } from "react-redux";

import FlipMove from "react-flip-move";

import {
  calculaScore,
  getTopNCandidatos,
  getDadosCandidatos
} from "../../actions/candidatosActions";

import PropTypes from "prop-types";
import Spinner from "../common/Spinner";

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
    //console.log(this.props.candidatos);
    const candidatos = this.state.candidatosAExibir.map(elem => {
      const candidato = this.props.candidatos.dadosCandidatos[elem[0]];

      //console.log(this.props.candidatos);
      //console.log(this.props.candidatos.dbStatus["carregando"]);

      return (
        <Candidato
          key={candidato.id}
          nome={candidato.nome}
          siglaPartido={candidato.partido}
          estado={candidato.uf}
          score={this.state.scoreCandidatos[candidato.id]}
          respostas={candidato.respostas}
          foto = {candidato.foto}
        />
      );
    });

    return (
      <div className="container candidatos-container">
        {this.props.candidatos.isCarregando ? (
          <div style={{ paddingTop: "30vh" }}>
            <Spinner />
          </div>
        ) : (
          <FlipMove>{candidatos}</FlipMove>
        )}
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.candidatos.scoreCandidatos) {
      this.setState({
        scoreCandidatos: nextProps.candidatos.scoreCandidatos,
        candidatosAExibir: nextProps.getTopNCandidatos(NUM_CANDIDATOS)
      });
    }
  }

  componentDidMount() {
    this.props.getDadosCandidatos();
  }
}

CandidatosContainer.propTypes = {
  calculaScore: PropTypes.func.isRequired,
  getTopNCandidatos: PropTypes.func.isRequired,
  getDadosCandidatos: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  candidatos: state.candidatosReducer
});

export default connect(
  mapStateToProps,
  { calculaScore, getTopNCandidatos, getDadosCandidatos }
)(CandidatosContainer);
