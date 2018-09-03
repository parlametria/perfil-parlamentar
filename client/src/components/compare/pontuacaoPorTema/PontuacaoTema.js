import React, { Component } from "react";

import isEmpty from "../../../validation/is-empty";

class PontuacaoTema extends Component {

  render() {
    let score;
    if (!isEmpty(this.scoreTema)) {
      score = this.scoreTema["Meio Ambiente"];
      console.log(score);

      return (
        <div>
          {score.tema} + :
          <br />
          {score.score}
        </div>
      );
    }
    return null;
  };
}

export default PontuacaoTema;