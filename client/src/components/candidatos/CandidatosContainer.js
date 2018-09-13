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
  setPartidos,
  setPaginacao
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

import {
  TAM_PAGINA,
  MIN_VOTOS,
  DEBOUNCE_TIME
} from "../../constantes/constantesCandidatos";

class CandidatosContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      debounced: "",
      isPesquisando: false
    };

    this.onSearch$ = new Subject();
    this.buscaNome = this.buscaNome.bind(this);
    this.buscaPartido = this.buscaPartido.bind(this);
    this.pegaPrimeiraPagina = this.pegaPrimeiraPagina.bind(this);
    this.pegaCandidatosAnteriores = this.pegaCandidatosAnteriores.bind(this);
    this.pegaProximosCandidatos = this.pegaProximosCandidatos.bind(this);
  }

  pegaPrimeiraPagina() {
    const { totalCandidatos } = this.props.candidatos.paginacao;

    const paginacao = {
      inicio: 0,
      final: TAM_PAGINA,
      totalCandidatos: totalCandidatos
    };
    this.props.setPaginacao(paginacao);
  }

  pegaCandidatosAnteriores() {
    const { paginacao } = this.props.candidatos;

    if (paginacao.inicio > 0) {
      const novaPaginacao = {
        inicio: paginacao.inicio - TAM_PAGINA,
        final: paginacao.inicio,
        totalCandidatos: paginacao.totalCandidatos
      };
      this.props.setPaginacao(novaPaginacao);
    }
  }

  pegaProximosCandidatos() {
    const { paginacao } = this.props.candidatos;
    if (paginacao.final + TAM_PAGINA <= paginacao.totalCandidatos) {
      const novaPaginacao = {
        inicio: paginacao.final,
        final: paginacao.final + TAM_PAGINA,
        totalCandidatos: paginacao.totalCandidatos
      };
      this.props.setPaginacao(novaPaginacao);
    } else if (
      paginacao.final + (paginacao.totalCandidatos % TAM_PAGINA) <=
      paginacao.totalCandidatos
    ) {
      const novaPaginacao = {
        inicio: paginacao.final,
        final: paginacao.final + (paginacao.totalCandidatos % TAM_PAGINA),
        totalCandidatos: paginacao.totalCandidatos
      };
      this.props.setPaginacao(novaPaginacao);
    }
  }

  buscaNome(e) {
    e.preventDefault();

    const { filtro } = this.props.candidatos;

    let novoFiltro = {
      nome: e.target.value,
      partido: filtro.partido,
      estado: filtro.estado
    };

    this.setState({ isPesquisando: true });
    this.props.setFiltroCandidatos(novoFiltro);
    this.onSearch$.next(novoFiltro.nome);
  }

  buscaPartido(e) {
    e.preventDefault();

    const { filtro } = this.props.candidatos;

    let novoFiltro = {
      nome: filtro.nome,
      partido: e.target.value,
      estado: filtro.estado
    };

    this.props.setFiltroCandidatos(novoFiltro);
    this.props.setCandidatosFiltrados();
  }

  render() {
    const {
      dadosCandidatos,
      scoreCandidatos,
      numResponderam,
      numSemResposta,
      isCarregando,
      mostrarTodos,
      partidos
    } = this.props.candidatos;

    const {
      filtro,
      candidatosFiltrados,
      candidatosRanqueados
    } = this.props.candidatos;

    const { paginacao } = this.props.candidatos;

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

    const listaSelectPartidos = partidos.map(partido => (
      <option key={partido} value={partido}>
        {partido}
      </option>
    ));

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
        {paginacao.final + TAM_PAGINA <= paginacao.totalCandidatos
          ? TAM_PAGINA
          : paginacao.totalCandidatos % TAM_PAGINA}{" "}
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
                    value={filtro.nome}
                  />
                </div>
              </div>
              <div className="col-5">
                <div className="form-group">
                  <select
                    className="form-control form-control-secondary barra-filtro-candidato"
                    placeholder="Partidos"
                    onChange={this.buscaPartido}
                    value={filtro.partido}
                  >
                    {listaSelectPartidos}
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
                  {candidatos.slice(paginacao.inicio, paginacao.final)}
                </FlipMove>
              </div>
              <div className="candidatos-pagination d-flex justify-content-center flex-wrap mb-3">
                {paginacao.inicio !== 0 ? btnFirst : null}
                {paginacao.inicio > 0 ? btnMenosCandidatos : null}
                {paginacao.final < paginacao.totalCandidatos
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
    this.subscription = this.onSearch$
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(debounced => {
        this.props.setCandidatosFiltrados();
        this.setState({
          debounced,
          isPesquisando: false
        });
      });
  }

  componentDidMount() {
    this.subscription = this.onSearch$
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(debounced => {
        this.props.setCandidatosFiltrados();
        this.setState({
          debounced,
          isPesquisando: false
        });
      });
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
  setPartidos: PropTypes.func.isRequired,
  setPaginacao: PropTypes.func.isRequired
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
    setPartidos,
    setPaginacao
  }
)(CandidatosContainer);
