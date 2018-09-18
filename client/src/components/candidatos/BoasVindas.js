import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { mostrarTodosCandidatos } from "../../actions/candidatosActions";

class BoasVindas extends Component {
  constructor(props) {
    super(props);
    this.mostrarTodos = this.mostrarTodos.bind(this);
  }
  render() {
    return (
      <div className="container tutorial pb-3">
        <h2 className="panel-title text-center">Vamos começar?</h2>
        <div className="d-flex align-items-center">
          <div className="tutorial-img">
            <img
              src={require("../../data/img/step1.png")}
              alt="Imagem de um questionário com algumas perguntas respondidas"
            />
          </div>
          <div className="pl-2">
            <strong className="strong">Vote</strong> nos temas propostos e veja aqui os
              candidatos que mais se alinham com você.
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className="tutorial-img">
            <img
              src={require("../../data/img/step2.png")}
              alt="Imagem de um questionário com algumas perguntas respondidas"
            />
          </div>
          <div className="pl-2">
            <strong className="strong">Filtre</strong> o resultado segundo seus critérios.
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className="tutorial-img">
            <img
              src={require("../../data/img/step1.png")}
              alt="Imagem de um questionário com algumas perguntas respondidas"
            />
          </div>
          <div className="pl-2">
            <strong className="strong">Informe-se</strong> sobre os 5 temas. Quanto mais
            perguntas você responder, mas preciso é o resultado.
          </div>
        </div>
      </div>
    );
  }

  mostrarTodos() {
    this.props.mostrarTodosCandidatos();
  }
}

BoasVindas.propTypes = {
  mostrarTodosCandidatos: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  candidatos: state.candidatosReducer
});

export default connect(
  mapStateToProps,
  { mostrarTodosCandidatos }
)(BoasVindas);
