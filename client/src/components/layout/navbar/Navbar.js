import React, { Component } from "react";

import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import io from "socket.io-client";

import { isMobile } from "react-device-detect";

import {
  facebookLogin,
  googleLogin,
  logoutUser,
  twitterLogin
} from "../../../actions/authActions";

import TwitterLogin from "react-twitter-auth";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login";

//import config from "../../../config.json";

import "./navbar.css";

const API_URL = "http://localhost:5000";

const socket = io(API_URL);

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: ""
    };

    this.popup = null;

    this.facebookResponse = this.facebookResponse.bind(this);
    this.googleResponse = this.googleResponse.bind(this);
    this.onSignOut = this.onSignOut.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  componentDidMount() {
    socket.on("user", user => {
      this.popup.close();
      this.props.twitterLogin(user);
    });
  }

  checkPopup() {
    const check = setInterval(() => {
      const { popup } = this;
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check);
        this.setState({ disabled: "" });
      }
    }, 1000);
  }

  openPopup() {
    const width = 600,
      height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const url = `${API_URL}/api/auth/twitter?socketId=${socket.id}`;

    return window.open(
      url,
      "",
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
      scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
      height=${height}, top=${top}, left=${left}`
    );
  }

  startAuth() {
    if (!this.state.disabled) {
      this.popup = this.openPopup();
      this.checkPopup();
      this.setState({ disabled: "disabled" });
    }
  }

  closeCard() {
    this.props.logoutUser();
  }

  facebookResponse(response) {
    console.log("loga com facebook");
    this.props.facebookLogin(response);
    this.props.history.push("/");
  }

  googleResponse(response) {
    console.log("loga com google");
    this.props.googleLogin(response);
  }

  onFailure = error => {
    console.log(error);
  };

  onSignOut(e) {
    e.preventDefault();

    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    let linkCompartilhamento = "www.vozativa.org/";
    let textoCompartilhamento =
      "Nos diga o que você defende e em oito minutos a gente apresenta candidatos alinhados com você. " +
      linkCompartilhamento;

    const barraLogado = (
      <div>
        <div>Bem vindo, {user.firstName}!</div>
        <span
          className="navbar-text navbar-text-strong"
          onClick={this.onSignOut}
        >
          logout
        </span>
      </div>
    );

    const barraNaoLogado = (
      <div>
        <span className="navbar-text navbar-text-strong">faça login</span>
        <ul className="navbar-nav navbar-inline">
          <li className="nav-link nav-strong">
            <GoogleLogin
              className="login-google"
              clientId={
                "791030988243-msi1r67ltvd5v1fjtajj3un1f0c0d7ds.apps.googleusercontent.com"
              }
              buttonText="Google"
              onSuccess={this.googleResponse}
              onFailure={this.onFailure}
            >
              <a
                data-show-count="false"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="icon-google1 share-icon" />
              </a>
            </GoogleLogin>
          </li>

          <li className="nav-link nav-strong">
            <FacebookLogin
              appId={2339282366084079}
              autoLoad={false}
              fields="name,email,picture"
              callback={this.facebookResponse}
              cssClass="login-facebook"
              icon="icon-facebook share-icon"
              textButton=""
              tag="button"
            />
          </li>

          <li className="nav-link nav-strong">
            <div className={"container"}>
              <div className={"button"}>
                <button
                  onClick={this.startAuth.bind(this)}
                  className={`twitter ${this.state.disabled}`}
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    );

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container">
            <Link to="/" className="navbar-brand">
              <img
                src={require("../../../data/img/logo.png")}
                alt="Voz Ativa"
                width="100px"
              />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#mainNavbar"
              aria-expanded="false"
              aria-label="Menu"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="mainNavbar">
              <ul className="navbar-nav ml-auto pr-1">
                <li className="nav-item">
                  <Link to="/sobre" className="nav-link">
                    Sobre
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/soucandidato" className="nav-link">
                    Sou candidato
                  </Link>
                </li>
              </ul>
              {!isAuthenticated && barraNaoLogado}
              {isAuthenticated && barraLogado}

              {/* <span className="navbar-text navbar-text-strong">
                compartilhe
              </span>
              <ul className="navbar-nav navbar-inline">
                <li className="nav-item">
                  <a
                    href={
                      "https://twitter.com/intent/tweet/?text=" +
                      textoCompartilhamento
                    }
                    data-show-count="false"
                    className="nav-link nav-strong"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="icon-twitter share-icon" />
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href={
                      "https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fvozativa.org%2F&amp;src=sdkpreparse"
                    }
                    data-show-count="false"
                    className="nav-link nav-strong"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="icon-facebook share-icon" />
                  </a>
                </li>
                {!isMobile && (
                  <li className="nav-item">
                    <a
                      href={
                        "https://web.whatsapp.com/send?text=" +
                        textoCompartilhamento
                      }
                      data-show-count="false"
                      className="nav-link nav-strong"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="icon-zapzap share-icon" />
                    </a>
                  </li>
                )}
                {isMobile && (
                  <li className="nav-item">
                    <a
                      href={"whatsapp://send?text=" + textoCompartilhamento}
                      className="nav-link"
                    >
                      <span className="icon-zapzap share-icon" />
                    </a>
                  </li>
                )}
              </ul> */}
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

Navbar.propTypes = {
  facebookLogin: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  googleLogin: PropTypes.func.isRequired,
  twitterLogin: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(
  connect(
    mapStateToProps,
    { facebookLogin, googleLogin, logoutUser, twitterLogin }
  )(Navbar)
);
