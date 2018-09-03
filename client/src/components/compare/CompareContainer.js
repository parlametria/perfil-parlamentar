import React, { Component } from "react";

import { connect } from "react-redux";

import PropTypes from "prop-types";

import TabelaPerguntas from "./tabelaPerguntas/TabelaPerguntas";

import { getDadosCandidato } from "../../actions/candidatosActions";
import isEmpty from "../../validation/is-empty";

class CompareContainer extends Component {

  render() {

    const { dadosCandidato } = this.props.candidatos;

    return (
      <div className="container">
        {this.props.candidatos.isCarregando || isEmpty(dadosCandidato)
          ? null
          : <TabelaPerguntas
            respostas={dadosCandidato.respostas}
            nome={dadosCandidato.nome_exibicao}
          />}
      </div>
    );
  }

  componentDidMount() {
    const { candidato } = this.props.match.params;
    const cand = this.props.getDadosCandidato(candidato);
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
