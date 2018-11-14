import React, { Component } from "react";

import "./App.css";

// Redux imports
import { Provider } from "react-redux";
import store from "./store";

// Token and Auth Stuff
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

// Layout imports
import Navbar from "./components/layout/navbar/Navbar";
import Footer from "./components/layout/footer/Footer";

// Login and logout actions
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { salvaScoreUsuario } from "./actions/usuarioActions";
import Main from "./Main";

import ReactGA from "react-ga";
ReactGA.initialize("UA-124057258-1");
ReactGA.pageview(window.location.pathname + window.location.search);

// Check token
if (localStorage.accessToken) {
  // Set auth header
  setAuthToken(localStorage.accessToken);

  // Decode token
  const decoded = jwt_decode(localStorage.accessToken);

  // // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  store.dispatch(salvaScoreUsuario(decoded.respostas));

  // // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout
    store.dispatch(logoutUser());
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Navbar />
          <Main />
          <Footer />
        </div>
      </Provider>
    );
  }
}

export default App;
