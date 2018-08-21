import React, { Component } from "react";
import Pergunta from "./Pergunta";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { salvaScoreUsuario } from "../../actions/usuarioActions";
import { calculaScore } from "../../actions/candidatosActions";
import { getDadosPerguntas } from "../../actions/perguntasActions";

import Spinner from "../common/Spinner";

class PerguntasContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { respostasUsuario: {}, arrayRespostasUsuario: [] };
  }

  registraResposta(novaResposta) {
    let { respostasUsuario } = this.state;
    let { arrayRespostasUsuario } = this.state;
    respostasUsuario[novaResposta.id] = novaResposta.resposta;
    arrayRespostasUsuario[novaResposta.id] = novaResposta.resposta;
    this.props.salvaScoreUsuario(respostasUsuario, arrayRespostasUsuario);
    this.props.calculaScore();
  }

  componentDidMount() {
    this.props.getDadosPerguntas();
  }

  render() {
    const { dadosPerguntas } = this.props.perguntas;

    const perguntas = Object.keys(dadosPerguntas).map(tema => {
      let perguntasDoTema = dadosPerguntas[tema].map(pergunta => (
        <Pergunta
          key={pergunta.key}
          id={pergunta.key}
          pergunta={pergunta.pergunta}
          onVota={novaResposta => this.registraResposta(novaResposta)}
        />
      ));

      return (
        <div key={tema} className="container">
          <h4>{tema}</h4>
          <div>{perguntasDoTema}</div>
          <div className="dropdown-divider" />
        </div>
      );
    });

    return (
      <div className="container perguntas-container">
        {this.props.candidatos.isCarregando ? <Spinner /> : perguntas}
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
  { salvaScoreUsuario, calculaScore, getDadosPerguntas }
)(PerguntasContainer);
