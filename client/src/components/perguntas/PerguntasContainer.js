import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Pergunta from "./Pergunta";
import { salvaScoreUsuario } from "../../actions/usuarioActions";
import {
  calculaScore,
  calculaScorePorTema
} from "../../actions/candidatosActions";
import {
  getDadosPerguntas,
  voltaPergunta,
  passaPergunta,
  escolhePergunta,
  escolheTema
} from "../../actions/perguntasActions";

import classnames from "classnames";

import isEmpty from "../../validation/is-empty";

//import { delay } from "../../utils/funcoes";

import "./perguntas.css";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class PerguntasContainer extends Component {
  constructor(props) {
    super(props);

    this.state = { indexIndicadorPergunta: 0, show: true };

    this.passaPergunta = this.passaPergunta.bind(this);
    this.voltaPergunta = this.voltaPergunta.bind(this);
    this.selecionaTema = this.selecionaTema.bind(this);
    this.escolhePergunta = this.escolhePergunta.bind(this);
    this.showPerguntaContainer = this.showPerguntaContainer.bind(this);
    this.hidePerguntaContainer = this.hidePerguntaContainer.bind(this);
  }

  registraResposta(novaResposta) {
    const { respostasUsuario, arrayRespostasUsuario } = this.props.usuario;

    respostasUsuario[novaResposta.id] = novaResposta.resposta;
    arrayRespostasUsuario[novaResposta.id] = novaResposta.resposta;
    this.props.salvaScoreUsuario(respostasUsuario, arrayRespostasUsuario);
    this.props.calculaScore();
    this.passaPergunta();
  }

  async passaPergunta() {
    await delay(400);
    this.props.passaPergunta();
    const { indexPergunta, dadosPerguntas } = this.props.perguntas;

    if (indexPergunta <= 45) {
      this.props.escolheTema(dadosPerguntas[indexPergunta].tema);
    }
  }

  voltaPergunta() {
    this.props.voltaPergunta();
    const { indexPergunta, dadosPerguntas } = this.props.perguntas;

    if (indexPergunta - 1 > 0) {
      this.props.escolheTema(dadosPerguntas[indexPergunta - 1].tema);
    }
  }

  escolhePergunta(e) {
    e.preventDefault();
    this.props.escolhePergunta(Number(e.target.id));
  }

  selecionaTema(e) {
    e.preventDefault();
    const { dadosPerguntas } = this.props.perguntas;
    const perguntasFiltradas = dadosPerguntas.filter(pergunta => {
      return pergunta.tema === e.target.id;
    });
    this.props.escolheTema(e.target.id);
    this.props.escolhePergunta(perguntasFiltradas[0].id);
  }

  componentDidMount() {
    this.props.getDadosPerguntas();
  }

  render() {
    const { dadosPerguntas, indexPergunta, filtroTema } = this.props.perguntas;

    let pergunta;
    let indicadorPergunta;
    let temas = [];

    if (!isEmpty(dadosPerguntas)) {
      const dadosPergunta = dadosPerguntas[indexPergunta];

      const { arrayRespostasUsuario } = this.props.usuario;

      // Constrói os eixos (isso idealmente deve vir de um bd, algo assim)
      let nomeTemas = new Set();
      dadosPerguntas.forEach(pergunta => {
        nomeTemas.add(pergunta.tema);
      });

      Array.from(nomeTemas).forEach((tema, i) => {
        temas.push(
          <li className="nav-item" key={i}>
            <a
              className={classnames("nav-link", {
                active: filtroTema === tema
              })}
              onClick={this.selecionaTema}
              id={tema}
            >
              {tema}
            </a>
          </li>
        );
      });

      indicadorPergunta = dadosPerguntas
        .filter(pergunta => pergunta.tema === filtroTema)
        .map((perguntaFiltrada, index) => (
          // done -> o usuario já respondeu essa pergunta
          // active -> o usuário está respondendo
          <li className="nav-item" key={index}>
            <a
              className={classnames("nav-link", {
                active: perguntaFiltrada.id === indexPergunta,
                done:
                  arrayRespostasUsuario[Number(perguntaFiltrada.id)] !== 0 &&
                  perguntaFiltrada.id !== indexPergunta
              })}
              key={index + ". " + perguntaFiltrada.id}
              id={perguntaFiltrada.id}
              onClick={this.escolhePergunta}
            >
              <span
                className="icon-cursor icon-current"
                id={perguntaFiltrada.id}
              />
              {index + 1}
            </a>
          </li>
        ));

      pergunta = (
        <Pergunta
          key={dadosPergunta.id}
          id={dadosPergunta.id}
          index={dadosPergunta.id}
          pergunta={dadosPergunta.texto}
          ajuda={dadosPergunta.ajuda}
          voto={arrayRespostasUsuario[dadosPergunta.id]}
          onVota={novaResposta => this.registraResposta(novaResposta)}
        />
      );

      // indicadorPergunta = dadosPerguntas.map((pergunta, index) => (
      //   // done -> o usuario já respondeu essa pergunta
      //   // active -> o usuário está respondendo
      //   <li className="nav-item">
      //     <a
      //       className="nav-link"
      //       key={index + ". " + pergunta.id}
      //       id={pergunta.id}
      //       onClick={this.escolhePergunta}
      //     >
      //       <span className="icon-cursor icon-current" />
      //       {index + 1}
      //     </a>
      //   </li>
      // ));
    }

    return (
      <div className="pergunta-container">
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
        <div
          id="perguntaContainer"
          className={classnames("card collapse", {
            show: this.state.show
          })}
          aria-labelledby="perguntaContainer"
        >
          <div className="card-body">
            <div className="nav-horizontal">
              <ul className="nav nav-pills nav-fill nav-horizontal-pills-sm">
                {indicadorPergunta}
              </ul>
            </div>
            <div className="container">
              <h2 className="question-theme">{filtroTema}</h2>
            </div>
            {pergunta}
            <button
              type="button"
              className="btn btn-block btn-primary btn-square d-lg-none"
              onClick={this.hidePerguntaContainer}
            >
              <span className="icon-cursor" /> Esconder
            </button>
          </div>
        </div>
        {/*
        <div className="container perguntas-container">
          {isCarregando || isEmpty(dadosPerguntas) ? (
            <Spinner />
          ) : (
            <div>
              <div className="row">{botoesNavegacao}</div>
            </div>
          )}
        </div>
        */}
      </div>
    );
  }

  showPerguntaContainer(event) {
    event.preventDefault();
    this.setState({ show: true });
  }

  hidePerguntaContainer(event) {
    event.preventDefault();
    this.setState({ show: false });
  }
}

PerguntasContainer.propTypes = {
  salvaScoreUsuario: PropTypes.func.isRequired,
  calculaScore: PropTypes.func.isRequired,
  calculaScorePorTema: PropTypes.func.isRequired,
  getDadosPerguntas: PropTypes.func.isRequired,
  passaPergunta: PropTypes.func.isRequired,
  voltaPergunta: PropTypes.func.isRequired,
  escolhePergunta: PropTypes.func.isRequired,
  escolheTema: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  usuario: state.usuarioReducer,
  candidatos: state.candidatosReducer,
  perguntas: state.perguntasReducer
});

export default connect(
  mapStateToProps,
  {
    salvaScoreUsuario,
    calculaScore,
    calculaScorePorTema,
    getDadosPerguntas,
    passaPergunta,
    voltaPergunta,
    escolhePergunta,
    escolheTema
  }
)(PerguntasContainer);
