import React, { Component } from "react";
import FinalPerguntas from "./FinalPerguntas";

class FinalVozAtiva extends Component {
  render() {
    return (
      <div>
        <FinalPerguntas>
          <h4 className="text-center p-3">
            Você já respondeu a todas as perguntas do Voz Ativa!
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
            <strong className="strong">Responda</strong> as proposições da
            Câmara dos Deputados e aumente a precisão do score com candidatos
            que já possuem histórico.
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

export default FinalVozAtiva;
