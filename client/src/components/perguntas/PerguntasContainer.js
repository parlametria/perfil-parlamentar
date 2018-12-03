import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Pergunta from "./Pergunta";
import FinalPerguntas from "./FinalPerguntas";
import CopiaUrl from "../questionario/CopiaUrl";

import {
  calculaScore,
  calculaScorePorTema
} from "../../actions/candidatosActions";

import { getDadosPerguntas } from "../../actions/perguntasActions";

import {
  passaPergunta,
  escolheTema,
  exibePerguntas,
  escondePerguntas
} from "../../actions/questionarioActions";

import { salvaRespostasUsuario } from "../../actions/usuarioActions";

import { criaURL } from "../../constantes/tratamentoUrls";

import FlipMove from "react-flip-move";

import { Collapse } from "reactstrap";

import isEmpty from "../../validation/is-empty";

//import { delay } from "../../utils/funcoes";

import "./perguntas.css";
import FinalVozAtiva from "./FinalVozAtiva";
import FinalVotacoes from "./FinalVotacoes";
import FinalQuestionario from "./FinalQuestionario";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class PerguntasContainer extends Component {
  constructor(props) {
    super(props);

    this.passaPergunta = this.passaPergunta.bind(this);
    this.togglePerguntaContainer = this.togglePerguntaContainer.bind(this);
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

  componentDidMount() {
    this.props.getDadosPerguntas();

    //this.props.salvaScoreUsuario({}, Array(45).fill(1));
  }

  render() {
    const { dadosPerguntas, indexPergunta } = this.props.perguntas;

    const {
      isExibeGavetaPerguntas,
      isContinuarRespondendo
    } = this.props.questionario;

    const {
      respondeuTodos,
      respondeuVozAtiva,
      respondeuQMR
    } = this.props.usuario;

    let pergunta;
    let exibePerguntas;
    let exibeFinalPerguntas;

    if (!isEmpty(dadosPerguntas)) {
      const dadosPergunta = dadosPerguntas[indexPergunta];

      const {
        vozAtiva: respostasUsuario
      } = this.props.usuario.respostasUsuario;

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
            {pergunta}
            <CopiaUrl />
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
          <Collapse isOpen={isExibeGavetaPerguntas}>
            <FlipMove>
              {((!respondeuTodos && !respondeuQMR && !respondeuVozAtiva) ||
                isContinuarRespondendo) &&
                exibePerguntas}
              {respondeuVozAtiva &&
                !respondeuTodos &&
                !isContinuarRespondendo && <FinalVozAtiva />}
              {respondeuQMR && !respondeuTodos && !isContinuarRespondendo && (
                <FinalVotacoes />
              )}
              {respondeuTodos && !isContinuarRespondendo && (
                <FinalQuestionario />
              )}
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
    this.props.questionario.isExibeGavetaPerguntas
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
  escolheTema: PropTypes.func.isRequired,
  escondePerguntas: PropTypes.func.isRequired,
  exibePerguntas: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  usuario: state.usuarioReducer,
  candidatos: state.candidatosReducer,
  perguntas: state.perguntasReducer,
  auth: state.auth,
  questionario: state.questionarioReducer
});

export default connect(
  mapStateToProps,
  {
    salvaRespostasUsuario,
    calculaScore,
    calculaScorePorTema,
    getDadosPerguntas,
    passaPergunta,
    escolheTema,
    escondePerguntas,
    exibePerguntas
  }
)(PerguntasContainer);
