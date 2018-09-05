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
  mostraPerguntas
} from "../../../actions/candidatosActions";

import FlipMove from "react-flip-move";

// CSS imports
import "./home.css";

// Import função de estado
import { estados } from "../../../constantes/filtrosSeletoresCandidatos";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = { selecionouEstado: false, mostraPerguntas: false };
    this.selecionaEstado = this.selecionaEstado.bind(this);
    this.mostraPerguntas = this.mostraPerguntas.bind(this);
  }

  selecionaEstado(e) {
    e.preventDefault();

    const novoFiltroEstado = {
      nome: "",
      partido: "TODOS",
      estado: e.target.value
    };

    this.props.setFiltroCandidatos(novoFiltroEstado);
    this.props.getDadosCandidatos();
    this.setState({ selecionouEstado: true });
  }

  mostraPerguntas(e) {
    e.preventDefault();
    this.props.mostraPerguntas();
  }

  componentDidMount() {
    if (!isMobile) this.props.mostraPerguntas();
  }

  render() {
    const { filtro } = this.props.candidatos;

    return (
      <div>
        <section className="intro">
          <div className="container">
            <h2 className="intro-title text-center">
              Nos diga o que você <strong className="strong">defende</strong> e
              em <strong className="strong">oito minutos</strong> a gente
              apresenta candidatos alinhados com você
            </h2>
            <div className="d-flex justify-content-center">
              <form>
                <div className="form-group">
                  <select
                    className="form-control"
                    onChange={this.selecionaEstado}
                    value={filtro.estado}
                  >
                    <option defaultValue="--">Em que Estado você vota?</option>
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
                {filtro.estado !== "" ? <CandidatosContainer /> : null}
                {isMobile &&
                !this.props.candidatos.mostraPerguntas &&
                filtro.estado !== "" ? (
                  <div className="text-center mb-3">
                    <button
                      className="btn btn-secondary"
                      onClick={this.mostraPerguntas}
                    >
                      Vamos Começar!
                    </button>
                  </div>
                ) : null}
              </FlipMove>
            </section>
            <div className="grid-separator" />
            <section className="grid-panel panel-detail">
              <FlipMove>
                {filtro.estado !== "" &&
                this.props.candidatos.mostraPerguntas ? (
                  <PerguntasContainer />
                ) : null}
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
  calculaScore: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  candidatos: state.candidatosReducer
});

export default connect(
  mapStateToProps,
  { getDadosCandidatos, setFiltroCandidatos, calculaScore, mostraPerguntas }
)(Home);
