import React, { Component } from "react";
import PropTypes from "prop-types";

class Pergunta extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resposta: 0
    };
  }

  votaSim() {
    let id = this.props.id;
    this.setState({ resposta: 1 });
    this.props.onVota({ id, resposta: 1 });
  }

  votaNao() {
    let id = this.props.id;
    this.setState({ resposta: -1 });
    this.props.onVota({ id, resposta: -1 });
  }

  render() {
    return (
      <div className="card pergunta">
        <div className="card-body">
          <p className="card-text">{this.props.pergunta}</p>
          <p className="card-text">{this.state.resposta}</p>
          <div className="btn btn-info" onClick={this.votaSim.bind(this)}>
            <a className="card-link">Concordo</a>
          </div>
          <div className="btn btn-danger" onClick={this.votaNao.bind(this)}>
            <a className="card-link">Discordo</a>
          </div>
        </div>
      </div>
    );
  }
}

Pergunta.propTypes = {
  id: PropTypes.number.isRequired,
  pergunta: PropTypes.string.isRequired,
  tema: PropTypes.string,
  onVota: PropTypes.func.isRequired
};

export default Pergunta;
