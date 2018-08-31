import React from "react";

// Containers imports
import PerguntasContainer from "../../perguntas/PerguntasContainer";
import CandidatosContainer from "../../candidatos/CandidatosContainer";

// CSS imports
import "./home.css";

// Import funções de estados e partidos
import { estados } from "../../../constantes/filtrosSeletoresCandidatos";

const Home = () => (
  <div>
    <section className="intro">
      <div className="container">
        <h2 className="intro-title text-center">
          Nos diga o que você <strong>defende</strong> e a gente apresenta
          candidatos alinhados com seu perfil
        </h2>
        <div className="d-flex justify-content-center">
          <form>
            <div className="form-group">
              <select className="form-control">
                <option selected>Em que Estado você vota?</option>
                {estados()}
              </select>
            </div>
          </form>
        </div>
      </div>
    </section>

    <div className="grid-main">
      <section className="grid-panel panel-master">
        <CandidatosContainer />
      </section>
      <div className="grid-separator" />
      <section className="grid-panel panel-detail">
        <PerguntasContainer />
      </section>
    </div>
  </div>
);

export default Home;
