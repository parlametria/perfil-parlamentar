import React, { Component } from "react";
import Pergunta from "./Pergunta";
import jsonPerguntas from "../../data/perguntas.json";

class VotacoesContainer extends Component {
  render() {
    const perguntas = jsonPerguntas.map((elem, i) => {
      let perguntasDoTema = elem.perguntas.map((elem, i) => (
        <Pergunta key={i} pergunta={elem.pergunta} autor={elem.autor} />
      ));

      return (
        <div className="container">
          <h4>{elem.tema}</h4>
          <div>{perguntasDoTema}</div>
          <div class="dropdown-divider" />
        </div>
      );
    });

    console.log(perguntas);

    return <div className="container perguntas-container">{perguntas}</div>;
  }
}

export default VotacoesContainer;
