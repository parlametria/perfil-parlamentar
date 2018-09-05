import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import "./candidato.css";

class Candidato extends Component {
  criaURL(arrayVotos) {
    let urlVotos = "";
    arrayVotos.forEach(voto => {
      urlVotos = urlVotos + voto;
    });
    return urlVotos;
  }

  render() {
    const naoRespondeu = (
      <div>
        <div className="score-progress">
          <div className="progress progress-none" style={{ height: "15px" }}>
            Não respondeu
          </div>
          <div className="score-number text-center">
            <span className="score">--</span>
          </div>
        </div>
        <a
          className="person-link"
          href={
            "mailto:" +
            this.props.email.toLowerCase() +
            "?subject=Responda o questionário do Voz Ativa" +
            "&body=Prezado/a " +
            this.props.nome +
            "," +
            "%0D%0A" +
            "%0D%0A" +
            "A Plataforma Voz Ativa te convida a participar " +
            "de um projeto inovador de democracia digital e " +
            "colaborativa, aliando ciência de dados e " +
            "inteligência regulatória. Somos uma rede " +
            "formada por mais de 60 organizações " +
            "não-governamentais que pretendem oferecer " +
            "aos eleitores e eleitoras informações confiáveis " +
            "sobre as candidaturas à Câmara dos Deputados. " +
            "%0D%0A" +
            "%0D%0A" +
            "Para que sua trajetória e propostas estejam mais " +
            "acessíveis ao eleitorado, pedimos que você " +
            "preencha o questionário contido nesta " +
            "plataforma e que contempla quatro eixos de " +
            "debate: Meio Ambiente, Direitos Humanos, " +
            "Integridade e Transparência, e Nova Economia. " +
            "As suas respostas estarão disponíveis para " +
            "eleitores e eleitoras interessados/das em tomar " +
            "a decisão de voto a partir de temas de " +
            "fundamental importância para o Brasil. " +
            "%0D%0A" +
            "%0D%0A" +
            "Agradecemos sua participação!"
          }
        >
          Cobre a participação
        </a>
      </div>
    );
    const barraScore = (
      <div>
        <div className="score-progress">
          <div className="progress" style={{ height: "15px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: Math.round(this.props.score * 100) + "%"
              }}
              aria-valuenow={this.props.score * 100}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <div className="score-number">
            <span className="score">{Math.round(this.props.score * 100)}%</span>
          </div>
        </div>
        <Link
          className="person-link"
          to={
            "compare/" +
            this.props.id +
            "/" +
            this.criaURL(this.props.arrayRespostasUsuario)
          }
        >
          Compare
        </Link>
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
                  this.criaURL(this.props.arrayRespostasUsuario)
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
                <h5 className="person-name">{this.props.nome} </h5>
                <div>
                  {this.props.siglaPartido}/{this.props.estado}
                </div>
                {this.props.respondeu ? barraScore : naoRespondeu}
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
  respostas: PropTypes.any.isRequired,
  foto: PropTypes.string.isRequired,
  arrayRespostasUsuario: PropTypes.array.isRequired,
  email: PropTypes.string.isRequired
};

export default Candidato;
