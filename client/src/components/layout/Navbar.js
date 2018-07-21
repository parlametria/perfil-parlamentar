import React, { Component } from "react";

class Navbar extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
          <div className="container">
            <a className="navbar-brand">Voz Ativa</a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#mobile-nav"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="mobile-nav">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <a className="nav-link">Candidatos</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link">Eleições 2018</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link">Como o cálculo é feito?</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link">Equipe</a>
                </li>
              </ul>
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a className="nav-link">Sign in with Google</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
