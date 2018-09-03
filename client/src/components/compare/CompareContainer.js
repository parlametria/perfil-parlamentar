import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import TabelaPerguntas from "./tabelaPerguntas/TabelaPerguntas";
import PontuacaoPorTema from "./pontuacaoPorTema/PontuacaoTema";

import {
  getDadosCandidato,
  calculaScorePorTema
} from "../../actions/candidatosActions";
import isEmpty from "../../validation/is-empty";

import "./CompareContainer.css";

class CompareContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { votos: "" };
  }

  getArrayUrl(url) {
    let arrayUrl = [];
    for (var i = 0; i < url.length; i++) {
      if (url[i] === "-") {
        arrayUrl.push(Number(url[i] + url[i + 1]));
        i++;
      } else {
        arrayUrl.push(Number(url[i]));
      }
    }
    return arrayUrl;
  }
  render() {
    const { dadosCandidato, scoreTema } = this.props.candidatos;

    if (!isEmpty(dadosCandidato)) {
      console.log(scoreTema);
    }

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
                    dadosCandidato.tem_foto
                      ? "https://s3-sa-east-1.amazonaws.com/fotoscandidatos2018/fotos_tratadas/img_" +
                        dadosCandidato.cpf +
                        ".jpg"
                      : "http://pontosdevista.pt/static/uploads/2016/05/sem-fotoABC.jpg"
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
            <div className="row">
              <div className="col-md-3">
                <PontuacaoPorTema scoreTema={scoreTema} />
              </div>
            </div>
          </div>
          <div className="col-md-9">
            {this.props.candidatos.isCarregando ||
            isEmpty(dadosCandidato) ? null : (
              <TabelaPerguntas
                respostas={dadosCandidato.respostas}
                nome={dadosCandidato.nome_exibicao}
                votos={this.getArrayUrl(this.state.votos)}
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
    const { candidato, votos } = this.props.match.params;
    const cand = this.props.getDadosCandidato(candidato);
    this.setState({ votos });
  }
}

TabelaPerguntas.propTypes = {
  getDadosCandidato: PropTypes.func.isRequired,
  calculaScorePorTema: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  candidatos: state.candidatosReducer
});

export default connect(
  mapStateToProps,
  { getDadosCandidato, calculaScorePorTema }
)(CompareContainer);
