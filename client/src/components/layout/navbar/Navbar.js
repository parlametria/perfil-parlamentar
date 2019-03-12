import React, { Component } from "react";

import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import { isMobile } from "react-device-detect";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  salvaScoreUsuario,
  getRespostasUsuario
} from "../../../actions/usuarioActions";

import {
  facebookLogin,
  googleLogin,
  logoutUser,
  testaAutorizacao
} from "../../../actions/authActions";

import { Modal, ModalHeader, ModalBody } from "reactstrap";

import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login";

import "./navbar.css";
import Spinner from "../../common/Spinner";

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
    const { isAuthenticated, user, isLogging } = this.props.auth;

    let linkCompartilhamento = "www.vozativa.org/";
    let textoCompartilhamento =
      "Nos diga o que você defende e em oito minutos a gente apresenta candidatos alinhados com você. " +
      linkCompartilhamento;

    let facebookRedirectURI = process.env.REACT_APP_FACEBOOK_REDIRECT_URI;
    let facebookAppID = process.env.REACT_APP_FACEBOOK_APP_ID;    

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
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
            <Link to="/" className="navbar-brand">
              <img
                src={require("../../../data/img/logo.png")}
                alt="Voz Ativa"
                width="100px"
              />
            </Link>
            {!isAuthenticated && isMobile && (
              <a onClick={this.toggle} className="nav-link">
                entrar
              </a>
            )}

            {isAuthenticated && !isLogging && isMobile && (
              <div className="dropdown">
                <img
                  id="userMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-label="Menu do usuário"
                  className="rounded-circle"
                  src={user.photo}
                  width="35px"
                />
                <div
                  className="dropdown-menu dropdown-usermenu"
                  aria-labelledby="userMenuButton"
                >
                  <a className="dropdown-item" onClick={this.onSignOut}>
                    Sair
                  </a>
                </div>
              </div>
            )}
            {isLogging && <Spinner />}
            <div className="collapse navbar-collapse" id="mainNavbar">
              <ul className="navbar-nav ml-auto pr-1">
                <li className="nav-item">
                  <Link to="/sobre" className="nav-link">
                    Sobre
                  </Link>
                </li>
                {!isAuthenticated && !isMobile && (
                  <a
                    onClick={this.toggle}
                    className="nav-link"
                    style={{ marginLeft: "auto" }}
                  >
                    entrar
                  </a>
                )}
              </ul>
              {isAuthenticated && !isMobile && (
                <div className="dropdown">
                  <img
                    id="userMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-label="Menu do usuário"
                    className="rounded-circle"
                    src={user.photo}
                    width="35px"
                  />
                  <div
                    className="dropdown-menu dropdown-usermenu"
                    aria-labelledby="userMenuButton"
                  >
                    <a className="dropdown-item" onClick={this.onSignOut}>
                      Sair
                    </a>
                  </div>
                </div>
              )}
              <Modal
                isOpen={this.state.modal}
                toggle={this.toggle}
                className="modal-login"
              >
                <ModalHeader toggle={this.toggle}>identifique-se</ModalHeader>
                <ModalBody>
                  <div className="row">
                    <div className="col-lg-8 offset-lg-2">
                      <p>
                        Ao entrar no Voz Ativa, suas respostas ficarão salvas
                        para que você possa continuar de onde parou. Não
                        guardaremos nenhuma informação sensível, apenas dados
                        públicos (nome, e-mail e foto).
                      </p>
                      <GoogleLogin
                        className="btn btn-primary btn-sm btn-block"
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
                          <span className="icon-google1" /> Entre com sua conta
                          Google
                        </a>
                      </GoogleLogin>
                      <br />
                      <FacebookLogin
                        appId={facebookAppID}
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={this.facebookResponse}
                        cssClass="btn btn-primary btn-sm btn-block"
                        textButton="Entre com sua conta Facebook"
                        icon="icon-facebook"
                        tag="button"
                        redirectUri={facebookRedirectURI}
                      />
                    </div>
                  </div>
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
  testaAutorizacao: PropTypes.func.isRequired,
  salvaScoreUsuario: PropTypes.func.isRequired,
  getRespostasUsuario: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  usuario: state.usuarioReducer
});

export default withRouter(
  connect(
    mapStateToProps,
    {
      facebookLogin,
      googleLogin,
      logoutUser,
      testaAutorizacao,
      salvaScoreUsuario,
      getRespostasUsuario
    }
  )(Navbar)
);
