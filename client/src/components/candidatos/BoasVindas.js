import React from "react";

import { connect } from "react-redux";

export default () => {
  return (
    <div className="container tutorial pb-3">
      <h2 className="panel-title text-center">Vamos começar?</h2>
      <div className="pb-3">
        <p>
          <strong className="strong">Vote</strong> nos temas propostos e veja
          aqui os candidatos que mais se alinham com você.
        </p>
        <p>
          <strong className="strong">Filtre</strong> o resultado segundo seus
          critérios.
        </p>
        <p>
          <strong className="strong">Informe-se</strong> sobre os 5 temas.
          Quanto mais perguntas você responder, mas preciso é o resultado.
        </p>
      </div>
      <div className="text-center">
        <button className="btn btn-primary">Mostre-me todos</button>
      </div>
    </div>
  );
};
