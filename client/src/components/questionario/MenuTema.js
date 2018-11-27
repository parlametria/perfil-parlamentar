import React, { Component } from "react";

import {
  getDadosPerguntas,
  voltaPergunta,
  passaPergunta,
  escolhePergunta,
  escolheTema,
  exibePerguntas,
  escondePerguntas
} from "../../actions/perguntasActions";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class MenuTema extends Component {

  constructor(props) {
    super(props);

    this.passaPergunta = this.passaPergunta.bind(this);
    this.voltaPergunta = this.voltaPergunta.bind(this);
    this.selecionaTema = this.selecionaTema.bind(this);
    this.escolhePergunta = this.escolhePergunta.bind(this);
    this.togglePerguntaContainer = this.togglePerguntaContainer.bind(this);
  }

  async passaPergunta() {

  }

  voltaPergunta() {

  }

  escolhePergunta(e) {

  }

  selecionaTema(e) {
  }

  render() {
    let indicadorPergunta;

    return (
      <div className="pergunta-container">
        <div>
          <div className="panel-detail-header">
            <div
              className="nav-horizontal nav-horizontal-lg custom-scroll-bar"
              onClick={this.showPerguntaContainer}
            >
              <ul className="nav nav-tabs nav-fill nav-horizontal-pills">
                {temas}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
export default MenuTema;