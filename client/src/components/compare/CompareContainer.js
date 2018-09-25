import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import TabelaPerguntas from "./tabelaPerguntas/TabelaPerguntas";
import PontuacaoPorTema from "./pontuacaoPorTema/PontuacaoTema";

import { BrowserView, MobileView } from "react-device-detect";

import {
  getDadosCandidato,
  calculaScorePorTema,
  setFiltroCandidatos
} from "../../actions/candidatosActions";
import isEmpty from "../../validation/is-empty";

import { getArrayUrl, getDict } from "../../constantes/tratamentoUrls";

import "./CompareContainer.css";
import Spinner from "../common/Spinner";

class CompareContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { votos: "" };
  }

  render() {
    const { dadosCandidato, scoreTema } = this.props.candidatos;

    const perfilCandidato = (
      <div className="compare-person-profile row no-gutters">
        <div className="col-4">
          <img
            src={
              dadosCandidato.tem_foto
                ? "https://s3-sa-east-1.amazonaws.com/fotoscandidatos2018/fotos_tratadas/img_" +
                  dadosCandidato.cpf +
                  ".jpg"
                : "http://pontosdevista.pt/static/uploads/2016/05/sem-fotoABC.jpg"
            }
            alt={dadosCandidato.nome_urna}
            width="100%"
            className="person-img"
          />
        </div>
        <div className="col-8">
          <div className="compare-person-data">
            <h3 className="compare-person-name">{dadosCandidato.nome_urna}</h3>
            <p>
              {dadosCandidato.sg_partido}/{dadosCandidato.uf}
            </p>
            <a
              className="btn btn-link"
              align="right"
              href="https://www.datapedia.info"
            >
              datapedia
            </a>
          </div>
        </div>
      </div>
    );
    let linkCompartilhamento =
      "http://vozativa.org/compare/" +
      this.props.match.params.candidato +
      "/" +
      this.props.match.params.votos;
    let textoCompartilhamento =
      "Tive um match eleitoral de " +
      Math.round(dadosCandidato.score * 100) +
      " por cento com " +
      dadosCandidato.nome_urna +
      ". Mais informações: " +
      linkCompartilhamento;

    return (
      <div className="container">
        <h4 className="compare-title text-center">
          Calculamos um match eleitoral de{" "}
          <strong className="strong">
            {Math.round(dadosCandidato.score * 100)}%
          </strong>{" "}
          entre você e {dadosCandidato.nome_urna}
        </h4>
        <div className="row">
          <div className="col-md-3">
            <Link to="/" className="btn btn-link">
              <span className="icon-back" /> Voltar para o quiz
            </Link>
          </div>
          <div className="col-md-9" align="right">
            <span className="navbar-text">
              compartilhe o match com {dadosCandidato.nome_urna}
            </span>
          </div>
        </div>
        <div className="row justify-content-end">
          <a
            href={
              "https://twitter.com/intent/tweet/?text=" + textoCompartilhamento
            }
            data-show-count="false"
            className="nav-link"
            target="_blank"
          >
            <span className="icon-twitter" />
          </a>
          <a
            href={
              "https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2F" +
              "vozativa.org/compare/" +
              this.props.match.params.candidato +
              "/" +
              this.props.match.params.votos +
              "%2F&amp;src=sdkpreparse"
            }
            data-show-count="false"
            className="nav-link"
            target="_blank"
          >
            <span className="icon-facebook" />
          </a>
          <BrowserView>
            <a
              href={
                "https://web.whatsapp.com/send?text=" + textoCompartilhamento
              }
              data-show-count="false"
              className="nav-link"
              target="_blank"
            >
              <span className="icon-whatsapp" />
            </a>
          </BrowserView>
          <MobileView>
            <a
              href={"whatsapp://send?text=" + textoCompartilhamento}
              className="nav-link"
            >
              <span className="icon-whatsapp" />
            </a>
          </MobileView>
        </div>
        <div className="row">
          <div className="col-md-3">
            {this.props.candidatos.isCarregando || isEmpty(dadosCandidato) ? (
              <Spinner />
            ) : (
              perfilCandidato
            )}
            <h4 className="compare-title">
              O quanto vocês <strong className="strong">concordam</strong> nos
              temas:
            </h4>
            <PontuacaoPorTema scoreTema={scoreTema} />
          </div>
          <div className="col-md-9">
            {this.props.candidatos.isCarregando || isEmpty(dadosCandidato) ? (
              <Spinner />
            ) : (
              <TabelaPerguntas
                respostas={dadosCandidato.respostas}
                votos={getArrayUrl(this.state.votos)}
              />
            )}
          </div>
        </div>
        <div className="my-3">
          <Link to="/" className="btn btn-link">
            <span className="icon-back" /> Voltar para o quiz
          </Link>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const { candidato, votos } = this.props.match.params;
    const respostasUsuario = getDict(getArrayUrl(votos));
    const arrayRespostasUsuario = getArrayUrl(votos);
    this.props.getDadosCandidato(
      candidato,
      respostasUsuario,
      arrayRespostasUsuario
    );
    this.setState({ votos });
  }
}

CompareContainer.propTypes = {
  getDadosCandidato: PropTypes.func.isRequired,
  calculaScorePorTema: PropTypes.func.isRequired,
  setFiltroCandidatos: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  candidatos: state.candidatosReducer
});

export default connect(
  mapStateToProps,
  { getDadosCandidato, calculaScorePorTema, setFiltroCandidatos }
)(CompareContainer);
