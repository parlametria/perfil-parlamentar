import React, { Component } from "react";
import Candidato from "./Candidato";

import { connect } from "react-redux";

import FlipMove from "react-flip-move";

import { estados, partidos } from "../../constantes/filtrosSeletoresCandidatos";

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
      candidatosAExibir: [],
      filtro: { nome: "", partido: "", estado: "" }
    };

    this.buscaNome = this.buscaNome.bind(this);
    this.buscaEstado = this.buscaEstado.bind(this);
    this.buscaPartido = this.buscaPartido.bind(this);
  }

  buscaNome(e) {
    e.preventDefault();

    var filtro = {
      nome: e.target.value,
      partido: this.state.filtro.partido,
      estado: this.state.filtro.estado
    };

    this.setState({ filtro });
  }

  buscaEstado(e) {
    e.preventDefault();

    var filtro = {
      nome: this.state.filtro.nome,
      partido: this.state.filtro.partido,
      estado: e.target.value
    };

    this.setState({ filtro });
  }

  buscaPartido(e) {
    e.preventDefault();

    var filtro = {
      nome: this.state.filtro.nome,
      partido: e.target.value,
      estado: this.state.filtro.estado
    };

    this.setState({ filtro });
  }

  render() {
    const candidatos = this.state.candidatosAExibir.map(elem => {
      const candidato = this.props.candidatos.dadosCandidatos[elem[0]];

      return (
        <Candidato
          key={candidato.id}
          nome={candidato.nome}
          siglaPartido={candidato.partido}
          estado={candidato.uf}
          score={this.state.scoreCandidatos[candidato.id]}
          respostas={candidato.respostas}
          foto={candidato.foto}
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
          <div className="candidatos">
            <div className="row">
              <div className="col-8 col-xs-8 col-md-8 col-lg-8">
                <input
                  className="barra-filtro-candidato form-control"
                  id="myInput"
                  type="text"
                  placeholder="Nome"
                  onChange={this.buscaNome}
                />
              </div>
              <div className="col-2 col-xs-2 col-md-2 col-lg-2">
                <select
                  className="form-control barra-filtro-candidato"
                  placeholder="Partidos"
                  onChange={this.buscaPartido}
                >
                  {partidos()}
                </select>
              </div>
              <div className="col-2 col-xs-2 col-md-2 col-lg-2">
                <select
                  className="form-control barra-filtro-candidato"
                  placeholder="Estados"
                  onChange={this.buscaEstado}
                >
                  {estados()}
                </select>
              </div>
            </div>
            <FlipMove>{candidatos}</FlipMove>
          </div>
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
