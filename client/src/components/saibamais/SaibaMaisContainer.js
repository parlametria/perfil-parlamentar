import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

import TabelaPerguntas from "./tabelaPerguntas/TabelaPerguntas";
import TabelaVotacoes from "./tabelaVotacoes/TabelaVotacoes";
import PontuacaoPorTema from "./pontuacaoPorTema/PontuacaoTema";

import { isMobile } from "react-device-detect";

import {
  getDadosCandidato,
  calculaScorePorTema,
  setFiltroCandidatos
} from "../../actions/candidatosActions";
import isEmpty from "../../validation/is-empty";

import { getArrayUrl, getDict } from "../../constantes/tratamentoUrls";

import "./SaibaMaisContainer.css";
import Spinner from "../common/Spinner";
import classnames from "classnames";

class SaibaMaisContainer extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      votos: "",
      activeTab: "1"
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
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
                : "https://s3-sa-east-1.amazonaws.com/fotoscandidatos2018/fotos_tratadas/nophoto.png"
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
            <p>
              (novo!){" "}
              <a
                className="btn btn-link"
                align="right"
                target="_blank"
                href={
                  "https://eleicoes.datapedia.info/candidato/historico/" +
                  dadosCandidato.cpf
                }
              >
                histórico
              </a>
            </p>
          </div>
        </div>
      </div>
    );
    let linkCompartilhamento =
      "www.vozativa.org/compare/" +
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
          {!isMobile && (
            <a
              href={
                "https://web.whatsapp.com/send?text=" + textoCompartilhamento
              }
              data-show-count="false"
              className="nav-link"
              target="_blank"
            >
              <span className="icon-zapzap" />
            </a>
          )}
          {isMobile && (
            <a
              href={"whatsapp://send?text=" + textoCompartilhamento}
              className="nav-link"
            >
              <span className="icon-zapzap" />
            </a>
          )}
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
              <div>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "1"
                      })}
                      onClick={() => {
                        this.toggle("1");
                      }}
                    >
                      Compare
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "2"
                      })}
                      onClick={() => {
                        this.toggle("2");
                      }}
                    >
                      Na câmara
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    <TabelaPerguntas
                      respostas={dadosCandidato.respostas}
                      votos={getArrayUrl(this.state.votos)}
                    />
                  </TabPane>
                  <TabPane tabId="2">
                    <TabelaVotacoes />
                  </TabPane>
                </TabContent>
              </div>
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

SaibaMaisContainer.propTypes = {
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
)(SaibaMaisContainer);
