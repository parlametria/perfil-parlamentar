import React, { Component } from "react";

import "./App.css";

// Redux imports
import { Provider } from "react-redux";
import store from "./store";

// Layout imports
import Navbar from "./components/layout/navbar/Navbar";
import Footer from "./components/layout/footer/Footer";

// Login and logout actions
import { setCurrentUser } from "./actions/authActions";
import Main from "./Main";

import ReactGA from 'react-ga';
ReactGA.initialize('UA-124057258-1');
ReactGA.pageview(window.location.pathname + window.location.search);

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
          <Main />
          <Footer />
        </div>
      </Provider>
    );
  }
}

export default App;
