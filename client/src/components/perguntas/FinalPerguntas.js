import React, { Component } from "react";

import { connect } from "react-redux";
import { isMobile } from "react-device-detect";

import PropTypes from "prop-types";

import { criaURL } from "../../constantes/tratamentoUrls";

import {
  escondePerguntas,
  continuarRespondendo
} from "../../actions/questionarioActions";

class FinalPerguntas extends Component {
  constructor(props) {
    super(props);

    this.verAgora = this.verAgora.bind(this);
    this.continuarRespondendo = this.continuarRespondendo.bind(this);
  }

  verAgora(e) {
    e.preventDefault();
    this.props.escondePerguntas();
  }

  continuarRespondendo(e) {
    e.preventDefault();
    this.props.continuarRespondendo();
  }

  geraUrl() {
    const url =
      "www.vozativa.org/" +
      this.props.candidatos.filtro.estado +
      "/" +
      criaURL(this.props.usuario.respostasUsuario);
    return url;
  }

  render() {
    let linkCompartilhamento = this.geraUrl();
    let textoCompartilhamento =
      "Veja minhas respostas na plataforma VozAtiva! " + linkCompartilhamento;
    return (
      <div className="container tutorial p-3">
        <div>{this.props.children}</div>
        <div className="row justify-content-center">
          <a
            href={
              "https://twitter.com/intent/tweet/?text=" + textoCompartilhamento
            }
            data-show-count="false"
            className="nav-link"
            target="_blank"
          >
            <span className="icon-twitter share-icon" />
          </a>
          <a
            href={
              "https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2F" +
              textoCompartilhamento
            }
            data-show-count="false"
            className="nav-link"
            target="_blank"
          >
            <span className="icon-facebook share-icon" />
          </a>
          {isMobile && (
            <a
              href={"whatsapp://send?text=" + textoCompartilhamento}
              className="nav-link"
            >
              <span className="icon-zapzap share-icon" />
            </a>
          )}
          {!isMobile && (
            <a
              href={
                "https://web.whatsapp.com/send?text=" + textoCompartilhamento
              }
              data-show-count="false"
              className="nav-link"
              target="_blank"
            >
              <span className="icon-zapzap share-icon" />
            </a>
          )}
        </div>

        <div className="text-center">
          {isMobile && (
            <button className="btn btn-outline-primary" onClick={this.verAgora}>
              Ver agora
            </button>
          )}{" "}
          <button
            className="btn btn-outline-primary"
            onClick={this.continuarRespondendo}
          >
            Continuar respondendo
          </button>
        </div>
      </div>
    );
  }
}

FinalPerguntas.propTypes = {
  escondePerguntas: PropTypes.func.isRequired,
  continuarRespondendo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  questionario: state.questionarioReducer,
  usuario: state.usuarioReducer,
  candidatos: state.candidatosReducer
});

export default connect(
  mapStateToProps,
  { escondePerguntas, continuarRespondendo }
)(FinalPerguntas);
