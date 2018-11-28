import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  voltaPergunta,
  passaPergunta,
  escolhePergunta,
  escolheTema,
  exibePerguntas,
  escondePerguntas
} from "../../actions/questionarioActions";

import classnames from "classnames";

import FlipMove from "react-flip-move";

import { Collapse } from "reactstrap";

import isEmpty from "../../validation/is-empty";


const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class MenuTema extends Component {

  constructor(props) {
    super(props);

    this.getDadosAba = this.getDadosAba.bind(this);
    this.voltaPergunta = this.voltaPergunta.bind(this);
    this.selecionaTema = this.selecionaTema.bind(this);
    this.escolhePergunta = this.escolhePergunta.bind(this);
  }

  getDadosAba() {
    const abaAtiva = this.props.questionario.abaAtiva;
    const index = (abaAtiva === "Voz Ativa" ? this.props.perguntas.indexPergunta : this.props.votacoes.indexPergunta);

    const dados = (abaAtiva === "Voz Ativa" ? this.props.perguntas.dadosPerguntas : this.props.votacoes.dadosVotacoes);

    const tamPergunta = (abaAtiva === "Voz Ativa" ? this.props.perguntas.TAM_PERGUNTAS : this.props.votacoes.TAM_PERGUNTAS);

    return [index, dados, tamPergunta];
  }


  voltaPergunta() {
    this.props.passaPergunta();
    const dadosAba = this.getDadosAba();
    const index = dadosAba[0];
    const dados = dadosAba[1];

    if (index - 1 > 0) {
      this.props.escolheTema(dados[index - 1].tema);
    }
  }

  escolhePergunta(e) {
    e.preventDefault();
    this.props.escolhePergunta(Number(e.target.id));
  }

  selecionaTema(e) {
    e.preventDefault();
    const dadosAba = this.getDadosAba();
    const index = dadosAba[0];
    const dados = dadosAba[1];

    const perguntasFiltradas = dados.filter(pergunta => {
      return pergunta.tema === e.target.id;
    });

    this.props.escolheTema(e.target.id);
    this.props.escolhePergunta(perguntasFiltradas[0].id);
  }

  render() {
    const {
      filtroTema,
      isExibeGavetaPerguntas,
      isContinuarRespondendo
    } = this.props.questionario;

    const { respondeuTodos } = this.props.usuario;

    const dadosAba = this.getDadosAba();
    const indexPergunta = dadosAba[0];
    const dadosPerguntas = dadosAba[1];
    const tamPergunta = dadosAba[2];

    let indicadorPergunta;
    let exibeMenu;
    let temas = [];

    if (!isEmpty(dadosPerguntas)) {
      const dadosPergunta = dadosPerguntas[indexPergunta];

      const { respostasUsuario } = this.props.usuario;

      let nomeTemas = new Set();
      dadosPerguntas.forEach(pergunta => {
        nomeTemas.add(pergunta.tema);
      });

      Array.from(nomeTemas).forEach((tema, i) => {
        temas.push(
          <li className="nav-item" key={i}>
            <a
              className={classnames("nav-link nav-link-a", {
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
              className={classnames("nav-link nav-link-b", {
                active: perguntaFiltrada.id === indexPergunta,
                done:
                  respostasUsuario[Number(perguntaFiltrada.id)] !== 0 &&
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
      exibeMenu = (
        <div
          id="perguntaContainer"
          className="card"
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
          </div>
        </div>
      );
    }

    return (
      <div className="pergunta-container">
        <div>
          <div className="panel-detail-header">
            <div
              className="nav-horizontal nav-horizontal-lg custom-scroll-bar"
            // onClick={this.showPerguntaContainer}
            >
              <ul className="nav nav-tabs nav-fill nav-horizontal-pills">
                {temas}
              </ul>
            </div>
            <Collapse isOpen={isExibeGavetaPerguntas}>
              <FlipMove>
                {(!respondeuTodos || isContinuarRespondendo) && exibeMenu}
              </FlipMove>
            </Collapse>
          </div>
        </div>
      </div>
    )
  }

}

MenuTema.propTypes = {
  passaPergunta: PropTypes.func.isRequired,
  voltaPergunta: PropTypes.func.isRequired,
  escolhePergunta: PropTypes.func.isRequired,
  escolheTema: PropTypes.func.isRequired,
  escondePerguntas: PropTypes.func.isRequired,
  exibePerguntas: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  usuario: state.usuarioReducer,
  candidatos: state.candidatosReducer,
  perguntas: state.perguntasReducer,
  votacoes: state.votacoesReducer,
  auth: state.auth,
  questionario: state.questionarioReducer
});

export default connect(
  mapStateToProps,
  {
    passaPergunta,
    voltaPergunta,
    escolhePergunta,
    escolheTema,
    escondePerguntas,
    exibePerguntas
  }
)(MenuTema);