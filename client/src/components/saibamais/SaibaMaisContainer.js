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

import { getVotacoesDeputados, getDadosVotacoes } from "../../actions/votacoesActions";
import { getDadosPerguntas } from "../../actions/perguntasActions";

import { salvaScoreUsuario } from "../../actions/usuarioActions";
import isEmpty from "../../validation/is-empty";

import { getArrayUrl, getDict, tamanhoRespostas } from "../../constantes/tratamentoUrls";
import { getScoreWidth } from "../../utils/scoreValueFunctions";

import "./SaibaMaisContainer.css";
import Spinner from "../common/Spinner";
import classnames from "classnames";

class SaibaMaisContainer extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);

    this.state = {
      votos: "",
      activeTab: "2"
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
              Está em sua{" "}
              {Number(dadosCandidato.n_candidatura) === 0
                ? 1
                : dadosCandidato.n_candidatura}
              ª candidatura{" "}
            </p>
            {dadosCandidato.n_candidatura > 0 && (
              <p>
                <a
                  className="btn btn-primary"
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
            )}
          </div>
        </div>
      </div>
    );
    let hostURL = process.env.REACT_APP_FACEBOOK_REDIRECT_URI;

    let compareLink = hostURL + "compare/" +
      this.props.match.params.candidato +
      "/" +
      this.props.match.params.votos;

    let candidatoLink = hostURL + "parlamentar/" +
      this.props.match.params.candidato;

    let linkCompartilhamento =
      (this.props.match.params.votos === undefined) ? candidatoLink : compareLink;

    let compareText =
      "Eu e " +
      dadosCandidato.nome_urna +
      " concordamos em " +
      Math.round(dadosCandidato.score * 100) +
      "% . Veja no Voz Ativa: ";

    let candidatoText =
      "Confira como " +
      dadosCandidato.nome_urna +
      " se posicionou em decisões importantes no Voz Ativa: ";

    let textoCompartilhamento =
      ((this.props.match.params.votos === undefined) ? candidatoText : compareText) +
      linkCompartilhamento;

    const shareButtons = (
      <div className="share-compare text-center">
        <a
          href={
            "https://twitter.com/intent/tweet/?text=" + textoCompartilhamento
          }
          data-show-count="false"
          className="btn btn-link"
          target="_blank"
        >
          <span className="icon-twitter share-icon" />
        </a>
        <a
          href={
            "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2F" +
            linkCompartilhamento +
            "%2F&amp;src=sdkpreparse"
          }
          data-show-count="false"
          className="btn btn-link"
          target="_blank"
        >
          <span className="icon-facebook share-icon" />
        </a>
        {!isMobile && (
          <a
            href={"https://web.whatsapp.com/send?text=" + textoCompartilhamento}
            data-show-count="false"
            className="btn btn-link"
            target="_blank"
          >
            <span className="icon-zapzap share-icon" />
          </a>
        )}
        {isMobile && (
          <a
            href={"whatsapp://send?text=" + textoCompartilhamento}
            className="btn btn-link"
          >
            <span className="icon-zapzap share-icon" />
          </a>
        )}
      </div>
    );

    const tabela = (
      <div>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="2">
            <TabelaVotacoes />
          </TabPane>
        </TabContent>
      </div>
    );

    return (
      <div className="container">
        <h4 className="compare-title text-center pt-4">
          Calculamos um match de{" "}
          <strong className="strong">
            {Math.round(getScoreWidth(dadosCandidato.score) * 100)}%
          </strong>{" "}
          <br/>
          entre você e {dadosCandidato.nome_urna}
        </h4>
        <Link to="/" className="btn btn-link">
          <span className="icon-back" /> Voltar para o quiz
        </Link>
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
            {shareButtons}
            {this.props.candidatos.isCarregando || isEmpty(dadosCandidato) ? (
              <Spinner />
            ) : (
                tabela
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
    this.props.getDadosPerguntas();
    this.props.getDadosVotacoes();    

    const { candidato, votos, verAtuacao } = this.props.match.params;

    let votosUsuario;
    let {tamPerguntas, tamVotacoes} = tamanhoRespostas();
  
    if (!isEmpty(votos) && getArrayUrl(votos).length === tamVotacoes) {
      let respostaQuizVozAtiva = '0'.repeat(tamPerguntas);
      votosUsuario = respostaQuizVozAtiva + votos;
    } else if (isEmpty(votos)) {
      votosUsuario = "0".repeat(tamVotacoes + tamPerguntas);
    } else {
      votosUsuario = votos;
    }

    const respostasUsuario = getDict(getArrayUrl(votosUsuario));
    const arrayRespostasUsuario = getArrayUrl(votosUsuario);

    this.props.getVotacoesDeputados();
    this.props.salvaScoreUsuario(respostasUsuario);    
    this.props.getDadosCandidato(
      candidato,
      respostasUsuario,
      arrayRespostasUsuario
    );

    const url_case = this.props.match.path;
    const PATH_COMPARE = "/parlamentar/:candidato/";

    if (url_case === PATH_COMPARE) {
      this.setState({ votos: votosUsuario, activeTab: "2" });
    } else {
      if (verAtuacao) {
        this.setState({ votos: votosUsuario, activeTab: "2" });
        this.props.history.push("/compare/" + candidato + "/" + votos);
      } else {
        this.setState({ votos: votosUsuario });
      }
    }
  }
}

SaibaMaisContainer.propTypes = {
  getDadosCandidato: PropTypes.func.isRequired,
  calculaScorePorTema: PropTypes.func.isRequired,
  setFiltroCandidatos: PropTypes.func.isRequired,
  salvaScoreUsuario: PropTypes.func.isRequired,
  getVotacoesDeputados: PropTypes.func.isRequired,
  getDadosPerguntas: PropTypes.func.isRequired,
  getDadosVotacoes: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  candidatos: state.candidatosReducer  
});

export default connect(
  mapStateToProps,
  {
    getDadosCandidato,
    calculaScorePorTema,
    setFiltroCandidatos,
    salvaScoreUsuario,
    getVotacoesDeputados,
    getDadosPerguntas,
    getDadosVotacoes    
  }
)(SaibaMaisContainer);
