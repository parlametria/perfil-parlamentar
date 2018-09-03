import React, { Component } from "react";

// Containers imports
import PerguntasContainer from "../../perguntas/PerguntasContainer";
import CandidatosContainer from "../../candidatos/CandidatosContainer";

// Redux stuff
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Actions
import {
  getDadosCandidatos,
  setFiltroCandidatos,
  calculaScore
} from "../../../actions/candidatosActions";

import FlipMove from "react-flip-move";

// CSS imports
import "./home.css";

// Import função de estado
import { estados } from "../../../constantes/filtrosSeletoresCandidatos";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = { selecionouEstado: false };
    this.selecionaEstado = this.selecionaEstado.bind(this);
  }

  selecionaEstado(e) {
    e.preventDefault();

    const { filtro } = this.props.candidatos;

    const novoFiltroEstado = {
      nome: filtro.nome,
      partido: filtro.partido,
      estado: e.target.value
    };

    this.props.setFiltroCandidatos(novoFiltroEstado);
    this.props.getDadosCandidatos();
    this.setState({ selecionouEstado: true });
  }

  render() {
    const { filtro } = this.props.candidatos;

    return (
      <div>
        <section className="intro">
          <div className="container">
            <h2 className="intro-title text-center">
              Nos diga o que você <strong>defende</strong> e a gente apresenta
              candidatos alinhados com seu perfil
            </h2>
            <div className="d-flex justify-content-center">
              <form>
                <div className="form-group">
                  <select
                    className="form-control"
                    onChange={this.selecionaEstado}
                    value={filtro.estado}
                  >
                    <option selected>Em que Estado você vota?</option>
                    {estados()}
                  </select>
                </div>
              </form>
            </div>
          </div>
        </section>
        <FlipMove>
          {filtro.estado !== "" ? (
            <div className="grid-main">
              <section className="grid-panel panel-master">
                <CandidatosContainer />
              </section>
              <div className="grid-separator" />
              <section className="grid-panel panel-detail">
                <PerguntasContainer />
              </section>
            </div>
          ) : null}
        </FlipMove>
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
  { getDadosCandidatos, setFiltroCandidatos, calculaScore }
)(Home);
