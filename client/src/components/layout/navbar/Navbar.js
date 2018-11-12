import React, { Component } from "react";

import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import { isMobile } from "react-device-detect";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  facebookLogin,
  googleLogin,
  logoutUser,
  testaAutorizacao
} from "../../../actions/authActions";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login";

import "./navbar.css";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
    this.facebookResponse = this.facebookResponse.bind(this);
    this.googleResponse = this.googleResponse.bind(this);
    this.onSignOut = this.onSignOut.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  facebookResponse(response) {
    if (response.accessToken) {
      this.props.facebookLogin(response);
      this.props.history.push("/");
      this.setState({ modal: false });
    }
  }

  googleResponse(response) {
    this.props.googleLogin(response);
    this.setState({ modal: false });
  }

  onFailure = error => {
    console.log(error);
  };

  onSignOut(e) {
    e.preventDefault();

    this.props.logoutUser();
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    const { open } = this.state;
    const { isAuthenticated, user } = this.props.auth;

    let linkCompartilhamento = "www.vozativa.org/";
    let textoCompartilhamento =
      "Nos diga o que você defende e em oito minutos a gente apresenta candidatos alinhados com você. " +
      linkCompartilhamento;

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
                {!isAuthenticated && (
                  <li className="nav-item">
                    <a onClick={this.toggle} className="nav-link">
                      login
                    </a>
                  </li>
                )}
                {isAuthenticated && (
                  <li className="nav-item">
                    <a onClick={this.onSignOut} className="nav-link">
                      logout
                    </a>
                  </li>
                )}
              </ul>
              <Modal
                isOpen={this.state.modal}
                toggle={this.toggle}
                className="modal-login"
              >
                <ModalHeader toggle={this.toggle}>
                  identifique-se para a vozativa
                </ModalHeader>
                <ModalBody>
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <span className="icon-google1 login-icon" />
                      <GoogleLogin
                        className="login-text nav-link"
                        clientId="791030988243-msi1r67ltvd5v1fjtajj3un1f0c0d7ds.apps.googleusercontent.com"
                        buttonText="Google"
                        onSuccess={this.googleResponse}
                        onFailure={this.onFailure}
                      >
                        <a
                          data-show-count="false"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          entre com sua conta google
                        </a>
                      </GoogleLogin>
                    </li>

                    <li className="nav-item">
                      <span className="icon-facebook login-icon" />
                      <FacebookLogin
                        appId="2339282366084079"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={this.facebookResponse}
                        cssClass="login-text nav-link"
                        textButton="entre com sua conta facebook"
                        tag="button"
                        redirectUri="http://localhost:3000/"
                      />
                    </li>
                  </ul>
                </ModalBody>
              </Modal>

              {isMobile && (
                <div>
                  <span className="navbar-text navbar-text-strong">
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
                    <li className="nav-item">
                      <a
                        href={"whatsapp://send?text=" + textoCompartilhamento}
                        className="nav-link nav-strong"
                      >
                        <span className="icon-zapzap share-icon" />
                      </a>
                    </li>
                  </ul>
                </div>
              )}
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
  testaAutorizacao: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(
  connect(
    mapStateToProps,
    { facebookLogin, googleLogin, logoutUser, testaAutorizacao }
  )(Navbar)
);
