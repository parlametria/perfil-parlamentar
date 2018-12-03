import React, { Component } from "react";
import FinalPerguntas from "./FinalPerguntas";

class FinalVotacoes extends Component {
  render() {
    return (
      <div>
        <FinalPerguntas>
          <h4 className="text-center p-3">
            Você já votou em todas as proposições!
          </h4>
          <p>
            <strong className="strong">Veja</strong> os deputados alinhados com
            você.
          </p>
          <p>
            <strong className="strong">Cobre</strong> a participação de quem não
            respondeu.
          </p>
          <p>
            <strong className="strong">Examine</strong> a atuação anterior dos
            candidatos reeleitos.
          </p>
          <p>
            <strong className="strong">Responda</strong> as perguntas do Voz
            Ativa e aumente a precisão do score.
          </p>
          <p>
            <strong className="strong">Compartilhe</strong> suas respostas nas
            redes sociais.
          </p>
        </FinalPerguntas>
      </div>
    );
  }
}

export default FinalVotacoes;
