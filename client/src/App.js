import React, { Component } from "react";

import "./App.css";

// Layout imports
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Containers imports
import PerguntasContainer from "./components/perguntas/PerguntasContainer";
import CandidatosContainer from "./components/candidatos/CandidatosContainer";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <PerguntasContainer />
            </div>
            <div className="col-md-6 col-sm-12">
              <CandidatosContainer />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
