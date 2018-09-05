import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { mostrarTodosCandidatos } from "../../actions/candidatosActions";

class ContinueVotando extends Component {
  constructor(props) {
    super(props);
    this.mostrarTodos = this.mostrarTodos.bind(this);
  }
  render() {
    return (
      <div className="container tutorial pb-3">
        <h2 className="panel-title text-center">
          Responda mais um pouco para um resultado mais preciso
        </h2>

        <div className="text-center">
          <button
            className="btn btn-outline-primary"
            onClick={this.mostrarTodos}
          >
            Ver agora
          </button>
        </div>
      </div>
    );
  }

  mostrarTodos() {
    this.props.mostrarTodosCandidatos();
  }
}

ContinueVotando.propTypes = {
  mostrarTodosCandidatos: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  candidatos: state.candidatosReducer
});

export default connect(
  mapStateToProps,
  { mostrarTodosCandidatos }
)(ContinueVotando);
