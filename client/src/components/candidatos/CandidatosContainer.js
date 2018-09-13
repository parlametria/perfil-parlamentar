import React, { Component } from "react";
import Candidato from "./Candidato";

import { connect } from "react-redux";

import FlipMove from "react-flip-move";

import isEmpty from "../../validation/is-empty";

import BoasVindas from "./BoasVindas";
import ContinueVotando from "./ContinueVotando";

import {
  calculaScore,
  getTopNCandidatos,
  getDadosCandidatos,
  setFiltroCandidatos,
  setCandidatosFiltrados,
  setPartidos
} from "../../actions/candidatosActions";

import PropTypes from "prop-types";
import Spinner from "../common/Spinner";

import Apresentacao from "./apresentacao";

import "../../styles/style.css";

import { Subject } from "rxjs/Subject";

import "rxjs/add/observable/of";
import "rxjs/add/observable/fromPromise";

import "rxjs/add/operator/catch";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";

const TAM_PAGINA = 5;
const MAX_CAND_FILTRADOS = 5;
const MIN_VOTOS = 3;
const DEBOUNCE_TIME = 500; //ms

class CandidatosContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scoreCandidatos: {},
      candidatosRanking: [],
      candidatosFiltrados: [],
      filtro: {
        nome: "",
        partido: "TODOS",
        estado: ""
      },
      partidos: [],
      debounced: "",
      isPesquisando: false,
      indexPaginacao: { inicio: 0, final: TAM_PAGINA, numeroCandidatos: 0 }
    };

    this.onSearch$ = new Subject();
    this.buscaNome = this.buscaNome.bind(this);
    this.buscaPartido = this.buscaPartido.bind(this);
    this.pegaPrimeiraPagina = this.pegaPrimeiraPagina.bind(this);
    this.pegaCandidatosAnteriores = this.pegaCandidatosAnteriores.bind(this);
    this.pegaProximosCandidatos = this.pegaProximosCandidatos.bind(this);
  }

  pegaPrimeiraPagina() {
    const indexPaginacao = {
      inicio: 0,
      final: TAM_PAGINA,
      numeroCandidatos: this.state.indexPaginacao.numeroCandidatos
    };
    this.setState({ indexPaginacao: indexPaginacao });
  }

  pegaCandidatosAnteriores() {
    if (this.state.indexPaginacao.inicio > 0) {
      const indexPaginacao = {
        inicio: this.state.indexPaginacao.inicio - TAM_PAGINA,
        final: this.state.indexPaginacao.inicio,
        numeroCandidatos: this.state.indexPaginacao.numeroCandidatos
      };
      this.setState({ indexPaginacao: indexPaginacao });
    }
  }

  pegaProximosCandidatos() {
    if (
      this.state.indexPaginacao.final + TAM_PAGINA <=
      this.state.indexPaginacao.numeroCandidatos
    ) {
      const indexPaginacao = {
        inicio: this.state.indexPaginacao.final,
        final: this.state.indexPaginacao.final + TAM_PAGINA,
        numeroCandidatos: this.state.indexPaginacao.numeroCandidatos
      };
      this.setState({ indexPaginacao: indexPaginacao });
    } else if (
      this.state.indexPaginacao.final +
        (this.state.indexPaginacao.numeroCandidatos % TAM_PAGINA) <=
      this.state.indexPaginacao.numeroCandidatos
    ) {
      const indexPaginacao = {
        inicio: this.state.indexPaginacao.final,
        final:
          this.state.indexPaginacao.final +
          (this.state.indexPaginacao.numeroCandidatos % TAM_PAGINA),
        numeroCandidatos: this.state.indexPaginacao.numeroCandidatos
      };
      this.setState({ indexPaginacao: indexPaginacao });
    }
  }

  buscaNome(e) {
    e.preventDefault();

    let filtro = {
      nome: e.target.value,
      partido: this.props.candidatos.filtro.partido,
      estado: this.props.candidatos.filtro.estado
    };

    this.setState({ filtro, isPesquisando: true });
    this.props.setFiltroCandidatos(filtro);
    this.onSearch$.next(filtro.nome);
  }

  buscaPartido(e) {
    e.preventDefault();

    let filtro = {
      nome: this.props.candidatos.filtro.nome,
      partido: e.target.value,
      estado: this.props.candidatos.filtro.estado
    };

    this.setState({ filtro });
    this.props.setFiltroCandidatos(filtro);
    this.props.setCandidatosFiltrados();
  }

  render() {
    const {
      dadosCandidatos,
      scoreCandidatos,
      numResponderam,
      numSemResposta,
      isCarregando,
      mostrarTodos
    } = this.props.candidatos;

    const {
      filtro,
      candidatosFiltrados,
      candidatosRanqueados
    } = this.props.candidatos;

    const { arrayRespostasUsuario, quantidadeVotos } = this.props.usuario;

    const candidatosMapeaveis =
      filtro.nome !== "" || filtro.partido !== "TODOS"
        ? candidatosFiltrados
        : candidatosRanqueados;
    let numRepPartido = 0;
    let numNaoRepPartido = 0;

    const candidatos = candidatosMapeaveis.map(cpf => {
      const candidato = dadosCandidatos[cpf];

      if (!isEmpty(candidato)) {
        return (
          <Candidato
            respondeu={candidato.respondeu}
            key={candidato.cpf}
            id={candidato.cpf}
            nome={candidato.nome_urna}
            siglaPartido={candidato.sg_partido}
            estado={candidato.uf}
            score={scoreCandidatos[candidato.cpf]}
            respostas={candidato.respostas}
            foto={
              candidato.tem_foto
                ? "https://s3-sa-east-1.amazonaws.com/fotoscandidatos2018/fotos_tratadas/img_" +
                  candidato.cpf +
                  ".jpg"
                : "http://pontosdevista.pt/static/uploads/2016/05/sem-fotoABC.jpg"
            }
            arrayRespostasUsuario={arrayRespostasUsuario}
            email={candidato.email}
          />
        );
      }
      return null;
    });
    const mostraPartido = (
      <div>
        <h5>
          Para esse partido, <strong className="strong">{numRepPartido}</strong>{" "}
          de{" "}
          <strong className="strong">{numRepPartido + numNaoRepPartido}</strong>{" "}
          candidatos responderam ao questionário.
        </h5>
      </div>
    );

    const mostraEstado = (
      <div>
        <h5>
          Nesse Estado, <strong className="strong">{numResponderam}</strong> de{" "}
          <strong className="strong">{numResponderam + numSemResposta}</strong>{" "}
          candidatos responderam ao questionário.
        </h5>
      </div>
    );

    const btnFirst = (
      <button
        className="btn btn-link btn-pag"
        onClick={this.pegaPrimeiraPagina}
      >
        <span className="icon-back" /> Início
      </button>
    );

    const btnMaisCandidatos = (
      <button
        className="btn btn-link btn-pag"
        onClick={this.pegaProximosCandidatos}
      >
        Ver próximos{" "}
        {this.state.indexPaginacao.final + TAM_PAGINA <=
        this.state.indexPaginacao.numeroCandidatos
          ? TAM_PAGINA
          : this.state.indexPaginacao.numeroCandidatos % TAM_PAGINA}{" "}
        <span className="icon-forward" />
      </button>
    );

    const btnMenosCandidatos = (
      <button
        className="btn btn-link btn-pag"
        onClick={this.pegaCandidatosAnteriores}
      >
        <span className="icon-back" /> Ver {TAM_PAGINA} anteriores
      </button>
    );

    const exibeCandidatos = (
      <div>
        <div className="panel-master-header">
          <ul className="nav nav-tabs nav-tabs-secondary">
            <li className="nav-item">
              <a className="nav-link nav-link-a active">Candidatos/as</a>
            </li>
          </ul>
        </div>
        <div className="container">
          <header className="panel-header">
            {false ? <Apresentacao /> : null}
            <div className="form-row">
              <div className="col-7">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text input-group-text-secondary"
                      id="search-candidate"
                    >
                      <span className="icon-search" />
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control form-control-secondary"
                    placeholder="Pesquisar candidato/a..."
                    aria-label="Pesquisar candidato/a"
                    aria-describedby="search-candidate"
                    onChange={this.buscaNome}
                    value={this.state.filtro.nome}
                  />
                </div>
              </div>
              <div className="col-5">
                <div className="form-group">
                  <select
                    className="form-control form-control-secondary barra-filtro-candidato"
                    placeholder="Partidos"
                    onChange={this.buscaPartido}
                    value={this.state.filtro.partido}
                  >
                    {this.state.partidos}
                  </select>
                </div>
              </div>
            </div>
            {filtro.partido !== "TODOS" ? mostraPartido : mostraEstado}
          </header>

          {isCarregando || this.state.isPesquisando ? (
            <div style={{ paddingTop: "30vh" }}>
              <Spinner />
            </div>
          ) : (
            <div>
              <div className="candidatos">
                <FlipMove>
                  {candidatos.slice(
                    this.state.indexPaginacao.inicio,
                    this.state.indexPaginacao.final
                  )}
                </FlipMove>
              </div>
              <div className="candidatos-pagination d-flex justify-content-center flex-wrap mb-3">
                {this.state.indexPaginacao.inicio !== 0 ? btnFirst : null}
                {this.state.indexPaginacao.inicio > 0
                  ? btnMenosCandidatos
                  : null}
                {this.state.indexPaginacao.final <
                this.state.indexPaginacao.numeroCandidatos
                  ? btnMaisCandidatos
                  : null}
              </div>
            </div>
          )}
        </div>
      </div>
    );

    const isMinimoVotosOuMostreTodos =
      quantidadeVotos >= MIN_VOTOS || mostrarTodos;

    let isExibeBoasVindas = false;
    let isExibeContinueVotando = false;
    let isExibeCandidatos = false;
    if (isMinimoVotosOuMostreTodos) {
      isExibeCandidatos = true;
    } else if (quantidadeVotos > 0 && quantidadeVotos < MIN_VOTOS) {
      isExibeContinueVotando = true;
    } else {
      isExibeBoasVindas = true;
    }

    return (
      <div>
        <FlipMove>
          {isExibeCandidatos ? exibeCandidatos : null}
          {isExibeContinueVotando ? <ContinueVotando /> : null}
          {isExibeBoasVindas ? <BoasVindas /> : null}
        </FlipMove>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.candidatos.scoreCandidatos) {
      const { dadosCandidatos } = this.props.candidatos;
      const totalCandidatos = Object.keys(dadosCandidatos).length;

      const { partidos } = this.props.candidatos;

      let listaSelectPartidos = partidos.map(partido => (
        <option key={partido} value={partido}>
          {partido}
        </option>
      ));

      this.subscription = this.onSearch$
        .debounceTime(DEBOUNCE_TIME)
        .subscribe(debounced => {
          this.props.setCandidatosFiltrados();
          this.setState({
            debounced,
            candidatosFiltrados: this.props.candidatos.candidatosFiltrados,
            isPesquisando: false,
            partidos: listaSelectPartidos
          });
        });

      //let candidatosRanking = this.props.getTopNCandidatos(totalCandidatos);
      let candidatosRanking = nextProps.candidatos.candidatosRanqueados;

      let indexPaginacao = {
        inicio: 0,
        final: TAM_PAGINA,
        numeroCandidatos: candidatosRanking.length
      };

      this.setState({
        scoreCandidatos: nextProps.candidatos.scoreCandidatos,
        candidatosRanking: candidatosRanking,
        filtro: nextProps.candidatos.filtro,
        partidos,
        indexPaginacao: indexPaginacao
      });
    }
  }

  componentDidMount() {
    const { dadosCandidatos } = this.props.candidatos;
    const totalCandidatos = Object.keys(dadosCandidatos).length;

    const { partidos } = this.props.candidatos;

    let listaSelectPartidos = partidos.map(partido => (
      <option key={partido} value={partido}>
        {partido}
      </option>
    ));

    if (isEmpty(this.props.candidatos.dadosCandidatos)) {
      //this.props.calculaScore();
    } else {
      let candidatosRanking = this.props.candidatos.candidatosRanqueados;
      let indexPaginacao = {
        inicio: 0,
        final: TAM_PAGINA,
        numeroCandidatos: candidatosRanking.length
      };
      this.setState({
        scoreCandidatos: this.props.candidatos.scoreCandidatos,
        candidatosRanking: candidatosRanking,
        filtro: this.props.candidatos.filtro,
        partidos: listaSelectPartidos,
        indexPaginacao: indexPaginacao
      });
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

CandidatosContainer.propTypes = {
  calculaScore: PropTypes.func.isRequired,
  getTopNCandidatos: PropTypes.func.isRequired,
  getDadosCandidatos: PropTypes.func.isRequired,
  setFiltroCandidatos: PropTypes.func.isRequired,
  setCandidatosFiltrados: PropTypes.func.isRequired,
  setPartidos: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  candidatos: state.candidatosReducer,
  usuario: state.usuarioReducer
});

export default connect(
  mapStateToProps,
  {
    calculaScore,
    getTopNCandidatos,
    getDadosCandidatos,
    setFiltroCandidatos,
    setCandidatosFiltrados,
    setPartidos
  }
)(CandidatosContainer);
