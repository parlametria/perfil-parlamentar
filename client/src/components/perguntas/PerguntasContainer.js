import React, { Component } from "react";
import Pergunta from "./Pergunta";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { salvaScoreUsuario } from "../../actions/usuarioActions";
import { calculaScore } from "../../actions/candidatosActions";
import {
  getDadosPerguntas,
  voltaPergunta,
  passaPergunta,
  escolhePergunta,
  escolheTema
} from "../../actions/perguntasActions";

import Spinner from "../common/Spinner";
import isEmpty from "../../validation/is-empty";

import "./perguntas.css";

class PerguntasContainer extends Component {
  constructor(props) {
    super(props);

    this.passaPergunta = this.passaPergunta.bind(this);
    this.voltaPergunta = this.voltaPergunta.bind(this);
    this.selecionaTema = this.selecionaTema.bind(this);
    this.escolhePergunta = this.escolhePergunta.bind(this);
  }

  registraResposta(novaResposta) {
    const { respostasUsuario, arrayRespostasUsuario } = this.props.usuario;

    respostasUsuario[novaResposta.id] = novaResposta.resposta;
    arrayRespostasUsuario[novaResposta.id] = novaResposta.resposta;
    this.props.salvaScoreUsuario(respostasUsuario, arrayRespostasUsuario);
    this.props.calculaScore();
    this.passaPergunta();
  }

  passaPergunta() {
    this.props.passaPergunta();
  }

  voltaPergunta() {
    this.props.voltaPergunta();
  }

  escolhePergunta(e) {
    e.preventDefault();
    this.props.escolhePergunta(parseInt(e.target.id));
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
    const {
      dadosPerguntas,
      indexPergunta,
      isCarregando
    } = this.props.perguntas;

    const botoesNavegacao = (
      <div>
        <div className="btn btn-danger" onClick={this.voltaPergunta}>
          Voltar
        </div>
        <div className="btn btn-primary" onClick={this.passaPergunta}>
          Avançar
        </div>
      </div>
    );

    let pergunta;
    let indicadorPergunta;
    let temas = [];

    if (!isEmpty(dadosPerguntas)) {
      const dadosPergunta = dadosPerguntas[indexPergunta];

      const { arrayRespostasUsuario } = this.props.usuario;

      // Constrói os eixos (isso idealmente deve vir de um bd, algo assim)
      let nomeTemas = new Set();
      dadosPerguntas.map(pergunta => {
        nomeTemas.add(pergunta.tema);
      });

      Array.from(nomeTemas).map((tema, i) => {
        temas.push(
          <li class="nav-item">
            <a class="nav-link done" onClick={this.selecionaTema} id={tema}>
              {tema}
            </a>
          </li>
        );
      });

      pergunta = (
        <Pergunta
          key={dadosPergunta.id}
          id={dadosPergunta.id}
          pergunta={dadosPergunta.texto}
          ajuda={dadosPergunta.ajuda}
          voto={arrayRespostasUsuario[dadosPergunta.id]}
          onVota={novaResposta => this.registraResposta(novaResposta)}
        />
      );

      indicadorPergunta = dadosPerguntas.map((pergunta, index) => (
        // done -> o usuario já respondeu essa pergunta
        // active -> o usuário está respondendo
        <li className="nav-item">
          <a
            className="nav-link"
            key={index + ". " + pergunta.id}
            id={pergunta.id}
            onClick={this.escolhePergunta}
          >
            <span className="icon-cursor icon-current" />
            {index + 1}
          </a>
        </li>
      ));
    }

    return (
      <div>
        <div className="panel-detail-header">
          <div className="nav-horizontal">
            <ul className="nav nav-tabs nav-fill nav-horizontal-pills">
              {temas}
            </ul>
          </div>
        </div>
        <div className="card">
          <div class="card-body">
            <div class="nav-horizontal">
              <ul class="nav nav-pills nav-fill nav-horizontal-pills-sm">
                {indicadorPergunta}
              </ul>
            </div>
            {pergunta}
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
}

PerguntasContainer.propTypes = {
  salvaScoreUsuario: PropTypes.func.isRequired,
  calculaScore: PropTypes.func.isRequired,
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
    getDadosPerguntas,
    passaPergunta,
    voltaPergunta,
    escolhePergunta,
    escolheTema
  }
)(PerguntasContainer);
