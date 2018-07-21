import React, { Component } from "react";
import Pergunta from "./Pergunta";

class VotacoesContainer extends Component {
  render() {
    const jsonPerguntas = [
      {
        tema: "Segurança",
        perguntas: [{ pergunta: "Você deseja a paz mundial?", autor: "OC" }]
      },
      {
        tema: "Educação",
        perguntas: [
          {
            pergunta: "Você deseja melhorar a educação no Brasil?",
            autor: "OC"
          },
          {
            pergunta: "Você deseja melhorar a educação no Brasil?",
            autor: "OC"
          }
        ]
      }
    ];
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
