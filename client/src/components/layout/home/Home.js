import React, { Component } from "react";

// Containers imports
import PerguntasContainer from "../../perguntas/PerguntasContainer";
import CandidatosContainer from "../../candidatos/CandidatosContainer";
import { isMobile } from "react-device-detect";

// Redux stuff
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Actions
import {
  getDadosCandidatos,
  setFiltroCandidatos,
  calculaScore,
  setPartidos
} from "../../../actions/candidatosActions";

import { vamosComecar, escondePerguntas } from "../../../actions/perguntasActions";
import { salvaScoreUsuario } from "../../../actions/usuarioActions";

import {
  getArrayUrl,
  getDict,
  votosValidos,
  estadoValido
} from "../../../constantes/tratamentoUrls";

import FlipMove from "react-flip-move";

// CSS imports
import "./home.css";

// Import função de estado
import { estados } from "../../../constantes/filtrosSeletoresCandidatos";

class Home extends Component {
  constructor(props) {
    super(props);

    this.selecionaEstado = this.selecionaEstado.bind(this);
    this.vamosComecar = this.vamosComecar.bind(this);
  }

  selecionaEstado(e) {
    e.preventDefault();

    const novoFiltroEstado = {
      nome: "",
      partido: "TODOS",
      estado: e.target.value
    };

    if (e.target.value === "TODOS" && isMobile){ 
      this.props.vamosComecar();
      this.props.escondePerguntas();
    }

    this.props.setFiltroCandidatos(novoFiltroEstado);
    this.props.getDadosCandidatos();
  }

  vamosComecar(e) {
    e.preventDefault();
    this.props.vamosComecar();
  }

  componentDidMount() {
    if (!isMobile) this.props.vamosComecar();
    const { votos, estado } = this.props.match.params;

    if (votos && estado) {
      if (votosValidos(votos) && estadoValido(estado)) {
        const arrayVotosUsuario = getArrayUrl(votos);
        const votosUsuario = getDict(arrayVotosUsuario);

        const filtroEstado = {
          nome: "",
          partido: "TODOS",
          estado: estado
        };

        this.props.setFiltroCandidatos(filtroEstado);
        this.props.getDadosCandidatos();

        this.props.salvaScoreUsuario(votosUsuario, arrayVotosUsuario);
        this.props.vamosComecar();
        this.props.history.push("/");
      } else {
        this.props.history.push("/");
      }
    }
  }

  render() {
    const { filtro } = this.props.candidatos;
    const { isVamosComecar } = this.props.perguntas;

    return (
      <div>
        <section className="intro">
          <div className="container">
            <h2 className="intro-title text-center">
              Descubra quais deputados/as e
              candidatos/as são <strong className="strong">alinhados</strong> com o você.
            </h2>
            <div className="d-flex justify-content-center">
              <form>
                <div className="form-group">
                  <select
                    className="form-control"
                    onChange={this.selecionaEstado}
                    value={filtro.estado}
                  >
                    <option defaultValue="--">Selecione um Estado</option>
                    {estados()}
                  </select>
                </div>
              </form>
            </div>
          </div>
        </section>
        <div className="grid-wrapper">
          <div className="grid-main">
            <section className="grid-panel panel-master">
              <FlipMove>
                {filtro.estado !== "" && <CandidatosContainer />}
                {isMobile &&
                  !isVamosComecar &&
                  filtro.estado !== "" && (
                    <div className="text-center mb-3">
                      <button
                        className="btn btn-secondary btn-lg"
                        onClick={this.vamosComecar}
                      >
                        Vamos Começar!
                      </button>
                    </div>
                  )}
              </FlipMove>
            </section>
            <div className="grid-separator" />
            <section className="grid-panel panel-detail">
              <FlipMove>
                {filtro.estado !== "" &&
                  isVamosComecar && <PerguntasContainer />}
              </FlipMove>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  getDadosCandidatos: PropTypes.func.isRequired,
  setFiltroCandidatos: PropTypes.func.isRequired,
  calculaScore: PropTypes.func.isRequired,
  setPartidos: PropTypes.func.isRequired,
  salvaScoreUsuario: PropTypes.func.isRequired,
  escondePerguntas: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  candidatos: state.candidatosReducer,
  perguntas: state.perguntasReducer
});

export default connect(
  mapStateToProps,
  {
    getDadosCandidatos,
    setFiltroCandidatos,
    calculaScore,
    vamosComecar,
    setPartidos,
    salvaScoreUsuario,
    escondePerguntas
  }
)(Home);
