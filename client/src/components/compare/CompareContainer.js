import React, { Component } from "react";

import { connect } from "react-redux";

import PropTypes from "prop-types";

import TabelaPerguntas from "./tabelaPerguntas/TabelaPerguntas";

import { getDadosCandidato } from "../../actions/candidatosActions";
import isEmpty from "../../validation/is-empty";

class CompareContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { candidato: {} };
  }
  render() {
    console.log(this.state.candidato);

    return (
      <div className="container">
        {this.props.candidatos.isCarregando || isEmpty(this.state.candidato)
          ? null
          : /*<TabelaPerguntas
            respostas={this.state.candidato.respostas}
            nome={this.state.candidato.nome_exibicao}
          />*/ console.log(
              this.state.candidato
            )}
      </div>
    );
  }

  componentDidMount() {
    const cand = this.props.getDadosCandidato("90472004700");
    this.setState({ candidato: cand });
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
