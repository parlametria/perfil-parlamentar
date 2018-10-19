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
  setPaginacao,
  getProximaPaginaCandidatos,
  setActiveTab
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

import { opcoesFiltroReeleicao } from "../../constantes/filtrosSeletoresCandidatos";

import classnames from "classnames";

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
    this.buscaReeleitos = this.buscaReeleitos.bind(this);
    this.buscaRespondeu = this.buscaRespondeu.bind(this);
    this.pegaPrimeiraPagina = this.pegaPrimeiraPagina.bind(this);
    this.pegaCandidatosAnteriores = this.pegaCandidatosAnteriores.bind(this);
    this.pegaProximosCandidatos = this.pegaProximosCandidatos.bind(this);
    this.setActiveTab = this.setActiveTab.bind(this);
  }

  setActiveTab(e) {
    this.props.setActiveTab(e);
  }

  pegaPrimeiraPagina() {
    const { totalCandidatos } = this.props.candidatos.paginacao;

    const paginacao = {
      inicio: 0,
      final: TAM_PAGINA,
      totalCandidatos: totalCandidatos,
      paginaAtual: 1
    };
    this.props.setPaginacao(paginacao);
  }

  pegaCandidatosAnteriores() {
    const { paginacao } = this.props.candidatos;

    if (paginacao.inicio > 0) {
      const novaPaginacao = {
        inicio: paginacao.inicio - TAM_PAGINA,
        final: paginacao.inicio,
        totalCandidatos: paginacao.totalCandidatos,
        paginaAtual: paginacao.paginaAtual - 1
      };
      this.props.setPaginacao(novaPaginacao);
    }
  }

  pegaProximosCandidatos() {
    const { paginacao } = this.props.candidatos;

    //this.props.getProximaPaginaCandidatos();

    if (paginacao.final + TAM_PAGINA <= paginacao.totalCandidatos) {
      const novaPaginacao = {
        inicio: paginacao.final,
        final: paginacao.final + TAM_PAGINA,
        totalCandidatos: paginacao.totalCandidatos,
        paginaAtual: paginacao.paginaAtual + 1
      };
      this.props.setPaginacao(novaPaginacao);
    } else if (
      paginacao.final + (paginacao.totalCandidatos % TAM_PAGINA) <=
      paginacao.totalCandidatos
    ) {
      const novaPaginacao = {
        inicio: paginacao.final,
        final: paginacao.final + (paginacao.totalCandidatos % TAM_PAGINA),
        totalCandidatos: paginacao.totalCandidatos,
        paginaAtual: paginacao.paginaAtual + 1
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
      estado: filtro.estado,
      reeleicao: filtro.reeleicao,
      respondeu: filtro.respondeu
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
      estado: filtro.estado,
      reeleicao: filtro.reeleicao,
      respondeu: filtro.respondeu
    };

    this.props.setFiltroCandidatos(novoFiltro);
    this.props.setCandidatosFiltrados();
  }

  buscaReeleitos() {
    const { filtro } = this.props.candidatos;

    let novoFiltro = {
      nome: filtro.nome,
      partido: filtro.partido,
      estado: filtro.estado,
      reeleicao: filtro.reeleicao === "1" ? "-1" : "1",
      respondeu: filtro.respondeu
    };

    this.props.setFiltroCandidatos(novoFiltro);
    this.props.setCandidatosFiltrados();
  }

  buscaRespondeu() {
    const { filtro } = this.props.candidatos;

    let novoFiltro = {
      nome: filtro.nome,
      partido: filtro.partido,
      estado: filtro.estado,
      reeleicao: filtro.reeleicao,
      respondeu: filtro.respondeu === "1" ? "-1" : "1"
    };

    this.props.setFiltroCandidatos(novoFiltro);
    this.props.setCandidatosFiltrados();
  }

  render() {
    const {
      dadosCandidatos,
      scoreCandidatos,
      totalResponderamEstado,
      totalRespostasEstado,
      totalResponderamPartido,
      totalRespostasPartido,
      totalEleitosPartido,
      totalEleitosEstado,
      isCarregando,
      isFiltrandoPorNome,
      mostrarTodos,
      partidos,
      activeTab,
      isVerTodosEleitos
    } = this.props.candidatos;

    const {
      filtro,
      candidatosFiltrados,
      candidatosRanqueados
    } = this.props.candidatos;

    const { paginacao } = this.props.candidatos;

    const { arrayRespostasUsuario, quantidadeVotos } = this.props.usuario;

    const candidatosMapeaveis =
      filtro.nome !== "" ||
      filtro.partido !== "Partidos" ||
      filtro.reeleicao !== "-1" ||
      filtro.respondeu !== "-1"
        ? candidatosFiltrados
        : candidatosRanqueados;

    let eleitosResponderam = 0;
    let totalCandAtuacao = 0;
    let totalResponderamAtuacao = 0;
    let totalEleitosEResponderam = 0;
    let totalReeleitosEResponderam = 0;

    const candidatos = candidatosMapeaveis.map(cpf => {
      const candidato = dadosCandidatos[cpf];

      if (!isEmpty(candidato)) {
        if (candidato.respondeu) eleitosResponderam++;
        if (candidato.reeleicao === "1") totalCandAtuacao++;
        if (candidato.reeleicao === "1" && candidato.respondeu)
          totalResponderamAtuacao++;
        if (activeTab === "eleitos" && candidato.respondeu)
          totalEleitosEResponderam++;
        if (
          activeTab === "eleitos" &&
          candidato.respondeu &&
          candidato.reeleicao === "1"
        )
          totalReeleitosEResponderam++;

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
                : "https://s3-sa-east-1.amazonaws.com/fotoscandidatos2018/fotos_tratadas/nophoto.png"
            }
            arrayRespostasUsuario={arrayRespostasUsuario}
            email={candidato.email}
            reeleicao={candidato.reeleicao === "0" ? false : true}
            reeleito={
              candidato.reeleicao === "1" && activeTab === "eleitos"
                ? true
                : false
            }
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

    const listaSelectReeleicao = opcoesFiltroReeleicao().map(opcao => (
      <option key={opcao.label} value={opcao.value}>
        {opcao.label}
      </option>
    ));

    const mostraPartido = (
      <div>
        {activeTab === "candidatos" &&
          filtro.reeleicao !== "1" && (
            <h5>
              Para esse partido,{" "}
              <strong className="strong">{totalResponderamPartido}</strong> de{" "}
              <strong className="strong">{totalRespostasPartido}</strong>{" "}
              candidatos responderam ao questionário.
            </h5>
          )}
        {activeTab === "candidatos" &&
          filtro.reeleicao === "1" && (
            <h5>
              Para esse partido,{" "}
              <strong className="strong">{totalResponderamAtuacao}</strong> de{" "}
              <strong className="strong">{totalCandAtuacao}</strong> candidatos
              que já tinham atuação na câmara responderam ao questionário.
            </h5>
          )}
        {activeTab === "eleitos" &&
          filtro.reeleicao === "1" && (
            <h5>
              Para esse partido,{" "}
              <strong className="strong">{totalReeleitosEResponderam}</strong>{" "}
              dos <strong className="strong">{totalCandAtuacao}</strong>{" "}
              candidatos eleitos que já tinham atuação na câmara responderam ao
              questionário.
            </h5>
          )}
        {activeTab === "eleitos" &&
          filtro.reeleicao !== "1" && (
            <h5>
              Para esse partido,{" "}
              <strong className="strong">{totalEleitosEResponderam}</strong> dos{" "}
              <strong className="strong">{candidatosFiltrados.length}</strong>{" "}
              candidatos eleitos responderam ao questionário.
            </h5>
          )}
      </div>
    );

    const mostraEstado = (
      <div>
        {activeTab === "candidatos" &&
          filtro.reeleicao !== "1" && (
            <h5>
              Nesse Estado,{" "}
              <strong className="strong">{totalResponderamEstado}</strong> de{" "}
              <strong className="strong">{totalRespostasEstado}</strong>{" "}
              candidatos responderam ao questionário.
            </h5>
          )}
        {activeTab === "candidatos" &&
          filtro.reeleicao === "1" && (
            <h5>
              Nesse Estado,{" "}
              <strong className="strong">{totalResponderamAtuacao}</strong> de{" "}
              <strong className="strong">{totalCandAtuacao}</strong> candidatos
              que já tinham atuação na câmara responderam ao questionário.
            </h5>
          )}
        {activeTab === "eleitos" &&
          filtro.estado !== "TODOS" &&
          filtro.reeleicao !== "1" && (
            <h5>
              Nesse Estado,{" "}
              <strong className="strong">{eleitosResponderam}</strong> dos{" "}
              <strong className="strong">{totalEleitosEstado}</strong>{" "}
              candidatos eleitos responderam ao questionário.
            </h5>
          )}
        {activeTab === "eleitos" &&
          filtro.estado === "TODOS" &&
          filtro.reeleicao !== "1" && (
            <h5>
              {" "}
              <strong className="strong">{eleitosResponderam}</strong> dos{" "}
              <strong className="strong">{totalEleitosEstado}</strong>{" "}
              candidatos eleitos responderam ao questionário.
            </h5>
          )}
        {activeTab === "eleitos" &&
          filtro.estado === "TODOS" &&
          filtro.reeleicao === "1" && (
            <h5>
              {" "}
              <strong className="strong">
                {totalResponderamAtuacao}
              </strong> dos{" "}
              <strong className="strong">{totalCandAtuacao}</strong> candidatos
              eleitos que já tinham atuação na câmara responderam ao
              questionário.
            </h5>
          )}
        {activeTab === "eleitos" &&
          filtro.estado !== "TODOS" &&
          filtro.reeleicao === "1" && (
            <h5>
              {" "}
              Nesse Estado,{" "}
              <strong className="strong">
                {totalResponderamAtuacao}
              </strong> dos{" "}
              <strong className="strong">{totalCandAtuacao}</strong> candidatos
              eleitos que já tinham atuação na câmara responderam ao
              questionário.
            </h5>
          )}
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
              <a
                className={classnames("nav-link nav-link-a", {
                  active: activeTab === "eleitos"
                })}
                onClick={() => {
                  this.setActiveTab("eleitos");
                }}
              >
                Eleitos/as
              </a>
            </li>
            {filtro.estado !== "TODOS" && (
              <li className="nav-item">
                <a
                  className={classnames("nav-link nav-link-a", {
                    active: activeTab === "candidatos"
                  })}
                  onClick={() => {
                    this.setActiveTab("candidatos");
                  }}
                >
                  Candidatos/as
                </a>
              </li>
            )}
          </ul>
        </div>
        <div className="container">
          <header className="panel-header">
            <div className="form-row">
              <div className="col-6">
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
              <div className="col-6">
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
              <div className="col-md-6">
                <div class="form-group form-check">
                  <input
                    id="reeleitos"
                    type="checkbox"
                    className="form-check-input"
                    onChange={this.buscaReeleitos}
                    defaultChecked={filtro.reeleicao === "1" ? true : false}
                  />
                  <label className="form-check-label" for="reeleitos">
                    {listaSelectReeleicao}
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div class="form-group form-check">
                  <input
                    id="responderam"
                    type="checkbox"
                    className="form-check-input"
                    onChange={this.buscaRespondeu}
                    defaultChecked={filtro.respondeu === "1" ? true : false}
                  />
                  <label className="form-check-label" for="responderam">
                    responderam o questionário
                  </label>
                </div>
              </div>
            </div>

            {filtro.partido !== "Partidos" ? mostraPartido : mostraEstado}
          </header>

          {isCarregando || this.state.isPesquisando || isFiltrandoPorNome ? (
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
              {!isFiltrandoPorNome ? (
                <div className="candidatos-pagination d-flex justify-content-center flex-wrap mb-3">
                  {paginacao.inicio !== 0 ? btnFirst : null}
                  {paginacao.inicio > 0 ? btnMenosCandidatos : null}
                  {paginacao.final < paginacao.totalCandidatos
                    ? btnMaisCandidatos
                    : null}
                </div>
              ) : null}
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
  setPaginacao: PropTypes.func.isRequired,
  getProximaPaginaCandidatos: PropTypes.func.isRequired,
  setActiveTab: PropTypes.func.isRequired
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
    setPaginacao,
    getProximaPaginaCandidatos,
    setActiveTab
  }
)(CandidatosContainer);
