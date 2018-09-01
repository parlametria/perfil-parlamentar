import React, { Component } from "react";

import { connect } from "react-redux";

import PropTypes from "prop-types";

import TabelaPerguntas from "./tabelaPerguntas/TabelaPerguntas";

import { getDadosCandidato } from "../../actions/candidatosActions";

class CompareContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const candidato = this.props.getDadosCandidato("90472004700");
    return (
      <div className="container">
        <TabelaPerguntas respostas={candidato.respostas} />
      </div>
    );
  }
}

TabelaPerguntas.propTypes = {
  getDadosCandidato: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  candidatos: state.candidatosReducer
});

export default connect(
  mapStateToProps,
  { getDadosCandidato }
)(CompareContainer);
