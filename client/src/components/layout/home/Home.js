import React, { Component } from "react";

// Containers imports
import Questionario from "../../questionario/QuestionarioContainer";
import CandidatosContainer from "../../candidatos/CandidatosContainer";
import { isMobile } from "react-device-detect";
import ScrollIntoView from "react-scroll-into-view";
import ScrollIntoViewOnChange from "../../../scroll/scrollIntoViewOnChange";
import StickyBox from "react-sticky-box";

import querystring from "query-string";

// Redux stuff
import { connect } from "react-redux";
import PropTypes from "prop-types";
//
// Actions
import {
  getDadosCandidatos,
  setFiltroCandidatos,
  calculaScore,
  setPartidos,
  verTodosEleitos,
  mostrarTodosCandidatos,
  setActiveTab
} from "../../../actions/candidatosActions";

import { facebookLoginComCodigo } from "../../../actions/authActions";

import {
  vamosComecar,
  escondePerguntas
} from "../../../actions/questionarioActions";
import { salvaScoreUsuario } from "../../../actions/usuarioActions";

import { getDadosPerguntas } from "../../../actions/perguntasActions";
import { getDadosVotacoes } from "../../../actions/votacoesActions";
import { mudaAba } from "../../../actions/homeActions";

import {
  getArrayUrl,
  getDict,
  votosValidos,
  estadoValido
} from "../../../constantes/tratamentoUrls";

import FlipMove from "react-flip-move";

// CSS imports
import "./home.css";

class Home extends Component {
  constructor(props) {
    super(props);

    this.vamosComecar = this.vamosComecar.bind(this);
    this.mostrarTodos = this.mostrarTodos.bind(this);
    this.salvaRespostasCache = this.salvaRespostasCache.bind(this);
    this.mudaAba = this.mudaAba.bind(this);
  }

  mostrarTodos() {
    this.props.verTodosEleitos();
    this.props.mostrarTodosCandidatos();
  }

  vamosComecar(e) {
    e.preventDefault();
    this.props.vamosComecar();
  }

  componentDidMount() {
    this.props.getDadosPerguntas();
    this.props.getDadosVotacoes();
    this.props.setActiveTab("eleitos");
    //this.props.getDadosCandidatos();

    if (!isMobile) {
      this.props.vamosComecar();
      //this.mostrarTodos();
    }

    const { votos, estado } = this.props.match.params;

    const parsed = querystring.parse(this.props.location.search);

    if (parsed.state === "facebookdirect") {
      this.props.facebookLoginComCodigo(parsed.code);
      this.props.history.push("/");
    }

    if (votos && estado) {
      if (votosValidos(votos) && estadoValido(estado)) {
        const arrayVotosUsuario = getArrayUrl(votos);
        const votosUsuario = getDict(arrayVotosUsuario);

        const filtroEstado = {
          nome: "",
          partido: "Partidos",
          estado: estado,
          reeleicao: "-1",
          respondeu: "-1",
          tema: "Temas"
        };

        this.props.setFiltroCandidatos(filtroEstado);
        this.props.getDadosCandidatos();

        this.props.salvaScoreUsuario(votosUsuario, arrayVotosUsuario);
        this.props.vamosComecar();
        this.props.history.push("/");
      } else {
        this.props.history.push("/");
      }
    }

    window.addEventListener("beforeunload", this.salvaRespostasCache);
  }

  salvaRespostasCache() {
    const { respostasUsuario, arrayRespostasUsuario } = this.props.usuario;
    localStorage.setItem("respostasUsuario", JSON.stringify(respostasUsuario));
    localStorage.setItem("arrayRespostasUsuario", arrayRespostasUsuario);
  }

  mudaAba(novaAba) {
    this.props.mudaAba(novaAba);
  }

  componentWillUnmount() {
    this.salvaRespostasCache();
    window.removeEventListener("beforeunload", this.salvaRespostasCache);
  }

