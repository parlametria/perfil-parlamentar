import React from "react";

// Containers imports
import PerguntasContainer from "../perguntas/PerguntasContainer";
import CandidatosContainer from "../candidatos/CandidatosContainer";

const Home = () => (
  <div>
    <section class="intro">
      <div class="container">
        <h2 class="intro-title text-center">Nos diga o que você <strong>defende</strong> e a gente apresenta candidatos alinhados com seu perfil</h2>
        <div class="d-flex justify-content-center">
          <form>
            <div class="form-group">
              <select class="form-control">
                <option selected>Em que Estado você vota?</option>
                <option>Acre</option>
                <option>Acre 2</option>
                <option>Acre 3</option>
                <option>Acre 4</option>
                <option>Acre 5 </option>
              </select>
            </div>
          </form>
        </div>
      </div>
    </section>

    <div class="grid-main">
      <section class="grid-panel panel-master">
        <CandidatosContainer />
      </section>
      <div class="grid-separator"></div>
      <section class="grid-panel panel-detail">
        <PerguntasContainer />
      </section>
    </div>

  </div>
);

export default Home;
