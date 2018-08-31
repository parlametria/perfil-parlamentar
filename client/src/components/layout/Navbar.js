import React, { Component } from "react";

import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { loginUser, logoutUser } from "../../actions/authActions";

class Navbar extends Component {
  onSignInWithGoogle(e) {
    e.preventDefault();

    this.props.loginUser();
  }

  onSignOut(e) {
    e.preventDefault();

    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const loginButton = (
      <li className="nav-item">
        <a
          href=""
          onClick={this.onSignInWithGoogle.bind(this)}
          className="navlink"
        />
      </li>
    );

    const loggedInBar = (
      <li className="nav-item">
        <a href="" onClick={this.onSignOut.bind(this)} className="navlink">
          <img
            className="rounded-circle"
            src={user.photoURL}
            alt={user.displayName}
            style={{ width: "40px", marginRight: "5px" }}
          />
          Logout
        </a>
      </li>
    );

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link to="/" className="navbar-brand">
              Voz Ativa
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#mainNavbar"
              aria-expanded="false" aria-label="Menu"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="mainNavbar">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to="/calculo" className="nav-link">
                    Método
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Sobre
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/equipe">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
Navbar.propTypes = {
  loginUser: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { loginUser, logoutUser }
)(Navbar);
