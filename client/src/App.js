import React, { Component } from "react";

import "./App.css";

// Layout imports
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PerguntasContainer from "./components/perguntas/PerguntasContainer";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="container">
          <div className="row">
            <div className="col-6">
              <PerguntasContainer />
            </div>
            <div className="col-6">Candidatos</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
