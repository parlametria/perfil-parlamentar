import React, { Component } from "react";
import Pergunta from "./Pergunta";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { salvaScoreUsuario } from "../../actions/usuarioActions";
import { calculaScore } from "../../actions/candidatosActions";

import jsonPerguntas from "../../data/perguntas.json";

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
    const { respostasUsuario } = this.props.usuario;
    const { arrayRespostasUsuario } = this.props.usuario;
    this.setState({ respostasUsuario, arrayRespostasUsuario });
  }

  render() {
    const perguntas = jsonPerguntas.map((elem, i) => {
      let perguntasDoTema = elem.perguntas.map((elem, i) => (
        <Pergunta
          key={i}
          id={i}
          pergunta={elem.pergunta}
          autor={elem.autor}
          onVota={novaResposta => this.registraResposta(novaResposta)}
        />
      ));

      return (
        <div key={i} className="container">
          <h4>{elem.tema}</h4>
          <div>{perguntasDoTema}</div>
          <div className="dropdown-divider" />
        </div>
      );
    });

    return <div className="container perguntas-container">{perguntas}</div>;
  }
}

PerguntasContainer.propTypes = {
  salvaScoreUsuario: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  usuario: state.usuarioReducer,
  candidatos: state.candidatosReducer
});

export default connect(
  mapStateToProps,
  { salvaScoreUsuario, calculaScore }
)(PerguntasContainer);
