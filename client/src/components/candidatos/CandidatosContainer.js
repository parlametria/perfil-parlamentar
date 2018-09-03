import React, { Component } from "react";
import Candidato from "./Candidato";

import { connect } from "react-redux";

import FlipMove from "react-flip-move";

import { estados, partidos } from "../../constantes/filtrosSeletoresCandidatos";
import isEmpty from "../../validation/is-empty";

import {
  calculaScore,
  getTopNCandidatos,
  getDadosCandidatos,
  setFiltroCandidatos
} from "../../actions/candidatosActions";

import PropTypes from "prop-types";
import Spinner from "../common/Spinner";

import Apresentacao from "./apresentacao";

import "../../styles/style.css";

import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import "rxjs/add/observable/of";
import "rxjs/add/observable/fromPromise";

import "rxjs/add/operator/catch";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";

const NUM_CANDIDATOS = 10;
const MAX_CAND_FILTRADOS = 20;
const DEBOUNCE_TIME = 500; //ms

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class CandidatosContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scoreCandidatos: {},
      candidatosRanking: [],
      candidatosFiltrados: [],
      filtro: { nome: "", partido: "TODOS", estado: "" },
      partidos: [],
      debounced: "",
      isPesquisando: false
    };

    this.onSearch$ = new Subject();
    this.buscaNome = this.buscaNome.bind(this);
    this.buscaPartido = this.buscaPartido.bind(this);
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
  }

  render() {
    // Inviável fazer no front, tem que fazer nas funções de nuvens.
    const { dadosCandidatos, scoreCandidatos, numResponderam, numSemResposta } = this.props.candidatos;

    let candidatosMapeaveis;
    let numRepPartido = 0; 
    let numNaoRepPartido = 0;
    
    if (
      this.state.filtro.nome !== "" &&
      this.state.filtro.partido !== "TODOS"
    ) {
      candidatosMapeaveis = this.state.candidatosFiltrados.filter(
        cpf => dadosCandidatos[cpf].sg_partido === this.state.filtro.partido
      );
    } else if (this.state.filtro.partido !== "TODOS") {
      let cpfs = Object.keys(dadosCandidatos);
      candidatosMapeaveis = cpfs
        .filter(
          cpf => dadosCandidatos[cpf].sg_partido === this.state.filtro.partido
        )
        .sort((a, b) => {
          if (scoreCandidatos[a] > scoreCandidatos[b]) return -1;
          else if (scoreCandidatos[a] < scoreCandidatos[b]) return 1;
          else return 0;
        });
        candidatosMapeaveis.forEach(cpf => {
          if(dadosCandidatos[cpf].respostas["0"] === 0){
            numNaoRepPartido++
        }else{
            numRepPartido++
        }
        });
        
    } else if (this.state.filtro.nome !== "") {
      candidatosMapeaveis = this.state.candidatosFiltrados;
    } else {
      candidatosMapeaveis = this.state.candidatosRanking.map(cand => cand[0]);
    }

    const candidatos = candidatosMapeaveis.map(cpf => {    
    const candidato = this.props.candidatos.dadosCandidatos[cpf];

      if (!isEmpty(candidato)) {
        return (
          <Candidato
            key={candidato.cpf}
            nome={candidato.nome_urna}
            siglaPartido={candidato.sg_partido}
            estado={candidato.uf}
            score={this.state.scoreCandidatos[candidato.cpf]}
            respostas={candidato.respostas}
            foto= {candidato.tem_foto ?
              "https://s3-sa-east-1.amazonaws.com/fotoscandidatos2018/fotos_tratadas/img_" +
              candidato.cpf +
              ".jpg" : "http://pontosdevista.pt/static/uploads/2016/05/sem-fotoABC.jpg"
            }
          />
        );
      }
      return null;
    });

    return (
      <div>
        <div className="panel-master-header">
          <ul className="nav nav-tabs nav-tabs-secondary">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                Candidatos
              </a>
            </li>
          </ul>
        </div>
        <div className="container">
          <header className="panel-header">
            {false ? <Apresentacao /> : null}
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
                placeholder="Pesquisar candidato..."
                aria-label="Pesquisar candidato"
                aria-describedby="search-candidate"
                onChange={this.buscaNome}
                value={this.state.filtro.nome}
              />
              <select
                className="form-control barra-filtro-candidato"
                placeholder="Partidos"
                onChange={this.buscaPartido}
                value={this.state.filtro.partido}
              >
                {this.state.partidos}
              </select>
            </div>
            <div>
             Nesse estado {numResponderam} candidatos responderam ao questionário, de um total de {numResponderam + numSemResposta} candidatos. 
            </div>

          {this.state.filtro.partido !== "TODOS" ? <div>
             Para esse partido {numRepPartido} candidatos responderam ao questionário, de um total de {numRepPartido + numNaoRepPartido} candidatos. 
            </div>:null}
            
          </header>

          {this.props.candidatos.isCarregando || this.state.isPesquisando ? (
            <div style={{ paddingTop: "30vh" }}>
              <Spinner />
            </div>
          ) : (
            <div className="candidatos">
              <FlipMove>{candidatos}</FlipMove>
            </div>
          )}
        </div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.candidatos.scoreCandidatos) {
      let partidosSet = new Set();
      const { dadosCandidatos } = nextProps.candidatos;

      partidosSet.add("TODOS");
      Object.keys(dadosCandidatos).forEach(candidato =>
        partidosSet.add(dadosCandidatos[candidato].sg_partido)
      );

      let partidos = Array.from(partidosSet).map(partido => (
        <option key={partido} value={partido}>
          {partido}
        </option>
      ));

      this.setState({
        scoreCandidatos: nextProps.candidatos.scoreCandidatos,
        candidatosRanking: nextProps.getTopNCandidatos(NUM_CANDIDATOS),
        partidos
      });
    }
  }

  componentDidMount() {
    this.subscription = this.onSearch$
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(debounced => {
        const { dadosCandidatos } = this.props.candidatos;

        let keys = Object.keys(dadosCandidatos);

        let nomesFiltrados = keys
          .filter(
            cpf =>
              dadosCandidatos[cpf].nome_urna
                .toLowerCase()
                .indexOf(debounced.toLowerCase()) >= 0
          )
          .slice(0, MAX_CAND_FILTRADOS);
        this.setState({
          debounced,
          candidatosFiltrados: nomesFiltrados,
          isPesquisando: false
        });
      });

    if (isEmpty(this.props.candidatos.dadosCandidatos)) {
      //this.props.calculaScore();
    } else {
      this.setState({
        scoreCandidatos: this.props.candidatos.scoreCandidatos,
        candidatosRanking: this.props.getTopNCandidatos(NUM_CANDIDATOS),
        filtro: this.props.candidatos.filtro
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
  setFiltroCandidatos: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  candidatos: state.candidatosReducer
});

export default connect(
  mapStateToProps,
  { calculaScore, getTopNCandidatos, getDadosCandidatos, setFiltroCandidatos }
)(CandidatosContainer);
