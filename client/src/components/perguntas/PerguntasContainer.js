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

class PerguntasContainer extends Component {
  constructor(props) {
    super(props);

    this.passaPergunta = this.passaPergunta.bind(this);
    this.voltaPergunta = this.voltaPergunta.bind(this);
    this.selecionaTema = this.selecionaTema.bind(this);
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
          <div
            id={tema}
            onClick={this.selecionaTema}
            key={i + ". " + tema}
            className="btn btn-dark col"
          >
            {tema}
          </div>
        );
      });

      pergunta = (
        <Pergunta
          key={dadosPergunta.id}
          id={dadosPergunta.id}
          pergunta={dadosPergunta.texto}
          voto={arrayRespostasUsuario[dadosPergunta.id]}
          onVota={novaResposta => this.registraResposta(novaResposta)}
        />
      );
    }

    return (
      <div className="container perguntas-container">
        {isCarregando || isEmpty(dadosPerguntas) ? (
          <Spinner />
        ) : (
          <div>
            <div className="row">{temas}</div>
            <div className="row">{pergunta}</div>
            <div className="row">{botoesNavegacao}</div>
          </div>
        )}
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
