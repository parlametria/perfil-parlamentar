import React, { Component } from "react";
import Candidato from "./Candidato";

class CandidatosContainer extends Component {
  render() {
    return (
      <div className="container candidatos-container">
        <Candidato
          key={1}
          nome="Luiza Erundina"
          siglaPartido="PSOL"
          estado="SP"
        />
      </div>
    );
  }
}

export default CandidatosContainer;
