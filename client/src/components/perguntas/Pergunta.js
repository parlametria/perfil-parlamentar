import React, { Component } from "react";
import PropTypes from "prop-types";

class Pergunta extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resposta: this.props.voto
    };

    this.votaSim = this.votaSim.bind(this);
    this.votaNao = this.votaNao.bind(this);
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
          <div className="btn btn-info" onClick={this.votaSim}>
            <a className="card-link">Concordo</a>
          </div>
          <div className="btn btn-danger" onClick={this.votaNao}>
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
  onVota: PropTypes.func.isRequired,
  voto: PropTypes.number.isRequired
};

export default Pergunta;
