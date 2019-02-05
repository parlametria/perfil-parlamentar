import React, { Component } from "react";

class Sobre extends Component {
  render() {
    return (
      <div>
        <div className="container">
          <section className="intro">
            <h2 className="intro-title text-center">
              Voz ativa quer auxiliar a sua{" "}
              <strong className="strong">decisão de voto</strong> a partir de
              temas de fundamental importância para o Brasil.
            </h2>
          </section>
          <section className="section">
            <div className="row">
              <div className="col-md-6 col-lg-5">
                <h4 className="footer-title">Quem somos?</h4>
                <p>
                  A plataforma Voz Ativa foi construída a partir de questões
                  formuladas pela Rede de Advocacy, um coletivo de 30
                  Organizações da Sociedade Civil que atuam nos temas de
                  direitos humanos, integridade e transparência,
                  meio-ambiente/clima e negócios de impacto para uma nova
                  economia. O nosso foco principal é auxiliar os eleitores na
                  sua decisão de voto a partir de temas de fundamental
                  importância para o Brasil.
                </p>
              </div>
              <div className="col-md-6 col-lg-4">
                <h4 className="footer-title">O que é uma Rede Advocacy?</h4>
                <p>
                Somos uma rede de 30 organizações da sociedade civil que atuam de forma colaborativa para inovar a participação da sociedade no processo de elaboração de políticas públicas no Brasil.
                </p>
              </div>
              <div className="col-md col-lg-3">
                <p>
                  <strong className="strong">
                    Voz ativa pode te ajudar a monitorar a coerência do seu
                    candidato
                  </strong>
                  . Após a eleição, o eleitor poderá acessar a nossa base para
                  saber se o candidato eleito está agindo de acordo com suas
                  respostas ou não.
                </p>
              </div>
            </div>
          </section>
          <section className="section">
            <h4 className="footer-title">Como funciona?</h4>
            <div className="row">
              <div className="col-md-6">
                <img
                  src={require("../../data/img/howto01.jpg")}
                  alt="Como funciona"
                  width="100%"
                />
              </div>
              <div className="col-md-6">
                <img
                  src={require("../../data/img/howto02.jpg")}
                  alt="Como funciona"
                  width="100%"
                />
              </div>
              <div className="col-md-12">
              Nosso código é aberto! Para saber mais sobre como funcionamos você pode consulta-lo em {"   "}<a href= "https://github.com/analytics-ufcg/voz-ativa">  github.com/analytics-ufcg/voz-ativa</a>
              </div>
            </div>
          </section>
        </div>
        <div className="section-inverse">
          <div className="container">
            <div className="d-flex justify-content-center">
              <h4 className="footer-title float-title">
                Porque somos importantes?
              </h4>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="row no-gutters">
                  <div className="col-md-6">
                    <p className="featured-box">
                      As redes sociais estão inundadas de fake news.
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="featured-box">
                      São quase 26 mil candidatos divididos em 35 partidos.
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="featured-box">
                      Apenas para a Câmara dos Deputados serão mais de oito mil
                      candidaturas.
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="featured-box">
                      Muitas delas de parlamentares que tentam a reeleição.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="featured">
                  <div className="row no-gutters">
                    <div className="col-md-6">
                      <img
                        src={require("../../data/img/people.png")}
                        alt="Ícones representando candidatos destacando nove entre dez"
                        width="100%"
                      />
                    </div>
                    <div className="col-md-6">
                      <p className="highlight-box">
                        Nove em cada 10 deputados querem permanecer no
                        Legislativo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="intro">
          <div className="container">
            <div className="d-flex justify-content-center">
              <h4 className="footer-title">Parceiros</h4>
            </div>

            <div className="row">
              <div className="col-md-4">
                <ul className="ul">
                  <li>Cidade Escola Aprendiz</li>
                  <li>ClimaInfo</li>
                  <li>Conectas</li>
                  <li>Engajamundo</li>
                  <li>Fundación Avina</li>
                  <li>GIFE</li>
                </ul>
              </div>
              <div className="col-md-4">
                <ul className="ul">
                  <li>ICE</li>
                  <li>Idesam</li>
                  <li>Impact Hub</li>
                  <li>Inesc</li>
                  <li>InPacto</li>
                  <li>Instituto Clima e Sociedade</li>
                </ul>
              </div>
              <div className="col-md-4">
                <ul className="ul">
                  <li>Instituto Ethos</li>
                  <li>Instituto Terroá </li>
                  <li>Observatório do Clima</li>
                  <li>Sistema B</li>
                  <li>Transparência Internacional </li>
                  <li>Update Politics </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Sobre;
