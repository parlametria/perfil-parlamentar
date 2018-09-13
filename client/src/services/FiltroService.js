import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class FiltroService extends Component {
  //exportar const
  filtraNome(nome) {
    const { dadosCandidatos } = this.props.candidatos;

    return (Object.keys(dadosCandidatos)
      .filter(cpf =>
        (dadosCandidatos[cpf].nome_urna
          .toLowerCase()
          .indexOf(nome.toLowerCase()) >= 0
        )
      )
    )
  }

  filtraPartido(partido) {
    const { dadosCandidatos, scoreCandidatos } = this.props.candidatos;

    return (Object.keys(dadosCandidatos).filter(cpf =>
      (dadosCandidatos[cpf].sg_partido === partido)
    ))
      .sort((a, b) => {
        if (scoreCandidatos[a] > scoreCandidatos[b]) return -1;
        else if (scoreCandidatos[a] < scoreCandidatos[b]) return 1;
        else return 0;
      })
  }

  filtraNomeEPartido(nome, partido) {
    const { dadosCandidatos } = this.props.candidatos;

    return Object.keys(dadosCandidatos)
      .filter(cpf => (
        dadosCandidatos[cpf].sg_partido === partido &&
        dadosCandidatos[cpf].nome_urna
          .toLowerCase()
          .indexOf(nome.toLowerCase()) >= 0
      ))
  }

};

FiltroService.propTypes = {};

const mapStateToProps = state => ({
  candidatos: state.candidatosReducer
})

export default connect(
  mapStateToProps,
  {}
)(FiltroService);