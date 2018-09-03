import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import TabelaPerguntas from "./tabelaPerguntas/TabelaPerguntas";

import { getDadosCandidato } from "../../actions/candidatosActions";
import isEmpty from "../../validation/is-empty";

import "./CompareContainer.css";

class CompareContainer extends Component {
  render() {
    const { dadosCandidato } = this.props.candidatos;
    console.log(dadosCandidato);

    return (
      <div className="container">
        <h4 className="compare-title text-center">
          Calculamos um match eleitoral de{" "}
          <strong className="strong">(score)</strong> entre você e{" "}
          {dadosCandidato.nome_exibicao}
        </h4>
        <div className="my-3">
          <Link to="/" className="btn btn-link">
            <span className="icon-back" /> Voltar para o quiz
          </Link>
        </div>
        <div className="row">
          <div className="col-md-3">
            <div className="compare-person-profile row no-gutters">
              <div className="col-4">
                <img
                  src={
                    "https://s3-sa-east-1.amazonaws.com/fotoscandidatos2018/fotos_tratadas/img_" +
                    dadosCandidato.cpf +
                    ".jpg"
                  }
                  alt={dadosCandidato.nome_exibicao}
                  width="100%"
                  className="person-img"
                />
              </div>
              <div className="col-8">
                <div className="compare-person-data">
                  <h3 className="compare-person-name">
                    {dadosCandidato.nome_exibicao}
                  </h3>
                  <p>
                    {dadosCandidato.sg_partido}/{dadosCandidato.uf}
                  </p>
                </div>
              </div>
            </div>
            <h4 className="compare-title">
              Como vocês <strong className="strong">votaram</strong> nos temas:
            </h4>
          </div>
          <div className="col-md-9">
            {this.props.candidatos.isCarregando ||
              isEmpty(dadosCandidato) ? null : (
                <TabelaPerguntas
                  respostas={dadosCandidato.respostas}
                  nome={dadosCandidato.nome_exibicao}
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
    const { candidato } = this.props.match.params;
    const cand = this.props.getDadosCandidato(candidato);
  }
}

TabelaPerguntas.propTypes = {
  getDadosCandidato: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  candidatos: state.candidatosReducer
});

export default connect(
  mapStateToProps,
  { getDadosCandidato }
)(CompareContainer);
