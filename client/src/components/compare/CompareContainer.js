import React, { Component } from "react";

import { connect } from "react-redux";

import PropTypes from "prop-types";

import TabelaPerguntas from "./tabelaPerguntas/TabelaPerguntas";

import { getDadosCandidato } from "../../actions/candidatosActions";

class CompareContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { candidato: {} };
  }
  render() {
    const respostas =
      this.props.candidatos.isCarregando &&
      this.state.candidato.respostas !== undefined
        ? this.state.candidato.respostas
        : null;

    const nome =
      this.props.candidatos.isCarregando &&
      this.state.candidato.respostas !== undefined
        ? this.state.candidato.nome_urna
        : null;

    return (
      <div className="container">
        <TabelaPerguntas respostas={respostas} nome={nome} />
      </div>
    );
  }

  componentDidMount() {
    const candidato = this.props.getDadosCandidato("90472004700");
    console.log(candidato);

    this.setState({ candidato });
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