  render() {
    const { filtro, isVerTodosEleitos } = this.props.candidatos;
    const { isVamosComecar } = this.props.questionario;
    const { quantidadeVotos } = this.props.usuario;
    const { activeTab } = this.props.home;

    let linkCompartilhamento = "www.vozativa.org/";
    let textoCompartilhamento =
      "Nos diga o que você defende e em oito minutos a gente apresenta candidatos alinhados com você. " +
      linkCompartilhamento;

    let barraCompartilhamento = (
      <StickyBox offsetTop={20} offsetBottom={20} offsetRight={20}>
        <ul className="share-box">
          <li className="share-element">
            <a
              href={
                "https://twitter.com/intent/tweet/?text=" +
                textoCompartilhamento
              }
              data-show-count="false"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-twitter share-icon btn btn-link btn-icon"
            />
          </li>
          <li className="share-element">
            <a
              href={
                "https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fvozativa.org%2F&amp;src=sdkpreparse"
              }
              data-show-count="false"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-facebook share-icon btn btn-link btn-icon"
            />
          </li>
          <li className="share-element">
            <a
              href={
                "https://web.whatsapp.com/send?text=" + textoCompartilhamento
              }
              data-show-count="false"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-zapzap share-icon btn btn-link btn-icon"
            />
          </li>
        </ul>
      </StickyBox>
    );

    let abaQuiz = (
      <section className="grid-panel panel-master">
        <FlipMove>
          {filtro.estado !== "" && <CandidatosContainer />}
          <div className="d-flex justify-content-center mb-3">
            {isMobile && !isVamosComecar && filtro.estado !== "" && (
              <div className="pr-1">
                <ScrollIntoView selector="#scroll">
                  <button
                    className="btn btn-secondary"
                    onClick={this.vamosComecar}
                  >
                    Responder
                  </button>
                </ScrollIntoView>
                <div id="scroll" />
              </div>
            )}
            {!isMobile &&
              filtro.estado !== "" &&
              !isVerTodosEleitos &&
              quantidadeVotos < 1 && (
                <div>
                  <button
                    className="btn btn-secondary"
                    onClick={this.mostrarTodos}
                  >
                    Ver Eleitos
                  </button>
                </div>
              )}
          </div>
        </FlipMove>
      </section>
    );

    let abaResultados = (
      <section className="grid-panel panel-detail">
        <FlipMove>
          {filtro.estado !== "" && isVamosComecar && <Questionario />}
        </FlipMove>
      </section>
    );

    return (
      <div>
        {!isMobile && barraCompartilhamento}
        {filtro.estado !== "" && isVamosComecar && (
          <section className="intro">
            <div className="container">
              <h2 className="intro-title text-center">
                Descubra quais deputados/as e candidatos/as são{" "}
                <strong className="strong">alinhados</strong> com você.
              </h2>
            </div>
          </section>
        )}
        <div className="grid-wrapper" id="candidatos">
          <div className="grid-main">
            {isMobile && activeTab === "quiz" && abaQuiz}
            {!isMobile && abaQuiz}
            {filtro.estado !== "" && <div className="grid-separator" />}
            {isMobile && activeTab === "quiz" && abaResultados}
            {!isMobile && abaResultados}
          </div>
        </div>
        <div className="navbar-controls d-block d-sm-none">
          <nav className="nav nav-justified">
            <a className="nav-item nav-link navbar-controls-link active" onClick={this.mudaAba("quiz")}>Quiz</a>
            <a className="nav-item nav-link navbar-controls-link" onClick={this.mudaAba("resultados")}>Deputados</a>
          </nav>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  getDadosCandidatos: PropTypes.func.isRequired,
  setFiltroCandidatos: PropTypes.func.isRequired,
  calculaScore: PropTypes.func.isRequired,
  setPartidos: PropTypes.func.isRequired,
  salvaScoreUsuario: PropTypes.func.isRequired,
  escondePerguntas: PropTypes.func.isRequired,
  verTodosEleitos: PropTypes.func.isRequired,
  mostrarTodosCandidatos: PropTypes.func.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  facebookLoginComCodigo: PropTypes.func.isRequired,
  getDadosPerguntas: PropTypes.func.isRequired,
  getDadosVotacoes: PropTypes.func.isRequired,
  mudaAba: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  candidatos: state.candidatosReducer,
  perguntas: state.perguntasReducer,
  usuario: state.usuarioReducer,
  questionario: state.questionarioReducer,
  home: state.homeReducer
});

export default connect(
  mapStateToProps,
  {
    getDadosCandidatos,
    setFiltroCandidatos,
    calculaScore,
    vamosComecar,
    setPartidos,
    salvaScoreUsuario,
    escondePerguntas,
    verTodosEleitos,
    mostrarTodosCandidatos,
    setActiveTab,
    facebookLoginComCodigo,
    getDadosPerguntas,
    getDadosVotacoes,
    mudaAba
  }
)(Home);
