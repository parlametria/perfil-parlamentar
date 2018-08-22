import React, { Component } from "react";
import Pergunta from "./Pergunta";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { salvaScoreUsuario } from "../../actions/usuarioActions";
import { calculaScore } from "../../actions/candidatosActions";
import {
  getDadosPerguntas,
  voltaPergunta,
  passaPergunta
} from "../../actions/perguntasActions";

import Spinner from "../common/Spinner";
import isEmpty from "../../validation/is-empty";

class PerguntasContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      respostasUsuario: {},
      arrayRespostasUsuario: [],
      indexPerguntaAtual: 0,
      categoriaPergunta: "Meio Ambiente"
    };
    this.passaPergunta = this.passaPergunta.bind(this);
    this.voltaPergunta = this.voltaPergunta.bind(this);
    this.selecionaTema = this.selecionaTema.bind(this);
  }

  registraResposta(novaResposta) {
    let { respostasUsuario } = this.state;
    let { arrayRespostasUsuario } = this.state;
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
    this.setState({
      categoriaPergunta: e.target.id
    });
  }

  componentDidMount() {
    const { respostasUsuario, arrayRespostasUsuario } = this.props.usuario;
    const { perguntaAtual } = this.props.perguntas;
    this.props.getDadosPerguntas();
    this.setState({
      respostasUsuario,
      arrayRespostasUsuario,
      indexPerguntaAtual: perguntaAtual
    });
  }

  render() {
    const {
      dadosPerguntas,
      perguntaAtual,
      isCarregando
    } = this.props.perguntas;

    const perguntas = Object.keys(dadosPerguntas).map(tema => {
      let perguntasDoTema = dadosPerguntas[tema].map(pergunta => {
        let { arrayRespostasUsuario } = this.props.usuario;
        return (
          <Pergunta
            key={pergunta.key}
            id={pergunta.key}
            pergunta={pergunta.pergunta}
            voto={arrayRespostasUsuario[pergunta.key]}
            onVota={novaResposta => this.registraResposta(novaResposta)}
          />
        );
      });

      return (
        <div key={tema} className="container">
          <h4>{tema}</h4>
          <div>{perguntasDoTema}</div>
          <div className="dropdown-divider" />
        </div>
      );
    });

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
    let temas;

    if (!isEmpty(dadosPerguntas)) {
      const dadosPergunta = dadosPerguntas[this.state.categoriaPergunta];
      const { arrayRespostasUsuario } = this.props.usuario;

      temas = Object.keys(dadosPerguntas).map(elem => (
        <div
          className="btn btn-dark col"
          key={elem}
          id={elem}
          onClick={this.selecionaTema}
        >
          {elem}
        </div>
      ));

      pergunta = (
        <Pergunta
          key={dadosPergunta[perguntaAtual].key}
          id={dadosPergunta[perguntaAtual].key}
          pergunta={dadosPergunta[perguntaAtual].pergunta}
          voto={arrayRespostasUsuario[dadosPergunta[perguntaAtual].key]}
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
            <div className="row">{pergunta.key}</div>
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
  getDadosPerguntas: PropTypes.func.isRequired
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
    voltaPergunta
  }
)(PerguntasContainer);
