import React, { Component } from "react";

import isEmpty from "../../../validation/is-empty";
import Spinner from "../../common/Spinner";

class PontuacaoTema extends Component {
  render() {
    let pontuacoesTemas;
    if (!isEmpty(this.props.scoreTema)) {
      pontuacoesTemas = Object.keys(this.props.scoreTema).map(tema => (
        <div key={tema} className={tema}>
          {tema + ": " + Math.round(this.props.scoreTema[tema] * 100) + "%"}
        </div>
      ));

      return <div>{pontuacoesTemas}</div>;
    }
    return <Spinner />;
  }
}

export default PontuacaoTema;
