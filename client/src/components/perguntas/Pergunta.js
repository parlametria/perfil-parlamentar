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

  votaNaoSei() {
    let id = this.props.id;
    this.setState({ resposta: 0 });
    this.props.onVota({ id, resposta: 0 });
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
          <div class="row">
            <button type="button" className="btn btn-info" onClick={this.votaSim.bind(this)}>
              <a className="card-link">Concordo</a>
            </button>
            <button type="button" className="btn btn-secondary" onClick={this.votaNaoSei.bind(this)}>
              <a className="card-link">Não sei</a>
            </button>
            <button type="button" className="btn btn-danger" onClick={this.votaNao.bind(this)}>
              <a className="card-link">Discordo</a>
            </button>
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
