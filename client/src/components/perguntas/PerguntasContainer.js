import React, { Component } from "react";
import Pergunta from "./Pergunta";
import jsonPerguntas from "../../data/perguntas.json";

class PerguntasContainer extends Component {
  render() {
    const perguntas = jsonPerguntas.map((elem, i) => {
      let perguntasDoTema = elem.perguntas.map((elem, i) => (
        <Pergunta key={i} pergunta={elem.pergunta} autor={elem.autor} />
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

export default PerguntasContainer;
