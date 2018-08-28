import React, { Component } from "react";
import PropTypes from "prop-types";
import sanitizeHtml from "sanitize-html";

class Pergunta extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resposta: this.props.voto
    };

    this.votaSim = this.votaSim.bind(this);
    this.votaNaoSei = this.votaNaoSei.bind(this);
    this.votaNao = this.votaNao.bind(this);
  }

  votaSim() {
    let id = this.props.id;
    this.setState({ resposta: 1 });
    this.props.onVota({ id, resposta: 1 });
  }

  votaNaoSei() {
    let id = this.props.id;
    this.setState({ resposta: -2 });
    this.props.onVota({ id, resposta: -2 });
  }

  votaNao() {
    let id = this.props.id;
    this.setState({ resposta: -1 });
    this.props.onVota({ id, resposta: -1 });
  }

  render() {
    const clean = sanitizeHtml(this.props.id + 1 + ". " + this.props.pergunta);

    return (
      <div className="pergunta">
        <div>
          <p dangerouslySetInnerHTML={{ __html: clean }} />
          <div className="btn btn-info" onClick={this.votaSim}>
            <a className="card-link">Concordo</a>
          </div>
          <div className="btn btn-seconday" onClick={this.votaNaoSei}>
            <a className="card-link">Não sei</a>
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
