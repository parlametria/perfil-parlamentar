import React, { Component } from "react";

import "./App.css";

// Router Stuff
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Redux imports
import { Provider } from "react-redux";
import store from "./store";

// Layout imports
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Containers imports
import PerguntasContainer from "./components/perguntas/PerguntasContainer";
import CandidatosContainer from "./components/candidatos/CandidatosContainer";

// Login and logout actions
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { firebaseImpl } from "./services/firebaseService";

// Check token
if (localStorage.accessToken) {
  const user = JSON.parse(localStorage.user);
  store.dispatch(setCurrentUser(user));
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
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
      </Provider>
    );
  }
}

export default App;
