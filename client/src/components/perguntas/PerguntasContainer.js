import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Tooltip } from "reactstrap";

import Pergunta from "./Pergunta";
import FinalPerguntas from "./FinalPerguntas";
import { CopyToClipboard } from "react-copy-to-clipboard";

import {
  calculaScore,
  calculaScorePorTema
} from "../../actions/candidatosActions";
import {
  getDadosPerguntas,
  voltaPergunta,
  passaPergunta,
  escolhePergunta,
  escolheTema,
  exibePerguntas,
  escondePerguntas
} from "../../actions/perguntasActions";

import { salvaRespostasUsuario } from "../../actions/usuarioActions";

import FlipMove from "react-flip-move";

import { Collapse } from "reactstrap";

import classnames from "classnames";

import isEmpty from "../../validation/is-empty";

import { criaURL } from "../../constantes/tratamentoUrls";

//import { delay } from "../../utils/funcoes";

import "./perguntas.css";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class PerguntasContainer extends Component {
  constructor(props) {
    super(props);

    this.state = { copied: false };

    this.passaPergunta = this.passaPergunta.bind(this);
    this.voltaPergunta = this.voltaPergunta.bind(this);
    this.selecionaTema = this.selecionaTema.bind(this);
    this.escolhePergunta = this.escolhePergunta.bind(this);
    this.togglePerguntaContainer = this.togglePerguntaContainer.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    if (this.state.copied) {
      this.setState({
        copied: !this.state.copied
      });
    }
  }

  registraResposta(novaResposta) {
    const { respostasUsuario } = this.props.usuario;

    respostasUsuario.vozAtiva[novaResposta.id] = novaResposta.resposta;
    //arrayRespostasUsuario[novaResposta.id] = novaResposta.resposta;
    this.props.salvaRespostasUsuario(respostasUsuario);

    this.props.calculaScore();
    this.passaPergunta();
  }

  geraUrl() {
    const url =
      "www.vozativa.org/" +
      this.props.candidatos.filtro.estado +
      "/" +
      criaURL(this.props.usuario.respostasUsuario);
    return url;
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

    //this.props.salvaScoreUsuario({}, Array(45).fill(1));
  }

  render() {
    const {
      dadosPerguntas,
      indexPergunta,
      filtroTema,
      isExibeGavetaPerguntas,
      isContinuarRespondendo
    } = this.props.perguntas;

    const { respondeuTodos } = this.props.usuario;

    let pergunta;
    let indicadorPergunta;
    let temas = [];
    let exibePerguntas;
    let exibeFinalPerguntas;

    const botaoCopia = (
      <div
        className="text-center d-sm-block mb-2"
        style={{ marginTop: "-10px" }}
      >
        <CopyToClipboard
          text={this.geraUrl()}
          onCopy={() => this.setState({ copied: true })}
        >
          <button className="btn btn-outline-primary" id="shareBtn">
            compartilhe suas respostas{" "}
            <span className="badge badge-success">novo!</span>
          </button>
        </CopyToClipboard>
        <Tooltip
          placement="right"
          isOpen={this.state.copied}
          target="shareBtn"
          toggle={this.toggle}
          delay={{ hide: 1000 }}
        >
          Link copiado!
        </Tooltip>
      </div>
    );

    if (!isEmpty(dadosPerguntas)) {
      const dadosPergunta = dadosPerguntas[indexPergunta];

      const {
        vozAtiva: respostasUsuario
      } = this.props.usuario.respostasUsuario;

      // Constrói os eixos (isso idealmente deve vir de um bd, algo assim)
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

      pergunta = (
        <Pergunta
          key={dadosPergunta.id}
          id={dadosPergunta.id}
          index={dadosPergunta.id}
          pergunta={dadosPergunta.texto}
          ajuda={dadosPergunta.ajuda}
          voto={respostasUsuario[dadosPergunta.id]}
          onVota={novaResposta => this.registraResposta(novaResposta)}
        />
      );

      exibePerguntas = (
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
            {pergunta}
            {botaoCopia}
          </div>
        </div>
      );

      exibeFinalPerguntas = (
        <div>
          <FinalPerguntas />
        </div>
      );
    }

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
          <Collapse isOpen={isExibeGavetaPerguntas}>
            <FlipMove>
              {(!respondeuTodos || isContinuarRespondendo) && exibePerguntas}
              {respondeuTodos && !isContinuarRespondendo && exibeFinalPerguntas}
            </FlipMove>
          </Collapse>
          <button
            type="button"
            className="btn btn-block btn-primary btn-square d-lg-none"
            onClick={this.togglePerguntaContainer}
          >
            {isExibeGavetaPerguntas && (
              <span>
                <span className="icon-cursor" /> Esconder
              </span>
            )}
            {!isExibeGavetaPerguntas && (
              <span>
                <span className="icon-up" /> Mostrar
              </span>
            )}
          </button>
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

  togglePerguntaContainer(event) {
    event.preventDefault();
    this.props.perguntas.isExibeGavetaPerguntas
      ? this.props.escondePerguntas()
      : this.props.exibePerguntas();
  }
}

PerguntasContainer.propTypes = {
  salvaRespostasUsuario: PropTypes.func.isRequired,
  calculaScore: PropTypes.func.isRequired,
  calculaScorePorTema: PropTypes.func.isRequired,
  getDadosPerguntas: PropTypes.func.isRequired,
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
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    salvaRespostasUsuario,
    calculaScore,
    calculaScorePorTema,
    getDadosPerguntas,
    passaPergunta,
    voltaPergunta,
    escolhePergunta,
    escolheTema,
    escondePerguntas,
    exibePerguntas
  }
)(PerguntasContainer);
