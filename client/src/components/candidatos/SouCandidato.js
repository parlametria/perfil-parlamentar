import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./soucandidato.css";


class SouCandidato extends Component {
  constructor(props) {
    super(props);

    this.candidato = undefined;

    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    console.log('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    let candidato;
    return (
      <div className="container">
        <section className="intro-candidato">
          <div className="container">
            <h2 className="intro-title text-center">
              É candidato e quer participar?
          </h2>
            <div className="my-3">
              <Link to="/" className="btn btn-link">
                <span className="icon-back" /> Voltar para o quiz
          </Link>
            </div>
          </div>
        </section>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control form-control-secondary"
            placeholder="Pesquisar CPF do/a candidato/a"
            aria-label="Pesquisar CPF do/a candidato/a"
            aria-describedby="search-candidate"
          //onChange={this.buscaNome}
          //value={this.state.filtro.nome}
          />
        </div>

        <div className="container">
          <section className="sou-candidato">
            <div className="grid-wrapper">
              <div className="grid-main">
                <section className="grid-panel panel-master">
                  <div>
                    Se você é um candidato e por algum motivo não recebeu o nosso e-mail entre em contato conosco
                <a href="mailto:'contato@vozativa.org'"
                      target="_blank"> através de uma mensagem.</a>
                  </div>
                </section>
                <div className="grid-separator" />
                <section className="grid-panel panel-detail">
                  {candidato = this.candidato ? (this.candidato) : (
                    <div>
                      Pesquise pelo seu cpf
                    </div>
                  )}
                </section>
              </div>

            </div>
          </section>
        </div>
      </div>

    )
  }
}

export default SouCandidato;