import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { criaURL } from "../../constantes/tratamentoUrls";
import { getScoreWidth, getScoreLabel } from "../../utils/scoreValueFunctions";

import "./candidato.css";

class Candidato extends Component {
  render() {
    const badgeNaoRespondeu = (
      <span className="badge badge-secondary">não respondeu</span>
    );

    const badgeNaoTemVotacoes = (
      <span style={{ marginLeft: "5px" }}
        className="badge badge-light">não atuou</span>
    );

    const verAtuacao = (
      <Link
        className="btn btn-outline-primary btn-sm"
        to={
          "compare/" +
          this.props.id +
          "/" +
          criaURL(this.props.respostasUsuario) +
          "/true"
        }
      >
        ver atuação
      </Link>
    );

    const filtraComissoes = (comissoes) => {
      let comissoes_suplente = comissoes.
        filter(comissao => comissao.cargo === "Suplente").
        length;

      let comissoes_filtradas = comissoes.
        filter(comissao => comissao.cargo !== "Suplente");

      if (comissoes_suplente > 0) {
        let outras_comissoes = {
          comissao_id: "0",
          cargo: "",
          info_comissao: {
            sigla: "+ " + comissoes_suplente,
            nome: comissoes_suplente == 1 ? 
            "O/A parlamentar é suplente em " + comissoes_suplente + " comissão." : 
            "O/A parlamentar é suplente em " + comissoes_suplente + " comissões."
          }
        }
        comissoes_filtradas.push(outras_comissoes);
      }
      return (comissoes_filtradas);
    };

    const naoRespondeu = (
      <div>
        <div>
          {this.props.eleito && this.props.temHistorico && verAtuacao}
        </div>
      </div>
    );

    const tooltip = (
      <Tooltip>Não existem respostas suficientes para o cálculo preciso do alinhamento</Tooltip>
    );

    const TitularComissao = (props) => (
      <OverlayTrigger
        overlay={
          <Tooltip> {props.comissao.comissao_id === "0" ?
            props.comissao.info_comissao.nome :
            props.comissao.cargo + ' na ' + props.comissao.info_comissao.nome}
          </Tooltip>}>
        <span style={{ marginRight: "5px" }} className="badge badge-success suplente">
          {props.comissao.info_comissao.sigla}
        </span>
      </OverlayTrigger>
    );

    const barraScore = (
      <div>
        <div className="score-progress">
          <div className="progress" style={{ height: "15px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: Math.round(getScoreWidth(this.props.score) * 100) + "%"
              }}
              aria-valuenow={getScoreWidth(this.props.score) * 100}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <div className="score-number">
            {getScoreLabel(this.props.score) === "--" ?
              <OverlayTrigger
                overlay={tooltip}>
                <span className="score">{getScoreLabel(this.props.score)}</span>
              </OverlayTrigger> :
              <span className="score">{getScoreLabel(this.props.score)}</span>
            }
          </div>
        </div>
        {this.props.eleito && this.props.temHistorico && verAtuacao}
      </div>
    );
    return (
      <div>
        <div className="person mb-4">
          <div className="row no-gutters">
            <div className="col-2">
              <Link
                className="person-link"
                to={
                  "compare/" +
                  this.props.id +
                  "/" +
                  criaURL(this.props.respostasUsuario)
                }
              >
                <img
                  src={this.props.foto}
                  alt="Candidata da Silva"
                  width="100%"
                  className="person-img"
                />
              </Link>
            </div>
            <div className="col-10">
              <div className="person-data">
                <h5 className="person-name">{this.props.nome}</h5>
                <div>
                  {this.props.siglaPartido}/{this.props.estado}
                  {this.props.reeleicao && !this.props.reeleito && (
                    <span
                      style={{
                        marginLeft: "5px"
                      }}
                      className="badge badge-success"
                    >
                      reeleição
                    </span>
                  )}
                  {this.props.reeleito && (
                    <span
                      style={{
                        marginLeft: "5px"
                      }}
                      className="badge badge-secondary"
                    >
                      reeleito/a
                    </span>
                  )}
                  {!this.props.temHistorico && badgeNaoTemVotacoes}
                </div>
                <div className="pb-1">
                  {filtraComissoes(this.props.comissoes).
                    map(comissao =>
                      <TitularComissao key={comissao.comissao_id} comissao={comissao} />
                    )}
                  {this.props.temHistorico
                    ? barraScore
                    : naoRespondeu}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Candidato.propTypes = {
  respondeu: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  nome: PropTypes.string.isRequired,
  siglaPartido: PropTypes.string.isRequired,
  estado: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  foto: PropTypes.string.isRequired,
  respostasUsuario: PropTypes.instanceOf(Object),
  email: PropTypes.string.isRequired,
  eleito: PropTypes.bool.isRequired,
  comissoes: PropTypes.instanceOf(Object)
};

export default Candidato;
