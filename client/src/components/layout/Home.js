import React from "react";

// Containers imports
import PerguntasContainer from "../perguntas/PerguntasContainer";
import CandidatosContainer from "../candidatos/CandidatosContainer";

const Home = () => (
  <div className="container">
    <div className="row">
      <div className="col-md-6 col-sm-12 col-12">
        <CandidatosContainer />
      </div>
      <div className="col-md-6 col-sm-12 col-12">
        <PerguntasContainer />
      </div>
    </div>
  </div>
);

export default Home;
