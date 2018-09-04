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
        <div className="pb-3">
          <p>
            <strong className="strong">Vote</strong> nos temas propostos e veja
            aqui os candidatos que mais se alinham com você.
          </p>
          <p>
            <strong className="strong">Filtre</strong> o resultado segundo seus
            critérios.
          </p>
          <p>
            <strong className="strong">Informe-se</strong> sobre os 5 temas.
            Quanto mais perguntas você responder, mas preciso é o resultado.
          </p>
        </div>
        <div className="text-center">
          <button className="btn btn-primary" onClick={this.mostrarTodos}>
            Mostre-me todos
          </button>
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
