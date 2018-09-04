import React, { Component } from "react";

import isEmpty from "../../../validation/is-empty";
import Spinner from "../../common/Spinner";

class PontuacaoTema extends Component {
  render() {
    let pontuacoesTemas;
    if (!isEmpty(this.props.scoreTema)) {
      pontuacoesTemas = Object.keys(this.props.scoreTema).map(tema => (
        <div>
          <span className="icon-minus strong" /> {tema}
          <div className="score-theme text-center mb-3">
            {Math.round(this.props.scoreTema[tema] * 100) + "%"}
          </div>
        </div>
      ));

      return <div>{pontuacoesTemas}</div>;
    }
    return <Spinner />;
  }
}

export default PontuacaoTema;
