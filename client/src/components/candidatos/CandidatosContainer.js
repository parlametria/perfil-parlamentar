import React, { Component } from "react";
import Candidato from "./Candidato";

import { connect } from "react-redux";

import { Collapse, Button, CardBody, Card } from "reactstrap";
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

import "../../styles/style.css";

import { Subject } from "rxjs/Subject";
import { debounceTime } from "rxjs/operators";

import "rxjs/add/operator/debounceTime";

import {
  TAM_PAGINA,
  MIN_VOTOS,
  DEBOUNCE_TIME
} from "../../constantes/constantesCandidatos";

import { opcoesFiltroReeleicao, opcoesFiltroTemas } from "../../constantes/filtrosSeletoresCandidatos";

import classnames from "classnames";

// Import função de estado
import { estados } from "../../constantes/filtrosSeletoresCandidatos";

class CandidatosContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      debounced: "",
      isPesquisando: false,
      collapse: false
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
    this.filtraPorTema = this.filtraPorTema.bind(this);
    this.toggle = this.toggle.bind(this);
    this.selecionaEstado = this.selecionaEstado.bind(this);
  }

  setActiveTab(e) {
    this.props.setActiveTab(e);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  pegaPrimeiraPagina() {
    const { totalCandidatos, paginaAtualAPI } = this.props.candidatos.paginacao;

    const paginacao = {
      inicio: 0,
      final: TAM_PAGINA,
      totalCandidatos: totalCandidatos,
      paginaAtual: 1,
      paginaAtualAPI
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
        paginaAtual: paginacao.paginaAtual - 1,
        paginaAtualAPI: paginacao.paginaAtualAPI
      };
      this.props.setPaginacao(novaPaginacao);
    }
  }

  pegaProximosCandidatos() {
    const { paginacao, candidatosRanqueados } = this.props.candidatos;

    //this.props.getProximaPaginaCandidatos();

    // Se a paginação estiver navegando dentro dos candidatos que já foram pegos da API
    if (paginacao.final + TAM_PAGINA <= candidatosRanqueados.length) {
      const novaPaginacao = {
        inicio: paginacao.final,
        final: paginacao.final + TAM_PAGINA,
        totalCandidatos: paginacao.totalCandidatos,
        paginaAtualAPI: paginacao.paginaAtualAPI,
        paginaAtual: paginacao.paginaAtual + 1
      };
      this.props.setPaginacao(novaPaginacao);
    }
    // Se a paginação precisar de mais gente, faz uma chamada à API.
    else if (paginacao.final + TAM_PAGINA <= paginacao.totalCandidatos) {
      const novaPaginacao = {
        inicio: paginacao.final,
        final: paginacao.final + TAM_PAGINA,
        totalCandidatos: paginacao.totalCandidatos,
        paginaAtualAPI: paginacao.paginaAtualAPI + 1,
        paginaAtual: paginacao.paginaAtual + 1
      };
      this.props.setPaginacao(novaPaginacao);
      this.props.getProximaPaginaCandidatos();
    }
    // Chegamos na última página e verificamos se ainda existem itens sobrando (Trata casos quando a última página é menor que a quantidade de itens nela)
    else if (
      paginacao.final + (paginacao.totalCandidatos % TAM_PAGINA) <=
      paginacao.totalCandidatos
    ) {
      const novaPaginacao = {
        inicio: paginacao.final,
        final: paginacao.final + (paginacao.totalCandidatos % TAM_PAGINA),
        totalCandidatos: paginacao.totalCandidatos,
        paginaAtual: paginacao.paginaAtual,
        paginaAtualAPI: paginacao.paginaAtualAPI
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
      respondeu: filtro.respondeu,
      tema: filtro.tema
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
      respondeu: filtro.respondeu,
      tema: filtro.tema
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
      respondeu: filtro.respondeu,
      tema: filtro.tema
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
      respondeu: filtro.respondeu === "1" ? "-1" : "1",
      tema: filtro.tema
    };

    this.props.setFiltroCandidatos(novoFiltro);
    this.props.setCandidatosFiltrados();
  }

  filtraPorTema(e) {
    e.preventDefault();

    const { filtro } = this.props.candidatos;

    let novoFiltro = {
      nome: filtro.nome,
      partido: filtro.partido,
      estado: filtro.estado,
      reeleicao: filtro.reeleicao,
      respondeu: filtro.respondeu,
      tema: e.target.value
    };

    this.props.setFiltroCandidatos(novoFiltro);
    this.props.setCandidatosFiltrados();
    this.props.calculaScore();
  }

  selecionaEstado(e) {
    e.preventDefault();

    const { filtro } = this.props.candidatos;

    let novoFiltro = {
      nome: filtro.nome,
      partido: filtro.partido,
      estado: e.target.value,
      reeleicao: filtro.reeleicao,
      respondeu: filtro.respondeu,
      tema: filtro.tema
    };

    if (novoFiltro.estado === "TODOS") {
      this.props.setActiveTab("eleitos");
    }

    this.props.setFiltroCandidatos(novoFiltro);
    this.props.getDadosCandidatos();
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
      totalEleitosEstado,
      isCarregando,
      isFiltrandoPorNome,
      mostrarTodos,
      partidos,
      activeTab
    } = this.props.candidatos;

    const isVotacoesCarregando = this.props.votacoes.isCarregando;
    const { votacoesCandidatos } = this.props.votacoes;

    const {
      filtro,
      candidatosFiltrados,
      candidatosRanqueados
    } = this.props.candidatos;

    const { paginacao } = this.props.candidatos;

    const { respostasUsuario, quantidadeVotos } = this.props.usuario;

    const { abaAtiva } = this.props.questionario;

    const candidatosMapeaveis =
      filtro.nome !== "" ||
        filtro.partido !== "Partidos" ||
        filtro.reeleicao !== "-1" ||
        filtro.respondeu !== "-1" ||
        filtro.estado !== "TODOS"
        ? candidatosFiltrados
        : candidatosRanqueados;

    let totalCandAtuacao = 0;
        
    const candidatos = candidatosMapeaveis.map(cpf => {
      const candidato = dadosCandidatos[cpf];

      if (!isEmpty(candidato)) {
        if (candidato.reeleicao === "1") totalCandAtuacao++;
        return (
          <Candidato
            respondeu={candidato.respondeu}
            key={candidato.cpf}
            id={candidato.cpf}
            nome={candidato.nome_urna}
            siglaPartido={candidato.sg_partido}
            estado={candidato.uf}
            score={scoreCandidatos[candidato.cpf]}            
            foto={
              candidato.tem_foto
                ? "https://s3-sa-east-1.amazonaws.com/fotoscandidatos2018/fotos_tratadas/img_" +
                candidato.cpf +
                ".jpg"
                : "https://s3-sa-east-1.amazonaws.com/fotoscandidatos2018/fotos_tratadas/nophoto.png"
            }
            respostasUsuario={respostasUsuario}
            email={candidato.email}
            reeleicao={candidato.reeleicao === "0" ? false : true}
            reeleito={
              candidato.reeleicao === "1" && activeTab === "eleitos"
                ? true
                : false
            }
            eleito={candidato.eleito}
            temHistorico={votacoesCandidatos[candidato.cpf] !== undefined}
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

    const listaSelectTemas = (
      opcoesFiltroTemas().map(tema => (
        < option key={tema.tema} value={tema.tema} >
          {tema.titulo}
        </option >
      ))
    );


    const listaSelectReeleicao = opcoesFiltroReeleicao().map(opcao => (
      <option key={opcao.label} value={opcao.value}>
        {opcao.label}
      </option>
    ));

    const mostraPartido = (
      <div>
        {activeTab === "eleitos" && (
          <h5>
            Para esse partido,{" "}
            <strong className="strong">{totalCandAtuacao}</strong> dos{" "}
            <strong className="strong">{candidatosFiltrados.length}</strong>{" "}
            deputados/as tem atuação anterior na câmara.
          </h5>
        )}
      </div>
    );

    const mostraEstado = (
      <div>
        {activeTab === "eleitos" &&
          abaAtiva === "Votacoes" &&
          filtro.estado !== "TODOS" && (
            <h5>
              Nesse Estado,{" "}
              <strong className="strong">{totalCandAtuacao}</strong> dos{" "}
              <strong className="strong">{totalEleitosEstado}</strong>{" "}
              deputados/as tem atuação anterior na câmara.
            </h5>
          )}

        {activeTab === "eleitos" &&
          abaAtiva === "Votacoes" &&
          filtro.estado === "TODOS" && (
            <h5>
              {" "}
              <strong className="strong">{totalCandAtuacao}</strong> dos{" "}
              <strong className="strong">{totalEleitosEstado}</strong>{" "}
              deputados/as tem atuação anterior na câmara.
            </h5>
          )}
      </div >
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
                Deputados/as
              </a>
            </li>
          </ul>
        </div>
        <div className="container">
          <header className="panel-header">
            <div className="form-row">
              <div className="col-1" style={{ marginRight: "1.5em" }}>
                <Button color="primary" onClick={this.toggle}>
                  <span className="fas fa-filter" />
                </Button>
              </div>
              <div className="col-10">
                {filtro.partido !== "Partidos" ? mostraPartido : mostraEstado}
              </div>
              <div>
                <Collapse isOpen={this.state.collapse}>
                  <Card>
                    <CardBody>
                      <div className="form-row">
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
                            placeholder="Pesquisar deputado/a..."
                            aria-label="Pesquisar deputado/a"
                            aria-describedby="search-candidate"
                            onChange={this.buscaNome}
                            value={filtro.nome}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-4">
                          <select
                            className="form-control form-control-secondary barra-filtro-candidato"
                            onChange={this.selecionaEstado}
                            value={filtro.estado}
                          >
                            <option defaultValue="--">Estados</option>
                            {estados()}
                          </select>
                        </div>
                        <div className="form-group col-4">
                          <select
                            className="form-control form-control-secondary barra-filtro-candidato"
                            placeholder="Partidos"
                            onChange={this.buscaPartido}
                            value={filtro.partido}
                          >
                            {listaSelectPartidos}
                          </select>
                        </div>
                        <div className="form-group col-4">
                          <select
                            className="form-control form-control-secondary barra-filtro-candidato"
                            placeholder="Temas"
                            onChange={this.filtraPorTema}
                            value={filtro.tema}
                          >
                            {listaSelectTemas}
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="col-md-6">
                          <div className="form-group form-check">
                            <input
                              id="reeleitos"
                              type="checkbox"
                              className="form-check-input"
                              onChange={this.buscaReeleitos}
                              checked={filtro.reeleicao === "1" ? true : false}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="reeleitos"
                            >
                              {listaSelectReeleicao}
                            </label>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Collapse>
              </div>
            </div>
          </header>

          {isCarregando ||
            isVotacoesCarregando ||
            this.state.isPesquisando ||
            isFiltrandoPorNome ? (
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
          {isExibeCandidatos && exibeCandidatos}
          {isExibeContinueVotando && <ContinueVotando />}
          {isExibeBoasVindas && <BoasVindas />}
        </FlipMove>
      </div>
    );
  }

  componentDidMount() {
    this.subscription = this.onSearch$
      .pipe(debounceTime(DEBOUNCE_TIME))
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
  usuario: state.usuarioReducer,
  votacoes: state.votacoesReducer,
  questionario: state.questionarioReducer
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
