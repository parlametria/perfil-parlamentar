import React, { Component } from "react";
import PropTypes from "prop-types";
import sanitizeHtml from "sanitize-html";
import classnames from "classnames";

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
    const clean = sanitizeHtml(this.props.pergunta);

    return (
      <div>
        <div className="panel-body">
          <div className="question-wrapper">
            <div>
              <span
                className="question"
                dangerouslySetInnerHTML={{ __html: clean }}
              />{" "}
              <button
                type="button"
                className="btn btn-link btn-sm"
                data-toggle="collapse"
                data-target="#help-eixoA"
                aria-expanded="false"
                aria-controls="help-eixoA"
              >
                O que é isso? <span className="icon-cursor" />
              </button>
              <div
                id="help-eixoA"
                className="collapse question-help-content"
                aria-labelledby="help-eixoA"
              >
                {this.props.ajuda}
              </div>
            </div>
          </div>

          <div
            className="btn-group btn-group-lg d-flex justify-content-center my-3"
            role="group"
            aria-label="Resposta"
          >
            <button
              type="button"
              className={classnames("btn btn-primary btn-in-favor", {
                "btn-secondary": this.state.resposta === 1
              })}
              onClick={this.votaSim}
            >
              A favor
            </button>
            <button
              type="button"
              className={classnames("btn btn-primary", {
                "btn-secondary": this.state.resposta === -2
              })}
              onClick={this.votaNaoSei}
            >
              Não sei
            </button>
            <button
              type="button"
              className={classnames("btn btn-primary btn-against", {
                "btn-secondary": this.state.resposta === -1
              })}
              onClick={this.votaNao}
            >
              Contra
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
  ajuda: PropTypes.string.isRequired,
  tema: PropTypes.string,
  onVota: PropTypes.func.isRequired,
  voto: PropTypes.number.isRequired
};

export default Pergunta;
